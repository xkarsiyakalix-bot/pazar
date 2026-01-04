import requests
from collections import Counter

def summarize_autos():
    url = "http://localhost:8000/api/listings"
    try:
        response = requests.get(url)
        data = response.json()
        autos = [l for l in data if l.get('sub_category') == 'Autos' or l.get('subCategory') == 'Autos']
        print(f"Total Autos found: {len(autos)}")
        
        field_counts = Counter()
        for l in autos:
            for k, v in l.items():
                if v is not None and v != "" and v != []:
                    field_counts[k] += 1
        
        print("\nField population summary (count of non-null values):")
        for field, count in field_counts.most_common():
            print(f"{field}: {count}")

    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    summarize_autos()
