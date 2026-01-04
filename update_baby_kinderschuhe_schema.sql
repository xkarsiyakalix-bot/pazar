-- Add columns for Baby- & Kinderschuhe category
ALTER TABLE listings 
ADD COLUMN IF NOT EXISTS baby_kinderschuhe_art text,
ADD COLUMN IF NOT EXISTS baby_kinderschuhe_size text;

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_listings_baby_kinderschuhe_art ON listings(baby_kinderschuhe_art);
CREATE INDEX IF NOT EXISTS idx_listings_baby_kinderschuhe_size ON listings(baby_kinderschuhe_size);

-- Reload Schema Cache
NOTIFY pgrst, 'reload schema';
