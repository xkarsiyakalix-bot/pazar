#!/usr/bin/env python3
"""
Fix duplicate navigation in remaining Mode & Beauty subcategory pages
"""

import os
import re

# Define remaining Mode & Beauty subcategories (excluding DamenbekleidungPage which is already fixed)
subcategories = [
    'BeautyGesundheitPage.js',
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
        lines = f.readlines()
    
    # Find the duplicate section
    # Look for the pattern where navigation ends and immediately starts again
    new_lines = []
    skip_until = -1
    
    for i, line in enumerate(lines):
        if i < skip_until:
            continue
            
        # Check if this is the end of first navigation block followed by start of duplicate
        if '</div>                <div className="mb-6 pb-6 border-b border-gray-200">' in line:
            # This is the problematic line - skip it and the next navigation block
            new_lines.append('                </div>\n')
            new_lines.append('\n')
            
            # Skip the duplicate navigation block (approximately 18 lines)
            # Find the end of the duplicate block
            j = i + 1
            depth = 1
            while j < len(lines) and depth > 0:
                if '<div className="mb-6 pb-6 border-b border-gray-200">' in lines[j]:
                    depth += 1
                elif '</div>' in lines[j] and 'border-b border-gray-200' not in lines[j]:
                    depth -= 1
                    if depth == 0:
                        skip_until = j + 1
                        break
                j += 1
            continue
        
        new_lines.append(line)
    
    # Write back
    with open(filepath, 'w', encoding='utf-8') as f:
        f.writelines(new_lines)
    
    print(f"✅ Fixed {filename}")

print(f"\n🎉 All Mode & Beauty duplicate navigation sections removed!")
