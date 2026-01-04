
import os
from supabase import create_client

url = "https://akyxtjqgvrzzbfogsdnd.supabase.co"
key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFreXh0anFndnJ6emJmb2dzZG5kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY1NzAxNDcsImV4cCI6MjA4MjE0NjE0N30.vcSCQVRNsgW0Jw_dMT7kWucBgYa9qTDGQTqI7jTa-Tw"
supabase = create_client(url, key)

try:
    # Get all Hizmetler listings
    response = supabase.table('listings').select('category, sub_category').eq('category', 'Hizmetler').execute()
    
    # Count by subcategory
    counts = {}
    for listing in response.data:
        sub = listing['sub_category']
        counts[sub] = counts.get(sub, 0) + 1
    
    print("Subcategory counts in 'Hizmetler':")
    for sub, count in sorted(counts.items()):
        print(f"  '{sub}': {count}")
    
    print(f"\nTotal: {len(response.data)} listings")

except Exception as e:
    print(f"Error: {e}")
