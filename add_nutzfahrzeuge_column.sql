-- Add nutzfahrzeuge_art column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'listings' AND column_name = 'nutzfahrzeuge_art') THEN
        ALTER TABLE listings ADD COLUMN nutzfahrzeuge_art TEXT;
        CREATE INDEX idx_listings_nutzfahrzeuge_art ON listings(nutzfahrzeuge_art);
    END IF;
END $$;
