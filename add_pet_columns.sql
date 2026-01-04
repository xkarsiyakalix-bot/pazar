-- Add Pet Related Columns if they don't exist
-- This ensures that the frontend fields defined in components.js can be saved to the database

-- Katzen (Cats)
ALTER TABLE listings ADD COLUMN IF NOT EXISTS katzen_art text;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS katzen_alter text;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS katzen_geimpft text;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS katzen_erlaubnis text;

-- Hunde (Dogs)
ALTER TABLE listings ADD COLUMN IF NOT EXISTS hunde_art text;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS hunde_alter text;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS hunde_geimpft text;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS hunde_erlaubnis text;

-- Kleintiere (Small Animals)
ALTER TABLE listings ADD COLUMN IF NOT EXISTS kleintiere_art text;

-- Nutztiere (Farm Animals)
ALTER TABLE listings ADD COLUMN IF NOT EXISTS nutztiere_art text;

-- Pferde (Horses)
ALTER TABLE listings ADD COLUMN IF NOT EXISTS pferde_art text;

-- Fische (Fish)
ALTER TABLE listings ADD COLUMN IF NOT EXISTS fische_art text;

-- Haustier Zubehör (Pet Accessories)
ALTER TABLE listings ADD COLUMN IF NOT EXISTS haustier_zubehoer_art text;

-- Verification
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'listings' 
AND column_name IN (
    'katzen_art', 'katzen_alter', 'katzen_geimpft', 'katzen_erlaubnis',
    'hunde_art', 'hunde_alter', 'hunde_geimpft', 'hunde_erlaubnis',
    'kleintiere_art', 'nutztiere_art', 'pferde_art', 'fische_art',
    'haustier_zubehoer_art'
);
