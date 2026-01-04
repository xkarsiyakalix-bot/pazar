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

CATEGORY = "Aile, Çocuk & Bebek"
SUBCATEGORY = "Bebek & Çocuk Giyimi"

print(f"Checking types for {CATEGORY} > {SUBCATEGORY}...")

response = supabase.table("listings").select("offer_type, seller_type").eq("category", CATEGORY).eq("sub_category", SUBCATEGORY).execute()

o_counts = {}
s_counts = {}

for item in response.data:
    o = item.get("offer_type")
    s = item.get("seller_type")
    
    o_counts[str(o)] = o_counts.get(str(o), 0) + 1
    s_counts[str(s)] = s_counts.get(str(s), 0) + 1

print("\nOffer Type:")
for k, v in o_counts.items():
    print(f"  '{k}': {v}")

print("\nSeller Type:")
for k, v in s_counts.items():
    print(f"  '{k}': {v}")
