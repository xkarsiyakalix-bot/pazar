-- Add columns if they don't exist (just to be safe, though they likely do from previous steps)
-- but specifically update the data for Kochen & Backen

-- 1. Ensure columns exist (idempotent)
ALTER TABLE listings ADD COLUMN IF NOT EXISTS seller_type TEXT;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS federal_state TEXT;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS offer_type TEXT;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS condition TEXT;

-- 2. Populate missing data for "Kochen & Backen"
UPDATE listings 
SET seller_type = 'Privat' 
WHERE category = 'Unterricht & Kurse' 
  AND sub_category = 'Kochen & Backen' 
  AND (seller_type IS NULL OR seller_type = '');

UPDATE listings 
SET federal_state = 'Bayern' 
WHERE category = 'Unterricht & Kurse' 
  AND sub_category = 'Kochen & Backen' 
  AND (federal_state IS NULL OR federal_state = '');

UPDATE listings 
SET offer_type = 'Angebote' 
WHERE category = 'Unterricht & Kurse' 
  AND sub_category = 'Kochen & Backen' 
  AND (offer_type IS NULL OR offer_type = '');

-- Just in case condition is used later or elsewhere
UPDATE listings 
SET condition = 'gut' 
WHERE category = 'Unterricht & Kurse' 
  AND sub_category = 'Kochen & Backen' 
  AND (condition IS NULL OR condition = '');
