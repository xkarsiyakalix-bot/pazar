import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { searchApi } from './api/search';
import { HorizontalListingCard } from './components';
import LoadingSpinner from './components/LoadingSpinner';
import { createSavedSearch, checkIfSearchIsSaved, deleteSavedSearchByUrl } from './api/savedSearches';
import { useAuth } from './contexts/AuthContext';
import { getTurkishCities, getCategoryTranslation } from './translations';

const SearchResultsPage = ({ toggleFavorite, isFavorite }) => {
    const categories = [
        { name: 'Tüm Kategoriler', icon: '🏪' },
        { name: 'Otomobil, Bisiklet & Tekne', icon: '🚗' },
        { name: 'Emlak', icon: '🏠' },
        { name: 'Ev & Bahçe', icon: '🏡' },
        { name: 'Moda & Güzellik', icon: '👗' },
        { name: 'Elektronik', icon: '📱' },
        { name: 'Evcil Hayvanlar', icon: '🐾' },
        { name: 'Aile, Çocuk & Bebek', icon: '👶' },
        { name: 'İş İlanları', icon: '💼' },
        { name: 'Eğlence, Hobi & Mahalle', icon: '⚽' },
        { name: 'Müzik, Film & Kitap', icon: '🎵' },
        { name: 'Biletler', icon: '🎫' },
        { name: 'Hizmetler', icon: '🔧' },
        { name: 'Ücretsiz & Takas', icon: '🎁' },
        { name: 'Eğitim & Kurslar', icon: '📚' },
        { name: 'Komşu Yardımı', icon: '🤝' }
    ];

    const allCities = getTurkishCities();
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();

    // Read from URL
    const query = searchParams.get('q') || '';
    const category = searchParams.get('category') || 'Tüm Kategoriler';
    const location = searchParams.get('location') || '';

    // Initialize filters from URL or defaults
    const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || 'created_at');
    const [sortOrder, setSortOrder] = useState(searchParams.get('sortOrder') || 'desc');
    const [priceRange, setPriceRange] = useState(searchParams.get('priceRange') || 'all');
    const [condition, setCondition] = useState(searchParams.get('condition') || 'all');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSaved, setIsSaved] = useState(false);
    const [citySearch, setCitySearch] = useState('');
    const [categoryCounts, setCategoryCounts] = useState({});
    const [cityCounts, setCityCounts] = useState({});
    const { user } = useAuth();

    // Sync filters to URL whenever they change
    useEffect(() => {
        const params = new URLSearchParams(searchParams);

        // Keep existing params
        if (query) params.set('q', query);
        if (category && category !== 'Tüm Kategoriler') params.set('category', category);
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
    }, [sortBy, sortOrder, priceRange, condition]);

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

    return (
        <div className="min-h-screen bg-gray-50 pb-12">

            <div className="max-w-[1400px] mx-auto px-4 py-6">
                {/* Başlık ve Sonuç Sayısı */}
                <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            {query ? `"${query}" için arama sonuçları` : 'Tüm İlanlar'}
                        </h1>
                        <p className="text-gray-600">
                            {results.length} {results.length === 1 ? 'ilan' : 'ilan'} bulundu
                            {category && category !== 'Tüm Kategoriler' && ` - ${category}`}
                            {location && location !== 'Türkiye' && ` - ${location}`}
                        </p>
                    </div>

                    {/* Aramayı Kaydet Butonu */}
                    <button
                        onClick={handleToggleSave}
                        className={`flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-all ${isSaved
                            ? 'bg-red-50 text-red-600 border border-red-200'
                            : 'bg-red-500 text-white hover:bg-red-600 shadow-md hover:shadow-lg'
                            }`}
                    >
                        {isSaved ? (
                            <>
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                                </svg>
                                Aramayı Kaydettiniz
                            </>
                        ) : (
                            <>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                                </svg>
                                Aramayı Kaydet
                            </>
                        )}
                    </button>
                </div>

                <div className="flex gap-6">
                    {/* Filtreler - Sol Sidebar */}
                    <div className="w-96 flex-shrink-0">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sticky top-4">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Filtreler</h2>

                            {/* Sıralama */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Sıralama kriteri
                                </label>
                                <select
                                    value={`${sortBy}-${sortOrder}`}
                                    onChange={(e) => handleSortChange(e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-400 focus:border-transparent"
                                >
                                    <option value="relevance">Önerilen</option>
                                    <option value="newest">En yeni ilanlar</option>
                                    <option value="price-asc">Fiyat (Önce en düşük)</option>
                                    <option value="price-desc">Fiyat (Önce en yüksek)</option>
                                </select>
                            </div>

                            {/* Kategoriler */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Kategoriler
                                </label>
                                <div className="space-y-1">
                                    {categories
                                        .filter(cat => cat.name === 'Tüm Kategoriler' || (categoryCounts[cat.name] && categoryCounts[cat.name] > 0) || category === cat.name)
                                        .map((cat) => (
                                            <button
                                                key={cat.name}
                                                onClick={() => {
                                                    const params = new URLSearchParams(searchParams);
                                                    if (cat.name === 'Tüm Kategoriler') {
                                                        params.delete('category');
                                                    } else {
                                                        params.set('category', cat.name);
                                                    }
                                                    setSearchParams(params);
                                                }}
                                                className={`w-full text-left px-2 py-1.5 rounded-md text-sm transition-colors flex items-center justify-between group ${category === cat.name || (category === 'Tüm Kategoriler' && cat.name === 'Tüm Kategoriler')
                                                    ? 'bg-red-50 text-red-600 font-medium'
                                                    : 'text-gray-600 hover:bg-gray-50'
                                                    }`}
                                            >
                                                <div className="flex items-center justify-between w-full">
                                                    <span>{getCategoryTranslation(cat.name)}</span>
                                                    {cat.name !== 'Tüm Kategoriler' && (
                                                        <span className={`text-xs ${category === cat.name ? 'text-red-500' : 'text-gray-400 opacity-60'}`}>
                                                            {categoryCounts[cat.name] || 0}
                                                        </span>
                                                    )}
                                                </div>
                                                {category === cat.name && (
                                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                    </svg>
                                                )}
                                            </button>
                                        ))}
                                </div>
                            </div>

                            {/* Fiyat Aralığı */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Fiyat
                                </label>
                                <div className="space-y-2">
                                    <label className="flex items-center cursor-pointer group">
                                        <input
                                            type="checkbox"
                                            checked={priceRange === 'all'}
                                            onChange={() => setPriceRange('all')}
                                            className="w-4 h-4 text-red-600 border-gray-300 rounded-none focus:ring-red-500"
                                        />
                                        <span className="ml-2 text-sm text-gray-700 group-hover:text-red-500 transition-colors">Tüm fiyatlar</span>
                                    </label>
                                    {[
                                        { val: 'under100', label: '100 ₺ altı' },
                                        { val: '100-500', label: '100 - 500 ₺' },
                                        { val: '500-1000', label: '500 - 1.000 ₺' },
                                        { val: 'over1000', label: '1.000 ₺ üstü' }
                                    ].map((range) => (
                                        <label key={range.val} className="flex items-center cursor-pointer group">
                                            <input
                                                type="checkbox"
                                                checked={priceRange === range.val}
                                                onChange={() => setPriceRange(range.val)}
                                                className="w-4 h-4 text-red-600 border-gray-300 rounded-none focus:ring-red-500"
                                            />
                                            <span className={`ml-2 text-sm transition-colors ${priceRange === range.val ? 'text-red-600 font-medium' : 'text-gray-700 group-hover:text-red-500'}`}>
                                                {range.label}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Zustand (Condition) Filter */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
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
                                                className="w-4 h-4 text-red-600 border-gray-300 rounded-none focus:ring-red-500"
                                            />
                                            <span className={`ml-2 text-sm transition-colors ${condition === cond.val ? 'text-red-600 font-medium' : 'text-gray-700 group-hover:text-red-500'}`}>
                                                {cond.label}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Konum (Şehirler) */}
                            <div className="mb-6">
                                <div className="flex items-center justify-between mb-2">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Konum
                                    </label>
                                    {(location && location !== 'Türkiye') && (
                                        <button
                                            onClick={() => {
                                                const params = new URLSearchParams(searchParams);
                                                params.delete('location');
                                                setSearchParams(params);
                                            }}
                                            className="text-xs text-red-600 hover:text-red-700 font-medium"
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
                                        className="w-full pl-8 pr-3 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-red-400 focus:border-red-400 outline-none"
                                    />
                                    <svg className="w-4 h-4 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                                <div className="space-y-1">
                                    <label className="flex items-center justify-between cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors group">
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                checked={!location || location === 'Türkiye' || location.split(',').length === 0}
                                                onChange={() => {
                                                    const params = new URLSearchParams(searchParams);
                                                    params.delete('location');
                                                    setSearchParams(params);
                                                }}
                                                className="w-4 h-4 text-red-600 border-gray-300 rounded-none focus:ring-red-500"
                                            />
                                            <span className={`text-sm ${(!location || location === 'Türkiye') ? 'text-red-600 font-medium' : 'text-gray-700'}`}>Tüm Türkiye</span>
                                        </div>
                                    </label>
                                    {allCities
                                        .filter(c => c.toLowerCase().includes(citySearch.toLowerCase()))
                                        .map((cityItem) => {
                                            const currentLocations = location ? location.split(',') : [];
                                            const isChecked = currentLocations.includes(cityItem);

                                            return (
                                                <label key={cityItem} className="flex items-center justify-between cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors group">
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
                                                            className="w-4 h-4 text-red-600 border-gray-300 rounded-none focus:ring-red-500"
                                                        />
                                                        <span className={`text-sm ${isChecked ? 'text-red-600 font-medium' : 'text-gray-700'}`}>{cityItem}</span>
                                                    </div>
                                                    <span className={`text-xs ${isChecked ? 'text-red-500' : 'text-gray-400 opacity-60'}`}>
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
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                Filtreleri temizle
                            </button>
                        </div>
                    </div>

                    {/* Sonuçlar - Sağ Taraf */}
                    <div className="flex-1">
                        {loading ? (
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                                <LoadingSpinner size="medium" className="mb-4" />
                                <p className="text-gray-600">Arama yapılıyor...</p>
                            </div>
                        ) : results.length === 0 ? (
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                                <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">Sonuç bulunamadı</h3>
                                <p className="text-gray-600 mb-4">
                                    Farklı kelimeler veya filtreler kullanarak tekrar deneyin.
                                </p>
                                <button
                                    onClick={() => navigate('/')}
                                    className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                                >
                                    Ana Sayfaya Dön
                                </button>
                            </div>
                        ) : (

                            <div className="flex flex-col gap-4">
                                {results.map((listing) => (
                                    <HorizontalListingCard
                                        key={listing.id}
                                        listing={listing}
                                        toggleFavorite={toggleFavorite}
                                        isFavorite={isFavorite}
                                    />
                                ))}
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </div >
    );
};

export default SearchResultsPage;
