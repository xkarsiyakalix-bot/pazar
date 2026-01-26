-- BU TEK DOSYA TÜM SORUNLARI ÇÖZER
-- Doğru projede (Kleinanzeigen) olduğunuzdan emin olun ve bunu çalıştırın.

-- 1. "is_admin" Kolonunu Ekle
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT FALSE;

-- 2. Şema Önbelleğini Yenile (Supabase'in yeni kolonu görmesi için şart)
NOTIFY pgrst, 'reload schema';

-- 3. Sizi Yönetici Yap (User 1001)
-- Eğer doğru projedeysek user_number kolonu kesin vardır.
UPDATE profiles SET is_admin = TRUE WHERE user_number = 1001;

-- 4. Yönetici İzinlerini Tanımla (RLS)
-- Bu sayede admin panelinden diğer kullanıcıları yönetebilirsiniz.
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can update all profiles" ON profiles;

CREATE POLICY "Admins can update all profiles"
ON profiles
FOR UPDATE
USING (
  (SELECT is_admin FROM profiles WHERE id = auth.uid()) = TRUE
  OR
  (SELECT user_number FROM profiles WHERE id = auth.uid()) = 1001
);
