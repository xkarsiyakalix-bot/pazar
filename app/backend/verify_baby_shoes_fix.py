import os
from dotenv import load_dotenv
from supabase import create_client

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

if not SUPABASE_URL:
    print("SUPABASE_URL not found in env")
    exit(1)

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

CATEGORY = "Aile, Çocuk & Bebek"
SUBCATEGORY = "Bebek & Çocuk Ayakkabıları"

print(f"Verifying filters for {CATEGORY} > {SUBCATEGORY}...")

# 1. Check Art (Turkish Value)
print("\nChecking Art='Ev Terliği'...")
res = supabase.table("listings").select("id").eq("category", CATEGORY).eq("sub_category", SUBCATEGORY).eq("baby_kinderschuhe_art", "Ev Terliği").execute()
print(f"  Result count: {len(res.data)}")

# 2. Check Color (Turkish Value)
print("\nChecking Color='Yeşil'...")
res = supabase.table("listings").select("id").eq("category", CATEGORY).eq("sub_category", SUBCATEGORY).eq("baby_kinderschuhe_color", "Yeşil").execute()
print(f"  Result count: {len(res.data)}")

# 3. Check Provider (German Value)
print("\nChecking Provider='Privatnutzer'...")
res = supabase.table("listings").select("id").eq("category", CATEGORY).eq("sub_category", SUBCATEGORY).eq("seller_type", "Privatnutzer").execute()
print(f"  Result count: {len(res.data)}")
