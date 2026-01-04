#!/usr/bin/env python3
"""Check and update top listings in Supabase"""

import os
from supabase import create_client, Client

# Initialize Supabase client
url = os.environ.get("SUPABASE_URL", "https://ynleaatvkftkafiyqufv.supabase.co")
key = os.environ.get("SUPABASE_KEY", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlubGVhYXR2a2Z0a2FmaXlxdWZ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ3MzA4ODIsImV4cCI6MjA4MDMwNjg4Mn0.Ym945vCX_d2eL1-RlE4xXVwo4uGrxWUZeJgyOiHgVEA")
supabase: Client = create_client(url, key)

def check_top_listings():
    """Check how many listings have is_top = true"""
    try:
        # Count total listings
        total_response = supabase.table('listings').select('id', count='exact').execute()
        total_count = total_response.count
        
        # Count top listings
        top_response = supabase.table('listings').select('id, title, is_top', count='exact').eq('is_top', True).limit(10).execute()
        top_count = top_response.count
        
        print(f"\n📊 Listing Statistics:")
        print(f"   Total listings: {total_count}")
        print(f"   Top listings (is_top=true): {top_count}")
        
        if top_count > 0:
            print(f"\n✅ Sample top listings:")
            for listing in top_response.data[:5]:
                print(f"   - {listing['title'][:50]}...")
        else:
            print(f"\n⚠️  No listings with is_top=true found!")
            print(f"   Setting first 20 listings as top listings...")
            
            # Get first 20 listings
            listings_response = supabase.table('listings').select('id').limit(20).execute()
            
            # Update them to be top listings
            for listing in listings_response.data:
                supabase.table('listings').update({'is_top': True}).eq('id', listing['id']).execute()
            
            print(f"   ✅ Updated {len(listings_response.data)} listings to is_top=true")
            
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    check_top_listings()
