import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { SEO } from '../SEO';
import { Breadcrumb, HorizontalListingCard, ListingCard } from '../components';
import LoadingSpinner from '../components/LoadingSpinner';
import { findBrandBySlugAsync, formatBrandDisplayName, matchesSpecificModel } from '../utils/brandUtils';
import { getPhoneModels } from '../data/phoneBrands';

export const BrandPage = ({ slug: propSlug, toggleFavorite, isFavorite }) => {
    const params = useParams();
    const slug = propSlug || params.slug || '';

    const [brandData, setBrandData] = useState(null);

    // Async brand lookup — keeps allBrands.json out of the main bundle
    useEffect(() => {
        let cancelled = false;
        findBrandBySlugAsync(slug).then(data => {
            if (!cancelled) setBrandData(data);
        });
        return () => { cancelled = true; };
    }, [slug]);

    const brandName = useMemo(() => formatBrandDisplayName(slug, brandData), [slug, brandData]);

    const [listings, setListings] = useState([]);
    const [fallbackListings, setFallbackListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sortBy, setSortBy] = useState('newest');
    const [viewMode, setViewMode] = useState('horizontal'); // 'horizontal' or 'grid'
    const [searchParams, setSearchParams] = useSearchParams();
    const modelParam = searchParams.get('model') || '';
    const [selectedModel, setSelectedModel] = useState(modelParam);

    useEffect(() => {
        setSelectedModel(modelParam);
    }, [modelParam]);

    const handleSelectModel = (modelName) => {
        const nextModel = selectedModel.toLowerCase() === (modelName || '').toLowerCase() ? '' : modelName;
        setSelectedModel(nextModel);
        const nextParams = new URLSearchParams(searchParams);
        if (nextModel) {
            nextParams.set('model', nextModel);
        } else {
            nextParams.delete('model');
        }
        setSearchParams(nextParams, { replace: true });
    };

    const availableModels = useMemo(() => {
        return getPhoneModels(brandName) || [];
    }, [brandName]);

    const displayedListings = useMemo(() => {
        if (!selectedModel) return listings;
        return listings.filter(l => matchesSpecificModel(selectedModel, l.modell, l.title));
    }, [listings, selectedModel]);

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
                    const safeTerm = cleanTerm.replace(/\s+/g, '%');
                    conditions.push(`marke.ilike.%${safeTerm}%`);
                    conditions.push(`handy_telefon_art.ilike.%${safeTerm}%`);
                    conditions.push(`car_brand.ilike.%${safeTerm}%`);
                    conditions.push(`modell.ilike.%${safeTerm}%`);
                    conditions.push(`damenbekleidung_marke.ilike.%${safeTerm}%`);
                    conditions.push(`damenschuhe_marke.ilike.%${safeTerm}%`);
                    conditions.push(`herrenbekleidung_marke.ilike.%${safeTerm}%`);
                    conditions.push(`herrenschuhe_marke.ilike.%${safeTerm}%`);
                    conditions.push(`title.ilike.%${safeTerm}%`);
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
                    const found = data || [];
                    setListings(found);

                    // Thin Content Önleme: Eğer bu markada henüz ilan yoksa,
                    // sayfanın Google botları ve kullanıcılar için dopdolu görünmesi için popüler ilanları getir
                    if (found.length === 0) {
                        try {
                            let fbQuery = supabase
                                .from('listings')
                                .select('*')
                                .eq('status', 'active');
                            if (brandData?.category) {
                                fbQuery = fbQuery.ilike('category', `%${brandData.category}%`);
                            }
                            const { data: fbData } = await fbQuery
                                .order('created_at', { ascending: false })
                                .limit(12);
                            if (isMounted && fbData && fbData.length > 0) {
                                setFallbackListings(fbData);
                            }
                        } catch (fbErr) {
                            console.error('Error fetching fallback listings:', fbErr);
                        }
                    } else {
                        setFallbackListings([]);
                    }
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
        { label: 'Ana Sayfa', path: '/' },
        { label: 'Markalar', path: '/markalar' },
        { label: brandName, path: `/${slug}` }
    ];

    const seoTitle = `${brandName} İkinci El ve Sıfır İlanları | ExVitrin`;
    const seoDesc = `En güncel ${brandName} ilanları, ikinci el ve sıfır fiyatları ExVitrin'de! Güvenli alışveriş ve uygun fiyatlarla hemen keşfedin.`;

    const faqItems = useMemo(() => [
        {
            q: `${brandName} ikinci el ürün alırken nelere dikkat edilmeli?`,
            a: `${brandName} markalı ürün alırken ürünün orijinallik etiketlerini, kullanım durumunu, fatura veya garanti belgesini kontrol etmeniz ve satıcı ile ExVitrin içi güvenli mesajlaşma üzerinden teyit etmeniz önerilir.`
        },
        {
            q: `ExVitrin'de ${brandName} ilanı vermek ücretsiz mi?`,
            a: `Evet, ExVitrin üzerinde ${brandName} markalı sıfır veya ikinci el ürünleriniz için tamamen ücretsiz ve komisyonsuz ilan oluşturabilirsiniz.`
        },
        {
            q: `${brandName} ürünlerinin fiyatları neye göre belirlenir?`,
            a: `${brandName} ürün fiyatları; ürünün kondisyonu, kullanım süresi, model yılı, kutu ve aksesuarlarının tam olup olmamasına göre satıcılar tarafından serbest piyasa koşullarında belirlenir.`
        }
    ], [brandName]);

    const brandFaqSchema = useMemo(() => ({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        'mainEntity': faqItems.map(item => ({
            '@type': 'Question',
            'name': item.q,
            'acceptedAnswer': {
                '@type': 'Answer',
                'text': item.a
            }
        }))
    }), [faqItems]);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-neutral-900 transition-colors">
            <SEO
                title={seoTitle}
                description={seoDesc}
                canonical={`https://www.exvitrin.com/${slug}`}
                schema={brandFaqSchema}
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
                            <div className="flex items-center gap-2 mb-2">
                                <span className="inline-block px-3 py-1 bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 rounded-full text-xs font-bold tracking-wider uppercase">
                                    {brandData?.category ? `${brandData.category} Vitrini` : 'Marka Vitrini'}
                                </span>
                                <Link
                                    to="/markalar"
                                    className="text-xs text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                                >
                                    (Tüm Markalar ›)
                                </Link>
                            </div>
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

                {/* Model Chips Filter (if available models exist for this brand) */}
                {availableModels.length > 0 && (
                    <div className="mb-4">
                        <div className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar">
                            <button
                                onClick={() => handleSelectModel('')}
                                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                                    !selectedModel
                                        ? 'bg-red-600 text-white shadow-sm'
                                        : 'bg-white dark:bg-neutral-800 text-gray-700 dark:text-neutral-300 border border-gray-200 dark:border-neutral-700 hover:border-red-500'
                                }`}
                            >
                                Tüm Modeller ({listings.length})
                            </button>
                            {availableModels.map(m => {
                                const isMSelected = selectedModel.toLowerCase() === m.name.toLowerCase();
                                const count = listings.filter(l => 
                                    matchesSpecificModel(m.name, l.modell, l.title)
                                ).length;

                                return (
                                    <button
                                        key={m.name}
                                        onClick={() => handleSelectModel(m.name)}
                                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                                            isMSelected
                                                ? 'bg-red-600 text-white shadow-sm'
                                                : 'bg-white dark:bg-neutral-800 text-gray-700 dark:text-neutral-300 border border-gray-200 dark:border-neutral-700 hover:border-red-500'
                                        }`}
                                    >
                                        <span>{m.name}</span>
                                        {count > 0 && (
                                            <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isMSelected ? 'bg-red-700 text-white' : 'bg-gray-100 dark:bg-neutral-700 text-gray-500'}`}>
                                                {count}
                                            </span>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Filter and View Mode Bar */}
                <div className="bg-white dark:bg-neutral-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-neutral-700 mb-6 flex flex-wrap items-center justify-between gap-4">
                    <div className="text-sm text-gray-600 dark:text-neutral-400 font-medium">
                        {loading 
                            ? 'Yükleniyor...' 
                            : displayedListings.length > 0 
                                ? `${displayedListings.length} ilan bulundu` 
                                : `0 ${brandName} ilanı (Önerilen Popüler İlanlar Gösteriliyor)`}
                        {selectedModel && <span className="ml-2 text-xs text-red-500">({selectedModel} filtrelendi)</span>}
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
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
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
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
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
                ) : displayedListings.length > 0 ? (
                    viewMode === 'horizontal' ? (
                        <div className="space-y-4">
                            {displayedListings.map((item) => (
                                <HorizontalListingCard
                                    key={item.id}
                                    listing={item}
                                    toggleFavorite={toggleFavorite}
                                    isFavorite={typeof isFavorite === 'function' ? isFavorite(item.id) : Boolean(isFavorite)}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {displayedListings.map((item) => (
                                <ListingCard
                                    key={item.id}
                                    listing={item}
                                    toggleFavorite={toggleFavorite}
                                    isFavorite={typeof isFavorite === 'function' ? isFavorite(item.id) : Boolean(isFavorite)}
                                />
                            ))}
                        </div>
                    )
                ) : (
                    <div className="space-y-8">
                        {/* Callout Card */}
                        <div className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-neutral-800 dark:to-neutral-800/80 rounded-2xl p-6 sm:p-8 border border-red-100 dark:border-neutral-700 flex flex-col sm:flex-row items-center justify-between gap-6">
                            <div className="text-center sm:text-left">
                                <span className="inline-block px-2.5 py-0.5 bg-red-600 text-white rounded-md text-xs font-semibold mb-2">
                                    Fırsat
                                </span>
                                <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                                    İlk {brandName} İlanını Siz Verin!
                                </h3>
                                <p className="text-gray-600 dark:text-neutral-300 text-sm mt-1 max-w-xl">
                                    Bu markaya ait bir ürün mü satmak istiyorsunuz? Ücretsiz ilanınızı saniyeler içinde oluşturarak ExVitrin'deki binlerce potansiyel alıcıya hemen ulaşın.
                                </p>
                            </div>
                            <Link
                                to="/add-listing"
                                className="inline-flex items-center justify-center px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl shadow-md transition-all text-sm whitespace-nowrap"
                            >
                                + Ücretsiz İlan Ver
                            </Link>
                        </div>

                        {/* Fallback Listings Section — Ensures page has rich content for SEO and users */}
                        {fallbackListings.length > 0 && (
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                            İlginizi Çekebilecek Popüler İlanlar
                                        </h2>
                                        <p className="text-xs text-gray-500 dark:text-neutral-400 mt-0.5">
                                            {brandData?.category ? `${brandData.category} ve ilgili kategorilerde en son eklenenler` : 'ExVitrin vitrinindeki güncel ilanlar'}
                                        </p>
                                    </div>
                                    <Link
                                        to="/categories"
                                        className="text-xs font-semibold text-red-600 dark:text-red-400 hover:underline"
                                    >
                                        Tüm İlanları Gör ›
                                    </Link>
                                </div>

                                {viewMode === 'horizontal' ? (
                                    <div className="space-y-4">
                                        {fallbackListings.map((item) => (
                                            <HorizontalListingCard
                                                key={item.id}
                                                listing={item}
                                                toggleFavorite={toggleFavorite}
                                                isFavorite={typeof isFavorite === 'function' ? isFavorite(item.id) : Boolean(isFavorite)}
                                            />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                        {fallbackListings.map((item) => (
                                            <ListingCard
                                                key={item.id}
                                                listing={item}
                                                toggleFavorite={toggleFavorite}
                                                isFavorite={typeof isFavorite === 'function' ? isFavorite(item.id) : Boolean(isFavorite)}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {/* Rich SEO Content & FAQ Section */}
                <div className="mt-12 bg-white dark:bg-neutral-800 rounded-2xl p-6 sm:p-8 border border-gray-100 dark:border-neutral-700 space-y-6">
                    <div>
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                            {brandName} Hakkında & İkinci El Alışveriş Rehberi
                        </h2>
                        <p className="text-sm text-gray-600 dark:text-neutral-300 leading-relaxed">
                            ExVitrin {brandName} vitrini, güvenilir ve uygun fiyatlı ikinci el ve sıfır {brandName} ürünlerini alıcı ve satıcılarla buluşturur. 
                            Geniş ürün yelpazesi, kullanıcı değerlendirmeleri ve anlık mesajlaşma sistemiyle güvenle alışveriş yapabilir, 
                            kullanmadığınız {brandName} ürünlerinizi hızlıca nakde dönüştürebilirsiniz.
                        </p>
                    </div>

                    <div className="border-t border-gray-100 dark:border-neutral-700 pt-6">
                        <h3 className="text-base font-bold text-gray-900 dark:text-white mb-4">
                            Sıkça Sorulan Sorular ({brandName})
                        </h3>
                        <div className="space-y-3">
                            {faqItems.map((item, idx) => (
                                <details key={idx} className="group bg-gray-50 dark:bg-neutral-700/50 rounded-xl p-4 border border-gray-100 dark:border-neutral-700 cursor-pointer">
                                    <summary className="font-semibold text-sm text-gray-800 dark:text-neutral-200 flex items-center justify-between list-none">
                                        <span>{item.q}</span>
                                        <span className="text-gray-400 group-open:rotate-180 transition-transform">▾</span>
                                    </summary>
                                    <p className="mt-2 text-xs text-gray-600 dark:text-neutral-300 leading-relaxed">
                                        {item.a}
                                    </p>
                                </details>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BrandPage;
