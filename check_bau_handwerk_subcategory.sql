-- Check what subcategory name is actually used in the database
SELECT DISTINCT sub_category, COUNT(*) as count
FROM listings
WHERE category = 'İş İlanları'
  AND (sub_category LIKE '%Bau%' OR sub_category LIKE '%İnşaat%' OR sub_category LIKE '%Handwerk%')
  AND status = 'active'
GROUP BY sub_category;

-- Check all İş İlanları subcategories
SELECT DISTINCT sub_category, COUNT(*) as count
FROM listings
WHERE category = 'İş İlanları'
  AND status = 'active'
GROUP BY sub_category
ORDER BY sub_category;

-- Check if there are any listings with bau_handwerk_produktion_art field populated
SELECT 
    id,
    title,
    sub_category,
    bau_handwerk_produktion_art,
    job_type,
    working_time
FROM listings
WHERE category = 'İş İlanları'
  AND (sub_category LIKE '%Bau%' OR sub_category LIKE '%İnşaat%' OR sub_category LIKE '%Handwerk%')
  AND status = 'active'
LIMIT 10;
