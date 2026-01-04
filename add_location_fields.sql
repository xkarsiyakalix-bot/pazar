-- Add district and region columns to the listings table
ALTER TABLE listings ADD COLUMN IF NOT EXISTS district TEXT;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS region TEXT;

-- Verify columns exist (optional check)
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'listings' AND column_name IN ('district', 'region');
