#!/usr/bin/env python3
"""
Complete Unterricht & Kurse category
"""

import os

subcategories = [
    ('BeautyGesundheitKursePage.js', 'Beauty & Gesundheit'),
    ('ComputerkursePage.js', 'Computerkurse'),
    ('EsoterikSpirituellesKursePage.js', 'Esoterik & Spirituelles'),
    ('KochenBackenPage.js', 'Kochen & Backen'),
    ('KunstGestaltungPage.js', 'Kunst & Gestaltung'),
    ('MusikGesangPage.js', 'Musik & Gesang'),
    ('NachhilfePage.js', 'Nachhilfe'),
    ('SportkursePage.js', 'Sportkurse'),
    ('SprachkursePage.js', 'Sprachkurse'),
    ('TanzkursePage.js', 'Tanzkurse'),
    ('WeiterbildungPage.js', 'Weiterbildung'),
    ('WeitereUnterrichtKursePage.js', 'Weitere Unterricht & Kurse'),
]

base_path = '/Volumes/Kerem Aydin/Projeler/Kleinanzegen/24.11.2025/app/frontend/src'

print("📋 Unterricht & Kurse Category Update")
print("=" * 60)

# Step 1: Add import and route
print("\n1️⃣  Adding UnterrichtKursePage import and route...")
app_js_path = os.path.join(base_path, 'App.js')

with open(app_js_path, 'r', encoding='utf-8') as f:
    app_content = f.read()

if 'import UnterrichtKursePage' not in app_content:
    app_content = app_content.replace(
        "import VerschenkenPage from './VerschenkenPage';",
        "import VerschenkenPage from './VerschenkenPage';\nimport UnterrichtKursePage from './UnterrichtKursePage';"
    )
    
    app_content = app_content.replace(
        '          <Route path="/Unterricht-Kurse/Beauty-Gesundheit"',
        '          <Route path="/Unterricht-Kurse" element={<UnterrichtKursePage />} />\n          <Route path="/Unterricht-Kurse/Beauty-Gesundheit"'
    )
    
    with open(app_js_path, 'w', encoding='utf-8') as f:
        f.write(app_content)
    
    print("   ✅ Added import and route")
else:
    print("   ℹ️  Already imported")

# Step 2: Update subcategory pages
print("\n2️⃣  Updating subcategory pages...")

nav_template = '''                <div className="mb-6 pb-6 border-b border-gray-200">
                    <h3 className="font-bold text-gray-900 mb-3 text-base">Kategorien</h3>
                    <button onClick={{() => navigate('/Alle-Kategorien')}} className="w-full text-left px-3 py-2 rounded-lg text-sm transition-all bg-gray-100 text-gray-700 hover:bg-gray-200 flex items-center justify-between group">
                        <span>Alle Kategorien</span>
                        <svg className="w-4 h-4 text-gray-400 group-hover:text-red-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={{2}} d="M9 5l7 7-7 7" /></svg>
                    </button>
                    <div className="space-y-2 mt-3">
                        <button onClick={{() => navigate('/Unterricht-Kurse')}} className="text-left px-3 py-2 rounded-lg text-sm transition-all bg-gray-100 text-gray-700 hover:bg-gray-200 flex items-center justify-between group ml-4" style={{{{ width: 'calc(100% - 1rem)' }}}}>
                            <span>Unterricht & Kurse</span>
                            <svg className="w-4 h-4 text-gray-400 group-hover:text-red-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={{2}} d="M9 5l7 7-7 7" /></svg>
                        </button>
                        <button className="text-left px-3 py-2 rounded-lg text-sm transition-all bg-red-600 text-white shadow-md flex items-center justify-between ml-8" style={{{{ width: 'calc(100% - 2rem)' }}}}>
                            <span>{subcategory_name}</span>
                            <button onClick={{(e) => {{ e.stopPropagation(); navigate('/Unterricht-Kurse'); }}}} className="text-white hover:text-red-200 transition-colors" title="Kategorie schließen">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={{2}} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </button>
                    </div>
                </div>

'''

updated_count = 0
for filename, subcategory_name in subcategories:
    filepath = os.path.join(base_path, filename)
    
    if not os.path.exists(filepath):
        print(f"   ⚠️  {filename} not found")
        continue
    
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    if 'Unterricht & Kurse' in content and 'Kategorien</h3>' in content:
        print(f"   ℹ️  {filename} already has navigation")
        continue
    
    content = content.replace(
        '<aside className="w-80 flex-shrink-0',
        '<aside className="w-96 flex-shrink-0'
    )
    
    filter_marker = '                <div className="flex items-center justify-between mb-6"><h3 className="font-bold text-gray-900 text-lg">Filter</h3>'
    
    if filter_marker in content:
        nav_html = nav_template.format(subcategory_name=subcategory_name)
        content = content.replace(filter_marker, nav_html + filter_marker)
        
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        
        print(f"   ✅ {filename}")
        updated_count += 1
    else:
        print(f"   ⚠️  Filter section not found in {filename}")

print(f"\n✅ Updated {updated_count} subcategory pages")

# Step 3: Create main page
print("\n3️⃣  Creating main page...")
main_page_path = os.path.join(base_path, 'UnterrichtKursePage.js')

if not os.path.exists(main_page_path):
    main_page_content = '''import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const UnterrichtKursePage = () => {
    const navigate = useNavigate();
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);

    const subcategories = [
        { name: 'Alle', count: 104 },
        { name: 'Beauty & Gesundheit', count: 1, route: '/Unterricht-Kurse/Beauty-Gesundheit' },
        { name: 'Computerkurse', count: 0, route: '/Unterricht-Kurse/Computerkurse' },
        { name: 'Esoterik & Spirituelles', count: 1, route: '/Unterricht-Kurse/Esoterik-Spirituelles' },
        { name: 'Kochen & Backen', count: 12, route: '/Unterricht-Kurse/Kochen-Backen' },
        { name: 'Kunst & Gestaltung', count: 0, route: '/Unterricht-Kurse/Kunst-Gestaltung' },
        { name: 'Musik & Gesang', count: 5, route: '/Unterricht-Kurse/Musik-Gesang' },
        { name: 'Nachhilfe', count: 60, route: '/Unterricht-Kurse/Nachhilfe' },
        { name: 'Sportkurse', count: 1, route: '/Unterricht-Kurse/Sportkurse' },
        { name: 'Sprachkurse', count: 5, route: '/Unterricht-Kurse/Sprachkurse' },
        { name: 'Tanzkurse', count: 0, route: '/Unterricht-Kurse/Tanzkurse' },
        { name: 'Weiterbildung', count: 15, route: '/Unterricht-Kurse/Weiterbildung' },
        { name: 'Weitere Unterricht & Kurse', count: 4, route: '/Unterricht-Kurse/Weitere-Unterricht-Kurse' }
    ];

    useEffect(() => {
        const fetchListings = async () => {
            try {
                setLoading(true);
                const response = await fetch('http://localhost:8000/api/listings');
                if (response.ok) {
                    const data = await response.json();
                    setListings(data.filter(listing => listing.category === 'Unterricht & Kurse'));
                }
            } catch (error) {
                console.error('Error:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchListings();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-[1400px] mx-auto px-4 py-6">
                <div className="flex gap-6">
                    <aside className="w-96 flex-shrink-0 bg-white rounded-2xl shadow-lg p-6 h-fit sticky top-6">
                        <div className="mb-6 pb-6 border-b border-gray-200">
                            <h3 className="font-bold text-gray-900 mb-3 text-base">Kategorien</h3>
                            <button onClick={() => navigate('/Alle-Kategorien')} className="w-full text-left px-3 py-2 rounded-lg text-sm transition-all bg-gray-100 text-gray-700 hover:bg-gray-200 flex items-center justify-between group">
                                <span>Alle Kategorien</span>
                                <svg className="w-4 h-4 text-gray-400 group-hover:text-red-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                            </button>
                            <div className="space-y-2 mt-3">
                                <button className="text-left px-3 py-2 rounded-lg text-sm transition-all bg-red-600 text-white shadow-md flex items-center justify-between ml-4" style={{ width: 'calc(100% - 1rem)' }}>
                                    <span>Unterricht & Kurse</span>
                                    <button onClick={(e) => { e.stopPropagation(); navigate('/Alle-Kategorien'); }} className="text-white hover:text-red-200 transition-colors" title="Kategorie schließen">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                    </button>
                                </button>
                            </div>
                        </div>
                        <h3 className="font-bold text-gray-900 text-lg mb-6">Unterkategorien</h3>
                        <div className="space-y-1">
                            {subcategories.map((sub) => (
                                <button key={sub.name} onClick={() => navigate(sub.route || '/Unterricht-Kurse')} className="w-full text-left px-4 py-3 rounded-lg transition-all flex items-center justify-between hover:bg-gray-50 text-gray-700 group">
                                    <span className="text-sm group-hover:text-indigo-600 transition-colors">{sub.name}</span>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-gray-400">({sub.count.toLocaleString('de-DE')})</span>
                                        <svg className="w-4 h-4 text-gray-400 group-hover:text-indigo-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </aside>
                    <div className="flex-1">
                        <div className="bg-gradient-to-r from-indigo-600 to-purple-700 rounded-2xl shadow-xl p-8 mb-6 relative overflow-hidden">
                            <div className="absolute inset-0 opacity-10"><div className="absolute top-0 left-0 w-full h-full" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,.1) 35px, rgba(255,255,255,.1) 70px)' }}></div></div>
                            <div className="relative z-10">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl flex items-center justify-center"><span className="text-5xl">📖</span></div>
                                        <div><h1 className="text-4xl font-bold text-white mb-1">Unterricht & Kurse</h1><p className="text-white text-lg opacity-90">Alle Kategorien</p></div>
                                    </div>
                                    <div className="hidden lg:flex items-center gap-6 text-white"><div className="text-center"><div className="text-3xl font-bold">{listings.length}</div><div className="text-sm opacity-80">Anzeigen</div></div></div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">{listings.length} Anzeigen</h2>
                            {loading ? <div className="flex justify-center items-center py-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div></div> : listings.length === 0 ? <div className="text-center py-12"><p className="text-gray-500 text-lg">Keine Anzeigen gefunden</p></div> : (
                                <div className="space-y-4">
                                    {listings.map((listing) => (
                                        <div key={listing.id} className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer group overflow-hidden flex" onClick={() => navigate(`/listing/${listing.id}`)}>
                                            <div className="relative w-64 h-48 flex-shrink-0 bg-gray-100">
                                                <img src={listing.images?.[0] || 'https://via.placeholder.com/300x200?text=No+Image'} alt={listing.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                                                {listing.subCategory && <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-medium text-gray-700">{listing.subCategory}</div>}
                                            </div>
                                            <div className="flex-1 p-6 flex flex-col justify-between">
                                                <div><h3 className="font-semibold text-xl text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">{listing.title}</h3><p className="text-gray-600 text-sm line-clamp-2 mb-3">{listing.description || 'Keine Beschreibung verfügbar'}</p></div>
                                                <div className="flex items-center justify-between">
                                                    <p className="text-2xl font-bold text-indigo-600">{listing.price ? `${listing.price} €` : 'VB'}</p>
                                                    {listing.city && <div className="text-sm text-gray-500 flex items-center gap-1"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>{listing.city}</div>}
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
        </div>
    );
};

export default UnterrichtKursePage;
'''
    
    with open(main_page_path, 'w', encoding='utf-8') as f:
        f.write(main_page_content)
    
    print("   ✅ Created UnterrichtKursePage.js")
else:
    print("   ℹ️  Main page already exists")

print("\n🎉 Unterricht & Kurse category complete!")
