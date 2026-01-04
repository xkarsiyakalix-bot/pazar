import os
from dotenv import load_dotenv
from supabase import create_client

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

if not SUPABASE_URL:
    print("SUPABASE_URL not found")
    exit(1)

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

# SQL to execute
sql = """
UPDATE listings
SET sub_category = 'Bebek Ekipmanları'
WHERE sub_category = 'Bebek Gereçleri'
  AND category = 'Aile, Çocuk & Bebek';
"""

print("Executing SQL...")
# There isn't a direct 'query' or 'execute' method exposed easily for raw SQL in the client depending on version, 
# but we can try rpc if we had one, or just update using table builder.
# Let's use table builder for safety and standard API.

# Check count first
res = supabase.table("listings").select("count", count="exact").eq("sub_category", "Bebek Gereçleri").execute()
print(f"Found {res.count} listings to update.")

if res.count > 0:
    data = {"sub_category": "Bebek Ekipmanları"}
    update_res = supabase.table("listings").update(data).eq("sub_category", "Bebek Gereçleri").execute()
    print("Update executed.")
else:
    print("No listings to update.")

# Verify
res_new = supabase.table("listings").select("count", count="exact").eq("sub_category", "Bebek Ekipmanları").execute()
print(f"Listings with new name: {res_new.count}")
