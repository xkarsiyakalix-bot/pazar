-- Update the subcategory from "Ödünç Verme" to "Kiralama" for consistency
-- This will fix the breadcrumb display on the product detail page

UPDATE listings
SET sub_category = 'Kiralama'
WHERE sub_category = 'Ödünç Verme'
  AND category = 'Ücretsiz & Takas';

-- Verify the update
SELECT id, title, category, sub_category
FROM listings
WHERE category = 'Ücretsiz & Takas'
ORDER BY sub_category;
