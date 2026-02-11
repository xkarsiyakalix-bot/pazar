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

def check_table():
    try:
        response = supabase.table("category_settings").select("*").limit(1).execute()
        print("Table exists and contains:", response.data)
    except Exception as e:
        print("Error checking table:", e)

if __name__ == "__main__":
    check_table()
