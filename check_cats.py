import os
from supabase import create_client, Client

url = os.environ.get("SUPABASE_URL")
key = os.environ.get("SUPABASE_KEY")
supabase: Client = create_client(url, key)

response = supabase.table("listings").select("category").execute()
categories = set()
for listing in response.data:
    categories.add(listing.get('category'))

print("Unique Categories:")
for cat in sorted(list(categories)):
    print(f"- {cat}")

response = supabase.table("listings").select("category, sub_category").execute()
sub_cats = set()
for listing in response.data:
    if listing.get('sub_category'):
        sub_cats.add(f"{listing.get('category')} -> {listing.get('sub_category')}")

print("\nUnique SubCategories:")
for sc in sorted(list(sub_cats)):
    print(f"- {sc}")
