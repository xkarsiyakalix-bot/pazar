-- Standardize Cep Telefonu subcategory name
-- Ensure all listings use "Cep Telefonu & Telefon" as the standard name

-- First, check what variants exist
SELECT DISTINCT sub_category, COUNT(*) as count
FROM listings
WHERE category = 'Elektronik' 
  AND (sub_category ILIKE '%cep%telefon%' OR sub_category ILIKE '%handy%')
GROUP BY sub_category;

-- Update all variants to the standard name
UPDATE listings
SET sub_category = 'Cep Telefonu & Telefon'
WHERE category = 'Elektronik'
  AND (
    sub_category = 'Cep Telefonu & Aksesuar' OR
    sub_category = 'Handy & Telefon' OR
    sub_category ILIKE 'cep telefonu%aksesuar%'
  )
  AND sub_category != 'Cep Telefonu & Telefon';

-- Verify the update
SELECT DISTINCT sub_category, COUNT(*) as count
FROM listings
WHERE category = 'Elektronik' 
  AND sub_category = 'Cep Telefonu & Telefon'
GROUP BY sub_category;
