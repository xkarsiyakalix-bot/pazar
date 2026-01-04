#!/usr/bin/env python3
"""
Add Haustiere main category button to remaining subcategory pages
"""

import os

# Define remaining Haustiere subcategories (excluding FischePage which is already fixed)
subcategories = [
    ('HundePage.js', 'Hunde'),
    ('KatzenPage.js', 'Katzen'),
    ('KleintierePage.js', 'Kleintiere'),
    ('NutztierePage.js', 'Nutztiere'),
    ('PferdePage.js', 'Pferde'),
    ('TierbetreuungTrainingPage.js', 'Tierbetreuung & Training'),
    ('VermissTierePage.js', 'Vermisste Tiere'),
    ('VoegelPage.js', 'Vögel'),
    ('TierzubehoerPage.js', 'Zubehör'),
]

base_path = '/Volumes/Kerem Aydin/Projeler/Kleinanzegen/24.11.2025/app/frontend/src'

for filename, subcategory_name in subcategories:
    filepath = os.path.join(base_path, filename)
    
    if not os.path.exists(filepath):
        print(f"❌ File not found: {filename}")
        continue
    
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Find and replace the navigation section
    old_pattern = f'''                    </button>
                    <div className="space-y-2 mt-3">
                        <button className="text-left px-3 py-2 rounded-lg text-sm transition-all bg-red-600 text-white shadow-md flex items-center justify-between ml-4" style={{{{ width: 'calc(100% - 1rem)' }}}}>
                            <span>{subcategory_name}</span>
                            <button onClick={{(e) => {{ e.stopPropagation(); navigate('/Alle-Kategorien'); }}}} className="text-white hover:text-red-200 transition-colors" title="Kategorie schließen">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={{2}} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </button>
                    </div>
                </div>'''
    
    new_pattern = f'''                    </button>
                    <div className="space-y-2 mt-3">
                        <button onClick={{() => navigate('/Haustiere')}} className="text-left px-3 py-2 rounded-lg text-sm transition-all bg-gray-100 text-gray-700 hover:bg-gray-200 flex items-center justify-between group ml-4" style={{{{ width: 'calc(100% - 1rem)' }}}}>
                            <span>Haustiere</span>
                            <svg className="w-4 h-4 text-gray-400 group-hover:text-red-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={{2}} d="M9 5l7 7-7 7" /></svg>
                        </button>
                        <button className="text-left px-3 py-2 rounded-lg text-sm transition-all bg-red-600 text-white shadow-md flex items-center justify-between ml-8" style={{{{ width: 'calc(100% - 2rem)' }}}}>
                            <span>{subcategory_name}</span>
                            <button onClick={{(e) => {{ e.stopPropagation(); navigate('/Haustiere'); }}}} className="text-white hover:text-red-200 transition-colors" title="Kategorie schließen">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={{2}} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </button>
                    </div>
                </div>'''
    
    # Replace the pattern
    if old_pattern in content:
        content = content.replace(old_pattern, new_pattern)
        
        # Write the updated content back
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        
        print(f"✅ Updated {filename}")
    else:
        print(f"⚠️  Pattern not found in {filename}")

print(f"\n🎉 All remaining Haustiere subcategory pages updated!")
