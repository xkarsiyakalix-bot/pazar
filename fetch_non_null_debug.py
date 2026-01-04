import requests
import json

def get_listing():
    url = "http://localhost:8000/api/listings"
    try:
        response = requests.get(url)
        data = response.json()
        target_id = "b707bb19-ac7b-45df-a5a8-cbd8f25d9461"
        for listing in data:
            if listing.get('id') == target_id:
                print(f"Non-null fields for {listing.get('title')}:")
                filtered = {k: v for k, v in listing.items() if v is not None}
                print(json.dumps(filtered, indent=2))
                return
        print("Listing not found")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    get_listing()
