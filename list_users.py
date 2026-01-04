import os
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv(dotenv_path='app/backend/.env')

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

def list_users():
    response = supabase.table("profiles").select("id, email").execute()
    print(f"Users in profiles: {response.data}")

if __name__ == "__main__":
    list_users()
