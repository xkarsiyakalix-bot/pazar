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

listing_id = "98fd3675-0163-4c93-9a81-318bedc7c31a"

print(f"Checking listing: {listing_id}")
try:
    response = supabase.table("listings").select("*").eq("id", listing_id).single().execute()
    if response.data:
        print("Listing Data Found:")
        # Filter out very long fields like images or description if needed, or just print all nicely
        data = response.data
        # Print only keys and non-empty values
        filtered_data = {k: v for k, v in data.items() if v is not None and v != "" and v != []}
        print(json.dumps(filtered_data, indent=2))
    else:
        print("No listing data found for this ID.")
except Exception as e:
    print(f"Error: {e}")
