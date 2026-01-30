-- EXVITRIN ADMİN TEMİZLİK VE YETKİ SIFIRLAMA
-- Bu script tüm kullanıcıların admin yetkilerini alır ve sadece Kerem Aydın'ı Süper Yönetici olarak bırakır.

-- 1. Herkesin admin yetkisini sıfırla
UPDATE profiles 
SET is_admin = FALSE, 
    admin_role = NULL;

-- 2. Sadece ana yöneticiyi (Kerem Aydın) Süper Yönetici yap
-- Email üzerinden eşleştirme en güvenlisidir.
UPDATE profiles 
SET is_admin = TRUE, 
    admin_role = 'super_admin' 
WHERE id IN (
    SELECT id FROM auth.users WHERE email = 'kerem_aydin@aol.com'
);

-- 3. Eğer 1001 numaralı özel bir sistem kullanıcısı varsa onu da koru
UPDATE profiles 
SET is_admin = TRUE, 
    admin_role = 'super_admin' 
WHERE user_number = 1001;

-- Bilgilendirme
-- Artık /admin/admins sayfasında sadece siz görüneceksiniz.
-- Diğer kullanıcıları arama kutusunu kullanarak manuel olarak ekleyebileceksiniz.
