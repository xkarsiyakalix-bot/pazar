#!/usr/bin/env python3
import os
import re

# Read the updated HeimtextilienPage.js to get the new layout
with open('app/frontend/src/HeimtextilienPage.js', 'r', encoding='utf-8') as f:
    template_content = f.read()

# Extract the new listings layout section
# Find the section between "filteredListings.length === 0" and the closing of that section
pattern = r'(filteredListings\.length === 0.*?)\s*</div>\s*</div>\s*</div>\s*\);\s*}\s*export default'
match = re.search(pattern, template_content, re.DOTALL)

if match:
    new_layout_section = match.group(1)
    
    # Pages to update
    pages = [
        "BadezimmerPage.js",
        "BueroPage.js",
        "DekorationPage.js",
        "DienstleistungenHausGartenPage.js",
        "GartenzubehoerPflanzenPage.js",
        "HeimwerkenPage.js",
        "KuecheEsszimmerPage.js",
        "LampenLichtPage.js",
        "SchlafzimmerPage.js",
        "WohnzimmerPage.js",
        "WeiteresHausGartenPage.js",
    ]
    
    for page_file in pages:
        filepath = f'app/frontend/src/{page_file}'
        
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Replace the old grid layout with new horizontal layout
        content = re.sub(pattern, new_layout_section + '\n        </div></div></div>\n    );\n}\nexport default', content, flags=re.DOTALL)
        
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        
        print(f"✓ Updated {page_file} to horizontal layout")
    
    print("\nAll pages updated to horizontal layout!")
else:
    print("Could not find layout section in template")
