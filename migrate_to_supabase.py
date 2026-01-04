#!/usr/bin/env python3
"""
Script to migrate all category pages from old backend API to Supabase.
This script will:
1. Replace fetch('http://localhost:8000/api/listings') with Supabase import
2. Fix field names: isTop -> is_top, subCategory -> sub_category
3. Add TOP badge if missing
4. Fix z-index values for badges
"""

import os
import re
import glob

# Directory containing the React pages
SRC_DIR = '/Volumes/Kerem Aydin/Projeler/Kleinanzegen/24.11.2025/app/frontend/src'

# Pages that are already migrated (skip these)
MIGRATED_PAGES = [
    'AlleKategorienPage.js',
    'AutoRadBootPage.js',
    'BikesPage.js',
    'ModeBeautyPage.js',
    'UhrenSchmuckPage.js',
    'components.js',
    'SmartRecommendations.js',
    'App.js'
]

def find_pages_with_old_api():
    """Find all JS files that use the old backend API."""
    pages = []
    for js_file in glob.glob(os.path.join(SRC_DIR, '*.js')):
        basename = os.path.basename(js_file)
        
        # Skip already migrated pages
        if basename in MIGRATED_PAGES:
            continue
            
        # Read file content
        try:
            with open(js_file, 'r', encoding='utf-8') as f:
                content = f.read()
                
            # Check if it uses old API
            if 'localhost:8000/api/listings' in content:
                pages.append(js_file)
        except Exception as e:
            print(f"Error reading {js_file}: {e}")
            
    return pages

def migrate_fetch_to_supabase(content, filename):
    """Replace old fetch API with Supabase."""
    
    # Pattern 1: Simple fetch without category filter
    pattern1 = r"const response = await fetch\('http://localhost:8000/api/listings'\);\s*if \(response\.ok\) \{\s*const data = await response\.json\(\);\s*setListings\(data\);\s*\}"
    
    replacement1 = """// Import fetchListings from api/listings
                const { fetchListings: fetchFromSupabase } = await import('./api/listings');
                const data = await fetchFromSupabase({});
                console.log('Fetched listings from Supabase:', data);
                setListings(data);"""
    
    content = re.sub(pattern1, replacement1, content, flags=re.DOTALL)
    
    # Pattern 2: Fetch with error handling
    pattern2 = r"const response = await fetch\('http://localhost:8000/api/listings'\);"
    replacement2 = "// Migrated to Supabase - see below\n                const { fetchListings: fetchFromSupabase } = await import('./api/listings');\n                const data = await fetchFromSupabase({});\n                setListings(data);"
    
    if pattern2 in content and pattern1 not in content:
        content = content.replace(pattern2, replacement2)
        # Remove the if (response.ok) block
        content = re.sub(r"if \(response\.ok\) \{[^}]*\}", "", content)
    
    return content

def fix_field_names(content):
    """Fix field names to match Supabase schema."""
    
    # Fix isTop -> is_top
    content = re.sub(r'\blisting\.isTop\b', 'listing.is_top', content)
    content = re.sub(r'\{listing\.isTop\b', '{listing.is_top', content)
    
    # Fix subCategory -> sub_category
    content = re.sub(r'\blisting\.subCategory\b', 'listing.sub_category', content)
    content = re.sub(r'\{listing\.subCategory\b', '{listing.sub_category', content)
    
    return content

def add_top_badge_if_missing(content):
    """Add TOP badge to listing cards if missing."""
    
    # Check if TOP badge already exists
    if 'TOP Badge' in content or '⭐ TOP' in content:
        return content
    
    # Find RESERVIERT badge and add TOP badge after it
    reserviert_pattern = r'(\{/\* RESERVIERT Badge \*/\}[\s\S]*?</div>\s*\)\})'
    
    top_badge = '''
                                                {/* TOP Badge - positioned below RESERVIERT if it exists */}
                                                {listing.is_top && (
                                                    <div className={`absolute ${listing?.reserved_by ? 'top-14' : 'top-3'} left-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-lg z-10`}>
                                                        ⭐ TOP
                                                    </div>
                                                )}'''
    
    content = re.sub(reserviert_pattern, r'\1' + top_badge, content)
    
    return content

def fix_badge_z_index(content):
    """Fix z-index values for badges."""
    
    # RESERVIERT badge should have z-20
    content = re.sub(
        r'(RESERVIERT.*?className="[^"]*?)(")',
        lambda m: m.group(1) + ' z-20' + m.group(2) if 'z-' not in m.group(1) else m.group(0),
        content
    )
    
    # Favorite button should have z-30
    content = re.sub(
        r'(favorite.*?className="[^"]*?)(")',
        lambda m: m.group(1) + ' z-30' + m.group(2) if 'z-' not in m.group(1) and 'absolute' in m.group(1) else m.group(0),
        content,
        flags=re.IGNORECASE
    )
    
    return content

def migrate_page(filepath):
    """Migrate a single page to Supabase."""
    
    try:
        # Read file
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        
        # Apply migrations
        content = migrate_fetch_to_supabase(content, os.path.basename(filepath))
        content = fix_field_names(content)
        content = add_top_badge_if_missing(content)
        content = fix_badge_z_index(content)
        
        # Only write if content changed
        if content != original_content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            return True
        
        return False
        
    except Exception as e:
        print(f"Error migrating {filepath}: {e}")
        return False

def main():
    """Main migration function."""
    
    print("🔍 Finding pages with old backend API...")
    pages = find_pages_with_old_api()
    
    print(f"\n📋 Found {len(pages)} pages to migrate:")
    for page in pages[:10]:  # Show first 10
        print(f"  - {os.path.basename(page)}")
    if len(pages) > 10:
        print(f"  ... and {len(pages) - 10} more")
    
    print(f"\n🚀 Starting migration...")
    
    migrated = 0
    failed = 0
    
    for page in pages:
        basename = os.path.basename(page)
        if migrate_page(page):
            print(f"  ✅ {basename}")
            migrated += 1
        else:
            print(f"  ⚠️  {basename} (no changes or failed)")
            failed += 1
    
    print(f"\n✨ Migration complete!")
    print(f"  ✅ Migrated: {migrated}")
    print(f"  ⚠️  Skipped/Failed: {failed}")
    print(f"\n💡 Note: Please review the changes and test the pages.")

if __name__ == '__main__':
    main()
