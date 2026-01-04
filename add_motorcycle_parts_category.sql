-- Add missing Motorradteile & Zubehör subcategory

INSERT INTO subcategories (category_id, name, slug, display_order)
SELECT id, 'Motorradteile & Zubehör', 'Motorradteile-Zubehoer', 6
FROM categories 
WHERE name = 'Auto, Rad & Boot'
AND NOT EXISTS (
    SELECT 1 FROM subcategories 
    WHERE name = 'Motorradteile & Zubehör' 
    AND category_id = categories.id
);
