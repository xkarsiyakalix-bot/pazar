-- Create listing_views table for tracking unique visitors
CREATE TABLE IF NOT EXISTS listing_views (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
    ip_address TEXT NOT NULL,
    user_agent TEXT,
    viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(listing_id, ip_address)
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_listing_views_listing_id ON listing_views(listing_id);
CREATE INDEX IF NOT EXISTS idx_listing_views_ip_address ON listing_views(ip_address);
CREATE INDEX IF NOT EXISTS idx_listing_views_viewed_at ON listing_views(viewed_at DESC);

-- Add views column to listings table if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'listings' AND column_name = 'views'
    ) THEN
        ALTER TABLE listings ADD COLUMN views INTEGER DEFAULT 0;
    END IF;
END $$;

-- Create RPC function to increment listing views
CREATE OR REPLACE FUNCTION increment_listing_views(listing_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    UPDATE listings
    SET views = COALESCE(views, 0) + 1
    WHERE id = listing_id;
END;
$$;

-- Enable Row Level Security on listing_views
ALTER TABLE listing_views ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can insert view records" ON listing_views;
DROP POLICY IF EXISTS "Anyone can read view records" ON listing_views;

-- Policy: Anyone can insert view records
CREATE POLICY "Anyone can insert view records"
    ON listing_views
    FOR INSERT
    WITH CHECK (true);

-- Policy: Anyone can read view records
CREATE POLICY "Anyone can read view records"
    ON listing_views
    FOR SELECT
    USING (true);

-- Add comments
COMMENT ON TABLE listing_views IS 'Tracks unique visitors for listings based on IP address';
COMMENT ON COLUMN listing_views.ip_address IS 'IP address or fallback identifier of the visitor';
COMMENT ON COLUMN listing_views.viewed_at IS 'Timestamp when the listing was viewed';
COMMENT ON FUNCTION increment_listing_views IS 'Increments the view count for a listing';
