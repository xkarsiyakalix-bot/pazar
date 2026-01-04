import os
from dotenv import load_dotenv
from supabase import create_client

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

if not SUPABASE_URL:
    print("SUPABASE_URL not found in env")
    exit(1)

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

print("Checking 'working_time' for ALL 'İş İlanları'...")
response = supabase.table("listings").select("working_time").eq("category", "İş İlanları").execute()
wt_counts = {}
for item in response.data:
    wt = item.get("working_time")
    # Normalize for counting
    if wt:
        wt = wt.strip()
    wt_counts[str(wt)] = wt_counts.get(str(wt), 0) + 1

print("Working Time Distribution:")
for k, v in wt_counts.items():
    print(f"  '{k}': {v}")
