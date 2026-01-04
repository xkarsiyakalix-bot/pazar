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
                km = listing.get('kilometerstand')
                ez = listing.get('erstzulassung')
                ls = listing.get('leistung')
                print(f"kilometerstand: {km} (Type: {type(km)})")
                print(f"erstzulassung: {ez} (Type: {type(ez)})")
                print(f"leistung: {ls} (Type: {type(ls)})")
                return
        print("Listing not found")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    get_listing()
