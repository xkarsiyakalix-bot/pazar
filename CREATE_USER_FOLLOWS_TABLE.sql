-- 1. Tabloyu oluştur
CREATE TABLE IF NOT EXISTS public.user_follows (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    follower_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    following_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    -- Bir kullanıcı aynı satıcıyı birden fazla kez takip edemez
    UNIQUE(follower_id, following_id)
);

-- 2. RLS (Row Level Security) Etkinleştir
ALTER TABLE public.user_follows ENABLE ROW LEVEL SECURITY;

-- 3. Okuma İzni: Herkes kimin kimi takip ettiğini görebilir
CREATE POLICY "Herkes takipleri görebilir"
ON public.user_follows FOR SELECT
USING (true);

-- 4. Ekleme (Takip Etme) İzni: Kullanıcı sadece kendi adına takip edebilir
CREATE POLICY "Kullanıcılar başkalarını takip edebilir"
ON public.user_follows FOR INSERT
WITH CHECK (auth.uid() = follower_id);

-- 5. Silme (Takipten Çıkma) İzni: Kullanıcı sadece kendi takibini silebilir
CREATE POLICY "Kullanıcılar takipten çıkabilir"
ON public.user_follows FOR DELETE
USING (auth.uid() = follower_id);

-- 6. Supabase şema önbelleğini yenile (Hemen yansıması için)
NOTIFY pgrst, 'reload schema';
