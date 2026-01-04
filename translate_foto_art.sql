-- Translate Fotoğraf & Kamera "Tür" values from German to Turkish
-- This ensures the type field displays in Turkish on both category and detail pages

-- First, check current values
SELECT DISTINCT foto_art, COUNT(*) as count
FROM listings
WHERE category = 'Elektronik' 
  AND sub_category = 'Fotoğraf & Kamera'
  AND foto_art IS NOT NULL
GROUP BY foto_art;

-- Update German values to Turkish
UPDATE listings
SET foto_art = CASE
    WHEN foto_art = 'Objektiv' THEN 'Objektif'
    WHEN foto_art = 'Zubehör' THEN 'Aksesuar'
    WHEN foto_art = 'Kamera & Zubehör' THEN 'Kamera & Aksesuar'
    WHEN foto_art = 'Weiteres Foto' THEN 'Diğer Fotoğraf'
    ELSE foto_art
END
WHERE category = 'Elektronik'
  AND sub_category = 'Fotoğraf & Kamera'
  AND foto_art IN ('Objektiv', 'Zubehör', 'Kamera & Zubehör', 'Weiteres Foto');

-- Verify the update
SELECT DISTINCT foto_art, COUNT(*) as count
FROM listings
WHERE category = 'Elektronik' 
  AND sub_category = 'Fotoğraf & Kamera'
  AND foto_art IS NOT NULL
GROUP BY foto_art;
