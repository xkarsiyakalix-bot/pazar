-- Add wohnwagen_art column to listings table
ALTER TABLE listings 
ADD COLUMN IF NOT EXISTS wohnwagen_art TEXT;

-- marke column usually exists for cars, but ensure it is there
ALTER TABLE listings 
ADD COLUMN IF NOT EXISTS marke TEXT;
