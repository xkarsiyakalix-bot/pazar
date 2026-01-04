import os
from supabase import create_client, Client

url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_KEY")
supabase: Client = create_client(url, key)

if not url or not key:
    print("Error: SUPABASE_URL or SUPABASE_KEY not set")
    exit(1)

try:
    # Check recent listings in 'Ev & Bahçe' to see what the user just added
    response = supabase.table('listings').select('id, title, category, sub_category, created_at').eq('category', 'Ev & Bahçe').order('created_at', desc=True).limit(5).execute()
    print("Recent 'Ev & Bahçe' listings:")
    for item in response.data:
        print(item)

except Exception as e:
    print(f"An error occurred: {e}")
