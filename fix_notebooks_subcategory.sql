-- Fix Dizüstü Bilgisayarlar issues

-- Standardize Subcategory Name
-- Standardize to "Dizüstü Bilgisayarlar" (Plural)
UPDATE listings
SET sub_category = 'Dizüstü Bilgisayarlar'
WHERE category = 'Elektronik'
  AND (
    sub_category = 'Dizüstü Bilgisayar' OR
    sub_category = 'Notebooks' OR
    sub_category ILIKE '%notebook%' OR
    sub_category ILIKE '%laptop%'
  )
  AND sub_category != 'Dizüstü Bilgisayarlar';

-- Verify updates
SELECT sub_category, COUNT(*) 
FROM listings 
WHERE category = 'Elektronik' AND sub_category = 'Dizüstü Bilgisayarlar'
GROUP BY sub_category;
