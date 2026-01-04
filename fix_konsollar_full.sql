-- Fix Oyun Konsolları / Konsollar issues

-- 1. Standardize Subcategory Name
-- Standardize to "Konsollar" as used in components.js mapping and KonsolenPage.js
UPDATE listings
SET sub_category = 'Konsollar'
WHERE category = 'Elektronik'
  AND (
    sub_category = 'Oyun Konsolları' OR
    sub_category = 'Konsolen' OR
    sub_category ILIKE '%konsol%'
  )
  AND sub_category != 'Konsollar';

-- 2. Translate Filter Values (konsolen_art) to Turkish
UPDATE listings
SET konsolen_art = CASE
    WHEN konsolen_art = 'Pocket Konsolen' THEN 'El Konsolları'
    WHEN konsolen_art = 'Weitere Konsolen' THEN 'Diğer Konsollar'
    ELSE konsolen_art
END
WHERE category = 'Elektronik'
  AND sub_category = 'Konsollar'
  AND konsolen_art IN ('Pocket Konsolen', 'Weitere Konsolen');

-- Verify updates
SELECT sub_category, COUNT(*) 
FROM listings 
WHERE category = 'Elektronik' AND sub_category = 'Konsollar'
GROUP BY sub_category;

SELECT konsolen_art, COUNT(*)
FROM listings
WHERE category = 'Elektronik' AND sub_category = 'Konsollar'
GROUP BY konsolen_art;
