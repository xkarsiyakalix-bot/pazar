import requests

def find_potential_cars():
    try:
        r = requests.get('http://localhost:8000/api/listings')
        data = r.json()
        
        keywords = ['auto', 'wagen', 'pkw', 'mercedes', 'bmw', 'audi', 'vw', 'volkswagen', 'ford', 'opel', 'renault', 'kombi', 'limousine']
        
        matches = []
        for l in data:
            cat = (l.get('category') or '').lower()
            if 'auto, rad & boot' in cat:
                continue
            
            title = (l.get('title') or '').lower()
            desc = (l.get('description') or '').lower()
            
            if any(k in title or k in desc for k in keywords):
                matches.append(l)
        
        print(f"Found {len(matches)} potential cars in other categories:")
        for l in matches:
            print(f"- {l.get('title')} ({l.get('category')} / {l.get('sub_category')})")

    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    find_potential_cars()
