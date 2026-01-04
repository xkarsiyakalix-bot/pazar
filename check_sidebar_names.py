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
    # Get all subcategories in database
    response = supabase.table("listings").select("sub_category").eq("category", "Aile, Çocuk & Bebek").execute()
    
    db_subcats = {}
    for item in response.data:
        sub = item.get("sub_category")
        if sub:
            db_subcats[sub] = db_subcats.get(sub, 0) + 1
    
    print("Current database subcategories:")
    for sub, count in sorted(db_subcats.items()):
        print(f"  '{sub}': {count}")
    
    print("\n\nSidebar expects:")
    print("  'Oto Koltukları'")
    print("  'Çocuk Odası Mobilyaları'")
    
    print("\n\nDatabase has:")
    for sub in db_subcats.keys():
        if 'Oto' in sub or 'Koltu' in sub:
            print(f"  '{sub}'")
        if 'Odası' in sub or 'Mobilya' in sub:
            print(f"  '{sub}'")

except Exception as e:
    print(f"Error: {e}")
