from supabase import create_client, Client
import os
from dotenv import load_dotenv
import json

load_dotenv(dotenv_path='app/backend/.env')

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    print("Error: SUPABASE_URL or SUPABASE_KEY not found in .env")
    exit(1)

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

listing_id = "6747334d-2666-4688-9783-b6e4858b3493"

print(f"Checking listing: {listing_id}")
try:
    response = supabase.table("listings").select("*").eq("id", listing_id).single().execute()
    if response.data:
        print("Listing Data Found:")
        data = response.data
        print(f"Category: {data.get('category')}")
        print(f"SubCategory: {data.get('sub_category')}")
    else:
        print("No listing data found for this ID.")
except Exception as e:
    print(f"Error: {e}")
