-- site_settings tablosunu ve varsayılan ayarları oluşturma
CREATE TABLE IF NOT EXISTS public.site_settings (
  id INTEGER PRIMARY KEY DEFAULT 1,
  search_bg_color TEXT DEFAULT '#dc2626',
  site_name TEXT DEFAULT 'ExVitrin',
  site_description TEXT DEFAULT 'Türkiye''nin en büyük ilan pazaryeri.',
  contact_email TEXT DEFAULT 'kerem_aydin@aol.com',
  contact_phone TEXT DEFAULT '+90 212 123 45 67',
  maintenance_mode BOOLEAN DEFAULT false,
  allow_registration BOOLEAN DEFAULT true,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Varsayılan ilk veriyi ekleme (Eğer zaten yoksa)
INSERT INTO public.site_settings (id, search_bg_color, site_name, site_description, contact_email, contact_phone, maintenance_mode, allow_registration) 
VALUES (1, '#2ca2dd', 'ExVitrin', 'Türkiye''nin en büyük ilan pazaryeri.', 'kerem_aydin@aol.com', '+90 212 123 45 67', false, true)
ON CONFLICT (id) DO NOTHING;

-- Row Level Security (RLS) politikasını aktif etme
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Eski politikaları temizleme (varsa)
DROP POLICY IF EXISTS "Public read site_settings" ON public.site_settings;
DROP POLICY IF EXISTS "Admin update site_settings" ON public.site_settings;
DROP POLICY IF EXISTS "Admin insert site_settings" ON public.site_settings;

-- Politikaları oluşturma (Herkes okuyabilir, adminler ekleyebilir/güncelleyebilir)
CREATE POLICY "Public read site_settings" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Admin update site_settings" ON public.site_settings FOR UPDATE USING (true);
CREATE POLICY "Admin insert site_settings" ON public.site_settings FOR INSERT WITH CHECK (true);

-- PostgREST API şema önbelleğini (cache) yenileme
NOTIFY pgrst, 'reload schema';
