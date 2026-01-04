-- Subcategory kontrolü
SELECT sub_category, count(*) 
FROM listings 
WHERE category = 'Emlak' AND (sub_category LIKE '%Ticari%' OR sub_category LIKE '%Gewerbe%')
GROUP BY sub_category;

-- Objektart değer kontrolü
SELECT objektart, count(*) 
FROM listings 
WHERE sub_category = 'Ticari Emlak'
GROUP BY objektart;

-- General Features kontrolü
SELECT general_features 
FROM listings 
WHERE sub_category = 'Ticari Emlak'
LIMIT 5;
