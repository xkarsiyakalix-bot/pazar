import os
from dotenv import load_dotenv
from supabase import create_client

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

if not SUPABASE_URL:
    print("SUPABASE_URL not found in env")
    exit(1)

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

print("Checking 'seller_type' for ALL 'İş İlanları'...")
response = supabase.table("listings").select("seller_type").eq("category", "İş İlanları").execute()
counts = {}
for item in response.data:
    val = item.get("seller_type")
    # Normalize for counting
    if val:
        val = val.strip()
    counts[str(val)] = counts.get(str(val), 0) + 1

print("Seller Type Distribution:")
for k, v in counts.items():
    print(f"  '{k}': {v}")
