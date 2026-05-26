import os
import requests
import json
from dotenv import load_dotenv

load_dotenv('app/frontend/.env')

supabase_url = os.getenv('REACT_APP_SUPABASE_URL')
supabase_key = os.getenv('REACT_APP_SUPABASE_ANON_KEY')

print(f"URL: {supabase_url}")

headers = {
    'apikey': supabase_key,
    'Authorization': f'Bearer {supabase_key}'
}

# Try to select from messages
response = requests.get(f"{supabase_url}/rest/v1/messages?select=id&limit=1", headers=headers)
print(f"Status: {response.status_code}")
try:
    print(response.json())
except:
    print(response.text)
