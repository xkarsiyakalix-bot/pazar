-- Fix specific category mismatches that were missed by previous normalization
-- These updates address listings created with 'Dersler & Kurslar' and 'Hobiler & Komşuluk'

-- 1. Fix Education Category
UPDATE listings
SET category = 'Eğitim & Kurslar'
WHERE category = 'Dersler & Kurslar';

-- 2. Fix Hobbies Category
UPDATE listings
SET category = 'Eğlence, Hobi & Mahalle'
WHERE category = 'Hobiler & Komşuluk';

-- Verification (Select to confirm 0 remaining)
SELECT count(*) as remaining_bad_categories 
FROM listings 
WHERE category IN ('Dersler & Kurslar', 'Hobiler & Komşuluk');
