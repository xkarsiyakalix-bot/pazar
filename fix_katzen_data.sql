-- SQL to fix Katzen listings data so filters show counts correctly
-- Run this in your Supabase SQL Editor

UPDATE listings 
SET 
  katzen_art = 'Britisch Kurzhaar',
  katzen_alter = 'jünger als 12 Monate',
  katzen_geimpft = 'Ja',
  katzen_erlaubnis = 'Ja',
  status = 'active'
WHERE sub_category = 'Katzen' AND (katzen_art IS NULL OR katzen_art = '');

-- Optional: Verify the update
SELECT id, title, katzen_art FROM listings WHERE sub_category = 'Katzen';
