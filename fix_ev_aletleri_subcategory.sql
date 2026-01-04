-- Standardize Beyaz Eşya & Ev Aletleri subcategory name
-- Ensure all listings use "Ev Aletleri" as the standard name

-- First, check what variants exist
SELECT DISTINCT sub_category, COUNT(*) as count
FROM listings
WHERE category = 'Elektronik' 
  AND (sub_category ILIKE '%beyaz%eşya%' OR sub_category ILIKE '%ev%alet%' OR sub_category ILIKE '%haushalts%')
GROUP BY sub_category;

-- Update all variants to the standard name
UPDATE listings
SET sub_category = 'Ev Aletleri'
WHERE category = 'Elektronik'
  AND (
    sub_category = 'Beyaz Eşya & Ev Aletleri' OR
    sub_category = 'Haushaltsgeräte' OR
    sub_category ILIKE 'beyaz%eşya%'
  )
  AND sub_category != 'Ev Aletleri';

-- Verify the update
SELECT DISTINCT sub_category, COUNT(*) as count
FROM listings
WHERE category = 'Elektronik' 
  AND sub_category = 'Ev Aletleri'
GROUP BY sub_category;
