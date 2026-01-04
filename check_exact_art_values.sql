-- Check the exact value of buecher_zeitschriften_art for all 4 listings
SELECT 
    id,
    title,
    buecher_zeitschriften_art,
    CASE 
        WHEN buecher_zeitschriften_art IS NULL THEN 'NULL'
        WHEN buecher_zeitschriften_art = '' THEN 'EMPTY STRING'
        ELSE buecher_zeitschriften_art
    END as art_status,
    created_at
FROM listings
WHERE category IN ('Müzik, Film & Kitap', 'Musik, Filme & Bücher', 'Musik, Film & Bücher')
  AND sub_category IN ('Kitap & Dergi', 'Bücher & Zeitschriften')
  AND status = 'active'
ORDER BY created_at DESC;

-- Count by exact value
SELECT 
    COALESCE(buecher_zeitschriften_art, 'NULL or EMPTY') as art_value,
    COUNT(*) as count
FROM listings
WHERE category IN ('Müzik, Film & Kitap', 'Musik, Filme & Bücher', 'Musik, Film & Bücher')
  AND sub_category IN ('Kitap & Dergi', 'Bücher & Zeitschriften')
  AND status = 'active'
GROUP BY buecher_zeitschriften_art
ORDER BY count DESC;
