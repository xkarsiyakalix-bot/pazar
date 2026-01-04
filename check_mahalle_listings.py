import os
from supabase import create_client
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

# Check for Mahalle Yardımı listings
print("\n=== MAHALLE YARDIMI LISTINGS ===")
listings = supabase.table("listings").select("*").or_(
    "category.eq.Mahalle Yardımı,sub_category.eq.Mahalle Yardımı"
).execute()

print(f"Found {len(listings.data)} listings")
for listing in listings.data:
    print(f"\nID: {listing['id']}")
    print(f"Title: {listing['title']}")
    print(f"Category: {listing['category']}")
    print(f"Sub-category: {listing['sub_category']}")
    print(f"Created: {listing['created_at']}")
    print("-" * 50)

# Also check for listings under "Eğlence, Hobi & Mahalle" with "Mahalle Yardımı" subcategory
print("\n=== EĞLENCE, HOBI & MAHALLE -> MAHALLE YARDIMI ===")
listings2 = supabase.table("listings").select("*").eq(
    "category", "Eğlence, Hobi & Mahalle"
).eq("sub_category", "Mahalle Yardımı").execute()

print(f"Found {len(listings2.data)} listings")
for listing in listings2.data:
    print(f"\nID: {listing['id']}")
    print(f"Title: {listing['title']}")
    print(f"Category: {listing['category']}")
    print(f"Sub-category: {listing['sub_category']}")
    print(f"Created: {listing['created_at']}")
    print("-" * 50)
