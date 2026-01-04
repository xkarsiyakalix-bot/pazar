-- Update listing to use "Komşu Yardımı" category
-- This will make the listing appear on /Komsu-Yardimi/Komsu-Yardimi page

-- Update the specific listing
UPDATE listings
SET 
  category = 'Komşu Yardımı',
  sub_category = 'Komşu Yardımı'
WHERE id = 'ee074493-d362-4dd9-9421-f78723b1cc31';

-- Also update any listings that might have "Mahalle Yardımı"
UPDATE listings
SET 
  category = 'Komşu Yardımı',
  sub_category = 'Komşu Yardımı'
WHERE category = 'Mahalle Yardımı' OR sub_category = 'Mahalle Yardımı';

-- Verify the update
SELECT id, title, category, sub_category, created_at
FROM listings
WHERE category = 'Komşu Yardımı' OR sub_category = 'Komşu Yardımı'
ORDER BY created_at DESC;
