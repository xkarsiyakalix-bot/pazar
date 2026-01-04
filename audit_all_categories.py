
import os
from supabase import create_client
from collections import defaultdict

url = "https://akyxtjqgvrzzbfogsdnd.supabase.co"
key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFreXh0anFndnJ6emJmb2dzZG5kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY1NzAxNDcsImV4cCI6MjA4MjE0NjE0N30.vcSCQVRNsgW0Jw_dMT7kWucBgYa9qTDGQTqI7jTa-Tw"
supabase = create_client(url, key)

try:
    response = supabase.table('listings').select('category, sub_category').execute()
    
    # Group by category
    categories = defaultdict(set)
    for listing in response.data:
        cat = listing['category']
        sub = listing['sub_category']
        if cat and sub:
            categories[cat].add(sub)
    
    print("=== ALL CATEGORY/SUBCATEGORY COMBINATIONS IN DATABASE ===\n")
    for cat in sorted(categories.keys()):
        print(f"\n{cat}:")
        for sub in sorted(categories[cat]):
            print(f"  - {sub}")

except Exception as e:
    print(f"Error: {e}")
