-- EXVITRIN ADMİN YETKİ VARSAYILANI DÜZELTME
-- Yeni kayıt olan kullanıcıların otomatik admin olmasını engeller.

-- 1. admin_role sütunundaki varsayılan 'admin' değerini kaldır (NULL yap)
ALTER TABLE public.profiles ALTER COLUMN admin_role DROP DEFAULT;

-- 2. Mevcut yanlışlıkla admin olmuş kullanıcıları temizle 
-- (Sadece Kerem Aydın ve 1001 numaralı kullanıcı hariç)
UPDATE public.profiles 
SET is_admin = false, 
    admin_role = NULL
WHERE user_number != 1001 
  AND (email != 'kerem_aydin@aol.com' OR email IS NULL);

-- 3. Kerem Aydın'ın yetkilerini garantiye al
UPDATE public.profiles 
SET is_admin = true, 
    admin_role = 'super_admin'
WHERE id IN (SELECT id FROM auth.users WHERE email = 'kerem_aydin@aol.com');
