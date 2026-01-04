import os
import uuid
from supabase import create_client
import dotenv

dotenv.load_dotenv("app/backend/.env")

url = os.environ.get("SUPABASE_URL")
key = os.environ.get("SUPABASE_KEY")
supabase = create_client(url, key)

def create_samples():
    print("Creating new sample Auf Zeit & WG listings...")
    
    # Get a legitimate user_id from existing listings if possible
    res = supabase.table("listings").select("user_id").limit(1).execute()
    user_id = res.data[0]['user_id'] if res.data else str(uuid.uuid4())

    samples = [
        {
            "user_id": user_id,
            "title": "Helles WG-Zimmer in Charlottenburg",
            "description": "Schönes 20qm Zimmer in 3er WG.",
            "price": 650,
            "category": "Immobilien",
            "sub_category": "Auf Zeit & WG",
            "auf_zeit_wg_art": "Privatzimmer",
            "rental_type": "unbefristet",
            "living_space": 20,
            "rooms": 1,
            "roommates": 2,
            "available_from": "2024-01-01",
            "online_viewing": "Möglich",
            "warm_rent": 650,
            "amenities": ["WLAN", "Möbliert", "Waschmaschine"],
            "general_features": ["Keller", "Haustiere erlaubt"],
            "status": "active",
            "city": "Berlin",
            "federal_state": "Berlin",
            "offer_type": "Angebote",
            "seller_type": "Privatnutzer"
        },
        {
            "user_id": user_id,
            "title": "Möblierte 2-Zimmer Wohnung auf Zeit",
            "description": "Voll möbliert, perfekt für Business-Reisende.",
            "price": 1200,
            "category": "Immobilien",
            "sub_category": "Auf Zeit & WG",
            "auf_zeit_wg_art": "Gesamte Unterkunft",
            "rental_type": "befristet",
            "living_space": 55,
            "rooms": 2,
            "roommates": 0,
            "available_from": "2024-02-15",
            "online_viewing": "Nicht möglich",
            "warm_rent": 1350,
            "amenities": ["WLAN", "Möbliert", "Kühlschrank", "Backofen", "Herd", "Waschmaschine", "Spülmaschine", "TV"],
            "general_features": ["Aufzug", "Garage/Stellplatz"],
            "status": "active",
            "city": "München",
            "federal_state": "Bayern",
            "offer_type": "Angebote",
            "seller_type": "Gewerblicher Nutzer"
        }
    ]
    
    for s in samples:
        res = supabase.table("listings").insert(s).execute()
        if res.data:
            print(f"✅ Created: {s['title']} | ID: {res.data[0]['id']}")
        else:
            print(f"❌ Failed to create: {s['title']}")

if __name__ == "__main__":
    create_samples()
