-- Fix federal_state field for listings that have city but no federal_state
-- This ensures city-based counts work correctly on category pages

UPDATE listings 
SET federal_state = city 
WHERE federal_state IS NULL AND city IS NOT NULL;

-- Verification
SELECT id, title, city, federal_state 
FROM listings 
WHERE category = 'Eğitim & Kurslar' 
LIMIT 10;
