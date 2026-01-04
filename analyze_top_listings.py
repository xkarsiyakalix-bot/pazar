#!/usr/bin/env python3
"""
Script to analyze which subcategories have TOP listings and which don't
"""

import re

# Read the components.js file
with open('/Volumes/Kerem Aydin/Projeler/Kleinanzegen/24.11.2025/app/frontend/src/components.js', 'r') as f:
    content = f.read()

# Find all listings with their properties
listing_pattern = r'\{[^}]*id:\s*(\d+)[^}]*isTop:\s*(true|false)[^}]*subCategory:\s*[\'"]([^\'"]*)[\'"][^}]*\}'
matches = re.findall(listing_pattern, content, re.DOTALL)

# Organize by subcategory
subcategories = {}
for match in matches:
    listing_id, is_top, subcategory = match
    if subcategory not in subcategories:
        subcategories[subcategory] = {'top': [], 'not_top': []}
    
    if is_top == 'true':
        subcategories[subcategory]['top'].append(listing_id)
    else:
        subcategories[subcategory]['not_top'].append(listing_id)

# Print results
print("=" * 80)
print("SUBCATEGORIES WITH TOP LISTINGS:")
print("=" * 80)
for subcat in sorted(subcategories.keys()):
    if subcategories[subcat]['top']:
        print(f"✓ {subcat}: {len(subcategories[subcat]['top'])} TOP listing(s)")

print("\n" + "=" * 80)
print("SUBCATEGORIES WITHOUT TOP LISTINGS:")
print("=" * 80)
for subcat in sorted(subcategories.keys()):
    if not subcategories[subcat]['top'] and subcategories[subcat]['not_top']:
        print(f"✗ {subcat}: {len(subcategories[subcat]['not_top'])} listing(s) but NONE marked as TOP")

print("\n" + "=" * 80)
print("SUMMARY:")
print("=" * 80)
total_with_top = sum(1 for s in subcategories.values() if s['top'])
total_without_top = sum(1 for s in subcategories.values() if not s['top'] and s['not_top'])
print(f"Subcategories WITH TOP listings: {total_with_top}")
print(f"Subcategories WITHOUT TOP listings: {total_without_top}")
