import os
from supabase import create_client, Client

SUPABASE_URL = "https://ynleaatvkftkafiyqufv.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlubGVhYXR2a2Z0a2FmaXlxdWZ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ3MzA4ODIsImV4cCI6MjA4MDMwNjg4Mn0.Ym945vCX_d2eL1-RlE4xXVwo4uGrxWUZeJgyOiHgVEA"

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

def enrich_listings():
    # 1. Mercedes Benz CLS
    mercedes_id = "b707bb19-ac7b-45df-a5a8-cbd8f25d9461"
    mercedes_data = {
        "marke": "Mercedes Benz",
        "modell": "CLS",
        "kraftstoff": "Benzin",
        "fahrzeugtyp": "Limousine",
        "door_count": "4/5",
        "exterior_color": "Schwarz",
        "getriebe": "Automatik",
        "leistung": 163,
        "kilometerstand": 33300,
        "erstzulassung": "12/2022",
        "schadstoffklasse": "Euro6",
        "emission_badge": "4 (Grün)",
        "condition": "sehr_gut"
    }
    
    # 2. VW Käfer
    vw_id = "98fd3675-0163-4c93-9a81-318bedc7c31a"
    vw_data = {
        "marke": "Volkswagen",
        "modell": "Käfer",
        "kraftstoff": "Benzin",
        "fahrzeugtyp": "Limousine",
        "door_count": "2/3",
        "exterior_color": "Beige",
        "getriebe": "Schaltgetriebe",
        "leistung": 44,
        "kilometerstand": 85000,
        "erstzulassung": "07/1970",
        "schadstoffklasse": "Euro1",
        "emission_badge": "1 (Keine)",
        "condition": "sehr_gut"
    }
    
    print(f"Updating Mercedes {mercedes_id}...")
    try:
        res1 = supabase.table("listings").update(mercedes_data).eq("id", mercedes_id).execute()
        print(f"Result: {len(res1.data)} updated")
    except Exception as e:
        print(f"Error updating Mercedes: {e}")
    
    print(f"Updating VW {vw_id}...")
    try:
        res2 = supabase.table("listings").update(vw_data).eq("id", vw_id).execute()
        print(f"Result: {len(res2.data)} updated")
    except Exception as e:
        print(f"Error updating VW: {e}")

if __name__ == "__main__":
    enrich_listings()
