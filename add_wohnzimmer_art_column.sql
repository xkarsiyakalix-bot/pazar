-- Add wohnzimmer_art column to listings table
ALTER TABLE listings 
ADD COLUMN IF NOT EXISTS wohnzimmer_art TEXT;

-- Update existing listings (optional, if you want to set a default or migrate data)
-- UPDATE listings SET wohnzimmer_art = 'Sonstige' WHERE category = 'Haus & Garten' AND sub_category = 'Wohnzimmer' AND wohnzimmer_art IS NULL;
