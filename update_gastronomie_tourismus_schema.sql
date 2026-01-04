-- Add gastronomie_tourismus_art column to listings table
ALTER TABLE listings 
ADD COLUMN IF NOT EXISTS gastronomie_tourismus_art text;

-- Add index for better filtering performance
CREATE INDEX IF NOT EXISTS idx_listings_gastronomie_tourismus_art ON listings(gastronomie_tourismus_art);

-- Add comment
COMMENT ON COLUMN listings.gastronomie_tourismus_art IS 'Job type for Gastronomie & Tourismus e.g. Koch/Köchin, Kellner/-in';
