import os
from supabase import create_client, Client

url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_KEY")
supabase: Client = create_client(url, key)

if not url or not key:
    print("Error: SUPABASE_URL or SUPABASE_KEY not set")
    exit(1)

target_id = '8953b5bc-c93c-4892-89a4-9fed59658a7f'

try:
    response = supabase.table('listings').select('*').eq('id', target_id).execute()
    if response.data:
        listing = response.data[0]
        # Print non-null keys to find the relevant 'art' field
        for k, v in listing.items():
            if v is not None:
                print(f"{k}: {v}")
    else:
        print("Listing not found")

except Exception as e:
    print(f"An error occurred: {e}")
