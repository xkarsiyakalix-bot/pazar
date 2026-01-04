from supabase import create_client
import os
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

print("Checking car amenities and safety features...")
response = supabase.table("listings").select("id, title, car_amenities, scheckheftgepflegt, unfallfrei, nichtraucher_fahrzeug").eq("category", "Otomobil, Bisiklet & Tekne").eq("sub_category", "Otomobiller").execute()

if not response.data:
    print("No car listings found.")
else:
    for item in response.data:
        print(f"\nListing ID: {item['id'][:8]}...")
        print(f"  Title: {item.get('title')}")
        print(f"  car_amenities: {item.get('car_amenities')}")
        print(f"  scheckheftgepflegt: {item.get('scheckheftgepflegt')}")
        print(f"  unfallfrei: {item.get('unfallfrei')}")
        print(f"  nichtraucher_fahrzeug: {item.get('nichtraucher_fahrzeug')}")
