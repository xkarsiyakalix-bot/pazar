#!/usr/bin/env python3
"""
Update Haustiere subcategory pages to navigate to /Haustiere instead of /Alle-Kategorien
"""

import os
import re

# Define all Haustiere subcategories
subcategories = [
    'FischePage.js',
    'HundePage.js',
    'KatzenPage.js',
    'KleintierePage.js',
    'NutztierePage.js',
    'PferdePage.js',
    'TierbetreuungTrainingPage.js',
    'VermissTierePage.js',
    'VoegelPage.js',
    'TierzubehoerPage.js',
]

base_path = '/Volumes/Kerem Aydin/Projeler/Kleinanzegen/24.11.2025/app/frontend/src'

for filename in subcategories:
    filepath = os.path.join(base_path, filename)
    
    if not os.path.exists(filepath):
        print(f"❌ File not found: {filename}")
        continue
    
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Replace navigate('/Alle-Kategorien') with navigate('/Haustiere') in the close button
    # This is specifically for the close button in the subcategory navigation
    content = re.sub(
        r"navigate\('/Alle-Kategorien'\); \}\}\} className=\"text-white hover:text-red-200",
        r"navigate('/Haustiere'); }}} className=\"text-white hover:text-red-200",
        content
    )
    
    # Write the updated content back
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"✅ Updated {filename}")

print(f"\n🎉 All Haustiere subcategory pages now navigate to /Haustiere!")
