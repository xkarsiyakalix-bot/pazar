INSERT INTO subcategories (category_id, name, slug, display_order)
SELECT id, 'Evcil Hayvan Bakımı & Eğitim', 'Hayvan-Bakimi-Egitimi', 8
FROM categories
WHERE name = 'Hizmetler'
AND NOT EXISTS (
    SELECT 1 FROM subcategories 
    WHERE slug = 'Hayvan-Bakimi-Egitimi' 
    AND category_id = categories.id
);
