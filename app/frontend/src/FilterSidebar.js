import React from 'react';

const FilterSidebar = ({
    priceRange,
    setPriceRange,
    selectedLocation,
    setSelectedLocation,
    sortBy,
    setSortBy
}) => {
    const locations = [
        'Tüm Şehirler',
        'İstanbul',
        'Ankara',
        'İzmir',
        'Bursa',
        'Antalya',
        'Adana',
        'Konya',
        'Gaziantep',
        'Mersin',
        'Kayseri'
    ];

    return (
        <div className="w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sticky top-4">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-0.293.707l-6.414 6.414a1 1 0 00-0.293.707V17l-4 4v-6.586a1 1 0 00-0.293-0.707L3.293 7.293A1 1 0 013 6.586V4z" />
                    </svg>
                    Filtrele
                </h2>

                {/* Sıralama */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Sıralama kriteri
                    </label>
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-red-400 focus:border-transparent transition-all"
                    >
                        <option value="relevance">Önerilen</option>
                        <option value="newest">En yeni ilanlar</option>
                        <option value="oldest">En eski ilanlar</option>
                        <option value="price-asc">Fiyat (Önce en düşük)</option>
                        <option value="price-desc">Fiyat (Önce en yüksek)</option>
                    </select>
                </div>

                {/* Fiyat Aralığı */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                        Fiyat
                    </label>
                    <div className="space-y-2">
                        {[
                            { value: 'all', label: 'Tüm fiyatlar' },
                            { value: 'free', label: 'Ücretsiz' },
                            { value: 'under50', label: '50 TL altı' },
                            { value: 'under100', label: '100 TL altı' },
                            { value: '100-500', label: '100 - 500 TL' },
                            { value: '500-1000', label: '500 - 1.000 TL' },
                            { value: '1000-5000', label: '1.000 - 5.000 TL' },
                            { value: 'over5000', label: '5.000 TL üstü' }
                        ].map(option => (
                            <label key={option.value} className="flex items-center cursor-pointer group">
                                <input
                                    type="radio"
                                    name="price"
                                    value={option.value}
                                    checked={priceRange === option.value}
                                    onChange={(e) => setPriceRange(e.target.value)}
                                    className="w-4 h-4 text-red-500 focus:ring-red-400 cursor-pointer"
                                />
                                <span className="ml-2 text-sm text-gray-700 group-hover:text-red-600 transition-colors">
                                    {option.label}
                                </span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Konum */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Konum
                    </label>
                    <div className="relative">
                        <input
                            type="text"
                            list="location-options"
                            value={selectedLocation}
                            onChange={(e) => setSelectedLocation(e.target.value)}
                            placeholder="Şehir yazın..."
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-red-400 focus:border-transparent transition-all"
                        />
                        <datalist id="location-options">
                            {locations.map(loc => (
                                <option key={loc} value={loc} />
                            ))}
                        </datalist>
                    </div>
                </div>

                {/* Filtreleri Temizle */}
                <button
                    onClick={() => {
                        setSortBy('relevance');
                        setPriceRange('all');
                        setSelectedLocation('Tüm Şehirler');
                    }}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 hover:border-red-400 hover:text-red-600 transition-all flex items-center justify-center gap-2"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-0.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Filtreleri temizle
                </button>
            </div>
        </div>

    );
};

export default FilterSidebar;
