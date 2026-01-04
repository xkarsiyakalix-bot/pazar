#!/usr/bin/env python3
"""
Add CategoryGallery to all main category and subcategory pages
"""

import os
import re

base_path = '/Volumes/Kerem Aydin/Projeler/Kleinanzegen/24.11.2025/app/frontend/src'

# Main category pages with their category names
main_categories = [
    ('ElektronikPage.js', 'Elektronik'),
    ('ModeBeautyPage.js', 'Mode & Beauty'),
    ('ImmobilienPage.js', 'Immobilien'),
    ('AutoRadBootPage.js', 'Auto, Rad & Boot'),
    ('HaustierePage.js', 'Haustiere'),
    ('FamilieKindBabyPage.js', 'Familie, Kind & Baby'),
    ('JobsPage.js', 'Jobs'),
    ('FreizeitHobbyNachbarschaftPage.js', 'Freizeit, Hobby & Nachbarschaft'),
    ('MusikFilmeBuecherPage.js', 'Musik, Filme & Bücher'),
    ('EintrittskartenTicketsPage.js', 'Eintrittskarten & Tickets'),
    ('DienstleistungenPage.js', 'Dienstleistungen'),
    ('VerschenkenTauschenPage.js', 'Verschenken & Tauschen'),
    ('UnterrichtKursePage.js', 'Unterricht & Kurse'),
    ('NachbarschaftshilfeMainPage.js', 'Nachbarschaftshilfe'),
]

print("📦 Adding CategoryGallery to all category pages...")
print("=" * 60)

updated_count = 0
skipped_count = 0

for filename, category_name in main_categories:
    filepath = os.path.join(base_path, filename)
    
    if not os.path.exists(filepath):
        print(f"⚠️  {filename} not found")
        skipped_count += 1
        continue
    
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Check if already has CategoryGallery
    if 'CategoryGallery' in content:
        print(f"ℹ️  {filename} already has CategoryGallery")
        skipped_count += 1
        continue
    
    # Add import if not present
    if "import { CategoryGallery } from './components';" not in content:
        # Find the last import line
        import_match = re.search(r"(import.*from.*;\n)", content)
        if import_match:
            last_import_pos = content.rfind(import_match.group(1)) + len(import_match.group(1))
            content = content[:last_import_pos] + "import { CategoryGallery } from './components';\n" + content[last_import_pos:]
    
    # Find the position after the banner/header div closes and before the listings div
    # Look for pattern: </div>\n\n                        <div className="bg-white rounded-lg shadow-sm p-6">
    pattern = r'(</div>\n\n\s+<div className="bg-white rounded-lg shadow-sm p-6">)'
    match = re.search(pattern, content)
    
    if match:
        insert_pos = match.start()
        gallery_code = f'''</div>

                        <CategoryGallery 
                            category="{category_name}"
                            toggleFavorite={{() => {{}}}}
                            isFavorite={{() => false}}
                        />

                        <div className="bg-white rounded-lg shadow-sm p-6">'''
        
        content = content[:insert_pos] + gallery_code + content[match.end():]
        
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        
        print(f"✅ {filename}")
        updated_count += 1
    else:
        print(f"⚠️  Could not find insertion point in {filename}")
        skipped_count += 1

print("\n" + "=" * 60)
print(f"✅ Updated: {updated_count} pages")
print(f"⚠️  Skipped: {skipped_count} pages")
print("=" * 60)
