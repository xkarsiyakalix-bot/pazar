-- Fix subcategory name for Büroarbeit & Verwaltung
-- The frontend logic expects "Büroarbeit & Verwaltung" but the DB might have "Büro & Verwaltung"

UPDATE subcategories 
SET name = 'Büroarbeit & Verwaltung' 
WHERE name = 'Büro & Verwaltung' OR name = 'Büro und Verwaltung';

-- Ensure it's correct for Jobs category specifically if ambiguous
-- (Assuming unique names usually, but good to be safe)
UPDATE subcategories 
SET name = 'Büroarbeit & Verwaltung' 
WHERE name = 'Büro & Verwaltung' 
AND category_id IN (SELECT id FROM categories WHERE name = 'Jobs');
