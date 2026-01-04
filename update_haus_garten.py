#!/usr/bin/env python3
"""Update remaining Haus & Garten pages with 3-level navigation"""

import os
import re

# Pages to update with their subcategory names
pages = {
    'BueroPage.js': 'Büro',
    'DekorationPage.js': 'Dekoration',
    'DienstleistungenHausGartenPage.js': 'Dienstleistungen Haus & Garten',
    'GartenzubehoerPflanzenPage.js': 'Gartenzubehör & Pflanzen',
    'HeimtextilienPage.js': 'Heimtextilien',
    'HeimwerkenPage.js': 'Heimwerken',
    'KuecheEsszimmerPage.js': 'Küche & Esszimmer',
    'LampenLichtPage.js': 'Lampen & Licht',
    'SchlafzimmerPage.js': 'Schlafzimmer',
    'WeiteresHausGartenPage.js': 'Weiteres Haus & Garten'
}

src_dir = '/Volumes/Kerem Aydin/Projeler/Kleinanzegen/24.11.2025/app/frontend/src'

# Navigation template
nav_template = '''            <aside className="w-96 flex-shrink-0 bg-white rounded-2xl shadow-lg p-6 h-fit sticky top-6">
                {{/* Category Navigation */}}
                <div className="mb-6 pb-6 border-b border-gray-200">
                    <h3 className="font-bold text-gray-900 mb-3 text-base">Kategorien</h3>
                    <button
                        onClick={{() => navigate('/Alle-Kategorien')}}
                        className="w-full text-left px-3 py-2 rounded-lg text-sm transition-all bg-gray-100 text-gray-700 hover:bg-gray-200 flex items-center justify-between group"
                    >
                        <span>Alle Kategorien</span>
                        <svg className="w-4 h-4 text-gray-400 group-hover:text-red-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={{2}} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>

                    <div className="space-y-2 mt-3">
                        <button
                            onClick={{() => navigate('/Haus-Garten')}}
                            className="text-left px-3 py-2 rounded-lg text-sm transition-all bg-gray-100 text-gray-700 hover:bg-gray-200 flex items-center justify-between group ml-4"
                            style={{{{ width: 'calc(100% - 1rem)' }}}}
                        >
                            <span>Haus & Garten</span>
                            <svg className="w-4 h-4 text-gray-400 group-hover:text-red-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={{2}} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                        <button
                            className="text-left px-3 py-2 rounded-lg text-sm transition-all bg-red-600 text-white shadow-md flex items-center justify-between ml-8"
                            style={{{{ width: 'calc(100% - 2rem)' }}}}
                        >
                            <span>{SUBCATEGORY_NAME}</span>
                            <button
                                onClick={{(e) => {{
                                    e.stopPropagation();
                                    navigate('/Haus-Garten');
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

                <div className="flex items-center justify-between mb-6"><h3 className="font-bold text-gray-900 text-lg">Filter</h3><button onClick={{() => {{ setCategory(''); setPriceFrom(''); setPriceTo(''); }}}} className="text-sm text-red-600 hover:text-red-700 font-medium">Zurücksetzen</button></div>'''

updated_count = 0
for filename, subcategory_name in pages.items():
    filepath = os.path.join(src_dir, filename)
    
    if not os.path.exists(filepath):
        print(f"⚠️  Not found: {filename}")
        continue
    
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Create navigation with subcategory name
    nav = nav_template.replace('{SUBCATEGORY_NAME}', subcategory_name)
    
    # Find and replace the aside section
    # Pattern: <aside className="w-80... up to the Filter section
    pattern = r'<aside className="w-80 flex-shrink-0 bg-white rounded-2xl shadow-lg p-6 h-fit sticky top-6">\s*<div className="flex items-center justify-between mb-6"><h3 className="font-bold text-gray-900 text-lg">Filter</h3><button onClick=\{[^}]+\} className="text-sm text-red-600 hover:text-red-700 font-medium">Zurücksetzen</button></div>'
    
    if re.search(pattern, content):
        content = re.sub(pattern, nav, content)
        
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        
        print(f"✅ Updated: {filename}")
        updated_count += 1
    else:
        print(f"⚠️  Pattern not found in: {filename}")

print(f"\n{'='*60}")
print(f"✅ Successfully updated {updated_count}/10 Haus & Garten pages!")
