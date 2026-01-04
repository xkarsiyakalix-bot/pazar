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

print("Checking 'Diğer İş İlanları'...")

# Check working_time
response = supabase.table("listings").select("working_time").eq("category", "İş İlanları").execute()
# We can't use count aggregate easily with select client, so just fetch and count in python
wt_counts = {}
for item in response.data:
    wt = item.get("working_time")
    wt_counts[str(wt)] = wt_counts.get(str(wt), 0) + 1

print("Working Time Distribution:")
for k, v in wt_counts.items():
    print(f"  '{k}': {v}")

# Check weitere_jobs_art
response = supabase.table("listings").select("weitere_jobs_art").eq("category", "İş İlanları").eq("sub_category", "Diğer İş İlanları").execute()
art_counts = {}
for item in response.data:
    art = item.get("weitere_jobs_art")
    art_counts[str(art)] = art_counts.get(str(art), 0) + 1

print("\nWeitere Jobs Art Distribution:")
for k, v in art_counts.items():
    print(f"  '{k}': {v}")
