import React, { useState, useEffect } from 'react';
import { mockListings } from './components';
import { useNavigate } from 'react-router-dom';
import { CategoryGallery } from './components';

function VideospielePage() {
    const navigate = useNavigate();
    const [selectedArt, setSelectedArt] = useState([]);
    const [selectedVersand, setSelectedVersand] = useState([]);
    const [selectedZustand, setSelectedZustand] = useState([]);
    const [priceFrom, setPriceFrom] = useState('');
    const [priceTo, setPriceTo] = useState('');
    const [selectedAngebotstyp, setSelectedAngebotstyp] = useState([]);
    const [selectedAnbieter, setSelectedAnbieter] = useState([]);
    const [direktKaufen, setDirektKaufen] = useState(false);
    const [selectedPaketdienst, setSelectedPaketdienst] = useState([]);
    const [selectedOrt, setSelectedOrt] = useState([]);
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

    const toggleFilter = (value, selectedArray, setSelectedArray) => {
        setSelectedArray(prev => prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]);
    };

    const filteredListings = listings.filter(listing =>
        listing.category === 'Elektronik' &&
        listing.subCategory === 'Videospiele' &&
        (selectedArt.length === 0 || selectedArt.includes(listing.art)) &&
        (selectedVersand.length === 0 || selectedVersand.includes(listing.versand)) &&
        (selectedZustand.length === 0 || selectedZustand.includes(listing.zustand)) &&
        (!priceFrom || listing.price >= parseFloat(priceFrom)) &&
        (!priceTo || listing.price <= parseFloat(priceTo)) &&
        (selectedAngebotstyp.length === 0 || selectedAngebotstyp.includes(listing.angebotstyp)) &&
        (selectedAnbieter.length === 0 || selectedAnbieter.includes(listing.anbieter)) &&
        (!direktKaufen || listing.direktKaufen) &&
        (selectedPaketdienst.length === 0 || selectedPaketdienst.includes(listing.paketdienst)) &&
        (selectedOrt.length === 0 || selectedOrt.includes(listing.ort))
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
                    <button onClick={() => navigate('/Elektronik')} className="text-left px-3 py-2 rounded-lg text-sm transition-all bg-gray-100 text-gray-700 hover:bg-gray-200 flex items-center justify-between group ml-4" style={{ width: 'calc(100% - 1rem)' }}>
                        <span>Elektronik</span>
                        <svg className="w-4 h-4 text-gray-400 group-hover:text-red-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                    </button>
                    <button className="text-left px-3 py-2 rounded-lg text-sm transition-all bg-red-600 text-white shadow-md flex items-center justify-between ml-8" style={{ width: 'calc(100% - 2rem)' }}>
                        <span>Videospiele</span>
                        <button onClick={(e) => { e.stopPropagation(); navigate('/Elektronik'); }} className="text-white hover:text-red-200 transition-colors" title="Kategorie schließen">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </button>
                </div>
            </div>

                <div className="flex items-center justify-between mb-6"><h3 className="font-bold text-gray-900 text-lg">Filter</h3><button onClick={() => {
                    setSelectedArt([]);
                    setSelectedVersand([]);
                    setSelectedZustand([]);
                    setPriceFrom('');
                    setPriceTo('');
                    setSelectedAngebotstyp([]);
                    setSelectedAnbieter([]);
                    setDirektKaufen(false);
                    setSelectedPaketdienst([]);
                    setSelectedOrt([]);
                }} className="text-sm text-red-600 hover:text-red-700 font-medium">Zurücksetzen</button></div>

                {/* Art Filter */}
                <div className="mb-6 pb-6 border-b border-gray-200">
                    <h4 className="font-bold text-gray-900 mb-3 text-base">Art</h4>
                    <div className="space-y-2">
                        {[
                            { value: 'DS(i)- & PSP Spiele', label: 'DS(i)- & PSP Spiele', count: '2.444' },
                            { value: 'Nintendo Spiele', label: 'Nintendo Spiele', count: '185.781' },
                            { value: 'PlayStation Spiele', label: 'PlayStation Spiele', count: '137.853' },
                            { value: 'Xbox Spiele', label: 'Xbox Spiele', count: '20.247' },
                            { value: 'Wii Spiele', label: 'Wii Spiele', count: '17.821' },
                            { value: 'PC Spiele', label: 'PC Spiele', count: '43.292' },
                            { value: 'Weitere Videospiele', label: 'Weitere Videospiele', count: '15.984' }
                        ].map(option => (
                            <label key={option.value} className="flex items-center justify-between cursor-pointer group">
                                <div className="flex items-center">
                                    <input type="checkbox" checked={selectedArt.includes(option.value)} onChange={() => toggleFilter(option.value, selectedArt, setSelectedArt)} className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500" />
                                    <span className="ml-2 text-sm text-gray-700 group-hover:text-gray-900">{option.label}</span>
                                </div>
                                <span className="text-xs text-gray-500">({option.count})</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Versand Filter */}
                <div className="mb-6 pb-6 border-b border-gray-200">
                    <h4 className="font-bold text-gray-900 mb-3 text-base">Versand</h4>
                    <div className="space-y-2">
                        {[
                            { value: 'Versand möglich', label: 'Versand möglich', count: '357.699' },
                            { value: 'Nur Abholung', label: 'Nur Abholung', count: '64.163' }
                        ].map(option => (
                            <label key={option.value} className="flex items-center justify-between cursor-pointer group">
                                <div className="flex items-center">
                                    <input type="checkbox" checked={selectedVersand.includes(option.value)} onChange={() => toggleFilter(option.value, selectedVersand, setSelectedVersand)} className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500" />
                                    <span className="ml-2 text-sm text-gray-700 group-hover:text-gray-900">{option.label}</span>
                                </div>
                                <span className="text-xs text-gray-500">({option.count})</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Zustand Filter */}
                <div className="mb-6 pb-6 border-b border-gray-200">
                    <h4 className="font-bold text-gray-900 mb-3 text-base">Zustand</h4>
                    <div className="space-y-2">
                        {[
                            { value: 'Neu', label: 'Neu', count: '38.301' },
                            { value: 'Sehr Gut', label: 'Sehr Gut', count: '230.421' },
                            { value: 'Gut', label: 'Gut', count: '88.462' },
                            { value: 'In Ordnung', label: 'In Ordnung', count: '10.541' }
                        ].map(option => (
                            <label key={option.value} className="flex items-center justify-between cursor-pointer group">
                                <div className="flex items-center">
                                    <input type="checkbox" checked={selectedZustand.includes(option.value)} onChange={() => toggleFilter(option.value, selectedZustand, setSelectedZustand)} className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500" />
                                    <span className="ml-2 text-sm text-gray-700 group-hover:text-gray-900">{option.label}</span>
                                </div>
                                <span className="text-xs text-gray-500">({option.count})</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Preis Filter */}
                <div className="mb-6 pb-6 border-b border-gray-200">
                    <h4 className="font-bold text-gray-900 mb-3 text-base">Preis</h4>
                    <div className="grid grid-cols-2 gap-3">
                        <div><label className="block text-xs text-gray-600 mb-1">Von</label><input type="number" value={priceFrom} onChange={(e) => setPriceFrom(e.target.value)} placeholder="0" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-300" /></div>
                        <div><label className="block text-xs text-gray-600 mb-1">Bis</label><input type="number" value={priceTo} onChange={(e) => setPriceTo(e.target.value)} placeholder="∞" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-300" /></div>
                    </div>
                </div>

                {/* Angebotstyp Filter */}
                <div className="mb-6 pb-6 border-b border-gray-200">
                    <h4 className="font-bold text-gray-900 mb-3 text-base">Angebotstyp</h4>
                    <div className="space-y-2">
                        {[
                            { value: 'Angebote', label: 'Angebote', count: '421.594' },
                            { value: 'Gesuche', label: 'Gesuche', count: '1.840' }
                        ].map(option => (
                            <label key={option.value} className="flex items-center justify-between cursor-pointer group">
                                <div className="flex items-center">
                                    <input type="checkbox" checked={selectedAngebotstyp.includes(option.value)} onChange={() => toggleFilter(option.value, selectedAngebotstyp, setSelectedAngebotstyp)} className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500" />
                                    <span className="ml-2 text-sm text-gray-700 group-hover:text-gray-900">{option.label}</span>
                                </div>
                                <span className="text-xs text-gray-500">({option.count})</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Anbieter Filter */}
                <div className="mb-6 pb-6 border-b border-gray-200">
                    <h4 className="font-bold text-gray-900 mb-3 text-base">Anbieter</h4>
                    <div className="space-y-2">
                        {[
                            { value: 'Privat', label: 'Privat', count: '417.405' },
                            { value: 'Gewerblich', label: 'Gewerblich', count: '6.029' }
                        ].map(option => (
                            <label key={option.value} className="flex items-center justify-between cursor-pointer group">
                                <div className="flex items-center">
                                    <input type="checkbox" checked={selectedAnbieter.includes(option.value)} onChange={() => toggleFilter(option.value, selectedAnbieter, setSelectedAnbieter)} className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500" />
                                    <span className="ml-2 text-sm text-gray-700 group-hover:text-gray-900">{option.label}</span>
                                </div>
                                <span className="text-xs text-gray-500">({option.count})</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Direkt kaufen Filter */}
                <div className="mb-6 pb-6 border-b border-gray-200">
                    <h4 className="font-bold text-gray-900 mb-3 text-base">Direkt kaufen</h4>
                    <label className="flex items-center justify-between cursor-pointer group">
                        <div className="flex items-center">
                            <input type="checkbox" checked={direktKaufen} onChange={(e) => setDirektKaufen(e.target.checked)} className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500" />
                            <span className="ml-2 text-sm text-gray-700 group-hover:text-gray-900">Aktiv</span>
                        </div>
                        <span className="text-xs text-gray-500">(113.259)</span>
                    </label>
                </div>

                {/* Paketdienst Filter */}
                <div className="mb-6 pb-6 border-b border-gray-200">
                    <h4 className="font-bold text-gray-900 mb-3 text-base">Paketdienst</h4>
                    <div className="space-y-2">
                        {[
                            { value: 'DHL', label: 'DHL', count: '253.518' },
                            { value: 'Hermes', label: 'Hermes', count: '233.402' }
                        ].map(option => (
                            <label key={option.value} className="flex items-center justify-between cursor-pointer group">
                                <div className="flex items-center">
                                    <input type="checkbox" checked={selectedPaketdienst.includes(option.value)} onChange={() => toggleFilter(option.value, selectedPaketdienst, setSelectedPaketdienst)} className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500" />
                                    <span className="ml-2 text-sm text-gray-700 group-hover:text-gray-900">{option.label}</span>
                                </div>
                                <span className="text-xs text-gray-500">({option.count})</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Ort Filter */}
                <div className="mb-6">
                    <h4 className="font-bold text-gray-900 mb-3 text-base">Ort</h4>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                        {[
                            { value: 'Baden-Württemberg', label: 'Baden-Württemberg', count: '46.349' },
                            { value: 'Bayern', label: 'Bayern', count: '61.173' },
                            { value: 'Berlin', label: 'Berlin', count: '18.147' },
                            { value: 'Brandenburg', label: 'Brandenburg', count: '11.856' },
                            { value: 'Bremen', label: 'Bremen', count: '3.548' },
                            { value: 'Hamburg', label: 'Hamburg', count: '9.618' },
                            { value: 'Hessen', label: 'Hessen', count: '32.619' },
                            { value: 'Mecklenburg-Vorpommern', label: 'Mecklenburg-Vorpommern', count: '6.953' },
                            { value: 'Niedersachsen', label: 'Niedersachsen', count: '50.032' },
                            { value: 'Nordrhein-Westfalen', label: 'Nordrhein-Westfalen', count: '103.058' },
                            { value: 'Rheinland-Pfalz', label: 'Rheinland-Pfalz', count: '20.232' },
                            { value: 'Saarland', label: 'Saarland', count: '5.465' },
                            { value: 'Sachsen', label: 'Sachsen', count: '17.447' },
                            { value: 'Sachsen-Anhalt', label: 'Sachsen-Anhalt', count: '10.517' },
                            { value: 'Schleswig-Holstein', label: 'Schleswig-Holstein', count: '18.239' },
                            { value: 'Thüringen', label: 'Thüringen', count: '8.181' }
                        ].map(option => (
                            <label key={option.value} className="flex items-center justify-between cursor-pointer group">
                                <div className="flex items-center">
                                    <input type="checkbox" checked={selectedOrt.includes(option.value)} onChange={() => toggleFilter(option.value, selectedOrt, setSelectedOrt)} className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500" />
                                    <span className="ml-2 text-sm text-gray-700 group-hover:text-gray-900">{option.label}</span>
                                </div>
                                <span className="text-xs text-gray-500">({option.count})</span>
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
                                <circle cx="32" cy="32" r="16" strokeWidth="2.5" fill="currentColor" opacity="0.3" />
                                <circle cx="32" cy="32" r="16" strokeWidth="2.5" strokeLinecap="round" />
                                <path d="M24 32 L28 28 M28 36 L24 32 M40 28 L40 36" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                        </div>
                        <div><h1 className="text-4xl font-bold text-white mb-1">Videospiele</h1><p className="text-white text-lg opacity-90">Videospiele</p></div>
                    </div>
                        <div className="hidden lg:flex items-center gap-6 text-white"><div className="text-center"><div className="text-3xl font-bold">{filteredListings.length}</div><div className="text-sm opacity-80">Anzeigen</div></div></div>
                    </div></div>
                </div>


                <div style={{ maxWidth: '960px' }}>
                    <CategoryGallery
                        category="Elektronik"
                        subCategory="Videospiele"
                        toggleFavorite={toggleFavorite}
                        isFavorite={(id) => favorites.includes(id)}
                    />
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
export default VideospielePage;
