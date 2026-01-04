from supabase import create_client
import os
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

# Try SQL directly via RPC if possible, otherwise debug update
# I will try to select the rows again to see if they changed (maybe 0 rows affected means 0 *changed* but they were updated?)
# But previous check showed None, and I'm updating to 'Erkek'.

print("Re-checking listings...")
response = supabase.table("listings").select("id, bike_art, bike_type").eq("category", "Otomobil, Bisiklet & Tekne").ilike("sub_category", "%Bisiklet%").execute()
for item in response.data:
    print(item)

# If still None, then update failed. 
# Likely RLS issue if using a key that is restricted, but the backend script usually uses the service_role key?
# Wait, SUPABASE_KEY is usually the anon key in frontend envs, but in backend?
# Let's check what key is being used.

print(f"Key starts with: {SUPABASE_KEY[:10]}...")
