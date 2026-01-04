-- Add motorradteile_art column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'listings' AND column_name = 'motorradteile_art') THEN
        ALTER TABLE listings ADD COLUMN motorradteile_art TEXT;
        CREATE INDEX idx_listings_motorradteile_art ON listings(motorradteile_art);
    END IF;
END $$;
