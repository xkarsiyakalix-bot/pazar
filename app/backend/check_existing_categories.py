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

def check_categories_table():
    try:
        response = supabase.table("categories").select("*").limit(5).execute()
        print("Categories table contains:", response.data)
    except Exception as e:
        print("Error checking categories table:", e)

if __name__ == "__main__":
    check_categories_table()
