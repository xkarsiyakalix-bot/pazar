-- ACİL DÜZELTME: Bozulan profiles politikasını geri al
-- Sorun: profiles tablosu kendi kendini sorgulayan sonsuz döngü yarattı

-- 1. Sorunlu politikaları sil
DROP POLICY IF EXISTS "Admin can read all profiles" ON profiles;
DROP POLICY IF EXISTS "Admin can read all listings" ON listings;
DROP POLICY IF EXISTS "Admin can read all promotions" ON promotions;
DROP POLICY IF EXISTS "Admin can update all promotions" ON promotions;

-- 2. Profiles tablosunu tüm authenticate kullanıcılara aç (marketplace için standart)
-- Böylece admin de dahil herkes profilleri görebilir
DROP POLICY IF EXISTS "Profiles are viewable by authenticated users" ON profiles;
DROP POLICY IF EXISTS "Anyone can view profiles" ON profiles;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;

CREATE POLICY "Profiles are viewable by authenticated users"
ON profiles FOR SELECT
USING (auth.role() = 'authenticated' OR auth.role() = 'anon');

-- 3. Listings tablosunu da tüm kullanıcılara aç
DROP POLICY IF EXISTS "Listings are viewable by everyone" ON listings;
CREATE POLICY "Listings are viewable by everyone"
ON listings FOR SELECT
USING (true);

-- 4. Promotions için admin güvenli politika (profiles'a recursive bakmasin)
-- admin_role ve is_admin zaten profiles tablosunda var, ama bunu auth.uid() bazli yapalim
DROP POLICY IF EXISTS "Admin can read all promotions" ON promotions;
DROP POLICY IF EXISTS "Admins can view all promotions" ON promotions;
DROP POLICY IF EXISTS "Super admin full access promotions" ON promotions;

-- Promotions: kendi kaydı veya service role
CREATE POLICY "Users can view own promotions"
ON promotions FOR SELECT
USING (auth.uid() = user_id);

-- 5. Dogrulama - mevcut politikalari listele
SELECT tablename, policyname, cmd, qual
FROM pg_policies
WHERE tablename IN ('listings', 'profiles', 'promotions')
ORDER BY tablename, policyname;
