import os
import re
from supabase import create_client, Client

# Configuration
URL = "https://akyxtjqgvrzzbfogsdnd.supabase.co"
KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFreXh0anFndnJ6emJmb2dzZG5kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY1NzAxNDcsImV4cCI6MjA4MjE0NjE0N30.vcSCQVRNsgW0Jw_dMT7kWucBgYa9qTDGQTqI7jTa-Tw"

supabase: Client = create_client(URL, KEY)

SQL_FILE_PATH = "../../normalize_categories.sql"

def verify():
    if not os.path.exists(SQL_FILE_PATH):
        print(f"Error: File not found at {SQL_FILE_PATH}")
        return

    with open(SQL_FILE_PATH, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    bad_categories = []
    bad_subcategories = []

    for line in lines:
        line = line.strip()
        if not line or line.startswith('--'):
            continue

        # Regex for UPDATE listings SET col = 'val' WHERE col IN ('v1', 'v2')
        match = re.search(r"UPDATE listings SET (\w+) = '([^']+)' WHERE (\w+) IN \((.+)\);", line)
        if match:
            filter_col = match.group(3)
            in_values_str = match.group(4)
            in_values = [v.strip().strip("'") for v in in_values_str.split(',')]
            
            if filter_col == 'category':
                bad_categories.extend(in_values)
            elif filter_col == 'sub_category':
                bad_subcategories.extend(in_values)

    print("Verifying normalization...")
    
    issues_found = False
    
    if bad_categories:
        # Check for bad categories
        # Note: 'in_' with a large list might hit URL length limits, so chunking might be needed if list is huge.
        # But here it's small enough.
        response = supabase.table("listings").select("id, title, category").in_("category", bad_categories).execute()
        if response.data:
            print(f"FOUND {len(response.data)} listings with old CATEGORY names:")
            for item in response.data:
                print(f" - ID: {item['id']}, Category: {item['category']}")
            issues_found = True
        else:
            print("No listings found with old CATEGORY names.")

    if bad_subcategories:
        # Check for bad subcategories
        response = supabase.table("listings").select("id, title, sub_category").in_("sub_category", bad_subcategories).execute()
        if response.data:
            print(f"FOUND {len(response.data)} listings with old SUB_CATEGORY names:")
            for item in response.data:
                print(f" - ID: {item['id']}, SubCategory: {item['sub_category']}")
            issues_found = True
        else:
            print("No listings found with old SUB_CATEGORY names.")

    if not issues_found:
        print("SUCCESS: All categories and subcategories appear normalized.")

if __name__ == "__main__":
    verify()
