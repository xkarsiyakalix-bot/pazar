import os
from supabase import create_client
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

# Get all categories
categories = supabase.table("categories").select("*").order("display_order").execute()

print("\n=== CATEGORIES ===")
for cat in categories.data:
    print(f"ID: {cat['id']}")
    print(f"Name: {cat['name']}")
    print(f"Slug: {cat['slug']}")
    print(f"Display Order: {cat['display_order']}")
    print("-" * 50)

# Get Mahalle Yardımı related categories and subcategories
print("\n=== MAHALLE YARDIMI RELATED ===")
mahalle_cats = [c for c in categories.data if 'Mahalle' in c['name'] or 'Nachbarschaft' in c['name']]
for cat in mahalle_cats:
    print(f"\nCategory: {cat['name']} (ID: {cat['id']})")
    subs = supabase.table("subcategories").select("*").eq("category_id", cat['id']).order("display_order").execute()
    for sub in subs.data:
        print(f"  - Subcategory: {sub['name']} (ID: {sub['id']})")

# Check Eğlence, Hobi & Mahalle category
print("\n=== EĞLENCE, HOBI & MAHALLE ===")
eglence_cats = [c for c in categories.data if 'Eğlence' in c['name'] or 'Hobi' in c['name'] or 'Freizeit' in c['name']]
for cat in eglence_cats:
    print(f"\nCategory: {cat['name']} (ID: {cat['id']})")
    subs = supabase.table("subcategories").select("*").eq("category_id", cat['id']).order("display_order").execute()
    for sub in subs.data:
        print(f"  - Subcategory: {sub['name']}")
