import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useIsMobile } from '../hooks/useIsMobile';
import { t } from '../translations';
import { searchApi } from '../api/search';
import LoadingSpinner from './LoadingSpinner';
import { categories } from '../data/categories';

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
            if (searchTerm.trim().length < 2) {
                setSuggestions({ categories: [], listings: [] });
                return;
            }
            setIsSearchingSuggestions(true);
            try {
                const data = await searchApi.getSuggestions(searchTerm);
                setSuggestions(data);
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
    }, [searchTerm]);

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

    const locationObj = useLocation();

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

    if (isMobile && locationObj.pathname !== '/') {
        return null;
    }

    return (
        <section className="bg-gradient-to-r from-red-500 to-rose-600 py-4 sm:py-8 relative overflow-visible z-40">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-30"></div>
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
                        className="flex-1 flex items-center gap-1 sm:gap-2 bg-white rounded-xl sm:rounded-2xl p-2 sm:p-3 shadow-xl hover:shadow-2xl transition-shadow duration-300"
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
                                className="w-full px-1 sm:px-2 py-2 border-none outline-none text-gray-700 placeholder-gray-400 text-sm sm:text-base font-medium"
                            />

                            {showRecentSearches && (searchTerm.trim().length < 2 ? recentSearches.length > 0 : suggestions.categories.length > 0) && (
                                <div
                                    ref={recentSearchesDropdownRef}
                                    className="absolute top-full left-0 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-[100] overflow-hidden"
                                >
                                    {searchTerm.trim().length < 2 && recentSearches.length > 0 && (
                                        <>
                                            <div className="px-3 py-2 text-xs font-semibold text-gray-500 bg-gray-50 border-b border-gray-100 uppercase tracking-wider">
                                                Son aramalar
                                            </div>
                                            {recentSearches.map((term, index) => (
                                                <button
                                                    key={index}
                                                    type="button"
                                                    onClick={() => {
                                                        setSearchTerm(term);
                                                        setShowRecentSearches(false);
                                                    }}
                                                    className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors"
                                                >
                                                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    {term}
                                                </button>
                                            ))}
                                        </>
                                    )}

                                    {searchTerm.trim().length >= 2 && suggestions.categories.length > 0 && (
                                        <>
                                            <div className="px-3 py-2 text-xs font-semibold text-gray-500 bg-gray-50 border-b border-gray-100 uppercase tracking-wider">
                                                Kategoriler
                                            </div>
                                            {suggestions.categories.map((cat, index) => (
                                                <button
                                                    key={`cat-${index}`}
                                                    type="button"
                                                    onClick={() => {
                                                        setSelectedCategory(cat);
                                                        setShowRecentSearches(false);
                                                        navigate(`/search?category=${encodeURIComponent(cat)}`);
                                                    }}
                                                    className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-red-50 hover:text-red-700 flex items-center gap-2 transition-colors"
                                                >
                                                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                                                    </svg>
                                                    <span className="font-medium">{cat}</span>
                                                </button>
                                            ))}
                                        </>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="relative hidden md:block" ref={categoryDropdownRef}>
                            <button
                                type="button"
                                onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                                className="px-3 py-2 border-l border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-1 focus:outline-none text-sm"
                            >
                                <span>{selectedCategory}</span>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                            {showCategoryDropdown && (
                                <div className="absolute top-full right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-[100] flex min-w-[600px] max-h-[500px] overflow-hidden">
                                    <div className="w-1/2 py-2 border-r border-gray-100 overflow-y-auto">
                                        {categories.map((category) => (
                                            <div
                                                key={category.name}
                                                onMouseEnter={() => setHoveredCategory(category)}
                                                onClick={() => {
                                                    setSelectedCategory(category.name);
                                                    setShowCategoryDropdown(false);
                                                }}
                                                className={`w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors text-gray-700 cursor-pointer flex justify-between items-center ${hoveredCategory?.name === category.name ? 'bg-gray-50 text-red-500' : ''}`}
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
                                        <div className="w-1/2 py-2 bg-gray-50 rounded-r-lg overflow-y-auto">
                                            <div className="px-4 py-2 font-semibold text-gray-900 border-b border-gray-200 mb-1">
                                                {hoveredCategory.name}
                                            </div>
                                            {hoveredCategory.subcategories.map((sub) => (
                                                <button
                                                    key={sub.name}
                                                    type="button"
                                                    onClick={() => {
                                                        setSelectedCategory(sub.name);
                                                        setShowCategoryDropdown(false);
                                                    }}
                                                    className="block w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-red-50 hover:text-red-700 rounded-md"
                                                >
                                                    {sub.name}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="relative flex items-center border-l border-gray-200 group" ref={locationDropdownRef}>
                            <div className="pl-3 text-gray-400 group-focus-within:text-red-500 transition-colors">
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
                                className="w-32 md:w-40 px-2 py-2 text-sm text-gray-700 focus:outline-none placeholder-gray-400 bg-transparent font-medium"
                            />
                            <button
                                type="button"
                                onClick={handleDetectLocation}
                                disabled={isLocating}
                                className={`p-1 mr-1 rounded-md transition-all ${isLocating ? 'animate-pulse text-red-500' : 'text-gray-400 hover:text-red-500 hover:bg-gray-100'}`}
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71L12 2z" />
                                </svg>
                            </button>

                            {showLocationDropdown && (
                                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[180px]">
                                    {['Türkiye', 'İstanbul', 'Ankara', 'İzmir', 'Bursa', 'Antalya'].map((loc) => (
                                        <button
                                            key={loc}
                                            type="button"
                                            onClick={() => {
                                                setLocation(loc);
                                                setShowLocationDropdown(false);
                                            }}
                                            className="w-full px-4 py-2 text-left hover:bg-red-50 hover:text-red-700 transition-colors text-gray-700 focus:outline-none text-sm"
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
                            className="flex flex-col items-center justify-center text-white font-semibold px-4 py-2 rounded-xl hover:bg-white/10 transition-all"
                        >
                            <svg className="w-8 h-8 mb-0.5 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-sm">İlan Ver</span>
                        </button>

                        <div className="relative flex items-center">
                            <button
                                onClick={() => setShowMeinsDropdown(!showMeinsDropdown)}
                                className="flex flex-col items-center justify-center text-white hover:text-red-50 font-medium px-3 py-2 relative rounded-xl hover:bg-white/10 transition-all"
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
                                    className="absolute right-0 top-full mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-[10000]"
                                    ref={meinsDropdownRef}
                                >
                                    <button onClick={() => { navigate('/profile'); setShowMeinsDropdown(false); }} className="w-full text-left px-4 py-2.5 hover:bg-gray-50 flex items-center gap-3 transition-colors">
                                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                        {t.nav.myProfile}
                                    </button>
                                    <button onClick={() => { navigate('/messages'); setShowMeinsDropdown(false); }} className="w-full text-left px-4 py-2.5 hover:bg-gray-50 flex items-center gap-3 transition-colors">
                                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                                        {t.nav.messages}
                                        {unreadCount > 0 && <span className="bg-red-600 text-white text-xs px-2 py-0.5 rounded-full ml-auto">{unreadCount}</span>}
                                    </button>
                                    <button onClick={() => { navigate('/my-listings'); setShowMeinsDropdown(false); }} className="w-full text-left px-4 py-2.5 hover:bg-gray-50 flex items-center gap-3 transition-colors">
                                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                                        {t.nav.myListings}
                                    </button>
                                    <button onClick={() => { navigate('/favorites'); setShowMeinsDropdown(false); }} className="w-full text-left px-4 py-2.5 hover:bg-gray-50 flex items-center gap-3 transition-colors">
                                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                                        Favorilerim
                                    </button>
                                    <button onClick={() => { navigate('/packages'); setShowMeinsDropdown(false); }} className="w-full text-left px-4 py-2.5 hover:bg-gray-50 flex items-center gap-3 transition-colors">
                                        <svg className="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                        Kurumsal PRO
                                    </button>
                                    <button onClick={() => { navigate('/settings'); setShowMeinsDropdown(false); }} className="w-full text-left px-4 py-2.5 hover:bg-gray-50 flex items-center gap-3 transition-colors">
                                        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        Ayarlar
                                    </button>
                                    <div className="my-2 border-t border-neutral-100"></div>
                                    <button onClick={handleLogout} className="w-full text-left px-4 py-2.5 hover:bg-red-50 text-red-600 flex items-center gap-3 transition-colors">
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
