import os
from supabase import create_client
from dotenv import load_dotenv

# Load environment variables
load_dotenv('app/frontend/.env')

url = os.environ.get("REACT_APP_SUPABASE_URL")
key = os.environ.get("REACT_APP_SUPABASE_ANON_KEY")

supabase = create_client(url, key)

def check_profiles_schema():
    try:
        # Get one record to check columns
        res = supabase.table('profiles').select('*').limit(1).execute()
        if res.data:
            print("Columns found in 'profiles' table:")
            print(res.data[0].keys())
            
            # Try the specific query that failed
            res_or = supabase.table('profiles').select('id').or_('is_pro.eq.true,account_type.eq.commercial').limit(5).execute()
            print("\nOR query result count:", len(res_or.data))
        else:
            print("No data in profiles table to check columns.")
    except Exception as e:
        print(f"Error checking schema: {e}")

if __name__ == "__main__":
    check_profiles_schema()
