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

# Update old values to new standardized values
updates = {
    'Melez': 'Karışık',
    'Bernardin': 'Bernhardiner',
    'Dachshund': 'Dackel',
    'Doberman': 'Dobermann',
    'Danua': 'Dogge',
    'Maltese': 'Maltiz'
}

for old, new in updates.items():
    print(f"Updating '{old}' to '{new}'...")
    try:
        response = supabase.table("listings").update({"hunde_art": new}).eq("hunde_art", old).execute()
        count = len(response.data) if response.data else 0
        if count > 0:
            print(f"  Updated {count} listings")
    except Exception as e:
        print(f"  Error: {e}")

print("\nUpdate complete!")
