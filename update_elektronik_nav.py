#!/usr/bin/env python3
"""
Update all Elektronik subcategory pages to include standardized three-level navigation
"""

import os
import re

# Define all Elektronik subcategories
subcategories = [
    ('AudioHifiPage.js', 'Audio & Hifi', '/Elektronik/Audio-Hifi'),
    ('DienstleistungenElektronikPage.js', 'Dienstleistungen Elektronik', '/Elektronik/Dienstleistungen-Elektronik'),
    ('FotoPage.js', 'Foto', '/Elektronik/Foto'),
    ('HandyTelefonPage.js', 'Handy & Telefon', '/Elektronik/Handy-Telefon'),
    ('HaushaltsgeraetePage.js', 'Haushaltsgeräte', '/Elektronik/Haushaltsgeräte'),
    ('KonsolenPage.js', 'Konsolen', '/Elektronik/Konsolen'),
    ('NotebooksPage.js', 'Notebooks', '/Elektronik/Notebooks'),
    ('PCsPage.js', 'PCs', '/Elektronik/PCs'),
    ('PCZubehoerSoftwarePage.js', 'PC-Zubehör & Software', '/Elektronik/PC-Zubehör-Software'),
    ('TabletsReaderPage.js', 'Tablets & Reader', '/Elektronik/Tablets-Reader'),
    ('TVVideoPage.js', 'TV & Video', '/Elektronik/TV-Video'),
    ('VideospielePage.js', 'Videospiele', '/Elektronik/Videospiele'),
    ('WeitereElektronikPage.js', 'Weitere Elektronik', '/Elektronik/Weitere-Elektronik'),
]

base_path = '/Volumes/Kerem Aydin/Projeler/Kleinanzegen/24.11.2025/app/frontend/src'

for filename, subcategory_name, route in subcategories:
    filepath = os.path.join(base_path, filename)
    
    if not os.path.exists(filepath):
        print(f"❌ File not found: {filename}")
        continue
    
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Update sidebar width from w-80 to w-96
    content = re.sub(
        r'<aside className="w-80 flex-shrink-0',
        '<aside className="w-96 flex-shrink-0',
        content
    )
    
    # Find the aside opening tag and insert navigation section after it
    # The navigation should be inserted before the Filter section
    
    navigation_html = f'''                <div className="mb-6 pb-6 border-b border-gray-200">
                    <h3 className="font-bold text-gray-900 mb-3 text-base">Kategorien</h3>
                    <button onClick={{() => navigate('/Alle-Kategorien')}} className="w-full text-left px-3 py-2 rounded-lg text-sm transition-all bg-gray-100 text-gray-700 hover:bg-gray-200 flex items-center justify-between group">
                        <span>Alle Kategorien</span>
                        <svg className="w-4 h-4 text-gray-400 group-hover:text-red-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={{2}} d="M9 5l7 7-7 7" /></svg>
                    </button>
                    <div className="space-y-2 mt-3">
                        <button onClick={{() => navigate('/Elektronik')}} className="text-left px-3 py-2 rounded-lg text-sm transition-all bg-gray-100 text-gray-700 hover:bg-gray-200 flex items-center justify-between group ml-4" style={{{{ width: 'calc(100% - 1rem)' }}}}>
                            <span>Elektronik</span>
                            <svg className="w-4 h-4 text-gray-400 group-hover:text-red-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={{2}} d="M9 5l7 7-7 7" /></svg>
                        </button>
                        <button className="text-left px-3 py-2 rounded-lg text-sm transition-all bg-red-600 text-white shadow-md flex items-center justify-between ml-8" style={{{{ width: 'calc(100% - 2rem)' }}}}>
                            <span>{subcategory_name}</span>
                            <button onClick={{(e) => {{ e.stopPropagation(); navigate('/Elektronik'); }}}} className="text-white hover:text-red-200 transition-colors" title="Kategorie schließen">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={{2}} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </button>
                    </div>
                </div>
'''
    
    # Find and replace the Filter section header to add navigation before it
    filter_pattern = r'(\s+<div className="flex items-center justify-between mb-6"><h3 className="font-bold text-gray-900 text-lg">Filter</h3>)'
    
    if re.search(filter_pattern, content):
        content = re.sub(
            filter_pattern,
            navigation_html + r'\1',
            content
        )
    else:
        print(f"⚠️  Could not find Filter section in {filename}")
        continue
    
    # Write the updated content back
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"✅ Updated {filename}")

print(f"\n🎉 Successfully updated all {len(subcategories)} Elektronik subcategory pages!")
