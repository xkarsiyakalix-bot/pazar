#!/usr/bin/env python3
"""
Script to create Familie, Kind & Baby subcategory pages
"""

subcategories = [
    {
        'name': 'Altenpflege',
        'filename': 'AltenpflegePage.js',
        'route': 'altenpflege',
        'icon': '''<circle cx="32" cy="26" r="6" strokeWidth="2.5" fill="currentColor" opacity="0.3"/>
                                <circle cx="32" cy="26" r="6" strokeWidth="2.5" strokeLinecap="round"/>
                                <path d="M22 38 L22 44 M42 38 L42 44" strokeWidth="2.5" strokeLinecap="round"/>
                                <path d="M26 32 Q32 36 38 32" strokeWidth="2" strokeLinecap="round"/>''',
        'description': 'Altenpflege & Betreuung'
    },
    {
        'name': 'Baby- & Kinderkleidung',
        'filename': 'BabyKinderkleidungPage.js',
        'route': 'baby-kinderkleidung',
        'icon': '''<rect x="24" y="22" width="16" height="20" strokeWidth="2.5" fill="currentColor" opacity="0.3" rx="2"/>
                                <rect x="24" y="22" width="16" height="20" strokeWidth="2.5" strokeLinecap="round" rx="2"/>
                                <path d="M20 26 L24 26 M40 26 L44 26" strokeWidth="2.5" strokeLinecap="round"/>''',
        'description': 'Baby- & Kinderkleidung'
    },
    {
        'name': 'Baby- & Kinderschuhe',
        'filename': 'BabyKinderschuhePage.js',
        'route': 'baby-kinderschuhe',
        'icon': '''<path d="M20 32 L28 32 L30 36 L26 38 L20 36 Z" strokeWidth="2.5" fill="currentColor" opacity="0.3"/>
                                <path d="M20 32 L28 32 L30 36 L26 38 L20 36 Z" strokeWidth="2.5" strokeLinecap="round"/>
                                <circle cx="24" cy="34" r="1.5" fill="currentColor"/>''',
        'description': 'Baby- & Kinderschuhe'
    },
    {
        'name': 'Baby-Ausstattung',
        'filename': 'BabyAusstattungPage.js',
        'route': 'baby-ausstattung',
        'icon': '''<path d="M24 24 Q32 20 40 24 L40 38 Q32 42 24 38 Z" strokeWidth="2.5" fill="currentColor" opacity="0.3"/>
                                <path d="M24 24 Q32 20 40 24 L40 38 Q32 42 24 38 Z" strokeWidth="2.5" strokeLinecap="round"/>
                                <circle cx="32" cy="30" r="2" fill="currentColor"/>''',
        'description': 'Baby-Ausstattung'
    },
    {
        'name': 'Babyschalen & Kindersitze',
        'filename': 'BabyschalenKindersitzePage.js',
        'route': 'babyschalen-kindersitze',
        'icon': '''<path d="M22 28 L22 40 L42 40 L42 28 Q32 24 22 28" strokeWidth="2.5" fill="currentColor" opacity="0.3"/>
                                <path d="M22 28 L22 40 L42 40 L42 28 Q32 24 22 28" strokeWidth="2.5" strokeLinecap="round"/>
                                <rect x="28" y="32" width="8" height="6" strokeWidth="2" fill="none"/>''',
        'description': 'Babyschalen & Kindersitze'
    },
    {
        'name': 'Babysitter/-in & Kinderbetreuung',
        'filename': 'BabysitterKinderbetreuungPage.js',
        'route': 'babysitter-kinderbetreuung',
        'icon': '''<circle cx="28" cy="26" r="4" strokeWidth="2.5" fill="currentColor" opacity="0.3"/>
                                <circle cx="28" cy="26" r="4" strokeWidth="2.5" strokeLinecap="round"/>
                                <circle cx="38" cy="30" r="3" strokeWidth="2" fill="none"/>
                                <path d="M24 32 L24 42 M32 32 L32 42" strokeWidth="2.5" strokeLinecap="round"/>''',
        'description': 'Babysitter & Kinderbetreuung'
    },
    {
        'name': 'Kinderwagen & Buggys',
        'filename': 'KinderwagenBuggysPage.js',
        'route': 'kinderwagen-buggys',
        'icon': '''<rect x="22" y="22" width="20" height="14" strokeWidth="2.5" fill="currentColor" opacity="0.3" rx="2"/>
                                <rect x="22" y="22" width="20" height="14" strokeWidth="2.5" strokeLinecap="round" rx="2"/>
                                <circle cx="26" cy="40" r="3" strokeWidth="2" fill="none"/>
                                <circle cx="38" cy="40" r="3" strokeWidth="2" fill="none"/>''',
        'description': 'Kinderwagen & Buggys'
    },
    {
        'name': 'Kinderzimmermöbel',
        'filename': 'KinderzimmermobelPage.js',
        'route': 'kinderzimmermoebel',
        'icon': '''<rect x="20" y="26" width="24" height="16" strokeWidth="2.5" fill="currentColor" opacity="0.3" rx="2"/>
                                <rect x="20" y="26" width="24" height="16" strokeWidth="2.5" strokeLinecap="round" rx="2"/>
                                <path d="M28 32 L28 36 M36 32 L36 36" strokeWidth="2" strokeLinecap="round"/>''',
        'description': 'Kinderzimmermöbel'
    },
    {
        'name': 'Spielzeug',
        'filename': 'SpielzeugPage.js',
        'route': 'spielzeug',
        'icon': '''<circle cx="32" cy="28" r="8" strokeWidth="2.5" fill="currentColor" opacity="0.3"/>
                                <circle cx="32" cy="28" r="8" strokeWidth="2.5" strokeLinecap="round"/>
                                <path d="M28 26 L30 28 L34 28 L36 26" strokeWidth="2" strokeLinecap="round"/>
                                <circle cx="29" cy="27" r="1" fill="currentColor"/>
                                <circle cx="35" cy="27" r="1" fill="currentColor"/>''',
        'description': 'Spielzeug'
    },
    {
        'name': 'Weiteres Familie, Kind & Baby',
        'filename': 'WeiteresFamilieKindBabyPage.js',
        'route': 'weiteres-familie-kind-baby',
        'icon': '''<circle cx="32" cy="32" r="10" strokeWidth="2.5" fill="currentColor" opacity="0.3"/>
                                <circle cx="32" cy="32" r="10" strokeWidth="2.5" strokeLinecap="round"/>
                                <path d="M28 30 L32 34 L36 30" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>''',
        'description': 'Weiteres Familie, Kind & Baby'
    }
]

template = '''import React, {{ useState, useEffect }} from 'react';
import {{ mockListings }} from './components';
import {{ useNavigate }} from 'react-router-dom';

function {component_name}() {{
    const navigate = useNavigate();
    const [category, setCategory] = useState('');
    const [priceFrom, setPriceFrom] = useState('');
    const [priceTo, setPriceTo] = useState('');
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [favorites, setFavorites] = useState(() => JSON.parse(localStorage.getItem('favorites') || '[]'));

    useEffect(() => {{ fetchListings(); }}, []);

    const fetchListings = async () => {{
        setListings(mockListings);
        setLoading(false);
    }};

    const toggleFavorite = (listingId) => {{
        setFavorites(prev => {{
            const newFavorites = prev.includes(listingId) ? prev.filter(id => id !== listingId) : [...prev, listingId];
            localStorage.setItem('favorites', JSON.stringify(newFavorites));
            return newFavorites;
        }});
    }};

    const filteredListings = listings.filter(listing => listing.category === 'Familie, Kind & Baby' && listing.subCategory === '{subcategory_name}' && (!category || listing.category === category) && (!priceFrom || listing.price >= parseFloat(priceFrom)) && (!priceTo || listing.price <= parseFloat(priceTo)));

    return (
        <div className="min-h-screen bg-gray-50"><div className="max-w-[1400px] mx-auto px-4 py-6"><div className="flex gap-6">
            <aside className="w-80 flex-shrink-0 bg-white rounded-2xl shadow-lg p-6 h-fit sticky top-6">
                <div className="flex items-center justify-between mb-6"><h3 className="font-bold text-gray-900 text-lg">Filter</h3><button onClick={{() => {{ setCategory(''); setPriceFrom(''); setPriceTo(''); }}}} className="text-sm text-red-600 hover:text-red-700 font-medium">Zurücksetzen</button></div>
                <div className="mb-6"><h4 className="font-bold text-gray-900 mb-3 text-base">Preis</h4><div className="grid grid-cols-2 gap-3">
                    <div><label className="block text-xs text-gray-600 mb-1">Von</label><input type="number" value={{priceFrom}} onChange={{(e) => setPriceFrom(e.target.value)}} placeholder="0" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-300" /></div>
                    <div><label className="block text-xs text-gray-600 mb-1">Bis</label><input type="number" value={{priceTo}} onChange={{(e) => setPriceTo(e.target.value)}} placeholder="∞" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-300" /></div>
                </div></div>
            </aside>
            <div className="flex-1">
                <div className="bg-red-600 rounded-2xl shadow-xl p-8 mb-6 relative overflow-hidden"><div className="absolute inset-0 opacity-10"><div className="absolute top-0 left-0 w-full h-full" style={{{{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,.1) 35px, rgba(255,255,255,.1) 70px)' }}}}></div></div>
                    <div className="relative z-10"><div className="flex items-center justify-between"><div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                            <svg className="w-10 h-10 text-white" viewBox="0 0 64 64" fill="none" stroke="currentColor">
                                {icon}
                            </svg>
                        </div>
                        <div><h1 className="text-4xl font-bold text-white mb-1">{subcategory_name}</h1><p className="text-white text-lg opacity-90">{description}</p></div>
                    </div>
                        <div className="hidden lg:flex items-center gap-6 text-white"><div className="text-center"><div className="text-3xl font-bold">{{filteredListings.length}}</div><div className="text-sm opacity-80">Anzeigen</div></div></div>
                    </div></div>
                </div>
                <div className="bg-white rounded-lg shadow-sm p-6"><h2 className="text-2xl font-bold text-gray-900 mb-4">{{filteredListings.length}} Anzeigen</h2>
                    {{loading ? (<div className="flex justify-center items-center py-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div></div>) : filteredListings.length === 0 ? (<div className="text-center py-12"><p className="text-gray-500 text-lg">Keine Anzeigen gefunden</p></div>) : (
                        <div className="space-y-4">{{filteredListings.map((listing) => (
                            <div key={{listing.id}} className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer group overflow-hidden flex" onClick={{() => navigate(`/product/${{listing.id}}`)}}><div className="relative w-64 h-48 flex-shrink-0 bg-gray-100"><img src={{listing.image || listing.images?.[0] || 'https://via.placeholder.com/300x200'}} alt={{listing.title}} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                                    <button onClick={{(e) => {{ e.stopPropagation(); toggleFavorite(listing.id); }}}} className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-lg hover:scale-110 transition-transform">
                                        <svg className={{`w-5 h-5 ${{favorites.includes(listing.id) ? 'fill-red-500 text-red-500' : 'text-gray-400'}}`}} fill={{favorites.includes(listing.id) ? 'currentColor' : 'none'}} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={{2}} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                                    </button>
                                </div>
                                <div className="flex-1 p-6 flex flex-col justify-between">
                                    <div>
                                        <h3 className="font-semibold text-xl text-gray-900 mb-2 group-hover:text-red-600 transition-colors">{{listing.title}}</h3>
                                        <p className="text-gray-600 text-sm line-clamp-2 mb-3">{{listing.description}}</p>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <p className="text-2xl font-bold text-red-600">{{typeof listing.price === 'string' ? listing.price : listing.price ? `${{listing.price.toLocaleString('de-DE')}} €` : 'VB'}}</p>
                                        {{listing.city && (<div className="text-sm text-gray-500 flex items-center gap-1"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={{2}} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={{2}} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>{{listing.city}}</div>)}}
                                    </div>
                                </div>
                            </div>
                        ))}}</div>
                    )}}
                </div>
            </div>
        </div></div></div>
    );
}}
export default {component_name};
'''

import os

output_dir = '/Volumes/Kerem Aydin/Projeler/Kleinanzegen/24.11.2025/app/frontend/src'

for subcat in subcategories:
    component_name = subcat['filename'].replace('.js', '')
    content = template.format(
        component_name=component_name,
        subcategory_name=subcat['name'],
        icon=subcat['icon'],
        description=subcat['description']
    )
    
    filepath = os.path.join(output_dir, subcat['filename'])
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"Created: {subcat['filename']}")

print(f"\n✅ Created {len(subcategories)} Familie, Kind & Baby subcategory pages!")
