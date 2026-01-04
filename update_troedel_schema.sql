-- Add troedel_art column for filtering
ALTER TABLE listings 
ADD COLUMN IF NOT EXISTS troedel_art TEXT;

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_listings_troedel_art ON listings(troedel_art);
