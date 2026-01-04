-- ============================================================================
-- COMPLETE FIX FOR EĞİTİM & KURSLAR CATEGORY
-- Run this ONCE in Supabase SQL Editor to fix everything
-- ============================================================================

-- PART 1: Add missing category and subcategories
-- ============================================================================

-- Add Eğitim & Kurslar category if not exists
INSERT INTO categories (id, name, slug, icon, display_order)
VALUES (
    '12cfc2f3-1f47-4c4b-aea7-269fb52f0094',
    'Eğitim & Kurslar',
    'Egitim-Kurslar',
    'book',
    14
)
ON CONFLICT (id) DO UPDATE 
SET name = 'Eğitim & Kurslar', 
    slug = 'Egitim-Kurslar';

-- Add all subcategories
DO $$
DECLARE
    egitim_cat_id UUID := '12cfc2f3-1f47-4c4b-aea7-269fb52f0094';
BEGIN
    -- Delete existing subcategories first to avoid conflicts
    DELETE FROM subcategories WHERE category_id = egitim_cat_id;
    
    -- Insert all subcategories with correct names (WITHOUT "Kursları" suffix where needed)
    INSERT INTO subcategories (id, category_id, name, slug, display_order) VALUES
    (gen_random_uuid(), egitim_cat_id, 'Bilgisayar Kursları', 'Bilgisayar-Kurslari', 1),
    (gen_random_uuid(), egitim_cat_id, 'Dans Kursları', 'Dans-Kurslari', 2),
    (gen_random_uuid(), egitim_cat_id, 'Dil Kursları', 'Dil-Kurslari', 3),
    (gen_random_uuid(), egitim_cat_id, 'Diğer Eğitim & Kurslar', 'Diger-Egitim-Kurslar', 4),
    (gen_random_uuid(), egitim_cat_id, 'Ezoterizm & Spiritüalizm', 'Ezoterizm-Spiritualizm', 5),
    (gen_random_uuid(), egitim_cat_id, 'Müzik & Şan', 'Muzik-San', 6),
    (gen_random_uuid(), egitim_cat_id, 'Özel Ders', 'Ozel-Ders', 7),
    (gen_random_uuid(), egitim_cat_id, 'Sanat & Tasarım', 'Sanat-Tasarim', 8),
    (gen_random_uuid(), egitim_cat_id, 'Spor Kursları', 'Spor-Kurslari', 9),
    (gen_random_uuid(), egitim_cat_id, 'Sürekli Eğitim', 'Surekli-Egitim', 10),
    (gen_random_uuid(), egitim_cat_id, 'Yemek & Pastacılık', 'Yemek-Pastacilik', 11);
END $$;


-- PART 2: Normalize existing listings
-- ============================================================================

-- Update category name variations to standard
UPDATE listings 
SET category = 'Eğitim & Kurslar'
WHERE category IN ('Dersler & Kurslar', 'Unterricht & Kurse', 'Eğitim & Kurslar');

-- Update subcategory names to match database standard (WITHOUT "Kursları" suffix)
UPDATE listings 
SET sub_category = 'Bilgisayar Kursları'
WHERE category = 'Eğitim & Kurslar' 
AND sub_category IN ('Computerkurse', 'Bilgisayar Kursları');

UPDATE listings 
SET sub_category = 'Ezoterizm & Spiritüalizm'
WHERE category = 'Eğitim & Kurslar' 
AND sub_category IN ('Esoterik & Spirituelles', 'Ezoterizm & Spiritüalizm');

UPDATE listings 
SET sub_category = 'Yemek & Pastacılık'
WHERE category = 'Eğitim & Kurslar' 
AND sub_category IN ('Kochen & Backen', 'Yemek & Pastacılık Kursları', 'Yemek & Pastacılık');

UPDATE listings 
SET sub_category = 'Sanat & Tasarım'
WHERE category = 'Eğitim & Kurslar' 
AND sub_category IN ('Kunst & Gestaltung', 'Sanat & Tasarım Kursları', 'Sanat & Tasarım');

UPDATE listings 
SET sub_category = 'Müzik & Şan'
WHERE category = 'Eğitim & Kurslar' 
AND sub_category IN ('Musik & Gesang', 'Müzik & Şan Dersleri', 'Müzik & Şan');

UPDATE listings 
SET sub_category = 'Özel Ders'
WHERE category = 'Eğitim & Kurslar' 
AND sub_category IN ('Nachhilfe', 'Özel Ders');

UPDATE listings 
SET sub_category = 'Spor Kursları'
WHERE category = 'Eğitim & Kurslar' 
AND sub_category IN ('Sportkurse', 'Spor Kursları');

UPDATE listings 
SET sub_category = 'Dil Kursları'
WHERE category = 'Eğitim & Kurslar' 
AND sub_category IN ('Sprachkurse', 'Dil Kursları');

UPDATE listings 
SET sub_category = 'Dans Kursları'
WHERE category = 'Eğitim & Kurslar' 
AND sub_category IN ('Tanzkurse', 'Dans Kursları');

UPDATE listings 
SET sub_category = 'Sürekli Eğitim'
WHERE category = 'Eğitim & Kurslar' 
AND sub_category IN ('Weiterbildung', 'Sürekli Eğitim');

UPDATE listings 
SET sub_category = 'Diğer Eğitim & Kurslar'
WHERE category = 'Eğitim & Kurslar' 
AND sub_category IN ('Weitere Unterricht & Kurse', 'Diğer Dersler & Kurslar', 'Diğer Eğitim & Kurslar');


-- PART 3: Fix federal_state field for ALL listings (not just education)
-- ============================================================================

UPDATE listings 
SET federal_state = city 
WHERE federal_state IS NULL AND city IS NOT NULL;


-- PART 4: Verification
-- ============================================================================

-- Show results
SELECT 
    'Categories' as table_name,
    COUNT(*) as count
FROM categories 
WHERE name = 'Eğitim & Kurslar'

UNION ALL

SELECT 
    'Subcategories' as table_name,
    COUNT(*) as count
FROM subcategories 
WHERE category_id = '12cfc2f3-1f47-4c4b-aea7-269fb52f0094'

UNION ALL

SELECT 
    'Listings' as table_name,
    COUNT(*) as count
FROM listings 
WHERE category = 'Eğitim & Kurslar'

UNION ALL

SELECT 
    'Listings with federal_state' as table_name,
    COUNT(*) as count
FROM listings 
WHERE category = 'Eğitim & Kurslar' AND federal_state IS NOT NULL;

-- Show all subcategories
SELECT name, slug FROM subcategories 
WHERE category_id = '12cfc2f3-1f47-4c4b-aea7-269fb52f0094'
ORDER BY display_order;

-- Show all listings
SELECT title, sub_category, city, federal_state, status 
FROM listings 
WHERE category = 'Eğitim & Kurslar'
ORDER BY sub_category, title;
