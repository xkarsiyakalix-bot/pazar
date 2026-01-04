SELECT sub_category, count(id) as count
FROM listings 
WHERE category = 'Emlak'
GROUP BY sub_category;
