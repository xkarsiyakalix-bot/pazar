#!/usr/bin/env python3
import os
import re

# Read the working template
with open('app/frontend/src/HeimtextilienPage.js', 'r', encoding='utf-8') as f:
    template = f.read()

# Pages to fix with their substitutions
pages = [
    ("BadezimmerPage", "Badezimmer", "Heimtextilien", "Badmöbel und Badausstattung", "Textilien für Ihr Zuhause"),
    ("BueroPage", "Büro", "Heimtextilien", "Büromöbel und Ausstattung", "Textilien für Ihr Zuhause"),
    ("DekorationPage", "Dekoration", "Heimtextilien", "Dekoartikel für Ihr Zuhause", "Textilien für Ihr Zuhause"),
    ("DienstleistungenHausGartenPage", "Dienstleistungen Haus & Garten", "Heimtextilien", "Services rund um Haus und Garten", "Textilien für Ihr Zuhause"),
    ("GartenzubehoerPflanzenPage", "Gartenzubehör & Pflanzen", "Heimtextilien", "Alles für Ihren Garten", "Textilien für Ihr Zuhause"),
    ("HeimwerkenPage", "Heimwerken", "Heimtextilien", "Werkzeug und Material", "Textilien für Ihr Zuhause"),
    ("KuecheEsszimmerPage", "Küche & Esszimmer", "Heimtextilien", "Küchen- und Esszimmermöbel", "Textilien für Ihr Zuhause"),
    ("LampenLichtPage", "Lampen & Licht", "Heimtextilien", "Beleuchtung für Ihr Zuhause", "Textilien für Ihr Zuhause"),
    ("SchlafzimmerPage", "Schlafzimmer", "Heimtextilien", "Schlafzimmermöbel und Ausstattung", "Textilien für Ihr Zuhause"),
    ("WohnzimmerPage", "Wohnzimmer", "Heimtextilien", "Wohnzimmermöbel und Dekoration", "Textilien für Ihr Zuhause"),
    ("WeiteresHausGartenPage", "Weiteres Haus & Garten", "Heimtextilien", "Weitere Artikel für Haus und Garten", "Textilien für Ihr Zuhause"),
]

for page_name, subcategory, old_subcat, new_desc, old_desc in pages:
    # Create new content by replacing
    new_content = template.replace("HeimtextilienPage", page_name)
    new_content = new_content.replace("Heimtextilien", subcategory)
    new_content = new_content.replace(old_desc, new_desc)
    
    # Write to file
    filepath = f'app/frontend/src/{page_name}.js'
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(new_content)
    
    print(f"✓ Fixed {page_name}.js")

print("\nAll pages fixed! Frontend should compile now.")
