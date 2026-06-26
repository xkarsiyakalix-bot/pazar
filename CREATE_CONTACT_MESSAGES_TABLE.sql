-- İletişim formundan gelen mesajlar için tablo oluşturma
CREATE TABLE IF NOT EXISTS public.contact_messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'new', -- 'new', 'read', 'replied' vb. olabilir
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Tabloya RLS (Satır Seviyesi Güvenlik) ekleyelim
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Herkesin mesaj gönderebilmesi için (giriş yapmış veya yapmamış)
CREATE POLICY "Anyone can insert contact messages"
    ON public.contact_messages
    FOR INSERT
    TO public
    WITH CHECK (true);

-- Sadece admin'lerin okuyabilmesi için (eğer profiles tablosunda admin_role varsa)
-- Not: Admin sistemi projenizde nasıl çalışıyorsa ona göre düzenleyebilirsiniz.
-- Basitçe şimdilik sadece insert yetkisi verdik, UI'dan adminler panel için ek yetki ekleyebilir.
CREATE POLICY "Only admins can view messages"
    ON public.contact_messages
    FOR SELECT
    USING (
        auth.uid() IN (
            SELECT id FROM public.profiles WHERE admin_role = 'super_admin' OR admin_role = 'admin'
        )
        -- Eğer tüm kullanıcıların kendi mesajını görmesi istenmiyorsa sadece adminler görebilir.
    );
