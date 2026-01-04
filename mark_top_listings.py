#!/usr/bin/env python3
"""
Script to automatically mark at least one listing as TOP in each subcategory
that currently has no TOP listings.
"""

import re

# Read the components.js file
file_path = '/Volumes/Kerem Aydin/Projeler/Kleinanzegen/24.11.2025/app/frontend/src/components.js'
with open(file_path, 'r') as f:
    content = f.read()

# Find all listings with their properties
listing_pattern = r'(\{[^}]*id:\s*\d+[^}]*isTop:\s*(?:true|false)[^}]*subCategory:\s*[\'"][^\'"]*[\'"][^}]*\})'
listings = re.finditer(listing_pattern, content, re.DOTALL)

# Track subcategories and their listings
subcategories = {}
listing_positions = []

for match in listings:
    listing_text = match.group(1)
    
    # Extract details
    id_match = re.search(r'id:\s*(\d+)', listing_text)
    is_top_match = re.search(r'isTop:\s*(true|false)', listing_text)
    subcat_match = re.search(r'subCategory:\s*[\'"]([^\'"]*)[\'"]', listing_text)
    
    if id_match and is_top_match and subcat_match:
        listing_id = id_match.group(1)
        is_top = is_top_match.group(1) == 'true'
        subcategory = subcat_match.group(1)
        
        if subcategory not in subcategories:
            subcategories[subcategory] = {'top': [], 'not_top': []}
        
        listing_info = {
            'id': listing_id,
            'start': match.start(),
            'end': match.end(),
            'text': listing_text,
            'is_top': is_top
        }
        
        if is_top:
            subcategories[subcategory]['top'].append(listing_info)
        else:
            subcategories[subcategory]['not_top'].append(listing_info)

# Find subcategories without TOP listings
subcats_to_fix = []
for subcat, data in subcategories.items():
    if not data['top'] and data['not_top']:
        # Mark the first listing as TOP
        first_listing = data['not_top'][0]
        subcats_to_fix.append({
            'subcategory': subcat,
            'listing_id': first_listing['id'],
            'position': first_listing['start']
        })

print(f"Found {len(subcats_to_fix)} subcategories without TOP listings")
print(f"Will mark {len(subcats_to_fix)} listings as TOP\n")

# Sort by position (reverse) to replace from end to beginning
subcats_to_fix.sort(key=lambda x: x['position'], reverse=True)

# Apply changes
modified_content = content
changes_made = [0]  # Use list to avoid nonlocal issue

for fix in subcats_to_fix:
    # Find the specific listing and change isTop: false to isTop: true
    # We need to find the exact position in the current content
    pattern = rf'(id:\s*{fix["listing_id"]}[^}}]*isTop:\s*)false'
    
    def replacer(match):
        changes_made[0] += 1
        print(f"✓ Marking listing #{fix['listing_id']} as TOP in '{fix['subcategory']}'")
        return match.group(1) + 'true'
    
    modified_content = re.sub(pattern, replacer, modified_content, count=1)

# Write back to file
with open(file_path, 'w') as f:
    f.write(modified_content)

print(f"\n{'='*80}")
print(f"SUCCESS! Modified {changes_made[0]} listings")
print(f"All subcategories now have at least one TOP listing!")
print(f"{'='*80}")
