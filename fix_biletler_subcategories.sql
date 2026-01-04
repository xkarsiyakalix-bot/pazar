-- Standardize Biletler subcategory names to match frontend expectations
-- Frontend expects: "Spor" and "Çocuk"
-- Database currently has: "Spor Etkinlikleri" and "Çocuk Etkinlikleri"

-- LISTINGS TABLE
-- Update Spor Etkinlikleri to Spor
UPDATE listings
SET sub_category = 'Spor'
WHERE category = 'Biletler'
  AND sub_category = 'Spor Etkinlikleri';

-- Update Çocuk Etkinlikleri to Çocuk
UPDATE listings
SET sub_category = 'Çocuk'
WHERE category = 'Biletler'
  AND sub_category = 'Çocuk Etkinlikleri';

-- SUBCATEGORIES TABLE
UPDATE subcategories SET name = 'Spor' WHERE name = 'Spor Etkinlikleri';
UPDATE subcategories SET name = 'Çocuk' WHERE name = 'Çocuk Etkinlikleri';

-- Verify the changes
SELECT DISTINCT sub_category, COUNT(*) as count
FROM listings
WHERE category = 'Biletler'
GROUP BY sub_category
ORDER BY sub_category;
