import os
from supabase import create_client
from dotenv import load_dotenv

load_dotenv()
url = os.getenv('SUPABASE_URL')
key = os.getenv('SUPABASE_KEY')
supabase = create_client(url, key)

res = supabase.table('listings').select('*').limit(1).execute()
if res.data:
    print("Columns:", res.data[0].keys())
    # Also check distinct statuses
    res_status = supabase.table('listings').select('status').execute()
    statuses = set(item['status'] for item in res_status.data if 'status' in item)
    print("Statuses in DB:", statuses)
    
    # Check is_active column if exists
    if 'is_active' in res.data[0]:
        res_active = supabase.table('listings').select('is_active').execute()
        active_vals = set(item['is_active'] for item in res_active.data)
        print("is_active values in DB:", active_vals)
else:
    print("No data in listings table")
