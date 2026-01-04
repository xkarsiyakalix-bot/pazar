-- Check all Biletler subcategories
SELECT DISTINCT sub_category, COUNT(*) as count
FROM listings
WHERE category = 'Biletler'
GROUP BY sub_category
ORDER BY sub_category;
