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
                print("Keys found in listing:")
                print(sorted(listing.keys()))
                print("\nSubcategory values:")
                print(f"subCategory: {listing.get('subCategory')}")
                print(f"sub_category: {listing.get('sub_category')}")
                return
        print("Listing not found")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    get_listing()
