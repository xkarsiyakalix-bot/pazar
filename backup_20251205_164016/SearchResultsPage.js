import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { mockListings } from './components';

const SearchResultsPage = ({ toggleFavorite, isFavorite }) => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const query = searchParams.get('q') || '';
    const category = searchParams.get('category') || 'Alle Kategorien';
    const location = searchParams.get('location') || '';

    const [sortBy, setSortBy] = useState('relevance');
    const [priceRange, setPriceRange] = useState('all');

    // Arama fonksiyonu
    const searchListings = () => {
        let results = [...mockListings];

        // Arama terimi ile filtrele
        if (query) {
            const lowerQuery = query.toLowerCase();
            results = results.filter(listing =>
                (listing.title && listing.title.toLowerCase().includes(lowerQuery)) ||
                (listing.description && listing.description.toLowerCase().includes(lowerQuery)) ||
                (listing.category && listing.category.toLowerCase().includes(lowerQuery))
            );
        }

        // Kategori ile filtrele
        if (category && category !== 'Alle Kategorien') {
            results = results.filter(listing => listing.category === category);
        }

        // Konum ile filtrele
        if (location && location !== 'Deutschland') {
            results = results.filter(listing =>
                listing.location && listing.location.toLowerCase().includes(location.toLowerCase())
            );
        }

        // Fiyat aralığı ile filtrele
        if (priceRange !== 'all') {
            results = results.filter(listing => {
                const priceStr = String(listing.price);
                const cleanPrice = priceStr.replace('€', '').replace(/\s/g, '').trim();
                const price = parseFloat(cleanPrice.replace(/\./g, '').replace(',', '.')) || 0;

                switch (priceRange) {
                    case 'under100':
                        return price < 100;
                    case '100-500':
                        return price >= 100 && price <= 500;
                    case '500-1000':
                        return price >= 500 && price <= 1000;
                    case 'over1000':
                        return price > 1000;
                    default:
                        return true;
                }
            });
        }

        // Sıralama
        switch (sortBy) {
            case 'price-asc':
                results.sort((a, b) => {
                    const priceA = parseFloat(String(a.price).replace('€', '').replace(/\s/g, '').replace(/\./g, '').replace(',', '.')) || 0;
                    const priceB = parseFloat(String(b.price).replace('€', '').replace(/\s/g, '').replace(/\./g, '').replace(',', '.')) || 0;
                    return priceA - priceB;
                });
                break;
            case 'price-desc':
                results.sort((a, b) => {
                    const priceA = parseFloat(String(a.price).replace('€', '').replace(/\s/g, '').replace(/\./g, '').replace(',', '.')) || 0;
                    const priceB = parseFloat(String(b.price).replace('€', '').replace(/\s/g, '').replace(/\./g, '').replace(',', '.')) || 0;
                    return priceB - priceA;
                });
                break;
            case 'newest':
                results.sort((a, b) => new Date(b.date) - new Date(a.date));
                break;
            case 'relevance':
            default:
                break;
        }

        return results;
    };

    const results = searchListings();

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Basit Header */}
            <div className="bg-red-500 text-white p-4">
                <div className="max-w-[1400px] mx-auto flex items-center justify-between">
                    <h1
                        className="text-2xl font-bold cursor-pointer"
                        onClick={() => navigate('/')}
                    >
                        Kleinbazaar
                    </h1>
                    <button
                        onClick={() => navigate('/')}
                        className="px-4 py-2 bg-white text-red-500 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        Zur Startseite
                    </button>
                </div>
            </div>

            <div className="max-w-[1400px] mx-auto px-4 py-6">
                {/* Başlık ve Sonuç Sayısı */}
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        {query ? `Suchergebnisse für "${query}"` : 'Alle Anzeigen'}
                    </h1>
                    <p className="text-gray-600">
                        {results.length} {results.length === 1 ? 'Anzeige' : 'Anzeigen'} gefunden
                        {category && category !== 'Alle Kategorien' && ` in ${category}`}
                        {location && location !== 'Deutschland' && ` in ${location}`}
                    </p>
                </div>

                <div className="flex gap-6">
                    {/* Filtreler - Sol Sidebar */}
                    <div className="w-64 flex-shrink-0">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sticky top-4">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Filter</h2>

                            {/* Sıralama */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Sortieren nach
                                </label>
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-400 focus:border-transparent"
                                >
                                    <option value="relevance">Relevanz</option>
                                    <option value="newest">Neueste zuerst</option>
                                    <option value="price-asc">Preis aufsteigend</option>
                                    <option value="price-desc">Preis absteigend</option>
                                </select>
                            </div>

                            {/* Fiyat Aralığı */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Preis
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
                                        <span className="ml-2 text-sm text-gray-700">Alle Preise</span>
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
                                        <span className="ml-2 text-sm text-gray-700">Unter 100 €</span>
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
                                        <span className="ml-2 text-sm text-gray-700">100 - 500 €</span>
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
                                        <span className="ml-2 text-sm text-gray-700">500 - 1.000 €</span>
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
                                        <span className="ml-2 text-sm text-gray-700">Über 1.000 €</span>
                                    </label>
                                </div>
                            </div>

                            {/* Filtreleri Temizle */}
                            <button
                                onClick={() => {
                                    setSortBy('relevance');
                                    setPriceRange('all');
                                }}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                Filter zurücksetzen
                            </button>
                        </div>
                    </div>

                    {/* Sonuçlar - Sağ Taraf */}
                    <div className="flex-1">
                        {results.length === 0 ? (
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                                <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">Keine Ergebnisse gefunden</h3>
                                <p className="text-gray-600 mb-4">
                                    Versuchen Sie es mit anderen Suchbegriffen oder Filtern.
                                </p>
                                <button
                                    onClick={() => navigate('/')}
                                    className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                                >
                                    Zur Startseite
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {results.map((listing) => (
                                    <div
                                        key={listing.id}
                                        onClick={() => navigate(`/product/${listing.id}`)}
                                        className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group"
                                    >
                                        {/* Resim */}
                                        <div className="relative h-48 overflow-hidden bg-gray-100">
                                            <img
                                                src={listing.image}
                                                alt={listing.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                            {/* Favori Butonu */}
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    toggleFavorite && toggleFavorite(listing.id);
                                                }}
                                                className={`absolute top-2 right-2 p-2 rounded-full ${isFavorite && isFavorite(listing.id)
                                                    ? 'bg-red-500 text-white'
                                                    : 'bg-white text-gray-600 hover:bg-gray-100'
                                                    } shadow-md transition-colors`}
                                            >
                                                <svg className="w-5 h-5" fill={isFavorite && isFavorite(listing.id) ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                                </svg>
                                            </button>
                                        </div>

                                        {/* Bilgiler */}
                                        <div className="p-4">
                                            <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-red-600 transition-colors">
                                                {listing.title}
                                            </h3>
                                            <p className="text-2xl font-bold text-red-600 mb-2">{listing.price}</p>
                                            <div className="flex items-center text-sm text-gray-600">
                                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                                {listing.location}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SearchResultsPage;
