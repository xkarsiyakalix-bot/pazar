import os
import json
import urllib.request

env_vars = {}
with open('app/frontend/.env', 'r') as f:
    for line in f:
        line = line.strip()
        if line and not line.startswith('#'):
            key, val = line.split('=', 1)
            env_vars[key.strip()] = val.strip()

supabase_url = env_vars.get('REACT_APP_SUPABASE_URL')
supabase_key = env_vars.get('REACT_APP_SUPABASE_ANON_KEY')

headers = {
    'apikey': supabase_key,
    'Authorization': f'Bearer {supabase_key}'
}

req = urllib.request.Request(f"{supabase_url}/rest/v1/profiles?select=*&limit=1", headers=headers)
try:
    with urllib.request.urlopen(req) as response:
        print(f"PROFILES Status: {response.status}")
        print(response.read().decode('utf-8'))
except urllib.error.HTTPError as e:
    print(f"PROFILES ERROR Status: {e.code}")
    print(e.read().decode('utf-8'))
