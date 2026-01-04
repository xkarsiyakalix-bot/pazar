-- Populate buecher_zeitschriften_art field with a default value for existing listings
-- This will make the filter functional immediately

-- First, check how many listings need updating
SELECT 
    COUNT(*) as total_listings,
    COUNT(CASE WHEN buecher_zeitschriften_art IS NULL THEN 1 END) as null_art_field
FROM listings
WHERE category IN ('Müzik, Film & Kitap', 'Musik, Filme & Bücher', 'Musik, Film & Bücher')
  AND sub_category IN ('Kitap & Dergi', 'Bücher & Zeitschriften');

-- Update all Kitap & Dergi listings with a default "Weitere Bücher & Zeitschriften" (Other Books & Magazines)
-- This allows the filter to work immediately, users can update to specific types later
UPDATE listings
SET buecher_zeitschriften_art = 'Weitere Bücher & Zeitschriften'
WHERE category IN ('Müzik, Film & Kitap', 'Musik, Filme & Bücher', 'Musik, Film & Bücher')
  AND sub_category IN ('Kitap & Dergi', 'Bücher & Zeitschriften')
  AND (buecher_zeitschriften_art IS NULL OR buecher_zeitschriften_art = '');

-- Verify the update
SELECT 
    buecher_zeitschriften_art,
    COUNT(*) as count
FROM listings
WHERE category IN ('Müzik, Film & Kitap', 'Musik, Filme & Bücher', 'Musik, Film & Bücher')
  AND sub_category IN ('Kitap & Dergi', 'Bücher & Zeitschriften')
GROUP BY buecher_zeitschriften_art
ORDER BY count DESC;
