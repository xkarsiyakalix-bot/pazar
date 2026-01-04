from supabase import create_client
import os
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    print("Error: Missing SUPABASE_URL or SUPABASE_KEY")
    exit(1)

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

print("Updating 'Emlak' listings from 'Nakliye & Taşıma' to 'Taşımacılık & Nakliye'...")

try:
    # 1. Select listings to update
    response = supabase.table("listings").select("*").eq("category", "Emlak").eq("sub_category", "Nakliye & Taşıma").execute()
    
    listings = response.data
    print(f"Found {len(listings)} listings to update.")
    
    count = 0
    for item in listings:
        print(f"Updating listing {item['id']}...")
        update_response = supabase.table("listings").update({"sub_category": "Taşımacılık & Nakliye"}).eq("id", item['id']).execute()
        if update_response.data:
            count += 1
            
    print(f"Successfully updated {count} listings.")

except Exception as e:
    print(f"Error: {e}")
