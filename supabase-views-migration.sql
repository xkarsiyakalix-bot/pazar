-- Step 1: Create listing_views table
CREATE TABLE IF NOT EXISTS listing_views (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  listing_id UUID REFERENCES listings(id) ON DELETE CASCADE,
  ip_address TEXT NOT NULL,
  user_agent TEXT,
  viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(listing_id, ip_address)
);

-- Step 2: Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_listing_views_listing_id ON listing_views(listing_id);
CREATE INDEX IF NOT EXISTS idx_listing_views_ip ON listing_views(ip_address);
CREATE INDEX IF NOT EXISTS idx_listing_views_viewed_at ON listing_views(viewed_at);

-- Step 3: Add views column to listings table
ALTER TABLE listings 
ADD COLUMN IF NOT EXISTS views INTEGER DEFAULT 0;

-- Step 4: Create RPC function to increment views atomically
CREATE OR REPLACE FUNCTION increment_listing_views(listing_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE listings 
  SET views = COALESCE(views, 0) + 1
  WHERE id = listing_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 5: Update existing listings to have views = 0
UPDATE listings SET views = 0 WHERE views IS NULL;
