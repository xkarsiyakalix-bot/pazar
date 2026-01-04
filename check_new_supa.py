
import os
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

url = os.environ.get("SUPABASE_URL")
key = os.environ.get("SUPABASE_KEY")

if not url or not key:
    print("Error: SUPABASE_URL or SUPABASE_KEY not found in environment")
    exit(1)

supabase: Client = create_client(url, key)

try:
    listings = supabase.table('listings').select('*').execute()
    profiles = supabase.table('profiles').select('*').execute()
    print(f"Connection successful.")
    print(f"Found {len(listings.data)} listings.")
    print(f"Found {len(profiles.data)} profiles.")
except Exception as e:
    print(f"Error connecting to Supabase: {e}")
