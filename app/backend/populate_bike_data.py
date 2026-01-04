from supabase import create_client
import os
from dotenv import load_dotenv
import random

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

print("Fetching Bisiklet listings...")
response = supabase.table("listings").select("id").eq("category", "Otomobil, Bisiklet & Tekne").ilike("sub_category", "%Bisiklet%").execute()

if not response.data:
    print("No bicycle listings found.")
    exit()

print(f"Found {len(response.data)} listings. Updating...")

bike_arts = ['Erkek', 'Kadın', 'Çocuk']
bike_types = ['Dağ Bisikleti (MTB)', 'Şehir Bisikleti', 'Elektrikli Bisiklet', 'Yol/Yarış Bisikleti']

for i, item in enumerate(response.data):
    # Assign different values to ensure multiple filters get counts if possible
    art = bike_arts[i % len(bike_arts)]
    b_type = bike_types[i % len(bike_types)]
    
    print(f"Updating {item['id']} -> Art: {art}, Type: {b_type}")
    
    try:
        data = {"bike_art": art, "bike_type": b_type}
        update_res = supabase.table("listings").update(data).eq("id", item['id']).execute()
        print(f"Update result: {len(update_res.data)} rows affected.")
    except Exception as e:
        print(f"Error updating {item['id']}: {e}")

print("Done.")
