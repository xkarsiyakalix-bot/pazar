import os
import random
from supabase import create_client, Client
from datetime import datetime, timedelta

url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_SERVICE_ROLE_KEY") # Use service role key for bypass RLS
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

def create_sample_listings():
    listings = []
    
    for subcat in subcategories:
        for i in range(3): # Create 3 samples per subcategory
            title = f"Beispiel {subcat} {i+1}"
            description = f"Dies ist eine Beispielanzeige für {subcat}. Tolle Lage, gute Ausstattung."
            price = random.randint(100, 2000000)
            
            listing = {
                "title": title,
                "description": description,
                "category": "Immobilien",
                "sub_category": subcat,
                "price": price,
                "price_type": "fixed",
                "location": "Musterstadt",
                "federal_state": random.choice(federal_states),
                "seller_type": random.choice(["Privat", "Gewerblich"]),
                "offer_type": random.choice(["Angebote", "Gesuche"]),
                "condition": "used",
                "zip_code": "12345",
                "user_id": "00000000-0000-0000-0000-000000000000", # Placeholder or real user ID if known
            }
            
            # Common real estate fields
            if subcat in ["Mietwohnungen", "Eigentumswohnungen", "Häuser zur Miete", "Häuser zum Kauf", "Auf Zeit & WG", "Ferien- & Auslandsimmobilien", "Gewerbeimmobilien", "Neubauprojekte"]:
                listing["living_space"] = random.randint(20, 300)
                listing["rooms"] = random.choice([1, 1.5, 2, 2.5, 3, 3.5, 4, 5])
                listing["available_from"] = (datetime.now() + timedelta(days=random.randint(1, 90))).strftime("%Y-%m-%d")
                listing["online_viewing"] = random.choice(["Möglich", "Nicht möglich"])
                listing["amenities"] = random.sample(['Balkon', 'Terrasse', 'Einbauküche', 'Gäste-WC'], random.randint(1, 4))
                listing["general_features"] = random.sample(['Altbau', 'Neubau', 'Aufzug', 'Keller'], random.randint(1, 4))

            # Subcategory specific
            if subcat in ["Mietwohnungen", "Eigentumswohnungen"]:
                listing["wohnungstyp"] = random.choice(['Etagenwohnung', 'Dachgeschosswohnung', 'Erdgeschosswohnung', 'Loft', 'Penthouse'])
                listing["floor"] = random.randint(0, 10)
                listing["construction_year"] = random.randint(1900, 2024)
            
            if subcat in ["Häuser zur Miete", "Häuser zum Kauf"]:
                listing["haustyp"] = random.choice(['Einfamilienhaus freistehend', 'Reihenhaus', 'Mehrfamilienhaus', 'Bungalow', 'Doppelhaushälfte'])
                listing["plot_area"] = random.randint(100, 1000)
                listing["construction_year"] = random.randint(1900, 2024)
            
            if subcat == "Grundstücke & Gärten":
                listing["grundstuecksart"] = random.choice(['Baugrundstück', 'Garten', 'Land-/Forstwirtschaft'])
                listing["angebotsart"] = random.choice(["Kaufen", "Mieten"])
                listing["plot_area"] = random.randint(100, 2000)
                listing["commission"] = random.choice(["Provisionsfrei", "Mit Provision"])
            
            if subcat == "Gewerbeimmobilien":
                listing["objektart"] = random.choice(['Büros & Praxen', 'Lager, Hallen & Produktion', 'Einzelhandel & Kioske'])
                listing["angebotsart"] = random.choice(["Kaufen", "Mieten"])
                listing["price_per_sqm"] = random.randint(5, 50)
                listing["commission"] = random.choice(["Provisionsfrei", "Mit Provision"])

            if subcat == "Garagen & Stellplätze":
                listing["garage_type"] = random.choice(["Garage", "Außenstellplatz"])
                listing["angebotsart"] = random.choice(["Kaufen", "Mieten"])
                listing["commission"] = random.choice(["Provisionsfrei", "Mit Provision"])

            if subcat == "Auf Zeit & WG":
                listing["auf_zeit_wg_art"] = random.choice(["Gesamte Unterkunft", "Privatzimmer", "Gemeinsames Zimmer"])
                listing["rental_type"] = random.choice(["befristet", "unbefristet"])
                listing["warm_rent"] = price + 100

            if subcat == "Ferien- & Auslandsimmobilien":
                listing["lage"] = random.choice(["Inland", "Ausland"])
                listing["angebotsart"] = random.choice(["Kaufen", "Mieten"])
            
            if subcat == "Container":
                listing["price_per_sqm"] = random.randint(10, 100)
                listing["angebotsart"] = random.choice(["Kaufen", "Mieten"])

            listings.append(listing)

    # Insert into Supabase
    try:
        response = supabase.table("listings").insert(listings).execute()
        print(f"Successfully inserted {len(listings)} sample listings.")
    except Exception as e:
        print(f"Error inserting listings: {e}")

if __name__ == "__main__":
    if not url or not key:
        print("Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables.")
    else:
        create_sample_listings()
