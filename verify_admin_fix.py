import os
import sys
from supabase import create_client, Client
from dotenv import load_dotenv

def verify():
    print("Loading env vars...")
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
        supabase: Client = create_client(url, key)
        print("Connected.")
        
        # Check profiles table keys
        print("\nChecking profiles columns...")
        res = supabase.table("profiles").select("*").limit(1).execute()
        if res.data:
            keys = list(res.data[0].keys())
            print("Profile columns present in DB:", keys)
            
            missing_cols = []
            for col in ['is_admin', 'admin_role', 'user_number']:
                if col not in keys:
                    missing_cols.append(col)
            
            if missing_cols:
                print(f"❌ Missing columns: {missing_cols}")
            else:
                print("✅ All required columns (is_admin, admin_role, user_number) exist!")
        else:
            print("profiles table is empty, cannot inspect columns.")

        # Check Kerem's user status
        email = "kerem_aydin@aol.com"
        print(f"\nChecking status of {email}...")
        res_user = supabase.table("profiles").select("*").eq("email", email).execute()
        if res_user.data:
            user = res_user.data[0]
            print("User details:")
            for k in ['email', 'user_number', 'is_admin', 'admin_role']:
                print(f"  {k}: {user.get(k)}")
            
            if str(user.get('user_number')) == '1001' and user.get('is_admin') is True and user.get('admin_role') == 'super_admin':
                print("✅ User is successfully set as admin!")
            else:
                print("❌ User is NOT set as admin yet.")
        else:
            print("❌ User not found in profiles.")

    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    verify()
