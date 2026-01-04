import os
from supabase import create_client
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

# Update the listing from "Komşu Yardımı" to "Mahalle Yardımı"
listing_id = "ee074493-d362-4dd9-9421-f78723b1cc31"

print(f"Updating listing {listing_id}...")
print("From: Komşu Yardımı -> Komşu Yardımı")
print("To: Mahalle Yardımı -> Mahalle Yardımı")

result = supabase.table("listings").update({
    "category": "Mahalle Yardımı",
    "sub_category": "Mahalle Yardımı"
}).eq("id", listing_id).execute()

if result.data:
    print("\n✅ Listing updated successfully!")
    print(f"Category: {result.data[0]['category']}")
    print(f"Sub-category: {result.data[0]['sub_category']}")
else:
    print("\n❌ Failed to update listing")

# Also update any other listings with "Komşu Yardımı"
print("\n\nChecking for other 'Komşu Yardımı' listings...")
other_listings = supabase.table("listings").select("id, title").or_(
    "category.eq.Komşu Yardımı,sub_category.eq.Komşu Yardımı"
).execute()

if other_listings.data:
    print(f"Found {len(other_listings.data)} more listings to update:")
    for listing in other_listings.data:
        print(f"  - {listing['title']} ({listing['id']})")
        supabase.table("listings").update({
            "category": "Mahalle Yardımı",
            "sub_category": "Mahalle Yardımı"
        }).eq("id", listing['id']).execute()
    print("✅ All listings updated!")
else:
    print("No other listings found.")
