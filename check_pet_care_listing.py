from supabase import create_client, Client
import os
from dotenv import load_dotenv

load_dotenv(dotenv_path='app/backend/.env')

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    print("Error: SUPABASE_URL or SUPABASE_KEY not found in .env")
    exit(1)

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

listing_id = "e196ad1d-5db0-4577-80b7-aa002998d86b"

print(f"Checking listing: {listing_id}")
try:
    response = supabase.table("listings").select("category, sub_category").eq("id", listing_id).single().execute()
    if response.data:
        print(f"Category: {response.data.get('category')}")
        print(f"SubCategory: {response.data.get('sub_category')}")
    else:
        print("No listing found")
except Exception as e:
    print(f"Error: {e}")
