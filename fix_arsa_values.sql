-- Normalize "Arsa & Bahçe" Filter Values

-- 1. Standardize "grundstuecksart" (Arsa Türü)
-- Expected German values: 'Baugrundstück', 'Garten', 'Land-/Forstwirtschaft', 'Weitere Grundstücke & Gärten'

-- 'İmarlı Arsa' -> 'Baugrundstück'
UPDATE listings
SET grundstuecksart = 'Baugrundstück'
WHERE sub_category = 'Arsa & Bahçe' 
  AND (grundstuecksart IN ('İmarlı Arsa', 'İmar Parseli', 'Arsa') OR grundstuecksart ILIKE '%İmar%');

-- 'Bahçe' -> 'Garten'
UPDATE listings
SET grundstuecksart = 'Garten'
WHERE sub_category = 'Arsa & Bahçe' 
  AND (grundstuecksart IN ('Bahçe', 'Bahçeli', 'Hobi Bahçesi') OR grundstuecksart ILIKE '%Bahçe%');

-- 'Tarım & Orman' -> 'Land-/Forstwirtschaft'
UPDATE listings
SET grundstuecksart = 'Land-/Forstwirtschaft'
WHERE sub_category = 'Arsa & Bahçe' 
  AND (grundstuecksart IN ('Tarım & Orman', 'Tarla', 'Zeytinlik', 'Bağ', 'Orman') OR grundstuecksart ILIKE '%Tarım%');

-- 'Diğer Arsalar & Bahçeler' -> 'Weitere Grundstücke & Gärten'
UPDATE listings
SET grundstuecksart = 'Weitere Grundstücke & Gärten'
WHERE sub_category = 'Arsa & Bahçe' 
  AND (grundstuecksart IN ('Diğer Arsalar & Bahçeler', 'Diğer', 'Sonstige') OR grundstuecksart ILIKE '%Diğer%');

-- Verify
SELECT grundstuecksart, count(*) 
FROM listings 
WHERE sub_category = 'Arsa & Bahçe' 
GROUP BY grundstuecksart;
