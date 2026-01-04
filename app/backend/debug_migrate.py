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

# Listing to update
listing_id = "f840aadb-9b44-4961-8c47-b337d43e4091"
new_sub_category = "Kediler"

print(f"Attempting to update listing {listing_id} to sub_category='{new_sub_category}'...")

patch_url = f"{url}/rest/v1/listings?id=eq.{listing_id}"
payload = {"sub_category": new_sub_category}

response = requests.patch(patch_url, headers=headers, data=json.dumps(payload))

print(f"Status Code: {response.status_code}")
print(f"Response Text: {response.text}")

if response.status_code == 204 or response.status_code == 200:
    print("✅ Successfully updated!")
else:
    print("❌ Update failed.")
