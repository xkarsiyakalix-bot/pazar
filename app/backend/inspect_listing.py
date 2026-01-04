import os
from supabase import create_client, Client

url = "https://akyxtjqgvrzzbfogsdnd.supabase.co"
key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFreXh0anFndnJ6emJmb2dzZG5kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY1NzAxNDcsImV4cCI6MjA4MjE0NjE0N30.vcSCQVRNsgW0Jw_dMT7kWucBgYa9qTDGQTqI7jTa-Tw"
supabase: Client = create_client(url, key)

listing_id = "f840aadb-9b44-4961-8c47-b337d43e4091"
response = supabase.table("listings").select("*").eq("id", listing_id).single().execute()

data = response.data
import json
print(json.dumps(data, indent=2))
