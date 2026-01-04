-- Add missing columns for Damenbekleidung if they don't exist
ALTER TABLE listings ADD COLUMN IF NOT EXISTS damenbekleidung_art TEXT;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS damenbekleidung_marke TEXT;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS damenbekleidung_size TEXT;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS damenbekleidung_color TEXT;

-- Index these columns for faster filtering
CREATE INDEX IF NOT EXISTS idx_listings_damenbekleidung_art ON listings(damenbekleidung_art);
CREATE INDEX IF NOT EXISTS idx_listings_damenbekleidung_marke ON listings(damenbekleidung_marke);
CREATE INDEX IF NOT EXISTS idx_listings_damenbekleidung_size ON listings(damenbekleidung_size);
CREATE INDEX IF NOT EXISTS idx_listings_damenbekleidung_color ON listings(damenbekleidung_color);
