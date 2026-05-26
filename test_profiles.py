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

# 1. Check profiles
req = urllib.request.Request(f"{supabase_url}/rest/v1/profiles?select=id,full_name,avatar_url,store_logo,is_pro,is_commercial,subscription_tier,subscription_expiry,store_slug,user_number&limit=1", headers=headers)
try:
    with urllib.request.urlopen(req) as response:
        print(f"PROFILES Status: {response.status}")
except urllib.error.HTTPError as e:
    print(f"PROFILES ERROR Status: {e.code}")
    print(e.read().decode('utf-8'))

# 2. Check if messages actually exist
req2 = urllib.request.Request(f"{supabase_url}/rest/v1/messages?select=id,sender_id,receiver_id,content,deleted_by_sender,deleted_by_receiver&limit=5", headers=headers)
try:
    with urllib.request.urlopen(req2) as response:
        print(f"MESSAGES Status: {response.status}")
        print(response.read().decode('utf-8'))
except urllib.error.HTTPError as e:
    print(f"MESSAGES ERROR Status: {e.code}")
    print(e.read().decode('utf-8'))
