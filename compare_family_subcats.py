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

# Frontend expected subcategories
expected_subcats = [
    'Yaşlı Bakımı',
    'Bebek & Çocuk Giyimi',
    'Bebek & Çocuk Ayakkabıları',
    'Bebek Ekipmanları',
    'Bebek Koltuğu & Oto Koltukları',
    'Babysitter & Çocuk Bakımı',
    'Bebek Arabaları & Pusetler',
    'Bebek Odası Mobilyaları',
    'Oyuncaklar',
    'Diğer Aile, Çocuk & Bebek'
]

try:
    # Get all subcategories in database
    response = supabase.table("listings").select("sub_category").eq("category", "Aile, Çocuk & Bebek").execute()
    
    db_subcats = {}
    for item in response.data:
        sub = item.get("sub_category")
        if sub:
            db_subcats[sub] = db_subcats.get(sub, 0) + 1
    
    print("Database subcategories:")
    print(json.dumps(db_subcats, indent=2, ensure_ascii=False))
    
    print("\n\nExpected vs Actual:")
    for expected in expected_subcats:
        count = db_subcats.get(expected, 0)
        status = "✓" if count > 0 else "✗"
        print(f"{status} {expected}: {count}")
    
    print("\n\nUnexpected subcategories in DB:")
    for db_sub in db_subcats.keys():
        if db_sub not in expected_subcats:
            print(f"  - '{db_sub}': {db_subcats[db_sub]}")

except Exception as e:
    print(f"Error: {e}")
