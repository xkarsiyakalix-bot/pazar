-- Add all remaining columns for Immobilien subcategories
ALTER TABLE listings 
ADD COLUMN IF NOT EXISTS floor INTEGER,
ADD COLUMN IF NOT EXISTS construction_year INTEGER,
ADD COLUMN IF NOT EXISTS plot_area DECIMAL,
ADD COLUMN IF NOT EXISTS commission TEXT,
ADD COLUMN IF NOT EXISTS wohnungstyp TEXT,
ADD COLUMN IF NOT EXISTS haustyp TEXT,
ADD COLUMN IF NOT EXISTS grundstuecksart TEXT,
ADD COLUMN IF NOT EXISTS objektart TEXT, -- for Gewerbe
ADD COLUMN IF NOT EXISTS garage_type TEXT, -- rename garageType to garage_type if needed
ADD COLUMN IF NOT EXISTS area DECIMAL, -- generic area field
ADD COLUMN IF NOT EXISTS price_per_sqm DECIMAL,
ADD COLUMN IF NOT EXISTS lage TEXT, -- for Ferien
ADD COLUMN IF NOT EXISTS apartment_features TEXT[],
ADD COLUMN IF NOT EXISTS house_features TEXT[],
ADD COLUMN IF NOT EXISTS angebotsart TEXT; -- for Grundstücke

-- Indexing for performance
CREATE INDEX IF NOT EXISTS idx_listings_wohnungstyp ON listings(wohnungstyp);
CREATE INDEX IF NOT EXISTS idx_listings_haustyp ON listings(haustyp);
CREATE INDEX IF NOT EXISTS idx_listings_objektart ON listings(objektart);
CREATE INDEX IF NOT EXISTS idx_listings_grundstuecksart ON listings(grundstuecksart);
