-- Update the listing from "Komşu Yardımı" to "Mahalle Yardımı"
-- This fixes the issue where the listing doesn't appear on the category page

UPDATE listings
SET 
  category = 'Mahalle Yardımı',
  sub_category = 'Mahalle Yardımı'
WHERE id = 'ee074493-d362-4dd9-9421-f78723b1cc31';

-- Also update any other listings with "Komşu Yardımı"
UPDATE listings
SET 
  category = 'Mahalle Yardımı',
  sub_category = 'Mahalle Yardımı'
WHERE category = 'Komşu Yardımı' OR sub_category = 'Komşu Yardımı';

-- Verify the update
SELECT id, title, category, sub_category, created_at
FROM listings
WHERE category = 'Mahalle Yardımı' OR sub_category = 'Mahalle Yardımı'
ORDER BY created_at DESC;
