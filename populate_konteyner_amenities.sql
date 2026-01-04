-- Add test amenities to Konteyner listings to verify filters
UPDATE listings
SET amenities = ARRAY['Starkstrom', 'Klimaanlage']
WHERE sub_category = 'Konteyner' AND (amenities IS NULL OR array_length(amenities, 1) = 0);

-- randomly add different amenities to some listings for variety
UPDATE listings
SET amenities = ARRAY['DV-Verkabelung', 'Stufenloser Zugang']
WHERE sub_category = 'Konteyner' AND id IN (SELECT id FROM listings WHERE sub_category = 'Konteyner' LIMIT 1);

-- Fix Ticari Emlak listings too if empty
UPDATE listings
SET amenities = ARRAY['Klimaanlage', 'Parkplätze vorhanden']
WHERE sub_category = 'Ticari Emlak' AND (amenities IS NULL OR array_length(amenities, 1) = 0);
