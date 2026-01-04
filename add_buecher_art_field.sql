-- Add buecher_zeitschriften_art field to listings table
-- This field stores the book/magazine type for filtering

-- Add the column if it doesn't exist
ALTER TABLE listings 
ADD COLUMN IF NOT EXISTS buecher_zeitschriften_art TEXT;

-- Create an index for better query performance
CREATE INDEX IF NOT EXISTS idx_listings_buecher_art 
ON listings(buecher_zeitschriften_art);

-- Verify the column was added
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'listings' 
  AND column_name = 'buecher_zeitschriften_art';

-- Check current Kitap & Dergi listings
SELECT id, title, category, sub_category, buecher_zeitschriften_art
FROM listings
WHERE category IN ('Müzik, Film & Kitap', 'Musik, Filme & Bücher', 'Musik, Film & Bücher')
  AND sub_category IN ('Kitap & Dergi', 'Bücher & Zeitschriften')
LIMIT 10;
