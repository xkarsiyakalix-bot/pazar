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
    # Check spielzeug_art values for Oyuncak/Oyuncaklar subcategory
    print("Checking spielzeug_art values...")
    response = supabase.table("listings").select("spielzeug_art").in_("sub_category", ["Oyuncak", "Oyuncaklar", "Spielzeug"]).execute()
    
    values = {}
    for item in response.data:
        val = item.get("spielzeug_art")
        key = str(val)
        values[key] = values.get(key, 0) + 1
            
    print("spielzeug_art distribution:")
    print(json.dumps(values, indent=2, ensure_ascii=False))

except Exception as e:
    print(f"Error: {e}")
