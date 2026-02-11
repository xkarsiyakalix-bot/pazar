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

def check_user():
    email = 'kerem_aydin@aol.com'
    response = supabase.table("profiles").select("*").eq("email", email).execute()
    if response.data:
        user = response.data[0]
        print(f"User: {user['email']}, is_admin: {user['is_admin']}, admin_role: {user['admin_role']}")
        if not user['is_admin']:
            print("Updating user to be admin...")
            update_res = supabase.table("profiles").update({"is_admin": True}).eq("id", user['id']).execute()
            print("Update response:", update_res)
    else:
        print("User not found")

if __name__ == "__main__":
    check_user()
