#!/usr/bin/env python3
"""
Fix duplicate navigation in Mode & Beauty subcategory pages
"""

import os
import re

# Define all Mode & Beauty subcategories
subcategories = [
    'BeautyGesundheitPage.js',
    'DamenbekleidungPage.js',
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
    
    # Pattern to match the duplicate navigation section
    # Looking for two consecutive navigation blocks
    duplicate_pattern = r'(\s+</div>\s+</div>\s+)(\s+<div className="mb-6 pb-6 border-b border-gray-200">.*?</div>\s+</div>\s+)'
    
    # Find all occurrences
    matches = list(re.finditer(duplicate_pattern, content, re.DOTALL))
    
    if len(matches) >= 1:
        # Remove the second occurrence (the duplicate)
        # We want to keep the first navigation block and remove the second one
        content_lines = content.split('\n')
        
        # Find the pattern more specifically
        # Look for the closing tags of first nav block followed by opening of second
        pattern = r'(</div>\s+</div>\s+)(\s+<div className="mb-6 pb-6 border-b border-gray-200">)'
        
        # Count occurrences
        count = len(re.findall(pattern, content))
        
        if count > 0:
            # Replace only the first occurrence (which connects the duplicate)
            content = re.sub(pattern, r'\1', content, count=1)
            
            # Write back
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            
            print(f"✅ Fixed {filename}")
        else:
            print(f"⚠️  No duplicate pattern found in {filename}")
    else:
        print(f"ℹ️  No duplicates in {filename}")

print(f"\n🎉 Duplicate navigation sections removed!")
