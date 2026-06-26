-- Yöneticilerin (Admins) tüm kullanıcı profillerini güncelleyebilmesi için gerekli yetki (RLS) kuralları

-- 1. Önce eski veya çakışan admin güncelleme politikalarını silelim (eğer varsa hata vermemesi için)
DROP POLICY IF EXISTS "Admins can update all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can update profiles" ON profiles;
DROP POLICY IF EXISTS "Yöneticiler her profili güncelleyebilir" ON profiles;

-- 2. Yöneticilerin (is_admin = true) herhangi bir profilde DEĞİŞİKLİK YAPABİLMESİ (Update) için kural ekliyoruz
CREATE POLICY "Yöneticiler her profili güncelleyebilir" ON profiles
FOR UPDATE
USING (
  (SELECT is_admin FROM profiles WHERE id = auth.uid()) = true
);

-- 3. Güvenlik için, yöneticilerin tüm profilleri OKUYABİLMESİ (Select) için kural
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
CREATE POLICY "Admins can view all profiles" ON profiles
FOR SELECT
USING (
  (SELECT is_admin FROM profiles WHERE id = auth.uid()) = true
);
