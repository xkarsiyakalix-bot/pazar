import os
from supabase import create_client
from dotenv import load_dotenv

load_dotenv()

# Initialize Supabase client
supabase = create_client(
    os.getenv('SUPABASE_URL'),
    os.getenv('SUPABASE_KEY')
)

print("="*80)
print("NULL FEDERAL_STATE DEĞERLERİNİ DÜZELTME")
print("="*80)

# Find all listings with NULL federal_state
response = supabase.table('listings').select('id, title, category, sub_category, city, federal_state').is_('federal_state', 'null').execute()

null_listings = response.data

print(f"\nToplam NULL federal_state olan ilan: {len(null_listings)}")
print("\nDetaylar:")
print("-"*80)

for listing in null_listings:
    print(f"\nİlan ID: {listing['id']}")
    print(f"  Başlık: {listing.get('title', 'N/A')}")
    print(f"  Kategori: {listing.get('category', 'N/A')}")
    print(f"  Alt Kategori: {listing.get('sub_category', 'N/A')}")
    print(f"  City: {listing.get('city', 'N/A')}")
    print(f"  Federal State: {listing.get('federal_state', 'NULL')}")
    
    # If city exists, we can use it to set federal_state
    city = listing.get('city')
    if city:
        print(f"  ➜ Önerilen düzeltme: federal_state = '{city}'")

print("\n" + "="*80)
print("SQL DÜZELTME KOMUTU")
print("="*80)

print("\n-- NULL federal_state değerlerini city değeriyle güncelle")
print("UPDATE listings")
print("SET federal_state = city")
print("WHERE federal_state IS NULL AND city IS NOT NULL;")

print("\n-- Kontrol et")
print("SELECT id, title, category, sub_category, city, federal_state")
print("FROM listings")
print("WHERE federal_state IS NULL;")
