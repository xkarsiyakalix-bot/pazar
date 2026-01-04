import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { searchApi } from './api/search';
import { HorizontalListingCard } from './components';

const SearchResultsPage = ({ toggleFavorite, isFavorite }) => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const query = searchParams.get('q') || '';
    const category = searchParams.get('category') || 'Tüm Kategoriler';
    const location = searchParams.get('location') || '';

    const [sortBy, setSortBy] = useState('created_at');
    const [sortOrder, setSortOrder] = useState('desc');
    const [priceRange, setPriceRange] = useState('all');
    const [condition, setCondition] = useState('all');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);

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
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        {query ? `"${query}" için arama sonuçları` : 'Tüm İlanlar'}
                    </h1>
                    <p className="text-gray-600">
                        {results.length} {results.length === 1 ? 'ilan' : 'ilan'} bulundu
                        {category && category !== 'Tüm Kategoriler' && ` - ${category}`}
                        {location && location !== 'Türkiye' && ` - ${location}`}
                    </p>
                </div>

                <div className="flex gap-6">
                    {/* Filtreler - Sol Sidebar */}
                    <div className="w-64 flex-shrink-0">
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

                            {/* Fiyat Aralığı */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Fiyat
                                </label>
                                <div className="space-y-2">
                                    <label className="flex items-center cursor-pointer">
                                        <input
                                            type="radio"
                                            name="price"
                                            value="all"
                                            checked={priceRange === 'all'}
                                            onChange={(e) => setPriceRange(e.target.value)}
                                            className="w-4 h-4 text-red-500 focus:ring-red-400"
                                        />
                                        <span className="ml-2 text-sm text-gray-700">Tüm fiyatlar</span>
                                    </label>
                                    <label className="flex items-center cursor-pointer">
                                        <input
                                            type="radio"
                                            name="price"
                                            value="under100"
                                            checked={priceRange === 'under100'}
                                            onChange={(e) => setPriceRange(e.target.value)}
                                            className="w-4 h-4 text-red-500 focus:ring-red-400"
                                        />
                                        <span className="ml-2 text-sm text-gray-700">100 ₺ altı</span>
                                    </label>
                                    <label className="flex items-center cursor-pointer">
                                        <input
                                            type="radio"
                                            name="price"
                                            value="100-500"
                                            checked={priceRange === '100-500'}
                                            onChange={(e) => setPriceRange(e.target.value)}
                                            className="w-4 h-4 text-red-500 focus:ring-red-400"
                                        />
                                        <span className="ml-2 text-sm text-gray-700">100 - 500 ₺</span>
                                    </label>
                                    <label className="flex items-center cursor-pointer">
                                        <input
                                            type="radio"
                                            name="price"
                                            value="500-1000"
                                            checked={priceRange === '500-1000'}
                                            onChange={(e) => setPriceRange(e.target.value)}
                                            className="w-4 h-4 text-red-500 focus:ring-red-400"
                                        />
                                        <span className="ml-2 text-sm text-gray-700">500 - 1.000 ₺</span>
                                    </label>
                                    <label className="flex items-center cursor-pointer">
                                        <input
                                            type="radio"
                                            name="price"
                                            value="over1000"
                                            checked={priceRange === 'over1000'}
                                            onChange={(e) => setPriceRange(e.target.value)}
                                            className="w-4 h-4 text-red-500 focus:ring-red-400"
                                        />
                                        <span className="ml-2 text-sm text-gray-700">1.000 ₺ üstü</span>
                                    </label>
                                </div>
                            </div>

                            {/* Zustand (Condition) Filter */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Durum
                                </label>
                                <div className="space-y-2">
                                    <label className="flex items-center cursor-pointer">
                                        <input
                                            type="radio"
                                            name="condition"
                                            value="all"
                                            checked={condition === 'all'}
                                            onChange={(e) => setCondition(e.target.value)}
                                            className="w-4 h-4 text-red-500 focus:ring-red-400"
                                        />
                                        <span className="ml-2 text-sm text-gray-700">Hepsi</span>
                                    </label>
                                    <label className="flex items-center cursor-pointer">
                                        <input
                                            type="radio"
                                            name="condition"
                                            value="Yeni"
                                            checked={condition === 'Yeni'}
                                            onChange={(e) => setCondition(e.target.value)}
                                            className="w-4 h-4 text-red-500 focus:ring-red-400"
                                        />
                                        <span className="ml-2 text-sm text-gray-700">Yeni</span>
                                    </label>
                                    <label className="flex items-center cursor-pointer">
                                        <input
                                            type="radio"
                                            name="condition"
                                            value="Yeni gibi"
                                            checked={condition === 'Yeni gibi'}
                                            onChange={(e) => setCondition(e.target.value)}
                                            className="w-4 h-4 text-red-500 focus:ring-red-400"
                                        />
                                        <span className="ml-2 text-sm text-gray-700">Yeni gibi</span>
                                    </label>
                                    <label className="flex items-center cursor-pointer">
                                        <input
                                            type="radio"
                                            name="condition"
                                            value="Çok iyi"
                                            checked={condition === 'Çok iyi'}
                                            onChange={(e) => setCondition(e.target.value)}
                                            className="w-4 h-4 text-red-500 focus:ring-red-400"
                                        />
                                        <span className="ml-2 text-sm text-gray-700">Çok iyi</span>
                                    </label>
                                    <label className="flex items-center cursor-pointer">
                                        <input
                                            type="radio"
                                            name="condition"
                                            value="İyi"
                                            checked={condition === 'İyi'}
                                            onChange={(e) => setCondition(e.target.value)}
                                            className="w-4 h-4 text-red-500 focus:ring-red-400"
                                        />
                                        <span className="ml-2 text-sm text-gray-700">İyi</span>
                                    </label>
                                    <label className="flex items-center cursor-pointer">
                                        <input
                                            type="radio"
                                            name="condition"
                                            value="Kabul edilebilir"
                                            checked={condition === 'Kabul edilebilir'}
                                            onChange={(e) => setCondition(e.target.value)}
                                            className="w-4 h-4 text-red-500 focus:ring-red-400"
                                        />
                                        <span className="ml-2 text-sm text-gray-700">Kabul edilebilir</span>
                                    </label>
                                    <label className="flex items-center cursor-pointer">
                                        <input
                                            type="radio"
                                            name="condition"
                                            value="Kullanılmış"
                                            checked={condition === 'Kullanılmış'}
                                            onChange={(e) => setCondition(e.target.value)}
                                            className="w-4 h-4 text-red-500 focus:ring-red-400"
                                        />
                                        <span className="ml-2 text-sm text-gray-700">Kullanılmış</span>
                                    </label>
                                    <label className="flex items-center cursor-pointer">
                                        <input
                                            type="radio"
                                            name="condition"
                                            value="Defolu / Arızalı"
                                            checked={condition === 'Defolu / Arızalı'}
                                            onChange={(e) => setCondition(e.target.value)}
                                            className="w-4 h-4 text-red-500 focus:ring-red-400"
                                        />
                                        <span className="ml-2 text-sm text-gray-700">Defolu / Arızalı</span>
                                    </label>
                                </div>
                            </div>

                            {/* Filtreleri Temizle */}
                            <button
                                onClick={() => {
                                    setSortBy('created_at');
                                    setSortOrder('desc');
                                    setPriceRange('all');
                                    setCondition('all');
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
                                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mb-4"></div>
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
