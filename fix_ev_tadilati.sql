-- Update existing listings to use the correct subcategory name
UPDATE listings
SET sub_category = 'Ev Tadilatı'
WHERE sub_category = 'Yapı Market & Tadilat';

-- Verify the update
SELECT id, title, sub_category 
FROM listings 
WHERE sub_category = 'Ev Tadilatı'
ORDER BY created_at DESC;
