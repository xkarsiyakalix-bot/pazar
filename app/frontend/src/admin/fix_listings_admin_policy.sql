-- EXVITRIN ADMIN LİSTELEME VE PROMOSYON YÖNETİMİ YETKİLERİ
-- Bu betik, yöneticilerin (is_admin = TRUE) diğer kullanıcıların ilanlarını ve promosyonlarını 
-- güncelleyebilmesini sağlar. Bu, promosyon iptallerinin çalışması için kritiktir.

-- 1. Helper fonksiyonun varlığından emin ol (setup_admin_refined.sql'den)
-- Eğer yoksa oluştur:
CREATE OR REPLACE FUNCTION public.check_is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND is_admin = TRUE
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. LISTINGS (İlanlar) Tablosu Yetkileri
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;

-- Eski admin politikasını temizle (varsa)
DROP POLICY IF EXISTS "Admins have full access to listings" ON listings;

-- Yöneticiler için tam erişim (UPDATE, DELETE, SELECT)
-- Not: check_is_admin() SECURITY DEFINER olduğu için döngüye girmez.
CREATE POLICY "Admins have full access to listings"
ON listings
FOR ALL
USING ( public.check_is_admin() );

-- 3. PROMOTIONS Tablosu Yetkileri
ALTER TABLE promotions ENABLE ROW LEVEL SECURITY;

-- Eski politikaları temizle
DROP POLICY IF EXISTS "Admins have full access to promotions" ON promotions;
DROP POLICY IF EXISTS "Anyone can view active promotions" ON promotions;

-- Yöneticiler için tam erişim
CREATE POLICY "Admins have full access to promotions"
ON promotions
FOR ALL
USING ( public.check_is_admin() );

-- Kullanıcılar kendi promosyonlarını görebilmeli
DROP POLICY IF EXISTS "Users can view own promotions" ON promotions;
CREATE POLICY "Users can view own promotions"
ON promotions
FOR SELECT
USING ( auth.uid() = user_id );

-- 4. Şema önbelleğini yenile
NOTIFY pgrst, 'reload schema';
