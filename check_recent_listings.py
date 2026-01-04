import os
from supabase import create_client
from dotenv import load_dotenv
from datetime import datetime, timedelta

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

# Get all recent listings (last 24 hours)
print("\n=== RECENT LISTINGS (Last 24 hours) ===")
yesterday = (datetime.now() - timedelta(days=1)).isoformat()
listings = supabase.table("listings").select("*").gte("created_at", yesterday).order("created_at", desc=True).limit(20).execute()

print(f"Found {len(listings.data)} recent listings\n")
for listing in listings.data:
    print(f"ID: {listing['id']}")
    print(f"Title: {listing['title']}")
    print(f"Category: {listing.get('category', 'N/A')}")
    print(f"Sub-category: {listing.get('sub_category', 'N/A')}")
    print(f"Created: {listing['created_at']}")
    print(f"User ID: {listing.get('user_id', 'N/A')}")
    print("-" * 70)

# Also check if there are any listings with "Nachbarschaftshilfe" or similar
print("\n=== CHECKING FOR GERMAN NAMES ===")
listings_de = supabase.table("listings").select("*").or_(
    "category.ilike.%nachbarschaft%,sub_category.ilike.%nachbarschaft%"
).execute()

print(f"Found {len(listings_de.data)} listings with 'nachbarschaft'\n")
for listing in listings_de.data:
    print(f"ID: {listing['id']}")
    print(f"Title: {listing['title']}")
    print(f"Category: {listing.get('category', 'N/A')}")
    print(f"Sub-category: {listing.get('sub_category', 'N/A')}")
    print("-" * 70)
