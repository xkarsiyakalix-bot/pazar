#!/usr/bin/env python3
import os
import sys
from supabase import create_client, Client

# Supabase credentials
url = "https://hqxvbqwmkwkbgxlxgvpz.supabase.co"
key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhxeHZicXdta3drYmd4bHhndnB6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ5NjU0NjYsImV4cCI6MjA1MDU0MTQ2Nn0.cKPMJGMCOOJkD3TN-zQJhvdQIVCKCEfqrSNKGRZPbHs"

supabase: Client = create_client(url, key)

print("=" * 80)
print("Checking 'Ücretsiz & Takas' Category")
print("=" * 80)

# Check category
response = supabase.table('categories').select('*').eq('name', 'Ücretsiz & Takas').execute()
print(f"\nCategory 'Ücretsiz & Takas':")
if response.data:
    for cat in response.data:
        print(f"  ID: {cat['id']}")
        print(f"  Name: {cat['name']}")
        print(f"  Slug: {cat.get('slug', 'N/A')}")
else:
    print("  NOT FOUND")

# Check subcategory
print("\n" + "=" * 80)
print("Checking 'Ücretsiz' Subcategory")
print("=" * 80)

response = supabase.table('subcategories').select('*').eq('name', 'Ücretsiz').execute()
print(f"\nSubcategory 'Ücretsiz':")
if response.data:
    for sub in response.data:
        print(f"  ID: {sub['id']}")
        print(f"  Name: {sub['name']}")
        print(f"  Slug: {sub.get('slug', 'N/A')}")
        print(f"  Category ID: {sub.get('category_id', 'N/A')}")
else:
    print("  NOT FOUND")

# Check all subcategories for this category
print("\n" + "=" * 80)
print("All Subcategories for 'Ücretsiz & Takas'")
print("=" * 80)

if response.data:
    cat_id = response.data[0].get('category_id')
    if cat_id:
        response = supabase.table('subcategories').select('*').eq('category_id', cat_id).execute()
        if response.data:
            for sub in response.data:
                print(f"\n  - {sub['name']}")
                print(f"    Slug: {sub.get('slug', 'N/A')}")
                print(f"    ID: {sub['id']}")

# Check listings count
print("\n" + "=" * 80)
print("Checking Listings Count")
print("=" * 80)

response = supabase.table('listings').select('id', count='exact').eq('category', 'Ücretsiz & Takas').eq('sub_category', 'Ücretsiz').execute()
print(f"\nListings with category='Ücretsiz & Takas' and sub_category='Ücretsiz': {response.count}")

# Check all listings for this category
response = supabase.table('listings').select('id', count='exact').eq('category', 'Ücretsiz & Takas').execute()
print(f"Total listings with category='Ücretsiz & Takas': {response.count}")

print("\n" + "=" * 80)
