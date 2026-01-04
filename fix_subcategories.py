#!/usr/bin/env python3
import os
import re

# Pages with their correct subcategories
pages = [
    ("BadezimmerPage.js", "Badezimmer"),
    ("BueroPage.js", "Büro"),
    ("DekorationPage.js", "Dekoration"),
    ("DienstleistungenHausGartenPage.js", "Dienstleistungen Haus & Garten"),
    ("GartenzubehoerPflanzenPage.js", "Gartenzubehör & Pflanzen"),
    ("HeimwerkenPage.js", "Heimwerken"),
    ("KuecheEsszimmerPage.js", "Küche & Esszimmer"),
    ("LampenLichtPage.js", "Lampen & Licht"),
    ("SchlafzimmerPage.js", "Schlafzimmer"),
    ("WohnzimmerPage.js", "Wohnzimmer"),
    ("WeiteresHausGartenPage.js", "Weiteres Haus & Garten"),
]

base_dir = "app/frontend/src"

for filename, subcategory in pages:
    filepath = os.path.join(base_dir, filename)
    
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Fix the subcategory filter in filteredListings
    # Replace listing.subCategory === 'Heimtextilien' with the correct subcategory
    content = re.sub(
        r"listing\.subCategory === 'Heimtextilien'",
        f"listing.subCategory === '{subcategory}'",
        content
    )
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"✓ Fixed subcategory filter in {filename}")

print("\nAll subcategory filters fixed!")
