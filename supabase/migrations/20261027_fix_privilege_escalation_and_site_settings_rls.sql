-- =========================================================================
-- EXVITRIN GÜVENLİK YAMASI (Security Hardening & Privilege Escalation Fix)
-- =========================================================================

-- 1. SITE_SETTINGS TABLOSUNU KİLİTLE (Herkesin ayar değiştirmesini engelle)
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admin update site_settings" ON public.site_settings;
DROP POLICY IF EXISTS "Admin insert site_settings" ON public.site_settings;
DROP POLICY IF EXISTS "Public read site_settings" ON public.site_settings;
DROP POLICY IF EXISTS "Admins only update site_settings" ON public.site_settings;
DROP POLICY IF EXISTS "Admins only insert site_settings" ON public.site_settings;

-- Herkes okuyabilir (Site başlığı, logo, renkler için)
CREATE POLICY "Public read site_settings" ON public.site_settings 
  FOR SELECT USING (true);

-- Sadece gerçek yöneticiler (is_admin = true) güncelleyebilir
CREATE POLICY "Admins only update site_settings" ON public.site_settings 
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
        AND profiles.is_admin = true
    )
  );

-- Sadece gerçek yöneticiler ekleyebilir
CREATE POLICY "Admins only insert site_settings" ON public.site_settings 
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
        AND profiles.is_admin = true
    )
  );


-- 2. YETKİ YÜKSELTME KORUMASI (Privilege Escalation Prevention on profiles)
-- Normal bir kullanıcının kendi profilini güncellerken is_admin, admin_role, 
-- user_number gibi kritik alanları değiştirmesini veritabanı seviyesinde engeller.

CREATE OR REPLACE FUNCTION public.protect_profile_privileged_fields()
RETURNS TRIGGER AS $$
BEGIN
  -- Eğer istek istemciden (client / anon / authenticated) geliyorsa
  IF current_setting('role', true) = 'authenticated' OR (auth.jwt() ->> 'role') = 'authenticated' THEN
    
    -- is_admin değişikliği kontrolü
    IF NEW.is_admin IS DISTINCT FROM OLD.is_admin THEN
      IF NOT EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = auth.uid() AND is_admin = true
      ) THEN
        NEW.is_admin := OLD.is_admin; -- Yetkisiz değişikliği reddet
      END IF;
    END IF;

    -- admin_role değişikliği kontrolü
    IF NEW.admin_role IS DISTINCT FROM OLD.admin_role THEN
      IF NOT EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = auth.uid() AND admin_role = 'super_admin'
      ) THEN
        NEW.admin_role := OLD.admin_role; -- Yetkisiz değişikliği reddet
      END IF;
    END IF;

    -- Kullanıcı numarasının değiştirilmesini engelle
    IF NEW.user_number IS DISTINCT FROM OLD.user_number THEN
      NEW.user_number := OLD.user_number;
    END IF;

    -- Ücretsiz ilan hakkını kendiliğinden artırmasını engelle
    IF NEW.extra_paid_listings IS DISTINCT FROM OLD.extra_paid_listings THEN
      IF NOT EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = auth.uid() AND is_admin = true
      ) THEN
        NEW.extra_paid_listings := OLD.extra_paid_listings;
      END IF;
    END IF;

    -- Abonelik paketini (Pro/Kurumsal) kendiliğinden değiştirmesini engelle
    IF NEW.subscription_tier IS DISTINCT FROM OLD.subscription_tier THEN
      IF NOT EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = auth.uid() AND is_admin = true
      ) THEN
        NEW.subscription_tier := OLD.subscription_tier;
      END IF;
    END IF;

  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS tr_protect_profile_privileged_fields ON public.profiles;
CREATE TRIGGER tr_protect_profile_privileged_fields
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.protect_profile_privileged_fields();


-- 3. MEVCUT ADMIN HESAPLARINI KONTROL ET VE GÜVENCEYE AL
-- Sadece gerçek hesaplar admin kalabilir, diğer yetkisiz yükseltmeler kapatılır.
UPDATE public.profiles 
SET is_admin = false, 
    admin_role = NULL
WHERE email NOT IN ('kerem_aydin@aol.com', 'exvitrin@gmail.com')
  AND (is_admin = true OR admin_role IS NOT NULL);

-- Kerem Aydın hesaplarının yetkisini doğrula
UPDATE public.profiles 
SET is_admin = true,
    admin_role = 'super_admin'
WHERE email IN ('kerem_aydin@aol.com', 'exvitrin@gmail.com');


-- 4. SITE_SETTINGS DEĞERLERİNİ TEMİZLE
UPDATE public.site_settings
SET site_name = 'ExVitrin',
    site_description = 'Türkiye''nin En Büyük İlan Pazaryeri',
    updated_at = NOW()
WHERE id = 1;
