#!/usr/bin/env python3
"""
Comprehensive script to add CategoryGallery to ALL remaining category and subcategory pages
"""

import os
import re

base_path = '/Volumes/Kerem Aydin/Projeler/Kleinanzegen/24.11.2025/app/frontend/src'

# Category to subcategory mapping
category_subcategories = {
    'Haus & Garten': [
        'Badezimmer', 'Büro', 'Dekoration', 'Dienstleistungen Haus & Garten',
        'Gartenzubehör & Pflanzen', 'Heimtextilien', 'Heimwerken', 
        'Lampen & Licht', 'Schlafzimmer', 'Wohnzimmer', 'Weiteres Haus & Garten'
    ],
    'Elektronik': [
        'Audio & Hifi', 'Dienstleistungen Elektronik', 'Foto', 'Handy & Telefon',
        'Haushaltsgeräte', 'Konsolen', 'Notebooks', 'PCs', 'PC-Zubehör & Software',
        'Tablets & Reader', 'TV & Video', 'Videospiele', 'Weitere Elektronik'
    ],
    'Mode & Beauty': [
        'Beauty & Gesundheit', 'Damenbekleidung', 'Damenschuhe', 'Herrenbekleidung',
        'Herrenschuhe', 'Taschen & Accessoires', 'Uhren & Schmuck', 'Weiteres Mode & Beauty'
    ],
    'Immobilien': [
        'Auf Zeit & WG', 'Container', 'Eigentumswohnungen', 'Ferien- & Auslandsimmobilien',
        'Garagen & Stellplätze', 'Gewerbeimmobilien', 'Grundstücke & Gärten',
        'Häuser zum Kauf', 'Häuser zur Miete', 'Mietwohnungen', 'Neubauprojekte',
        'Umzug & Transport', 'Weitere Immobilien'
    ],
    'Auto, Rad & Boot': [
        'Autos', 'Fahrräder & Zubehör', 'Autoteile & Reifen', 'Boote & Bootszubehör',
        'Motorräder & Motorroller', 'Motorradteile & Zubehör', 'Nutzfahrzeuge & Anhänger',
        'Reparaturen & Dienstleistungen', 'Wohnwagen & Mobile', 'Weiteres Auto, Rad & Boot'
    ],
}

def get_filename_from_subcategory(subcat):
    """Convert subcategory name to filename"""
    # Special cases
    special_cases = {
        'Küche & Esszimmer': 'KuecheEsszimmerPage.js',
        'Gartenzubehör & Pflanzen': 'GartenzubehoerPflanzenPage.js',
        'Lampen & Licht': 'LampenLichtPage.js',
        'Audio & Hifi': 'AudioHifiPage.js',
        'Handy & Telefon': 'HandyTelefonPage.js',
        'Haushaltsgeräte': 'HaushaltsgeraetePage.js',
        'PC-Zubehör & Software': 'PCZubehoerSoftwarePage.js',
        'Tablets & Reader': 'TabletsReaderPage.js',
        'TV & Video': 'TVVideoPage.js',
        'Beauty & Gesundheit': 'BeautyGesundheitPage.js',
        'Taschen & Accessoires': 'TaschenAccessoiresPage.js',
        'Uhren & Schmuck': 'UhrenSchmuckPage.js',
        'Auf Zeit & WG': 'AufZeitWGPage.js',
        'Garagen & Stellplätze': 'GaragenStellplaetzePage.js',
        'Grundstücke & Gärten': 'GrundstueckeGaertenPage.js',
        'Häuser zum Kauf': 'HaeuserZumKaufPage.js',
        'Häuser zur Miete': 'HaeuserZurMietePage.js',
        'Umzug & Transport': 'UmzugTransportPage.js',
        'Fahrräder & Zubehör': 'BikesPage.js',
        'Autoteile & Reifen': 'AutoteilePage.js',
        'Boote & Bootszubehör': 'BootePage.js',
        'Motorräder & Motorroller': 'MotorradPage.js',
        'Motorradteile & Zubehör': 'MotorradteilePage.js',
        'Nutzfahrzeuge & Anhänger': 'NutzfahrzeugePage.js',
        'Reparaturen & Dienstleistungen': 'ReparaturenPage.js',
        'Wohnwagen & Mobile': 'WohnwagenPage.js',
    }
    
    if subcat in special_cases:
        return special_cases[subcat]
    
    # Default conversion
    filename = subcat.replace(' & ', '').replace(' ', '').replace('ü', 'ue').replace('ö', 'oe').replace('ä', 'ae')
    return f"{filename}Page.js"

print("📦 Adding CategoryGallery to ALL subcategory pages...")
print("=" * 60)

updated_count = 0
skipped_count = 0
error_count = 0

for category, subcategories in category_subcategories.items():
    print(f"\n🔹 {category}")
    
    for subcat in subcategories:
        filename = get_filename_from_subcategory(subcat)
        filepath = os.path.join(base_path, filename)
        
        if not os.path.exists(filepath):
            print(f"  ⚠️  {filename} not found")
            error_count += 1
            continue
        
        try:
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Check if already has CategoryGallery
            if 'CategoryGallery' in content:
                print(f"  ℹ️  {filename} already has CategoryGallery")
                skipped_count += 1
                continue
            
            # Add import if not present
            if "import { CategoryGallery } from './components';" not in content:
                # Find last import
                import_lines = re.findall(r"import.*from.*;\n", content)
                if import_lines:
                    last_import = import_lines[-1]
                    insert_pos = content.rfind(last_import) + len(last_import)
                    content = content[:insert_pos] + "import { CategoryGallery } from './components';\n" + content[insert_pos:]
            
            # Find insertion point - after banner closing div, before listings div
            # Try multiple patterns
            patterns = [
                r'(</div>\s*)(<!--.*?-->\s*)?(<div className="bg-white rounded-lg shadow-sm p-6">)',
                r'(</div>\n\s*<div className="bg-white rounded-lg shadow-sm p-6">)',
            ]
            
            inserted = False
            for pattern in patterns:
                def replacement(match):
                    groups = match.groups()
                    result = groups[0] + '\n\n'
                    result += f'''                <CategoryGallery 
                    category="{category}"
                    subCategory="{subcat}"
                    toggleFavorite={{toggleFavorite}}
                    isFavorite={{(id) => favorites.includes(id)}}
                />

                '''
                    result += groups[-1]  # Last group is always the listings div
                    return result
                
                new_content, count = re.subn(pattern, replacement, content, count=1)
                
                if count > 0:
                    with open(filepath, 'w', encoding='utf-8') as f:
                        f.write(new_content)
                    print(f"  ✅ {filename}")
                    updated_count += 1
                    inserted = True
                    break
            
            if not inserted:
                print(f"  ⚠️  Pattern not found in {filename}")
                error_count += 1
                
        except Exception as e:
            print(f"  ❌ Error processing {filename}: {e}")
            error_count += 1

print("\n" + "=" * 60)
print(f"✅ Updated: {updated_count} pages")
print(f"ℹ️  Skipped (already has): {skipped_count} pages")
print(f"⚠️  Errors: {error_count} pages")
print("=" * 60)
