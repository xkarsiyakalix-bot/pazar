import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { searchApi } from './api/search';
import { HorizontalListingCard, ListingCard, Breadcrumb } from './components';
import LoadingSpinner from './components/LoadingSpinner';
import { createSavedSearch, checkIfSearchIsSaved, deleteSavedSearchByUrl } from './api/savedSearches';
import { useAuth } from './contexts/AuthContext';
import { getTurkishCities, getCategoryTranslation, t } from './translations';
import { SKELETON_CONFIG } from './config/skeletonConfig';
import { ListingGridSkeleton } from './components/skeletons/ListingCardSkeleton';

const SearchResultsPage = ({ toggleFavorite, isFavorite }) => {
    const categories = [
        {
            name: 'Tüm Kategoriler', icon: '🏪',
            subcategories: []
        },
        {
            name: 'Otomobil, Bisiklet & Tekne', icon: '🚗',
            subcategories: [
                'Otomobiller', 'Oto Parça & Lastik', 'Tekne & Tekne Malzemeleri',
                'Bisiklet & Aksesuarlar', 'Motosiklet & Scooter', 'Motosiklet Parça & Aksesuarlar',
                'Ticari Araçlar & Römorklar', 'Tamir & Servis', 'Karavan & Motokaravan', 'Diğer Otomobil, Bisiklet & Tekne'
            ]
        },
        {
            name: 'Emlak', icon: '🏠',
            subcategories: [
                'Geçici Konaklama & Paylaşımlı Ev', 'Konteyner', 'Satılık Daire', 'Satılık Yazlık',
                'Tatil Evi & Yurt Dışı Emlak', 'Garaj & Otopark', 'Ticari Emlak', 'Arsa & Bahçe',
                'Satılık Müstakil Ev', 'Kiralık Müstakil Ev', 'Kiralık Daire', 'Yeni Projeler',
                'Taşımacılık & Nakliye', 'Diğer Emlak'
            ]
        },
        {
            name: 'Ev & Bahçe', icon: '🏡',
            subcategories: ['Banyo', 'Ofis', 'Dekorasyon', 'Ev Hizmetleri', 'Bahçe Malzemeleri & Bitkiler', 'Ev Tekstili', 'Ev Tadilatı', 'Mutfak & Yemek Odası', 'Lamba & Aydınlatma', 'Yatak Odası', 'Oturma Odası', 'Diğer Ev & Bahçe']
        },
        {
            name: 'Moda & Güzellik', icon: '👗',
            subcategories: ['Güzellik & Sağlık', 'Kadın Giyimi', 'Kadın Ayakkabıları', 'Erkek Giyimi', 'Erkek Ayakkabıları', 'Çanta & Aksesuarlar', 'Saat & Takı', 'Diğer Moda & Güzellik']
        },
        {
            name: 'Elektronik', icon: '📱',
            subcategories: ['Ses & Hifi', 'Elektronik Hizmetler', 'Fotoğraf & Kamera', 'Cep Telefonu & Telefon', 'Ev Aletleri', 'Konsollar', 'Dizüstü Bilgisayarlar', 'Bilgisayarlar', 'Bilgisayar Aksesuarları & Yazılım', 'Tabletler & E-Okuyucular', 'TV & Video', 'Video Oyunları', 'Diğer Elektronik']
        },
        {
            name: 'Evcil Hayvanlar', icon: '🐾',
            subcategories: ['Balıklar', 'Köpekler', 'Kediler', 'Küçük Hayvanlar', 'Çiftlik Hayvanları', 'Atlar', 'Hayvan Bakımı & Eğitim', 'Kayıp Hayvanlar', 'Kuşlar', 'Aksesuarlar']
        },
        {
            name: 'Aile, Çocuk & Bebek', icon: '👶',
            subcategories: ['Yaşlı Bakımı', 'Bebek & Çocuk Giyimi', 'Bebek & Çocuk Ayakkabıları', 'Bebek Ekipmanları', 'Bebek Koltuğu & Oto Koltukları', 'Babysitter & Çocuk Bakımı', 'Bebek Arabaları & Pusetler', 'Bebek Odası Mobilyaları', 'Oyuncaklar', 'Diğer Aile, Çocuk & Bebek']
        },
        {
            name: 'İş İlanları', icon: '💼',
            subcategories: ['Mesleki Eğitim', 'İnşaat, El Sanatları & Üretim', 'Büro İşleri & Yönetim', 'Gastronomi & Turizm', 'Müşteri Hizmetleri & Çağrı Merkezi', 'Ek İşler', 'Staj', 'Sosyal Sektör & Bakım', 'Taşımacılık & Lojistik', 'Satış & Pazarlama', 'Diğer İş İlanları']
        },
        {
            name: 'Eğlence, Hobi & Mahalle', icon: '⚽',
            subcategories: ['Ezoterizm & Spiritüalizm', 'Yiyecek & İçecek', 'Boş Zaman Aktiviteleri', 'El Sanatları & Hobi', 'Sanat & Antikalar', 'Sanatçılar & Müzisyenler', 'Model Yapımı', 'Seyahat & Etkinlik Hizmetleri', 'Koleksiyon', 'Spor & Camping', 'Bit Pazarı', 'Kayıp & Buluntu', 'Diğer Eğlence, Hobi & Mahalle']
        },
        {
            name: 'Müzik, Film & Kitap', icon: '🎵',
            subcategories: ['Kitap & Dergi', 'Kırtasiye', 'Çizgi Romanlar', 'Ders Kitapları, Okul & Eğitim', 'Film & DVD', "Müzik & CD'ler", 'Müzik Enstrümanları', 'Diğer Müzik, Film & Kitap']
        },
        {
            name: 'Biletler', icon: '🎫',
            subcategories: ['Tren & Toplu Taşıma', 'Komedi & Kabare', 'Hediye Çekleri', 'Çocuk Etkinlikleri', 'Konserler', 'Spor', 'Tiyatro & Müzikal', 'Diğer Biletler']
        },
        {
            name: 'Hizmetler', icon: '🔧',
            subcategories: ['Yaşlı Bakımı', 'Otomobil, Bisiklet & Tekne', 'Babysitter & Çocuk Bakımı', 'Elektronik', 'Ev & Bahçe', 'Sanatçılar & Müzisyenler', 'Seyahat & Etkinlik', 'Hayvan Bakımı & Eğitim', 'Taşımacılık & Nakliye', 'Diğer Hizmetler']
        },
        {
            name: 'Ücretsiz & Takas', icon: '🎁',
            subcategories: ['Takas', 'Kiralama', 'Ücretsiz']
        },
        {
            name: 'Eğitim & Kurslar', icon: '📚',
            subcategories: ['Bilgisayar Kursları', 'Ezoterizm & Spiritüalizm', 'Yemek & Pastacılık', 'Sanat & Tasarım', 'Müzik & Şan', 'Özel Ders', 'Spor Kursları', 'Dil Kursları', 'Dans Kursları', 'Sürekli Eğitim', 'Diğer Eğitim & Kurslar']
        },
        {
            name: 'Komşu Yardımı', icon: '🤝',
            subcategories: ['Komşu Yardımı']
        }
    ];

    const allCities = getTurkishCities();
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();

    // Read from URL
    const query = searchParams.get('q') || '';
    const category = searchParams.get('category') || 'Tüm Kategoriler';
    const subCategoryFromURL = searchParams.get('sub_category') || '';
    const location = searchParams.get('location') || '';

    // Initialize filters from URL or defaults
    const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || 'created_at');
    const [sortOrder, setSortOrder] = useState(searchParams.get('sortOrder') || 'desc');
    const [priceRange, setPriceRange] = useState(searchParams.get('priceRange') || 'all');
    const [condition, setCondition] = useState(searchParams.get('condition') || 'all');
    const [subCategory, setSubCategory] = useState(subCategoryFromURL);
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSaved, setIsSaved] = useState(false);
    const [citySearch, setCitySearch] = useState('');
    const [categoryCounts, setCategoryCounts] = useState({});
    const [cityCounts, setCityCounts] = useState({});
    const [showFilters, setShowFilters] = useState(false);
    const { user } = useAuth();

    // -- Mobile Search Panel Logic --
    const [searchQuery, setSearchQuery] = useState(query);
    useEffect(() => setSearchQuery(query), [query]);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        const params = new URLSearchParams(searchParams);
        if (searchQuery.trim()) {
            params.set('q', searchQuery.trim());
        } else {
            params.delete('q');
        }
        setSearchParams(params);
    };

    // Sync filters to URL whenever they change
    useEffect(() => {
        const params = new URLSearchParams(searchParams);

        // Keep existing params
        if (query) params.set('q', query);
        if (category && category !== 'Tüm Kategoriler') params.set('category', category);
        if (subCategory) params.set('sub_category', subCategory);
        else params.delete('sub_category');
        if (location) params.set('location', location);

        // Add filter params (only if not default)
        if (sortBy !== 'created_at') params.set('sortBy', sortBy);
        else params.delete('sortBy');

        if (sortOrder !== 'desc') params.set('sortOrder', sortOrder);
        else params.delete('sortOrder');

        if (priceRange !== 'all') params.set('priceRange', priceRange);
        else params.delete('priceRange');

        if (condition !== 'all') params.set('condition', condition);
        else params.delete('condition');

        // Update URL without causing navigation
        setSearchParams(params, { replace: true });
    }, [sortBy, sortOrder, priceRange, condition, subCategory, category]);

    // Fetch search results from Supabase
    useEffect(() => {
        const fetchResults = async () => {
            setLoading(true);
            try {
                // Calculate price range
                let minPrice = null;
                let maxPrice = null;

                switch (priceRange) {
                    case 'under100':
                        maxPrice = 100;
                        break;
                    case '100-500':
                        minPrice = 100;
                        maxPrice = 500;
                        break;
                    case '500-1000':
                        minPrice = 500;
                        maxPrice = 1000;
                        break;
                    case 'over1000':
                        minPrice = 1000;
                        break;
                    default:
                        break;
                }

                // Build search params
                const params = searchApi.buildParams({
                    query,
                    category: category !== 'Tüm Kategoriler' ? category : '',
                    subCategory: subCategory || '',
                    location: location !== 'Türkiye' ? location : '',
                    minPrice,
                    maxPrice,
                    condition: condition !== 'all' ? condition : null,
                    sortBy,
                    sortOrder
                });

                // Fetch from API
                const data = await searchApi.search(params);
                setResults(data);
            } catch (error) {
                console.error('Error fetching search results:', error);
                setResults([]);
            } finally {
                setLoading(false);
            }
        };

        fetchResults();
    }, [query, category, location, sortBy, sortOrder, priceRange, condition]);

    // Check if this search is already saved
    useEffect(() => {
        const checkSavedStatus = async () => {
            if (!user) return;
            const searchUrl = window.location.pathname + window.location.search;
            const savedSearch = await checkIfSearchIsSaved(searchUrl);
            setIsSaved(!!savedSearch);
        };

        checkSavedStatus();
    }, [user, query, category, location, sortBy, sortOrder, priceRange, condition]);

    // Fetch category counts
    useEffect(() => {
        const fetchCounts = async () => {
            const params = {
                q: query,
                location: location !== 'Türkiye' ? location : ''
            };
            const counts = await searchApi.getCategoryCounts(params);
            setCategoryCounts(counts);

            // Fetch city counts (filtered by query and category)
            const cityParams = {
                q: query,
                category: category !== 'Tüm Kategoriler' ? category : ''
            };
            const cityCountsData = await searchApi.getCityCounts(cityParams);
            setCityCounts(cityCountsData);
        };

        fetchCounts();
    }, [query, location, category]);

    // Handle saving/unsaving search
    const handleToggleSave = async () => {
        if (!user) {
            alert('Aramayı kaydetmek için lütfen giriş yapın.');
            return;
        }

        const searchUrl = window.location.pathname + window.location.search;

        try {
            if (isSaved) {
                await deleteSavedSearchByUrl(searchUrl);
                setIsSaved(false);
            } else {
                await createSavedSearch({
                    searchName: query || category || 'Arama',
                    category: category,
                    filters: {
                        location,
                        sortBy,
                        sortOrder,
                        priceRange,
                        condition
                    },
                    searchUrl: searchUrl
                });
                setIsSaved(true);
            }
        } catch (error) {
            console.error('Error toggling saved search:', error);
            alert('İşlem sırasında bir hata oluştu.');
        }
    };

    // Update sort when sortBy changes
    const handleSortChange = (value) => {
        switch (value) {
            case 'price-asc':
                setSortBy('price');
                setSortOrder('asc');
                break;
            case 'price-desc':
                setSortBy('price');
                setSortOrder('desc');
                break;
            case 'newest':
                setSortBy('created_at');
                setSortOrder('desc');
                break;
            case 'relevance':
            default:
                setSortBy('created_at');
                setSortOrder('desc');
                break;
        }
    };

    // Generate breadcrumb items
    const breadcrumbItems = [
        { label: 'ExVitrin', path: '/' },
        { label: query ? `"${query}" Arama Sonuçları` : 'Tüm İlanlar', isActive: true }
    ];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-neutral-900 pb-12 transition-colors">
            <div className="max-w-[1400px] mx-auto px-4 py-6">


                {/* Başlık ve Sonuç Sayısı */}
                <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4 px-0 sm:px-4 md:px-0">
                    <div>
                        <h1 className="text-xl md:text-3xl font-bold text-gray-900 dark:text-neutral-100 mb-2">
                            {query ? `"${query}" için arama sonuçları` : 'Tüm İlanlar'}
                        </h1>
                        <p className="text-gray-600 dark:text-neutral-400">
                            {results.length} {results.length === 1 ? 'ilan' : 'ilan'} bulundu
                            {category && category !== 'Tüm Kategoriler' && ` - ${category}`}
                            {location && location !== 'Türkiye' && ` - ${location}`}
                        </p>
                    </div>

                    {/* Aramayı Kaydet Butonu */}
                    <button
                        onClick={handleToggleSave}
                        className={`
                            flex items-center justify-center gap-2 transition-all shadow-sm hover:shadow-md
                            /* Mobile Styles: Icon only, circular or small pill */
                            w-10 h-10 rounded-full p-0
                            /* Desktop Styles: Full button */
                            md:w-auto md:h-auto md:px-6 md:py-2 md:rounded-lg md:font-medium
                            ${isSaved
                                ? 'bg-red-50 dark:bg-rose-500/10 text-red-600 dark:text-rose-400 border border-red-200 dark:border-rose-500/20'
                                : 'bg-red-500 text-white hover:bg-red-600'
                            }
                        `}
                        title={isSaved ? 'Aramayı Kaydettiniz' : 'Aramayı Kaydet'}
                    >
                        {isSaved ? (
                            <>
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                                </svg>
                                <span className="hidden md:inline">Aramayı Kaydettiniz</span>
                            </>
                        ) : (
                            <>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                                </svg>
                                <span className="hidden md:inline">Aramayı Kaydet</span>
                            </>
                        )}
                    </button>
                </div>

                <div className="flex items-center gap-3 mb-6 bg-white dark:bg-neutral-800/50 p-3 rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm">
                    {/* Mobile/Tablet Filter Button */}
                    <button
                        onClick={() => setShowFilters(true)}
                        className="xl:hidden flex items-center gap-2 px-4 py-2 bg-gradient-to-br from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white rounded-xl shadow-md hover:shadow-lg transition-all active:scale-95 group shrink-0"
                    >
                        <svg className="w-5 h-5 transition-transform group-hover:rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                        </svg>
                        <span className="text-sm font-bold">Filtrele</span>
                        {(priceRange !== 'all' || condition !== 'all' || sortBy !== 'created_at') && (
                            <span className="w-5 h-5 bg-yellow-400 text-gray-900 text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
                                !
                            </span>
                        )}
                    </button>

                    <div className="flex-1 overflow-hidden">
                        <Breadcrumb items={breadcrumbItems} />
                    </div>
                </div>

                <div className="flex flex-col xl:flex-row gap-8">
                    {/* Filtreler - Mobilde çekmece, Desktop'ta solda */}
                    <aside className={`
                        fixed inset-0 z-[1002] xl:relative xl:inset-auto xl:z-0 xl:w-[20%] xl:min-w-[320px] xl:block
                        ${showFilters ? 'block' : 'hidden xl:block'}
                    `}>
                        {/* Mobile Overlay Backdrop */}
                        <div
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm xl:hidden animate-in fade-in duration-300"
                            onClick={() => setShowFilters(false)}
                        />

                        {/* Sidebar Content Column - Balanced width on mobile */}
                        <div className={`
                            relative w-[85vw] sm:w-[70vw] md:w-[50vw] xl:w-auto h-full xl:h-fit bg-white dark:bg-neutral-800 xl:rounded-2xl shadow-2xl xl:shadow-lg p-6 
                            overflow-y-auto xl:overflow-visible sticky top-0 xl:top-6 xl:ml-0 border-r dark:border-white/5 xl:border-none
                            ${showFilters ? 'animate-in slide-in-from-left duration-300' : ''}
                        `}>
                            {/* Mobile Header */}
                            <div className="flex items-center justify-between xl:hidden mb-6 pb-4 border-b dark:border-white/5">
                                <h3 className="font-bold text-gray-900 dark:text-neutral-100 text-lg">Filtreleme</h3>
                                <button
                                    onClick={() => setShowFilters(false)}
                                    className="p-2 -mr-2 text-gray-400 hover:text-red-600 transition-colors"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-neutral-100 mb-4">Filtreler</h2>

                            {/* Sıralama */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
                                    Sıralama kriteri
                                </label>
                                <select
                                    value={`${sortBy}-${sortOrder}`}
                                    onChange={(e) => handleSortChange(e.target.value)}
                                    className="w-full border border-gray-300 dark:border-white/10 bg-white dark:bg-neutral-800 rounded-lg px-3 py-2 text-gray-900 dark:text-neutral-100 focus:ring-2 focus:ring-red-400 dark:focus:ring-rose-500/20 focus:border-transparent"
                                >
                                    <option value="relevance">Önerilen</option>
                                    <option value="newest">En yeni ilanlar</option>
                                    <option value="price-asc">Fiyat (Önce en düşük)</option>
                                    <option value="price-desc">Fiyat (Önce en yüksek)</option>
                                </select>
                            </div>

                            {/* Kategoriler */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
                                    Kategoriler
                                </label>
                                <div className="space-y-1">
                                    {categories
                                        .map((cat) => (
                                            <div key={cat.name}>
                                                <button
                                                    onClick={() => {
                                                        const params = new URLSearchParams(searchParams);
                                                        if (cat.name === 'Tüm Kategoriler') {
                                                            params.delete('category');
                                                            params.delete('sub_category');
                                                            setSubCategory('');
                                                        } else {
                                                            params.set('category', cat.name);
                                                            // If switching main category, clear subcategory
                                                            if (category !== cat.name) {
                                                                params.delete('sub_category');
                                                                setSubCategory('');
                                                            }
                                                        }
                                                        setSearchParams(params);
                                                    }}
                                                    className={`w-full text-left px-2 py-1.5 rounded-md text-sm transition-colors flex items-center justify-between group ${category === cat.name || (category === 'Tüm Kategoriler' && cat.name === 'Tüm Kategoriler')
                                                        ? 'bg-red-50 dark:bg-rose-500/10 text-red-600 dark:text-rose-400 font-medium'
                                                        : 'text-gray-600 dark:text-neutral-400 hover:bg-gray-50 dark:hover:bg-neutral-700'
                                                        }`}
                                                >
                                                    <div className="flex items-center justify-between w-full">
                                                        <span>{getCategoryTranslation(cat.name)}</span>
                                                        {cat.name !== 'Tüm Kategoriler' && (
                                                            <span className={`text-xs ${category === cat.name ? 'text-red-500 dark:text-rose-500' : 'text-gray-400 dark:text-neutral-500 opacity-60'}`}>
                                                                {categoryCounts[cat.name] || 0}
                                                            </span>
                                                        )}
                                                    </div>
                                                </button>

                                                {/* Subcategories - Expanded if main category selected */}
                                                {category === cat.name && cat.subcategories && cat.subcategories.length > 0 && (
                                                    <div className="ml-4 pl-3 my-1 space-y-0.5 animate-in slide-in-from-top-2 duration-200">
                                                        {cat.subcategories.map(sub => (
                                                            <button
                                                                key={sub}
                                                                onClick={() => {
                                                                    setSubCategory(sub === subCategory ? '' : sub);
                                                                }}
                                                                className={`w-full text-left px-2 py-1.5 rounded-md text-xs transition-colors flex items-center justify-between group ${subCategory === sub
                                                                    ? 'bg-red-100 dark:bg-rose-500/10 text-red-700 dark:text-rose-400 font-bold'
                                                                    : 'text-gray-500 dark:text-neutral-400 hover:bg-gray-50 dark:hover:bg-neutral-700 hover:text-red-600 dark:hover:text-rose-400'
                                                                    }`}
                                                            >
                                                                <span>{getCategoryTranslation(sub)}</span>
                                                                {subCategory === sub && (
                                                                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                                    </svg>
                                                                )}
                                                            </button>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                </div>
                            </div>



                            {/* Zustand (Condition) Filter */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
                                    Durum
                                </label>
                                <div className="space-y-2">
                                    {[
                                        { val: 'all', label: 'Hepsi' },
                                        { val: 'Yeni', label: 'Yeni' },
                                        { val: 'Yeni gibi', label: 'Yeni gibi' },
                                        { val: 'Çok iyi', label: 'Çok iyi' },
                                        { val: 'İyi', label: 'İyi' },
                                        { val: 'Kabul edilebilir', label: 'Kabul edilebilir' },
                                        { val: 'Kullanılmış', label: 'Kullanılmış' },
                                        { val: 'Defolu / Arızalı', label: 'Defolu / Arızalı' }
                                    ].map((cond) => (
                                        <label key={cond.val} className="flex items-center cursor-pointer group">
                                            <input
                                                type="checkbox"
                                                checked={condition === cond.val}
                                                onChange={() => setCondition(cond.val)}
                                                className="w-4 h-4 text-red-600 dark:text-rose-500 border-gray-300 dark:border-white/10 rounded-none focus:ring-red-500 dark:focus:ring-rose-500/20 dark:bg-neutral-800"
                                            />
                                            <span className={`ml-2 text-sm transition-colors ${condition === cond.val ? 'text-red-600 dark:text-rose-500 font-medium' : 'text-gray-700 dark:text-neutral-300 group-hover:text-red-500 dark:group-hover:text-rose-400'}`}>
                                                {cond.label}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Konum (Şehirler) */}
                            <div className="mb-6">
                                <div className="flex items-center justify-between mb-2">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300">
                                        Konum
                                    </label>
                                    {(location && location !== 'Türkiye') && (
                                        <button
                                            onClick={() => {
                                                const params = new URLSearchParams(searchParams);
                                                params.delete('location');
                                                setSearchParams(params);
                                            }}
                                            className="text-xs text-red-600 dark:text-rose-400 hover:text-red-700 dark:hover:text-rose-300 font-medium"
                                        >
                                            Temizle
                                        </button>
                                    )}
                                </div>
                                <div className="relative mb-2">
                                    <input
                                        type="text"
                                        placeholder="Şehir ara..."
                                        value={citySearch}
                                        onChange={(e) => setCitySearch(e.target.value)}
                                        className="w-full pl-8 pr-3 py-1.5 text-sm border border-gray-300 dark:border-white/10 bg-white dark:bg-neutral-800 text-gray-900 dark:text-neutral-100 rounded-md focus:ring-1 focus:ring-red-400 dark:focus:ring-rose-500/20 focus:border-red-400 outline-none"
                                    />
                                    <svg className="w-4 h-4 text-gray-400 dark:text-neutral-500 absolute left-2.5 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                                <div className="space-y-1">
                                    <label className="flex items-center justify-between cursor-pointer hover:bg-gray-50 dark:hover:bg-neutral-700 p-2 rounded-lg transition-colors group">
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                checked={!location || location === 'Türkiye' || location.split(',').length === 0}
                                                onChange={() => {
                                                    const params = new URLSearchParams(searchParams);
                                                    params.delete('location');
                                                    setSearchParams(params);
                                                }}
                                                className="w-4 h-4 text-red-600 dark:text-rose-500 border-gray-300 dark:border-white/10 rounded-none focus:ring-red-500 dark:focus:ring-rose-500/20 dark:bg-neutral-800"
                                            />
                                            <span className={`text-sm ${(!location || location === 'Türkiye') ? 'text-red-600 dark:text-rose-500 font-medium' : 'text-gray-700 dark:text-neutral-300'}`}>Tüm Türkiye</span>
                                        </div>
                                    </label>
                                    {allCities
                                        .filter(c => c.toLowerCase().includes(citySearch.toLowerCase()))
                                        .map((cityItem) => {
                                            const currentLocations = location ? location.split(',') : [];
                                            const isChecked = currentLocations.includes(cityItem);

                                            return (
                                                <label key={cityItem} className="flex items-center justify-between cursor-pointer hover:bg-gray-50 dark:hover:bg-neutral-700 p-2 rounded-lg transition-colors group">
                                                    <div className="flex items-center gap-2">
                                                        <input
                                                            type="checkbox"
                                                            checked={isChecked}
                                                            onChange={() => {
                                                                const params = new URLSearchParams(searchParams);
                                                                let newLocations;
                                                                if (isChecked) {
                                                                    newLocations = currentLocations.filter(loc => loc !== cityItem);
                                                                } else {
                                                                    newLocations = [...currentLocations, cityItem];
                                                                }

                                                                if (newLocations.length > 0) {
                                                                    params.set('location', newLocations.join(','));
                                                                } else {
                                                                    params.delete('location');
                                                                }
                                                                setSearchParams(params);
                                                            }}
                                                            className="w-4 h-4 text-red-600 dark:text-rose-500 border-gray-300 dark:border-white/10 rounded-none focus:ring-red-500 dark:focus:ring-rose-500/20 dark:bg-neutral-800"
                                                        />
                                                        <span className={`text-sm ${isChecked ? 'text-red-600 dark:text-rose-500 font-medium' : 'text-gray-700 dark:text-neutral-300'}`}>{cityItem}</span>
                                                    </div>
                                                    <span className={`text-xs ${isChecked ? 'text-red-500 dark:text-rose-400' : 'text-gray-400 dark:text-neutral-500 opacity-60'}`}>
                                                        {cityCounts[cityItem] || 0}
                                                    </span>
                                                </label>
                                            );
                                        })}
                                </div>
                            </div>

                            {/* Filtreleri Temizle */}
                            <button
                                onClick={() => {
                                    setSortBy('created_at');
                                    setSortOrder('desc');
                                    setPriceRange('all');
                                    setCondition('all');
                                    setCitySearch('');

                                    // Clear filter params from URL, keep only search params
                                    const params = new URLSearchParams();
                                    if (query) params.set('q', query);
                                    if (category && category !== 'Tüm Kategoriler') params.set('category', category);
                                    if (location) params.set('location', location);
                                    setSearchParams(params);
                                }}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-white/10 rounded-lg text-gray-700 dark:text-neutral-300 hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors"
                            >
                                Filtreleri temizle
                            </button>
                        </div>
                    </aside>

                    {/* Sonuçlar - Sağ Taraf */}
                    <div className="flex-1">
                        {loading ? (
                            <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-sm border border-gray-200 dark:border-white/5 p-6 md:p-12 text-center">
                                {SKELETON_CONFIG.enabled ? (
                                    <ListingGridSkeleton count={10} />
                                ) : (
                                    <>
                                        <LoadingSpinner size="medium" className="mb-4" />
                                        <p className="text-gray-600 dark:text-neutral-400">Arama yapılıyor...</p>
                                    </>
                                )}
                            </div>
                        ) : results.length === 0 ? (
                            <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-gray-200 dark:border-white/5 p-12 text-center">
                                <svg className="w-16 h-16 text-gray-400 dark:text-neutral-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h0.01M15 10h0.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-neutral-100 mb-2">Sonuç bulunamadı</h3>
                                <p className="text-gray-600 dark:text-neutral-400 mb-4">
                                    Farklı kelimeler veya filtreler kullanarak tekrar deneyin.
                                </p>
                                <button
                                    onClick={() => navigate('/')}
                                    className="px-6 py-2 bg-red-500 dark:bg-rose-600 text-white rounded-lg hover:bg-red-600 dark:hover:bg-rose-700 transition-colors"
                                >
                                    Ana Sayfaya Dön
                                </button>
                            </div>
                        ) : (

                            <div className="flex flex-col gap-4">
                                {/* Desktop: Horizontal cards */}
                                <div className="hidden sm:block space-y-4 md:px-0">
                                    {results.map((listing) => (
                                        <HorizontalListingCard
                                            key={listing.id}
                                            listing={listing}
                                            toggleFavorite={toggleFavorite}
                                            isFavorite={isFavorite}
                                        />
                                    ))}
                                </div>

                                {/* Mobile: 2-column grid */}
                                <div className="grid grid-cols-2 gap-2 sm:hidden px-0">
                                    {results.map((listing) => (
                                        <ListingCard
                                            key={listing.id}
                                            listing={listing}
                                            toggleFavorite={toggleFavorite}
                                            isFavorite={isFavorite}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div >
        </div >
    );
};

export default SearchResultsPage;
