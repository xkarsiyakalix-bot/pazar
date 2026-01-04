SELECT 
    sub_category,
    objektart,
    count(*) as count
FROM listings 
WHERE sub_category LIKE '%Ticari%' OR sub_category = 'Gewerbeimmobilien'
GROUP BY sub_category, objektart;

SELECT
    id,
    amenities 
FROM listings
WHERE sub_category LIKE '%Ticari%' OR sub_category = 'Gewerbeimmobilien'
LIMIT 5;
