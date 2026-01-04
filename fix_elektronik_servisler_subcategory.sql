-- Standardize Elektronik Servisler subcategory name to Elektronik Hizmetler
-- This ensures all listings use the same subcategory name as the frontend

-- First, check what variants exist
SELECT DISTINCT sub_category, COUNT(*) as count
FROM listings
WHERE category = 'Elektronik' 
  AND (sub_category ILIKE '%servis%' OR sub_category ILIKE '%hizmet%' OR sub_category ILIKE '%dienstleistung%')
GROUP BY sub_category;

-- Update all variants to the standard name
UPDATE listings
SET sub_category = 'Elektronik Hizmetler'
WHERE category = 'Elektronik'
  AND (
    sub_category = 'Elektronik Servisler' OR
    sub_category = 'Dienstleistungen Elektronik' OR
    sub_category = 'Elektronik' OR
    sub_category ILIKE 'elektronik%servis%' OR
    sub_category ILIKE 'dienstleistung%elektronik%'
  )
  AND sub_category != 'Elektronik Hizmetler';

-- Verify the update
SELECT DISTINCT sub_category, COUNT(*) as count
FROM listings
WHERE category = 'Elektronik' 
  AND sub_category = 'Elektronik Hizmetler'
GROUP BY sub_category;
