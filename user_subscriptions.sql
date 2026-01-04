-- Add subscription and listing limit columns to profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS subscription_tier TEXT DEFAULT 'free',
ADD COLUMN IF NOT EXISTS subscription_expiry TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS extra_paid_listings INT DEFAULT 0;

-- Comment for clarity
COMMENT ON COLUMN profiles.subscription_tier IS 'free, pack1, pack2, unlimited';
COMMENT ON COLUMN profiles.extra_paid_listings IS 'Number of additional listings purchased beyond the tier limit';
