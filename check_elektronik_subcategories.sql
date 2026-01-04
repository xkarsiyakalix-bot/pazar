-- Check what subcategory names exist for Elektronik category
SELECT DISTINCT sub_category, COUNT(*) as count
FROM listings
WHERE category = 'Elektronik'
GROUP BY sub_category
ORDER BY sub_category;

-- Check specifically for Elektronik Servisler/Hizmetler variants
SELECT id, title, category, sub_category
FROM listings
WHERE category = 'Elektronik' 
  AND (sub_category ILIKE '%servis%' OR sub_category ILIKE '%hizmet%' OR sub_category ILIKE '%dienstleistung%')
LIMIT 10;
