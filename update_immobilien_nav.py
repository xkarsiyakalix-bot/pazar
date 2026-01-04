#!/usr/bin/env python3
"""Script to update navigation in all Immobilien subcategory pages"""

import os
import re

# List of all Immobilien subcategory pages
pages = [
    'AufZeitWGPage.js',
    'ContainerPage.js',
    'EigentumswohnungenPage.js',
    'FerienAuslandsimmobilienPage.js',
    'GaragenStellplaetzePage.js',
    'GewerbeimmobilienPage.js',
    'GrundstueckeGaertenPage.js',
    'HaeuserZumKaufPage.js',
    'HaeuserZurMietePage.js',
    'MietwohnungenPage.js',
    'NeubauprojektePage.js',
    'UmzugTransportPage.js',
    'WeitereImmobilienPage.js'
]

src_dir = '/Volumes/Kerem Aydin/Projeler/Kleinanzegen/24.11.2025/app/frontend/src'

updated_count = 0
for page_file in pages:
    filepath = os.path.join(src_dir, page_file)
    
    if not os.path.exists(filepath):
        print(f"Skipped (not found): {page_file}")
        continue
    
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Change 1: "Alle Kategorien" heading to "Kategorien"
    content = re.sub(
        r'<h3 className="font-bold text-gray-900 mb-3 text-base">Alle Kategorien</h3>',
        r'<h3 className="font-bold text-gray-900 mb-3 text-base">Kategorien</h3>',
        content
    )
    
    # Change 2: Add more space between "Alle Kategorien" button and main category button
    content = re.sub(
        r'<div className="space-y-1">',
        r'<div className="space-y-2 mt-3">',
        content
    )
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"Updated: {page_file}")
    updated_count += 1

print(f"\n✅ Updated {updated_count} Immobilien subcategory pages!")
