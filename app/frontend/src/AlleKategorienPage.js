import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CategoryGallery, mockListings, HorizontalListingCard, getCategoryPath } from './components';
import { getTurkishCities } from './translations';

const AlleKategorienPage = ({ toggleFavorite, isFavorite }) => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('Tüm Kategoriler');
    const [selectedLocations, setSelectedLocations] = useState([]);
    const [priceFrom, setPriceFrom] = useState('');
    const [priceTo, setPriceTo] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    const categories = [
        { name: 'Tüm Kategoriler', icon: '🏪', count: 0 },
        { name: 'Otomobil, Bisiklet & Tekne', icon: '🚗', count: 0 },
        { name: 'Emlak', icon: '🏠', count: 0 },
        { name: 'Ev & Bahçe', icon: '🏡', count: 0 },
        { name: 'Moda & Güzellik', icon: '👗', count: 0 },
        { name: 'Elektronik', icon: '📱', count: 0 },
        { name: 'Evcil Hayvanlar', icon: '🐾', count: 0 },
        { name: 'Aile, Çocuk & Bebek', icon: '👶', count: 0 },
        { name: 'İş İlanları', icon: '💼', count: 0 },
        { name: 'Eğlence, Hobi & Mahalle', icon: '⚽', count: 0 },
        { name: 'Müzik, Film & Kitap', icon: '🎵', count: 0 },
        { name: 'Biletler', icon: '🎫', count: 0 },
        { name: 'Hizmetler', icon: '🔧', count: 0 },
        { name: 'Ücretsiz & Takas', icon: '🎁', count: 0 },
        { name: 'Eğitim & Kurslar', icon: '📚', count: 0 },
        { name: 'Komşu Yardımı', icon: '🤝', count: 0 }
    ];

    const federalStates = getTurkishCities();

    // Read URL parameters on mount
    useEffect(() => {
        const search = searchParams.get('search');
        const category = searchParams.get('category');
        const loc = searchParams.get('location');
        const priceFromParam = searchParams.get('priceFrom');
        const priceToParam = searchParams.get('priceTo');

        if (search) setSearchTerm(search);
        if (category) setSelectedCategory(category);
        if (loc) setSelectedLocations(loc.split(','));
        if (priceFromParam) setPriceFrom(priceFromParam);
        if (priceToParam) setPriceTo(priceToParam);
    }, [searchParams]);

    // Update URL when filters change
    const updateFilters = (newFilters) => {
        const params = new URLSearchParams(searchParams);
        if (newFilters.locations !== undefined) {
            if (newFilters.locations && newFilters.locations.length > 0) params.set('location', newFilters.locations.join(','));
            else params.delete('location');
        }
        if (newFilters.priceFrom !== undefined) {
            if (newFilters.priceFrom) params.set('priceFrom', newFilters.priceFrom);
            else params.delete('priceFrom');
        }
        if (newFilters.priceTo !== undefined) {
            if (newFilters.priceTo) params.set('priceTo', newFilters.priceTo);
            else params.delete('priceTo');
        }
        navigate(`?${params.toString()}`);
    };

    // Fetch listings from Supabase
    useEffect(() => {
        const fetchListingsFromSupabase = async () => {
            try {
                setLoading(true);
                // Import fetchListings from api/listings
                const { fetchListings } = await import('./api/listings');
                const data = await fetchListings({});
                console.log('AlleKategorien - Fetched listings from Supabase:', data);
                console.log('AlleKategorien - Number of listings:', data.length);
                setListings(data);
            } catch (error) {
                console.error('AlleKategorien - Error fetching listings:', error);
                setListings([]);
            } finally {
                setLoading(false);
            }
        };
        fetchListingsFromSupabase();
    }, []);

    // Calculate category counts
    const categoriesWithCounts = categories.map(cat => {
        if (cat.name === 'Tüm Kategoriler') {
            return { ...cat, count: listings.length };
        }

        let count = 0;
        if (cat.name === 'Müzik, Film & Kitap') {
            count = listings.filter(listing =>
                listing.category === 'Müzik, Film & Kitap' ||
                listing.category === 'Müzik, Filme & Bücher'
            ).length;
        } else {
            count = listings.filter(listing => listing.category === cat.name).length;
        }

        return { ...cat, count };
    });

    // Filter listings
    const filteredListings = listings.filter(listing => {
        // Search term filter
        if (searchTerm && listing.title) {
            const searchLower = searchTerm.toLowerCase();
            const titleMatch = listing.title.toLowerCase().includes(searchLower);
            const descMatch = listing.description?.toLowerCase().includes(searchLower);
            if (!titleMatch && !descMatch) return false;
        }

        // Category filter
        if (selectedCategory !== 'Tüm Kategoriler' && listing.category !== selectedCategory) {
            return false;
        }

        // Price filter
        if (priceFrom && listing.price < parseFloat(priceFrom)) return false;
        if (priceTo && listing.price > parseFloat(priceTo)) return false;

        // Location filter (multi-select)
        if (selectedLocations.length > 0 && !selectedLocations.includes(listing.federal_state)) return false;

        return true;
    });

    const getLocationCount = (state) => {
        return listings.filter(l => l.federal_state === state).length;
    };

    console.log('AlleKategorien - Filtered listings:', filteredListings.length);
    console.log('AlleKategorien - Selected category:', selectedCategory);

    const handleCategoryClick = (categoryName) => {
        const route = getCategoryPath(categoryName);
        if (route) {
            navigate(route);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-[1400px] mx-auto px-4 py-6">
                <div className="flex gap-6">
                    {/* Left Sidebar - Categories & Filters */}
                    <aside className="w-96 flex-shrink-0 bg-white rounded-2xl shadow-lg p-6 h-fit sticky top-6">
                        {/* Categories Section */}
                        <div className="mb-6 pb-6 border-b border-gray-200">
                            <h3 className="font-bold text-gray-900 text-lg mb-4">Kategoriler</h3>
                            <div className="space-y-1">
                                {categoriesWithCounts.map((category) => (
                                    <button
                                        key={category.name}
                                        onClick={() => handleCategoryClick(category.name)}
                                        className={`w-full text-left px-3 py-2 rounded-lg transition-all flex items-center justify-between group ${selectedCategory === category.name
                                            ? 'bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-md'
                                            : 'hover:bg-gray-50 text-gray-700'
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className={`text-sm font-medium ${selectedCategory === category.name
                                                ? 'text-white'
                                                : 'group-hover:text-red-600'
                                                }`}>
                                                {category.name}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className={`text-xs ${selectedCategory === category.name
                                                ? 'text-white/80'
                                                : 'text-gray-400'
                                                }`}>
                                                ({category.count.toLocaleString('de-DE')})
                                            </span>
                                            <svg
                                                className={`w-4 h-4 ${selectedCategory === category.name
                                                    ? 'text-white'
                                                    : 'text-gray-400 group-hover:text-red-600'
                                                    } transition-colors`}
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Filters Section */}
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-bold text-gray-900 text-lg">Filtreler</h3>
                            <button
                                onClick={() => {
                                    setSearchTerm('');
                                    setPriceFrom('');
                                    setPriceTo('');
                                    setSelectedLocations([]);
                                    updateFilters({ priceFrom: '', priceTo: '', locations: [] });
                                }}
                                className="text-sm text-red-600 hover:text-red-700 font-medium"
                            >
                                Sıfırla
                            </button>
                        </div>

                        {/* Price Filter */}
                        <div className="mb-6 pb-6 border-b border-gray-200">
                            <h4 className="font-bold text-gray-900 mb-3 text-base">Fiyat</h4>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs text-gray-600 mb-1">Min</label>
                                    <input
                                        type="number"
                                        value={priceFrom}
                                        onChange={(e) => {
                                            setPriceFrom(e.target.value);
                                            updateFilters({ priceFrom: e.target.value });
                                        }}
                                        placeholder="0"
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-300"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-gray-600 mb-1">Max</label>
                                    <input
                                        type="number"
                                        value={priceTo}
                                        onChange={(e) => {
                                            setPriceTo(e.target.value);
                                            updateFilters({ priceTo: e.target.value });
                                        }}
                                        placeholder="∞"
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-300"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Location Filter */}
                        <div className="mb-6">
                            <h4 className="font-bold text-gray-900 mb-3 text-base">Konum</h4>
                            <div className="space-y-2">
                                {federalStates.map((state) => (
                                    <label key={state} className="flex items-center justify-between cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors">
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                name="location"
                                                value={state}
                                                checked={selectedLocations.includes(state)}
                                                onChange={(e) => {
                                                    const val = e.target.value;
                                                    const newLocations = selectedLocations.includes(val)
                                                        ? selectedLocations.filter(l => l !== val)
                                                        : [...selectedLocations, val];
                                                    setSelectedLocations(newLocations);
                                                    updateFilters({ locations: newLocations });
                                                }}
                                                className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                                            />
                                            <span className="text-sm text-gray-700">{state}</span>
                                        </div>
                                        <span className="text-xs text-gray-400">({getLocationCount(state)})</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </aside>

                    {/* Right Side - Banner + Listings */}
                    <div className="flex-1">
                        {/* Banner */}
                        <div className="bg-gradient-to-r from-red-500 to-rose-600 rounded-2xl shadow-xl p-8 mb-6 relative overflow-hidden">
                            <div className="absolute inset-0 opacity-10">
                                <div
                                    className="absolute top-0 left-0 w-full h-full"
                                    style={{
                                        backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,.1) 35px, rgba(255,255,255,.1) 70px)'
                                    }}
                                ></div>
                            </div>
                            <div className="relative z-10">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                                            <span className="text-5xl">🏪</span>
                                        </div>
                                        <div>
                                            <h1 className="text-4xl font-bold text-white mb-1">
                                                {searchTerm ? `"${searchTerm}" için arama sonuçları` : 'Tüm Kategoriler'}
                                            </h1>
                                            <p className="text-white text-lg opacity-90">
                                                {searchTerm
                                                    ? `${filteredListings.length} sonuç bulundu`
                                                    : selectedCategory === 'Tüm Kategoriler'
                                                        ? 'Tüm ilanlara göz atın'
                                                        : selectedCategory
                                                }
                                            </p>
                                        </div>
                                    </div>
                                    <div className="hidden lg:flex items-center gap-6 text-white">
                                        <div className="text-center">
                                            <div className="text-3xl font-bold">{listings.length}</div>
                                            <div className="text-sm opacity-80">İlanlar</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div style={{ maxWidth: '960px' }}>
                            <CategoryGallery
                                listings={filteredListings.filter(l => l.is_top)}
                                toggleFavorite={toggleFavorite}
                                isFavorite={isFavorite}
                            />
                        </div>

                        {/* Listings */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">
                                {filteredListings.length} Anzeigen
                            </h2>

                            {loading ? (
                                <div className="flex justify-center items-center py-12">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
                                </div>
                            ) : filteredListings.length === 0 ? (
                                <div className="text-center py-12">
                                    <p className="text-gray-500 text-lg">İlan bulunamadı</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {filteredListings.map((listing) => (
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
            </div>
        </div>
    );
};

export default AlleKategorienPage;
