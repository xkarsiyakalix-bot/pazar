#!/usr/bin/env python3
"""
Update all Familie, Kind & Baby subcategory pages with three-level navigation
"""

import os

# Define all Familie, Kind & Baby subcategories
subcategories = [
    ('AltenpflegePage.js', 'Altenpflege'),
    ('BabyKinderkleidungPage.js', 'Baby- & Kinderkleidung'),
    ('BabyKinderschuhePage.js', 'Baby- & Kinderschuhe'),
    ('BabyAusstattungPage.js', 'Baby-Ausstattung'),
    ('BabyschalenKindersitzePage.js', 'Babyschalen & Kindersitze'),
    ('BabysitterKinderbetreuungPage.js', 'Babysitter/-in & Kinderbetreuung'),
    ('KinderwagenBuggysPage.js', 'Kinderwagen & Buggys'),
    ('KinderzimmermobelPage.js', 'Kinderzimmermöbel'),
    ('SpielzeugPage.js', 'Spielzeug'),
    ('WeiteresFamilieKindBabyPage.js', 'Weiteres Familie, Kind & Baby'),
]

base_path = '/Volumes/Kerem Aydin/Projeler/Kleinanzegen/24.11.2025/app/frontend/src'

# Navigation template
nav_template = '''                <div className="mb-6 pb-6 border-b border-gray-200">
                    <h3 className="font-bold text-gray-900 mb-3 text-base">Kategorien</h3>
                    <button onClick={{() => navigate('/Alle-Kategorien')}} className="w-full text-left px-3 py-2 rounded-lg text-sm transition-all bg-gray-100 text-gray-700 hover:bg-gray-200 flex items-center justify-between group">
                        <span>Alle Kategorien</span>
                        <svg className="w-4 h-4 text-gray-400 group-hover:text-red-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={{2}} d="M9 5l7 7-7 7" /></svg>
                    </button>
                    <div className="space-y-2 mt-3">
                        <button onClick={{() => navigate('/Familie-Kind-Baby')}} className="text-left px-3 py-2 rounded-lg text-sm transition-all bg-gray-100 text-gray-700 hover:bg-gray-200 flex items-center justify-between group ml-4" style={{{{ width: 'calc(100% - 1rem)' }}}}>
                            <span>Familie, Kind & Baby</span>
                            <svg className="w-4 h-4 text-gray-400 group-hover:text-red-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={{2}} d="M9 5l7 7-7 7" /></svg>
                        </button>
                        <button className="text-left px-3 py-2 rounded-lg text-sm transition-all bg-red-600 text-white shadow-md flex items-center justify-between ml-8" style={{{{ width: 'calc(100% - 2rem)' }}}}>
                            <span>{subcategory_name}</span>
                            <button onClick={{(e) => {{ e.stopPropagation(); navigate('/Familie-Kind-Baby'); }}}} className="text-white hover:text-red-200 transition-colors" title="Kategorie schließen">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={{2}} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </button>
                    </div>
                </div>
'''

for filename, subcategory_name in subcategories:
    filepath = os.path.join(base_path, filename)
    
    if not os.path.exists(filepath):
        print(f"❌ File not found: {filename}")
        continue
    
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Check if navigation already exists
    if 'Familie, Kind & Baby' in content and subcategory_name in content and 'Alle Kategorien' in content:
        print(f"ℹ️  {filename} already has navigation, skipping")
        continue
    
    # Update sidebar width
    content = content.replace(
        '<aside className="w-80 flex-shrink-0',
        '<aside className="w-96 flex-shrink-0'
    )
    
    # Add navigation before Filter section
    filter_marker = '                <div className="flex items-center justify-between mb-6"><h3 className="font-bold text-gray-900 text-lg">Filter</h3>'
    
    if filter_marker in content:
        nav_html = nav_template.format(subcategory_name=subcategory_name)
        content = content.replace(filter_marker, nav_html + filter_marker)
        
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        
        print(f"✅ Updated {filename}")
    else:
        print(f"⚠️  Could not find Filter section in {filename}")

print(f"\n🎉 All Familie, Kind & Baby subcategory pages updated!")
