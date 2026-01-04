-- Fix all Müzik, Film & Kitap subcategory mismatches
-- This fixes issues where breadcrumb links lead to empty pages

-- Fix "Çizgi Roman" -> "Çizgi Romanlar"
UPDATE listings
SET sub_category = 'Çizgi Romanlar'
WHERE category = 'Müzik, Film & Kitap'
  AND sub_category = 'Çizgi Roman';

-- Fix "Ofis & Kırtasiye" -> "Kırtasiye"  
UPDATE listings
SET sub_category = 'Kırtasiye'
WHERE category = 'Müzik, Film & Kitap'
  AND sub_category = 'Ofis & Kırtasiye';

-- Fix "Ders Kitapları & Eğitim" -> "Ders Kitapları, Okul & Eğitim"
UPDATE listings
SET sub_category = 'Ders Kitapları, Okul & Eğitim'
WHERE category = 'Müzik, Film & Kitap'
  AND sub_category = 'Ders Kitapları & Eğitim';

-- Fix "Müzik & CD" -> "Müzik & CD'ler"
UPDATE listings
SET sub_category = 'Müzik & CD''ler'
WHERE category = 'Müzik, Film & Kitap'
  AND sub_category = 'Müzik & CD';

-- Verify all listings under Müzik, Film & Kitap
SELECT 
    sub_category,
    COUNT(*) as count
FROM listings
WHERE category = 'Müzik, Film & Kitap'
GROUP BY sub_category
ORDER BY sub_category;

-- Show all affected listings
SELECT id, title, sub_category
FROM listings
WHERE category = 'Müzik, Film & Kitap'
ORDER BY sub_category, title;
