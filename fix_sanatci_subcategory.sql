-- Sanatçı & Müzisyen varyasyonlarını standartlaştır
UPDATE listings
SET sub_category = 'Sanatçılar & Müzisyenler'
WHERE category = 'Hizmetler'
  AND sub_category IN ('Sanatçı & Müzisyen', 'Sanatçı ve Müzisyen', 'Sanatci & Müzisyen', 'Künstler & Musiker');

-- Kontrol et
SELECT sub_category, COUNT(*) as count
FROM listings 
WHERE category = 'Hizmetler' 
  AND status = 'active'
GROUP BY sub_category;
