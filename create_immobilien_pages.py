#!/usr/bin/env python3
"""Script to create missing Immobilien subcategory pages"""

subcategories = [
    {'name': 'Auf Zeit & WG', 'filename': 'AufZeitWGPage.js', 'route': 'Auf-Zeit-WG', 'description': 'Wohnen auf Zeit & WG-Zimmer', 'filters': [
        {'name': 'WG-Zimmer', 'count': 1200},
        {'name': 'Wohnung auf Zeit', 'count': 800},
        {'name': 'Untermiete', 'count': 450},
        {'name': 'Zwischenmiete', 'count': 350}
    ]},
    {'name': 'Container', 'filename': 'ContainerPage.js', 'route': 'Container', 'description': 'Container & Baucontainer', 'filters': [
        {'name': 'Bürocontainer', 'count': 180},
        {'name': 'Wohncontainer', 'count': 220},
        {'name': 'Lagercontainer', 'count': 150},
        {'name': 'Sanitärcontainer', 'count': 90}
    ]},
    {'name': 'Eigentumswohnungen', 'filename': 'EigentumswohnungenPage.js', 'route': 'Eigentumswohnungen', 'description': 'Eigentumswohnungen kaufen', 'filters': [
        {'name': '1-Zimmer', 'count': 850},
        {'name': '2-Zimmer', 'count': 1200},
        {'name': '3-Zimmer', 'count': 1800},
        {'name': '4+ Zimmer', 'count': 950}
    ]},
    {'name': 'Garagen & Stellplätze', 'filename': 'GaragenStellplaetzePage.js', 'route': 'Garagen-Stellplätze', 'description': 'Garagen & Stellplätze', 'filters': [
        {'name': 'Garage', 'count': 1500},
        {'name': 'Tiefgarage', 'count': 800},
        {'name': 'Carport', 'count': 450},
        {'name': 'Stellplatz', 'count': 1200}
    ]},
    {'name': 'Grundstücke & Gärten', 'filename': 'GrundstueckeGaertenPage.js', 'route': 'Grundstücke-Gärten', 'description': 'Grundstücke & Gärten', 'filters': [
        {'name': 'Baugrundstück', 'count': 1200},
        {'name': 'Gartengrundstück', 'count': 650},
        {'name': 'Ackerland', 'count': 380},
        {'name': 'Wald', 'count': 220}
    ]},
    {'name': 'Häuser zum Kauf', 'filename': 'HaeuserZumKaufPage.js', 'route': 'Häuser-zum-Kauf', 'description': 'Häuser zum Kauf', 'filters': [
        {'name': 'Einfamilienhaus', 'count': 3200},
        {'name': 'Doppelhaushälfte', 'count': 1800},
        {'name': 'Reihenhaus', 'count': 1500},
        {'name': 'Villa', 'count': 850}
    ]},
    {'name': 'Häuser zur Miete', 'filename': 'HaeuserZurMietePage.js', 'route': 'Häuser-zur-Miete', 'description': 'Häuser zur Miete', 'filters': [
        {'name': 'Einfamilienhaus', 'count': 450},
        {'name': 'Doppelhaushälfte', 'count': 280},
        {'name': 'Reihenhaus', 'count': 320},
        {'name': 'Bungalow', 'count': 150}
    ]},
    {'name': 'Mietwohnungen', 'filename': 'MietwohnungenPage.js', 'route': 'Mietwohnungen', 'description': 'Mietwohnungen', 'filters': [
        {'name': '1-Zimmer', 'count': 2200},
        {'name': '2-Zimmer', 'count': 3500},
        {'name': '3-Zimmer', 'count': 2800},
        {'name': '4+ Zimmer', 'count': 1200}
    ]},
    {'name': 'Neubauprojekte', 'filename': 'NeubauprojektePage.js', 'route': 'Neubauprojekte', 'description': 'Neubauprojekte', 'filters': [
        {'name': 'Eigentumswohnung', 'count': 450},
        {'name': 'Einfamilienhaus', 'count': 320},
        {'name': 'Mehrfamilienhaus', 'count': 180},
        {'name': 'Gewerbe', 'count': 120}
    ]},
    {'name': 'Umzug & Transport', 'filename': 'UmzugTransportPage.js', 'route': 'Umzug-Transport', 'description': 'Umzug & Transport', 'filters': [
        {'name': 'Umzugshelfer', 'count': 850},
        {'name': 'Transporter', 'count': 1200},
        {'name': 'Umzugsfirma', 'count': 650},
        {'name': 'Entrümpelung', 'count': 420}
    ]}
]

template = '''import React, {{ useState, useEffect }} from 'react';
import {{ useNavigate }} from 'react-router-dom';

function {component_name}() {{
    const navigate = useNavigate();

    // Filter states
    const [category, setCategory] = useState('');
    const [priceFrom, setPriceFrom] = useState('');
    const [priceTo, setPriceTo] = useState('');

    // Listings state
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);

    // Favorites
    const [favorites, setFavorites] = useState(() => {{
        const saved = localStorage.getItem('favorites');
        return saved ? JSON.parse(saved) : [];
    }});

    useEffect(() => {{
        fetchListings();
    }}, []);

    const fetchListings = async () => {{
        try {{
            const response = await fetch('http://localhost:8000/api/listings');
            if (response.ok) {{
                const data = await response.json();
                setListings(data);
            }}
        }} catch (error) {{
            console.error('Error fetching listings:', error);
        }} finally {{
            setLoading(false);
        }}
    }};

    const toggleFavorite = (listingId) => {{
        setFavorites(prev => {{
            const newFavorites = prev.includes(listingId)
                ? prev.filter(id => id !== listingId)
                : [...prev, listingId];
            localStorage.setItem('favorites', JSON.stringify(newFavorites));
            return newFavorites;
        }});
    }};

    // Filter listings
    const filteredListings = listings.filter(listing => {{
        if (listing.category !== 'Immobilien') return false;
        if (listing.subCategory !== '{subcategory_name}') return false;

        if (category && listing.category !== category) return false;

        if (priceFrom && listing.price < parseFloat(priceFrom)) return false;
        if (priceTo && listing.price > parseFloat(priceTo)) return false;

        return true;
    }});

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-[1400px] mx-auto px-4 py-6">
                <div className="flex gap-6">
                    {{/* Sidebar Filters */}}
                    <aside className="w-80 flex-shrink-0 bg-white rounded-2xl shadow-lg p-6 h-fit sticky top-6">
                        {{/* Category Navigation */}}
                        <div className="mb-6 pb-6 border-b border-gray-200">
                            <h3 className="font-bold text-gray-900 mb-3 text-base">Alle Kategorien</h3>
                            <button
                                onClick={{() => navigate('/Alle-Kategorien')}}
                                className="w-full text-left px-3 py-2 rounded-lg text-sm transition-all bg-gray-100 text-gray-700 hover:bg-gray-200 flex items-center justify-between group"
                            >
                                <span>Alle Kategorien</span>
                                <svg className="w-4 h-4 text-gray-400 group-hover:text-red-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={{2}} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>

                            <div className="space-y-1">
                                <button
                                    onClick={{() => navigate('/Immobilien')}}
                                    className="text-left px-3 py-2 rounded-lg text-sm transition-all bg-gray-100 text-gray-700 hover:bg-gray-200 flex items-center justify-between group ml-4"
                                    style={{{{ width: 'calc(100% - 1rem)' }}}}
                                >
                                    <span>Immobilien</span>
                                    <svg className="w-4 h-4 text-gray-400 group-hover:text-red-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={{2}} d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                                <button
                                    className="text-left px-3 py-2 rounded-lg text-sm transition-all bg-red-600 text-white shadow-md flex items-center justify-between ml-8"
                                    style={{{{ width: 'calc(100% - 2rem)' }}}}
                                >
                                    <span>{subcategory_name}</span>
                                    <button
                                        onClick={{(e) => {{
                                            e.stopPropagation();
                                            navigate('/Immobilien');
                                        }}}}
                                        className="text-white hover:text-red-200 transition-colors"
                                        title="Kategorie schließen"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={{2}} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-bold text-gray-900 text-lg">Filter</h3>
                            <button
                                onClick={{() => {{
                                    setCategory('');
                                    setPriceFrom('');
                                    setPriceTo('');
                                }}}}
                                className="text-sm text-red-600 hover:text-red-700 font-medium"
                            >
                                Zurücksetzen
                            </button>
                        </div>

                        {{/* Kategorie Filter */}}
                        <div className="mb-6 pb-6 border-b border-gray-200">
                            <h4 className="font-bold text-gray-900 mb-3 text-base">Kategorie</h4>
                            <div className="space-y-2">
                                {filter_options}
                            </div>
                            <button
                                onClick={{() => setCategory('')}}
                                className="mt-3 text-sm text-red-600 hover:text-red-700 font-medium"
                            >
                                Filter zurücksetzen
                            </button>
                        </div>

                        {{/* Price Filter */}}
                        <div className="mb-6">
                            <h4 className="font-bold text-gray-900 mb-3 text-base">Preis</h4>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs text-gray-600 mb-1">Von</label>
                                    <input
                                        type="number"
                                        value={{priceFrom}}
                                        onChange={{(e) => setPriceFrom(e.target.value)}}
                                        placeholder="0"
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-300"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-gray-600 mb-1">Bis</label>
                                    <input
                                        type="number"
                                        value={{priceTo}}
                                        onChange={{(e) => setPriceTo(e.target.value)}}
                                        placeholder="∞"
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-300"
                                    />
                                </div>
                            </div>
                        </div>
                    </aside>

                    {{/* Main Content */}}
                    <div className="flex-1">
                        {{/* Hero Banner */}}
                        <div className="bg-red-600 rounded-2xl shadow-xl p-8 mb-6 relative overflow-hidden">
                            <div className="absolute inset-0 opacity-10">
                                <div className="absolute top-0 left-0 w-full h-full" style={{{{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,.1) 35px, rgba(255,255,255,.1) 70px)' }}}}>
                                </div>
                            </div>
                            <div className="relative z-10">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                                            <span className="text-5xl">🏠</span>
                                        </div>
                                        <div>
                                            <h1 className="text-4xl font-bold text-white mb-1">
                                                {subcategory_name}
                                            </h1>
                                            <p className="text-white text-lg opacity-90">
                                                {description}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="hidden lg:flex items-center gap-6 text-white">
                                        <div className="text-center">
                                            <div className="text-3xl font-bold">{{filteredListings.length}}</div>
                                            <div className="text-sm opacity-80">Anzeigen</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">
                                {{filteredListings.length}} Anzeigen
                            </h2>

                            {{loading ? (
                                <div className="flex justify-center items-center py-12">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
                                </div>
                            ) : filteredListings.length === 0 ? (
                                <div className="text-center py-12">
                                    <p className="text-gray-500 text-lg">Keine Anzeigen gefunden</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {{filteredListings.map((listing) => (
                                        <div
                                            key={{listing.id}}
                                            className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer group overflow-hidden flex"
                                            onClick={{() => navigate(`/product/${{listing.id}}`)}}
                                        >
                                            <div className="relative w-64 h-48 flex-shrink-0 bg-gray-100">
                                                <img
                                                    src={{listing.images?.[0] || 'https://via.placeholder.com/300x200'}}
                                                    alt={{listing.title}}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                                />
                                                <button
                                                    onClick={{(e) => {{
                                                        e.stopPropagation();
                                                        toggleFavorite(listing.id);
                                                    }}}}
                                                    className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-lg hover:scale-110 transition-transform"
                                                >
                                                    <svg
                                                        className={{`w-5 h-5 ${{favorites.includes(listing.id) ? 'fill-red-500 text-red-500' : 'text-gray-400'}}`}}
                                                        fill={{favorites.includes(listing.id) ? 'currentColor' : 'none'}}
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={{2}} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                                    </svg>
                                                </button>
                                            </div>
                                            <div className="flex-1 p-6 flex flex-col justify-between">
                                                <div>
                                                    <h3 className="font-semibold text-xl text-gray-900 mb-2 group-hover:text-red-600 transition-colors">
                                                        {{listing.title}}
                                                    </h3>
                                                    <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                                                        {{listing.description || 'Keine Beschreibung verfügbar'}}
                                                    </p>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <p className="text-2xl font-bold text-red-600">
                                                        {{listing.price ? `${{listing.price.toLocaleString('de-DE')}} €` : 'VB'}}
                                                    </p>
                                                    {{listing.city && (
                                                        <div className="text-sm text-gray-500 flex items-center gap-1">
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={{2}} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={{2}} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                            </svg>
                                                            {{listing.city}}
                                                        </div>
                                                    )}}
                                                </div>
                                            </div>
                                        </div>
                                    ))}}
                                </div>
                            )}}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}}

export default {component_name};
'''

import os
output_dir = '/Volumes/Kerem Aydin/Projeler/Kleinanzegen/24.11.2025/app/frontend/src'

# Check which files already exist
existing_files = ['FerienAuslandsimmobilienPage.js', 'GewerbeimmobilienPage.js', 'WeitereImmobilienPage.js']

created_count = 0
for subcat in subcategories:
    if subcat['filename'] in existing_files:
        print(f"Skipped (already exists): {subcat['filename']}")
        continue
    
    # Generate filter options
    filter_options = '\n                                '.join([
        f'''{{[\n                                    {{ name: '{f["name"]}', count: {f["count"]} }},\n                                ].map((cat) => (
                                    <label key={{cat.name}} className="flex items-center justify-between cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors">
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="radio"
                                                name="category"
                                                value={{cat.name}}
                                                checked={{category === cat.name}}
                                                onChange={{(e) => setCategory(e.target.value)}}
                                                className="text-red-500 focus:ring-red-300"
                                            />
                                            <span className="text-sm text-gray-700">{{cat.name}}</span>
                                        </div>
                                        <span className="text-xs text-gray-400">({{cat.count.toLocaleString('de-DE')}})</span>
                                    </label>
                                ))}}''' if i == 0 else f'''{{ name: '{f["name"]}', count: {f["count"]} }},'''
        for i, f in enumerate(subcat['filters'])
    ])
    
    # Simpler approach - just list all filters
    filter_items = '\n                                '.join([
        f"{{ name: '{f['name']}', count: {f['count']} }},"
        for f in subcat['filters']
    ])
    
    filter_options = f'''{{[
                                    {filter_items}
                                ].map((cat) => (
                                    <label key={{cat.name}} className="flex items-center justify-between cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors">
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="radio"
                                                name="category"
                                                value={{cat.name}}
                                                checked={{category === cat.name}}
                                                onChange={{(e) => setCategory(e.target.value)}}
                                                className="text-red-500 focus:ring-red-300"
                                            />
                                            <span className="text-sm text-gray-700">{{cat.name}}</span>
                                        </div>
                                        <span className="text-xs text-gray-400">({{cat.count.toLocaleString('de-DE')}})</span>
                                    </label>
                                ))}}'''
    
    component_name = subcat['filename'].replace('.js', '').replace(' ', '')
    content = template.format(
        component_name=component_name,
        subcategory_name=subcat['name'],
        description=subcat['description'],
        filter_options=filter_options
    )
    filepath = os.path.join(output_dir, subcat['filename'].replace(' ', ''))
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Created: {subcat['filename']}")
    created_count += 1

print(f"\n✅ Created {created_count} new Immobilien subcategory pages!")
print(f"📝 Skipped {len(existing_files)} existing pages")
