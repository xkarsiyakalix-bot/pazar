
import os
import asyncio
from supabase import create_client, Client

url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_KEY")
supabase: Client = create_client(url, key)

async def check_db():
    try:
        # Fetch a few listings to check columns
        response = supabase.table('listings').select('*').eq('sub_category', 'Oturma Odası').limit(5).execute()
        listings = response.data
        
        if not listings:
            print("No 'Oturma Odası' listings found.")
            # check if we can select the column specifically to see if it errors
            try:
                supabase.table('listings').select('wohnzimmer_art').limit(1).execute()
                print("Column 'wohnzimmer_art' exists (select successful).")
            except Exception as e:
                print(f"Column 'wohnzimmer_art' check failed: {e}")
            return

        print(f"Found {len(listings)} listings.")
        
        # Check keys of the first listing
        keys = listings[0].keys()
        if 'wohnzimmer_art' in keys:
            print("Column 'wohnzimmer_art' EXISTS.")
        else:
            print("Column 'wohnzimmer_art' DOES NOT EXIST.")

        # Count occurrences of values
        response_all = supabase.table('listings').select('wohnzimmer_art').eq('sub_category', 'Oturma Odası').execute()
        counts = {}
        for item in response_all.data:
            val = item.get('wohnzimmer_art', 'None')
            counts[val] = counts.get(val, 0) + 1
            
        print("\nValue Counts:")
        for val, count in counts.items():
            print(f"{val}: {count}")

    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    asyncio.run(check_db())
