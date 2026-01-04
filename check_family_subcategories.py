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
    # Check distinct subcategories for 'Aile, Çocuk & Bebek'
    response = supabase.table("listings").select("sub_category").eq("category", "Aile, Çocuk & Bebek").execute()
    values = {}
    for item in response.data:
        val = item.get("sub_category")
        if val:
            values[val] = values.get(val, 0) + 1
            
    print("Subcategories in 'Aile, Çocuk & Bebek':")
    print(json.dumps(values, indent=2))

except Exception as e:
    print(f"Error: {e}")
