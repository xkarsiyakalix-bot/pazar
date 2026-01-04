-- Add offer_type column to listings table if it doesn't exist
ALTER TABLE listings 
ADD COLUMN IF NOT EXISTS offer_type TEXT DEFAULT 'Angebote';

-- Update existing listings to have a default value if null
UPDATE listings 
SET offer_type = 'Angebote' 
WHERE offer_type IS NULL;

-- Optional: Create an index for performance
CREATE INDEX IF NOT EXISTS idx_listings_offer_type ON listings(offer_type);
