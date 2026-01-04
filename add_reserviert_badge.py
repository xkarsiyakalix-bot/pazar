#!/usr/bin/env python3
"""
Add RESERVIERT badge to all category pages
This script updates all *Page.js files to include the RESERVIERT badge
"""

import os
import re
from pathlib import Path

# Badge code to insert
RESERVIERT_BADGE = '''                                                    {/* RESERVIERT Badge */}
                                                    {listing?.reserved_by && listing?.reserved_until && new Date(listing.reserved_until) > new Date() && (
                                                        <div className="absolute top-3 left-3 bg-yellow-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-lg flex items-center gap-1 z-20">
                                                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                                            </svg>
                                                            RESERVIERT
                                                        </div>
                                                    )}'''

def add_reserviert_badge(file_path):
    """Add RESERVIERT badge to a page file if not already present"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Skip if already has RESERVIERT badge
        if 'RESERVIERT Badge' in content or 'RESERVIERT' in content:
            return False, "Already has RESERVIERT badge"
        
        # Pattern to find image section with favorite button
        # Look for the pattern: <img ... /> followed by {/* Favorite Icon */}
        pattern = r'(<img\s+[^>]*?className="[^"]*object-cover[^"]*"[^>]*?/>)\s*(\{/\* Favorite Icon \*/\})'
        
        if re.search(pattern, content):
            # Insert RESERVIERT badge between image and favorite button
            new_content = re.sub(
                pattern,
                r'\1\n' + RESERVIERT_BADGE + r'\n                                                    \2',
                content
            )
            
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(new_content)
            
            return True, "Added RESERVIERT badge"
        else:
            return False, "Pattern not found"
            
    except Exception as e:
        return False, f"Error: {str(e)}"

def main():
    """Process all *Page.js files"""
    frontend_src = Path('/Volumes/Kerem Aydin/Projeler/Kleinanzegen/24.11.2025/app/frontend/src')
    
    # Find all *Page.js files
    page_files = list(frontend_src.glob('*Page.js'))
    
    print(f"\n🔍 Found {len(page_files)} page files\n")
    
    updated = 0
    skipped = 0
    errors = 0
    
    for page_file in sorted(page_files):
        success, message = add_reserviert_badge(page_file)
        
        if success:
            print(f"✅ {page_file.name}: {message}")
            updated += 1
        elif "Already has" in message:
            skipped += 1
        else:
            print(f"⚠️  {page_file.name}: {message}")
            errors += 1
    
    print(f"\n📊 Summary:")
    print(f"   Updated: {updated}")
    print(f"   Skipped (already has badge): {skipped}")
    print(f"   Errors/Pattern not found: {errors}")
    print(f"   Total: {len(page_files)}")

if __name__ == "__main__":
    main()
