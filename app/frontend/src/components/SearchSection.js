import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { t } from '../translations';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { useIsMobile } from '../hooks/useIsMobile';
import searchApi from '../api/search';
import LoadingSpinner from './LoadingSpinner';
import { categories } from '../config/categories';
import { getListingUrl } from '../utils/slug';

export const SearchSection = ({ searchTerm, setSearchTerm, selectedCategory, setSelectedCategory, location, setLocation, cartItems = [], cartCount = 0, showCart, setShowCart, removeFromCart, updateCartQuantity, followedSellers = [], favorites = [] }) => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [showDistanceDropdown, setShowDistanceDropdown] = useState(false);
  const [selectedDistance, setSelectedDistance] = useState('50 km');
  const [showAccountDropdown, setShowAccountDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [userProfile, setUserProfile] = useState(null);
  const isMobile = useIsMobile();
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [recentSearches, setRecentSearches] = useState([]);
  const [showRecentSearches, setShowRecentSearches] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [suggestions, setSuggestions] = useState({ categories: [], listings: [] });
  const [isSearchingSuggestions, setIsSearchingSuggestions] = useState(false);
  const [searchBgColor, setSearchBgColor] = useState('');
  const searchInputRef = React.useRef(null);
  const recentSearchesDropdownRef = React.useRef(null);

  // Listen for custom settings update
  useEffect(() => {
    const loadColor = () => {
      const saved = localStorage.getItem('site_settings');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setSearchBgColor(parsed.searchBgColor || '');
        } catch (e) { }
      }
    };
    loadColor();
    window.addEventListener('site_settings_updated', loadColor);
    window.addEventListener('storage', loadColor);
    return () => {
      window.removeEventListener('site_settings_updated', loadColor);
      window.removeEventListener('storage', loadColor);
    };
  }, []);

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
                'User-Agent': 'Kleinbazaar/1.0'
              }
            }
          );
          const data = await response.json();
          // Try to get city, town, or village
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

  // Load recent searches from localStorage
  useEffect(() => {
    const savedSearches = localStorage.getItem('recentSearches');
    console.log('Loading recent searches:', savedSearches);
    if (savedSearches) {
      try {
        setRecentSearches(JSON.parse(savedSearches));
      } catch (e) {
        console.error('Error parsing recent searches:', e);
      }
    }
  }, []);

  const saveRecentSearch = (term) => {
    console.log('Saving recent search:', term);
    if (!term || !term.trim()) return;

    const newTerm = term.trim();

    // Read current from local storage to ensure we have latest
    let currentList = [];
    const currentSaved = localStorage.getItem('recentSearches');
    if (currentSaved) {
      try {
        currentList = JSON.parse(currentSaved);
      } catch (e) { }
    }

    const updatedSearches = [newTerm, ...currentList.filter(s => s !== newTerm)].slice(0, 3);

    console.log('Updated searches:', updatedSearches);
    setRecentSearches(updatedSearches);
    localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
  };

  // Suggestion fetching logic
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

  // Fetch user profile for display name
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (user) {
        try {
          const { fetchUserProfile: getProfile } = await import('../api/profile');
          const profile = await getProfile(user.id);
          setUserProfile(profile);
        } catch (error) {
          console.error('Error fetching user profile:', error);
        }
      }
    };

    fetchUserProfile();
  }, [user]);

  // Fetch unread message count
  React.useEffect(() => {
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
      // Refresh every 30 seconds
      const interval = setInterval(fetchUnreadCount, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const categoryDropdownRef = React.useRef(null);
  const locationDropdownRef = React.useRef(null);
  const distanceDropdownRef = React.useRef(null);
  const accountDropdownRef = React.useRef(null);
  const cartDropdownRef = React.useRef(null);

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
      if (accountDropdownRef.current && !accountDropdownRef.current.contains(event.target)) {
        setShowAccountDropdown(false);
      }
      if (cartDropdownRef.current && !cartDropdownRef.current.contains(event.target)) {
        setShowCart(false);
      }
      if (recentSearchesDropdownRef.current && !recentSearchesDropdownRef.current.contains(event.target) && !searchInputRef.current.contains(event.target)) {
        // console.log('Click outside recent searches');
        setShowRecentSearches(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [categoryDropdownRef, locationDropdownRef, distanceDropdownRef, accountDropdownRef, cartDropdownRef, recentSearchesDropdownRef, setShowCart]);

  // Get user's location on component mount
  useEffect(() => {
    if (navigator.geolocation && location === 'Türkiye') {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          // Use Nominatim (OpenStreetMap) reverse geocoding to get postal code
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
              {
                headers: {
                  'User-Agent': 'Kleinbazaar'
                }
              }
            );
            const data = await response.json();

            if (data.address) {
              const city = data.address.city || data.address.town || data.address.village || data.address.province || data.address.state;
              if (city) {
                setLocation(city);
              } else {
                setLocation(t.nav.myLocation);
              }
            } else {
              setLocation(t.nav.myLocation);
            }
          } catch (error) {
            console.log('Error fetching city name:', error);
            setLocation(t.nav.myLocation);
          }
        },
        (error) => {
          console.log('Location access denied or unavailable');
        }
      );
    }
  }, []);

  const locationObj = useLocation();
  const isFavoritesListingsActive = locationObj.pathname === '/favorites' && (locationObj.search.includes('tab=listings') || !locationObj.search.includes('tab='));
  const isFavoritesUsersActive = locationObj.pathname === '/favorites' && locationObj.search.includes('tab=users');

  // Clear search term, category and reset distance when navigating to home page
  // Clear search term, category and reset distance when navigating to home page
  // Also sync search term from URL when on search page
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
  }, [locationObj.pathname, locationObj.search, setSearchTerm, setSelectedCategory, setSelectedDistance, setLocation]);

  if (isMobile && locationObj.pathname !== '/') {
    return null;
  }

  return (
    <section 
      className={`py-3 sm:py-4 relative overflow-visible z-40 border-b border-neutral-300 dark:border-white/10 transition-colors duration-300 ${!searchBgColor ? 'bg-gradient-to-r from-neutral-200 via-neutral-300 to-neutral-200 dark:from-neutral-800 dark:via-neutral-900 dark:to-neutral-800' : ''}`}
      style={searchBgColor ? { backgroundColor: searchBgColor } : {}}
    >
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20 dark:opacity-10 pointer-events-none"></div>
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
            className="flex-1 flex items-center gap-1 sm:gap-2 bg-white rounded-full pl-4 py-1 pr-1.5 sm:pl-5 sm:py-1 sm:pr-2 shadow-xl hover:shadow-2xl transition-shadow duration-300"
          >
            {/* Search Icon - Submit Button */}
            <button
              type="submit"
              className="p-1 sm:p-2 cursor-pointer hover:bg-gray-50 rounded-full transition-colors focus:outline-none"
              aria-label="Arama Yap"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            {/* Search Input Container */}
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
                onFocus={() => {
                  console.log('Input focused, showing recent searches');
                  setShowRecentSearches(true);
                }}
                onClick={() => {
                  console.log('Input clicked, showing recent searches');
                  setShowRecentSearches(true);
                }}
                onKeyPress={(e) => {
                  // Enter is handled by form submit
                }}
                className="w-full px-1 sm:px-2 py-2 border-none outline-none text-gray-700 placeholder-gray-400 text-sm sm:text-base"
                aria-label="Arama kutusu"
              />

              {/* Recent Searches & Suggestions Dropdown */}
              {showRecentSearches && (searchTerm.trim().length < 2 ? recentSearches.length > 0 : (suggestions.categories.length > 0 || suggestions.listings.length > 0)) && (
                <div
                  ref={recentSearchesDropdownRef}
                  className="absolute top-full left-0 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-[100] overflow-hidden"
                >
                  {/* Recent Searches - Only when search term is short */}
                  {searchTerm.trim().length < 2 && recentSearches.length > 0 && (
                    <>
                      <div className="px-3 py-2 text-xs font-semibold text-gray-500 bg-gray-50 border-b border-gray-100 uppercase tracking-wider">
                        Son aramalar
                      </div>
                      {recentSearches.map((term, index) => (
                        <button
                          key={index}
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

                  {/* Category Suggestions */}
                  {searchTerm.trim().length >= 2 && suggestions.categories.length > 0 && (
                    <>
                      <div className="px-3 py-2 text-xs font-semibold text-gray-500 bg-gray-50 border-b border-gray-100 uppercase tracking-wider">
                        Kategoriler
                      </div>
                      {suggestions.categories.map((cat, index) => (
                        <button
                          key={`cat-${index}`}
                          onClick={() => {
                            setSelectedCategory(cat);
                            setShowRecentSearches(false);
                            navigate(getCategoryPath(cat));
                          }}
                          className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-red-50 hover:text-red-700 flex items-center gap-2 transition-colors"
                        >
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                          </svg>
                          <span className="font-medium">{cat}</span>
                          <span className="text-xs text-gray-400 ml-auto">Kategoride Ara</span>
                        </button>
                      ))}
                    </>
                  )}

                  {/* Listing Suggestions */}
                  {searchTerm.trim().length >= 2 && suggestions.listings.length > 0 && (
                    <>
                      <div className="px-3 py-2 text-xs font-semibold text-gray-500 bg-gray-50 border-b border-gray-100 border-t uppercase tracking-wider">
                        İlanlar
                      </div>
                      {suggestions.listings.map((listing) => (
                        <button
                          key={listing.id}
                          onClick={() => {
                            setShowRecentSearches(false);
                            navigate(getListingUrl(listing));
                          }}
                          className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors"
                        >
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
                          <div className="flex flex-col">
                            <span className="truncate max-w-[400px]">{listing.title}</span>
                            <span className="text-[10px] text-gray-400 uppercase">{listing.category}</span>
                          </div>
                        </button>
                      ))}
                    </>
                  )}

                  {isSearchingSuggestions && (
                    <div className="px-3 py-2 text-center">
                      <LoadingSpinner size="small" />
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Category Dropdown - Now visible in a different way on mobile? */}
            {/* On mobile, we might want to show this in the bottom row to save space in the main search bar */}
            <div className="relative hidden md:block" ref={categoryDropdownRef}>
              <button
                type="button"
                onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                className="px-2 sm:px-3 py-2 border-l border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-1 focus:outline-none text-sm"
              >
                <span className="hidden lg:inline">{selectedCategory}</span>
                <span className="lg:hidden">Kategori</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {showCategoryDropdown && (
                <div className="absolute top-full right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-[100] flex min-w-[600px] max-h-[500px] overflow-hidden">
                  {/* Main Categories */}
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

                  {/* Subcategories */}
                  {hoveredCategory && hoveredCategory.subcategories && (
                    <div className="w-1/2 py-2 bg-gray-50 rounded-r-lg overflow-y-auto">
                      <div className="px-4 py-2 font-semibold text-gray-900 border-b border-gray-200 mb-1">
                        {hoveredCategory.name}
                      </div>
                      {hoveredCategory.subcategories.map((sub) => (
                        <button
                          key={sub.name}
                          onClick={() => {
                            setSelectedCategory(sub.name);
                            setShowCategoryDropdown(false);
                          }}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-red-50 hover:text-red-700 rounded-md focus:outline-none"
                        >
                          {sub.name}
                          {sub.count > 0 && <span className="text-xs text-gray-400 ml-1">({sub.count})</span>}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Location Input */}
            <div className="relative flex items-center border-l border-gray-200 group" ref={locationDropdownRef}>
              <div className="pl-2 sm:pl-3 text-gray-400 group-focus-within:text-red-500 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Konum"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                onFocus={() => setShowLocationDropdown(true)}
                className="w-20 xs:w-24 sm:w-32 md:w-40 px-1 sm:px-2 py-2 text-xs sm:text-sm text-gray-700 focus:outline-none placeholder-gray-400 bg-transparent"
              />
              <button
                type="button"
                onClick={handleDetectLocation}
                disabled={isLocating}
                className={`p-1 mr-1 rounded-md transition-all ${isLocating ? 'animate-pulse text-red-500' : 'text-gray-400 hover:text-red-500 hover:bg-gray-100'}`}
                title="Konumumu Bul"
                aria-label="Mevcut Konumumu Kullan"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="8" />
                  <circle cx="12" cy="12" r="2.5" fill="currentColor" stroke="none" />
                  <line x1="12" y1="2" x2="12" y2="5" />
                  <line x1="12" y1="19" x2="12" y2="22" />
                  <line x1="2" y1="12" x2="5" y2="12" />
                  <line x1="19" y1="12" x2="22" y2="12" />
                </svg>
              </button>

              {showLocationDropdown && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[180px]">
                  <div className="px-3 py-2 text-[10px] font-bold text-gray-400 border-b border-gray-50 uppercase tracking-wider">
                    Popüler Şehirler
                  </div>
                  {['Türkiye', 'İstanbul', 'Ankara', 'İzmir', 'Bursa', 'Antalya'].map((loc) => (
                    <button
                      key={loc}
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

            {/* Distance Filter - Hidden on very small screens, visible on sm+ */}
            <div className="relative hidden sm:block" ref={distanceDropdownRef}>
              <button
                type="button"
                onClick={() => setShowDistanceDropdown(!showDistanceDropdown)}
                className="px-3 py-2 border-l border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-1 focus:outline-none"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-0.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-0.553-0.894L15 4m0 13V4m0 0L9 7" />
                </svg>
                {selectedDistance}
              </button>
              {showDistanceDropdown && (
                <div className="absolute top-full right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[180px]">
                  {['20 km', '50 km', '100 km', '200 km', '500 km', 'Tüm Türkiye'].map((distance) => (
                    <button
                      key={distance}
                      onClick={() => {
                        setSelectedDistance(distance);
                        setShowDistanceDropdown(false);
                      }}
                      className="w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors text-gray-700 focus:outline-none"
                    >
                      {distance}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Search Button / Icon */}
            <button
              type="button"
              aria-label="ExVitrin'de Ara"
              onClick={() => {
                const params = new URLSearchParams();
                if (searchTerm) params.append('q', searchTerm);
                if (selectedCategory && selectedCategory !== 'Tüm Kategoriler') params.append('category', selectedCategory);
                if (location && location !== 'Türkiye') params.append('location', location);
                if (selectedDistance) params.append('distance', selectedDistance);

                navigate(`/search?${params.toString()}`);
              }}
              className="brand-btn ml-2 sm:ml-4 px-8 sm:px-12 py-3 sm:py-3.5 rounded-r-full rounded-l-none shadow-md font-bold text-base sm:text-lg focus:outline-none flex items-center justify-center transition-all hover:scale-105"
            >
              <span className="hidden sm:inline">Ara</span>
              <svg className="w-6 h-6 sm:hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </form>

          {/* Desktop Actions (Hidden on Mobile) */}
          <div className="hidden lg:flex items-stretch gap-3">
            <button
              onClick={() => navigate('/add-listing')}
              className="brand-btn flex flex-col items-center justify-center transition-all duration-300 font-semibold px-4 py-2 rounded-xl transform group"
            >
              <svg className="w-8 h-8 mb-0.5 transform group-hover:scale-110 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <circle cx="12" cy="12" r="10" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v8m-4-4h8" />
              </svg>
              <span className="text-sm">İlan Ver</span>
            </button>

            <div className="relative flex items-center">
              <button
                onClick={() => setShowAccountDropdown(!showAccountDropdown)}
                className="flex flex-col items-center justify-center text-neutral-700 dark:text-neutral-100 hover:text-neutral-900 dark:hover:text-neutral-50 transition-all duration-300 font-medium px-3 py-2 relative rounded-xl hover:bg-neutral-200 dark:hover:bg-neutral-800 transform hover:-translate-y-0.5 group"
              >
                <svg className="w-8 h-8 mb-0.5 transform group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <circle cx="12" cy="12" r="10" />
                  <circle cx="12" cy="9" r="3" />
                  <path d="M6.168 18.849A4 4 0 0 1 10 16h4a4 4 0 0 1 3.834 2.855" strokeLinecap="round" />
                </svg>
                <span className="text-sm">{t.nav.myAccount}</span>
                {unreadCount > 0 && (
                  <span className="brand-btn absolute -top-1 -right-1 text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
                    {unreadCount}
                  </span>
                )}
              </button>
            </div>
          </div>

        </div>

        {showAccountDropdown && (
          <div
            className="absolute right-4 sm:right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-[10000]"
            ref={accountDropdownRef}
          >
            <div className="border-b border-gray-100 pb-2">
              <div className="px-4 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wider">HESABIM</div>

              <button onClick={() => { navigate('/profile'); setShowAccountDropdown(false); }} className="block w-full text-left px-4 py-2.5 text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors flex items-center gap-3">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                {t.nav.myProfile}
              </button>
              <button onClick={() => { navigate('/messages'); setShowAccountDropdown(false); }} className="block w-full text-left px-4 py-2.5 text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors flex items-center gap-3">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h0.01M12 12h0.01M16 12h0.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-0.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <span className="flex-1">{t.nav.messages}</span>
                {unreadCount > 0 && (
                  <span className="bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </button>
              <button onClick={() => { navigate('/my-listings'); setShowAccountDropdown(false); }} className="block w-full text-left px-4 py-2.5 text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors flex items-center gap-3">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                {t.nav.myListings}
              </button>
              <button onClick={() => { navigate('/settings'); setShowAccountDropdown(false); }} className="block w-full text-left px-4 py-2.5 text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors flex items-center gap-3">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-0.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-0.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-0.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-0.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-0.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-0.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {t.nav.settings}
              </button>

              {/* Unternehmensseite PRO */}
              <button
                onClick={() => { navigate('/packages'); setShowAccountDropdown(false); }}
                className="block w-full text-left px-3 py-2.5 mx-2 my-2 rounded-lg bg-gradient-premium text-white font-semibold transition-all hover:shadow-premium-lg transform hover:-translate-y-0.5 flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-0.921 1.603-0.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-0.364 1.118l1.07 3.292c.3.921-0.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-0.784.57-1.838-0.197-1.539-1.118l1.07-3.292a1 1 0 00-0.364-1.118L2.98 8.72c-0.783-0.57-0.38-1.81.588-1.81h3.461a1 1 0 00.951-0.69l1.07-3.292z" />
                </svg>
                {t.nav.proPage}
              </button>
            </div>
            <div className="border-t border-gray-100 dark:border-white/10 py-2">
              <div className="px-4 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wider">{t.nav.favorites.toUpperCase()}</div>

              <button
                onClick={() => { navigate('/favorites'); setShowAccountDropdown(false); }}
                className={`block w-full text-left px-4 py-2.5 flex justify-between items-center transition-colors ${isFavoritesListingsActive
                  ? 'bg-primary-50 text-primary-600 font-medium'
                  : 'text-gray-700 hover:bg-primary-50 hover:text-primary-600'
                  }`}
              >
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  {t.nav.favorites}
                </div>
                {favorites.length > 0 && (
                  <span className="badge-premium">
                    {favorites.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => { navigate('/following'); setShowAccountDropdown(false); }}
                className={`block w-full text-left px-4 py-2.5 flex justify-between items-center transition-colors ${isFavoritesUsersActive
                  ? 'bg-primary-50 text-primary-600 font-medium'
                  : 'text-gray-700 hover:bg-primary-50 hover:text-primary-600'
                  }`}
              >
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  {t.nav.following}
                </div>
                {followedSellers.length > 0 && (
                  <span className="badge-premium">
                    {followedSellers.length}
                  </span>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </section >
  );
};

// Normalize subcategory names from database to display names
export const normalizeSubcategoryName = (subcategoryName) => {
  const normalizationMap = {
    'Spor Etkinlikleri': 'Spor',
    'Çocuk Etkinlikleri': 'Çocuk',
    // Add more mappings as needed
  };

  return normalizationMap[subcategoryName] || subcategoryName;
};

// Category Sidebar Component
export const getCategoryPath = (categoryName, subcategoryName = null) => {
  const mainMappings = {
    'Tüm Kategoriler': 'Butun-Kategoriler',
    'Otomobil, Bisiklet & Tekne': 'Otomobil-Bisiklet-Tekne',
    'Otomobil, Bisiklet & Tekne Servisi': 'Otomobil-Bisiklet-Tekne',
    'Emlak': 'Emlak',
    'Ev & Bahçe': 'Ev-Bahce',
    'Moda & Güzellik': 'Moda-Guzellik',
    'Elektronik': 'Elektronik',
    'Evcil Hayvanlar': 'Evcil-Hayvanlar',
    'Aile, Çocuk & Bebek': 'Aile-Cocuk-Bebek',
    'İş İlanları': 'Is-Ilanlari',
    'Eğlence, Hobi & Mahalle': 'Eglence-Hobi-Mahalle',
    'Müzik, Film & Kitap': 'Muzik-Film-Kitap',
    'Biletler': 'Biletler',
    'Hizmetler': 'Hizmetler',
    'Ücretsiz & Takas': 'Ucretsiz-Takas',
    'Eğitim & Kurslar': 'Egitim-Kurslar',
    'Dersler & Kurslar': 'Egitim-Kurslar',
    'Komşu Yardımı': 'Komsu-Yardimi'
  };

  const subMappings = {
    // Auto, Rad & Boot
    'Otomobiller': 'Otomobiller',
    'Bisiklet & Aksesuarlar': 'Bisiklet-Aksesuarlar',
    'Bisiklet & Aksesuarları': 'Bisiklet-Aksesuarlar',
    'Oto Parça & Lastik': 'Oto-Parca-Lastik',
    'Tekne & Tekne Malzemeleri': 'Tekne-Tekne-Malzemeleri',
    'Motosiklet & Scooter': 'Motosiklet-Scooter',
    'Motosiklet Parça & Aksesuarlar': 'Motosiklet-Parca-Aksesuarlar',
    'Ticari Araçlar & Römorklar': 'Ticari-Araclar-Romorklar',
    'Tamir & Servis': 'Tamir-Servis',
    'Karavan & Motokaravan': 'Karavan-Motokaravan',
    'Diğer Otomobil, Bisiklet & Tekne': 'Diger-Otomobil-Bisiklet-Tekne',

    // Immobilien
    'Geçici Konaklama & Paylaşımlı Ev': 'Gecici-Konaklama-Paylasimli-Ev',
    'Geçici Konaklama & Paylaşımlı Oda': 'Gecici-Konaklama-Paylasimli-Ev',
    'Gecici Konaklamalar': 'Gecici-Konaklama-Paylasimli-Ev',
    'Konteyner': 'Konteyner',
    'Satılık Daireler': 'Satilik-Daireler',
    'Satılık Daire': 'Satilik-Daireler',
    'Satılık Yazlık': 'Satilik-Yazlik',
    'Tatil Evi & Yurt Dışı Emlak': 'Tatil-Evi-Yurt-Disi-Emlak',
    'Tatil ve Yurt Dışı Emlak': 'Tatil-Evi-Yurt-Disi-Emlak',
    'Garaj & Otopark': 'Garaj-Otopark',
    'Garaj & Park Yeri': 'Garaj-Otopark',
    'Ticari Emlak': 'Ticari-Emlak',
    'Arsa & Bahçe': 'Arsa-Bahce',
    'Satılık Evler': 'Satilik-Evler',
    'Satılık Müstakil Ev': 'Satilik-Evler',
    'Satılık Ev': 'Satilik-Evler',
    'Kiralık Evler': 'Kiralik-Evler',
    'Kiralık Müstakil Ev': 'Kiralik-Evler',
    'Kiralık Ev': 'Kiralik-Evler',
    'Kiralık Daireler': 'Kiralik-Daireler',
    'Kiralık Daire': 'Kiralik-Daireler',
    'Yeni Projeler': 'Yeni-Projeler',
    'Taşımacılık & Nakliye': 'Tasimacilik-Nakliye',
    'Diğer Emlak': 'Diger-Emlak',

    // Haus & Garten
    'Banyo': 'Banyo',
    'Ofis': 'Ofis',
    'Dekorasyon': 'Dekorasyon',
    'Ev Hizmetleri': 'Ev-Hizmetleri',
    'Bahçe Malzemeleri & Bitkiler': 'Bahce-Malzemeleri-Bitkiler',
    'Ev Tekstili': 'Ev-Tekstili',
    'Ev Tadilatı': 'Ev-Tadilati',
    'Yapı Market & Tadilat': 'Ev-Tadilati',
    'Mutfak & Yemek Odası': 'Mutfak-Yemek-Odasi',
    'Lamba & Aydınlatma': 'Lamba-Aydinlatma',
    'Aydınlatma': 'Lamba-Aydinlatma',
    'Yatak Odası': 'Yatak-Odasi',
    'Oturma Odası': 'Oturma-Odasi',
    'Diğer Ev & Bahçe': 'Diger-Ev-Bahce',

    // Moda & Güzellik
    'Güzellik & Sağlık': 'Guzellik-Saglik',
    'Kadın Giyimi': 'Kadin-Giyimi',
    'Kadın Ayakkabıları': 'Kadin-Ayakkabilari',
    'Erkek Giyimi': 'Erkek-Giyimi',
    'Erkek Ayakkabıları': 'Erkek-Ayakkabilari',
    'Çanta & Aksesuarlar': 'Canta-Aksesuarlar',
    'Saat & Takı': 'Saat-Taki',
    'Diğer Moda & Güzellik': 'Diger-Moda-Guzellik',

    // Elektronik
    'Ses & Hifi': 'Ses-Hifi',
    'Elektronik Servisler': 'Elektronik-Hizmetler',
    'Elektronik Hizmetler': 'Elektronik-Hizmetler',
    'Fotoğraf & Kamera': 'Fotograf-Kamera',
    'Cep Telefonu & Aksesuar': 'Cep-Telefonu-Telefon',
    'Cep Telefonu & Telefon': 'Cep-Telefonu-Telefon',
    'Beyaz Eşya & Ev Aletleri': 'Ev-Aletleri',
    'Ev Aletleri': 'Ev-Aletleri',
    'Oyun Konsolları': 'Konsollar',
    'Konsollar': 'Konsollar',
    'Dizüstü Bilgisayar': 'Dizustu-Bilgisayarlar',
    'Dizüstü Bilgisayarlar': 'Dizustu-Bilgisayarlar',
    'Masaüstü Bilgisayar': 'Bilgisayarlar',
    'Bilgisayarlar': 'Bilgisayarlar',
    'Bilgisayar Aksesuar & Yazılım': 'Bilgisayar-Aksesuarlari-Yazilim',
    'Bilgisayar Aksesuarları & Yazılım': 'Bilgisayar-Aksesuarlari-Yazilim',
    'Tablet & E-Okuyucu': 'Tabletler-E-Okuyucular',
    'Tabletler & E-Okuyucular': 'Tabletler-E-Okuyucular',
    'TV & Video': 'TV-Video',
    'Video Oyunları': 'Video-Oyunlari',
    'Diğer Elektronik': 'Diger-Elektronik',

    // Evcil Hayvanlar
    'Balıklar': 'Baliklar',
    'Köpekler': 'Kopekler',
    'Kediler': 'Kedi',
    'Küçük Hayvanlar': 'Kucuk-Hayvanlar',
    'Çiftlik Hayvanları': 'Ciftlik-Hayvanlari',
    'Atlar': 'Atlar',
    'Hayvan Bakımı & Eğitimi': 'Hayvan-Bakimi-Egitimi',
    'Hayvan Bakımı & Eğitim': 'Hayvan-Bakimi-Egitimi',
    'Kayıp Hayvanlar': 'Kayip-Hayvanlar',
    'Kuşlar': 'Kuslar',
    'Aksesuarlar': 'Aksesuarlar',

    // Aile, Çocuk & Bebek
    'Yaşlı Bakımı': 'Yasli-Bakimi',
    'Bebek & Çocuk Giyimi': 'Bebek-Cocuk-Giyimi',
    'Bebek & Çocuk Ayakkabıları': 'Bebek-Cocuk-Ayakkabilari',
    'Bebek Ekipmanları': 'Bebek-Ekipmanlari',
    'Oto Koltukları': 'Oto-Koltuklari',
    'Bebek Koltuğu & Oto Koltukları': 'Oto-Koltuklari',
    'Babysitter & Çocuk Bakımı': 'Babysitter-Cocuk-Bakimi',
    'Bebek Arabaları & Pusetler': 'Bebek-Arabalari-Pusetler',
    'Çocuk Odası Mobilyaları': 'Cocuk-Odasi-Mobilyalari',
    'Bebek Odası Mobilyaları': 'Cocuk-Odasi-Mobilyalari',
    'Oyuncaklar': 'Oyuncaklar',
    'Oyuncak': 'Oyuncaklar',
    'Diğer Aile, Çocuk & Bebek': 'Diger-Aile-Cocuk-Bebek',

    // İş İlanları
    'Mesleki Eğitim': 'Mesleki-Egitim',
    'İnşaat, Zanaat & Üretim': 'Insaat-Sanat-Uretim',
    'İnşaat, El Sanatları & Üretim': 'Insaat-Sanat-Uretim',
    'Büro İşleri & Yönetim': 'Buroarbeit-Yonetim',
    'Büroarbeit & Yönetim': 'Buroarbeit-Yonetim',
    'Ofis İşleri & Yönetim': 'Buroarbeit-Yonetim',
    'Gastronomi & Turizm': 'Gastronomi-Turizm',
    'Müşteri Hizmetleri & Çağrı Merkezi': 'Musteri-Hizmetleri-Cagri-Merkezi',
    'Yarı Zamanlı & Ek İşler': 'Ek-Isler',
    'Mini & Ek İşler': 'Ek-Isler',
    'Ek İşler': 'Ek-Isler',
    'Staj': 'Staj',
    'Sosyal Sektör & Bakım': 'Sosyal-Sektor-Bakim',
    'Nakliye, Lojistik & Trafik': 'Tasimacilik-Lojistik',
    'Taşımacılık & Lojistik': 'Tasimacilik-Lojistik',
    'Satış, Satın Alma & Pazarlama': 'Satis-Pazarlama',
    'Satış & Pazarlama': 'Satis-Pazarlama',
    'Diğer İş İlanları': 'Diger-Is-Ilanlari',

    // Eğlence, Hobi & Mahalle
    'Ezoterizm & Spiritüalizm': 'Ezoterizm-Spiritualizm',
    'Yiyecek & İçecek': 'Yiyecek-Icecek',
    'Boş Zaman Aktiviteleri': 'Bos-Zaman-Aktiviteleri',
    'El Sanatları & Hobi': 'El-Sanatlari-Hobi',
    'Sanat & Antikalar': 'Sanat-Antikalar',
    'Sanatçılar & Müzisyenler': 'Sanatcilar-Muzisyenler',
    'Model Yapımı': 'Model-Yapimi',
    'Seyahat & Etkinlik Hizmetleri': 'Seyahat-Etkinlik-Hizmetleri',
    'Koleksiyon': 'Koleksiyon',
    'Spor & Kamp': 'Spor-Kamp',
    'Bit Pazarı': 'Bit-Pazari',
    'Kayıp & Buluntu': 'Kayip-Buluntu',
    'Diğer Eğlence, Hobi & Mahalle': 'Diger-Eglence-Hobi-Mahalle',

    // Müzik, Film & Kitap
    'Kitap & Dergi': 'Kitap-Dergi',
    'Kırtasiye': 'Kirtasiye',
    'Çizgi Romanlar': 'Cizgi-Romanlar',
    'Ders Kitapları, Okul & Eğitim': 'Ders-Kitaplari-Okul-Egitim',
    'Film & DVD': 'Film-DVD',
    'Müzik & CD\'ler': 'Muzik-CDler',
    'Müzik Enstrümanları': 'Muzik-Enstrumanlari',
    'Diğer Müzik, Film & Kitap': 'Diger-Muzik-Film-Kitap',

    // Biletler
    'Tren & Toplu Taşıma': 'Tren-Toplu-Tasima',
    'Komedi & Kabare': 'Komedi-Kabare',
    'Hediye Kartları': 'Hediye-Kartlari',
    'Hediye Çekleri': 'Hediye-Kartlari',
    'Çocuk': 'Cocuk',
    'Çocuk Etkinlikleri': 'Cocuk',
    'Konserler': 'Konserler',
    'Spor': 'Spor',
    'Spor Etkinlikleri': 'Spor',
    'Tiyatro & Müzikal': 'Tiyatro-Muzikal',
    'Diğer Biletler': 'Diger-Biletler',

    // Hizmetler
    'Otomobil, Bisiklet & Tekne Servisi': 'Otomobil-Bisiklet-Tekne-Servisi',
    'Yaşlı Bakımı': 'Yasli-Bakimi',
    'Bebek Bakıcısı & Kreş': 'Babysitter-Cocuk-Bakimi',
    'Babysitter & Çocuk Bakımı': 'Babysitter-Cocuk-Bakimi',
    'Elektronik': 'Elektronik',
    'Elektronik Servisler': 'Elektronik-Hizmetler',
    'Ev & Bahçe': 'Ev-Bahce',
    'Ev & Bahçe Hizmetleri': 'Ev-Hizmetleri',
    'Ev Hizmetleri': 'Ev-Hizmetleri',
    'Sanatçılar & Müzisyenler': 'Sanatcilar-Muzisyenler',
    'Seyahat & Etkinlik': 'Seyahat-Etkinlik',
    'Hayvan Bakımı & Eğitimi': 'Hayvan-Bakimi-Egitimi',
    'Taşımacılık & Nakliye': 'Tasimacilik-Nakliye',
    'Diğer Hizmetler': 'Diger-Hizmetler',

    // Ücretsiz & Takas
    'Takas': 'Takas',
    'Ödünç Verme': 'Kiralama',
    'Kiralama': 'Kiralama',
    'Ücretsiz': 'Ucretsiz',
    'Ücretsiz Verilecekler': 'Ucretsiz',

    // Eğitim & Kurslar
    'Bilgisayar Kursları': 'Bilgisayar-Kurslari',
    'Ezoterizm & Spiritüalizm': 'Ezoterizm-Spiritualizm',
    'Yemek & Pastacılık': 'Yemek-Pastacilik-Kurslari',
    'Yemek & Pastacılık Kursları': 'Yemek-Pastacilik-Kurslari',
    'Sanat & Tasarım': 'Sanat-Tasarim-Kurslari',
    'Sanat & Tasarım Kursları': 'Sanat-Tasarim-Kurslari',
    'Müzik & Şan': 'Muzik-San-Dersleri',
    'Müzik & Şan Dersleri': 'Muzik-San-Dersleri',
    'Özel Ders': 'Ozel-Ders',
    'Spor Kursları': 'Spor-Kurslari',
    'Dil Kursları': 'Dil-Kurslari',
    'Dans Kursları': 'Dans-Kurslari',
    'Sürekli Eğitim': 'Surekli-Egitim',
    'Diğer Dersler & Kurslar': 'Diger-Dersler-Kurslar',
    'Diğer Eğitim & Kurslar': 'Diger-Dersler-Kurslar',

    // Komşu Yardımı
    'Komşu Yardımı': 'Komsu-Yardimi'
  };

  const slugify = (text) => {
    const trMap = {
      'ç': 'c', 'Ç': 'C', 'ğ': 'g', 'Ğ': 'G', 'ş': 's', 'Ş': 'S',
      'ı': 'i', 'İ': 'I', 'ö': 'o', 'Ö': 'O', 'ü': 'u', 'Ü': 'U'
    };
    for (let key in trMap) {
      text = text.replace(new RegExp(key, 'g'), trMap[key]);
    }
    return text.replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
  };

  const catSlug = mainMappings[categoryName] || slugify(categoryName);
  if (!subcategoryName || subcategoryName === 'Tümü' || subcategoryName === 'Alle' || subcategoryName === 'Tüm' || subcategoryName === categoryName) {
    return `/${catSlug}`;
  }

  const subSlug = subMappings[subcategoryName] || slugify(subcategoryName);
  return `/${catSlug}/${subSlug}`;
};

// CategorySidebar Component
export const CategorySidebar = ({ selectedCategory, setSelectedCategory }) => {
  const [expandedCategories, setExpandedCategories] = useState([]);
  const [categoriesWithCounts, setCategoriesWithCounts] = useState(categories);
  const navigate = useNavigate();

  // Fetch real category counts from Supabase
  useEffect(() => {
    const fetchCategoryCounts = async () => {
      try {
        const { fetchCategoryCounts: fetchCounts } = await import('../api/listings');
        const allListings = await fetchCounts();

        // Count listings by category and subcategory
        const counts = {};

        allListings.forEach(listing => {
          let cat = listing.category;
          const subCat = listing.sub_category;

          // Normalize category name
          if (cat === 'Musik, Film & Bücher' || cat === 'Musik, Filme & Bücher') {
            cat = 'Müzik, Film & Kitap';
          }
          if (cat === 'Immobilien') {
            cat = 'Emlak';
          }

          // Count main category
          counts[cat] = (counts[cat] || 0) + 1;

          // Count subcategory
          if (subCat) {
            const key = `${cat}:${subCat}`;
            counts[key] = (counts[key] || 0) + 1;
          }
        });

        // Update categories with real counts
        const updatedCategories = categories.map(category => {
          if (category.name === 'Tüm Kategoriler') {
            return { ...category, count: allListings.length };
          }

          const mainCount = counts[category.name] || 0;
          const updatedSubcategories = category.subcategories?.map(sub => ({
            ...sub,
            count: counts[`${category.name}:${sub.name}`] || 0
          }));

          return {
            ...category,
            count: mainCount,
            subcategories: updatedSubcategories || category.subcategories
          };
        });

        setCategoriesWithCounts(updatedCategories);
        console.log('Updated category counts from Supabase:', counts);

        // Debug: Show Aile, Çocuk & Bebek subcategory keys
        const familyKeys = Object.keys(counts).filter(k => k.startsWith('Aile, Çocuk & Bebek:'));
        console.log('Family subcategory keys:', familyKeys);
        console.log('Looking for: Aile, Çocuk & Bebek:Bebek Koltuğu & Oto Koltukları');
        console.log('Looking for: Aile, Çocuk & Bebek:Bebek Odası Mobilyaları');
      } catch (error) {
        console.error('Error fetching category counts:', error);
      }
    };

    fetchCategoryCounts();
  }, []);


  const toggleCategory = (categoryName) => {
    setExpandedCategories(prev =>
      prev.includes(categoryName)
        ? prev.filter(c => c !== categoryName)
        : [...prev, categoryName]
    );
  };

  return (
    <aside className="w-96 flex-shrink-0 bg-white rounded-2xl shadow-lg p-6 h-fit border border-gray-100">
      <h3 className="font-bold text-gray-900 mb-5 text-lg">Kategoriler</h3>

      <div className="space-y-1.5">
        {categoriesWithCounts.map((category) => (
          <div key={category.name}>
            <button
              onClick={() => {
                if (category.subcategories) {
                  toggleCategory(category.name);
                } else {
                  const url = getCategoryPath(category.name);
                  navigate(url);
                  setSelectedCategory(category.name);
                }
              }}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 text-left ${selectedCategory === category.name
                ? 'bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-md'
                : 'hover:bg-gray-50 text-gray-700 hover:shadow-sm'
                }`}
            >
              <span className="font-semibold text-sm flex-grow">{category.name}</span>
              <div className="flex items-center gap-2">
                {category.count > 0 && (
                  <span className={`text-xs px-2 py-0.5 rounded-full ${selectedCategory === category.name ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'}`}>
                    {category.count.toLocaleString('tr-TR')}
                  </span>
                )}
                {category.subcategories && (
                  <div className={`p-1 rounded-lg transition-colors ${selectedCategory === category.name ? 'hover:bg-white/10' : 'hover:bg-gray-200'}`}>
                    <svg
                      className={`w-4 h-4 transition-transform duration-200 ${expandedCategories.includes(category.name) ? 'rotate-180' : ''} ${selectedCategory === category.name ? 'text-white' : 'text-gray-400'}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                )}
              </div>
            </button>

            {/* Subcategories */}
            {category.subcategories && expandedCategories.includes(category.name) && (
              <div className="ml-4 mt-1 space-y-1 pl-2">
                {/* Main Category Link inside subcategories */}
                <button
                  onClick={() => {
                    navigate(getCategoryPath(category.name));
                    setSelectedCategory(category.name);
                  }}
                  className="w-full flex items-center px-4 py-2 rounded-lg text-left text-xs font-black text-red-600 hover:bg-red-50 transition-all border border-transparent hover:border-red-100"
                >
                  <svg className="w-3.5 h-3.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                  Tüm {category.name}
                </button>
                {category.subcategories.map((sub) => (
                  <button
                    key={sub.name}
                    onClick={() => {
                      const path = getCategoryPath(category.name, sub.name);
                      if (path) {
                        navigate(path);
                        setSelectedCategory(sub.name);
                      } else {
                        setSelectedCategory(sub.name);
                      }
                    }}
                    className={`w-full flex items-center justify-between px-3 py-1.5 rounded-md transition-colors text-left text-sm ${selectedCategory === sub.name
                      ? 'bg-red-50 text-red-600 font-medium'
                      : 'text-gray-600 hover:bg-gray-50'
                      }`}
                  >
                    <span>{sub.name}</span>
                    <span className="text-xs text-gray-400">({(sub.count || 0).toLocaleString('tr-TR')})</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </aside>
  );
};

// Listing Card Component

export default SearchSection;

