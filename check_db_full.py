import os
from supabase import create_client, Client

url = os.environ.get("SUPABASE_URL")
key = os.environ.get("SUPABASE_KEY")
supabase: Client = create_client(url, key)

print("--- Listings Stats ---")
response = supabase.table("listings").select("id", count="exact").execute()
print(f"Total Listings: {response.count}")

response = supabase.table("listings").select("category").execute()
categories = {}
for listing in response.data:
    cat = listing.get('category')
    categories[cat] = categories.get(cat, 0) + 1

print("\nListing counts by category:")
for cat, count in categories.items():
    print(f"- {cat}: {count}")

print("\n--- Categories Table ---")
try:
    response = supabase.table("categories").select("name, slug").execute()
    for cat in response.data:
        print(f"- {cat.get('name')} ({cat.get('slug')})")
except Exception as e:
    print(f"Error reading categories table: {e}")

print("\n--- SubCategories Table ---")
try:
    response = supabase.table("subcategories").select("name, slug, category_id").execute()
    for sc in response.data:
        print(f"- {sc.get('name')} ({sc.get('slug')})")
except Exception as e:
    print(f"Error reading subcategories table: {e}")
