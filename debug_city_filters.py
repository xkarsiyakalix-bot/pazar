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

print("="*80)
print("ŞEHİR FİLTRESİ DEBUG - EĞİTİM & KURSLAR")
print("="*80)

# 1. Ana kategori: Eğitim & Kurslar (tüm alt kategoriler)
print("\n1. ANA KATEGORİ: Eğitim & Kurslar")
print("-"*80)
response = supabase.table('listings').select('id, category, sub_category, federal_state, city').eq('category', 'Eğitim & Kurslar').execute()
main_listings = response.data

print(f"Toplam ilan: {len(main_listings)}")

federal_state_counts = Counter()
for listing in main_listings:
    fs = listing.get('federal_state')
    if fs:
        federal_state_counts[fs] += 1

print("\nŞehir dağılımı:")
for state, count in sorted(federal_state_counts.items(), key=lambda x: x[1], reverse=True):
    print(f"  {state}: {count}")

null_count = sum(1 for l in main_listings if not l.get('federal_state'))
print(f"\nNULL federal_state: {null_count}")

# 2. Alt kategori: Dil Kursları
print("\n\n2. ALT KATEGORİ: Dil Kursları")
print("-"*80)

# Try different variations
variations = [
    'Dil Kursları',
    'Sprachkurse',
    'dil kursları',
    'sprachkurse'
]

for var in variations:
    response = supabase.table('listings').select('id, category, sub_category, federal_state').eq('category', 'Eğitim & Kurslar').eq('sub_category', var).execute()
    if response.data:
        print(f"\n'{var}' ile eşleşen ilanlar: {len(response.data)}")
        for listing in response.data:
            print(f"  - ID: {listing['id']}, federal_state: {listing.get('federal_state')}")

# Get all unique subcategories
print("\n\n3. TÜM ALT KATEGORİLER (Eğitim & Kurslar)")
print("-"*80)
subcats = set()
for listing in main_listings:
    sub = listing.get('sub_category')
    if sub:
        subcats.add(sub)

print("Bulunan alt kategoriler:")
for sub in sorted(subcats):
    count = sum(1 for l in main_listings if l.get('sub_category') == sub)
    print(f"  - {sub}: {count} ilan")

# 4. Check if there's a mismatch in category names
print("\n\n4. KATEGORİ İSİMLERİ KONTROLÜ")
print("-"*80)
all_categories = set()
for listing in main_listings:
    cat = listing.get('category')
    if cat:
        all_categories.add(cat)

print("Bulunan kategori isimleri:")
for cat in sorted(all_categories):
    print(f"  - '{cat}'")

# 5. Sample data
print("\n\n5. ÖRNEK VERİ (İlk 3 ilan)")
print("-"*80)
for i, listing in enumerate(main_listings[:3], 1):
    print(f"\nİlan {i}:")
    print(f"  ID: {listing['id']}")
    print(f"  Category: '{listing.get('category')}'")
    print(f"  Sub-category: '{listing.get('sub_category')}'")
    print(f"  Federal State: '{listing.get('federal_state')}'")
    print(f"  City: '{listing.get('city')}'")
