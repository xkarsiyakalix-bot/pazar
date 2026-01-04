#!/usr/bin/env python3
"""Script to create Jobs subcategory pages"""

subcategories = [
    {'name': 'Ausbildung', 'filename': 'AusbildungPage.js', 'route': 'ausbildung', 'icon': '''<rect x="22" y="24" width="20" height="16" strokeWidth="2.5" fill="currentColor" opacity="0.3" rx="2"/><rect x="22" y="24" width="20" height="16" strokeWidth="2.5" rx="2"/><path d="M28 30 L28 34 M32 28 L32 36 M36 30 L36 34" strokeWidth="2" strokeLinecap="round"/>''', 'description': 'Ausbildungsplätze'},
    {'name': 'Bau, Handwerk & Produktion', 'filename': 'BauHandwerkProduktionPage.js', 'route': 'bau-handwerk-produktion', 'icon': '''<rect x="20" y="28" width="24" height="14" strokeWidth="2.5" fill="currentColor" opacity="0.3" rx="2"/><rect x="20" y="28" width="24" height="14" strokeWidth="2.5" rx="2"/><path d="M26 22 L32 16 L38 22" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>''', 'description': 'Bau, Handwerk & Produktion'},
    {'name': 'Büroarbeit & Verwaltung', 'filename': 'BueroarbeitVerwaltungPage.js', 'route': 'bueroarbeit-verwaltung', 'icon': '''<rect x="24" y="22" width="16" height="20" strokeWidth="2.5" fill="currentColor" opacity="0.3" rx="2"/><rect x="24" y="22" width="16" height="20" strokeWidth="2.5" rx="2"/><path d="M28 28 L36 28 M28 32 L36 32 M28 36 L34 36" strokeWidth="2" strokeLinecap="round"/>''', 'description': 'Büroarbeit & Verwaltung'},
    {'name': 'Gastronomie & Tourismus', 'filename': 'GastronomieTourismusPage.js', 'route': 'gastronomie-tourismus', 'icon': '''<circle cx="32" cy="26" r="6" strokeWidth="2.5" fill="currentColor" opacity="0.3"/><circle cx="32" cy="26" r="6" strokeWidth="2.5"/><path d="M26 32 L26 42 M38 32 L38 42 M22 42 L42 42" strokeWidth="2.5" strokeLinecap="round"/>''', 'description': 'Gastronomie & Tourismus'},
    {'name': 'Kundenservice & Call Center', 'filename': 'KundenserviceCallCenterPage.js', 'route': 'kundenservice-call-center', 'icon': '''<circle cx="32" cy="28" r="8" strokeWidth="2.5" fill="currentColor" opacity="0.3"/><circle cx="32" cy="28" r="8" strokeWidth="2.5"/><path d="M24 34 Q20 38 20 42 M44 42 Q44 38 40 34" strokeWidth="2" strokeLinecap="round"/>''', 'description': 'Kundenservice & Call Center'},
    {'name': 'Mini- & Nebenjobs', 'filename': 'MiniNebenjobsPage.js', 'route': 'mini-nebenjobs', 'icon': '''<rect x="26" y="24" width="12" height="16" strokeWidth="2.5" fill="currentColor" opacity="0.3" rx="2"/><rect x="26" y="24" width="12" height="16" strokeWidth="2.5" rx="2"/><circle cx="32" cy="30" r="2" fill="currentColor"/>''', 'description': 'Mini- & Nebenjobs'},
    {'name': 'Praktika', 'filename': 'PraktikaPage.js', 'route': 'praktika', 'icon': '''<rect x="22" y="26" width="20" height="14" strokeWidth="2.5" fill="currentColor" opacity="0.3" rx="2"/><rect x="22" y="26" width="20" height="14" strokeWidth="2.5" rx="2"/><path d="M28 32 L32 36 L36 30" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>''', 'description': 'Praktikumsplätze'},
    {'name': 'Sozialer Sektor & Pflege', 'filename': 'SozialerSektorPflegePage.js', 'route': 'sozialer-sektor-pflege', 'icon': '''<path d="M32 22 L36 26 L32 30 L28 26 Z" strokeWidth="2.5" fill="currentColor" opacity="0.3"/><path d="M32 22 L36 26 L32 30 L28 26 Z" strokeWidth="2.5"/><circle cx="32" cy="38" r="4" strokeWidth="2" fill="none"/>''', 'description': 'Sozialer Sektor & Pflege'},
    {'name': 'Transport, Logistik & Verkehr', 'filename': 'TransportLogistikVerkehrPage.js', 'route': 'transport-logistik-verkehr', 'icon': '''<rect x="18" y="28" width="28" height="12" strokeWidth="2.5" fill="currentColor" opacity="0.3" rx="2"/><rect x="18" y="28" width="28" height="12" strokeWidth="2.5" rx="2"/><circle cx="24" cy="42" r="2" fill="currentColor"/><circle cx="40" cy="42" r="2" fill="currentColor"/>''', 'description': 'Transport, Logistik & Verkehr'},
    {'name': 'Vertrieb, Einkauf & Verkauf', 'filename': 'VertriebEinkaufVerkaufPage.js', 'route': 'vertrieb-einkauf-verkauf', 'icon': '''<path d="M24 28 L28 24 L36 24 L40 28 L40 38 L24 38 Z" strokeWidth="2.5" fill="currentColor" opacity="0.3"/><path d="M24 28 L28 24 L36 24 L40 28 L40 38 L24 38 Z" strokeWidth="2.5"/><circle cx="32" cy="32" r="2" fill="currentColor"/>''', 'description': 'Vertrieb, Einkauf & Verkauf'},
    {'name': 'Weitere Jobs', 'filename': 'WeitereJobsPage.js', 'route': 'weitere-jobs', 'icon': '''<circle cx="32" cy="32" r="10" strokeWidth="2.5" fill="currentColor" opacity="0.3"/><circle cx="32" cy="32" r="10" strokeWidth="2.5"/><path d="M28 32 L32 32 L32 28" strokeWidth="2.5" strokeLinecap="round"/>''', 'description': 'Weitere Jobs'}
]

template = '''import React, {{ useState, useEffect }} from 'react';
import {{ mockListings }} from './components';
import {{ useNavigate }} from 'react-router-dom';

function {component_name}() {{
    const navigate = useNavigate();
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

    const filteredListings = listings.filter(listing => listing.category === 'Jobs' && listing.subCategory === '{subcategory_name}');

    return (
        <div className="min-h-screen bg-gray-50"><div className="max-w-[1400px] mx-auto px-4 py-6"><div className="flex gap-6">
            <aside className="w-80 flex-shrink-0 bg-white rounded-2xl shadow-lg p-6 h-fit sticky top-6">
                <div className="flex items-center justify-between mb-6"><h3 className="font-bold text-gray-900 text-lg">Filter</h3></div>
                <div className="mb-6"><h4 className="font-bold text-gray-900 mb-3 text-base">Gehalt (€/Monat)</h4><div className="grid grid-cols-2 gap-3">
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
                            <div key={{listing.id}} className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer group overflow-hidden flex" onClick={{() => navigate(`/product/${{listing.id}}`)}}><div className="relative w-64 h-48 flex-shrink-0 bg-gray-100"><img src={{listing.image || 'https://via.placeholder.com/300x200'}} alt={{listing.title}} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
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
    content = template.format(component_name=component_name, subcategory_name=subcat['name'], icon=subcat['icon'], description=subcat['description'])
    filepath = os.path.join(output_dir, subcat['filename'])
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Created: {subcat['filename']}")

print(f"\n✅ Created {len(subcategories)} Jobs subcategory pages!")
