-- EXVITRIN GÜVENLİ ADMİN YAPILANDIRMASI (RECURSION FIX - V2)
-- Bu betik RLS döngülerini (infinite recursion) engellemek için yardımcı fonksiyon kullanır.

-- 1. Yardımcı fonksiyon oluştur (Döngüyü kırmak için kritik)
-- SECURITY DEFINER: Bu fonksiyon RLS kontrollerini atlayarak çalışır, böylece döngü oluşmaz.
CREATE OR REPLACE FUNCTION public.check_is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND is_admin = TRUE
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Yetki sıfırlama ve Kerem Aydın'ı admin yapma
UPDATE profiles SET is_admin = FALSE;
UPDATE profiles 
SET is_admin = TRUE 
WHERE id IN (
  SELECT id FROM auth.users WHERE email = 'kerem_aydin@aol.com'
);

-- 3. Row Level Security (RLS) Politikalarını Yeniden Düzenle
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Eski politikaları temizle
DROP POLICY IF EXISTS "Admins can update all profiles" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Anyone can view profiles" ON profiles;
DROP POLICY IF EXISTS "Admins have full access" ON profiles;
DROP POLICY IF EXISTS "Users can update own basic info" ON profiles;
DROP POLICY IF EXISTS "Users can update own info" ON profiles;

-- A) Seçme (Herkes profilleri görebilir - İlan sahiplerini görmek için)
CREATE POLICY "Anyone can view profiles" 
ON profiles FOR SELECT 
USING (true);

-- B) Adminler her şeyi yapabilir
CREATE POLICY "Admins have full access" 
ON profiles FOR ALL 
USING ( public.check_is_admin() );

-- C) Normal kullanıcılar sadece kendi bilgilerini güncelleyebilir (Yetki değiştiremez)
CREATE POLICY "Users can update own info" 
ON profiles FOR UPDATE 
USING ( auth.uid() = id )
WITH CHECK ( 
  public.check_is_admin() OR (is_admin = FALSE)
);

-- 4. Şema önbelleğini yenile
NOTIFY pgrst, 'reload schema';
