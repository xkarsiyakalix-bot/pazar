-- Ensure columns exist
ALTER TABLE listings 
ADD COLUMN IF NOT EXISTS bike_art text,
ADD COLUMN IF NOT EXISTS bike_type text;

-- Update the existing bicycle listing with sample Turkish values to verify filter
-- Replace 'Bisiklet & Aksesuarlar' with the actual subcategory string match
UPDATE listings
SET bike_art = 'Erkek',
    bike_type = 'Dağ Bisikleti (MTB)'
WHERE category = 'Otomobil, Bisiklet & Tekne' 
  AND sub_category ILIKE '%Bisiklet%'
  AND (bike_art IS NULL OR bike_art = '');
