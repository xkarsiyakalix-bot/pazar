SELECT sub_category, count(*) 
FROM listings 
WHERE sub_category LIKE '%Ticari%' OR sub_category LIKE '%Gewerbe%'
GROUP BY sub_category;
