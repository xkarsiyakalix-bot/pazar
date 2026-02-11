import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { categories } from '../data/categories';
import { t } from '../translations';
import { searchApi } from '../api/search';
import { supabase } from '../lib/supabase';
import { getListingUrl } from '../utils/slug';

const MobileSearchOverlay = ({ isOpen, onClose, initialSearchTerm = '' }) => {
    const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
    const [recentSearches, setRecentSearches] = useState([]);
    const [suggestions, setSuggestions] = useState({ categories: [], listings: [] });
    const [isSearchingSuggestions, setIsSearchingSuggestions] = useState(false);
    const [inactiveCategories, setInactiveCategories] = useState(new Set());
    const navigate = useNavigate();
    const inputRef = useRef(null);

    // Load recent searches on mount
    useEffect(() => {
        const saved = localStorage.getItem('recentSearches');
        if (saved) {
            try {
                setRecentSearches(JSON.parse(saved));
            } catch (e) {
                console.error('Error loading recent searches:', e);
            }
        }
    }, []);

    // Focus input when overlay opens
    useEffect(() => {
        if (isOpen) {
            setTimeout(() => {
                inputRef.current?.focus();
            }, 100);
            document.body.style.overflow = 'hidden';

            // Fetch inactive categories
            const fetchInactive = async () => {
                const { data } = await supabase.from('category_settings').select('category_name').eq('is_active', false);
                if (data) setInactiveCategories(new Set(data.map(i => i.category_name)));
            };
            fetchInactive();
        } else {
            document.body.style.overflow = 'auto';
        }
        return () => { document.body.style.overflow = 'auto'; };
    }, [isOpen]);

    // Suggestion logic
    useEffect(() => {
        const fetchSuggestions = async () => {
            const queryTerm = searchTerm.trim();
            if (queryTerm.length < 2) {
                setSuggestions({ categories: [], listings: [] });
                return;
            }
            setIsSearchingSuggestions(true);
            try {
                const data = await searchApi.getSuggestions(queryTerm);
                const termLower = queryTerm.toLowerCase();
                const staticMatches = [];
                categories.forEach(cat => {
                    if (inactiveCategories.has(cat.name)) return;
                    if (cat.name.toLowerCase().includes(termLower) && cat.name !== 'Tüm Kategoriler') staticMatches.push(cat.name);
                    if (cat.subcategories) {
                        cat.subcategories.forEach(sub => {
                            if (!inactiveCategories.has(sub.name) && sub.name.toLowerCase().includes(termLower)) staticMatches.push(sub.name);
                        });
                    }
                });
                const combined = [...new Set([...staticMatches, ...(data.categories || [])])]
                    .filter(c => c && c !== 'Tüm Kategoriler' && !inactiveCategories.has(c))
                    .slice(0, 4);
                setSuggestions({ categories: combined, listings: (data.listings || []).slice(0, 5) });
            } catch (error) {
                console.error(error);
            } finally {
                setIsSearchingSuggestions(false);
            }
        };
        const timer = setTimeout(fetchSuggestions, 300);
        return () => clearTimeout(timer);
    }, [searchTerm, inactiveCategories]);

    const handleSearch = (e) => {
        e?.preventDefault();
        if (searchTerm.trim()) {
            // Save to recent searches
            const updated = [searchTerm.trim(), ...recentSearches.filter(s => s !== searchTerm.trim())].slice(0, 5);
            localStorage.setItem('recentSearches', JSON.stringify(updated));

            navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
            onClose();
        }
    };

    const clearRecentSearches = () => {
        localStorage.removeItem('recentSearches');
        setRecentSearches([]);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] bg-white dark:bg-neutral-900 flex flex-col animate-in fade-in slide-in-from-bottom duration-300">
            {/* Header */}
            <div className="h-[72px] flex-shrink-0 border-b border-neutral-100 dark:border-white/5 flex items-center gap-2 px-4">
                <button
                    onClick={onClose}
                    className="w-10 h-10 flex items-center justify-center text-neutral-500 dark:text-neutral-400 active:scale-95 transition-transform"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <form onSubmit={handleSearch} className="flex-1">
                    <div className="relative flex items-center">
                        <input
                            ref={inputRef}
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Ne arıyorsunuz?"
                            className="w-full h-11 bg-neutral-100 dark:bg-neutral-800 border-none rounded-xl px-4 pr-10 text-sm focus:ring-2 focus:ring-red-500/20 text-neutral-900 dark:text-neutral-100"
                        />
                        {searchTerm && (
                            <button
                                type="button"
                                onClick={() => setSearchTerm('')}
                                className="absolute right-0 w-10 h-11 flex items-center justify-center text-neutral-400 active:scale-90 transition-transform"
                            >
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                            </button>
                        )}
                    </div>
                </form>

                <button
                    onClick={handleSearch}
                    disabled={!searchTerm.trim()}
                    className="px-2 h-11 flex items-center justify-center text-red-600 font-bold text-sm disabled:opacity-50"
                >
                    Ara
                </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-8">
                {searchTerm.trim().length >= 2 ? (
                    <div className="space-y-6">
                        {/* General Search */}
                        <button
                            onClick={() => handleSearch()}
                            className="w-full flex items-center gap-3 p-3 bg-neutral-50 dark:bg-neutral-800 rounded-2xl"
                        >
                            <div className="w-10 h-10 rounded-xl bg-white dark:bg-neutral-700 flex items-center justify-center text-red-500 shadow-sm">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            <div className="text-left">
                                <div className="text-sm font-bold text-neutral-900 dark:text-neutral-100">{searchTerm}</div>
                                <div className="text-[10px] text-neutral-400 uppercase tracking-wider">Genel Ara</div>
                            </div>
                        </button>

                        {/* Category Suggestions */}
                        {suggestions.categories.length > 0 && (
                            <div className="space-y-2">
                                <h3 className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest pl-1">Şu Kategorilerde Ara</h3>
                                {suggestions.categories.map((cat, i) => (
                                    <button
                                        key={i}
                                        onClick={() => {
                                            navigate(`/search?q=${encodeURIComponent(searchTerm)}&category=${encodeURIComponent(cat)}`);
                                            onClose();
                                        }}
                                        className="w-full flex items-center justify-between p-3 bg-white dark:bg-neutral-800 border border-neutral-100 dark:border-white/5 rounded-2xl active:scale-[0.98] transition-all"
                                    >
                                        <div className="flex items-center gap-3 min-w-0">
                                            <div className="text-neutral-300 dark:text-neutral-600 flex-shrink-0">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2z" />
                                                </svg>
                                            </div>
                                            <div className="flex flex-col min-w-0">
                                                <div className="flex items-center gap-1.5 flex-wrap">
                                                    <span className="text-sm text-neutral-400 font-medium">"{searchTerm}"</span>
                                                    <span className="text-[10px] text-red-500 font-bold px-1.5 py-0.5 bg-red-50 dark:bg-rose-500/10 rounded-md">içinde</span>
                                                </div>
                                                <span className="text-sm font-bold text-neutral-900 dark:text-neutral-100 mt-0.5">{cat}</span>
                                            </div>
                                        </div>
                                        <svg className="w-4 h-4 text-neutral-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Listing Suggestions */}
                        {suggestions.listings.length > 0 && (
                            <div className="space-y-3">
                                <h3 className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest pl-1">Hızlı Bakış</h3>
                                {suggestions.listings.map((listing) => (
                                    <button
                                        key={listing.id}
                                        onClick={() => {
                                            navigate(getListingUrl(listing));
                                            onClose();
                                        }}
                                        className="w-full flex items-center gap-3 p-2 bg-white dark:bg-neutral-800 rounded-2xl border border-neutral-100 dark:border-white/5"
                                    >
                                        <div className="w-12 h-12 rounded-xl overflow-hidden bg-neutral-100 dark:bg-neutral-700 flex-shrink-0">
                                            {listing.thumbnail_url ? (
                                                <img src={listing.thumbnail_url} className="w-full h-full object-cover" alt="" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-neutral-400">🖼️</div>
                                            )}
                                        </div>
                                        <div className="flex-1 text-left overflow-hidden">
                                            <div className="text-sm font-bold text-neutral-900 dark:text-neutral-100 truncate">{listing.title}</div>
                                            <div className="text-xs text-red-600 font-bold">{listing.price?.toLocaleString('tr-TR')} TL</div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                ) : (
                    <>
                        {/* Recent Searches */}
                        {recentSearches.length > 0 && (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-xs font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest">Son Aramalar</h3>
                                    <button
                                        onClick={clearRecentSearches}
                                        className="text-[10px] text-neutral-400 hover:text-red-500 transition-colors"
                                    >
                                        Temizle
                                    </button>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {recentSearches.map((term, i) => (
                                        <button
                                            key={i}
                                            onClick={() => {
                                                setSearchTerm(term);
                                                navigate(`/search?q=${encodeURIComponent(term)}`);
                                                onClose();
                                            }}
                                            className="px-4 py-2 bg-neutral-100 dark:bg-neutral-800 rounded-full text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors flex items-center gap-2"
                                        >
                                            <svg className="w-3.5 h-3.5 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            {term}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Quick Categories */}
                        <div className="space-y-4">
                            <h3 className="text-xs font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest">Kategorilere Göz At</h3>
                            <div className="grid grid-cols-2 gap-3">
                                {categories.slice(0, 8).map((cat) => (
                                    <button
                                        key={cat.name}
                                        onClick={() => {
                                            navigate(`/search?category=${encodeURIComponent(cat.name)}`);
                                            onClose();
                                        }}
                                        className="p-4 bg-white dark:bg-neutral-800 border border-neutral-100 dark:border-white/5 rounded-2xl text-left hover:shadow-md transition-all group"
                                    >
                                        <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">{cat.icon || '📦'}</div>
                                        <div className="text-sm font-bold text-neutral-900 dark:text-neutral-100 line-clamp-1">{cat.name}</div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Help Text */}
                        <div className="py-8 text-center bg-neutral-50 dark:bg-neutral-800/50 rounded-3xl p-6">
                            <div className="text-3xl mb-3">🔍</div>
                            <h4 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 mb-1">Ne Arıyorsunuz?</h4>
                            <p className="text-xs text-neutral-500 dark:text-neutral-400">Araba, emlak veya teknoloji... Milyonlarca ilan parmaklarınızın ucunda.</p>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default MobileSearchOverlay;
