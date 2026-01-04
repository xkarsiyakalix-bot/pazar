import React, { useState, useEffect } from 'react';
import { mockListings } from './components';
import { useNavigate } from 'react-router-dom';
import { CategoryGallery } from './components';

function HerrenbekleidungPage() {
    const navigate = useNavigate();
    const [selectedArt, setSelectedArt] = useState([]);
    const [selectedMarke, setSelectedMarke] = useState([]);
    const [selectedGroesse, setSelectedGroesse] = useState([]);
    const [selectedVersand, setSelectedVersand] = useState([]);
    const [selectedFarbe, setSelectedFarbe] = useState([]);
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
        listing.category === 'Mode & Beauty' &&
        listing.subCategory === 'Herrenbekleidung' &&
        (selectedArt.length === 0 || selectedArt.includes(listing.art)) &&
        (selectedMarke.length === 0 || selectedMarke.includes(listing.marke)) &&
        (selectedGroesse.length === 0 || selectedGroesse.includes(listing.groesse)) &&
        (selectedVersand.length === 0 || selectedVersand.includes(listing.versand)) &&
        (selectedFarbe.length === 0 || selectedFarbe.includes(listing.farbe)) &&
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
            <aside className="w-96 flex-shrink-0 bg-white rounded-2xl shadow-lg p-6 h-fit sticky top-6">
                {/* Category Navigation */}
                <div className="mb-6 pb-6 border-b border-gray-200">
                    <h3 className="font-bold text-gray-900 mb-3 text-base">Kategorien</h3>
                    <button onClick={() => navigate('/Alle-Kategorien')} className="w-full text-left px-3 py-2 rounded-lg text-sm transition-all bg-gray-100 text-gray-700 hover:bg-gray-200 flex items-center justify-between group">
                        <span>Alle Kategorien</span>
                        <svg className="w-4 h-4 text-gray-400 group-hover:text-red-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                    </button>
                    <div className="space-y-2 mt-3">
                        <button onClick={() => navigate('/Mode-Beauty')} className="text-left px-3 py-2 rounded-lg text-sm transition-all bg-gray-100 text-gray-700 hover:bg-gray-200 flex items-center justify-between group ml-4" style={{ width: 'calc(100% - 1rem)' }}>
                            <span>Mode & Beauty</span>
                            <svg className="w-4 h-4 text-gray-400 group-hover:text-red-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                        </button>
                        <button className="text-left px-3 py-2 rounded-lg text-sm transition-all bg-red-600 text-white shadow-md flex items-center justify-between ml-8" style={{ width: 'calc(100% - 2rem)' }}>
                            <span>Herrenbekleidung</span>
                            <button onClick={(e) => { e.stopPropagation(); navigate('/Mode-Beauty'); }} className="text-white hover:text-red-200 transition-colors" title="Kategorie schließen">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </button>
                    </div>
                </div>

                <div className="flex items-center justify-between mb-6"><h3 className="font-bold text-gray-900 text-lg">Filter</h3><button onClick={() => {
                    setSelectedArt([]); setSelectedMarke([]); setSelectedGroesse([]); setSelectedVersand([]); setSelectedFarbe([]); setSelectedZustand([]); setPriceFrom(''); setPriceTo(''); setSelectedAngebotstyp([]); setSelectedAnbieter([]); setDirektKaufen(false); setSelectedPaketdienst([]); setSelectedOrt([]);
                }} className="text-sm text-red-600 hover:text-red-700 font-medium">Zurücksetzen</button></div>

                {/* Art - 13 options */}
                <div className="mb-6 pb-6 border-b border-gray-200"><h4 className="font-bold text-gray-900 mb-3 text-base">Art</h4><div className="space-y-2 max-h-64 overflow-y-auto">
                    {[{ v: 'Anzüge', c: '35.569' }, { v: 'Bademode', c: '8.695' }, { v: 'Hemden', c: '167.184' }, { v: 'Hochzeitsmode', c: '2.294' }, { v: 'Hosen', c: '250.010' }, { v: 'Jacken & Mäntel', c: '517.006' }, { v: 'Jeans', c: '37.800' }, { v: 'Kostüme & Verkleidungen', c: '7.129' }, { v: 'Pullover', c: '220.381' }, { v: 'Shirts', c: '299.875' }, { v: 'Shorts', c: '18.204' }, { v: 'Sportbekleidung', c: '64.380' }, { v: 'Weitere Herrenbekleidung', c: '73.953' }].map(o => (<label key={o.v} className="flex items-center justify-between cursor-pointer group"><div className="flex items-center"><input type="checkbox" checked={selectedArt.includes(o.v)} onChange={() => toggleFilter(o.v, selectedArt, setSelectedArt)} className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500" /><span className="ml-2 text-sm text-gray-700 group-hover:text-gray-900">{o.v}</span></div><span className="text-xs text-gray-500">({o.c})</span></label>))}</div></div>

                {/* Marke - Top 20 */}
                <div className="mb-6 pb-6 border-b border-gray-200"><h4 className="font-bold text-gray-900 mb-3 text-base">Marke (Top 20)</h4><div className="space-y-2 max-h-64 overflow-y-auto">
                    {[{ v: 'Sonstige', c: '577.932' }, { v: 'Adidas', c: '63.381' }, { v: 'Nike', c: '55.259' }, { v: 'Tommy Hilfiger', c: '43.869' }, { v: 'Jack & Jones', c: '33.418' }, { v: 'H&M', c: '29.608' }, { v: 'Ralph Lauren', c: '28.068' }, { v: 'S.Oliver', c: '20.992' }, { v: 'Tom Tailor', c: '20.674' }, { v: 'Zara', c: '19.899' }, { v: 'Puma', c: '17.808' }, { v: 'Camp David', c: '17.619' }, { v: 'Wellensteyn', c: '16.892' }, { v: 'Levi\'s', c: '16.659' }, { v: 'Hugo Boss', c: '15.723' }, { v: 'Esprit', c: '14.779' }, { v: 'C&A', c: '14.579' }, { v: 'Engelbert Strauss', c: '13.569' }, { v: 'Lacoste', c: '12.232' }, { v: 'G-Star', c: '11.993' }].map(o => (<label key={o.v} className="flex items-center justify-between cursor-pointer group"><div className="flex items-center"><input type="checkbox" checked={selectedMarke.includes(o.v)} onChange={() => toggleFilter(o.v, selectedMarke, setSelectedMarke)} className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500" /><span className="ml-2 text-sm text-gray-700 group-hover:text-gray-900">{o.v}</span></div><span className="text-xs text-gray-500">({o.c})</span></label>))}</div></div>

                {/* Größe - 14 sizes */}
                <div className="mb-6 pb-6 border-b border-gray-200"><h4 className="font-bold text-gray-900 mb-3 text-base">Größe</h4><div className="space-y-2 max-h-64 overflow-y-auto">
                    {[{ v: 'Einheitsgröße', c: '62.184' }, { v: 'XXS', c: '1.793' }, { v: 'XS', c: '27.235' }, { v: 'S', c: '224.710' }, { v: 'M', c: '450.134' }, { v: 'L', c: '440.131' }, { v: 'XL', c: '302.195' }, { v: 'XXL', c: '143.582' }, { v: 'XXXL', c: '33.303' }, { v: '4XL', c: '8.854' }, { v: '5XL', c: '4.792' }, { v: '6XL', c: '2.024' }, { v: '7XL', c: '736' }, { v: '8XL & mehr', c: '787' }].map(o => (<label key={o.v} className="flex items-center justify-between cursor-pointer group"><div className="flex items-center"><input type="checkbox" checked={selectedGroesse.includes(o.v)} onChange={() => toggleFilter(o.v, selectedGroesse, setSelectedGroesse)} className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500" /><span className="ml-2 text-sm text-gray-700 group-hover:text-gray-900">{o.v}</span></div><span className="text-xs text-gray-500">({o.c})</span></label>))}</div></div>

                {/* Versand */}
                <div className="mb-6 pb-6 border-b border-gray-200"><h4 className="font-bold text-gray-900 mb-3 text-base">Versand</h4><div className="space-y-2">
                    {[{ v: 'Versand möglich', c: '1.585.748' }, { v: 'Nur Abholung', c: '113.148' }].map(o => (<label key={o.v} className="flex items-center justify-between cursor-pointer group"><div className="flex items-center"><input type="checkbox" checked={selectedVersand.includes(o.v)} onChange={() => toggleFilter(o.v, selectedVersand, setSelectedVersand)} className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500" /><span className="ml-2 text-sm text-gray-700 group-hover:text-gray-900">{o.v}</span></div><span className="text-xs text-gray-500">({o.c})</span></label>))}</div></div>

                {/* Farbe - 22 colors */}
                <div className="mb-6 pb-6 border-b border-gray-200"><h4 className="font-bold text-gray-900 mb-3 text-base">Farbe</h4><div className="space-y-2 max-h-64 overflow-y-auto">
                    {[{ v: 'Beige', c: '60.925' }, { v: 'Blau', c: '383.259' }, { v: 'Braun', c: '82.932' }, { v: 'Bunt', c: '35.851' }, { v: 'Creme', c: '11.473' }, { v: 'Gelb', c: '20.596' }, { v: 'Gold', c: '1.594' }, { v: 'Grau', c: '187.379' }, { v: 'Grün', c: '70.537' }, { v: 'Khaki', c: '25.723' }, { v: 'Lavendel', c: '1.049' }, { v: 'Lila', c: '9.561' }, { v: 'Orange', c: '15.792' }, { v: 'Pink', c: '4.860' }, { v: 'Print', c: '1.302' }, { v: 'Rosé', c: '5.180' }, { v: 'Rot', c: '71.595' }, { v: 'Schwarz', c: '396.182' }, { v: 'Silber', c: '2.345' }, { v: 'Türkis', c: '7.351' }, { v: 'Weiß', c: '98.703' }, { v: 'Andere Farben', c: '205.942' }].map(o => (<label key={o.v} className="flex items-center justify-between cursor-pointer group"><div className="flex items-center"><input type="checkbox" checked={selectedFarbe.includes(o.v)} onChange={() => toggleFilter(o.v, selectedFarbe, setSelectedFarbe)} className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500" /><span className="ml-2 text-sm text-gray-700 group-hover:text-gray-900">{o.v}</span></div><span className="text-xs text-gray-500">({o.c})</span></label>))}</div></div>

                {/* Zustand - 5 */}
                <div className="mb-6 pb-6 border-b border-gray-200"><h4 className="font-bold text-gray-900 mb-3 text-base">Zustand</h4><div className="space-y-2">
                    {[{ v: 'Neu mit Etikett', c: '127.145' }, { v: 'Neu', c: '267.663' }, { v: 'Sehr Gut', c: '1.027.250' }, { v: 'Gut', c: '253.869' }, { v: 'In Ordnung', c: '24.307' }].map(o => (<label key={o.v} className="flex items-center justify-between cursor-pointer group"><div className="flex items-center"><input type="checkbox" checked={selectedZustand.includes(o.v)} onChange={() => toggleFilter(o.v, selectedZustand, setSelectedZustand)} className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500" /><span className="ml-2 text-sm text-gray-700 group-hover:text-gray-900">{o.v}</span></div><span className="text-xs text-gray-500">({o.c})</span></label>))}</div></div>

                {/* Preis */}
                <div className="mb-6 pb-6 border-b border-gray-200"><h4 className="font-bold text-gray-900 mb-3 text-base">Preis</h4><div className="grid grid-cols-2 gap-3">
                    <div><label className="block text-xs text-gray-600 mb-1">Von</label><input type="number" value={priceFrom} onChange={(e) => setPriceFrom(e.target.value)} placeholder="0" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-300" /></div>
                    <div><label className="block text-xs text-gray-600 mb-1">Bis</label><input type="number" value={priceTo} onChange={(e) => setPriceTo(e.target.value)} placeholder="∞" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-300" /></div>
                </div></div>

                {/* Angebotstyp */}
                <div className="mb-6 pb-6 border-b border-gray-200"><h4 className="font-bold text-gray-900 mb-3 text-base">Angebotstyp</h4><div className="space-y-2">
                    {[{ v: 'Angebote', c: '1.699.552' }, { v: 'Gesuche', c: '2.957' }].map(o => (<label key={o.v} className="flex items-center justify-between cursor-pointer group"><div className="flex items-center"><input type="checkbox" checked={selectedAngebotstyp.includes(o.v)} onChange={() => toggleFilter(o.v, selectedAngebotstyp, setSelectedAngebotstyp)} className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500" /><span className="ml-2 text-sm text-gray-700 group-hover:text-gray-900">{o.v}</span></div><span className="text-xs text-gray-500">({o.c})</span></label>))}</div></div>

                {/* Anbieter */}
                <div className="mb-6 pb-6 border-b border-gray-200"><h4 className="font-bold text-gray-900 mb-3 text-base">Anbieter</h4><div className="space-y-2">
                    {[{ v: 'Privat', c: '1.689.687' }, { v: 'Gewerblich', c: '12.822' }].map(o => (<label key={o.v} className="flex items-center justify-between cursor-pointer group"><div className="flex items-center"><input type="checkbox" checked={selectedAnbieter.includes(o.v)} onChange={() => toggleFilter(o.v, selectedAnbieter, setSelectedAnbieter)} className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500" /><span className="ml-2 text-sm text-gray-700 group-hover:text-gray-900">{o.v}</span></div><span className="text-xs text-gray-500">({o.c})</span></label>))}</div></div>

                {/* Direkt kaufen */}
                <div className="mb-6 pb-6 border-b border-gray-200"><h4 className="font-bold text-gray-900 mb-3 text-base">Direkt kaufen</h4>
                    <label className="flex items-center justify-between cursor-pointer group"><div className="flex items-center"><input type="checkbox" checked={direktKaufen} onChange={(e) => setDirektKaufen(e.target.checked)} className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500" /><span className="ml-2 text-sm text-gray-700 group-hover:text-gray-900">Aktiv</span></div><span className="text-xs text-gray-500">(582.030)</span></label>
                </div>

                {/* Paketdienst */}
                <div className="mb-6 pb-6 border-b border-gray-200"><h4 className="font-bold text-gray-900 mb-3 text-base">Paketdienst</h4><div className="space-y-2">
                    {[{ v: 'DHL', c: '1.214.112' }, { v: 'Hermes', c: '1.154.202' }].map(o => (<label key={o.v} className="flex items-center justify-between cursor-pointer group"><div className="flex items-center"><input type="checkbox" checked={selectedPaketdienst.includes(o.v)} onChange={() => toggleFilter(o.v, selectedPaketdienst, setSelectedPaketdienst)} className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500" /><span className="ml-2 text-sm text-gray-700 group-hover:text-gray-900">{o.v}</span></div><span className="text-xs text-gray-500">({o.c})</span></label>))}</div></div>

                {/* Ort */}
                <div className="mb-6"><h4 className="font-bold text-gray-900 mb-3 text-base">Ort</h4><div className="space-y-2 max-h-64 overflow-y-auto">
                    {[{ v: 'Baden-Württemberg', c: '197.845' }, { v: 'Bayern', c: '293.776' }, { v: 'Berlin', c: '83.946' }, { v: 'Brandenburg', c: '38.034' }, { v: 'Bremen', c: '13.372' }, { v: 'Hamburg', c: '51.192' }, { v: 'Hessen', c: '137.826' }, { v: 'Mecklenburg-Vorpommern', c: '21.713' }, { v: 'Niedersachsen', c: '174.125' }, { v: 'Nordrhein-Westfalen', c: '402.991' }, { v: 'Rheinland-Pfalz', c: '79.747' }, { v: 'Saarland', c: '20.243' }, { v: 'Sachsen', c: '64.374' }, { v: 'Sachsen-Anhalt', c: '29.656' }, { v: 'Schleswig-Holstein', c: '66.016' }, { v: 'Thüringen', c: '27.653' }].map(o => (<label key={o.v} className="flex items-center justify-between cursor-pointer group"><div className="flex items-center"><input type="checkbox" checked={selectedOrt.includes(o.v)} onChange={() => toggleFilter(o.v, selectedOrt, setSelectedOrt)} className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500" /><span className="ml-2 text-sm text-gray-700 group-hover:text-gray-900">{o.v}</span></div><span className="text-xs text-gray-500">({o.c})</span></label>))}</div></div>
            </aside>
            <div className="flex-1">
                <div className="bg-red-600 rounded-2xl shadow-xl p-8 mb-6 relative overflow-hidden"><div className="absolute inset-0 opacity-10"><div className="absolute top-0 left-0 w-full h-full" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,.1) 35px, rgba(255,255,255,.1) 70px)' }}></div></div>
                    <div className="relative z-10"><div className="flex items-center justify-between"><div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                            <svg className="w-10 h-10 text-white" viewBox="0 0 64 64" fill="none" stroke="currentColor">
                                <rect x="16" y="24" width="32" height="24" strokeWidth="2.5" fill="currentColor" opacity="0.3" rx="2" />
                                <rect x="16" y="24" width="32" height="24" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" rx="2" />
                                <path d="M20 28 Q32 34 44 28" strokeWidth="2" strokeLinecap="round" />
                                <path d="M20 34 Q32 40 44 34" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                        </div>
                        <div><h1 className="text-4xl font-bold text-white mb-1">Herrenbekleidung</h1><p className="text-white text-lg opacity-90">Herrenmode und Bekleidung</p></div>
                    </div>
                        <div className="hidden lg:flex items-center gap-6 text-white"><div className="text-center"><div className="text-3xl font-bold">{filteredListings.length}</div><div className="text-sm opacity-80">Anzeigen</div></div></div>
                    </div></div>
                </div>


                <div style={{ maxWidth: '960px' }}>
                    <CategoryGallery
                        category="Mode & Beauty"
                        subCategory="Herrenbekleidung"
                        toggleFavorite={toggleFavorite}
                        isFavorite={(id) => favorites.includes(id)}
                    />
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6"><h2 className="text-2xl font-bold text-gray-900 mb-4">{filteredListings.length} Anzeigen</h2>
                    {loading ? (<div className="flex justify-center items-center py-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div></div>) : filteredListings.length === 0 ? (<div className="text-center py-12"><p className="text-gray-500 text-lg">Keine Anzeigen gefunden</p></div>) : (
                        <div className="space-y-4">{filteredListings.map((listing) => (
                            <div key={listing.id} className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer group overflow-hidden flex" onClick={() => navigate(`/product/${listing.id}`)}>
                                <div className="relative w-64 h-48 flex-shrink-0 bg-gray-100"><img src={listing.image || listing.images?.[0] || 'https://via.placeholder.com/300x200'} alt={listing.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
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

export default HerrenbekleidungPage;
