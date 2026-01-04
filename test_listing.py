import requests
import json

# Test listing data
listing_data = {
    "title": "Samsung Galaxy S23 Ultra",
    "description": "Brandneues Samsung Galaxy S23 Ultra, 256GB, Phantom Black. Originalverpackt mit allen Zubehör.",
    "price": "899 €",
    "category": "Elektronik",
    "subcategory": "Smartphones",
    "condition": "new",
    "price_type": "fixed",
    "images": ["https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800&q=80"],
    "city": "München",
    "postal_code": "80331"
}

# Create listing
response = requests.post(
    "http://localhost:8000/api/listings",
    params={"seller_id": "user_456", "seller_name": "Anna Schmidt"},
    json=listing_data
)

if response.status_code == 200:
    print("✅ Listing created successfully!")
    print(json.dumps(response.json(), indent=2))
else:
    print(f"❌ Error: {response.status_code}")
    print(response.text)

# Get latest listings
print("\n" + "="*50)
print("Latest Listings:")
print("="*50)

response = requests.get("http://localhost:8000/api/listings/latest?limit=5")
if response.status_code == 200:
    listings = response.json()
    print(f"Found {len(listings)} listings:")
    for i, listing in enumerate(listings, 1):
        print(f"\n{i}. {listing['title']}")
        print(f"   Price: {listing['price']}")
        print(f"   City: {listing.get('city', 'N/A')}")
        print(f"   Created: {listing['created_at']}")
else:
    print(f"❌ Error: {response.status_code}")
    print(response.text)
