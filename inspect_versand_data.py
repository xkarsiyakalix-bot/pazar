
import os
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv


load_dotenv('.env', override=True)
if not os.environ.get('MONGO_URL'):
    load_dotenv('app/backend/.env', override=True)


async def main():
    mongo_url = os.environ.get('MONGO_URL')
    if not mongo_url:
        print("MONGO_URL not found in environment")
        return

    client = AsyncIOMotorClient(mongo_url)
    db = client[os.environ.get('DB_NAME', 'kleinanzeigen')]
    
    # Check listings with Handarbeit category
    category = "Freizeit, Hobby & Nachbarschaft"
    sub_category = "Handarbeit, Basteln & Kunsthandwerk"
    
    print(f"Checking listings for {sub_category}...")
    cursor = db.listings.find({"subCategory": sub_category}).limit(5)
    
    listings = await cursor.to_list(length=5)
    for listing in listings:
        print(f"ID: {listing.get('id')}")
        print(f"Title: {listing.get('title')}")
        print(f"Versand Art: {listing.get('versand_art')}")
        print(f"Versand (legacy): {listing.get('versand')}")
        print("-" * 20)

if __name__ == "__main__":
    asyncio.run(main())
