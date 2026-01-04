-- Fix subcategory name for Gastronomie & Tourismus
-- Ensure it is exactly "Gastronomie & Tourismus" to match frontend logic

UPDATE subcategories 
SET name = 'Gastronomie & Tourismus' 
WHERE (name = 'Gastronomie und Tourismus' OR name LIKE 'Gastronomie%') 
AND category_id = (SELECT id FROM categories WHERE name = 'Jobs');
