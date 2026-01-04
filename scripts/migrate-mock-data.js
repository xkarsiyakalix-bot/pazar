/**
 * Mock Data Migration Script
 * 
 * Bu script mock listings'leri Supabase'e migrate eder.
 * 
 * KULLANIM:
 * 1. Önce Supabase'de bir test kullanıcısı oluşturun (Register sayfasından)
 * 2. Kullanıcı ID'sini alın (Supabase Dashboard > Authentication > Users)
 * 3. Bu dosyada TEST_USER_ID'yi güncelleyin
 * 4. Terminal'de: node scripts/migrate-mock-data.js
 */

import { createClient } from '@supabase/supabase-js';
import { mockListings } from '../src/components.js';

// Supabase credentials
const supabaseUrl = 'https://ynleaatvkftkafiyqufv.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlubGVhYXR2a2Z0a2FmaXlxdWZ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ3MzA4ODIsImV4cCI6MjA4MDMwNjg4Mn0.Ym945vCX_d2eL1-RlE4xXVwo4uGrxWUZeJgyOiHgVEA';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// !!! BU ID'Yİ DEĞİŞTİRİN !!!
// Supabase Dashboard > Authentication > Users'dan test kullanıcınızın ID'sini alın
const TEST_USER_ID = 'YOUR_USER_ID_HERE';

async function migrateListings() {
    console.log('🚀 Mock data migration başlıyor...\n');

    if (TEST_USER_ID === 'YOUR_USER_ID_HERE') {
        console.error('❌ HATA: Lütfen TEST_USER_ID değişkenini güncelleyin!');
        console.log('   1. Supabase Dashboard > Authentication > Users');
        console.log('   2. Test kullanıcınızın ID\'sini kopyalayın');
        console.log('   3. Bu dosyada TEST_USER_ID değişkenini güncelleyin\n');
        process.exit(1);
    }

    let successCount = 0;
    let errorCount = 0;

    // Mock listings'leri Supabase formatına çevir
    for (const mockListing of mockListings) {
        try {
            // Price string'i number'a çevir (örn: "189,00 €" -> 189.00)
            let price = null;
            if (mockListing.price) {
                const priceStr = mockListing.price.replace(/[€\s]/g, '').replace(',', '.');
                price = parseFloat(priceStr);
            }

            // Supabase listing objesi
            const listing = {
                user_id: TEST_USER_ID,
                title: mockListing.title,
                description: mockListing.description || 'Keine Beschreibung verfügbar',
                price: price,
                category: mockListing.category || 'Sonstiges',
                sub_category: mockListing.subCategory || null,
                city: mockListing.city || null,
                postal_code: mockListing.postalCode || null,
                condition: mockListing.condition || 'Gebraucht',
                images: mockListing.images || (mockListing.image ? [mockListing.image] : []),
                status: 'active',
                views: mockListing.viewCount || 0
            };

            // Supabase'e ekle
            const { data, error } = await supabase
                .from('listings')
                .insert([listing])
                .select()
                .single();

            if (error) {
                console.error(`❌ Hata (ID: ${mockListing.id}):`, error.message);
                errorCount++;
            } else {
                console.log(`✅ Eklendi: ${listing.title.substring(0, 50)}...`);
                successCount++;
            }

            // Rate limiting için kısa bekleme
            await new Promise(resolve => setTimeout(resolve, 100));

        } catch (err) {
            console.error(`❌ Beklenmeyen hata (ID: ${mockListing.id}):`, err.message);
            errorCount++;
        }
    }

    console.log('\n📊 Migration Özeti:');
    console.log(`   ✅ Başarılı: ${successCount}`);
    console.log(`   ❌ Hatalı: ${errorCount}`);
    console.log(`   📦 Toplam: ${mockListings.length}\n`);

    if (successCount > 0) {
        console.log('🎉 Migration tamamlandı!');
        console.log('   Şimdi http://localhost:3000 adresinde listings'leri görebilirsiniz.\n');
  }
}

// Script'i çalıştır
migrateListings().catch(console.error);
