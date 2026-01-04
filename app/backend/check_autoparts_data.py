from supabase import create_client
import os
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

print("Checking Auto Parts listings...")
response = supabase.table("listings").select("id, autoteile_art").eq("category", "Otomobil, Bisiklet & Tekne").ilike("sub_category", "%Oto Parça%").execute()

if not response.data:
    print("No auto parts listings found.")
else:
    print(f"Found {len(response.data)} listings:")
    for item in response.data:
        print(f"  ID: {item['id'][:8]}... | autoteile_art: '{item.get('autoteile_art')}'")
