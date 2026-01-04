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
    # Check distinct kinderzimmermobel_art values
    # We check specifically for the subcategory 'Bebek Odası Mobilyaları'
    # Also check 'Çocuk Odası Mobilyaları' just in case of mix ups
    response = supabase.table("listings").select("kinderzimmermobel_art").in_("sub_category", ["Bebek Odası Mobilyaları", "Çocuk Odası Mobilyaları"]).execute()
    
    values = {}
    for item in response.data:
        val = item.get("kinderzimmermobel_art")
        # key as string to handle None
        key = str(val)
        values[key] = values.get(key, 0) + 1
            
    print("kinderzimmermobel_art values distribution:")
    print(json.dumps(values, indent=2))

except Exception as e:
    print(f"Error: {e}")
