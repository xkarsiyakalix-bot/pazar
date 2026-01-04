import os
from supabase import create_client, Client

url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_KEY")
supabase: Client = create_client(url, key)

if not url or not key:
    print("Error: SUPABASE_URL or SUPABASE_KEY not set")
    exit(1)

# Check for listings in 'Saat & Takı'
try:
    response = supabase.table('listings').select('title, uhren_schmuck_art').eq('category', 'Moda & Güzellik').eq('sub_category', 'Saat & Takı').limit(10).execute()
    print("Listings found:", len(response.data))
    for item in response.data:
        print(item)
        
    # Check distinct values if possible, or just infer from sample
    # (Supabase doesn't support distinct directly easily via js client usually without rpc, but python client might)
    # We will just print the unique values from the sample or a larger fetch
    
    response_all = supabase.table('listings').select('uhren_schmuck_art').eq('category', 'Moda & Güzellik').eq('sub_category', 'Saat & Takı').execute()
    values = set(item.get('uhren_schmuck_art') for item in response_all.data)
    print("\nDistinct uhren_schmuck_art values:", values)

except Exception as e:
    print(f"An error occurred: {e}")
