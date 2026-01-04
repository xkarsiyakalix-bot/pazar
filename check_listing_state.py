import os
from supabase import create_client
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

# Check the current state of the listing
listing_id = "ee074493-d362-4dd9-9421-f78723b1cc31"
result = supabase.table("listings").select("id, title, category, sub_category").eq("id", listing_id).execute()

if result.data:
    listing = result.data[0]
    print(f"Current listing state:")
    print(f"  Title: {listing['title']}")
    print(f"  Category: {listing['category']}")
    print(f"  Sub-category: {listing['sub_category']}")
else:
    print("Listing not found!")

# Check all listings with Komşu Yardımı
print("\n\nAll 'Komşu Yardımı' listings:")
komsu_listings = supabase.table("listings").select("id, title, category, sub_category").or_(
    "category.eq.Komşu Yardımı,sub_category.eq.Komşu Yardımı"
).execute()

print(f"Found {len(komsu_listings.data)} listings")
for listing in komsu_listings.data:
    print(f"  - {listing['title']}: {listing['category']} / {listing['sub_category']}")
