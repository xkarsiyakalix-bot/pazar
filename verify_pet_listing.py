
import os
from supabase import create_client

url = "https://akyxtjqgvrzzbfogsdnd.supabase.co"
key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFreXh0anFndnJ6emJmb2dzZG5kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY1NzAxNDcsImV4cCI6MjA4MjE0NjE0N30.vcSCQVRNsgW0Jw_dMT7kWucBgYa9qTDGQTqI7jTa-Tw"
supabase = create_client(url, key)

try:
    # Check listings in Hizmetler category
    response = supabase.table('listings').select('id, title, category, sub_category').eq('category', 'Hizmetler').execute()
    
    print(f"Found {len(response.data)} listings in 'Hizmetler' category:")
    for listing in response.data:
        print(f"  - {listing['title']}")
        print(f"    Category: '{listing['category']}'")
        print(f"    Sub-category: '{listing['sub_category']}'")
        print()

except Exception as e:
    print(f"Error: {e}")
