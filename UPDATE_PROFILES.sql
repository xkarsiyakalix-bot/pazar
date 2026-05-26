-- profiles tablosuna mesajlaşma ve mağaza özellikleri için gereken eksik sütunları ekler
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS store_logo TEXT,
ADD COLUMN IF NOT EXISTS is_pro BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS is_commercial BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS subscription_tier TEXT,
ADD COLUMN IF NOT EXISTS subscription_expiry TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS store_slug TEXT,
ADD COLUMN IF NOT EXISTS user_number BIGINT;

-- Supabase API önbelleğini yenile
NOTIFY pgrst, 'reload schema';
