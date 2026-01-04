-- Consolidated migration for Familie, Kind & Baby category
-- Run this in the Supabase SQL Editor to fix the missing column errors

ALTER TABLE listings 
ADD COLUMN IF NOT EXISTS baby_kinderkleidung_art text,
ADD COLUMN IF NOT EXISTS baby_kinderkleidung_size text,
ADD COLUMN IF NOT EXISTS baby_kinderkleidung_gender text,
ADD COLUMN IF NOT EXISTS baby_kinderkleidung_color text,
ADD COLUMN IF NOT EXISTS baby_kinderschuhe_art text,
ADD COLUMN IF NOT EXISTS baby_kinderschuhe_size text,
ADD COLUMN IF NOT EXISTS babyschalen_kindersitze_color text;

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_listings_baby_kinderkleidung_art ON listings(baby_kinderkleidung_art);
CREATE INDEX IF NOT EXISTS idx_listings_baby_kinderschuhe_art ON listings(baby_kinderschuhe_art);
CREATE INDEX IF NOT EXISTS idx_listings_babyschalen_kindersitze_color ON listings(babyschalen_kindersitze_color);

-- Reload Schema Cache
NOTIFY pgrst, 'reload schema';
