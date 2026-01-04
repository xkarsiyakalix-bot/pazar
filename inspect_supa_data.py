
import os
import asyncio
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv('.env', override=True)

async def main():
    url = os.environ.get('SUPABASE_URL')
    key = os.environ.get('SUPABASE_KEY')
    
    if not url or not key:
        print("SUPABASE_URL or SUPABASE_KEY not found in environment")
        return

    print(f"Connecting to Supabase at {url}")
    supabase: Client = create_client(url, key)
    
    # Check listings with Handarbeit category
    category = "Freizeit, Hobby & Nachbarschaft"
    sub_category = "Handarbeit, Basteln & Kunsthandwerk"
    
    print(f"Checking listings for {sub_category}...")
    
    response = supabase.table('listings') \
        .select('*') \
        .eq('sub_category', sub_category) \
        .limit(5) \
        .execute()
    
    listings = response.data
    
    # Also check if versand column exists or what data structure is
    print(f"Found {len(listings)} listings.")
    for listing in listings:
        print(f"ID: {listing.get('id')}")
        print(f"Title: {listing.get('title')}")
        print(f"Versand: {listing.get('versand')}")
        print(f"Versand Art: {listing.get('versand_art')}")
        print("-" * 20)

if __name__ == "__main__":
    asyncio.run(main())
