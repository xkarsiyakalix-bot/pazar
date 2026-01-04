-- Fix missing categories in the categories table
-- This script adds 'Eğitim & Kurslar' and 'Komşu Yardımı' which exist in listings but not in categories table

-- 1. Add Eğitim & Kurslar category
INSERT INTO categories (id, name, slug, icon, display_order)
VALUES (
    gen_random_uuid(),
    'Eğitim & Kurslar',
    'Egitim-Kurslar',
    'graduation-cap',
    14
)
ON CONFLICT (slug) DO NOTHING;

-- 2. Option A: Rename 'Mahalle Yardımı' to 'Komşu Yardımı' (RECOMMENDED)
-- This ensures consistency with existing listings
UPDATE categories 
SET name = 'Komşu Yardımı', 
    slug = 'Komsu-Yardimi'
WHERE name = 'Mahalle Yardımı';

-- 3. Add subcategories for Eğitim & Kurslar
-- First, get the category ID (we'll use it in the INSERT)
DO $$
DECLARE
    egitim_cat_id UUID;
    komsu_cat_id UUID;
BEGIN
    -- Get Eğitim & Kurslar category ID
    SELECT id INTO egitim_cat_id FROM categories WHERE name = 'Eğitim & Kurslar';
    
    -- Get Komşu Yardımı category ID
    SELECT id INTO komsu_cat_id FROM categories WHERE name = 'Komşu Yardımı';
    
    -- Insert subcategories for Eğitim & Kurslar
    IF egitim_cat_id IS NOT NULL THEN
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
        (gen_random_uuid(), egitim_cat_id, 'Yemek & Pastacılık', 'Yemek-Pastacilik', 11)
        ON CONFLICT (category_id, slug) DO NOTHING;
    END IF;
    
    -- Insert subcategory for Komşu Yardımı
    IF komsu_cat_id IS NOT NULL THEN
        INSERT INTO subcategories (id, category_id, name, slug, display_order) VALUES
        (gen_random_uuid(), komsu_cat_id, 'Komşu Yardımı', 'Komsu-Yardimi', 1)
        ON CONFLICT (category_id, slug) DO NOTHING;
    END IF;
END $$;

-- Verification: Check all categories
SELECT name, slug FROM categories ORDER BY name;
