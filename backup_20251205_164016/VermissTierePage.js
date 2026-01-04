import React, { useState, useEffect } from 'react';
import { mockListings } from './components';
import { useNavigate } from 'react-router-dom';

function VermissTierePage() {
    const navigate = useNavigate();
    const [category, setCategory] = useState('');
    const [priceFrom, setPriceFrom] = useState('');
    const [priceTo, setPriceTo] = useState('');
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [favorites, setFavorites] = useState(() => JSON.parse(localStorage.getItem('favorites') || '[]'));

    // New filter states
    const [selectedStatus, setSelectedStatus] = useState('');
    const [offerType, setOfferType] = useState('');
    const [providerType, setProviderType] = useState('');
    const [selectedState, setSelectedState] = useState('');

    useEffect(() => { fetchListings(); }, []);

    const fetchListings = async () => {
        setListings(mockListings);
        setLoading(false);
    };

    const toggleFavorite = (listingId) => {
        setFavorites(prev => {
            const newFavorites = prev.includes(listingId) ? prev.filter(id => id !== listingId) : [...prev, listingId];
            localStorage.setItem('favorites', JSON.stringify(newFavorites));
            return newFavorites;
        });
    };

    const resetFilters = () => {
        setCategory('');
        setPriceFrom('');
        setPriceTo('');
        setSelectedStatus('');
        setOfferType('');
        setProviderType('');
        setSelectedState('');
    };

    const filteredListings = listings.filter(listing =>
        listing.category === 'Haustiere' &&
        listing.subCategory === 'Vermisste Tiere' &&
        (!category || listing.category === category) &&
        (!priceFrom || parseFloat(listing.price?.toString().replace(/[^0-9,]/g, '').replace(',', '.')) >= parseFloat(priceFrom)) &&
        (!priceTo || parseFloat(listing.price?.toString().replace(/[^0-9,]/g, '').replace(',', '.')) <= parseFloat(priceTo)) &&
        (!selectedStatus || listing.status === selectedStatus) &&
        (!offerType || listing.offerType === offerType) &&
        (!providerType || listing.providerType === providerType) &&
        (!selectedState || listing.federalState === selectedState)
    );

    return (
        <div className="min-h-screen bg-gray-50"><div className="max-w-[1400px] mx-auto px-4 py-6"><div className="flex gap-6">
            <aside className="w-96 flex-shrink-0 bg-white rounded-2xl shadow-lg p-6 h-fit sticky top-6">                <div className="mb-6 pb-6 border-b border-gray-200">
                <h3 className="font-bold text-gray-900 mb-3 text-base">Kategorien</h3>
                <button onClick={() => navigate('/Alle-Kategorien')} className="w-full text-left px-3 py-2 rounded-lg text-sm transition-all bg-gray-100 text-gray-700 hover:bg-gray-200 flex items-center justify-between group">
                    <span>Alle Kategorien</span>
                    <svg className="w-4 h-4 text-gray-400 group-hover:text-red-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </button>
                <div className="space-y-2 mt-3">
                    <button onClick={() => navigate('/Haustiere')} className="text-left px-3 py-2 rounded-lg text-sm transition-all bg-gray-100 text-gray-700 hover:bg-gray-200 flex items-center justify-between group ml-4" style={{ width: 'calc(100% - 1rem)' }}>
                        <span>Haustiere</span>
                        <svg className="w-4 h-4 text-gray-400 group-hover:text-red-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                    </button>
                    <button className="text-left px-3 py-2 rounded-lg text-sm transition-all bg-red-600 text-white shadow-md flex items-center justify-between ml-8" style={{ width: 'calc(100% - 2rem)' }}>
                        <span>Vermisste Tiere</span>
                        <button onClick={(e) => { e.stopPropagation(); navigate('/Haustiere'); }} className="text-white hover:text-red-200 transition-colors" title="Kategorie schließen">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </button>
                </div>
            </div>

                <div className="flex items-center justify-between mb-6"><h3 className="font-bold text-gray-900 text-lg">Filter</h3><button onClick={resetFilters} className="text-sm text-red-600 hover:text-red-700 font-medium">Zurücksetzen</button></div>

                {/* Art (Status) Filter */}
                <div className="mb-6">
                    <h4 className="font-bold text-gray-900 mb-3 text-base">Art</h4>
                    <div className="space-y-2">
                        {[
                            { value: 'Entlaufen', count: 4271 },
                            { value: 'Gefunden', count: 612 }
                        ].map(status => (
                            <label key={status.value} className="flex items-center justify-between cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors">
                                <div className="flex items-center">
                                    <input type="radio" name="status" value={status.value} checked={selectedStatus === status.value} onChange={(e) => setSelectedStatus(e.target.value)} className="w-4 h-4 text-red-600 focus:ring-red-500" />
                                    <span className="ml-2 text-sm text-gray-700">{status.value}</span>
                                </div>
                                <span className="text-xs text-gray-500">({status.count.toLocaleString('de-DE')})</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Angebotstyp Filter */}
                <div className="mb-6">
                    <h4 className="font-bold text-gray-900 mb-3 text-base">Angebotstyp</h4>
                    <div className="space-y-2">
                        {[
                            { value: 'Angebote', count: 2051 },
                            { value: 'Gesuche', count: 2940 }
                        ].map(type => (
                            <label key={type.value} className="flex items-center justify-between cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors">
                                <div className="flex items-center">
                                    <input type="radio" name="offerType" value={type.value} checked={offerType === type.value} onChange={(e) => setOfferType(e.target.value)} className="w-4 h-4 text-red-600 focus:ring-red-500" />
                                    <span className="ml-2 text-sm text-gray-700">{type.value}</span>
                                </div>
                                <span className="text-xs text-gray-500">({type.count.toLocaleString('de-DE')})</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Anbieter Filter */}
                <div className="mb-6">
                    <h4 className="font-bold text-gray-900 mb-3 text-base">Anbieter</h4>
                    <div className="space-y-2">
                        {[
                            { value: 'Privat', count: 4933 },
                            { value: 'Gewerblich', count: 58 }
                        ].map(provider => (
                            <label key={provider.value} className="flex items-center justify-between cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors">
                                <div className="flex items-center">
                                    <input type="radio" name="provider" value={provider.value} checked={providerType === provider.value} onChange={(e) => setProviderType(e.target.value)} className="w-4 h-4 text-red-600 focus:ring-red-500" />
                                    <span className="ml-2 text-sm text-gray-700">{provider.value}</span>
                                </div>
                                <span className="text-xs text-gray-500">({provider.count.toLocaleString('de-DE')})</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Ort (Location by State) Filter */}
                <div className="mb-6">
                    <h4 className="font-bold text-gray-900 mb-3 text-base">Ort</h4>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                        {[
                            { value: 'Baden-Württemberg', count: 465 },
                            { value: 'Bayern', count: 1006 },
                            { value: 'Berlin', count: 104 },
                            { value: 'Brandenburg', count: 195 },
                            { value: 'Bremen', count: 43 },
                            { value: 'Hamburg', count: 66 },
                            { value: 'Hessen', count: 241 },
                            { value: 'Mecklenburg-Vorpommern', count: 158 },
                            { value: 'Niedersachsen', count: 824 },
                            { value: 'Nordrhein-Westfalen', count: 869 },
                            { value: 'Rheinland-Pfalz', count: 137 },
                            { value: 'Saarland', count: 38 },
                            { value: 'Sachsen', count: 219 },
                            { value: 'Sachsen-Anhalt', count: 144 },
                            { value: 'Schleswig-Holstein', count: 358 },
                            { value: 'Thüringen', count: 124 }
                        ].map(state => (
                            <label key={state.value} className="flex items-center justify-between cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors">
                                <div className="flex items-center">
                                    <input type="radio" name="state" value={state.value} checked={selectedState === state.value} onChange={(e) => setSelectedState(e.target.value)} className="w-4 h-4 text-red-600 focus:ring-red-500" />
                                    <span className="ml-2 text-sm text-gray-700">{state.value}</span>
                                </div>
                                <span className="text-xs text-gray-500">({state.count.toLocaleString('de-DE')})</span>
                            </label>
                        ))}
                    </div>
                </div>
            </aside>
            <div className="flex-1">
                <div className="bg-red-600 rounded-2xl shadow-xl p-8 mb-6 relative overflow-hidden"><div className="absolute inset-0 opacity-10"><div className="absolute top-0 left-0 w-full h-full" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,.1) 35px, rgba(255,255,255,.1) 70px)' }}></div></div>
                    <div className="relative z-10"><div className="flex items-center justify-between"><div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                            <svg className="w-10 h-10 text-white" viewBox="0 0 64 64" fill="none" stroke="currentColor">
                                <circle cx="32" cy="28" r="10" strokeWidth="2.5" fill="currentColor" opacity="0.3" />
                                <circle cx="32" cy="28" r="10" strokeWidth="2.5" strokeLinecap="round" />
                                <path d="M28 26 L28 30 L32 30" strokeWidth="2.5" strokeLinecap="round" />
                                <circle cx="32" cy="28" r="2" fill="currentColor" />
                            </svg>
                        </div>
                        <div><h1 className="text-4xl font-bold text-white mb-1">Vermisste Tiere</h1><p className="text-white text-lg opacity-90">Vermisste Tiere</p></div>
                    </div>
                        <div className="hidden lg:flex items-center gap-6 text-white"><div className="text-center"><div className="text-3xl font-bold">{filteredListings.length}</div><div className="text-sm opacity-80">Anzeigen</div></div></div>
                    </div></div>
                </div>
                <div className="bg-white rounded-lg shadow-sm p-6"><h2 className="text-2xl font-bold text-gray-900 mb-4">{filteredListings.length} Anzeigen</h2>
                    {loading ? (<div className="flex justify-center items-center py-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div></div>) : filteredListings.length === 0 ? (<div className="text-center py-12"><p className="text-gray-500 text-lg">Keine Anzeigen gefunden</p></div>) : (
                        <div className="space-y-4">{filteredListings.map((listing) => (
                            <div key={listing.id} className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer group overflow-hidden flex" onClick={() => navigate(`/product/${listing.id}`)}><div className="relative w-64 h-48 flex-shrink-0 bg-gray-100"><img src={listing.image || listing.images?.[0] || 'https://via.placeholder.com/300x200'} alt={listing.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                                <button onClick={(e) => { e.stopPropagation(); toggleFavorite(listing.id); }} className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-lg hover:scale-110 transition-transform">
                                    <svg className={`w-5 h-5 ${favorites.includes(listing.id) ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} fill={favorites.includes(listing.id) ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                                </button>
                            </div>
                                <div className="flex-1 p-6 flex flex-col justify-between">
                                    <div>
                                        <h3 className="font-semibold text-xl text-gray-900 mb-2 group-hover:text-red-600 transition-colors">{listing.title}</h3>
                                        <p className="text-gray-600 text-sm line-clamp-2 mb-3">{listing.description}</p>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <p className="text-2xl font-bold text-red-600">{typeof listing.price === 'string' ? listing.price : listing.price ? `${listing.price.toLocaleString('de-DE')} €` : 'VB'}</p>
                                        {listing.city && (<div className="text-sm text-gray-500 flex items-center gap-1"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>{listing.city}</div>)}
                                    </div>
                                </div>
                            </div>
                        ))}</div>
                    )}
                </div>
            </div>
        </div></div></div>
    );
}
export default VermissTierePage;
