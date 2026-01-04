-- Fix data for Esoterik & Spirituelles to ensure filters work

-- 1. Ensure Offer Type (Angebotstyp) is set
UPDATE listings 
SET offer_type = 'Angebote' 
WHERE category = 'Unterricht & Kurse' 
  AND sub_category = 'Esoterik & Spirituelles' 
  AND (offer_type IS NULL OR offer_type = '');

-- 2. Ensure Seller Type (Anbieter) is set (Default to Privat)
UPDATE listings 
SET seller_type = 'Privat' 
WHERE category = 'Unterricht & Kurse' 
  AND sub_category = 'Esoterik & Spirituelles' 
  AND (seller_type IS NULL OR seller_type = '');

-- 3. Ensure Condition (Zustand) is set (Default to Gut if missing)
-- Note: Make sure these match the values in EsoterikSpirituellesPage.js options
UPDATE listings 
SET condition = 'gut' 
WHERE category = 'Unterricht & Kurse' 
  AND sub_category = 'Esoterik & Spirituelles' 
  AND (condition IS NULL OR condition = '');

-- 4. Ensure Versand Art is set
UPDATE listings 
SET versand_art = 'Versand möglich' 
WHERE category = 'Unterricht & Kurse' 
  AND sub_category = 'Esoterik & Spirituelles' 
  AND (versand_art IS NULL OR versand_art = '');

-- 5. Ensure Federal State (Ort) is set (Default to Bayern for testing/fix)
UPDATE listings 
SET federal_state = 'Bayern' 
WHERE category = 'Unterricht & Kurse' 
  AND sub_category = 'Esoterik & Spirituelles' 
  AND (federal_state IS NULL OR federal_state = '');

-- 5. Standardize Subcategory Name (Trim whitespace / fix encoding if any)
UPDATE listings
SET sub_category = 'Esoterik & Spirituelles'
WHERE category = 'Unterricht & Kurse'
  AND sub_category ILIKE 'Esoterik%Spirituelles';

-- 6. Ensure Category Name is correct
UPDATE listings
SET category = 'Unterricht & Kurse'
WHERE category ILIKE 'Unterricht%Kurse';
