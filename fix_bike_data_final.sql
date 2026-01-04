-- Add columns if they don't exist
ALTER TABLE listings 
ADD COLUMN IF NOT EXISTS bike_art text,
ADD COLUMN IF NOT EXISTS bike_type text;

-- Update first listing (if exists)
UPDATE listings
SET bike_art = 'Erkek',
    bike_type = 'Dağ Bisikleti (MTB)'
WHERE id IN (
    SELECT id FROM listings 
    WHERE category = 'Otomobil, Bisiklet & Tekne' 
      AND sub_category ILIKE '%Bisiklet%'
    LIMIT 1
);

-- Update second listing (if exists) to different values so we see multiple filters active
UPDATE listings
SET bike_art = 'Kadın',
    bike_type = 'Şehir Bisikleti'
WHERE id IN (
    SELECT id FROM listings 
    WHERE category = 'Otomobil, Bisiklet & Tekne' 
      AND sub_category ILIKE '%Bisiklet%'
    OFFSET 1 LIMIT 1
);

-- Update any remaining ones to a default
UPDATE listings
SET bike_art = 'Aksesuar',
    bike_type = 'Diğer Bisikletler'
WHERE category = 'Otomobil, Bisiklet & Tekne' 
  AND sub_category ILIKE '%Bisiklet%'
  AND (bike_art IS NULL OR bike_art = '');
