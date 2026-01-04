#!/usr/bin/env python3
import os

# Read the HeimtextilienPage.js template
with open('app/frontend/src/HeimtextilienPage.js', 'r', encoding='utf-8') as f:
    template = f.read()

# Mode & Beauty pages to create
pages = [
    ("BeautyGesundheitPage", "Beauty & Gesundheit", "Beauty und Gesundheitsprodukte"),
    ("DamenbekleidungPage", "Damenbekleidung", "Damenmode und Bekleidung"),
    ("DamenschuhePage", "Damenschuhe", "Schuhe für Damen"),
    ("HerrenbekleidungPage", "Herrenbekleidung", "Herrenmode und Bekleidung"),
    ("HerrenschuhePage", "Herrenschuhe", "Schuhe für Herren"),
    ("TaschenAccessoiresPage", "Taschen & Accessoires", "Taschen und Accessoires"),
    ("UhrenSchmuckPage", "Uhren & Schmuck", "Uhren und Schmuck"),
    ("WeiteresModeBeautyPage", "Weiteres Mode & Beauty", "Weitere Mode und Beauty Artikel"),
]

for page_name, subcategory, description in pages:
    # Create new content by replacing
    new_content = template.replace("HeimtextilienPage", page_name)
    new_content = new_content.replace("Heimtextilien", subcategory)
    new_content = new_content.replace("Textilien für Ihr Zuhause", description)
    new_content = new_content.replace("Haus & Garten", "Mode & Beauty")
    
    # Write to file
    filepath = f'app/frontend/src/{page_name}.js'
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(new_content)
    
    print(f"✓ Created {page_name}.js")

print("\nAll Mode & Beauty pages created!")
