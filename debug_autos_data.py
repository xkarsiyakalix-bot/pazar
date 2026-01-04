import requests
import json

def debug_autos():
    try:
        r = requests.get('http://localhost:8000/api/listings')
        data = r.json()
        
        print(f"Total listings fetched: {len(data)}")
        
        autos = [l for l in data if l.get('sub_category') == 'Autos' or l.get('subCategory') == 'Autos']
        print(f"Autos found: {len(autos)}")
        
        for i, l in enumerate(autos):
            print(f"\n--- Auto {i+1}: {l.get('title')} ---")
            # Only print keys that are not None and not common/uninformative
            interesting_keys = {
                'id', 'title', 'category', 'sub_category', 'subCategory',
                'marke', 'car_brand', 'modell', 'car_model',
                'fuel_type', 'kraftstoff', 'vehicle_type', 'fahrzeugtyp',
                'federal_state', 'location', 'offer_type', 'offerType',
                'seller_type', 'sellerType', 'condition', 'zustand'
            }
            details = {k: v for k, v in l.items() if k in interesting_keys and v is not None}
            print(json.dumps(details, indent=2, ensure_ascii=False))

    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    debug_autos()
