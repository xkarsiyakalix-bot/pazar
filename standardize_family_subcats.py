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

updates = [
    ('Bebek Bakıcısı & Kreş', 'Babysitter & Çocuk Bakımı'),
    ('Oyuncak', 'Oyuncaklar')
]

for old, new in updates:
    print(f"Updating '{old}' to '{new}'...")
    try:
        response = supabase.table("listings").update({"sub_category": new}).eq("sub_category", old).eq("category", "Aile, Çocuk & Bebek").execute()
        print(f"  Updated {len(response.data) if response.data else 0} listings")
    except Exception as e:
        print(f"  Error: {e}")

print("\nUpdate complete!")
