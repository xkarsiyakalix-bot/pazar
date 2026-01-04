import os
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

def check_categories():
    try:
        supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
        response = supabase.table("categories").select("count", count="exact").execute()
        print(f"Categories count: {response.count}")
        
        # Also check subcategories
        response_sub = supabase.table("subcategories").select("count", count="exact").execute()
        print(f"Subcategories count: {response_sub.count}")
        
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    check_categories()
