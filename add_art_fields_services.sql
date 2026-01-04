-- Migration to add missing category-specific art fields for service categories
-- Run this in the Supabase SQL Editor

ALTER TABLE listings 
ADD COLUMN IF NOT EXISTS altenpflege_art text,
ADD COLUMN IF NOT EXISTS sprachkurse_art text,
ADD COLUMN IF NOT EXISTS kunst_gestaltung_art text,
ADD COLUMN IF NOT EXISTS weiteres_haus_garten_art text;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_listings_altenpflege_art ON listings(altenpflege_art);
CREATE INDEX IF NOT EXISTS idx_listings_sprachkurse_art ON listings(sprachkurse_art);
CREATE INDEX IF NOT EXISTS idx_listings_kunst_gestaltung_art ON listings(kunst_gestaltung_art);
CREATE INDEX IF NOT EXISTS idx_listings_weiteres_haus_garten_art ON listings(weiteres_haus_garten_art);

-- Reload Schema Cache
NOTIFY pgrst, 'reload schema';
