#!/usr/bin/env python3
"""
Fix the 2 missing subcategory pages
"""

import os
import re

base_path = '/Volumes/Kerem Aydin/Projeler/Kleinanzegen/24.11.2025/app/frontend/src'

# Correct filenames
pages_to_fix = [
    ('FerienAuslandsimmobilienPage.js', 'Immobilien', 'Ferien- & Auslandsimmobilien'),
    ('WeiteresAutoRadBootPage.js', 'Auto, Rad & Boot', 'Weiteres Auto, Rad & Boot'),
]

print("🔧 Fixing remaining subcategory pages...")
print("=" * 60)

for filename, category, subcat in pages_to_fix:
    filepath = os.path.join(base_path, filename)
    
    if not os.path.exists(filepath):
        print(f"⚠️  {filename} still not found")
        continue
    
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    if 'CategoryGallery' in content:
        print(f"ℹ️  {filename} already has CategoryGallery")
        continue
    
    # Add import
    if "import { CategoryGallery } from './components';" not in content:
        import_lines = re.findall(r"import.*from.*;\n", content)
        if import_lines:
            last_import = import_lines[-1]
            insert_pos = content.rfind(last_import) + len(last_import)
            content = content[:insert_pos] + "import { CategoryGallery } from './components';\n" + content[insert_pos:]
    
    # Find and insert
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
            result += groups[-1]
            return result
        
        new_content, count = re.subn(pattern, replacement, content, count=1)
        
        if count > 0:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"✅ {filename}")
            inserted = True
            break
    
    if not inserted:
        print(f"⚠️  Pattern not found in {filename}")

print("\n" + "=" * 60)
print("✅ Fix complete!")
