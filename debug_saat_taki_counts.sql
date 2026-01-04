-- Debug query to check all Saat & Takı listings and their attributes
SELECT 
    id,
    title,
    category,
    sub_category,
    uhren_schmuck_art,
    versand_art,
    offer_type,
    seller_type,
    condition,
    federal_state,
    status,
    created_at
FROM listings
WHERE category = 'Moda & Güzellik' 
  AND (sub_category = 'Saat & Takı' OR sub_category LIKE '%Saat%' OR sub_category LIKE '%Takı%')
ORDER BY created_at DESC;

-- Check for any listings that might have wrong subcategory name
SELECT DISTINCT sub_category
FROM listings
WHERE category = 'Moda & Güzellik'
  AND (sub_category LIKE '%Saat%' OR sub_category LIKE '%Takı%' OR sub_category LIKE '%Uhren%' OR sub_category LIKE '%Schmuck%');
