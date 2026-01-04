from supabase import create_client
import os
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

print("Checking for car listings...")
response = supabase.table("listings").select("id, title, sub_category, status").eq("category", "Otomobil, Bisiklet & Tekne").ilike("sub_category", "%Otomobil%").execute()

print(f"\nFound {len(response.data)} listings:")
for item in response.data:
    print(f"  ID: {item['id'][:8]}... | Title: {item['title'][:30]}... | SubCat: '{item['sub_category']}' | Status: {item.get('status')}")
