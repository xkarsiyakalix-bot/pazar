import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { SEO } from '../SEO';
import { Breadcrumb, HorizontalListingCard, ListingCard } from '../components';
import LoadingSpinner from '../components/LoadingSpinner';
import { findBrandBySlug, formatBrandDisplayName } from '../utils/brandUtils';

export const BrandPage = ({ slug: propSlug, toggleFavorite, isFavorite }) => {
    const params = useParams();
    const slug = propSlug || params.slug || '';

    const brandData = useMemo(() => findBrandBySlug(slug), [slug]);
    const brandName = useMemo(() => formatBrandDisplayName(slug, brandData), [slug, brandData]);

    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sortBy, setSortBy] = useState('newest');
    const [viewMode, setViewMode] = useState('horizontal'); // 'horizontal' or 'grid'

    useEffect(() => {
        let isMounted = true;

        const fetchBrandListings = async () => {
            if (!slug && !brandName) return;
            setLoading(true);

            try {
                let query = supabase
                    .from('listings')
                    .select('*')
                    .eq('status', 'active');

                // Search keywords: brand name + aliases + clean slug
                const searchTerms = new Set();
                if (brandName) searchTerms.add(brandName);
                if (brandData?.name) searchTerms.add(brandData.name);
                if (brandData?.aliases) {
                    brandData.aliases.forEach(a => searchTerms.add(a));
                }

                // If slug has no hyphens and reasonable length, also add slug
                if (slug && !slug.includes('-')) searchTerms.add(slug);

                // Build OR filters
                const conditions = [];
                searchTerms.forEach(term => {
                    const cleanTerm = term.trim();
                    if (!cleanTerm) return;
                    conditions.push(`marke.ilike.%${cleanTerm}%`);
                    conditions.push(`car_brand.ilike.%${cleanTerm}%`);
                    conditions.push(`damenbekleidung_marke.ilike.%${cleanTerm}%`);
                    conditions.push(`damenschuhe_marke.ilike.%${cleanTerm}%`);
                    conditions.push(`herrenbekleidung_marke.ilike.%${cleanTerm}%`);
                    conditions.push(`herrenschuhe_marke.ilike.%${cleanTerm}%`);
                    conditions.push(`title.ilike.%${cleanTerm}%`);
                });

                if (conditions.length > 0) {
                    query = query.or(conditions.join(','));
                }

                // Sorting
                if (sortBy === 'price_asc') {
                    query = query.order('price', { ascending: true, nullsFirst: false });
                } else if (sortBy === 'price_desc') {
                    query = query.order('price', { ascending: false, nullsLast: true });
                } else {
                    query = query.order('created_at', { ascending: false });
                }

                query = query.limit(60);

                const { data, error } = await query;
                if (error) throw error;

                if (isMounted) {
                    setListings(data || []);
                }
            } catch (err) {
                console.error('Error fetching brand listings:', err);
                if (isMounted) setListings([]);
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        fetchBrandListings();

        return () => {
            isMounted = false;
        };
    }, [slug, brandName, brandData, sortBy]);

    const breadcrumbs = [
        { name: 'Ana Sayfa', url: '/' },
        { name: 'Markalar', url: '#' },
        { name: brandName, url: `/${slug}` }
    ];

    const seoTitle = `${brandName} İkinci El ve Sıfır İlanları | ExVitrin`;
    const seoDesc = `En güncel ${brandName} ilanları, ikinci el ve sıfır fiyatları ExVitrin'de! Güvenli alışveriş ve uygun fiyatlarla hemen keşfedin.`;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-neutral-900 transition-colors">
            <SEO
                title={seoTitle}
                description={seoDesc}
                canonical={`https://www.exvitrin.com/${slug}`}
                openGraph={{
                    title: seoTitle,
                    description: seoDesc,
                    url: `https://www.exvitrin.com/${slug}`
                }}
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <Breadcrumb items={breadcrumbs} />

                {/* Hero Header */}
                <div className="bg-white dark:bg-neutral-800 rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100 dark:border-neutral-700 mt-4 mb-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <span className="inline-block px-3 py-1 bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 rounded-full text-xs font-bold tracking-wider uppercase mb-2">
                                Marka Vitrini
                            </span>
                            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
                                {brandName} İlanları
                            </h1>
                            <p className="text-gray-500 dark:text-neutral-400 text-sm mt-1">
                                {brandName} markasına ait tüm 2. el ve sıfır satılık/kiralık ilanlar
                            </p>
                        </div>
                        <div className="flex items-center gap-3 self-start md:self-auto">
                            <Link
                                to="/add-listing"
                                className="inline-flex items-center justify-center px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-xl shadow-sm transition-all"
                            >
                                + {brandName} İlanı Ver
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Filter and View Mode Bar */}
                <div className="bg-white dark:bg-neutral-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-neutral-700 mb-6 flex flex-wrap items-center justify-between gap-4">
                    <div className="text-sm text-gray-600 dark:text-neutral-400 font-medium">
                        {loading ? 'Yükleniyor...' : `${listings.length} ilan bulundu`}
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Sort Selector */}
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="bg-gray-50 dark:bg-neutral-700 border border-gray-200 dark:border-neutral-600 text-gray-700 dark:text-neutral-200 text-sm rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none"
                        >
                            <option value="newest">En Yeni İlanlar</option>
                            <option value="price_asc">Fiyata Göre (Artan)</option>
                            <option value="price_desc">Fiyata Göre (Azalan)</option>
                        </select>

                        {/* View Mode Toggle */}
                        <div className="flex bg-gray-100 dark:bg-neutral-700 p-1 rounded-lg">
                            <button
                                onClick={() => setViewMode('horizontal')}
                                className={`p-1.5 rounded-md transition-all ${
                                    viewMode === 'horizontal'
                                        ? 'bg-white dark:bg-neutral-600 text-red-600 dark:text-red-400 shadow-sm'
                                        : 'text-gray-500 dark:text-neutral-400 hover:text-gray-700'
                                }`}
                                title="Yatay Liste Görünümü"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </button>
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-1.5 rounded-md transition-all ${
                                    viewMode === 'grid'
                                        ? 'bg-white dark:bg-neutral-600 text-red-600 dark:text-red-400 shadow-sm'
                                        : 'text-gray-500 dark:text-neutral-400 hover:text-gray-700'
                                }`}
                                title="Grid Görünümü"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Listings Display */}
                {loading ? (
                    <div className="py-20 flex justify-center">
                        <LoadingSpinner size="large" />
                    </div>
                ) : listings.length === 0 ? (
                    <div className="bg-white dark:bg-neutral-800 rounded-2xl p-12 text-center border border-gray-100 dark:border-neutral-700">
                        <div className="w-16 h-16 bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                            Henüz {brandName} ilanı bulunmuyor
                        </h3>
                        <p className="text-gray-500 dark:text-neutral-400 max-w-md mx-auto mb-6 text-sm">
                            Bu markaya ait ilk ilanı siz vererek binlerce alıcıya hemen ulaşabilirsiniz.
                        </p>
                        <Link
                            to="/add-listing"
                            className="inline-flex items-center justify-center px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl shadow-md transition-all text-sm"
                        >
                            Hemen İlan Ver
                        </Link>
                    </div>
                ) : viewMode === 'horizontal' ? (
                    <div className="space-y-4">
                        {listings.map((item) => (
                            <HorizontalListingCard
                                key={item.id}
                                listing={item}
                                toggleFavorite={toggleFavorite}
                                isFavorite={isFavorite ? isFavorite(item.id) : false}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {listings.map((item) => (
                            <ListingCard
                                key={item.id}
                                listing={item}
                                toggleFavorite={toggleFavorite}
                                isFavorite={isFavorite ? isFavorite(item.id) : false}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default BrandPage;
