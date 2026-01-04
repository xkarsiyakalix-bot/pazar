
import os
from supabase import create_client

# Hardcoded credentials to avoid .env issues
url = "https://akyxtjqgvrzzbfogsdnd.supabase.co"
key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFreXh0anFndnJ6emJmb2dzZG5kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY1NzAxNDcsImV4cCI6MjA4MjE0NjE0N30.vcSCQVRNsgW0Jw_dMT7kWucBgYa9qTDGQTqI7jTa-Tw"

supabase = create_client(url, key)

try:
    with open('/Volumes/Kerem Aydin/Projeler/Kleinanzegen/12.12.2025/insert_pet_care_subcategory.sql', 'r') as f:
        sql = f.read()

    # Using rpc 'exec_sql' if available or just raw query via a helper function if you had one.
    # Since I don't have a direct 'exec_sql' RPC exposed usually, this might fail if I try to run raw SQL via client.
    # However, I can try to use the 'pg' library or similar if installed, OR check if there is an RPC for this.
    # Given the previous context, 'supabase_server.py' is running, maybe I can use that? 
    # But for now, let's assume I need to run this on the server or via a migration tool.
    # Wait, the previous `fetch_hizmetler_subcats.py` used `supabase.table().select()` which worked.
    # Inserting requires write access. The previous check showed I might only have ANON key.
    
    # If I only have ANON key, I might NOT be able to insert if RLS forbids it.
    # Check if I can insert into 'subcategories'.
    
    # Actually, let's try to just insert using the TABLE interface which is safer than raw SQL if I don't have an RPC.
    
    # First get category ID
    res = supabase.table('categories').select('id').eq('name', 'Hizmetler').single().execute()
    if not res.data:
        print("Category 'Hizmetler' not found")
        exit(1)
        
    cat_id = res.data['id']
    print(f"Found Category ID: {cat_id}")
    
    # Check if exists
    existing = supabase.table('subcategories').select('id').eq('slug', 'Hayvan-Bakimi-Egitimi').eq('category_id', cat_id).execute()
    if existing.data:
        print("Subcategory already exists.")
    else:
        new_sub = {
            "category_id": cat_id,
            "name": "Evcil Hayvan Bakımı & Eğitim",
            "slug": "Hayvan-Bakimi-Egitimi",
            "display_order": 8
        }
        insert_res = supabase.table('subcategories').insert(new_sub).execute()
        print("Inserted subcategory:", insert_res.data)

except Exception as e:
    print(f"Error: {e}")
