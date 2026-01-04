-- Standardize "Tatil ve Yurt Dışı Emlak" to "Tatil Evi & Yurt Dışı Emlak"
-- Frontend expects: "Tatil Evi & Yurt Dışı Emlak"

-- LISTINGS TABLE
UPDATE listings
SET sub_category = 'Tatil Evi & Yurt Dışı Emlak'
WHERE sub_category = 'Tatil ve Yurt Dışı Emlak';

-- SUBCATEGORIES TABLE
UPDATE subcategories
SET name = 'Tatil Evi & Yurt Dışı Emlak'
WHERE name = 'Tatil ve Yurt Dışı Emlak';

-- Verify the changes
SELECT sub_category, COUNT(*) as count
FROM listings
WHERE sub_category LIKE 'Tatil%'
GROUP BY sub_category;
