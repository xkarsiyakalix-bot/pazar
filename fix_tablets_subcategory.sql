-- Fix Tabletler & E-Okuyucular Subcategory and Filter Values

-- 1. Standardize Subcategory Name
-- Standardize to "Tabletler & E-Okuyucular" (Plural)
UPDATE listings
SET sub_category = 'Tabletler & E-Okuyucular'
WHERE category = 'Elektronik'
  AND (
    sub_category = 'Tablet & E-Okuyucu' OR
    sub_category = 'Tablets & Reader' OR
    sub_category ILIKE '%tablet%'
  )
  AND sub_category != 'Tabletler & E-Okuyucular';

-- 2. Translate Filter Values (tablets_reader_art) to Turkish
UPDATE listings
SET tablets_reader_art = CASE
    WHEN tablets_reader_art = 'E-Book Reader' THEN 'E-Kitap Okuyucu'
    WHEN tablets_reader_art = 'Zubehör' THEN 'Aksesuar'
    WHEN tablets_reader_art = 'Andere Tablets & Reader' THEN 'Diğer Tabletler & Okuyucular'
    WHEN tablets_reader_art = 'Diğer Tablet & Okuyucular' THEN 'Diğer Tabletler & Okuyucular' -- Fix my potential previous manual entries if any
    ELSE tablets_reader_art
END
WHERE category = 'Elektronik'
  AND sub_category = 'Tabletler & E-Okuyucular'
  AND tablets_reader_art IN ('E-Book Reader', 'Zubehör', 'Andere Tablets & Reader', 'Diğer Tablet & Okuyucular');

-- Verify updates
SELECT sub_category, COUNT(*) 
FROM listings 
WHERE category = 'Elektronik' AND sub_category = 'Tabletler & E-Okuyucular'
GROUP BY sub_category;

SELECT tablets_reader_art, COUNT(*)
FROM listings
WHERE category = 'Elektronik' AND sub_category = 'Tabletler & E-Okuyucular'
GROUP BY tablets_reader_art;
