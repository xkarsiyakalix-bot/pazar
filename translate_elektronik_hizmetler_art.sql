-- Translate Elektronik Hizmetler "Tür" values from German to Turkish
-- This ensures the type field displays in Turkish on both category and detail pages

-- First, check current values
SELECT DISTINCT dienstleistungen_elektronik_art, COUNT(*) as count
FROM listings
WHERE category = 'Elektronik' 
  AND sub_category IN ('Elektronik Hizmetler', 'Elektronik Servisler', 'Dienstleistungen Elektronik')
  AND dienstleistungen_elektronik_art IS NOT NULL
GROUP BY dienstleistungen_elektronik_art;

-- Update German values to Turkish
UPDATE listings
SET dienstleistungen_elektronik_art = CASE
    WHEN dienstleistungen_elektronik_art = 'Reparaturen' THEN 'Onarım'
    WHEN dienstleistungen_elektronik_art = 'Installationen' THEN 'Kurulum'
    WHEN dienstleistungen_elektronik_art = 'Weitere Dienstleistungen' THEN 'Diğer Hizmetler'
    WHEN dienstleistungen_elektronik_art = 'Tamirat' THEN 'Onarım'  -- Old Turkish variant
    ELSE dienstleistungen_elektronik_art
END
WHERE category = 'Elektronik'
  AND sub_category IN ('Elektronik Hizmetler', 'Elektronik Servisler', 'Dienstleistungen Elektronik')
  AND dienstleistungen_elektronik_art IN ('Reparaturen', 'Installationen', 'Weitere Dienstleistungen', 'Tamirat');

-- Verify the update
SELECT DISTINCT dienstleistungen_elektronik_art, COUNT(*) as count
FROM listings
WHERE category = 'Elektronik' 
  AND sub_category IN ('Elektronik Hizmetler', 'Elektronik Servisler', 'Dienstleistungen Elektronik')
  AND dienstleistungen_elektronik_art IS NOT NULL
GROUP BY dienstleistungen_elektronik_art;
