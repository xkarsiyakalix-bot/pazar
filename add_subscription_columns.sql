
-- Add subscription fields to profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS subscription_tier TEXT DEFAULT 'free',
ADD COLUMN IF NOT EXISTS subscription_expiry TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS extra_paid_listings INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS is_pro BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS is_commercial BOOLEAN DEFAULT false;

-- Comment on columns
COMMENT ON COLUMN profiles.subscription_tier IS 'Subscription package: free, pack1, pack2, unlimited';
COMMENT ON COLUMN profiles.extra_paid_listings IS 'Additional one-time listing rights purchased';
