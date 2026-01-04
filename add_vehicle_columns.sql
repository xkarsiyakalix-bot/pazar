-- Add missing vehicle columns to the listings table

ALTER TABLE listings 
ADD COLUMN IF NOT EXISTS marke TEXT,
ADD COLUMN IF NOT EXISTS kilometerstand INTEGER,
ADD COLUMN IF NOT EXISTS erstzulassung INTEGER,
ADD COLUMN IF NOT EXISTS hubraum INTEGER,
ADD COLUMN IF NOT EXISTS getriebe TEXT;

-- Create indexes for commonly filtered fields
CREATE INDEX IF NOT EXISTS idx_listings_marke ON listings(marke);
CREATE INDEX IF NOT EXISTS idx_listings_erstzulassung ON listings(erstzulassung);
CREATE INDEX IF NOT EXISTS idx_listings_kilometerstand ON listings(kilometerstand);
