-- Combined migration to ensure all missing vehicle/category columns exist
-- and to force a schema cache reload.

-- 1. Add potentially missing columns (safe to run multiple times due to IF NOT EXISTS)
ALTER TABLE listings 
ADD COLUMN IF NOT EXISTS schlafzimmer_art TEXT,
ADD COLUMN IF NOT EXISTS kraftstoff TEXT,
ADD COLUMN IF NOT EXISTS leistung INTEGER,
ADD COLUMN IF NOT EXISTS marke TEXT,
ADD COLUMN IF NOT EXISTS kilometerstand INTEGER,
ADD COLUMN IF NOT EXISTS erstzulassung INTEGER,
ADD COLUMN IF NOT EXISTS hubraum INTEGER,
ADD COLUMN IF NOT EXISTS getriebe TEXT,
ADD COLUMN IF NOT EXISTS wohnzimmer_art TEXT,
ADD COLUMN IF NOT EXISTS wohnwagen_art TEXT;

-- 2. Create indexes for performance (optional but recommended)
CREATE INDEX IF NOT EXISTS idx_listings_schlafzimmer_art ON listings(schlafzimmer_art);
CREATE INDEX IF NOT EXISTS idx_listings_kraftstoff ON listings(kraftstoff);
CREATE INDEX IF NOT EXISTS idx_listings_leistung ON listings(leistung);

-- 3. Force PostgREST to reload its schema cache to recognize these new columns immediately
NOTIFY pgrst, 'reload schema';
