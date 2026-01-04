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
    print("Checking 'Oyuncaklar' in database...")
    response = supabase.table("listings").select("sub_category").eq("sub_category", "Oyuncaklar").execute()
    count = len(response.data) if response.data else 0
    print(f"Found {count} listings with sub_category='Oyuncaklar'")
    
    print("Checking 'Oyuncak' in database...")
    response = supabase.table("listings").select("sub_category").eq("sub_category", "Oyuncak").execute()
    count = len(response.data) if response.data else 0
    print(f"Found {count} listings with sub_category='Oyuncak'")
    
    print("Checking 'Spielzeug' in database...")
    response = supabase.table("listings").select("sub_category").eq("sub_category", "Spielzeug").execute()
    count = len(response.data) if response.data else 0
    print(f"Found {count} listings with sub_category='Spielzeug'")
    
    # Check if category is correct
    print("Checking category for 'Oyuncaklar'...")
    response = supabase.table("listings").select("category, sub_category").eq("sub_category", "Oyuncaklar").limit(5).execute()
    print(json.dumps(response.data, indent=2))

except Exception as e:
    print(f"Error: {e}")
