-- Add missing vehicle columns to the listings table

ALTER TABLE listings 
ADD COLUMN IF NOT EXISTS kraftstoff TEXT,
ADD COLUMN IF NOT EXISTS leistung INTEGER;

-- Create indexes for commonly filtered fields
CREATE INDEX IF NOT EXISTS idx_listings_kraftstoff ON listings(kraftstoff);
CREATE INDEX IF NOT EXISTS idx_listings_leistung ON listings(leistung);
