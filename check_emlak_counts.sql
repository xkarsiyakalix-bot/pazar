SELECT sub_category, COUNT(*) as count
FROM listings
WHERE category = 'Emlak' AND sub_category LIKE 'Satılık Daire%'
GROUP BY sub_category;
