-- Force populate empty Damenbekleidung fields for existing listings
-- This ensures filters show counts > 0 even for listings created before the fix

-- 1. Update Subcategory Name if not already correct
UPDATE listings 
SET sub_category = 'Kadın Giyimi' 
WHERE sub_category IN ('Damenbekleidung', 'Damenmode', 'Kadın Giyim') 
AND (category = 'Moda & Güzellik' OR category = 'Mode & Beauty');

-- 2. Set 'Diğer Kadın Giyimi' for listings where Type is NULL
UPDATE listings 
SET damenbekleidung_art = 'Diğer Kadın Giyimi'
WHERE sub_category = 'Kadın Giyimi' AND (damenbekleidung_art IS NULL OR damenbekleidung_art = '');

-- 3. Set 'Sonstige' (Diğer) for listings where Brand is NULL
UPDATE listings 
SET damenbekleidung_marke = 'Sonstige'
WHERE sub_category = 'Kadın Giyimi' AND (damenbekleidung_marke IS NULL OR damenbekleidung_marke = '');

-- 4. Set 'Einheitsgröße' (Standart Beden) for listings where Size is NULL
UPDATE listings 
SET damenbekleidung_size = 'Einheitsgröße'
WHERE sub_category = 'Kadın Giyimi' AND (damenbekleidung_size IS NULL OR damenbekleidung_size = '');

-- 5. Set 'Diğer Renkler' for listings where Color is NULL
UPDATE listings 
SET damenbekleidung_color = 'Diğer Renkler'
WHERE sub_category = 'Kadın Giyimi' AND (damenbekleidung_color IS NULL OR damenbekleidung_color = '');

-- Verification: Check the results
SELECT id, title, damenbekleidung_art, damenbekleidung_marke, damenbekleidung_size, damenbekleidung_color 
FROM listings 
WHERE sub_category = 'Kadın Giyimi';
