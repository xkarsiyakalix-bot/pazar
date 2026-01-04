-- Rename subcategory "Bebek Gereçleri" to "Bebek Ekipmanları"
UPDATE listings
SET sub_category = 'Bebek Ekipmanları'
WHERE sub_category = 'Bebek Gereçleri'
  AND category = 'Aile, Çocuk & Bebek';
