from supabase import create_client
import os
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

# Query to check the data type of erstzulassung column
print("Checking erstzulassung column in listings table...")

# Get a sample listing to see what's stored
response = supabase.table("listings").select("erstzulassung").limit(5).execute()

print(f"\nSample erstzulassung values:")
for item in response.data:
    print(f"  {item.get('erstzulassung')} (type: {type(item.get('erstzulassung')).__name__})")
