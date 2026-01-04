-- Normalize Emlak subcategories to singular naming convention
-- This matches the AddListing component and the updated Page components

-- LISTINGS TABLE
-- Satılık Daireler -> Satılık Daire
UPDATE listings
SET sub_category = 'Satılık Daire'
WHERE sub_category = 'Satılık Daireler';

-- Kiralık Daireler -> Kiralık Daire
UPDATE listings
SET sub_category = 'Kiralık Daire'
WHERE sub_category = 'Kiralık Daireler';

-- Satılık Evler -> Satılık Müstakil Ev
-- Note: Satılık Evler might be ambiguous, but usually refers to Houses (Müstakil Ev)
UPDATE listings
SET sub_category = 'Satılık Müstakil Ev'
WHERE sub_category = 'Satılık Evler';

-- Kiralık Evler -> Kiralık Müstakil Ev
UPDATE listings
SET sub_category = 'Kiralık Müstakil Ev'
WHERE sub_category = 'Kiralık Evler';

-- SUBCATEGORIES TABLE
UPDATE subcategories SET name = 'Satılık Daire' WHERE name = 'Satılık Daireler';
UPDATE subcategories SET name = 'Kiralık Daire' WHERE name = 'Kiralık Daireler';
UPDATE subcategories SET name = 'Satılık Müstakil Ev' WHERE name = 'Satılık Evler';
UPDATE subcategories SET name = 'Kiralık Müstakil Ev' WHERE name = 'Kiralık Evler';

-- Verify counts
SELECT sub_category, COUNT(*)
FROM listings
WHERE category = 'Emlak'
GROUP BY sub_category;
