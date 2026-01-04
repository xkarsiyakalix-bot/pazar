import os
from supabase import create_client, Client

url = os.environ.get("SUPABASE_URL")
key = os.environ.get("SUPABASE_KEY")
supabase: Client = create_client(url, key)

response = supabase.table("listings").select("id, category, sub_category, created_at, status").execute()
for listing in response.data:
    print(f"ID: {listing.get('id')}, Category: {listing.get('category')}, Sub: {listing.get('sub_category')}, Created: {listing.get('created_at')}, Status: {listing.get('status')}")
