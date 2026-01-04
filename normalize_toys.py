from supabase import create_client, Client
import os
from dotenv import load_dotenv

load_dotenv(dotenv_path='app/backend/.env')

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    print("Error: SUPABASE_URL or SUPABASE_KEY not found in .env")
    exit(1)

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

try:
    # Update 'Oyuncak' to 'Oyuncaklar'
    # Also good to check if there are 'Spielzeug' to update
    
    print("Updating 'Oyuncak' to 'Oyuncaklar'...")
    response = supabase.table("listings").update({"sub_category": "Oyuncaklar"}).eq("sub_category", "Oyuncak").execute()
    
    print("Updating 'Spielzeug' to 'Oyuncaklar'...")
    response2 = supabase.table("listings").update({"sub_category": "Oyuncaklar"}).eq("sub_category", "Spielzeug").execute()
    
    print("Update complete.")
except Exception as e:
    print(f"Error: {e}")
