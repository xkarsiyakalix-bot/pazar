-- Fix missing vermisste_tiere_status for Kayıp Hayvanlar listings
-- This sets the status to 'Kayboldu' (Lost) for listings that don't have a status set

-- Update the listing that is clearly a "lost" pet based on the title
UPDATE listings
SET vermisste_tiere_status = 'Kayboldu'
WHERE category = 'Evcil Hayvanlar'
  AND sub_category = 'Kayıp Hayvanlar'
  AND vermisste_tiere_status IS NULL
  AND (
    title ILIKE '%vermisst%' OR
    title ILIKE '%kayıp%' OR
    title ILIKE '%kayboldu%' OR
    title ILIKE '%lost%' OR
    description ILIKE '%vermisst%' OR
    description ILIKE '%kayıp%' OR
    description ILIKE '%kayboldu%' OR
    description ILIKE '%lost%'
  );

-- Verify the update
SELECT 
    id,
    title,
    vermisste_tiere_status,
    created_at
FROM listings
WHERE category = 'Evcil Hayvanlar'
  AND sub_category = 'Kayıp Hayvanlar'
ORDER BY created_at DESC;
