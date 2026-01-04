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

print("Checking subcategories...")
res = supabase.table("listings").select("sub_category").eq("category", CATEGORY).in_("sub_category", ["Bebek Gereçleri", "Bebek Ekipmanları"]).execute()

counts = {}
for item in res.data:
    sc = item.get("sub_category")
    counts[sc] = counts.get(sc, 0) + 1

print("Subcategory Counts:")
for k, v in counts.items():
    print(f"  '{k}': {v}")
