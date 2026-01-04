import os
import sys
from supabase import create_client, Client
from dotenv import load_dotenv

def verify():
    print("Loading .env...")
    # Adjust path if necessary, assuming script is run from project root or similar
    env_path = 'app/backend/.env'
    if not os.path.exists(env_path):
        # Fallback for different CWD
        env_path = '.env'
    
    if os.path.exists(env_path):
        load_dotenv(dotenv_path=env_path)
    else:
        print(f"Warning: {env_path} not found, relying on environment variables.")

    url = os.getenv("SUPABASE_URL")
    key = os.getenv("SUPABASE_KEY")
    
    if not url or not key:
        print("Error: SUPABASE_URL or SUPABASE_KEY missing.")
        return
        
    print(f"Connecting to Supabase at {url[:20]}...")
    try:
        supabase: Client = create_client(url, key)
        
        # 1. Verify Admin Access
        print("\n--- Verifying Admin Access ---")
        email = "kerem_aydin@aol.com"
        res = supabase.table("profiles").select("*").eq("email", email).execute()
        
        if res.data:
            user = res.data[0]
            print(f"User found: {user.get('email')}")
            if str(user.get('user_number')) == "1001":
                print("✅ SUCCESS: User is ADMIN (user_number=1001)")
            else:
                print(f"❌ FAILURE: User is NOT admin. user_number={user.get('user_number')}")
        else:
            print(f"❌ User {email} not found in profiles.")

        # 2. Verify Store Fields
        print("\n--- Verifying Store Fields ---")
        # We check by trying to select the new columns. If they don't exist, it might error or return partial data depending on client/API strictness.
        # A better way is to inspect one record.
        try:
            res = supabase.table("profiles").select("store_name,store_logo,is_pro").limit(1).execute()
            print("✅ SUCCESS: 'store_name', 'store_logo', 'is_pro' columns exist and are querying correctly.")
        except Exception as e:
            print(f"❌ FAILURE: Could not query store fields. Error: {e}")

        # 3. Verify Promotions/Gallery Fix
        print("\n--- Verifying Gallery/Promotions ---")
        try:
            # Check if we can read promotions (RLS check)
            res = supabase.table("promotions").select("id", count="exact").limit(1).execute()
            print(f"✅ SUCCESS: Promotions table is accessible. Total estimated count: {res.count}")
            
            # Check if there are gallery listings
            res = supabase.table("listings").select("id").eq("is_gallery", True).execute()
            gallery_count = len(res.data)
            print(f"Gallery Listings Count: {gallery_count}")
            if gallery_count > 0:
                 print("✅ SUCCESS: Gallery listings exist.")
            else:
                 print("⚠️ WARNING: No listings marked as 'is_gallery'. Run master_fix_gallery_and_errors.sql if this is unexpected.")

        except Exception as e:
             print(f"❌ FAILURE: Error checking promotions/gallery: {e}")

    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    verify()
