import os
from supabase import create_client, Client

url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_KEY")
supabase: Client = create_client(url, key)

if not url or not key:
    print("Error: SUPABASE_URL or SUPABASE_KEY not set")
    exit(1)

try:
    # Check listings in 'Bahçe Malzemeleri & Bitkiler'
    response = supabase.table('listings').select('title, gartenzubehoer_art').eq('category', 'Ev & Bahçe').eq('sub_category', 'Bahçe Malzemeleri & Bitkiler').limit(10).execute()
    print("Listings found:", len(response.data))
    for item in response.data:
        print(item)

except Exception as e:
    print(f"An error occurred: {e}")
