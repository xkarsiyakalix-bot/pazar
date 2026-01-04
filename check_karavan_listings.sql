-- Check listings for Karavan subcategory
-- Use wildcards to find the exact subcategory name if unsure

SELECT category, sub_category, count(*)
FROM listings
WHERE category = 'Otomobil, Bisiklet & Tekne'
GROUP BY category, sub_category;

-- Check distribution of wohnwagen_art for the relevant subcategory
-- Replace 'Karavan & Motokaravan' with the actual name found above if different
SELECT sub_category, wohnwagen_art, count(*)
FROM listings
WHERE category = 'Otomobil, Bisiklet & Tekne' 
  AND (sub_category ILIKE '%Karavan%')
GROUP BY sub_category, wohnwagen_art;
