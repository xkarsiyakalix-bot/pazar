import React, { useState, useEffect } from 'react';
import { mockListings } from './components';
import { useNavigate } from 'react-router-dom';
import { CategoryGallery } from './components';

function HerrenschuhePage() {
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
        listing.subCategory === 'Herrenschuhe' &&
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
                            <span>Herrenschuhe</span>
                            <button onClick={(e) => { e.stopPropagation(); navigate('/Mode-Beauty'); }} className="text-white hover:text-red-200 transition-colors" title="Kategorie schließen">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </button>
                    </div>
                </div>

                <div className="flex items-center justify-between mb-6"><h3 className="font-bold text-gray-900 text-lg">Filter</h3><button onClick={() => {
                    setSelectedArt([]); setSelectedMarke([]); setSelectedGroesse([]); setSelectedVersand([]); setSelectedFarbe([]); setSelectedZustand([]); setPriceFrom(''); setPriceTo(''); setSelectedAngebotstyp([]); setSelectedAnbieter([]); setDirektKaufen(false); setSelectedPaketdienst([]); setSelectedOrt([]);
                }} className="text-sm text-red-600 hover:text-red-700 font-medium">Zurücksetzen</button></div>

                {/* Art - 7 options */}
                <div className="mb-6 pb-6 border-b border-gray-200"><h4 className="font-bold text-gray-900 mb-3 text-base">Art</h4><div className="space-y-2">
                    {[{ v: 'Halb- & Schnürschuhe', c: '42.166' }, { v: 'Hausschuhe', c: '2.824' }, { v: 'Sandalen', c: '5.195' }, { v: 'Sneaker & Sportschuhe', c: '346.260' }, { v: 'Stiefel & Stiefeletten', c: '35.442' }, { v: 'Outdoor & Wanderschuhe', c: '16.385' }, { v: 'Weitere Schuhe', c: '41.504' }].map(o => (<label key={o.v} className="flex items-center justify-between cursor-pointer group"><div className="flex items-center"><input type="checkbox" checked={selectedArt.includes(o.v)} onChange={() => toggleFilter(o.v, selectedArt, setSelectedArt)} className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500" /><span className="ml-2 text-sm text-gray-700 group-hover:text-gray-900">{o.v}</span></div><span className="text-xs text-gray-500">({o.c})</span></label>))}</div></div>

                {/* Marke - Top 20 */}
                <div className="mb-6 pb-6 border-b border-gray-200"><h4 className="font-bold text-gray-900 mb-3 text-base">Marke (Top 20)</h4><div className="space-y-2 max-h-64 overflow-y-auto">
                    {[{ v: 'Nike', c: '108.265' }, { v: 'Sonstige', c: '106.441' }, { v: 'Adidas', c: '66.910' }, { v: 'Puma', c: '18.023' }, { v: 'Jordan', c: '17.815' }, { v: 'New Balance', c: '7.343' }, { v: 'ASICS', c: '6.613' }, { v: 'Vans', c: '5.825' }, { v: 'Timberland', c: '5.256' }, { v: 'Converse', c: '4.649' }, { v: 'Lloyd', c: '4.586' }, { v: 'Bugatti', c: '4.058' }, { v: 'Atlas', c: '3.780' }, { v: 'Tommy Hilfiger', c: '3.509' }, { v: 'Engelbert Strauss', c: '3.393' }, { v: 'FILA', c: '3.245' }, { v: 'Reebok', c: '2.926' }, { v: 'Haix', c: '2.898' }, { v: 'Yeezy', c: '2.560' }, { v: 'Lacoste', c: '2.528' }].map(o => (<label key={o.v} className="flex items-center justify-between cursor-pointer group"><div className="flex items-center"><input type="checkbox" checked={selectedMarke.includes(o.v)} onChange={() => toggleFilter(o.v, selectedMarke, setSelectedMarke)} className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500" /><span className="ml-2 text-sm text-gray-700 group-hover:text-gray-900">{o.v}</span></div><span className="text-xs text-gray-500">({o.c})</span></label>))}</div></div>

                {/* Größe - 22 sizes */}
                <div className="mb-6 pb-6 border-b border-gray-200"><h4 className="font-bold text-gray-900 mb-3 text-base">Größe</h4><div className="space-y-2 max-h-64 overflow-y-auto">
                    {[{ v: '< 40', c: '22.580' }, { v: '40', c: '30.045' }, { v: '40.5', c: '8.540' }, { v: '41', c: '41.395' }, { v: '41.5', c: '6.065' }, { v: '42', c: '71.877' }, { v: '42.5', c: '24.126' }, { v: '43', c: '70.746' }, { v: '43.5', c: '6.392' }, { v: '44', c: '73.014' }, { v: '44.5', c: '20.802' }, { v: '45', c: '47.520' }, { v: '45.5', c: '7.850' }, { v: '46', c: '32.395' }, { v: '46.5', c: '3.203' }, { v: '47', c: '10.061' }, { v: '47.5', c: '4.524' }, { v: '48', c: '3.540' }, { v: '48.5', c: '1.706' }, { v: '49', c: '849' }, { v: '49.5', c: '752' }, { v: '> 50', c: '1.958' }].map(o => (<label key={o.v} className="flex items-center justify-between cursor-pointer group"><div className="flex items-center"><input type="checkbox" checked={selectedGroesse.includes(o.v)} onChange={() => toggleFilter(o.v, selectedGroesse, setSelectedGroesse)} className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500" /><span className="ml-2 text-sm text-gray-700 group-hover:text-gray-900">{o.v}</span></div><span className="text-xs text-gray-500">({o.c})</span></label>))}</div></div>

                {/* Versand */}
                <div className="mb-6 pb-6 border-b border-gray-200"><h4 className="font-bold text-gray-900 mb-3 text-base">Versand</h4><div className="space-y-2">
                    {[{ v: 'Versand möglich', c: '445.388' }, { v: 'Nur Abholung', c: '44.196' }].map(o => (<label key={o.v} className="flex items-center justify-between cursor-pointer group"><div className="flex items-center"><input type="checkbox" checked={selectedVersand.includes(o.v)} onChange={() => toggleFilter(o.v, selectedVersand, setSelectedVersand)} className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500" /><span className="ml-2 text-sm text-gray-700 group-hover:text-gray-900">{o.v}</span></div><span className="text-xs text-gray-500">({o.c})</span></label>))}</div></div>

                {/* Farbe - 22 colors */}
                <div className="mb-6 pb-6 border-b border-gray-200"><h4 className="font-bold text-gray-900 mb-3 text-base">Farbe</h4><div className="space-y-2 max-h-64 overflow-y-auto">
                    {[{ v: 'Beige', c: '14.874' }, { v: 'Blau', c: '47.228' }, { v: 'Braun', c: '48.134' }, { v: 'Bunt', c: '9.550' }, { v: 'Creme', c: '3.409' }, { v: 'Gelb', c: '6.553' }, { v: 'Gold', c: '1.389' }, { v: 'Grau', c: '36.412' }, { v: 'Grün', c: '12.838' }, { v: 'Khaki', c: '3.198' }, { v: 'Lavendel', c: '163' }, { v: 'Lila', c: '2.743' }, { v: 'Orange', c: '5.521' }, { v: 'Pink', c: '2.070' }, { v: 'Print', c: '179' }, { v: 'Rosé', c: '730' }, { v: 'Rot', c: '14.467' }, { v: 'Schwarz', c: '155.186' }, { v: 'Silber', c: '2.060' }, { v: 'Türkis', c: '1.901' }, { v: 'Weiß', c: '68.966' }, { v: 'Andere Farben', c: '52.195' }].map(o => (<label key={o.v} className="flex items-center justify-between cursor-pointer group"><div className="flex items-center"><input type="checkbox" checked={selectedFarbe.includes(o.v)} onChange={() => toggleFilter(o.v, selectedFarbe, setSelectedFarbe)} className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500" /><span className="ml-2 text-sm text-gray-700 group-hover:text-gray-900">{o.v}</span></div><span className="text-xs text-gray-500">({o.c})</span></label>))}</div></div>

                {/* Zustand - 5 */}
                <div className="mb-6 pb-6 border-b border-gray-200"><h4 className="font-bold text-gray-900 mb-3 text-base">Zustand</h4><div className="space-y-2">
                    {[{ v: 'Neu mit Etikett', c: '76.939' }, { v: 'Neu', c: '100.729' }, { v: 'Sehr Gut', c: '210.381' }, { v: 'Gut', c: '87.694' }, { v: 'In Ordnung', c: '14.029' }].map(o => (<label key={o.v} className="flex items-center justify-between cursor-pointer group"><div className="flex items-center"><input type="checkbox" checked={selectedZustand.includes(o.v)} onChange={() => toggleFilter(o.v, selectedZustand, setSelectedZustand)} className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500" /><span className="ml-2 text-sm text-gray-700 group-hover:text-gray-900">{o.v}</span></div><span className="text-xs text-gray-500">({o.c})</span></label>))}</div></div>

                {/* Preis */}
                <div className="mb-6 pb-6 border-b border-gray-200"><h4 className="font-bold text-gray-900 mb-3 text-base">Preis</h4><div className="grid grid-cols-2 gap-3">
                    <div><label className="block text-xs text-gray-600 mb-1">Von</label><input type="number" value={priceFrom} onChange={(e) => setPriceFrom(e.target.value)} placeholder="0" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-300" /></div>
                    <div><label className="block text-xs text-gray-600 mb-1">Bis</label><input type="number" value={priceTo} onChange={(e) => setPriceTo(e.target.value)} placeholder="∞" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-300" /></div>
                </div></div>

                {/* Angebotstyp */}
                <div className="mb-6 pb-6 border-b border-gray-200"><h4 className="font-bold text-gray-900 mb-3 text-base">Angebotstyp</h4><div className="space-y-2">
                    {[{ v: 'Angebote', c: '489.235' }, { v: 'Gesuche', c: '727' }].map(o => (<label key={o.v} className="flex items-center justify-between cursor-pointer group"><div className="flex items-center"><input type="checkbox" checked={selectedAngebotstyp.includes(o.v)} onChange={() => toggleFilter(o.v, selectedAngebotstyp, setSelectedAngebotstyp)} className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500" /><span className="ml-2 text-sm text-gray-700 group-hover:text-gray-900">{o.v}</span></div><span className="text-xs text-gray-500">({o.c})</span></label>))}</div></div>

                {/* Anbieter */}
                <div className="mb-6 pb-6 border-b border-gray-200"><h4 className="font-bold text-gray-900 mb-3 text-base">Anbieter</h4><div className="space-y-2">
                    {[{ v: 'Privat', c: '481.817' }, { v: 'Gewerblich', c: '8.145' }].map(o => (<label key={o.v} className="flex items-center justify-between cursor-pointer group"><div className="flex items-center"><input type="checkbox" checked={selectedAnbieter.includes(o.v)} onChange={() => toggleFilter(o.v, selectedAnbieter, setSelectedAnbieter)} className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500" /><span className="ml-2 text-sm text-gray-700 group-hover:text-gray-900">{o.v}</span></div><span className="text-xs text-gray-500">({o.c})</span></label>))}</div></div>

                {/* Direkt kaufen */}
                <div className="mb-6 pb-6 border-b border-gray-200"><h4 className="font-bold text-gray-900 mb-3 text-base">Direkt kaufen</h4>
                    <label className="flex items-center justify-between cursor-pointer group"><div className="flex items-center"><input type="checkbox" checked={direktKaufen} onChange={(e) => setDirektKaufen(e.target.checked)} className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500" /><span className="ml-2 text-sm text-gray-700 group-hover:text-gray-900">Aktiv</span></div><span className="text-xs text-gray-500">(173.623)</span></label>
                </div>

                {/* Paketdienst */}
                <div className="mb-6 pb-6 border-b border-gray-200"><h4 className="font-bold text-gray-900 mb-3 text-base">Paketdienst</h4><div className="space-y-2">
                    {[{ v: 'DHL', c: '378.114' }, { v: 'Hermes', c: '342.153' }].map(o => (<label key={o.v} className="flex items-center justify-between cursor-pointer group"><div className="flex items-center"><input type="checkbox" checked={selectedPaketdienst.includes(o.v)} onChange={() => toggleFilter(o.v, selectedPaketdienst, setSelectedPaketdienst)} className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500" /><span className="ml-2 text-sm text-gray-700 group-hover:text-gray-900">{o.v}</span></div><span className="text-xs text-gray-500">({o.c})</span></label>))}</div></div>

                {/* Ort */}
                <div className="mb-6"><h4 className="font-bold text-gray-900 mb-3 text-base">Ort</h4><div className="space-y-2 max-h-64 overflow-y-auto">
                    {[{ v: 'Baden-Württemberg', c: '63.870' }, { v: 'Bayern', c: '84.684' }, { v: 'Berlin', c: '29.494' }, { v: 'Brandenburg', c: '10.757' }, { v: 'Bremen', c: '3.989' }, { v: 'Hamburg', c: '15.091' }, { v: 'Hessen', c: '38.895' }, { v: 'Mecklenburg-Vorpommern', c: '5.932' }, { v: 'Niedersachsen', c: '44.966' }, { v: 'Nordrhein-Westfalen', c: '112.534' }, { v: 'Rheinland-Pfalz', c: '22.138' }, { v: 'Saarland', c: '5.857' }, { v: 'Sachsen', c: '18.936' }, { v: 'Sachsen-Anhalt', c: '8.514' }, { v: 'Schleswig-Holstein', c: '16.765' }, { v: 'Thüringen', c: '7.540' }].map(o => (<label key={o.v} className="flex items-center justify-between cursor-pointer group"><div className="flex items-center"><input type="checkbox" checked={selectedOrt.includes(o.v)} onChange={() => toggleFilter(o.v, selectedOrt, setSelectedOrt)} className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500" /><span className="ml-2 text-sm text-gray-700 group-hover:text-gray-900">{o.v}</span></div><span className="text-xs text-gray-500">({o.c})</span></label>))}</div></div>
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
                        <div><h1 className="text-4xl font-bold text-white mb-1">Herrenschuhe</h1><p className="text-white text-lg opacity-90">Schuhe für Herren</p></div>
                    </div>
                        <div className="hidden lg:flex items-center gap-6 text-white"><div className="text-center"><div className="text-3xl font-bold">{filteredListings.length}</div><div className="text-sm opacity-80">Anzeigen</div></div></div>
                    </div></div>
                </div>


                <div style={{ maxWidth: '960px' }}>
                    <CategoryGallery
                        category="Mode & Beauty"
                        subCategory="Herrenschuhe"
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

export default HerrenschuhePage;
