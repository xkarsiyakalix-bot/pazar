from supabase import create_client
import os
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

print("Checking car listing details...")
response = supabase.table("listings").select("*").eq("category", "Otomobil, Bisiklet & Tekne").eq("sub_category", "Otomobiller").execute()

if not response.data:
    print("No car listings found.")
else:
    for item in response.data:
        print(f"\nListing ID: {item['id'][:8]}...")
        print(f"  Title: {item.get('title')}")
        print(f"  Marke/Brand: {item.get('marke')} / {item.get('car_brand')}")
        print(f"  Model: {item.get('modell')} / {item.get('car_model')}")
        print(f"  Fuel Type: {item.get('kraftstoff')} / {item.get('fuel_type')}")
        print(f"  Transmission: {item.get('getriebe')}")
        print(f"  Vehicle Type: {item.get('fahrzeugtyp')} / {item.get('vehicle_type')}")
        print(f"  Exterior Color: {item.get('exterior_color')}")
        print(f"  Door Count: {item.get('door_count')}")
        print(f"  Emission Badge: {item.get('emission_badge')} / {item.get('emission_sticker')}")
        print(f"  Emission Class: {item.get('schadstoffklasse')} / {item.get('emission_class')}")
        print(f"  Interior Material: {item.get('interior_material')}")
