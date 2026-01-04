-- Ensure boote_art column exists
ALTER TABLE listings 
ADD COLUMN IF NOT EXISTS boote_art text;

-- Update listings with missing boote_art to a default value
UPDATE listings
SET boote_art = 'Motorlu Tekneler'
WHERE category = 'Otomobil, Bisiklet & Tekne' 
  AND sub_category ILIKE '%Tekne%'
  AND (boote_art IS NULL OR boote_art = '');
