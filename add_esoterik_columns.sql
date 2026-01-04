-- Add columns required for Esoterik & Spirituelles filters

-- 1. Ensure 'condition' column exists (Zustand)
ALTER TABLE listings 
ADD COLUMN IF NOT EXISTS condition TEXT;

-- 2. Ensure 'offer_type' column exists (Angebotstyp)
ALTER TABLE listings 
ADD COLUMN IF NOT EXISTS offer_type TEXT;

-- 3. Ensure 'seller_type' column exists (Anbieter)
ALTER TABLE listings 
ADD COLUMN IF NOT EXISTS seller_type TEXT;

-- 4. Ensure 'versand_art' column exists (Versand)
ALTER TABLE listings 
ADD COLUMN IF NOT EXISTS versand_art TEXT;

-- 5. Ensure 'federal_state' column exists (Ort)
ALTER TABLE listings 
ADD COLUMN IF NOT EXISTS federal_state TEXT;

-- Recommended: Create an index for performance on filtering
CREATE INDEX IF NOT EXISTS idx_listings_esoterik_filters 
ON listings(category, sub_category, condition, offer_type, seller_type, federal_state);

-- FIX DATA (Re-run of previous fix to ensure data is populated in new columns)
UPDATE listings 
SET offer_type = 'Angebote' 
WHERE category = 'Unterricht & Kurse' 
  AND sub_category = 'Esoterik & Spirituelles' 
  AND (offer_type IS NULL OR offer_type = '');

UPDATE listings 
SET seller_type = 'Privat' 
WHERE category = 'Unterricht & Kurse' 
  AND sub_category = 'Esoterik & Spirituelles' 
  AND (seller_type IS NULL OR seller_type = '');

UPDATE listings 
SET condition = 'gut' 
WHERE category = 'Unterricht & Kurse' 
  AND sub_category = 'Esoterik & Spirituelles' 
  AND (condition IS NULL OR condition = '');

UPDATE listings 
SET versand_art = 'Versand möglich' 
WHERE category = 'Unterricht & Kurse' 
  AND sub_category = 'Esoterik & Spirituelles' 
  AND (versand_art IS NULL OR versand_art = '');

UPDATE listings 
SET federal_state = 'Bayern' 
WHERE category = 'Unterricht & Kurse' 
  AND sub_category = 'Esoterik & Spirituelles' 
  AND (federal_state IS NULL OR federal_state = '');
