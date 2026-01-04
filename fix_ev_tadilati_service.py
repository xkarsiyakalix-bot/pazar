import os
from supabase import create_client, Client

# Try to find a service role key
url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_SERVICE_ROLE_KEY") or os.environ.get("SUPABASE_SERVICE_KEY") or os.environ.get("SUPABASE_KEY")

print(f"Using key starting with: {key[:5]}...")

supabase: Client = create_client(url, key)

if not url or not key:
    print("Error: SUPABASE_URL or Key not found")
    exit(1)

target_id = '647557b1-1bd5-461e-8842-d2154b1738d7'

try:
    # Attempt update again
    print("Attempting update with selected key...")
    update_response = supabase.table('listings').update({'sub_category': 'Ev Tadilatı'}).eq('id', target_id).execute()
    print(f"Update by ID Result: {len(update_response.data)}")
    if update_response.data:
         print("Success! Row updated.")

except Exception as e:
    print(f"An error occurred: {e}")
