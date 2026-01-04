import React, { useState, useEffect } from 'react';
import { mockListings } from './components';
import { useNavigate } from 'react-router-dom';
import { CategoryGallery } from './components';

function DienstleistungenElektronikPage() {
    const navigate = useNavigate();
    const [priceFrom, setPriceFrom] = useState('');
    const [priceTo, setPriceTo] = useState('');
    const [offerType, setOfferType] = useState('');
    const [providerType, setProviderType] = useState('');
    const [location, setLocation] = useState('');
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [favorites, setFavorites] = useState(() => JSON.parse(localStorage.getItem('favorites') || '[]'));

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

    const filteredListings = listings.filter(listing => listing.category === 'Dienstleistungen' && listing.subCategory === 'Elektronik');

    return (
        <div className="min-h-screen bg-gray-50"><div className="max-w-[1400px] mx-auto px-4 py-6"><div className="flex gap-6">
            <aside className="w-96 flex-shrink-0 bg-white rounded-2xl shadow-lg p-6 h-fit sticky top-6">                <div className="mb-6 pb-6 border-b border-gray-200">
                <h3 className="font-bold text-gray-900 mb-3 text-base">Kategorien</h3>
                <button onClick={() => navigate('/Alle-Kategorien')} className="w-full text-left px-3 py-2 rounded-lg text-sm transition-all bg-gray-100 text-gray-700 hover:bg-gray-200 flex items-center justify-between group">
                    <span>Alle Kategorien</span>
                    <svg className="w-4 h-4 text-gray-400 group-hover:text-red-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </button>
                <div className="space-y-2 mt-3">
                    <button onClick={() => navigate('/Dienstleistungen')} className="text-left px-3 py-2 rounded-lg text-sm transition-all bg-gray-100 text-gray-700 hover:bg-gray-200 flex items-center justify-between group ml-4" style={{ width: 'calc(100% - 1rem)' }}>
                        <span>Dienstleistungen</span>
                        <svg className="w-4 h-4 text-gray-400 group-hover:text-red-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                    </button>
                    <button className="text-left px-3 py-2 rounded-lg text-sm transition-all bg-red-600 text-white shadow-md flex items-center justify-between ml-8" style={{ width: 'calc(100% - 2rem)' }}>
                        <span>Elektronik</span>
                        <button onClick={(e) => { e.stopPropagation(); navigate('/Dienstleistungen'); }} className="text-white hover:text-red-200 transition-colors" title="Kategorie schließen">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </button>
                </div>
            </div>

                <div className="flex items-center justify-between mb-6"><h3 className="font-bold text-gray-900 text-lg">Filter</h3><button onClick={() => { setPriceFrom(''); setPriceTo(''); setOfferType(''); setProviderType(''); setLocation(''); }} className="text-sm text-red-600 hover:text-red-700 font-medium">Zurücksetzen</button></div>

                {/* Preis */}
                <div className="mb-6 pb-6 border-b border-gray-200"><h4 className="font-bold text-gray-900 mb-3 text-base">Preis</h4><div className="grid grid-cols-2 gap-3">
                    <div><input type="number" value={priceFrom} onChange={(e) => setPriceFrom(e.target.value)} placeholder="Von €" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-300" /></div>
                    <div><input type="number" value={priceTo} onChange={(e) => setPriceTo(e.target.value)} placeholder="Bis €" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-300" /></div>
                </div></div>

                {/* Angebotstyp */}
                <div className="mb-6 pb-6 border-b border-gray-200">
                    <h4 className="font-bold text-gray-900 mb-3 text-base">Angebotstyp</h4>
                    <div className="space-y-2">
                        {[
                            { name: 'Angebote', count: 15516 },
                            { name: 'Gesuche', count: 820 },
                        ].map((type) => (
                            <label key={type.name} className="flex items-center justify-between cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors">
                                <div className="flex items-center gap-2">
                                    <input type="radio" name="offerType" value={type.name} checked={offerType === type.name} onChange={(e) => setOfferType(e.target.value)} className="text-red-500 focus:ring-red-300" />
                                    <span className="text-sm text-gray-700">{type.name}</span>
                                </div>
                                <span className="text-xs text-gray-400">({type.count.toLocaleString('de-DE')})</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Anbieter */}
                <div className="mb-6 pb-6 border-b border-gray-200">
                    <h4 className="font-bold text-gray-900 mb-3 text-base">Anbieter</h4>
                    <div className="space-y-2">
                        {[
                            { name: 'Privat', count: 10402 },
                            { name: 'Gewerblich', count: 5934 },
                        ].map((type) => (
                            <label key={type.name} className="flex items-center justify-between cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors">
                                <div className="flex items-center gap-2">
                                    <input type="radio" name="providerType" value={type.name} checked={providerType === type.name} onChange={(e) => setProviderType(e.target.value)} className="text-red-500 focus:ring-red-300" />
                                    <span className="text-sm text-gray-700">{type.name}</span>
                                </div>
                                <span className="text-xs text-gray-400">({type.count.toLocaleString('de-DE')})</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Ort */}
                <div className="mb-6">
                    <h4 className="font-bold text-gray-900 mb-3 text-base">Ort</h4>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                        {[
                            { name: 'Baden-Württemberg', count: 2105 },
                            { name: 'Bayern', count: 2395 },
                            { name: 'Berlin', count: 1135 },
                            { name: 'Brandenburg', count: 313 },
                            { name: 'Bremen', count: 146 },
                            { name: 'Hamburg', count: 413 },
                            { name: 'Hessen', count: 1344 },
                            { name: 'Mecklenburg-Vorpommern', count: 191 },
                            { name: 'Niedersachsen', count: 1619 },
                            { name: 'Nordrhein-Westfalen', count: 4127 },
                            { name: 'Rheinland-Pfalz', count: 654 },
                            { name: 'Saarland', count: 200 },
                            { name: 'Sachsen', count: 626 },
                            { name: 'Sachsen-Anhalt', count: 262 },
                            { name: 'Schleswig-Holstein', count: 548 },
                            { name: 'Thüringen', count: 258 },
                        ].map((state) => (
                            <label key={state.name} className="flex items-center justify-between cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors">
                                <div className="flex items-center gap-2">
                                    <input type="radio" name="location" value={state.name} checked={location === state.name} onChange={(e) => setLocation(e.target.value)} className="text-red-500 focus:ring-red-300" />
                                    <span className="text-sm text-gray-700">{state.name}</span>
                                </div>
                                <span className="text-xs text-gray-400">({state.count.toLocaleString('de-DE')})</span>
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
                                <rect x="22" y="24" width="20" height="16" strokeWidth="2.5" fill="currentColor" opacity="0.3" rx="2" /><rect x="22" y="24" width="20" height="16" strokeWidth="2.5" rx="2" /><circle cx="32" cy="32" r="3" fill="currentColor" />
                            </svg>
                        </div>
                        <div><h1 className="text-4xl font-bold text-white mb-1">Elektronik</h1><p className="text-white text-lg opacity-90">Elektronik Reparatur & Service</p></div>
                    </div>
                        <div className="hidden lg:flex items-center gap-6 text-white"><div className="text-center"><div className="text-3xl font-bold">{filteredListings.length}</div><div className="text-sm opacity-80">Anzeigen</div></div></div>
                    </div></div>
                </div>


                <div style={{ maxWidth: '960px' }}>
                    <CategoryGallery
                        category="Dienstleistungen"
                        subCategory="Elektronik"
                        toggleFavorite={toggleFavorite}
                        isFavorite={(id) => favorites.includes(id)}
                    />
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6"><h2 className="text-2xl font-bold text-gray-900 mb-4">{filteredListings.length} Anzeigen</h2>
                    {loading ? (<div className="flex justify-center items-center py-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div></div>) : filteredListings.length === 0 ? (<div className="text-center py-12"><p className="text-gray-500 text-lg">Keine Anzeigen gefunden</p></div>) : (
                        <div className="space-y-4">{filteredListings.map((listing) => (
                            <div key={listing.id} className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer group overflow-hidden flex" onClick={() => navigate(`/product/${listing.id}`)}><div className="relative w-64 h-48 flex-shrink-0 bg-gray-100"><img src={listing.image || 'https://via.placeholder.com/300x200'} alt={listing.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
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
export default DienstleistungenElektronikPage;
