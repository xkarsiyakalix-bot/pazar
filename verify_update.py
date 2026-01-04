import os
from supabase import create_client
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

# Get the specific listing
listing_id = "ee074493-d362-4dd9-9421-f78723b1cc31"
print(f"Checking listing {listing_id}...\n")

result = supabase.table("listings").select("*").eq("id", listing_id).execute()

if result.data:
    listing = result.data[0]
    print(f"Title: {listing['title']}")
    print(f"Category: '{listing.get('category', 'NULL')}'")
    print(f"Sub-category: '{listing.get('sub_category', 'NULL')}'")
    print(f"Created: {listing['created_at']}")
    
    # Try updating again with explicit values
    print("\n\nAttempting update again...")
    update_result = supabase.table("listings").update({
        "category": "Mahalle Yardımı",
        "sub_category": "Mahalle Yardımı"
    }).eq("id", listing_id).execute()
    
    if update_result.data:
        print("✅ Update successful!")
        print(f"New Category: '{update_result.data[0]['category']}'")
        print(f"New Sub-category: '{update_result.data[0]['sub_category']}'")
    else:
        print("❌ Update failed")
        print(f"Error: {update_result}")
else:
    print("Listing not found!")
