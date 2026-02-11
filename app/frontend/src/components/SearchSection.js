import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useIsMobile } from '../hooks/useIsMobile';
import { t } from '../translations';
import { searchApi } from '../api/search';
import LoadingSpinner from './LoadingSpinner';
import { categories } from '../data/categories';
import { supabase } from '../lib/supabase';
import { getListingUrl } from '../utils/slug';

export const SearchSection = ({ searchTerm, setSearchTerm, selectedCategory, setSelectedCategory, location, setLocation, cartItems = [], cartCount = 0, showCart, setShowCart, removeFromCart, updateCartQuantity, followedSellers = [], favorites = [] }) => {
    const navigate = useNavigate();
    const { user, signOut } = useAuth();

    const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
    const [showLocationDropdown, setShowLocationDropdown] = useState(false);
    const [showDistanceDropdown, setShowDistanceDropdown] = useState(false);
    const [selectedDistance, setSelectedDistance] = useState('50 km');
    const [showMeinsDropdown, setShowMeinsDropdown] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const [userProfile, setUserProfile] = useState(null);
    const isMobile = useIsMobile();
    const [hoveredCategory, setHoveredCategory] = useState(null);
    const [recentSearches, setRecentSearches] = useState([]);
    const [showRecentSearches, setShowRecentSearches] = useState(false);
    const [isLocating, setIsLocating] = useState(false);
    const [suggestions, setSuggestions] = useState({ categories: [], listings: [] });
    const [isSearchingSuggestions, setIsSearchingSuggestions] = useState(false);
    const searchInputRef = useRef(null);
    const recentSearchesDropdownRef = useRef(null);

    const [inactiveCategories, setInactiveCategories] = useState(new Set());
    const locationObj = useLocation();

    const handleDetectLocation = () => {
        if (!navigator.geolocation) {
            alert('Tarayıcınız konum özelliğini desteklemiyor.');
            return;
        }

        setIsLocating(true);
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                try {
                    const { latitude, longitude } = position.coords;
                    const response = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10&addressdetails=1`,
                        {
                            headers: {
                                'User-Agent': 'ExVitrin/1.0'
                            }
                        }
                    );
                    const data = await response.json();
                    const city = data.address.city || data.address.town || data.address.village || data.address.province || data.address.state || 'Bilinmeyen Konum';
                    setLocation(city);
                    setShowLocationDropdown(false);
                } catch (error) {
                    console.error('Error reverse geocoding:', error);
                    alert('Konumunuz belirlenirken bir hata oluştu.');
                } finally {
                    setIsLocating(false);
                }
            },
            (error) => {
                console.error('Geolocation error:', error);
                alert('Konum izni verilmedi veya erişilemedi.');
                setIsLocating(false);
            },
            { timeout: 10000 }
        );
    };

    useEffect(() => {
        const savedSearches = localStorage.getItem('recentSearches');
        if (savedSearches) {
            try {
                setRecentSearches(JSON.parse(savedSearches));
            } catch (e) {
                console.error('Error parsing recent searches:', e);
            }
        }
    }, []);

    const saveRecentSearch = (term) => {
        if (!term || !term.trim()) return;
        const newTerm = term.trim();
        let currentList = [];
        const currentSaved = localStorage.getItem('recentSearches');
        if (currentSaved) {
            try {
                currentList = JSON.parse(currentSaved);
            } catch (e) { }
        }
        const updatedSearches = [newTerm, ...currentList.filter(s => s !== newTerm)].slice(0, 3);
        setRecentSearches(updatedSearches);
        localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
    };

    useEffect(() => {
        const fetchSuggestions = async () => {
            const queryTerm = searchTerm.trim();
            if (queryTerm.length < 2) {
                setSuggestions({ categories: [], listings: [] });
                return;
            }
            setIsSearchingSuggestions(true);
            try {
                // 1. Fetch from API
                const data = await searchApi.getSuggestions(queryTerm);

                // 2. Enhance with static categories
                const termLower = queryTerm.toLowerCase();
                const staticMatches = [];

                // Helper to search in static categories
                categories.forEach(cat => {
                    if (inactiveCategories.has(cat.name)) return;

                    if (cat.name.toLowerCase().includes(termLower) && cat.name !== 'Tüm Kategoriler') {
                        staticMatches.push(cat.name);
                    }
                    if (cat.subcategories) {
                        cat.subcategories.forEach(sub => {
                            if (inactiveCategories.has(sub.name)) return;
                            if (sub.name.toLowerCase().includes(termLower)) {
                                staticMatches.push(sub.name);
                            }
                        });
                    }
                });

                // Merge, unique, and filter out any "Tüm Kategoriler" or empty values
                const combined = [...new Set([...staticMatches, ...(data.categories || [])])]
                    .filter(c => c && c !== 'Tüm Kategoriler' && !inactiveCategories.has(c))
                    .slice(0, 3);

                setSuggestions({
                    categories: combined,
                    listings: data.listings || []
                });
            } catch (error) {
                console.error('Error in SearchSection suggestions:', error);
            } finally {
                setIsSearchingSuggestions(false);
            }
        };
        const debounceTimer = setTimeout(() => {
            fetchSuggestions();
        }, 300);
        return () => clearTimeout(debounceTimer);
    }, [searchTerm, inactiveCategories, categories]);


    useEffect(() => {
        const fetchInactiveCategories = async () => {
            try {
                const { data } = await supabase
                    .from('category_settings')
                    .select('category_name')
                    .eq('is_active', false);

                if (data) {
                    setInactiveCategories(new Set(data.map(item => item.category_name)));
                }
            } catch (error) {
                console.error('Error fetching inactive categories:', error);
            }
        };
        fetchInactiveCategories();
    }, [locationObj.pathname]); // Re-fetch on navigation

    useEffect(() => {
        const fetchProfile = async () => {
            if (user) {
                try {
                    const { fetchUserProfile } = await import('../api/profile');
                    const profile = await fetchUserProfile(user.id);
                    setUserProfile(profile);
                } catch (error) {
                    console.error('Error fetching user profile:', error);
                }
            }
        };
        fetchProfile();
    }, [user]);

    useEffect(() => {
        const fetchUnreadCount = async () => {
            if (user) {
                try {
                    const { getUnreadCount } = await import('../api/messages');
                    const count = await getUnreadCount();
                    setUnreadCount(count);
                } catch (error) {
                    console.error('Error fetching unread count:', error);
                }
            }
        };
        if (user) {
            fetchUnreadCount();
            const interval = setInterval(fetchUnreadCount, 30000);
            return () => clearInterval(interval);
        }
    }, [user]);

    const categoryDropdownRef = useRef(null);
    const locationDropdownRef = useRef(null);
    const distanceDropdownRef = useRef(null);
    const meinsDropdownRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target)) {
                setShowCategoryDropdown(false);
            }
            if (locationDropdownRef.current && !locationDropdownRef.current.contains(event.target)) {
                setShowLocationDropdown(false);
            }
            if (distanceDropdownRef.current && !distanceDropdownRef.current.contains(event.target)) {
                setShowDistanceDropdown(false);
            }
            if (meinsDropdownRef.current && !meinsDropdownRef.current.contains(event.target)) {
                setShowMeinsDropdown(false);
            }
            if (recentSearchesDropdownRef.current && !recentSearchesDropdownRef.current.contains(event.target) && !searchInputRef.current.contains(event.target)) {
                setShowRecentSearches(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    useEffect(() => {
        if (navigator.geolocation && location === 'Türkiye') {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords;
                    try {
                        const response = await fetch(
                            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
                            { headers: { 'User-Agent': 'ExVitrin/1.0' } }
                        );
                        const data = await response.json();
                        if (data.address) {
                            const city = data.address.city || data.address.town || data.address.village || data.address.province || data.address.state;
                            if (city) setLocation(city);
                        }
                    } catch (error) {
                        console.log('Error fetching city name:', error);
                    }
                },
                (error) => {
                    console.log('Location access denied or unavailable');
                }
            );
        }
    }, []);

    useEffect(() => {
        if (locationObj.pathname === '/') {
            setSearchTerm('');
            setSelectedCategory('Tüm Kategoriler');
            setSelectedDistance('50 km');
        } else if (locationObj.pathname === '/search') {
            const params = new URLSearchParams(locationObj.search);
            const q = params.get('q');
            if (q) setSearchTerm(q);
            const cat = params.get('category');
            if (cat) setSelectedCategory(cat);
            const loc = params.get('location');
            if (loc) setLocation(loc);
        }
    }, [locationObj.pathname, locationObj.search, setSearchTerm, setSelectedCategory, setLocation]);

    const handleLogout = async () => {
        try {
            await signOut();
            navigate('/');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    if (isMobile && locationObj.pathname !== '/' && locationObj.pathname !== '/search') {
        return null;
    }

    return (
        <section className="bg-gradient-to-r from-slate-200 via-gray-200 to-slate-200 dark:from-neutral-800 dark:via-neutral-900 dark:to-neutral-800 py-4 sm:py-8 relative overflow-visible z-40 border-b border-slate-300 dark:border-white/10 transition-colors duration-300">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20 dark:opacity-10"></div>
            <div className="max-w-[1400px] mx-auto px-2 sm:px-4 relative z-20">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-stretch">
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            if (searchTerm.trim()) {
                                saveRecentSearch(searchTerm);
                                setShowRecentSearches(false);
                                const params = new URLSearchParams();
                                params.append('q', searchTerm.trim());
                                if (selectedCategory && selectedCategory !== 'Tüm Kategoriler') params.append('category', selectedCategory);
                                if (location && location !== 'Türkiye') params.append('location', location);
                                if (selectedDistance) params.append('distance', selectedDistance);
                                navigate(`/search?${params.toString()}`);
                            }
                        }}
                        className="flex-1 flex items-center gap-1 sm:gap-2 bg-white dark:bg-neutral-800 rounded-xl sm:rounded-2xl p-2 sm:p-3 shadow-xl hover:shadow-2xl transition-all duration-300 border border-transparent dark:border-white/5"
                    >
                        <button
                            type="submit"
                            className="p-1 sm:p-2 cursor-pointer hover:bg-gray-50 rounded-full transition-colors focus:outline-none"
                            aria-label="Arama Yap"
                        >
                            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400 group-focus-within:text-red-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M19 11a8 8 0 11-16 0 8 8 0 0116 0z" />
                            </svg>
                        </button>

                        <div className="flex-1 relative">
                            <input
                                ref={searchInputRef}
                                type="text"
                                placeholder="Ne arıyorsunuz?"
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                    if (!showRecentSearches) setShowRecentSearches(true);
                                }}
                                onFocus={() => setShowRecentSearches(true)}
                                className="w-full px-1 sm:px-2 py-2 border-none outline-none text-gray-700 dark:text-neutral-200 bg-transparent placeholder-gray-400 text-sm sm:text-base font-medium pr-8"
                            />

                            {searchTerm && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setSearchTerm('');
                                        setShowRecentSearches(false);
                                        // If on search page, clear query param
                                        if (locationObj.pathname === '/search') {
                                            const params = new URLSearchParams(locationObj.search);
                                            params.delete('q');
                                            navigate(`/search?${params.toString()}`);
                                        }
                                    }}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 bg-gray-100 dark:bg-neutral-700 rounded-full hover:bg-gray-200 dark:hover:bg-neutral-600 transition-colors"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            )}

                            {showRecentSearches && (searchTerm.trim().length < 2 ? recentSearches.length > 0 : (suggestions.categories.length > 0 || suggestions.listings.length > 0)) && (
                                <div
                                    ref={recentSearchesDropdownRef}
                                    className="absolute top-full left-0 w-full mt-2 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md border border-neutral-200 dark:border-white/10 rounded-2xl shadow-2xl z-[100] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200"
                                >
                                    {searchTerm.trim().length < 2 && recentSearches.length > 0 && (
                                        <div className="py-2">
                                            <div className="px-4 py-2 text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest">
                                                Son Aramalar
                                            </div>
                                            {recentSearches.map((term, index) => (
                                                <button
                                                    key={index}
                                                    type="button"
                                                    onClick={() => {
                                                        setSearchTerm(term);
                                                        setShowRecentSearches(false);
                                                        navigate(`/search?q=${encodeURIComponent(term)}`);
                                                    }}
                                                    className="w-full px-4 py-2.5 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 flex items-center gap-3 transition-colors"
                                                >
                                                    <svg className="w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    {term}
                                                </button>
                                            ))}
                                        </div>
                                    )}

                                    {searchTerm.trim().length >= 2 && (
                                        <div className="py-2">
                                            {/* General Search Option */}
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    saveRecentSearch(searchTerm);
                                                    setShowRecentSearches(false);
                                                    navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
                                                }}
                                                className="w-full px-4 py-3 text-left text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 flex items-center gap-3 transition-colors border-b border-neutral-50 dark:border-white/5"
                                            >
                                                <div className="w-8 h-8 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-400">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                                    </svg>
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-neutral-900 dark:text-neutral-100">{searchTerm}</span>
                                                    <span className="text-[10px] text-neutral-400 uppercase tracking-tighter">Genel Arama</span>
                                                </div>
                                            </button>

                                            {/* Category Suggestions */}
                                            {suggestions.categories.length > 0 && (
                                                <div className="mt-1">
                                                    {suggestions.categories.map((cat, index) => (
                                                        <button
                                                            key={`cat-${index}`}
                                                            type="button"
                                                            onClick={() => {
                                                                setSelectedCategory(cat);
                                                                setShowRecentSearches(false);
                                                                navigate(`/search?q=${encodeURIComponent(searchTerm)}&category=${encodeURIComponent(cat)}`);
                                                            }}
                                                            className="w-full px-4 py-2.5 text-left text-sm text-neutral-600 dark:text-neutral-400 hover:bg-red-50 dark:hover:bg-red-950/20 group transition-colors flex items-center justify-between"
                                                        >
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-8 h-8 flex items-center justify-center text-neutral-300 dark:text-neutral-600 group-hover:text-red-500 transition-colors">
                                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2z" />
                                                                    </svg>
                                                                </div>
                                                                <div className="flex items-baseline gap-1.5">
                                                                    <span className="text-neutral-500 dark:text-neutral-500">{searchTerm}</span>
                                                                    <span className="text-xs opacity-40">...</span>
                                                                    <span className="text-sm font-bold text-neutral-900 dark:text-neutral-100 group-hover:text-red-600 dark:group-hover:text-red-400 underline decoration-red-200 dark:decoration-red-900/50 underline-offset-4">{cat}</span>
                                                                    <span className="text-[10px] opacity-60 ml-0.5">içinde</span>
                                                                </div>
                                                            </div>
                                                            <svg className="w-3 h-3 text-neutral-300 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                            </svg>
                                                        </button>
                                                    ))}
                                                </div>
                                            )}

                                            {/* Listing Suggestions */}
                                            {suggestions.listings.length > 0 && (
                                                <div>
                                                    <div className="px-4 py-2 text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest border-t border-neutral-100 dark:border-white/5 mt-1 pt-3">
                                                        Hızlı Bakış
                                                    </div>
                                                    {suggestions.listings.map((listing) => (
                                                        <button
                                                            key={listing.id}
                                                            type="button"
                                                            onClick={() => {
                                                                setShowRecentSearches(false);
                                                                navigate(getListingUrl(listing));
                                                            }}
                                                            className="w-full px-4 py-3 text-left hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors flex items-center gap-4 group"
                                                        >
                                                            <div className="w-12 h-12 rounded-xl overflow-hidden bg-neutral-100 dark:bg-neutral-800 flex-shrink-0 border border-neutral-200 dark:border-white/10">
                                                                {listing.thumbnail_url ? (
                                                                    <img src={listing.thumbnail_url} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                                                ) : (
                                                                    <div className="w-full h-full flex items-center justify-center text-neutral-400">
                                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h14a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <div className="text-sm font-semibold text-neutral-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                                                    {listing.title}
                                                                </div>
                                                                <div className="flex items-center gap-2 mt-0.5">
                                                                    <span className="text-[11px] text-neutral-500 dark:text-neutral-400">{listing.category}</span>
                                                                    {listing.price && (
                                                                        <>
                                                                            <span className="w-1 h-1 rounded-full bg-neutral-300 dark:bg-neutral-600"></span>
                                                                            <span className="text-xs font-bold text-green-600 dark:text-green-400">{listing.price} TL</span>
                                                                        </>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="relative hidden md:block" ref={categoryDropdownRef}>
                            <button
                                type="button"
                                onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                                className="px-3 py-2 border-l border-gray-200 dark:border-white/10 text-gray-700 dark:text-neutral-300 hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors flex items-center gap-1 focus:outline-none text-sm"
                            >
                                <span>{selectedCategory}</span>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                            {showCategoryDropdown && (
                                <div className="absolute top-full right-0 mt-1 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-white/10 rounded-lg shadow-lg z-[100] flex min-w-[600px] max-h-[500px] overflow-hidden">
                                    <div className="w-1/2 py-2 border-r border-gray-100 dark:border-white/5 overflow-y-auto">
                                        {categories
                                            .filter(cat => !inactiveCategories.has(cat.name))
                                            .map((category) => (
                                                <div
                                                    key={category.name}
                                                    onMouseEnter={() => setHoveredCategory(category)}
                                                    onClick={() => {
                                                        setSelectedCategory(category.name);
                                                        setShowCategoryDropdown(false);
                                                    }}
                                                    className={`w-full px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors text-gray-700 dark:text-neutral-300 cursor-pointer flex justify-between items-center ${hoveredCategory?.name === category.name ? 'bg-gray-50 dark:bg-neutral-800 text-red-500 dark:text-red-400' : ''}`}
                                                >
                                                    <span>{category.name}</span>
                                                    {category.subcategories && (
                                                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                        </svg>
                                                    )}
                                                </div>
                                            ))}
                                    </div>

                                    {hoveredCategory && hoveredCategory.subcategories && (
                                        <div className="w-1/2 py-2 bg-gray-50 dark:bg-neutral-800/50 rounded-r-lg overflow-y-auto">
                                            <div className="px-4 py-2 font-semibold text-gray-900 dark:text-neutral-100 border-b border-gray-200 dark:border-white/5 mb-1">
                                                {hoveredCategory.name}
                                            </div>
                                            {hoveredCategory.subcategories
                                                .filter(sub => !inactiveCategories.has(sub.name))
                                                .map((sub) => (
                                                    <button
                                                        key={sub.name}
                                                        type="button"
                                                        onClick={() => {
                                                            setSelectedCategory(sub.name);
                                                            setShowCategoryDropdown(false);
                                                        }}
                                                        className="w-full px-4 py-2 text-left hover:bg-white dark:hover:bg-neutral-700 transition-colors text-gray-600 dark:text-neutral-400 text-sm"
                                                    >
                                                        {sub.name}
                                                    </button>
                                                ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="relative flex items-center border-l border-gray-200 dark:border-white/10 group" ref={locationDropdownRef}>
                            <div className="pl-1 sm:pl-3 text-gray-400 group-focus-within:text-red-500 transition-colors flex-shrink-0">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21c-3.1-4.2-5-7.1-5-10a5 5 0 1110 0c0 2.9-1.9 5.8-5 10z" />
                                    <circle cx="12" cy="11" r="2" />
                                </svg>
                            </div>
                            <input
                                type="text"
                                placeholder="Konum"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                onFocus={() => setShowLocationDropdown(true)}
                                className="w-[70px] sm:w-24 md:w-32 px-1 py-2 text-xs sm:text-sm text-gray-700 dark:text-neutral-200 focus:outline-none placeholder-gray-400 bg-transparent font-medium truncate"
                            />
                            <button
                                type="button"
                                onClick={handleDetectLocation}
                                disabled={isLocating}
                                className={`p-0.5 sm:p-1 mr-0.5 sm:mr-1 rounded-md transition-all flex-shrink-0 ${isLocating ? 'animate-pulse text-red-500' : 'text-gray-400 hover:text-red-500 hover:bg-gray-100'}`}
                            >
                                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-0.71L12 2z" />
                                </svg>
                            </button>

                            {showLocationDropdown && (
                                <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-white/10 rounded-lg shadow-lg z-50 min-w-[180px]">
                                    {['Türkiye', 'İstanbul', 'Ankara', 'İzmir', 'Bursa', 'Antalya'].map((loc) => (
                                        <button
                                            key={loc}
                                            type="button"
                                            onClick={() => {
                                                setLocation(loc);
                                                setShowLocationDropdown(false);
                                            }}
                                            className="w-full px-4 py-2 text-left hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-red-700 dark:hover:text-red-400 transition-colors text-gray-700 dark:text-neutral-300 focus:outline-none text-sm"
                                        >
                                            {loc}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        <button
                            type="submit"
                            className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-md transition-all font-medium focus:outline-none hidden sm:block"
                        >
                            Ara
                        </button>
                        <button
                            type="submit"
                            className="p-2 bg-red-600 text-white rounded-lg sm:hidden"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </button>
                    </form>

                    <div className="hidden lg:flex items-stretch gap-3">
                        <button
                            onClick={() => navigate('/add-listing')}
                            className="flex flex-col items-center justify-center text-neutral-700 dark:text-neutral-100 font-semibold px-4 py-2 rounded-xl hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-all"
                        >
                            <svg className="w-8 h-8 mb-0.5 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-sm">İlan Ver</span>
                        </button>

                        <div className="relative flex items-center">
                            <button
                                onClick={() => setShowMeinsDropdown(!showMeinsDropdown)}
                                className="flex flex-col items-center justify-center text-neutral-700 dark:text-neutral-100 hover:text-neutral-900 dark:hover:text-neutral-50 font-medium px-3 py-2 relative rounded-xl hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-all"
                            >
                                <svg className="w-8 h-8 mb-0.5 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <span className="text-sm">Hesabım</span>
                                {unreadCount > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                                        {unreadCount}
                                    </span>
                                )}
                            </button>

                            {showMeinsDropdown && (
                                <div
                                    className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-neutral-900 rounded-lg shadow-xl border border-gray-200 dark:border-white/10 py-2 z-[10000]"
                                    ref={meinsDropdownRef}
                                >
                                    <button onClick={() => { navigate('/profile'); setShowMeinsDropdown(false); }} className="w-full text-left px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-neutral-800 flex items-center gap-3 transition-colors text-gray-700 dark:text-neutral-300">
                                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                        {t.nav.myProfile}
                                    </button>
                                    <button onClick={() => { navigate('/messages'); setShowMeinsDropdown(false); }} className="w-full text-left px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-neutral-800 flex items-center gap-3 transition-colors text-gray-700 dark:text-neutral-300">
                                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h0.01M12 12h0.01M16 12h0.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-0.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                                        {t.nav.messages}
                                        {unreadCount > 0 && <span className="bg-red-600 text-white text-xs px-2 py-0.5 rounded-full ml-auto">{unreadCount}</span>}
                                    </button>
                                    <button onClick={() => { navigate('/my-listings'); setShowMeinsDropdown(false); }} className="w-full text-left px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-neutral-800 flex items-center gap-3 transition-colors text-gray-700 dark:text-neutral-300">
                                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                                        {t.nav.myListings}
                                    </button>
                                    <button onClick={() => { navigate('/favorites'); setShowMeinsDropdown(false); }} className="w-full text-left px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-neutral-800 flex items-center gap-3 transition-colors text-gray-700 dark:text-neutral-300">
                                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                                        Favorilerim
                                    </button>
                                    <button onClick={() => { navigate('/packages'); setShowMeinsDropdown(false); }} className="w-full text-left px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-neutral-800 flex items-center gap-3 transition-colors text-gray-700 dark:text-neutral-300">
                                        <svg className="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-0.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h0.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                        Kurumsal PRO
                                    </button>
                                    <button onClick={() => { navigate('/settings'); setShowMeinsDropdown(false); }} className="w-full text-left px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-neutral-800 flex items-center gap-3 transition-colors text-gray-700 dark:text-neutral-300">
                                        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-0.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-0.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-0.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-0.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-0.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-0.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        Ayarlar
                                    </button>
                                    <div className="my-2 border-t border-neutral-100 dark:border-white/5"></div>
                                    <button onClick={handleLogout} className="w-full text-left px-4 py-2.5 hover:bg-red-50 dark:hover:bg-red-950/30 text-red-600 dark:text-red-400 flex items-center gap-3 transition-colors">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                                        {t.nav.logout}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
