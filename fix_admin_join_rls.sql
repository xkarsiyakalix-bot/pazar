-- ============================================================
-- FIX: Admin RLS Policies for JOIN Queries
-- Sorun: promotions JOIN listings/profiles sorgusu boş dönüyor
-- Çünkü: listings ve profiles tablolarında admin okuma yetkisi yok
-- ============================================================

-- 1. Önce mevcut admin politikalarını temizle (varsa)
DROP POLICY IF EXISTS "Admin can read all listings" ON listings;
DROP POLICY IF EXISTS "Admin can read all profiles" ON profiles;
DROP POLICY IF EXISTS "Admin can read all promotions" ON promotions;
DROP POLICY IF EXISTS "Admins can view all promotions" ON promotions;
DROP POLICY IF EXISTS "Super admin full access promotions" ON promotions;

-- 2. LISTINGS tablosu için admin okuma politikası
CREATE POLICY "Admin can read all listings"
ON listings FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND (profiles.user_number = 1001 OR profiles.admin_role = 'super_admin' OR profiles.is_admin = true)
  )
  OR auth.uid() = user_id  -- Kendi ilanını da okuyabilsin
  OR status = 'active'     -- Aktif ilanlar herkese açık
);

-- 3. PROFILES tablosu için admin okuma politikası
CREATE POLICY "Admin can read all profiles"
ON profiles FOR SELECT
USING (
  auth.uid() = id  -- Kendi profilini okuyabilsin
  OR EXISTS (
    SELECT 1 FROM profiles AS admin_check
    WHERE admin_check.id = auth.uid()
    AND (admin_check.user_number = 1001 OR admin_check.admin_role = 'super_admin' OR admin_check.is_admin = true)
  )
);

-- 4. PROMOTIONS tablosu için admin okuma politikası  
CREATE POLICY "Admin can read all promotions"
ON promotions FOR SELECT
USING (
  auth.uid() = user_id  -- Kendi promosyonunu okuyabilsin
  OR EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND (profiles.user_number = 1001 OR profiles.admin_role = 'super_admin' OR profiles.is_admin = true)
  )
);

-- 5. PROMOTIONS tablosu için admin yazma politikası (iptal etme vb.)
DROP POLICY IF EXISTS "Admin can update all promotions" ON promotions;
CREATE POLICY "Admin can update all promotions"
ON promotions FOR UPDATE
USING (
  auth.uid() = user_id
  OR EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND (profiles.user_number = 1001 OR profiles.admin_role = 'super_admin' OR profiles.is_admin = true)
  )
);

-- 6. Doğrulama: Politikaları listele
SELECT tablename, policyname, cmd
FROM pg_policies
WHERE tablename IN ('listings', 'profiles', 'promotions')
ORDER BY tablename, policyname;
