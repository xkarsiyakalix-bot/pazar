-- Add sport_camping_art column for filtering
ALTER TABLE listings 
ADD COLUMN IF NOT EXISTS sport_camping_art TEXT;

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_listings_sport_camping_art ON listings(sport_camping_art);
