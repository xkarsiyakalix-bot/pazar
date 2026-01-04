from supabase import create_client
import os
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

print("Retrying update with debug info...")

response = supabase.table("listings").select("*").eq("category", "Emlak").eq("sub_category", "Nakliye & Taşıma").execute()
listings = response.data
print(f"Found {len(listings)} listings.")

for item in listings:
    print(f"Updating {item['id']}...")
    try:
        res = supabase.table("listings").update({"sub_category": "Taşımacılık & Nakliye"}).eq("id", item['id']).execute()
        print(f"Response data: {res.data}")
        print(f"Response error: {res.error if hasattr(res, 'error') else 'None'}")
    except Exception as e:
        print(f"Exception during update: {e}")
