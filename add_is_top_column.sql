-- Add is_top column to listings table
-- This column marks listings that should appear in the gallery/featured section

-- Add the column with default value false
ALTER TABLE listings ADD COLUMN IF NOT EXISTS is_top BOOLEAN DEFAULT false;

-- Mark the first 20 listings as top listings
UPDATE listings 
SET is_top = true 
WHERE id IN (
  SELECT id 
  FROM listings 
  WHERE status = 'active'
  ORDER BY created_at DESC 
  LIMIT 20
);

-- Create an index for better query performance
CREATE INDEX IF NOT EXISTS idx_listings_is_top ON listings(is_top) WHERE is_top = true;
