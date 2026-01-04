-- Check if the field was added and if there's any data
SELECT 
    COUNT(*) as total_kitap_dergi_listings,
    COUNT(buecher_zeitschriften_art) as listings_with_art,
    COUNT(*) - COUNT(buecher_zeitschriften_art) as listings_without_art
FROM listings
WHERE category IN ('Müzik, Film & Kitap', 'Musik, Filme & Bücher', 'Musik, Film & Bücher')
  AND sub_category IN ('Kitap & Dergi', 'Bücher & Zeitschriften');

-- Show sample data
SELECT 
    id,
    title,
    category,
    sub_category,
    buecher_zeitschriften_art,
    created_at
FROM listings
WHERE category IN ('Müzik, Film & Kitap', 'Musik, Filme & Bücher', 'Musik, Film & Bücher')
  AND sub_category IN ('Kitap & Dergi', 'Bücher & Zeitschriften')
ORDER BY created_at DESC
LIMIT 10;
