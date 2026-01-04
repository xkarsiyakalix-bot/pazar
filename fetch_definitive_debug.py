import requests
import json

def get_listing():
    url = "http://localhost:8000/api/listings"
    try:
        response = requests.get(url)
        data = response.json()
        target_id = "b707bb19-ac7b-45df-a5a8-cbd8f25d9461"
        found = False
        for listing in data:
            if listing.get('id') == target_id:
                print(f"Listing found: {listing.get('title')}")
                # Print only relevant fields
                relevant = [
                    'id', 'category', 'sub_category', 'subCategory',
                    'marke', 'car_brand', 'carBrand',
                    'kilometerstand', 'kilometer', 'kilometerStand',
                    'erstzulassung', 'bj',
                    'leistung', 'power',
                    'fuel_type', 'kraftstoff',
                    'getriebe', 'hubraum', 'fahrzeugtyp'
                ]
                filtered = {k: v for k, v in listing.items() if k in relevant}
                print(json.dumps(filtered, indent=2))
                found = True
                break
        if not found:
            print(f"Listing {target_id} not found in {len(data)} listings")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    get_listing()
