#!/usr/bin/env python3
"""
Add CategoryGallery to remaining category pages with flexible pattern matching
"""

import os
import re

base_path = '/Volumes/Kerem Aydin/Projeler/Kleinanzegen/24.11.2025/app/frontend/src'

# Remaining main category pages
remaining_categories = [
    ('ModeBeautyPage.js', 'Mode & Beauty'),
    ('ImmobilienPage.js', 'Immobilien'),
    ('AutoRadBootPage.js', 'Auto, Rad & Boot'),
    ('HaustierePage.js', 'Haustiere'),
    ('FamilieKindBabyPage.js', 'Familie, Kind & Baby'),
    ('FreizeitHobbyNachbarschaftPage.js', 'Freizeit, Hobby & Nachbarschaft'),
    ('MusikFilmeBuecherPage.js', 'Musik, Filme & Bücher'),
    ('EintrittskartenTicketsPage.js', 'Eintrittskarten & Tickets'),
    ('DienstleistungenPage.js', 'Dienstleistungen'),
    ('VerschenkenTauschenPage.js', 'Verschenken & Tauschen'),
    ('UnterrichtKursePage.js', 'Unterricht & Kurse'),
    ('NachbarschaftshilfeMainPage.js', 'Nachbarschaftshilfe'),
]

print("📦 Adding CategoryGallery to remaining category pages...")
print("=" * 60)

updated_count = 0

for filename, category_name in remaining_categories:
    filepath = os.path.join(base_path, filename)
    
    if not os.path.exists(filepath):
        print(f"⚠️  {filename} not found")
        continue
    
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Check if already has CategoryGallery
    if 'CategoryGallery' in content:
        print(f"ℹ️  {filename} already has CategoryGallery")
        continue
    
    # Add import
    if "import { CategoryGallery } from './components';" not in content:
        import_match = re.search(r"(import.*from.*;\n)", content)
        if import_match:
            last_import_pos = content.rfind(import_match.group(1)) + len(import_match.group(1))
            content = content[:last_import_pos] + "import { CategoryGallery } from './components';\n" + content[last_import_pos:]
    
    # Find banner closing and listings div start - more flexible pattern
    # Look for: </div> followed by optional whitespace, then <div className="bg-white rounded-lg shadow-sm p-6">
    pattern = r'(</div>\s*)(<!--.*?-->\s*)?(<div className="bg-white rounded-lg shadow-sm p-6">)'
    
    def replacement(match):
        return (match.group(1) + '\n' +
                f'''                        <CategoryGallery 
                            category="{category_name}"
                            toggleFavorite={{() => {{}}}}
                            isFavorite={{() => false}}
                        />

                        ''' + match.group(3))
    
    new_content, count = re.subn(pattern, replacement, content, count=1)
    
    if count > 0:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"✅ {filename}")
        updated_count += 1
    else:
        print(f"⚠️  Pattern not found in {filename}")

print("\n" + "=" * 60)
print(f"✅ Total updated: {updated_count} pages")
print("=" * 60)
