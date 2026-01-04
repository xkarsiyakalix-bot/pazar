#!/usr/bin/env python3
"""Check image URLs in listings"""

import os
from supabase import create_client, Client

# Initialize Supabase client
url = os.environ.get("SUPABASE_URL", "https://ynleaatvkftkafiyqufv.supabase.co")
key = os.environ.get("SUPABASE_KEY", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlubGVhYXR2a2Z0a2FmaXlxdWZ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ3MzA4ODIsImV4cCI6MjA4MDMwNjg4Mn0.Ym945vCX_d2eL1-RlE4xXVwo4uGrxWUZeJgyOiHgVEA")
supabase: Client = create_client(url, key)

def check_images():
    """Check image URLs in top listings"""
    try:
        # Get top listings
        response = supabase.table('listings').select('id, title, images, is_top').eq('is_top', True).limit(5).execute()
        
        print(f"\n📸 Checking images in top listings:")
        print(f"   Found {len(response.data)} top listings\n")
        
        for listing in response.data:
            print(f"📋 {listing['title'][:50]}...")
            print(f"   ID: {listing['id']}")
            print(f"   Images field type: {type(listing['images'])}")
            print(f"   Images content: {listing['images']}")
            
            if listing['images']:
                if isinstance(listing['images'], list):
                    print(f"   ✅ Images is a list with {len(listing['images'])} items")
                    if len(listing['images']) > 0:
                        print(f"   First image: {listing['images'][0]}")
                else:
                    print(f"   ⚠️  Images is not a list!")
            else:
                print(f"   ❌ No images!")
            print()
            
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    check_images()
