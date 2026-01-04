import os
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv(dotenv_path='app/backend/.env')

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

def check_user():
    email = "kerem_aydin@aol.com"
    response = supabase.table("profiles").select("*").eq("email", email).execute()
    if response.data:
        print(f"Found user: {response.data}")
    else:
        print("User not found in profiles table.")

    # Also list current admins
    admins = supabase.table("profiles").select("*").eq("user_number", 1001).execute()
    print(f"Current admins: {admins.data}")

if __name__ == "__main__":
    check_user()
