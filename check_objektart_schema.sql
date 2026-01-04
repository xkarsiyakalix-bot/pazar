SELECT 
    column_name, 
    data_type 
FROM information_schema.columns 
WHERE table_name = 'listings' AND column_name = 'objektart';

SELECT id, objektart, sub_category 
FROM listings 
WHERE sub_category = 'Ticari Emlak' OR sub_category LIKE '%Ticari%'
LIMIT 10;
