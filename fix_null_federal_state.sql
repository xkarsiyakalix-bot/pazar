-- Fix NULL federal_state values by copying from city field
-- This will fix the city filter counts issue

-- Update NULL federal_state values with city values
UPDATE listings
SET federal_state = city
WHERE federal_state IS NULL 
  AND city IS NOT NULL;

-- Verify the fix
SELECT 
    id, 
    title, 
    category, 
    sub_category, 
    city, 
    federal_state
FROM listings
WHERE category = 'Eğitim & Kurslar'
ORDER BY sub_category, federal_state;
