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
    print("Updating 'Versand möglich' to 'Kargo Mümkün'...")
    response1 = supabase.table("listings").update({"versand_art": "Kargo Mümkün"}).eq("versand_art", "Versand möglich").execute()
    print(f"Updated: {len(response1.data) if response1.data else 'Unknown'}")
    
    print("Updating 'Nur Abholung' to 'Sadece Elden Teslim'...")
    response2 = supabase.table("listings").update({"versand_art": "Sadece Elden Teslim"}).eq("versand_art", "Nur Abholung").execute()
    print(f"Updated: {len(response2.data) if response2.data else 'Unknown'}")
    
    print("Updates complete.")

except Exception as e:
    print(f"Error: {e}")
