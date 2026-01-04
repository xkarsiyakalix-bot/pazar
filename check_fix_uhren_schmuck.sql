-- Check current uhren_schmuck_art values in Saat & Takı listings
SELECT 
    id,
    title,
    uhren_schmuck_art,
    category,
    sub_category,
    created_at
FROM listings
WHERE category = 'Moda & Güzellik' 
  AND sub_category = 'Saat & Takı'
ORDER BY created_at DESC;

-- If values are in German, update them to Turkish
-- UPDATE listings
-- SET uhren_schmuck_art = CASE
--     WHEN uhren_schmuck_art = 'Schmuck' THEN 'Takı'
--     WHEN uhren_schmuck_art = 'Uhren' THEN 'Saat'
--     WHEN uhren_schmuck_art = 'Weiteres' THEN 'Diğer'
--     ELSE uhren_schmuck_art
-- END
-- WHERE category = 'Moda & Güzellik' 
--   AND sub_category = 'Saat & Takı'
--   AND uhren_schmuck_art IN ('Schmuck', 'Uhren', 'Weiteres');
