
import os
from supabase import create_client

url = "https://akyxtjqgvrzzbfogsdnd.supabase.co"
key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFreXh0anFndnJ6emJmb2dzZG5kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY1NzAxNDcsImV4cCI6MjA4MjE0NjE0N30.vcSCQVRNsgW0Jw_dMT7kWucBgYa9qTDGQTqI7jTa-Tw"
supabase = create_client(url, key)

try:
    response = supabase.table('listings').select('sub_category').eq('category', 'Biletler').execute()
    
    subcats = set()
    for listing in response.data:
        if listing['sub_category']:
            subcats.add(listing['sub_category'])
    
    print("All Biletler subcategories in database:")
    for sub in sorted(subcats):
        print(f"  - {sub}")

except Exception as e:
    print(f"Error: {e}")
