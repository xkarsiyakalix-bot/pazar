-- Check subcategories in 'Moda & Güzellik' to start debugging filter counts
SELECT sub_category, COUNT(*) 
FROM listings 
WHERE category = 'Moda & Güzellik' OR category = 'Mode & Beauty'
GROUP BY sub_category;
