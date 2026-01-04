
SELECT s.name, s.slug 
FROM subcategories s 
JOIN categories c ON s.category_id = c.id 
WHERE c.name = 'Hizmetler';
