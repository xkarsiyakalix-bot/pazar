-- Check and standardize Müzik, Film & Kitap subcategory names
-- This ensures database values match frontend expectations

-- First, check current subcategories
SELECT DISTINCT sub_category, COUNT(*) as count
FROM listings
WHERE category = 'Müzik, Film & Kitap'
GROUP BY sub_category
ORDER BY sub_category;

-- Expected subcategories (from frontend):
-- 'Kitap & Dergi'
-- 'Kırtasiye'
-- 'Çizgi Romanlar'
-- 'Ders Kitapları, Okul & Eğitim'
-- 'Film & DVD'
-- 'Müzik & CD\'ler'  (note the apostrophe)
-- 'Müzik Enstrümanları'
-- 'Diğer Müzik, Film & Kitap'

-- If any mismatches are found, uncomment and run the appropriate UPDATE statements below:

-- Example fixes (uncomment if needed):
-- UPDATE listings SET sub_category = 'Müzik & CD''ler' WHERE category = 'Müzik, Film & Kitap' AND sub_category = 'Müzik & CDler';
-- UPDATE listings SET sub_category = 'Kitap & Dergi' WHERE category = 'Müzik, Film & Kitap' AND sub_category LIKE 'Kitap%Dergi';
