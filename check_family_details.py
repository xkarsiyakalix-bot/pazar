from supabase import create_client, Client
import os
from dotenv import load_dotenv
import json

load_dotenv(dotenv_path='app/backend/.env')

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    print("Error: SUPABASE_URL or SUPABASE_KEY not found in .env")
    exit(1)

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

try:
    # Check all listings in 'Aile, Çocuk & Bebek'
    print("Fetching subcategories for 'Aile, Çocuk & Bebek'...")
    response = supabase.table("listings").select("id, title, sub_category, status").eq("category", "Aile, Çocuk & Bebek").execute()
    
    subcat_counts = {}
    active_status_counts = {}
    
    print("\nListing Details:")
    for item in response.data:
        sub = item.get("sub_category")
        status = item.get("status")
        
        # Count subcategories
        subcat_counts[sub] = subcat_counts.get(sub, 0) + 1
        
        # Count status
        active_status_counts[status] = active_status_counts.get(status, 0) + 1
        
        if sub in ["Oyuncak", "Oyuncaklar", "Spielzeug"] or "yuncak" in str(sub):
            print(f"ID: {item['id']}, Sub: '{sub}', Status: '{status}', Title: {item['title']}")

    print("\nSubcategory Distribution:")
    print(json.dumps(subcat_counts, indent=2))
    
    print("\nStatus Distribution:")
    print(json.dumps(active_status_counts, indent=2))


except Exception as e:
    print(f"Error: {e}")
