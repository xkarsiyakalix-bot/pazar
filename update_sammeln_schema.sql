-- Add sammeln_art column for Sammeln subcategory
ALTER TABLE listings 
ADD COLUMN IF NOT EXISTS sammeln_art TEXT;

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_listings_sammeln_art ON listings(sammeln_art);
