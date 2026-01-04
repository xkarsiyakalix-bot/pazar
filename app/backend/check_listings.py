import os
from supabase import create_client, Client

url = "https://akyxtjqgvrzzbfogsdnd.supabase.co"
key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFreXh0anFndnJ6emJmb2dzZG5kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY1NzAxNDcsImV4cCI6MjA4MjE0NjE0N30.vcSCQVRNsgW0Jw_dMT7kWucBgYa9qTDGQTqI7jTa-Tw"
supabase: Client = create_client(url, key)

# Fetch latest 20 listings
response = supabase.table("listings").select("*").order("created_at", desc=True).limit(20).execute()

for listing in response.data:
    print(f"ID: {listing.get('id')}, Title: {listing.get('title')}, Category: {listing.get('category')}, SubCategory: {listing.get('sub_category') or listing.get('subCategory')}, Created At: {listing.get('created_at')}")
