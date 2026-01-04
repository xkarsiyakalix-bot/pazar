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
print("ÖDÜNÇ VERME İLANLARINI KONTROL ETME")
print("="*80)

# Check for listings in "Ücretsiz & Takas" category with "Ödünç Verme" subcategory
print("\n1. 'Ücretsiz & Takas' kategorisindeki tüm ilanlar:")
print("-"*80)
response = supabase.table('listings').select('id, title, category, sub_category, created_at').eq('category', 'Ücretsiz & Takas').execute()
listings = response.data

print(f"Toplam ilan sayısı: {len(listings)}")

if listings:
    print("\nAlt kategorilere göre dağılım:")
    from collections import Counter
    subcats = Counter(l.get('sub_category') for l in listings)
    for subcat, count in subcats.items():
        print(f"  {subcat}: {count}")
    
    print("\n\nTüm ilanlar:")
    for listing in listings:
        print(f"\n  ID: {listing['id']}")
        print(f"  Başlık: {listing.get('title')}")
        print(f"  Kategori: {listing.get('category')}")
        print(f"  Alt Kategori: {listing.get('sub_category')}")
        print(f"  Oluşturulma: {listing.get('created_at')}")

# Check for possible variations
print("\n\n2. Olası varyasyonları kontrol et:")
print("-"*80)

variations = [
    'Ödünç Verme',
    'Verleihen',
    'Kiralama',
    'ödünç verme',
    'verleihen'
]

for var in variations:
    response = supabase.table('listings').select('id, title, sub_category').ilike('sub_category', var).execute()
    if response.data:
        print(f"\n'{var}' ile eşleşen ilanlar: {len(response.data)}")
        for listing in response.data:
            print(f"  - {listing.get('title')} (sub_category: '{listing.get('sub_category')}')")

print("\n\n3. En son eklenen 5 ilan:")
print("-"*80)
response = supabase.table('listings').select('id, title, category, sub_category, created_at').order('created_at', desc=True).limit(5).execute()
recent = response.data

for listing in recent:
    print(f"\n  Başlık: {listing.get('title')}")
    print(f"  Kategori: {listing.get('category')}")
    print(f"  Alt Kategori: {listing.get('sub_category')}")
    print(f"  Oluşturulma: {listing.get('created_at')}")
