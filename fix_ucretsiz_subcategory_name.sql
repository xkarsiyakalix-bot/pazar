-- Update listings with old subcategory name "Ücretsiz Verilecekler" to "Ücretsiz"
-- This ensures consistency across the application

-- First, check how many listings will be affected
SELECT COUNT(*) as affected_listings
FROM listings
WHERE category = 'Ücretsiz & Takas'
  AND sub_category = 'Ücretsiz Verilecekler';

-- Update the subcategory name
UPDATE listings
SET sub_category = 'Ücretsiz'
WHERE category = 'Ücretsiz & Takas'
  AND sub_category = 'Ücretsiz Verilecekler';

-- Verify the update
SELECT COUNT(*) as updated_listings
FROM listings
WHERE category = 'Ücretsiz & Takas'
  AND sub_category = 'Ücretsiz';

-- Also update the subcategories table if needed
UPDATE subcategories
SET name = 'Ücretsiz'
WHERE name = 'Ücretsiz Verilecekler';
