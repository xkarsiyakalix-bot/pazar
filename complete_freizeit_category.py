#!/usr/bin/env python3
"""
Complete Freizeit, Hobby & Nachbarschaft category
"""

import os

# Subcategories
subcategories = [
    ('EsoterikSpirituellesPage.js', 'Esoterik & Spirituelles', '/Freizeit-Hobby-Nachbarschaft/Esoterik-Spirituelles'),
    ('EssenTrinkenPage.js', 'Essen & Trinken', '/Freizeit-Hobby-Nachbarschaft/Essen-Trinken'),
    ('FreizeitaktivitaetenPage.js', 'Freizeitaktivitäten', '/Freizeit-Hobby-Nachbarschaft/Freizeitaktivitäten'),
    ('HandarbeitBastelnKunsthandwerkPage.js', 'Handarbeit, Basteln & Kunsthandwerk', '/Freizeit-Hobby-Nachbarschaft/Handarbeit-Basteln-Kunsthandwerk'),
    ('KunstAntiquitaetenPage.js', 'Kunst & Antiquitäten', '/Freizeit-Hobby-Nachbarschaft/Kunst-Antiquitäten'),
    ('KuenstlerMusikerPage.js', 'Künstler/-in & Musiker/-in', '/Freizeit-Hobby-Nachbarschaft/Künstler-Musiker'),
    ('ModellbauPage.js', 'Modellbau', '/Freizeit-Hobby-Nachbarschaft/Modellbau'),
    ('ReiseEventservicesPage.js', 'Reise & Eventservices', '/Freizeit-Hobby-Nachbarschaft/Reise-Eventservices'),
    ('SammelnPage.js', 'Sammeln', '/Freizeit-Hobby-Nachbarschaft/Sammeln'),
    ('SportCampingPage.js', 'Sport & Camping', '/Freizeit-Hobby-Nachbarschaft/Sport-Camping'),
    ('TroedelPage.js', 'Trödel', '/Freizeit-Hobby-Nachbarschaft/Trödel'),
    ('VerlorenGefundenPage.js', 'Verloren & Gefunden', '/Freizeit-Hobby-Nachbarschaft/Verloren-Gefunden'),
    ('WeiteresFreizeitHobbyNachbarschaftPage.js', 'Weiteres Freizeit, Hobby & Nachbarschaft', '/Freizeit-Hobby-Nachbarschaft/Weiteres-Freizeit-Hobby-Nachbarschaft'),
]

base_path = '/Volumes/Kerem Aydin/Projeler/Kleinanzegen/24.11.2025/app/frontend/src'

print("📋 Freizeit, Hobby & Nachbarschaft Category Update")
print("=" * 60)

# Step 1: Add import and route to App.js
print("\n1️⃣  Adding FreizeitHobbyNachbarschaftPage import and route...")
app_js_path = os.path.join(base_path, 'App.js')

with open(app_js_path, 'r', encoding='utf-8') as f:
    app_content = f.read()

if 'import FreizeitHobbyNachbarschaftPage' not in app_content:
    # Add import after WeitereJobsPage
    app_content = app_content.replace(
        "import WeitereJobsPage from './WeitereJobsPage';",
        "import WeitereJobsPage from './WeitereJobsPage';\nimport FreizeitHobbyNachbarschaftPage from './FreizeitHobbyNachbarschaftPage';"
    )
    
    # Add route before first subcategory route
    app_content = app_content.replace(
        '          <Route path="/Freizeit-Hobby-Nachbarschaft/Esoterik-Spirituelles"',
        '          <Route path="/Freizeit-Hobby-Nachbarschaft" element={<FreizeitHobbyNachbarschaftPage />} />\n          <Route path="/Freizeit-Hobby-Nachbarschaft/Esoterik-Spirituelles"'
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
                        <button onClick={{() => navigate('/Freizeit-Hobby-Nachbarschaft')}} className="text-left px-3 py-2 rounded-lg text-sm transition-all bg-gray-100 text-gray-700 hover:bg-gray-200 flex items-center justify-between group ml-4" style={{{{ width: 'calc(100% - 1rem)' }}}}>
                            <span>Freizeit, Hobby & Nachbarschaft</span>
                            <svg className="w-4 h-4 text-gray-400 group-hover:text-red-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={{2}} d="M9 5l7 7-7 7" /></svg>
                        </button>
                        <button className="text-left px-3 py-2 rounded-lg text-sm transition-all bg-red-600 text-white shadow-md flex items-center justify-between ml-8" style={{{{ width: 'calc(100% - 2rem)' }}}}>
                            <span>{subcategory_name}</span>
                            <button onClick={{(e) => {{ e.stopPropagation(); navigate('/Freizeit-Hobby-Nachbarschaft'); }}}} className="text-white hover:text-red-200 transition-colors" title="Kategorie schließen">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={{2}} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </button>
                    </div>
                </div>
'''

updated_count = 0
for filename, subcategory_name, route in subcategories:
    filepath = os.path.join(base_path, filename)
    
    if not os.path.exists(filepath):
        print(f"   ⚠️  {filename} not found")
        continue
    
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Check if already updated
    if 'Freizeit, Hobby & Nachbarschaft' in content and subcategory_name in content:
        print(f"   ℹ️  {filename} already has navigation")
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
        
        print(f"   ✅ {filename}")
        updated_count += 1
    else:
        print(f"   ⚠️  Filter section not found in {filename}")

print(f"\n✅ Updated {updated_count} subcategory pages")
print("\n🎉 Freizeit, Hobby & Nachbarschaft category complete!")
