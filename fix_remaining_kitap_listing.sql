-- Update the remaining listing that doesn't have buecher_zeitschriften_art value
-- This will make all 4 listings appear in the filter

UPDATE listings
SET buecher_zeitschriften_art = 'Weitere Bücher & Zeitschriften'
WHERE category IN ('Müzik, Film & Kitap', 'Musik, Filme & Bücher', 'Musik, Film & Bücher')
  AND sub_category IN ('Kitap & Dergi', 'Bücher & Zeitschriften')
  AND (buecher_zeitschriften_art IS NULL OR buecher_zeitschriften_art = '');

-- Verify all listings now have the field
SELECT 
    id,
    title,
    buecher_zeitschriften_art,
    created_at
FROM listings
WHERE category IN ('Müzik, Film & Kitap', 'Musik, Filme & Bücher', 'Musik, Film & Bücher')
  AND sub_category IN ('Kitap & Dergi', 'Bücher & Zeitschriften')
ORDER BY created_at DESC;

-- Check the count by type
SELECT 
    buecher_zeitschriften_art,
    COUNT(*) as count
FROM listings
WHERE category IN ('Müzik, Film & Kitap', 'Musik, Filme & Bücher', 'Musik, Film & Bücher')
  AND sub_category IN ('Kitap & Dergi', 'Bücher & Zeitschriften')
GROUP BY buecher_zeitschriften_art
ORDER BY count DESC;
