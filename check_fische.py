import os
from supabase import create_client, Client
from dotenv import load_dotenv

# Load environment variables
load_dotenv(dotenv_path='app/frontend/.env')

url: str = os.environ.get("REACT_APP_SUPABASE_URL")
key: str = os.environ.get("REACT_APP_SUPABASE_ANON_KEY")
supabase: Client = create_client(url, key)

def check_fische():
    print("Checking Fische listings...")
    response = supabase.table('listings').select('id, title, category, sub_category, fische_art').eq('sub_category', 'Fische').execute()
    listings = response.data
    
    if not listings:
        print("No 'Fische' listings found with exact match. Trying case-insensitive or partial...")
        all_subs = supabase.table('listings').select('sub_category').execute()
        unique_subs = set(l['sub_category'] for l in all_subs.data if l['sub_category'])
        print(f"Unique sub_categories found: {unique_subs}")
        return

    print(f"Found {len(listings)} Fische listings.")
    for l in listings[:5]:
        print(f"ID: {l['id']}, Title: {l['title']}, SubCat: {l['sub_category']}, Art: {l['fische_art']}")
    
    # Check unique fische_art values
    arts = set(l['fische_art'] for l in listings if l['fische_art'])
    print(f"Unique fische_art values in DB: {arts}")

if __name__ == "__main__":
    check_fische()
