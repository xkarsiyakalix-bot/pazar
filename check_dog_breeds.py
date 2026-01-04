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
    # Check hunde_art values
    response = supabase.table("listings").select("hunde_art").eq("sub_category", "Köpekler").execute()
    
    values = {}
    for item in response.data:
        val = item.get("hunde_art")
        if val:
            values[val] = values.get(val, 0) + 1
            
    print("hunde_art values in database:")
    print(json.dumps(values, indent=2, ensure_ascii=False))

except Exception as e:
    print(f"Error: {e}")
