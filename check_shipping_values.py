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

try:
    # Check unique values for versand_art
    response = supabase.table("listings").select("versand_art").execute()
    values = {}
    for item in response.data:
        val = item.get("versand_art")
        if val:
            values[val] = values.get(val, 0) + 1
            
    print("Unique values in versand_art:")
    print(json.dumps(values, indent=2))

    # Also check what's in the specific category if possible
    response_cat = supabase.table("listings").select("versand_art").eq("sub_category", "Bebek Koltuğu & Oto Koltukları").execute()
    values_cat = {}
    for item in response_cat.data:
        val = item.get("versand_art")
        if val:
            values_cat[val] = values_cat.get(val, 0) + 1
            
    print("\nUnique values in 'Bebek Koltuğu & Oto Koltukları':")
    print(json.dumps(values_cat, indent=2))

except Exception as e:
    print(f"Error: {e}")
