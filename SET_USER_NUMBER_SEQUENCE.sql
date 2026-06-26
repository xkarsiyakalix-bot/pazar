-- 1. Satıcı numaraları için 1000'den başlayan bir dizi (sequence) oluştur
CREATE SEQUENCE IF NOT EXISTS public.user_number_seq START WITH 1000;

-- 2. Eğer tabloda zaten daha yüksek numaralar (örneğin Admin = 1001) varsa, diziyi en yüksek sayının üzerine ayarla
-- Bu adım, mevcut kullanıcı numaralarıyla çakışmayı (örneğin 1001) önler.
SELECT setval('public.user_number_seq', GREATEST(1000, COALESCE((SELECT MAX(user_number) FROM public.profiles), 1000)));

-- 3. 'profiles' tablosundaki 'user_number' kolonunun varsayılan (default) değerini bu diziye bağla
-- Böylece yeni kayıt olan herkes otomatik olarak sıradaki numarayı (örn: 1002, 1003) alacaktır.
ALTER TABLE public.profiles ALTER COLUMN user_number SET DEFAULT nextval('public.user_number_seq');

-- 4. Daha önceden kayıt olmuş ama 'user_number' atanmamış (NULL) kullanıcılar varsa onlara da sırayla numara ata
UPDATE public.profiles
SET user_number = nextval('public.user_number_seq')
WHERE user_number IS NULL;
