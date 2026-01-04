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

CATEGORY = "Aile, Çocuk & Bebek"
SUBCATEGORY = "Bebek Ekipmanları"

print(f"Checking data for {CATEGORY} > {SUBCATEGORY}...")

def check_field(field_name):
    print(f"\n--- {field_name} ---")
    res = supabase.table("listings") \
        .select(field_name) \
        .eq("category", CATEGORY) \
        .eq("sub_category", SUBCATEGORY) \
        .execute()
    
    counts = {}
    for item in res.data:
        val = item.get(field_name)
        counts[val] = counts.get(val, 0) + 1
        
    for k, v in counts.items():
        print(f"  '{k}': {v}")

check_field("condition")
check_field("offer_type")
check_field("seller_type")
check_field("versand_art")
