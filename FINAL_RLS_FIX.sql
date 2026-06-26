-- ============================================================
-- KESİN ÇÖZÜM: INFINITE RECURSION (SONSUZ DÖNGÜ) HATASINI DÜZELTME
-- ============================================================

-- 1. Profiles tablosundaki sonsuz döngüye sebep olan HÜTÜN hatalı politikaları siliyoruz
DROP POLICY IF EXISTS "Admin can read all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Profiles are viewable by authenticated users" ON profiles;
DROP POLICY IF EXISTS "Anyone can view profiles" ON profiles;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;

-- 2. Profiles tablosunu herkesin okuyabileceği hale getiriyoruz (Marketplace için güvenli ve standart)
-- İçerisinde herhangi bir alt sorgu (SELECT) barındırmadığı için sonsuz döngü yaratmaz!
CREATE POLICY "Profiles are viewable by everyone"
ON profiles FOR SELECT
USING (true);

-- 3. Listings (İlanlar) tablosundaki sorunlu politikaları temizliyoruz
DROP POLICY IF EXISTS "Admin can read all listings" ON listings;
DROP POLICY IF EXISTS "Admins can view all listings" ON listings;
DROP POLICY IF EXISTS "Listings are viewable by everyone" ON listings;

-- 4. İlanları herkesin okuyabilmesi için basit ve güvenli bir politika ekliyoruz
CREATE POLICY "Listings are viewable by everyone"
ON listings FOR SELECT
USING (true);

-- 5. Promotions (Promosyonlar) tablosundaki sorunlu politikaları temizliyoruz
DROP POLICY IF EXISTS "Admin can read all promotions" ON promotions;
DROP POLICY IF EXISTS "Admins can view all promotions" ON promotions;
DROP POLICY IF EXISTS "Admin can update all promotions" ON promotions;
DROP POLICY IF EXISTS "Super admin full access promotions" ON promotions;
DROP POLICY IF EXISTS "Users can view own promotions" ON promotions;
DROP POLICY IF EXISTS "Select promotions access control" ON promotions;

-- 6. Promotions için güvenli bir okuma politikası oluşturuyoruz
-- Profiles tablosundaki sonsuz döngüyü çözdüğümüz için artık profil kontrolü yapmak GÜVENLİDİR.
CREATE POLICY "Promotions access control"
ON promotions FOR SELECT
USING (
  auth.uid() = user_id  -- Kendi promosyonunu görebilir
  OR EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() 
    AND (user_number = 1001 OR is_admin = true OR admin_role = 'super_admin')
  ) -- Adminler hepsini görebilir
);

-- 7. Değişiklikleri Supabase API'sine bildiriyoruz
NOTIFY pgrst, 'reload schema';
