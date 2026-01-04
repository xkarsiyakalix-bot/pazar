#!/usr/bin/env python3
"""
Complete Jobs category: Create main page, add route, update all subcategories
"""

import os
import subprocess

# Jobs subcategories
subcategories = [
    ('AusbildungPage.js', 'Ausbildung', '/Jobs/Ausbildung'),
    ('BauHandwerkProduktionPage.js', 'Bau, Handwerk & Produktion', '/Jobs/Bau-Handwerk-Produktion'),
    ('BueroarbeitVerwaltungPage.js', 'Büroarbeit & Verwaltung', '/Jobs/Büroarbeit-Verwaltung'),
    ('GastronomieTourismusPage.js', 'Gastronomie & Tourismus', '/Jobs/Gastronomie-Tourismus'),
    ('KundenserviceCallCenterPage.js', 'Kundenservice & Call Center', '/Jobs/Kundenservice-Call-Center'),
    ('MiniNebenjobsPage.js', 'Mini- & Nebenjobs', '/Jobs/Mini-Nebenjobs'),
    ('PraktikaPage.js', 'Praktika', '/Jobs/Praktika'),
    ('SozialerSektorPflegePage.js', 'Sozialer Sektor & Pflege', '/Jobs/Sozialer-Sektor-Pflege'),
    ('TransportLogistikVerkehrPage.js', 'Transport, Logistik & Verkehr', '/Jobs/Transport-Logistik-Verkehr'),
    ('VertriebEinkaufVerkaufPage.js', 'Vertrieb, Einkauf & Verkauf', '/Jobs/Vertrieb-Einkauf-Verkauf'),
    ('WeitereJobsPage.js', 'Weitere Jobs', '/Jobs/Weitere-Jobs'),
]

base_path = '/Volumes/Kerem Aydin/Projeler/Kleinanzegen/24.11.2025/app/frontend/src'

print("📋 Jobs Category Update")
print("=" * 50)

# Step 1: Add import and route to App.js
print("\n1️⃣  Adding JobsPage import and route to App.js...")
app_js_path = os.path.join(base_path, 'App.js')

with open(app_js_path, 'r', encoding='utf-8') as f:
    app_content = f.read()

if 'import JobsPage' not in app_content:
    # Add import after WeiteresFamilieKindBabyPage
    app_content = app_content.replace(
        "import WeiteresFamilieKindBabyPage from './WeiteresFamilieKindBabyPage';",
        "import WeiteresFamilieKindBabyPage from './WeiteresFamilieKindBabyPage';\nimport JobsPage from './JobsPage';"
    )
    
    # Add route before first Jobs subcategory route
    app_content = app_content.replace(
        '          <Route path="/Jobs/Ausbildung"',
        '          <Route path="/Jobs" element={<JobsPage />} />\n          <Route path="/Jobs/Ausbildung"'
    )
    
    with open(app_js_path, 'w', encoding='utf-8') as f:
        f.write(app_content)
    
    print("   ✅ Added JobsPage import and route")
else:
    print("   ℹ️  JobsPage already imported")

# Step 2: Update all subcategory pages
print("\n2️⃣  Updating subcategory pages...")

nav_template = '''                <div className="mb-6 pb-6 border-b border-gray-200">
                    <h3 className="font-bold text-gray-900 mb-3 text-base">Kategorien</h3>
                    <button onClick={{() => navigate('/Alle-Kategorien')}} className="w-full text-left px-3 py-2 rounded-lg text-sm transition-all bg-gray-100 text-gray-700 hover:bg-gray-200 flex items-center justify-between group">
                        <span>Alle Kategorien</span>
                        <svg className="w-4 h-4 text-gray-400 group-hover:text-red-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={{2}} d="M9 5l7 7-7 7" /></svg>
                    </button>
                    <div className="space-y-2 mt-3">
                        <button onClick={{() => navigate('/Jobs')}} className="text-left px-3 py-2 rounded-lg text-sm transition-all bg-gray-100 text-gray-700 hover:bg-gray-200 flex items-center justify-between group ml-4" style={{{{ width: 'calc(100% - 1rem)' }}}}>
                            <span>Jobs</span>
                            <svg className="w-4 h-4 text-gray-400 group-hover:text-red-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={{2}} d="M9 5l7 7-7 7" /></svg>
                        </button>
                        <button className="text-left px-3 py-2 rounded-lg text-sm transition-all bg-red-600 text-white shadow-md flex items-center justify-between ml-8" style={{{{ width: 'calc(100% - 2rem)' }}}}>
                            <span>{subcategory_name}</span>
                            <button onClick={{(e) => {{ e.stopPropagation(); navigate('/Jobs'); }}}} className="text-white hover:text-red-200 transition-colors" title="Kategorie schließen">
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
    if 'Jobs' in content and subcategory_name in content and 'Alle Kategorien' in content:
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
print("\n🎉 Jobs category complete!")
