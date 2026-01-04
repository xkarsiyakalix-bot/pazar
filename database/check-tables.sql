-- KONTROL: Mevcut tabloları kontrol et
-- Bu SQL'i çalıştırıp sonucu bana gönderin

SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('users', 'listings')
ORDER BY table_name;
