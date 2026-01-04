-- FIX Data Mismatches for Kochen & Backen

-- 1. Fix seller_type mismatch ('Privatnutzer' -> 'Privat')
UPDATE listings 
SET seller_type = 'Privat' 
WHERE sub_category = 'Kochen & Backen' 
  AND seller_type = 'Privatnutzer';

-- 2. Ensure federal_state is clean (trim whitespace)
UPDATE listings 
SET federal_state = TRIM(federal_state) 
WHERE sub_category = 'Kochen & Backen';

-- 3. Ensure offer_type is 'Angebote' (should be already, but to be safe)
UPDATE listings 
SET offer_type = 'Angebote' 
WHERE sub_category = 'Kochen & Backen' 
  AND (offer_type IS NULL OR offer_type = '');
