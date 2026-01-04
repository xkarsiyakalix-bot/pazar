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

print("Checking 'versand_art' for 'Bebek & Çocuk Giyimi'...")
response = supabase.table("listings").select("versand_art").eq("category", "Aile, Çocuk & Bebek").eq("sub_category", "Bebek & Çocuk Giyimi").execute()

counts = {}
for item in response.data:
    val = item.get("versand_art")
    if val:
        val = val.strip()
    counts[str(val)] = counts.get(str(val), 0) + 1

print("Versand Art Distribution:")
for k, v in counts.items():
    print(f"  '{k}': {v}")
