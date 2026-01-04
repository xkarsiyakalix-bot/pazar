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
    # Check pferde_art values
    response = supabase.table("listings").select("pferde_art").eq("sub_category", "Atlar").execute()
    
    values = {}
    for item in response.data:
        val = item.get("pferde_art")
        if val:
            values[val] = values.get(val, 0) + 1
            
    print("pferde_art values in database:")
    print(json.dumps(values, indent=2, ensure_ascii=False))
    
    # Update if needed
    if 'Atlar' in values:
        print("\nUpdating 'Atlar' to 'Büyük Atlar'...")
        response = supabase.table("listings").update({"pferde_art": "Büyük Atlar"}).eq("pferde_art", "Atlar").execute()
        print(f"Updated {len(response.data) if response.data else 0} listings")

except Exception as e:
    print(f"Error: {e}")
