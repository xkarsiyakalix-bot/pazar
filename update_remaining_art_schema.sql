-- Add new art columns for remaining categories

ALTER TABLE listings 
ADD COLUMN IF NOT EXISTS modellbau_art text,
ADD COLUMN IF NOT EXISTS handarbeit_art text,
ADD COLUMN IF NOT EXISTS kuenstler_musiker_art text,
ADD COLUMN IF NOT EXISTS reise_eventservices_art text,
ADD COLUMN IF NOT EXISTS tierbetreuung_training_art text;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_listings_modellbau_art ON listings(modellbau_art);
CREATE INDEX IF NOT EXISTS idx_listings_handarbeit_art ON listings(handarbeit_art);
CREATE INDEX IF NOT EXISTS idx_listings_kuenstler_musiker_art ON listings(kuenstler_musiker_art);
CREATE INDEX IF NOT EXISTS idx_listings_reise_eventservices_art ON listings(reise_eventservices_art);
CREATE INDEX IF NOT EXISTS idx_listings_tierbetreuung_training_art ON listings(tierbetreuung_training_art);
