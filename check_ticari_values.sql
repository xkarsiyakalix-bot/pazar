SELECT 
    sub_category,
    objektart,
    count(id) as count
FROM listings 
WHERE category = 'Emlak' AND (sub_category LIKE '%Ticari%' OR sub_category = 'Gewerbeimmobilien')
GROUP BY sub_category, objektart;
