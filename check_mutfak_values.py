import os
from supabase import create_client, Client

url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_KEY")
supabase: Client = create_client(url, key)

if not url or not key:
    print("Error: SUPABASE_URL or SUPABASE_KEY not set")
    exit(1)

try:
    response = supabase.table('listings').select('id, kueche_esszimmer_art').eq('sub_category', 'Mutfak & Yemek Odası').execute()
    print(f"Total listings: {len(response.data)}")
    
    values = {}
    for item in response.data:
        v = item.get('kueche_esszimmer_art')
        if v:
            values[v] = values.get(v, 0) + 1
            
    print("Values distribution:")
    for k, v in values.items():
        print(f"'{k}': {v}")

except Exception as e:
    print(f"An error occurred: {e}")
