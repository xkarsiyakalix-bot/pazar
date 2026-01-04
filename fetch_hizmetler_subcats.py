
import os
from supabase import create_client

url = "https://akyxtjqgvrzzbfogsdnd.supabase.co"
key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFreXh0anFndnJ6emJmb2dzZG5kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY1NzAxNDcsImV4cCI6MjA4MjE0NjE0N30.vcSCQVRNsgW0Jw_dMT7kWucBgYa9qTDGQTqI7jTa-Tw"
supabase = create_client(url, key)

try:
    with open('/Volumes/Kerem Aydin/Projeler/Kleinanzegen/12.12.2025/check_hizmetler_subcats.sql', 'r') as f:
        sql = f.read()

    # We can't execute raw SQL directly with this client usually, but let's try RPC or listing fetch.
    # Actually, let's just use the query builder since it's simpler and safer here.
    
    response = supabase.table('subcategories').select('name, slug, category:categories!inner(name)').eq('category.name', 'Hizmetler').execute()
    
    print("Subcategories for Hizmetler:")
    for item in response.data:
        print(f"- Name: {item['name']}, Slug: {item['slug']}")

except Exception as e:
    print(f"Error: {e}")
