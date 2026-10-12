-- KULLANICI ADI DEGISTIRME LIMITI ICIN SUTUN EKLEME
-- Kullanıcıların kullanıcı adlarını ayda bir (30 günde bir) değiştirebilmesini sağlar.

ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS username_changed_at TIMESTAMPTZ;

-- Sema onbellegini yenile
NOTIFY pgrst, 'reload schema';

