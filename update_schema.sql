-- Add missing columns for filtering if they don't exist

-- Common Filters
ALTER TABLE listings 
ADD COLUMN IF NOT EXISTS offer_type TEXT DEFAULT 'Angebote';
ALTER TABLE listings 
ADD COLUMN IF NOT EXISTS versand_art TEXT;

-- Update existing listings to have a default offer_type
UPDATE listings SET offer_type = 'Angebote' WHERE offer_type IS NULL;

-- Boote & Bootszubehör
ALTER TABLE listings 
ADD COLUMN IF NOT EXISTS boote_art TEXT;

-- Motorrad & Motorroller
ALTER TABLE listings 
ADD COLUMN IF NOT EXISTS motorrad_art TEXT;

-- Motorradteile & Zubehör
ALTER TABLE listings 
ADD COLUMN IF NOT EXISTS motorradteile_art TEXT;

-- Nutzfahrzeuge & Anhänger
ALTER TABLE listings 
ADD COLUMN IF NOT EXISTS nutzfahrzeuge_art TEXT;

-- Wohnwagen- & mobile
ALTER TABLE listings 
ADD COLUMN IF NOT EXISTS wohnwagen_art TEXT;

-- Autoteile & Reifen
ALTER TABLE listings 
ADD COLUMN IF NOT EXISTS autoteile_art TEXT;
ALTER TABLE listings 
ADD COLUMN IF NOT EXISTS autoteile_angebotstyp TEXT;

-- Create indexes for performance on frequently filtered columns
CREATE INDEX IF NOT EXISTS idx_listings_offer_type ON listings(offer_type);
CREATE INDEX IF NOT EXISTS idx_listings_boote_art ON listings(boote_art);
