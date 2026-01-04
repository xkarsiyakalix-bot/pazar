import os
import requests
import json

url = "https://akyxtjqgvrzzbfogsdnd.supabase.co"
key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFreXh0anFndnJ6emJmb2dzZG5kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY1NzAxNDcsImV4cCI6MjA4MjE0NjE0N30.vcSCQVRNsgW0Jw_dMT7kWucBgYa9qTDGQTqI7jTa-Tw"

headers = {
    "apikey": key,
    "Authorization": f"Bearer {key}",
    "Content-Type": "application/json",
    "Prefer": "return=minimal"
}

mapping = {
    "Balık": "Balıklar",
    "Köpek": "Köpekler",
    "Kedi": "Kediler",
    "Küçükbaş Hayvanlar": "Küçük Hayvanlar",
    "Kümes Hayvanları": "Çiftlik Hayvanları",
    "At": "Atlar",
    "Kuş": "Kuşlar",
    "Hayvan Aksesuarları": "Aksesuarlar"
}

total_updated = 0

for singular, plural in mapping.items():
    print(f"Migrating '{singular}' to '{plural}'...")
    patch_url = f"{url}/rest/v1/listings?category=eq.Evcil%20Hayvanlar&sub_category=eq.{singular}"
    payload = {"sub_category": plural}
    
    # We use return=representation to see how many rows were updated if needed, 
    # but return=minimal is faster. Since we want a count, let's use representation.
    headers["Prefer"] = "return=representation"
    response = requests.patch(patch_url, headers=headers, data=json.dumps(payload))
    
    if response.status_code in [200, 204]:
        data = response.json() if response.status_code == 200 else []
        count = len(data)
        print(f"  Successfully updated {count} rows.")
        total_updated += count
    else:
        print(f"  ❌ Failed to update '{singular}': {response.status_code} {response.text}")

print(f"\nMigration finished. Total pet listings updated: {total_updated}")
