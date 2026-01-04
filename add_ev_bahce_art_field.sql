-- Ev & Bahçe hizmetleri ilanlarına 'art' alanı ekle
-- Bu, filtre sayılarının doğru görünmesini sağlar

-- Önce mevcut durumu kontrol et
SELECT id, title, sub_category, dienstleistungen_haus_garten_art
FROM listings
WHERE category = 'Hizmetler'
  AND sub_category = 'Ev & Bahçe'
  AND status = 'active';

-- Boş olan 'art' alanlarını varsayılan değere ayarla
-- Başlık/açıklamaya göre otomatik kategorizasyon
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
  AND sub_category = 'Ev & Bahçe'
  AND (dienstleistungen_haus_garten_art IS NULL OR dienstleistungen_haus_garten_art = '')
  AND status = 'active';

-- Sonucu kontrol et
SELECT dienstleistungen_haus_garten_art, COUNT(*) as count
FROM listings
WHERE category = 'Hizmetler'
  AND sub_category = 'Ev & Bahçe'
  AND status = 'active'
GROUP BY dienstleistungen_haus_garten_art
ORDER BY count DESC;
