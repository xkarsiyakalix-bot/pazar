import requests
import json

def inspect_autos():
    url = "http://localhost:8000/api/listings"
    try:
        response = requests.get(url)
        data = response.json()
        autos = [l for l in data if l.get('sub_category') == 'Autos' or l.get('subCategory') == 'Autos']
        print(f"Found {len(autos)} autos.")
        for i, l in enumerate(autos[:5]):
            print(f"\n--- Listing {i+1}: {l.get('title')} ---")
            # Sort keys for easier comparison
            for k in sorted(l.keys()):
                if l[k] is not None:
                    print(f"{k}: {l[k]} (Type: {type(l[k])})")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    inspect_autos()
