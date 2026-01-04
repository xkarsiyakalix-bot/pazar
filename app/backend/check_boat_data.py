from supabase import create_client
import os
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

print("Checking Boat listings...")
response = supabase.table("listings").select("id, boote_art").eq("category", "Otomobil, Bisiklet & Tekne").ilike("sub_category", "%Tekne%").execute()

if not response.data:
    print("No boat listings found.")
else:
    for item in response.data:
        print(item)
