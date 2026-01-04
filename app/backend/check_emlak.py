from supabase import create_client
import os
from dotenv import load_dotenv
import collections

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    print("Error: Missing SUPABASE_URL or SUPABASE_KEY")
    exit(1)

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

print(f"Checking 'Emlak' listings...")

try:
    # 1. Check Emlak category
    response = supabase.table("listings").select("id, title, category, sub_category").eq("category", "Emlak").execute()
    
    print(f"Found {len(response.data)} listings in 'Emlak' category.")
    
    subcats = collections.Counter()
    for item in response.data:
        subcats[item["sub_category"]] += 1
        
    print("\nSubcategories distribution in 'Emlak':")
    for sub, count in subcats.items():
        print(f"  - '{sub}': {count}")

    # 2. Check for potential name mismatches (e.g., German 'Umzug & Transport')
    print("\nChecking for 'Umzug & Transport' or similar...")
    response_german = supabase.table("listings").select("id, title, category, sub_category").ilike("sub_category", "%Transport%").execute()
    
    print(f"Found {len(response_german.data)} listings with 'Transport' in sub_category:")
    for item in response_german.data:
        print(f"  - [{item['category']}] {item['sub_category']} (ID: {item['id']})")

except Exception as e:
    print(f"Error: {e}")
