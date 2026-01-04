-- Check unique values for Erkek Giyimi / Herrenbekleidung filters
SELECT 
    sub_category,
    herrenbekleidung_art,
    COUNT(*) as count
FROM listings
WHERE sub_category IN ('Erkek Giyimi', 'Herrenbekleidung')
GROUP BY sub_category, herrenbekleidung_art;

SELECT 
    sub_category,
    herrenbekleidung_marke,
    COUNT(*) as count
FROM listings
WHERE sub_category IN ('Erkek Giyimi', 'Herrenbekleidung')
GROUP BY sub_category, herrenbekleidung_marke;

SELECT 
    sub_category,
    herrenbekleidung_size,
    COUNT(*) as count
FROM listings
WHERE sub_category IN ('Erkek Giyimi', 'Herrenbekleidung')
GROUP BY sub_category, herrenbekleidung_size;

SELECT 
    sub_category,
    herrenbekleidung_color,
    COUNT(*) as count
FROM listings
WHERE sub_category IN ('Erkek Giyimi', 'Herrenbekleidung')
GROUP BY sub_category, herrenbekleidung_color;
