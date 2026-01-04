-- Fix subcategory name for Kundenservice & Call Center
-- Ensure it is exactly "Kundenservice & Call Center" to match frontend logic

UPDATE subcategories 
SET name = 'Kundenservice & Call Center' 
WHERE (name = 'Kundenservice und Call Center' OR name LIKE 'Kundenservice%') 
AND category_id = (SELECT id FROM categories WHERE name = 'Jobs');
