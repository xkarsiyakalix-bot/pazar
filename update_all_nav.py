#!/usr/bin/env python3
"""Script to update navigation in ALL subcategory pages"""

import os
import re
import glob

src_dir = '/Volumes/Kerem Aydin/Projeler/Kleinanzegen/24.11.2025/app/frontend/src'

# Get all .js files
all_files = glob.glob(os.path.join(src_dir, '*Page.js'))

total_updated = 0
skipped = 0

for filepath in sorted(all_files):
    filename = os.path.basename(filepath)
    
    # Skip main category pages and special pages
    skip_files = ['AlleKategorienPage.js', 'ImmobilienPage.js', 'AutoRadBootPage.js', 
                  'HausGartenPage.js', 'ModeBeautyPage.js', 'ElektronikPage.js',
                  'HaustierePage.js', 'FamilieKindBabyPage.js', 'JobsPage.js',
                  'FreizeitHobbyNachbarschaftPage.js', 'MusikFilmeBuecherPage.js',
                  'EintrittskartenTicketsPage.js', 'DienstleistungenPage.js',
                  'VerschenkenTauschenPage.js', 'UnterrichtKursePage.js',
                  'NachbarschaftshilfePage.js']
    
    if filename in skip_files:
        continue
    
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original_content = content
    
    # Change 1: "Alle Kategorien" heading to "Kategorien"
    content = re.sub(
        r'<h3 className="font-bold text-gray-900 mb-3 text-base">Alle Kategorien</h3>',
        r'<h3 className="font-bold text-gray-900 mb-3 text-base">Kategorien</h3>',
        content
    )
    
    # Change 2: Add more space between buttons
    content = re.sub(
        r'<div className="space-y-1">',
        r'<div className="space-y-2 mt-3">',
        content
    )
    
    # Only write if changes were made
    if content != original_content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"✅ Updated: {filename}")
        total_updated += 1
    else:
        skipped += 1

print(f"\n{'='*60}")
print(f"✅ Total updated: {total_updated} pages")
print(f"ℹ️  Skipped: {skipped} pages (no changes needed)")
