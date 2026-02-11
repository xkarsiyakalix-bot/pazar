import os
from supabase import create_client
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY") # This should be the service_role key to run DDL

if not SUPABASE_URL or not SUPABASE_KEY:
    print("Error: SUPABASE_URL or SUPABASE_KEY missing.")
    exit(1)

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

def fix_admin_default():
    try:
        # The supabase-py client doesn't support raw SQL directly easily without the REST API or RPC
        # But we can try to use the 'rpc' method if a generic sql runner exists
        # Or more effectively, we can just warn the user to run the SQL in Supabase Dashboard
        # SINCE I cannot guarantee I have the service_role key power to run ALTER TABLE via REST
        
        print("--- DATABASE FIX INSTRUCTIONS ---")
        print("1. Open your Supabase Dashboard (SQL Editor).")
        print("2. Run the following SQL command to fix the issue:")
        print("")
        print("ALTER TABLE public.profiles ALTER COLUMN admin_role DROP DEFAULT;")
        print("UPDATE public.profiles SET is_admin = false, admin_role = NULL WHERE email != 'kerem_aydin@aol.com' AND user_number != 1001;")
        print("")
        print("---------------------------------")
        
        # We can at least try to clean up the existing ones via the client
        print("Attempting to clean up unauthorized admins in the profiles table...")
        
        # Get all profiles
        response = supabase.table("profiles").select("*").execute()
        profiles = response.data
        
        for profile in profiles:
            # Skip Kerem and System user 1001
            if profile.get('email') == 'kerem_aydin@aol.com' or profile.get('user_number') == 1001:
                continue
            
            # If they are admin, reset them
            if profile.get('is_admin') or profile.get('admin_role'):
                print(f"Resetting admin status for: {profile.get('email') or profile.get('id')}")
                supabase.table("profiles").update({
                    "is_admin": False,
                    "admin_role": None
                }).eq("id", profile.get('id')).execute()
                
        print("Cleanup complete.")
        
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    fix_admin_default()
