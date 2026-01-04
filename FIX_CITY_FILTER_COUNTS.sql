-- ============================================================================
-- ŞEHİR FİLTRESİ SAYILARI DÜZELTME
-- ============================================================================
-- 
-- SORUN: "Dil Kursları" alt kategorisindeki ilan federal_state değeri NULL
--        Bu yüzden şehir filtresinde sayı gösterilmiyor
--
-- ÇÖZÜM: NULL federal_state değerlerini city değeriyle güncelle
--
-- ============================================================================

-- 1. Önce mevcut durumu kontrol et
SELECT 
    id,
    title,
    category,
    sub_category,
    city,
    federal_state
FROM listings
WHERE federal_state IS NULL
  AND category = 'Eğitim & Kurslar';

-- Beklenen sonuç:
-- 1 ilan (Dil Kursları, city='İstanbul', federal_state=NULL)

-- ============================================================================

-- 2. NULL federal_state değerlerini city değeriyle güncelle
UPDATE listings
SET federal_state = city
WHERE federal_state IS NULL 
  AND city IS NOT NULL;

-- ============================================================================

-- 3. Güncellemeyi doğrula
SELECT 
    id,
    title,
    category,
    sub_category,
    city,
    federal_state
FROM listings
WHERE category = 'Eğitim & Kurslar'
ORDER BY sub_category, federal_state;

-- Beklenen sonuç:
-- Tüm ilanların federal_state değeri dolu olmalı
-- "Dil Kursları" ilanı artık federal_state='İstanbul' olmalı

-- ============================================================================

-- 4. Şehir bazında dağılımı kontrol et
SELECT 
    federal_state,
    COUNT(*) as ilan_sayisi
FROM listings
WHERE category = 'Eğitim & Kurslar'
  AND federal_state IS NOT NULL
GROUP BY federal_state
ORDER BY ilan_sayisi DESC;

-- Beklenen sonuç:
-- İzmir: 4
-- İstanbul: 2 (önceden 1 idi, şimdi Dil Kursları ilanı eklendi)
-- Ankara: 1
-- Ağrı: 1

-- ============================================================================
-- NOTLAR:
-- - Bu scripti Supabase SQL Editor'da çalıştır
-- - Güncelleme sonrası frontend sayfalarını yenile:
--   * http://localhost:3000/Egitim-Kurslar
--   * http://localhost:3000/Egitim-Kurslar/Dil-Kurslari
-- - Şehir filtresinde artık doğru sayılar görünecek
-- ============================================================================
