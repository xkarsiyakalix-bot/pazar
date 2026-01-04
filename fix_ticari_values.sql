-- Normalize "Ticari Emlak" Subcategory and Filter Values

-- 0. Standardize Subcategory Name FIRST
-- Variants: 'Gewerbeimmobilien', 'Ticari', 'Ticari Mülk', 'Gewerbe'
UPDATE listings
SET sub_category = 'Ticari Emlak'
WHERE sub_category IN ('Gewerbeimmobilien', 'Ticari', 'Ticari Mülk', 'Gewerbe') OR sub_category ILIKE '%Gewerbe%';

UPDATE subcategories
SET name = 'Ticari Emlak'
WHERE name IN ('Gewerbeimmobilien', 'Ticari', 'Ticari Mülk', 'Gewerbe');


-- 1. Standardize "objektart" (Emlak Tipi) - TEXT column
-- Now we can safely filter by sub_category = 'Ticari Emlak'

UPDATE listings
SET objektart = 'Büros & Praxen'
WHERE sub_category = 'Ticari Emlak' 
  AND (objektart IN ('Büro', 'Praxis', 'Bürofläche', 'Office', 'Büros', 'Praxen') OR objektart ILIKE '%Büro%');

UPDATE listings
SET objektart = 'Lager, Hallen & Produktion'
WHERE sub_category = 'Ticari Emlak' 
  AND (objektart IN ('Lager', 'Halle', 'Produktion', 'Warehouse', 'Lagerhalle') OR objektart ILIKE '%Lager%');

UPDATE listings
SET objektart = 'Gastronomie & Hotels'
WHERE sub_category = 'Ticari Emlak' 
  AND (objektart IN ('Gastronomie', 'Hotel', 'Restaurant', 'Cafe', 'Bar') OR objektart ILIKE '%Gastronomie%');

UPDATE listings
SET objektart = 'Einzelhandel & Kioske'
WHERE sub_category = 'Ticari Emlak' 
  AND (objektart IN ('Einzelhandel', 'Kiosk', 'Laden', 'Shop', 'Retail') OR objektart ILIKE '%Einzelhandel%');

UPDATE listings
SET objektart = 'Weitere Gewerbeeinheiten'
WHERE sub_category = 'Ticari Emlak' 
  AND objektart IN ('Sonstige', 'Andere', 'Other');


-- 2. Standardize "general_features" (Genel Özellikler) - TEXT[] ARRAY column
-- Using array_replace for type safety

-- 'Yeni Yapı' variants -> 'Neubau'
UPDATE listings
SET general_features = array_replace(general_features, 'Yeni Yapı', 'Neubau')
WHERE sub_category = 'Ticari Emlak' AND 'Yeni Yapı' = ANY(general_features);

UPDATE listings
SET general_features = array_replace(general_features, 'New Building', 'Neubau')
WHERE sub_category = 'Ticari Emlak' AND 'New Building' = ANY(general_features);

-- 'Tarihi Eser' variants -> 'Denkmalobjekt'
UPDATE listings
SET general_features = array_replace(general_features, 'Tarihi Eser', 'Denkmalobjekt')
WHERE sub_category = 'Ticari Emlak' AND 'Tarihi Eser' = ANY(general_features);

UPDATE listings
SET general_features = array_replace(general_features, 'Historical', 'Denkmalobjekt')
WHERE sub_category = 'Ticari Emlak' AND 'Historical' = ANY(general_features);


-- 3. Standardize "amenities" (Donanım) - TEXT[] ARRAY column
-- Using array_replace for type safety

-- 'Yüksek Akım' -> 'Starkstrom'
UPDATE listings
SET amenities = array_replace(amenities, 'Yüksek Akım', 'Starkstrom')
WHERE sub_category = 'Ticari Emlak' AND 'Yüksek Akım' = ANY(amenities);

-- 'Klima' -> 'Klimaanlage'
UPDATE listings
SET amenities = array_replace(amenities, 'Klima', 'Klimaanlage')
WHERE sub_category = 'Ticari Emlak' AND 'Klima' = ANY(amenities);

-- 'DV Kablolama' -> 'DV-Verkabelung'
UPDATE listings
SET amenities = array_replace(amenities, 'DV Kablolama', 'DV-Verkabelung')
WHERE sub_category = 'Ticari Emlak' AND 'DV Kablolama' = ANY(amenities);

-- 'Otopark Mevcut' -> 'Parkplätze vorhanden'
UPDATE listings
SET amenities = array_replace(amenities, 'Otopark Mevcut', 'Parkplätze vorhanden')
WHERE sub_category = 'Ticari Emlak' AND 'Otopark Mevcut' = ANY(amenities);

-- 'Engelsiz Erişim' -> 'Stufenloser Zugang'
UPDATE listings
SET amenities = array_replace(amenities, 'Engelsiz Erişim', 'Stufenloser Zugang')
WHERE sub_category = 'Ticari Emlak' AND 'Engelsiz Erişim' = ANY(amenities);

-- 'Mutfak' -> 'Küche'
UPDATE listings
SET amenities = array_replace(amenities, 'Mutfak', 'Küche')
WHERE sub_category = 'Ticari Emlak' AND 'Mutfak' = ANY(amenities);

-- 'Yerden Isıtma' -> 'Fußbodenheizung'
UPDATE listings
SET amenities = array_replace(amenities, 'Yerden Isıtma', 'Fußbodenheizung')
WHERE sub_category = 'Ticari Emlak' AND 'Yerden Isıtma' = ANY(amenities);

-- Verify changes
SELECT sub_category, objektart, general_features, amenities
FROM listings
WHERE sub_category = 'Ticari Emlak'
LIMIT 5;
