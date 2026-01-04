-- Check what subcategory name is stored for the Ev Hizmetleri listing
SELECT 
    id,
    title,
    category,
    sub_category,
    created_at
FROM listings
WHERE category = 'Ev & Bahçe'
  AND (sub_category LIKE '%Hizmet%' OR sub_category LIKE '%Service%')
ORDER BY created_at DESC
LIMIT 10;

-- Check all unique subcategory names under Ev & Bahçe
SELECT DISTINCT sub_category, COUNT(*) as count
FROM listings
WHERE category = 'Ev & Bahçe'
GROUP BY sub_category
ORDER BY count DESC;
