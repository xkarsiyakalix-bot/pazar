import os
import uuid
from supabase import create_client
from dotenv import load_dotenv

load_dotenv("app/backend/.env")

url = os.environ.get("SUPABASE_URL")
key = os.environ.get("SUPABASE_KEY")
supabase = create_client(url, key)

def create_samples():
    print("Creating new sample Katzen listings...")
    
    samples = [
        {
            "title": "Süßer BKH Kater",
            "description": "Sehr lieber Kater sucht neues Zuhause.",
            "price": 500,
            "category": "Haustiere",
            "sub_category": "Katzen",
            "katzen_art": "Britisch Kurzhaar",
            "katzen_alter": "jünger als 12 Monate",
            "katzen_geimpft": "Ja",
            "katzen_erlaubnis": "Ja",
            "status": "active",
            "city": "Berlin",
            "federal_state": "Berlin",
            "offer_type": "Angebote",
            "seller_type": "Privatnutzer"
        },
        {
            "title": "Verspielte Hauskatze",
            "description": "Hauskatze, 2 Jahre alt.",
            "price": 50,
            "category": "Haustiere",
            "sub_category": "Katzen",
            "katzen_art": "Hauskatze",
            "katzen_alter": "12 Monate oder älter",
            "katzen_geimpft": "Ja",
            "katzen_erlaubnis": "Ja",
            "status": "active",
            "city": "Hamburg",
            "federal_state": "Hamburg",
            "offer_type": "Angebote",
            "seller_type": "Privatnutzer"
        }
    ]
    
    for s in samples:
        # Generate a random user_id if needed, or omit if allowed
        res = supabase.table("listings").insert(s).execute()
        if res.data:
            print(f"✅ Created: {s['title']} | ID: {res.data[0]['id']}")
        else:
            print(f"❌ Failed to create: {s['title']}")

if __name__ == "__main__":
    create_samples()
