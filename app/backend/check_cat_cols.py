import os
from supabase import create_client
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    print("Error: SUPABASE_URL or SUPABASE_KEY missing.")
    exit(1)

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

def check_categories_columns():
    try:
        # We can't directly get column names via select("*") if there are no rows or if we want meta data,
        # but we already know it has some rows.
        response = supabase.table("categories").select("*").limit(1).execute()
        if response.data:
            print("Columns available:", response.data[0].keys())
    except Exception as e:
        print("Error checking categories columns:", e)

if __name__ == "__main__":
    check_categories_columns()
