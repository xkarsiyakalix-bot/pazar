-- Fix Masaüstü Bilgisayarlar / Bilgisayarlar Subcategory and Filter Values

-- 1. Standardize Subcategory Name
-- Standardize to "Bilgisayarlar"
UPDATE listings
SET sub_category = 'Bilgisayarlar'
WHERE category = 'Elektronik'
  AND (
    sub_category = 'Masaüstü Bilgisayar' OR
    sub_category = 'Masaüstü Bilgisayarlar' OR
    sub_category = 'PCs' OR
    sub_category ILIKE '%desktop%'
  )
  AND sub_category != 'Bilgisayarlar';

-- 2. Translate Filter Values (pcs_art) to Turkish
UPDATE listings
SET pcs_art = 'Diğer Bilgisayarlar'
WHERE category = 'Elektronik'
  AND sub_category = 'Bilgisayarlar'
  AND pcs_art = 'Weitere PCs';

-- Verify updates
SELECT sub_category, COUNT(*) 
FROM listings 
WHERE category = 'Elektronik' AND sub_category = 'Bilgisayarlar'
GROUP BY sub_category;

SELECT pcs_art, COUNT(*)
FROM listings
WHERE category = 'Elektronik' AND sub_category = 'Bilgisayarlar'
GROUP BY pcs_art;
