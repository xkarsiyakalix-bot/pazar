-- Fix Ofis & Kırtasiye subcategory to match existing Kırtasiye subcategory
-- This fixes the issue where breadcrumb links lead to empty pages

-- Update the specific listing
UPDATE listings
SET sub_category = 'Kırtasiye'
WHERE id = '0d7e5eb8-f651-4287-a3b3-03ce7a060dd7';

-- Update any other listings with the same issue
UPDATE listings
SET sub_category = 'Kırtasiye'
WHERE category = 'Müzik, Film & Kitap'
  AND sub_category = 'Ofis & Kırtasiye';

-- Verify the update
SELECT id, title, category, sub_category
FROM listings
WHERE category = 'Müzik, Film & Kitap'
  AND (sub_category = 'Kırtasiye' OR sub_category = 'Ofis & Kırtasiye')
ORDER BY sub_category, title;
