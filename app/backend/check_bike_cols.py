from supabase import create_client
import os
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

# Try selecting one row and see keys
response = supabase.table("listings").select("*").limit(1).execute()
if response.data:
    keys = response.data[0].keys()
    print("Columns found:")
    if 'bike_art' in keys: print("- bike_art")
    if 'art_type' in keys: print("- art_type")
    if 'bike_type' in keys: print("- bike_type")
else:
    print("No data found to check columns.")
