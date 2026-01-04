-- Hizmetler kategorisindeki TÜM alt kategori isimlerini standartlaştır
-- Bu, breadcrumb ve diğer gösterimlerde tutarlılık sağlar

-- ÖNCE: Mevcut durumu göster
SELECT 'ÖNCE - Mevcut Alt Kategoriler:' as info;
SELECT sub_category, COUNT(*) as count
FROM listings
WHERE category = 'Hizmetler'
  AND status = 'active'
GROUP BY sub_category
ORDER BY sub_category;

-- 1. Elektronik varyasyonları -> Elektronik
UPDATE listings
SET sub_category = 'Elektronik'
WHERE category = 'Hizmetler'
  AND sub_category IN ('Elektronik Servisler', 'Elektronik Hizmetler', 'Elektronik Servisleri');

-- 2. Bebek Bakıcısı varyasyonları -> Babysitter & Çocuk Bakımı
UPDATE listings
SET sub_category = 'Babysitter & Çocuk Bakımı'
WHERE category = 'Hizmetler'
  AND sub_category IN ('Bebek Bakıcısı & Kreş', 'Babysitter/-in & Kinderbetreuung', 'Bebek Bakıcısı');

-- 3. Otomobil varyasyonları -> Otomobil, Bisiklet & Tekne
UPDATE listings
SET sub_category = 'Otomobil, Bisiklet & Tekne'
WHERE category = 'Hizmetler'
  AND sub_category IN ('Otomobil, Bisiklet & Tekne Servisi', 'Oto, Bisiklet & Tekne Servisi', 'Auto, Rad & Boot');

-- 4. Ev & Bahçe varyasyonları -> Ev & Bahçe
UPDATE listings
SET sub_category = 'Ev & Bahçe'
WHERE category = 'Hizmetler'
  AND sub_category IN ('Ev & Bahçe Hizmetleri', 'Haus & Garten', 'Ev ve Bahçe');

-- 5. Seyahat varyasyonları -> Seyahat & Etkinlik
UPDATE listings
SET sub_category = 'Seyahat & Etkinlik'
WHERE category = 'Hizmetler'
  AND sub_category IN ('Seyahat & Etkinlik Hizmetleri', 'Reise & Veranstaltungen', 'Seyahat ve Etkinlik');

-- 6. Sanatçılar varyasyonları -> Sanatçılar & Müzisyenler
UPDATE listings
SET sub_category = 'Sanatçılar & Müzisyenler'
WHERE category = 'Hizmetler'
  AND sub_category IN ('Künstler & Musiker', 'Sanatçılar ve Müzisyenler');

-- 7. Hayvan Bakımı varyasyonları -> Hayvan Bakımı & Eğitimi
UPDATE listings
SET sub_category = 'Hayvan Bakımı & Eğitimi'
WHERE category = 'Hizmetler'
  AND sub_category IN ('Tierbetreuung & Training', 'Hayvan Bakımı ve Eğitimi');

-- 8. Taşımacılık varyasyonları -> Taşımacılık & Nakliye
UPDATE listings
SET sub_category = 'Taşımacılık & Nakliye'
WHERE category = 'Hizmetler'
  AND sub_category IN ('Umzug & Transport', 'Taşımacılık ve Nakliye');

-- 9. Yaşlı Bakımı varyasyonları -> Yaşlı Bakımı
UPDATE listings
SET sub_category = 'Yaşlı Bakımı'
WHERE category = 'Hizmetler'
  AND sub_category IN ('Seniorenbetreuung', 'Yaşlı Bakım');

-- 10. Diğer Hizmetler varyasyonları -> Diğer Hizmetler
UPDATE listings
SET sub_category = 'Diğer Hizmetler'
WHERE category = 'Hizmetler'
  AND sub_category IN ('Weitere Dienstleistungen', 'Diger Hizmetler');

-- SONRA: Güncellenmiş durumu göster
SELECT 'SONRA - Standartlaştırılmış Alt Kategoriler:' as info;
SELECT sub_category, COUNT(*) as count
FROM listings
WHERE category = 'Hizmetler'
  AND status = 'active'
GROUP BY sub_category
ORDER BY sub_category;
