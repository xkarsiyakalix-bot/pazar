-- 1. Şema önbelleğini kesin olarak yenile
NOTIFY pgrst, 'reload schema';

-- 2. Eğer tabloyu yanlışlıkla sildiyseniz veya RLS kapalıysa diye güvenlik önlemi
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 3. Mevcut yönetici politikalarını temizle (Çakışmaları önlemek için)
DROP POLICY IF EXISTS "Admins can update all profiles" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

-- 4. KENDİNİZİ YÖNETİCİ YAPIN (Kritik Adım)
-- Bu komut veritabanındaki HERKESİ yönetici yapar. 
-- Panele girdikten sonra diğerlerinin yetkisini alabilirsiniz.
UPDATE profiles SET is_admin = TRUE;

-- 5. Yeni Politikalar Oluştur

-- A) Yöneticiler her profili güncelleyebilir
CREATE POLICY "Admins can update all profiles"
ON profiles
FOR UPDATE
USING (
  (SELECT is_admin FROM profiles WHERE id = auth.uid()) = TRUE
);

-- B) Normal kullanıcılar sadece kendilerini güncelleyebilir
CREATE POLICY "Users can update own profile"
ON profiles
FOR UPDATE
USING (
  auth.uid() = id
);
