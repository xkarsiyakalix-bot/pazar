-- COMPREHENSIVE CHECK: Are there ANY listings in Kitap & Dergi?

-- 1. Check all possible category name variations
SELECT 
    category,
    COUNT(*) as count
FROM listings
WHERE category LIKE '%Müzik%' 
   OR category LIKE '%Musik%'
   OR category LIKE '%Film%'
   OR category LIKE '%Kitap%'
   OR category LIKE '%Bücher%'
GROUP BY category
ORDER BY count DESC;

-- 2. Check all subcategories in Müzik, Film & Kitap category
SELECT 
    sub_category,
    COUNT(*) as count
FROM listings
WHERE category IN ('Müzik, Film & Kitap', 'Musik, Filme & Bücher', 'Musik, Film & Bücher')
GROUP BY sub_category
ORDER BY count DESC;

-- 3. Check if there are ANY listings at all in this category
SELECT COUNT(*) as total_muzik_film_kitap_listings
FROM listings
WHERE category IN ('Müzik, Film & Kitap', 'Musik, Filme & Bücher', 'Musik, Film & Bücher');

-- 4. Show sample listings if any exist
SELECT 
    id,
    title,
    category,
    sub_category,
    buecher_zeitschriften_art,
    status,
    created_at
FROM listings
WHERE category IN ('Müzik, Film & Kitap', 'Musik, Filme & Bücher', 'Musik, Film & Bücher')
ORDER BY created_at DESC
LIMIT 20;
