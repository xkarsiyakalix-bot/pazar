-- Check for listings in Kitap & Dergi subcategory
SELECT 
    id,
    title,
    category,
    sub_category,
    created_at
FROM listings
WHERE category LIKE '%Müzik%Film%Kitap%'
   OR category LIKE '%Musik%Film%'
ORDER BY created_at DESC
LIMIT 20;

-- Check exact subcategory matches
SELECT DISTINCT sub_category, COUNT(*) as count
FROM listings
WHERE category LIKE '%Müzik%Film%Kitap%'
   OR category LIKE '%Musik%Film%'
GROUP BY sub_category
ORDER BY sub_category;

-- Check for variations of "Kitap & Dergi"
SELECT COUNT(*) as count, sub_category
FROM listings
WHERE (category LIKE '%Müzik%Film%Kitap%' OR category LIKE '%Musik%Film%')
  AND (sub_category LIKE '%Kitap%' OR sub_category LIKE '%Buch%' OR sub_category LIKE '%Dergi%' OR sub_category LIKE '%Zeitschrift%')
GROUP BY sub_category;
