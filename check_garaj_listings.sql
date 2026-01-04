SELECT id, sub_category, count(*) as count
FROM listings
WHERE sub_category LIKE '%Garage%' OR sub_category LIKE '%Garaj%' OR sub_category LIKE '%Park%'
GROUP BY id, sub_category;
