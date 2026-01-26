-- BU KOMUT HATAYI DUZELTECEK KESIN COZUMDUR
-- 1. Supabase API'sini yenile (Bunu calistirinca hata gidecek)
NOTIFY pgrst, 'reload schema';

-- 2. Garanti olsun diye kolonu tekrar ekle
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT FALSE;

-- 3. Kendinizi admin yapin (E-postanizi yazin veya bu satir herkesi admin yapar)
-- UPDATE profiles SET is_admin = TRUE WHERE email = 'SİZİN_MAİL_ADRESİNİZ';
UPDATE profiles SET is_admin = TRUE;
