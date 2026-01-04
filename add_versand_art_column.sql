-- Add versand_art column to listings table
ALTER TABLE listings 
ADD COLUMN IF NOT EXISTS versand_art TEXT;

-- Update existing listings (optional, if you want to set a default or migrate data)
-- UPDATE listings SET versand_art = 'Versand möglich' WHERE versand_art IS NULL;
