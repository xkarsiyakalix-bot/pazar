-- Check existing values for Damenbekleidung columns
SELECT 
    damenbekleidung_art, 
    COUNT(*) as count 
FROM listings 
WHERE sub_category = 'Kadın Giyimi' OR sub_category = 'Kadın Giyim'
GROUP BY damenbekleidung_art;

SELECT 
    damenbekleidung_marke, 
    COUNT(*) as count 
FROM listings 
WHERE sub_category = 'Kadın Giyimi' OR sub_category = 'Kadın Giyim'
GROUP BY damenbekleidung_marke;

SELECT 
    title, sub_category, damenbekleidung_art, damenbekleidung_marke
FROM listings
WHERE sub_category = 'Kadın Giyimi' OR sub_category = 'Kadın Giyim'
LIMIT 10;
