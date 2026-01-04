from supabase import create_client
import os
from dotenv import load_dotenv
import collections

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

print("Checking Bicycle listings...")

# Check for subcategory patterns
response = supabase.table("listings").select("id, sub_category, bike_art, art_type, bike_type").eq("category", "Otomobil, Bisiklet & Tekne").ilike("sub_category", "%Bisiklet%").execute()

print(f"Found {len(response.data)} listings for Bisiklet subcategory.")

bike_art_counts = collections.Counter()
art_type_counts = collections.Counter()
bike_type_counts = collections.Counter()

for item in response.data:
    bike_art_counts[str(item.get('bike_art'))] += 1
    art_type_counts[str(item.get('art_type'))] += 1
    bike_type_counts[str(item.get('bike_type'))] += 1

print("\nbike_art values:")
for k, v in bike_art_counts.items():
    print(f"  - '{k}': {v}")

print("\nart_type values:")
for k, v in art_type_counts.items():
    print(f"  - '{k}': {v}")

print("\nbike_type values:")
for k, v in bike_type_counts.items():
    print(f"  - '{k}': {v}")
