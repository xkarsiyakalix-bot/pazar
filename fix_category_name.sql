-- Fix miscategorized listings due to translation bug
UPDATE listings
SET category = 'Otomobil, Bisiklet & Tekne'
WHERE category = 'Otomobil, Bisiklet & Tekne Servisi';

-- Standardize subcategory name to match frontend
UPDATE listings
SET sub_category = 'Bisiklet & Aksesuarlar'
WHERE sub_category = 'Bisiklet & Aksesuarları';
