
-- Add the missing column for Lamba attributes
ALTER TABLE listings 
ADD COLUMN IF NOT EXISTS lamba_aydinlatma_art text;

-- Update existing listings to normalize subcategory name
UPDATE listings
SET sub_category = 'Lamba & Aydınlatma'
WHERE sub_category = 'Aydınlatma' AND category = 'Ev & Bahçe';

-- Verify the update
SELECT count(*) as lamba_count 
FROM listings 
WHERE sub_category = 'Lamba & Aydınlatma' AND category = 'Ev & Bahçe';
