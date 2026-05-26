-- messages tablosuna eksik olan sütunları ekle
ALTER TABLE public.messages 
ADD COLUMN IF NOT EXISTS sender_phone TEXT,
ADD COLUMN IF NOT EXISTS deleted_by_sender BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS deleted_by_receiver BOOLEAN DEFAULT FALSE;

-- Supabase'in schema cache'ini (önbelleğini) yenile ki yeni sütunları hemen görsün
NOTIFY pgrst, 'reload schema';
