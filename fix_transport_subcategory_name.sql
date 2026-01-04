-- Fix subcategory naming for "Taşımacılık & Nakliye"
-- Previous value in DB was "Nakliye & Taşıma" but frontend expects "Taşımacılık & Nakliye"

-- Update for Emlak category
UPDATE listings
SET sub_category = 'Taşımacılık & Nakliye'
WHERE category = 'Emlak' AND sub_category = 'Nakliye & Taşıma';

-- Update for Hizmetler category (if any)
UPDATE listings
SET sub_category = 'Taşımacılık & Nakliye'
WHERE category = 'Hizmetler' AND sub_category = 'Nakliye & Taşıma';

-- Verify the changes
SELECT category, sub_category, count(*)
FROM listings
WHERE sub_category = 'Taşımacılık & Nakliye'
GROUP BY category, sub_category;
