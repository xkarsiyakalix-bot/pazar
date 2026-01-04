-- Fix haustier_zubehoer_art values for Aksesuarlar listings
-- This updates the values to match the frontend filter options

-- First, let's see what values currently exist
SELECT 
    haustier_zubehoer_art,
    COUNT(*) as count
FROM listings
WHERE category = 'Evcil Hayvanlar'
  AND sub_category = 'Aksesuarlar'
GROUP BY haustier_zubehoer_art
ORDER BY count DESC;

-- Update "Küçükbaş Hayvanlar" to "Küçük Hayvanlar" to match frontend
UPDATE listings
SET haustier_zubehoer_art = 'Küçük Hayvanlar'
WHERE category = 'Evcil Hayvanlar'
  AND sub_category = 'Aksesuarlar'
  AND haustier_zubehoer_art = 'Küçükbaş Hayvanlar';

-- Update any other potential mismatches
-- Map German values to Turkish if they exist
UPDATE listings
SET haustier_zubehoer_art = CASE
    WHEN haustier_zubehoer_art = 'Fische' THEN 'Balıklar'
    WHEN haustier_zubehoer_art = 'Hunde' THEN 'Köpekler'
    WHEN haustier_zubehoer_art = 'Katzen' THEN 'Kediler'
    WHEN haustier_zubehoer_art = 'Kleintiere' THEN 'Küçük Hayvanlar'
    WHEN haustier_zubehoer_art = 'Pferde' THEN 'Atlar'
    WHEN haustier_zubehoer_art = 'Reptilien' THEN 'Sürüngenler'
    WHEN haustier_zubehoer_art = 'Vögel' THEN 'Kuşlar'
    WHEN haustier_zubehoer_art = 'Weiteres Tierzubehör' THEN 'Diğer Aksesuarlar'
    ELSE haustier_zubehoer_art
END
WHERE category = 'Evcil Hayvanlar'
  AND sub_category = 'Aksesuarlar'
  AND haustier_zubehoer_art IN (
    'Fische', 'Hunde', 'Katzen', 'Kleintiere', 'Pferde', 
    'Reptilien', 'Vögel', 'Weiteres Tierzubehör'
  );

-- Verify the updates
SELECT 
    haustier_zubehoer_art,
    COUNT(*) as count,
    STRING_AGG(title, ' | ') as sample_titles
FROM listings
WHERE category = 'Evcil Hayvanlar'
  AND sub_category = 'Aksesuarlar'
GROUP BY haustier_zubehoer_art
ORDER BY count DESC;
