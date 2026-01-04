-- Standardize "Garaj & Otopark" subcategory
-- Target: "Garaj & Otopark"
-- Variants to fix: "Garagen & Stellplätze", "Garaj & Park Yeri", "Garage & Stellplatz"

-- LISTINGS TABLE
UPDATE listings
SET sub_category = 'Garaj & Otopark'
WHERE sub_category IN ('Garagen & Stellplätze', 'Garaj & Park Yeri', 'Garage & Stellplatz', 'Garagen & Stellplaetze');

-- SUBCATEGORIES TABLE
UPDATE subcategories
SET name = 'Garaj & Otopark'
WHERE name IN ('Garagen & Stellplätze', 'Garaj & Park Yeri', 'Garage & Stellplatz', 'Garagen & Stellplaetze');

-- Verify the changes
SELECT sub_category, COUNT(*) as count
FROM listings
WHERE sub_category LIKE '%Garaj%' OR sub_category LIKE '%Garage%'
GROUP BY sub_category;
