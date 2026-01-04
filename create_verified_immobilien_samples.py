import os
import random
from supabase import create_client, Client
from datetime import datetime, timedelta
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

url: str = os.getenv("SUPABASE_URL")
key: str = os.getenv("SUPABASE_KEY")
supabase: Client = create_client(url, key)

subcategories = [
    "Mietwohnungen",
    "Eigentumswohnungen",
    "Häuser zur Miete",
    "Häuser zum Kauf",
    "Auf Zeit & WG",
    "Grundstücke & Gärten",
    "Gewerbeimmobilien",
    "Garagen & Stellplätze",
    "Ferien- & Auslandsimmobilien",
    "Container",
    "Neubauprojekte",
    "Umzug & Transport",
    "Weitere Immobilien"
]

federal_states = [
    'Baden-Württemberg', 'Bayern', 'Berlin', 'Brandenburg', 'Bremen',
    'Hamburg', 'Hessen', 'Mecklenburg-Vorpommern', 'Niedersachsen',
    'Nordrhein-Westfalen', 'Rheinland-Pfalz', 'Saarland', 'Sachsen',
    'Sachsen-Anhalt', 'Schleswig-Holstein', 'Thüringen'
]

# Try to get a real user_id from the database
def get_user_id():
    try:
        response = supabase.table("profiles").select("id").limit(1).execute()
        if response.data:
            return response.data[0]["id"]
    except:
        pass
    return "00000000-0000-0000-0000-000000000000"

user_id = get_user_id()

def create_sample_listings():
    listings = []
    
    for subcat in subcategories:
        for i in range(1): # Create 1 sample per subcategory for faster verification
            title = f"Verified {subcat} {i+1}"
            description = f"Dies ist eine verifizierte Beispielanzeige für {subcat}. Tolle Lage, gute Ausstattung."
            price = random.randint(500, 1500) if "Miete" in subcat or "Zeit" in subcat else random.randint(100000, 1000000)
            
            listing = {
                "title": title,
                "description": description,
                "category": "Immobilien",
                "sub_category": subcat,
                "price": price,
                "price_type": "fixed",
                "city": "Berlin",
                "postal_code": "10115",
                "address": "Friedrichstraße 1",
                "federal_state": random.choice(federal_states),
                "seller_type": random.choice(["Privat", "Gewerblich"]),
                "offer_type": "Angebote",
                "condition": "used",
                "user_id": user_id,
            }
            
            # Common real estate fields
            if subcat in ["Mietwohnungen", "Eigentumswohnungen", "Häuser zur Miete", "Häuser zum Kauf", "Auf Zeit & WG", "Ferien- & Auslandsimmobilien", "Gewerbeimmobilien", "Neubauprojekte"]:
                listing["living_space"] = random.randint(40, 150)
                listing["rooms"] = random.choice([2, 3, 4])
                listing["available_from"] = "2026-01"
                listing["online_viewing"] = "Möglich"
                listing["amenities"] = ['Balkon', 'Einbauküche', 'Gäste-WC']
                listing["general_features"] = ['Altbau', 'Keller']

            # Subcategory specific
            if subcat in ["Mietwohnungen", "Eigentumswohnungen"]:
                listing["wohnungstyp"] = "Etagenwohnung"
                listing["floor"] = 2
                listing["construction_year"] = 1990
            
            if subcat in ["Häuser zur Miete", "Häuser zum Kauf"]:
                listing["haustyp"] = "Einfamilienhaus freistehend"
                listing["plot_area"] = 500
                listing["construction_year"] = 2005
            
            if subcat == "Auf Zeit & WG":
                listing["auf_zeit_wg_art"] = "Privatzimmer"
                listing["warm_rent"] = float(price + 150)

            listings.append(listing)

    # Insert into Supabase
    try:
        response = supabase.table("listings").insert(listings).execute()
        print(f"Successfully inserted {len(listings)} sample listings.")
    except Exception as e:
        print(f"Error inserting listings: {e}")

if __name__ == "__main__":
    if not url or not key:
        print("Please check your .env file for SUPABASE_URL and SUPABASE_KEY.")
    else:
        create_sample_listings()
