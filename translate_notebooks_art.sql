-- Translate Notebooks "Tür" (Brand/Type) values
-- Fix "Weitere Notebooks" to "Diğer Dizüstü Bilgisayarlar"

UPDATE listings
SET notebooks_art = 'Diğer Dizüstü Bilgisayarlar'
WHERE category = 'Elektronik'
  AND (
    sub_category = 'Dizüstü Bilgisayarlar' OR
    sub_category = 'Dizüstü Bilgisayar'
  )
  AND notebooks_art = 'Weitere Notebooks';

-- Verify updates
SELECT notebooks_art, COUNT(*)
FROM listings
WHERE category = 'Elektronik' 
  AND (sub_category = 'Dizüstü Bilgisayarlar' OR sub_category = 'Dizüstü Bilgisayar')
GROUP BY notebooks_art;
