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

# Test different categories
categories_to_test = [
    'Eğitim & Kurslar',
    'Otomobil',
    'Emlak',
    'Ev & Bahçe'
]

print("="*80)
print("ŞEHIR FİLTRESİ SAYILARI KONTROLÜ")
print("="*80)

for category in categories_to_test:
    print(f"\n\n{'='*80}")
    print(f"KATEGORİ: {category}")
    print('='*80)
    
    # Fetch all listings from this category
    response = supabase.table('listings').select('id, category, sub_category, federal_state, city').eq('category', category).execute()
    
    listings = response.data
    
    print(f"Toplam ilan sayısı: {len(listings)}")
    
    if len(listings) == 0:
        print("Bu kategoride ilan bulunamadı.")
        continue
    
    # Count by federal_state
    federal_state_counts = Counter()
    
    for listing in listings:
        federal_state = listing.get('federal_state')
        if federal_state:
            federal_state_counts[federal_state] += 1
    
    # Check if federal_state is NULL
    null_federal_state = sum(1 for l in listings if not l.get('federal_state'))
    
    print(f"\nfederal_state alanına göre dağılım:")
    print("-" * 80)
    
    if federal_state_counts:
        for state, count in sorted(federal_state_counts.items(), key=lambda x: x[1], reverse=True)[:10]:
            print(f"  {state}: {count}")
    else:
        print("  Hiç federal_state değeri bulunamadı!")
    
    print(f"\nNULL federal_state: {null_federal_state}")
    
    # Show percentage of NULL values
    if len(listings) > 0:
        null_percentage = (null_federal_state / len(listings)) * 100
        print(f"NULL oranı: {null_percentage:.1f}%")

print("\n\n" + "="*80)
print("SONUÇ:")
print("="*80)
print("""
Şehir filtreleri doğru çalışması için:
1. Her ilanın 'federal_state' alanı dolu olmalı
2. 'federal_state' değerleri Türk şehir isimleriyle eşleşmeli
3. Frontend'deki getTurkishCities() fonksiyonu ile uyumlu olmalı

Eğer NULL değerler varsa veya şehir isimleri eşleşmiyorsa,
filtre sayıları yanlış görünecektir.
""")
