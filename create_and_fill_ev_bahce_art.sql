-- 1. Önce sütunun var olup olmadığını kontrol et ve yoksa ekle
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'listings' AND column_name = 'dienstleistungen_haus_garten_art') THEN
        ALTER TABLE listings ADD COLUMN dienstleistungen_haus_garten_art text;
    END IF;
END $$;

-- 2. Varolan ilanlar için bu alanı otomatik doldur
UPDATE listings
SET dienstleistungen_haus_garten_art = 
  CASE 
    WHEN (title ILIKE '%garten%' OR description ILIKE '%garten%' OR 
          title ILIKE '%bahçe%' OR description ILIKE '%bahçe%' OR
          title ILIKE '%peyzaj%' OR description ILIKE '%landschaft%')
    THEN 'Garten- & Landschaftsbau'
    
    WHEN (title ILIKE '%bau%' OR description ILIKE '%bau%' OR
          title ILIKE '%inşaat%' OR description ILIKE '%inşaat%' OR
          title ILIKE '%handwerk%' OR description ILIKE '%el sanat%')
    THEN 'Bau & Handwerk'
    
    WHEN (title ILIKE '%reinigung%' OR description ILIKE '%reinigung%' OR
          title ILIKE '%temizlik%' OR description ILIKE '%temizlik%')
    THEN 'Reinigungsservice'
    
    WHEN (title ILIKE '%reparatur%' OR description ILIKE '%reparatur%' OR
          title ILIKE '%tamir%' OR description ILIKE '%onarım%')
    THEN 'Reparaturen'
    
    WHEN (title ILIKE '%haushalt%' OR description ILIKE '%haushalt%' OR
          title ILIKE '%ev yardım%' OR description ILIKE '%ev yardım%')
    THEN 'Haushaltshilfe'
    
    ELSE 'Weitere Dienstleistungen Haus & Garten'
  END
WHERE category = 'Hizmetler'
  AND sub_category IN ('Ev & Bahçe', 'Ev & Bahçe Hizmetleri', 'Haus & Garten', 'Ev Hizmetleri')
  AND (dienstleistungen_haus_garten_art IS NULL OR dienstleistungen_haus_garten_art = '');

-- 3. Kontrol et: Veriler doldu mu?
SELECT id, title, sub_category, dienstleistungen_haus_garten_art
FROM listings
WHERE category = 'Hizmetler' 
  AND sub_category IN ('Ev & Bahçe', 'Ev & Bahçe Hizmetleri', 'Haus & Garten', 'Ev Hizmetleri');
