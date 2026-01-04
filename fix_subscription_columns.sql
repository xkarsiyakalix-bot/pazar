-- FINAL SUBSCRIPTION SCHEMA FIX
-- Run this if you get errors during package selection or profile updates

ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS subscription_tier TEXT DEFAULT 'free',
ADD COLUMN IF NOT EXISTS subscription_expiry TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS extra_paid_listings INT DEFAULT 0,
ADD COLUMN IF NOT EXISTS is_commercial BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS is_pro BOOLEAN DEFAULT false;

-- Comment for clarity
COMMENT ON COLUMN profiles.subscription_tier IS 'free, pack1, pack2, unlimited';
COMMENT ON COLUMN profiles.is_commercial IS 'True if user is a corporate seller';

-- RELOAD SCHEMA CACHE
NOTIFY pgrst, 'reload schema';
