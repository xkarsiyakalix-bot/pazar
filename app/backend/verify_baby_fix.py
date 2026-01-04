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
SUBCATEGORY = "Bebek & Çocuk Giyimi"

print(f"Verifying filters for {CATEGORY} > {SUBCATEGORY}...")

# 1. Check Art (Turkish Value)
print("\nChecking Art='Kazak & Hırka'...")
res = supabase.table("listings").select("count").eq("category", CATEGORY).eq("sub_category", SUBCATEGORY).eq("baby_kinderkleidung_art", "Kazak & Hırka").execute()
# count is tricky with py-client, just use len(data) if count not supported easily
res = supabase.table("listings").select("id").eq("category", CATEGORY).eq("sub_category", SUBCATEGORY).eq("baby_kinderkleidung_art", "Kazak & Hırka").execute()
print(f"  Result count: {len(res.data)}")

# 2. Check Gender (Turkish Value)
print("\nChecking Gender='Erkek'...")
res = supabase.table("listings").select("id").eq("category", CATEGORY).eq("sub_category", SUBCATEGORY).eq("baby_kinderkleidung_gender", "Erkek").execute()
print(f"  Result count: {len(res.data)}")

# 3. Check Color (Turkish Value)
print("\nChecking Color='Kahverengi'...")
res = supabase.table("listings").select("id").eq("category", CATEGORY).eq("sub_category", SUBCATEGORY).eq("baby_kinderkleidung_color", "Kahverengi").execute()
print(f"  Result count: {len(res.data)}")

# 4. Check Provider (German Value)
print("\nChecking Provider='Privatnutzer'...")
res = supabase.table("listings").select("id").eq("category", CATEGORY).eq("sub_category", SUBCATEGORY).eq("seller_type", "Privatnutzer").execute()
print(f"  Result count: {len(res.data)}")
