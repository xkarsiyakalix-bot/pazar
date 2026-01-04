import os
from supabase import create_client
from collections import Counter
from dotenv import load_dotenv

load_dotenv()

# Initialize Supabase client
supabase = create_client(
    os.getenv('SUPABASE_URL'),
    os.getenv('SUPABASE_KEY')
)

# Fetch all listings from "Eğitim & Kurslar" category
response = supabase.table('listings').select('id, category, sub_category, federal_state, city').eq('category', 'Eğitim & Kurslar').execute()

listings = response.data

print(f"Total listings in 'Eğitim & Kurslar': {len(listings)}")
print("\n" + "="*80)

# Count by federal_state
federal_state_counts = Counter()
city_counts = Counter()

for listing in listings:
    federal_state = listing.get('federal_state')
    city = listing.get('city')
    
    if federal_state:
        federal_state_counts[federal_state] += 1
    if city:
        city_counts[city] += 1

print("\nCounts by federal_state field:")
print("-" * 80)
for state, count in sorted(federal_state_counts.items(), key=lambda x: x[1], reverse=True):
    print(f"{state}: {count}")

print("\n" + "="*80)
print("\nCounts by city field:")
print("-" * 80)
for city, count in sorted(city_counts.items(), key=lambda x: x[1], reverse=True)[:20]:
    print(f"{city}: {count}")

# Check if federal_state is NULL
null_federal_state = sum(1 for l in listings if not l.get('federal_state'))
print(f"\n\nListings with NULL federal_state: {null_federal_state}")

# Show sample listings
print("\n" + "="*80)
print("\nSample listings (first 5):")
print("-" * 80)
for listing in listings[:5]:
    print(f"ID: {listing['id']}")
    print(f"  Category: {listing.get('category')}")
    print(f"  Sub-category: {listing.get('sub_category')}")
    print(f"  Federal State: {listing.get('federal_state')}")
    print(f"  City: {listing.get('city')}")
    print()
