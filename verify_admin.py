import os
import sys
from supabase import create_client, Client
from dotenv import load_dotenv

def verify():
    print("Loading .env...")
    env_path = 'app/backend/.env'
    if not os.path.exists(env_path):
        print(f"Error: {env_path} not found")
        return

    load_dotenv(dotenv_path=env_path)
    
    url = os.getenv("SUPABASE_URL")
    key = os.getenv("SUPABASE_KEY")
    
    if not url or not key:
        print("Error: SUPABASE_URL or SUPABASE_KEY missing in .env")
        return
        
    print(f"Connecting to Supabase at {url}...")
    try:
        # Use a simple fetch with a timeout if possible, or just print progress
        supabase: Client = create_client(url, key)
        print("Connected. Fetching user info...")
        
        email = "kerem_aydin@aol.com"
        # Increase timeout if possible via httpx options if needed, 
        # but usually the hanging is due to DNS or network.
        res = supabase.table("profiles").select("*").eq("email", email).execute()
        
        if res.data:
            user = res.data[0]
            print(f"Found user: {user.get('email')} (ID: {user.get('id')})")
            print(f"User Number: {user.get('user_number')}")
            print(f"Status: {user.get('status')}")
            
            if str(user.get('user_number')) == "1001":
                print("SUCCESS: User HAS admin access (user_number=1001)")
            else:
                print(f"WARNING: User DOES NOT have admin access (user_number={user.get('user_number')})")
        else:
            print(f"ERROR: User '{email}' not found in profiles table.")
            # Let's list what *is* there
            all_users = supabase.table("profiles").select("email").limit(5).execute()
            print(f"Existing emails in profiles: {[u['email'] for u in all_users.data]}")
            
    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    verify()
