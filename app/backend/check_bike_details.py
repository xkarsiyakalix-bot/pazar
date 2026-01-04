from supabase import create_client
import os
from dotenv import load_dotenv
import collections
import json

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

print("Checking ALL Bicycle listings...")

# Check for subcategory patterns
response = supabase.table("listings").select("id, title, sub_category, bike_art, bike_type, price, offer_type, seller_type, federal_state").eq("category", "Otomobil, Bisiklet & Tekne").ilike("sub_category", "%Bisiklet%").execute()

print(f"Found {len(response.data)} listings for Bisiklet subcategory.")

bike_art_counts = collections.Counter()
bike_type_counts = collections.Counter()
offer_type_counts = collections.Counter()
seller_type_counts = collections.Counter()

for item in response.data:
    bike_art = item.get('bike_art')
    bike_type = item.get('bike_type')
    
    bike_art_counts[str(bike_art)] += 1
    bike_type_counts[str(bike_type)] += 1
    offer_type_counts[str(item.get('offer_type'))] += 1
    seller_type_counts[str(item.get('seller_type'))] += 1
    
    print(f"Listing {item['id'][:8]}: Art='{bike_art}', Type='{bike_type}'")

print("\nbike_art DB stats:")
for k, v in bike_art_counts.items():
    print(f"  - '{k}': {v}")

print("\nbike_type DB stats:")
for k, v in bike_type_counts.items():
    print(f"  - '{k}': {v}")
