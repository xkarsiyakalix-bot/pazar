import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import LoadingSpinner from './LoadingSpinner';
import ListingCard from './ListingCard';
import HorizontalListingCard from './HorizontalListingCard';
import { Breadcrumb } from './Breadcrumb';
import { categories as allCategories } from '../data/categories';
import { getCategoryPath } from './SearchSection';

const GenericCategoryPage = ({
    category,
    subCategory,
    pageTitle,
    filterConfig = {},
    bannerConfig = {},
    toggleFavorite,
    isFavorite,
    renderCustomFields
}) => {
    const location = useLocation();
    const navigate = useNavigate();

    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState(0);
    const [filters, setFilters] = useState({});
    const [sortBy, setSortBy] = useState('newest');
    const [showMobileFilters, setShowMobileFilters] = useState(false);

    // Parse filters from URL
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const newFilters = {};
        params.forEach((value, key) => {
            newFilters[key] = value;
        });
        setFilters(newFilters);
    }, [location.search]);

    // Fetch listings
    useEffect(() => {
        const fetchListings = async () => {
            setLoading(true);
            try {
                let query = supabase
                    .from('listings')
                    .select('*', { count: 'exact' })
                    .eq('status', 'active');

                if (category) query = query.eq('category', category);
                if (subCategory) query = query.eq('sub_category', subCategory);

                if (filters.minPrice) query = query.gte('price', parseFloat(filters.minPrice));
                if (filters.maxPrice) query = query.lte('price', parseFloat(filters.maxPrice));

                // Apply filterConfig fields
                Object.entries(filterConfig).forEach(([key, config]) => {
                    if (config.field && filters[key] && config.type !== 'range') {
                        query = query.eq(config.field, filters[key]);
                    }
                });

                if (sortBy === 'newest') query = query.order('created_at', { ascending: false });
                else if (sortBy === 'price-asc') query = query.order('price', { ascending: true });
                else if (sortBy === 'price-desc') query = query.order('price', { ascending: false });

                const { data, count, error } = await query;
                if (error) throw error;
                setListings(data || []);
                setTotal(count || 0);
            } catch (err) {
                console.error('Error fetching listings:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchListings();
    }, [category, subCategory, filters, sortBy]);

    const handleFilterChange = (key, value) => {
        const newFilters = { ...filters };
        if (!value || value === '') delete newFilters[key];
        else newFilters[key] = value;
        const params = new URLSearchParams();
        Object.entries(newFilters).forEach(([k, v]) => { if (v) params.append(k, v); });
        const qs = params.toString();
        navigate(`${location.pathname}${qs ? `?${qs}` : ''}`);
    };

    const clearAllFilters = () => navigate(location.pathname);
    const activeFilterCount = Object.keys(filters).length;

    // Find parent category data for sidebar navigation
    const parentCategoryData = allCategories.find(cat => cat.name === category);

    // Render a single filterConfig section
    const renderFilterSection = (key, config) => {
        if (config.type === 'range' || config.label === 'Fiyat') {
            return (
                <div key={key} className="mb-5 pb-5 border-b border-gray-100 dark:border-white/5">
                    <h4 className="text-xs font-bold text-gray-500 dark:text-neutral-400 uppercase tracking-wider mb-3">{config.label}</h4>
                    <div className="grid grid-cols-2 gap-2">
                        <div>
                            <label className="block text-xs text-gray-400 mb-1">Min</label>
                            <input
                                type="number"
                                placeholder="0"
                                value={filters['minPrice'] || ''}
                                onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                                className="w-full border border-gray-200 dark:border-white/10 bg-white dark:bg-neutral-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-300"
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-gray-400 mb-1">Max</label>
                            <input
                                type="number"
                                placeholder="∞"
                                value={filters['maxPrice'] || ''}
                                onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                                className="w-full border border-gray-200 dark:border-white/10 bg-white dark:bg-neutral-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-300"
                            />
                        </div>
                    </div>
                </div>
            );
        }

        if (config.type === 'multiselect') {
            const options = config.options || [];
            const currentValue = filters[key] || '';
            return (
                <div key={key} className="mb-5 pb-5 border-b border-gray-100 dark:border-white/5">
                    <h4 className="text-xs font-bold text-gray-500 dark:text-neutral-400 uppercase tracking-wider mb-3">{config.label}</h4>
                    <div className="space-y-0.5 max-h-60 overflow-y-auto pr-1 custom-scrollbar">
                        {options.map((opt) => {
                            const optValue = typeof opt === 'object' ? opt.value : opt;
                            const optLabel = typeof opt === 'object' ? opt.label : opt;
                            const isSelected = currentValue === optValue;
                            return (
                                <button
                                    key={optValue}
                                    onClick={() => handleFilterChange(key, isSelected ? '' : optValue)}
                                    className={`w-full flex items-center gap-3 px-3 py-1.5 rounded-lg text-sm transition-all text-left ${
                                        isSelected
                                            ? 'bg-red-50 dark:bg-rose-500/10 text-red-600 dark:text-rose-400 font-semibold'
                                            : 'text-gray-600 dark:text-neutral-400 hover:bg-gray-50 dark:hover:bg-neutral-700/50 hover:text-red-600'
                                    }`}
                                >
                                    <div className={`w-4 h-4 rounded border transition-all flex items-center justify-center flex-shrink-0 ${
                                        isSelected 
                                            ? 'bg-red-500 border-red-500 shadow-sm shadow-red-200' 
                                            : 'border-gray-300 dark:border-neutral-600 bg-white dark:bg-neutral-800'
                                    }`}>
                                        {isSelected && (
                                            <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3.5} d="M5 13l4 4L19 7" />
                                            </svg>
                                        )}
                                    </div>
                                    <span className="flex-1">{optLabel}</span>
                                    <span className={`text-xs ${isSelected ? 'text-red-400' : 'text-gray-400'}`}>
                                        (0)
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            );
        }
        return null;
    };

    const breadcrumbItems = [
        { label: 'ExVitrin', path: '/' },
        category ? { label: category, path: getCategoryPath(category) } : null,
        subCategory ? { label: subCategory, isActive: true } : { label: pageTitle, isActive: true }
    ].filter(Boolean);

    const bgColor = bannerConfig.bgColor || 'bg-gradient-to-r from-red-500 to-rose-600';

    const SidebarContent = () => (
        <div className="space-y-0">
            {/* === CATEGORIES SECTION === */}
            <div className="mb-5 pb-5 border-b border-gray-200 dark:border-white/5">
                <h3 className="font-bold text-gray-900 dark:text-neutral-100 text-base mb-3">Kategoriler</h3>
                <div className="space-y-0.5">
                    {/* Tüm Kategoriler */}
                    <button
                        onClick={() => navigate('/Butun-Kategoriler')}
                        className="w-full text-left px-3 py-2 rounded-lg text-sm transition-all flex items-center justify-between group text-gray-600 dark:text-neutral-400 hover:bg-gray-50 dark:hover:bg-neutral-700 hover:text-red-600"
                    >
                        <span>Tüm Kategoriler</span>
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
 
                    {/* Parent Category */}
                    {parentCategoryData && (
                        <div>
                            <button
                                onClick={() => navigate(getCategoryPath(category))}
                                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all flex items-center justify-between ${
                                    !subCategory
                                        ? 'bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-md'
                                        : 'text-gray-700 dark:text-neutral-300 hover:bg-gray-50 dark:hover:bg-neutral-700 font-medium'
                                }`}
                            >
                                <span>{category}</span>
                                <svg className={`w-4 h-4 rotate-90 ${!subCategory ? 'text-white' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>

                            {/* Subcategories of parent */}
                            <div className="ml-4 pl-3 mt-1 space-y-0.5">
                                {parentCategoryData.subcategories?.map((sub) => (
                                    <button
                                        key={sub.name}
                                        onClick={() => navigate(getCategoryPath(category, sub.name))}
                                        className={`w-full text-left px-3 py-1.5 rounded-lg text-sm transition-all flex items-center justify-between ${
                                            subCategory === sub.name
                                                ? 'bg-red-50 dark:bg-rose-500/10 text-red-600 dark:text-rose-400 font-bold'
                                                : 'text-gray-600 dark:text-neutral-400 hover:bg-gray-50 dark:hover:bg-neutral-700 hover:text-red-600'
                                        }`}
                                    >
                                        <span>{sub.name}</span>
                                        <span className={`text-xs ${subCategory === sub.name ? 'text-red-400' : 'text-gray-400'}`}>
                                            ({sub.count || 0})
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* === FILTER SECTIONS from filterConfig === */}
            {Object.keys(filterConfig).length > 0 && (
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-gray-900 dark:text-neutral-100 text-base">Filtreler</h3>
                        {activeFilterCount > 0 && (
                            <button
                                onClick={clearAllFilters}
                                className="text-sm text-red-600 dark:text-rose-400 hover:underline font-medium"
                            >
                                Sıfırla
                            </button>
                        )}
                    </div>
                    {Object.entries(filterConfig).map(([key, config]) =>
                        renderFilterSection(key, config)
                    )}
                </div>
            )}
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-neutral-900 transition-colors">
            <div className="max-w-[1400px] mx-auto px-4 py-6">

                {/* Breadcrumb Bar */}
                <div className="flex items-center gap-3 mb-6 bg-white dark:bg-neutral-800/50 p-3 rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm">
                    <button
                        onClick={() => setShowMobileFilters(true)}
                        className="xl:hidden flex items-center gap-2 px-4 py-2 bg-gradient-to-br from-red-500 to-rose-600 text-white rounded-xl shadow-md transition-all active:scale-95 shrink-0"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                        </svg>
                        <span className="text-sm font-bold">Filtrele</span>
                        {activeFilterCount > 0 && (
                            <span className="w-5 h-5 bg-yellow-400 text-gray-900 text-xs font-bold rounded-full flex items-center justify-center animate-pulse">{activeFilterCount}</span>
                        )}
                    </button>
                    <div className="flex-1 overflow-hidden">
                        <Breadcrumb items={breadcrumbItems} />
                    </div>
                </div>

                <div className="flex flex-col xl:flex-row gap-8">
                    {/* Sidebar - Desktop */}
                    <aside className={`
                        fixed inset-0 z-[1002] xl:relative xl:inset-auto xl:z-0 xl:w-[280px] xl:min-w-[280px]
                        ${showMobileFilters ? 'block' : 'hidden xl:block'}
                    `}>
                        {/* Mobile Backdrop */}
                        <div
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm xl:hidden"
                            onClick={() => setShowMobileFilters(false)}
                        />
                        <div className={`
                            relative w-[85vw] sm:w-[70vw] md:w-[50vw] xl:w-auto h-full xl:h-fit
                            bg-white dark:bg-neutral-800 xl:rounded-2xl shadow-2xl xl:shadow-lg p-6
                            overflow-y-auto sticky top-6 border-r dark:border-white/5 xl:border-none
                        `}>
                            {/* Mobile header */}
                            <div className="flex items-center justify-between xl:hidden mb-5 pb-4 border-b dark:border-white/5">
                                <h3 className="font-bold text-lg">Kategoriler & Filtreler</h3>
                                <button onClick={() => setShowMobileFilters(false)} className="p-2 text-gray-400 hover:text-red-600">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            <SidebarContent />
                        </div>
                    </aside>

                    {/* Main Content */}
                    <div className="flex-1 min-w-0">
                        {/* Banner */}
                        <div className={`${bgColor} sm:rounded-2xl rounded-none shadow-xl p-4 sm:p-8 mb-6 relative overflow-hidden`}>
                            <div className="absolute inset-0 opacity-10">
                                <div className="absolute inset-0" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,.1) 35px, rgba(255,255,255,.1) 70px)' }} />
                            </div>
                            <div className="relative z-10 flex items-center justify-between">
                                <div>
                                    <h1 className="text-2xl sm:text-4xl font-bold text-white mb-1">{pageTitle}</h1>
                                    {bannerConfig.description && <p className="text-white/90 text-sm sm:text-base">{bannerConfig.description}</p>}
                                </div>
                                <div className="hidden lg:block text-center text-white">
                                    <div className="text-3xl font-bold">{total}</div>
                                    <div className="text-sm opacity-90">İlan</div>
                                </div>
                            </div>
                        </div>

                        {/* Sort + Count Row */}
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-neutral-100">
                                {loading ? '...' : total} İlan
                            </h2>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="border border-gray-200 dark:border-white/10 bg-white dark:bg-neutral-800 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-300"
                            >
                                <option value="newest">En Yeni</option>
                                <option value="price-asc">Fiyat (Düşük → Yüksek)</option>
                                <option value="price-desc">Fiyat (Yüksek → Düşük)</option>
                            </select>
                        </div>

                        {/* Listings */}
                        {loading ? (
                            <div className="flex justify-center items-center py-20">
                                <LoadingSpinner size="large" />
                            </div>
                        ) : listings.length === 0 ? (
                            <div className="text-center py-20 bg-white dark:bg-neutral-800 rounded-2xl border border-dashed border-gray-200 dark:border-neutral-700">
                                <p className="text-gray-500 text-lg">Bu kategoride henüz ilan bulunmamaktadır.</p>
                            </div>
                        ) : (
                            <>
                                {/* Mobile grid */}
                                <div className="grid grid-cols-2 gap-2 sm:hidden">
                                    {listings.map((listing) => (
                                        <ListingCard
                                            key={listing.id}
                                            listing={listing}
                                            toggleFavorite={toggleFavorite}
                                            isFavorite={isFavorite}
                                        />
                                    ))}
                                </div>
                                {/* Desktop horizontal cards */}
                                <div className="hidden sm:block space-y-4">
                                    {listings.map((listing) => (
                                        <HorizontalListingCard
                                            key={listing.id}
                                            listing={listing}
                                            toggleFavorite={toggleFavorite}
                                            isFavorite={isFavorite}
                                            renderCustomFields={renderCustomFields}
                                        />
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GenericCategoryPage;
