-- ============================================================
-- REPORTS TABLOSU - KURULUM VE GÜVENLİK POLİTİKALARI
-- Supabase SQL Editor'de çalıştırın
-- ============================================================

-- 1. Reports tablosunu oluştur (eğer yoksa)
CREATE TABLE IF NOT EXISTS public.reports (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    listing_id UUID REFERENCES public.listings(id) ON DELETE CASCADE,
    reported_by UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    reason TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 2. RLS'i aktive et
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

-- 3. Eski politikaları temizle
DROP POLICY IF EXISTS "Users can insert own reports" ON public.reports;
DROP POLICY IF EXISTS "Users can read own reports" ON public.reports;
DROP POLICY IF EXISTS "Admin can read all reports" ON public.reports;
DROP POLICY IF EXISTS "Admin can update all reports" ON public.reports;
DROP POLICY IF EXISTS "Admin can delete all reports" ON public.reports;
DROP POLICY IF EXISTS "Admins can manage all reports" ON public.reports;

-- 4. Kullanıcılar kendi bildirimlerini ekleyebilsin
CREATE POLICY "Users can insert own reports"
ON public.reports
FOR INSERT
WITH CHECK (auth.uid() = reported_by);

-- 5. Kullanıcılar kendi bildirimlerini görebilsin
CREATE POLICY "Users can read own reports"
ON public.reports
FOR SELECT
USING (auth.uid() = reported_by);

-- 6. Adminler TÜM bildirimleri görebilsin
CREATE POLICY "Admins can read all reports"
ON public.reports
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()
    AND (user_number = 1001 OR is_admin = true OR admin_role = 'super_admin')
  )
);

-- 7. Adminler bildirimleri güncelleyebilsin (Onayla / Reddet)
CREATE POLICY "Admins can update all reports"
ON public.reports
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()
    AND (user_number = 1001 OR is_admin = true OR admin_role = 'super_admin')
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()
    AND (user_number = 1001 OR is_admin = true OR admin_role = 'super_admin')
  )
);

-- 8. Adminler bildirimleri silebilsin
CREATE POLICY "Admins can delete all reports"
ON public.reports
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()
    AND (user_number = 1001 OR is_admin = true OR admin_role = 'super_admin')
  )
);

-- 9. Supabase API önbelleğini yenile
NOTIFY pgrst, 'reload schema';
