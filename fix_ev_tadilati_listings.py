import os
from supabase import create_client, Client

url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_KEY")
supabase: Client = create_client(url, key)

if not url or not key:
    print("Error: SUPABASE_URL or SUPABASE_KEY not set")
    exit(1)

try:
    # Update 'Yapı Market & Tadilat' to 'Ev Tadilatı'
    response = supabase.table('listings').update({'sub_category': 'Ev Tadilatı'}).eq('sub_category', 'Yapı Market & Tadilat').execute()
    
    print(f"Updated listings. Count: {len(response.data) if response.data else 0}")
    if response.data:
        for item in response.data:
            print(f"Updated ID: {item.get('id')} to 'Ev Tadilatı'")

except Exception as e:
    print(f"An error occurred: {e}")
