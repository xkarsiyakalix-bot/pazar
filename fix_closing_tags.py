#!/usr/bin/env python3
"""
Fix the extra closing div tag in Mode & Beauty subcategory pages
"""

import os
import re

# Remaining files to fix
subcategories = [
    'DamenschuhePage.js',
    'HerrenbekleidungPage.js',
    'HerrenschuhePage.js',
    'TaschenAccessoiresPage.js',
    'UhrenSchmuckPage.js',
    'WeiteresModeBeautyPage.js',
]

base_path = '/Volumes/Kerem Aydin/Projeler/Kleinanzegen/24.11.2025/app/frontend/src'

for filename in subcategories:
    filepath = os.path.join(base_path, filename)
    
    if not os.path.exists(filepath):
        print(f"❌ File not found: {filename}")
        continue
    
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Replace the problematic pattern
    # Looking for: </div>\n\n                </div>\n\n                <div className="flex items-center
    # Replace with: </div>\n\n                <div className="flex items-center
    
    pattern = r'(</div>\s+</div>)\s+</div>\s+(<div className="flex items-center justify-between mb-6">)'
    replacement = r'\1\n\n                \2'
    
    content = re.sub(pattern, replacement, content)
    
    # Write back
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"✅ Fixed {filename}")

print(f"\n🎉 All Mode & Beauty pages fixed!")
