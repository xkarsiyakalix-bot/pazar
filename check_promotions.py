#!/usr/bin/env python3
import os
from dotenv import load_dotenv

load_dotenv()

url = os.getenv('SUPABASE_URL') or os.getenv('REACT_APP_SUPABASE_URL')
key = os.getenv('SUPABASE_SERVICE_KEY') or os.getenv('SUPABASE_SERVICE_ROLE_KEY') or os.getenv('REACT_APP_SUPABASE_ANON_KEY')

print(f"Connecting to: {url}")
print(f"Key prefix: {key[:30] if key else 'NOT FOUND'}...")

from supabase import create_client
supabase = create_client(url, key)

# 1. Count promotions (service role bypasses RLS)
print("\n=== PROMOTIONS COUNT ===")
result = supabase.table('promotions').select('*', count='exact').execute()
print(f"Total promotions in DB: {result.count}")
if result.data:
    print(f"Sample record: {result.data[0]}")

# 2. Check if there's any data
print("\n=== RECENT PROMOTIONS ===")
result2 = supabase.table('promotions').select('id, package_type, status, price, created_at').order('created_at', desc=True).limit(5).execute()
if result2.data:
    for p in result2.data:
        print(f"  - {p.get('package_type')} | {p.get('status')} | {p.get('price')} TL | {p.get('created_at')[:10]}")
else:
    print("  NO DATA FOUND IN PROMOTIONS TABLE!")

# 3. Check RLS policies
print("\n=== RLS POLICY CHECK (via pg_policies) ===")
# This requires service role with proper permissions
try:
    result3 = supabase.rpc('get_policies_info').execute()
    print(result3.data)
except Exception as e:
    print(f"RPC not available: {e}")
    print("Check policies manually in Supabase dashboard > Authentication > Policies > promotions")
