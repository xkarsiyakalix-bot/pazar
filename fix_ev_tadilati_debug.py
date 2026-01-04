import os
from supabase import create_client, Client

url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_KEY")
supabase: Client = create_client(url, key)

if not url or not key:
    print("Error: SUPABASE_URL or SUPABASE_KEY not set")
    exit(1)

target_id = '647557b1-1bd5-461e-8842-d2154b1738d7'

try:
    # 1. Inspect
    response = supabase.table('listings').select('id, sub_category').eq('id', target_id).execute()
    if response.data:
        val = response.data[0]['sub_category']
        print(f"Current Value: '{val}'")
        print(f"Hex: {val.encode('utf-8').hex()}")
        
        target_val = 'Yapı Market & Tadilat'
        print(f"Target Value: '{target_val}'")
        print(f"Target Hex: {target_val.encode('utf-8').hex()}")

        # 2. Update directly by ID
        update_response = supabase.table('listings').update({'sub_category': 'Ev Tadilatı'}).eq('id', target_id).execute()
        print(f"Update by ID Result: {len(update_response.data)}")

        # 3. Try to update others with like
        update_all = supabase.table('listings').update({'sub_category': 'Ev Tadilatı'}).ilike('sub_category', '%Yapı Market & Tadilat%').neq('sub_category', 'Ev Tadilatı').execute()
        print(f"Update ALL Result: {len(update_all.data)}")

    else:
        print("Listing not found")

except Exception as e:
    print(f"An error occurred: {e}")
