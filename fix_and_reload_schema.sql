-- 1. Sütunu kesinleştir
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'listings' AND column_name = 'dienstleistungen_haus_garten_art') THEN
        ALTER TABLE listings ADD COLUMN dienstleistungen_haus_garten_art text;
    END IF;
END $$;

-- 2. İsimleri düzelt (Tekrar)
UPDATE listings
SET sub_category = 'Ev & Bahçe'
WHERE category = 'Hizmetler'
  AND sub_category IN ('Ev & Bahçe Hizmetleri', 'Haus & Garten', 'Ev Hizmetleri');

-- 3. Art alanını doldur
UPDATE listings
SET dienstleistungen_haus_garten_art = 
  CASE 
    WHEN (title ILIKE '%garten%' OR description ILIKE '%garten%' OR 
          title ILIKE '%bahçe%' OR description ILIKE '%bahçe%' OR
          title ILIKE '%peyzaj%' OR description ILIKE '%landschaft%')
    THEN 'Garten- & Landschaftsbau'
    ELSE 'Weitere Dienstleistungen Haus & Garten'
  END
WHERE sub_category = 'Ev & Bahçe'
  AND (dienstleistungen_haus_garten_art IS NULL OR dienstleistungen_haus_garten_art = '');

-- 4. Şema önbelleğini yenile (ÇOK ÖNEMLİ)
NOTIFY pgrst, 'reload schema';
