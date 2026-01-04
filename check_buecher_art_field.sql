-- Check if buecher_zeitschriften_art field exists and has data
SELECT 
    column_name,
    data_type
FROM information_schema.columns
WHERE table_name = 'listings'
  AND column_name LIKE '%buecher%'
ORDER BY column_name;

-- Check for any "art" fields in listings table
SELECT 
    column_name,
    data_type
FROM information_schema.columns
WHERE table_name = 'listings'
  AND column_name LIKE '%art%'
ORDER BY column_name;

-- Check actual data in Kitap & Dergi listings
SELECT 
    id,
    title,
    category,
    sub_category,
    buecher_zeitschriften_art
FROM listings
WHERE category LIKE '%Müzik%Film%Kitap%'
  AND sub_category LIKE '%Kitap%Dergi%'
LIMIT 10;
