-- Check listings for Model Yapımı category
SELECT 
    id, 
    title, 
    category, 
    sub_category, 
    modellbau_art,
    created_at
FROM listings 
WHERE category = 'Eğlence, Hobi & Mahalle' 
  AND sub_category = 'Model Yapımı'
LIMIT 20;

-- Check all distinct modellbau_art values
SELECT DISTINCT modellbau_art, COUNT(*) as count
FROM listings 
WHERE category = 'Eğlence, Hobi & Mahalle' 
  AND sub_category = 'Model Yapımı'
GROUP BY modellbau_art
ORDER BY count DESC;

-- Check if there are any listings with this category/subcategory at all
SELECT COUNT(*) as total_count
FROM listings 
WHERE category = 'Eğlence, Hobi & Mahalle' 
  AND sub_category = 'Model Yapımı';
