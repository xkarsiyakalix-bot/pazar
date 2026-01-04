from supabase import create_client
import os
from dotenv import load_dotenv
import collections

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

print("Checking Karavan listings...")

# 1. Check count of listings in category
response = supabase.table("listings").select("id, sub_category, wohnwagen_art").eq("category", "Otomobil, Bisiklet & Tekne").ilike("sub_category", "%Karavan%").execute()

print(f"Found {len(response.data)} listings for Karavan subcategory.")

art_counts = collections.Counter()
subcats = collections.Counter()

for item in response.data:
    subcats[item['sub_category']] += 1
    art_val = item.get('wohnwagen_art', 'NULL')
    art_counts[art_val] += 1

print("\nSubcategories Found:")
for sc, count in subcats.items():
    print(f"  - '{sc}': {count}")

print("\nWohnwagen Art Values Found:")
for k, v in art_counts.items():
    print(f"  - '{k}': {v}")
