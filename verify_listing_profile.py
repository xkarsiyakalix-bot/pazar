import os
import sys
import json
from supabase import create_client, Client
from dotenv import load_dotenv

def verify():
    # Load env
    env_path = 'app/backend/.env'
    if not os.path.exists(env_path):
        env_path = '.env'
    load_dotenv(dotenv_path=env_path)

    url = os.getenv("SUPABASE_URL")
    key = os.getenv("SUPABASE_KEY")
    
    if not url or not key:
        print("Error: SUPABASE_URL or SUPABASE_KEY missing.")
        return

    supabase: Client = create_client(url, key)

    print("Fetching a random listing to test join...")
    # Get a listing ID
    try:
        res = supabase.table("listings").select("id").limit(1).execute()
        if not res.data:
            print("No listings found to verify.")
            return
        
        listing_id = res.data[0]['id']
        print(f"Testing with Listing ID: {listing_id}")

        # TEST THE QUERY
        # We mimic: .select('*, profiles(full_name, avatar_url, is_pro, is_commercial, subscription_tier, user_number)')
        # Note: In python supabase client, the select string is passed directly.
        select_str = "*, profiles(full_name, avatar_url, is_pro, is_commercial, subscription_tier, user_number)"
        
        query_res = supabase.table("listings") \
            .select(select_str) \
            .eq("id", listing_id) \
            .single() \
            .execute()
        
        data = query_res.data
        print("Query successful.")
        
        if 'profiles' in data:
             if data['profiles']:
                print("✅ 'profiles' data included in response.")
                print(f"   Profile Data: {json.dumps(data['profiles'], indent=2)}")
                if 'avatar_url' in data['profiles']:
                    print("✅ 'avatar_url' field is present.")
                else:
                    print("⚠️ 'avatar_url' missing from profiles object.")
             else:
                print("⚠️ 'profiles' key exists but value is null. (Listing might belong to deleted user?)")
        else:
             print("❌ 'profiles' object MISSING from response.")
             
    except Exception as e:
        print(f"❌ Query Failed: {e}")

if __name__ == "__main__":
    verify()
