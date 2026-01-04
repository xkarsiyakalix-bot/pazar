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
print("FEDERAL_STATE DEĞERLERİNİ GÜNCELLEME")
print("="*80)

# First, check current state
print("\n1. ÖNCEKİ DURUM:")
print("-"*80)
response = supabase.table('listings').select('id, title, sub_category, city, federal_state').is_('federal_state', 'null').execute()
before = response.data
print(f"NULL federal_state olan ilan sayısı: {len(before)}")
for listing in before:
    print(f"  - {listing.get('sub_category')}: city='{listing.get('city')}', federal_state=NULL")

# Update NULL federal_state values
print("\n2. GÜNCELLEME YAPILIYOR...")
print("-"*80)

updated_count = 0
for listing in before:
    if listing.get('city'):
        result = supabase.table('listings').update({
            'federal_state': listing['city']
        }).eq('id', listing['id']).execute()
        
        if result.data:
            print(f"✓ İlan {listing['id']} güncellendi: federal_state = '{listing['city']}'")
            updated_count += 1

print(f"\nToplam {updated_count} ilan güncellendi.")

# Verify the fix
print("\n3. SONRAKI DURUM:")
print("-"*80)
response = supabase.table('listings').select('id, title, sub_category, city, federal_state').is_('federal_state', 'null').execute()
after = response.data
print(f"NULL federal_state olan ilan sayısı: {len(after)}")

# Show all Eğitim & Kurslar listings
print("\n4. EĞİTİM & KURSLAR KATEGORİSİ - ŞEHİR DAĞILIMI:")
print("-"*80)
response = supabase.table('listings').select('id, sub_category, federal_state').eq('category', 'Eğitim & Kurslar').execute()
all_listings = response.data

from collections import Counter
city_counts = Counter()
for listing in all_listings:
    fs = listing.get('federal_state')
    if fs:
        city_counts[fs] += 1

print("\nŞehir bazında ilan sayıları:")
for city, count in sorted(city_counts.items(), key=lambda x: x[1], reverse=True):
    print(f"  {city}: {count}")

# Show by subcategory
print("\n5. ALT KATEGORİ BAZINDA:")
print("-"*80)
subcats = {}
for listing in all_listings:
    sub = listing.get('sub_category', 'Unknown')
    if sub not in subcats:
        subcats[sub] = []
    subcats[sub].append(listing.get('federal_state'))

for sub, cities in sorted(subcats.items()):
    city_count = Counter(cities)
    print(f"\n{sub}:")
    for city, count in sorted(city_count.items()):
        if city:
            print(f"  {city}: {count}")
        else:
            print(f"  NULL: {count}")

print("\n" + "="*80)
print("✓ GÜNCELLEME TAMAMLANDI!")
print("="*80)
print("\nŞimdi şehir filtreleri doğru sayıları gösterecek.")
print("Sayfayı yenileyerek kontrol edebilirsin:")
print("  - http://localhost:3000/Egitim-Kurslar")
print("  - http://localhost:3000/Egitim-Kurslar/Dil-Kurslari")
