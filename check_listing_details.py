#!/usr/bin/env python3
import os
import sys

# Supabase bağlantısı için gerekli modülleri import et
sys.path.insert(0, '/Volumes/Kerem Aydin/Projeler/Kleinanzegen/12.12.2025/app/backend')

try:
    from supabase import create_client, Client
    
    # Supabase credentials
    url = "https://hqxvbqwmkwkbgxlxgvpz.supabase.co"
    key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhxeHZicXdta3drYmd4bHhndnB6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ5NjU0NjYsImV4cCI6MjA1MDU0MTQ2Nn0.cKPMJGMCOOJkD3TN-zQJhvdQIVCKCEfqrSNKGRZPbHs"
    
    supabase: Client = create_client(url, key)
    
    listing_id = "854989e7-4446-4b02-9479-bfb50fa42e6a"
    
    print("=" * 80)
    print(f"İlan Detayları: {listing_id}")
    print("=" * 80)
    
    # İlanı çek
    response = supabase.table('listings').select('*').eq('id', listing_id).execute()
    
    if response.data and len(response.data) > 0:
        listing = response.data[0]
        print(f"\n✅ İlan bulundu!\n")
        print(f"Başlık: {listing.get('title', 'N/A')}")
        print(f"Kategori: {listing.get('category', 'N/A')}")
        print(f"Alt Kategori: {listing.get('sub_category', 'N/A')}")
        print(f"Fiyat: {listing.get('price', 'N/A')}")
        print(f"Durum: {listing.get('condition', 'N/A')}")
        print(f"Şehir: {listing.get('federal_state', 'N/A')}")
        print(f"Satıcı Tipi: {listing.get('seller_type', 'N/A')}")
        print(f"Oluşturulma: {listing.get('created_at', 'N/A')}")
        
        print("\n" + "=" * 80)
        print("SORUN TESPİTİ:")
        print("=" * 80)
        
        category = listing.get('category', '')
        sub_category = listing.get('sub_category', '')
        
        print(f"\nKategori: '{category}'")
        print(f"Alt Kategori: '{sub_category}'")
        
        # Beklenen değerler
        expected_category = "Hizmetler"
        expected_sub_variations = [
            "Otomobil, Bisiklet & Tekne",
            "Otomobil, Bisiklet & Tekne Servisi",
            "Oto, Bisiklet & Tekne Servisi"
        ]
        
        print(f"\nBeklenen Kategori: '{expected_category}'")
        print(f"Beklenen Alt Kategoriler (herhangi biri): {expected_sub_variations}")
        
        if category != expected_category:
            print(f"\n❌ SORUN: Kategori eşleşmiyor!")
            print(f"   Veritabanında: '{category}'")
            print(f"   Beklenen: '{expected_category}'")
        else:
            print(f"\n✅ Kategori doğru")
            
        if sub_category not in expected_sub_variations:
            print(f"\n❌ SORUN: Alt kategori eşleşmiyor!")
            print(f"   Veritabanında: '{sub_category}'")
            print(f"   Beklenen değerlerden biri: {expected_sub_variations}")
        else:
            print(f"\n✅ Alt kategori doğru")
            
    else:
        print("\n❌ İlan bulunamadı!")
        
    print("\n" + "=" * 80)
    
except Exception as e:
    print(f"Hata: {e}")
    import traceback
    traceback.print_exc()
