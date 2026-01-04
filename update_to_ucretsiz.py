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
print("ÜCRETSİZ VERİLECEKLER → ÜCRETSİZ GÜNCELLEMESİ")
print("="*80)

# Update the subcategory from "Ücretsiz Verilecekler" to "Ücretsiz"
print("\n1. Güncelleme yapılıyor...")
print("-"*80)

result = supabase.table('listings').update({
    'sub_category': 'Ücretsiz'
}).eq('sub_category', 'Ücretsiz Verilecekler').eq('category', 'Ücretsiz & Takas').execute()

print(f"Güncellenen ilan sayısı: {len(result.data) if result.data else 0}")

if result.data:
    for listing in result.data:
        print(f"  ✓ {listing.get('title')} - Alt kategori: {listing.get('sub_category')}")

# Verify the update
print("\n2. Doğrulama:")
print("-"*80)
response = supabase.table('listings').select('id, title, category, sub_category').eq('category', 'Ücretsiz & Takas').execute()

if response.data:
    print(f"\nToplam 'Ücretsiz & Takas' ilanı: {len(response.data)}")
    for listing in response.data:
        print(f"  - {listing.get('title')}: {listing.get('sub_category')}")
else:
    print("Hiç ilan bulunamadı.")

print("\n" + "="*80)
print("✓ GÜNCELLEME TAMAMLANDI!")
print("="*80)
