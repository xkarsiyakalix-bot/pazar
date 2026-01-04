-- Add promotion columns to listings table
ALTER TABLE listings 
ADD COLUMN IF NOT EXISTS is_gallery BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS is_multi_bump BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS is_top BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS is_highlighted BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS promotion_expiry TIMESTAMP WITH TIME ZONE;

-- Add indexes for better sorting performance
CREATE INDEX IF NOT EXISTS idx_listings_promotions ON listings(is_top DESC, is_multi_bump DESC, created_at DESC) WHERE status = 'active';
