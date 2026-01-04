-- FORCE UPDATE: Set all Kitap & Dergi listings to have a valid art value
-- This will make ALL 4 listings appear in the filter

UPDATE listings
SET buecher_zeitschriften_art = 'Weitere Bücher & Zeitschriften'
WHERE category IN ('Müzik, Film & Kitap', 'Musik, Filme & Bücher', 'Musik, Film & Bücher')
  AND sub_category IN ('Kitap & Dergi', 'Bücher & Zeitschriften')
  AND (buecher_zeitschriften_art IS NULL 
       OR buecher_zeitschriften_art = '' 
       OR buecher_zeitschriften_art NOT IN (
           'Antiquarische Bücher',
           'Kinderbücher',
           'Krimis & Thriller',
           'Kunst & Kultur',
           'Sachbücher',
           'Science Fiction',
           'Unterhaltungsliteratur',
           'Zeitgenössische Literatur & Klassiker',
           'Zeitschriften',
           'Weitere Bücher & Zeitschriften'
       ));

-- Verify ALL 4 listings now have valid values
SELECT 
    id,
    title,
    buecher_zeitschriften_art
FROM listings
WHERE category IN ('Müzik, Film & Kitap', 'Musik, Filme & Bücher', 'Musik, Film & Bücher')
  AND sub_category IN ('Kitap & Dergi', 'Bücher & Zeitschriften')
ORDER BY created_at DESC;
