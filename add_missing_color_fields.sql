-- Migration to add missing category-specific fields for Familie, Kind & Baby and Mode & Beauty
-- Run this in the Supabase SQL Editor

ALTER TABLE listings 
-- Familie, Kind & Baby
ADD COLUMN IF NOT EXISTS baby_kinderkleidung_art text,
ADD COLUMN IF NOT EXISTS baby_kinderkleidung_size text,
ADD COLUMN IF NOT EXISTS baby_kinderkleidung_gender text,
ADD COLUMN IF NOT EXISTS baby_kinderkleidung_color text,
ADD COLUMN IF NOT EXISTS baby_kinderschuhe_art text,
ADD COLUMN IF NOT EXISTS baby_kinderschuhe_size text,
ADD COLUMN IF NOT EXISTS baby_kinderschuhe_color text,
ADD COLUMN IF NOT EXISTS kinderwagen_buggys_color text,
ADD COLUMN IF NOT EXISTS kinderwagen_buggys_art text,

-- Mode & Beauty (consistent prefixing)
ADD COLUMN IF NOT EXISTS damenbekleidung_art text,
ADD COLUMN IF NOT EXISTS damenbekleidung_size text,
ADD COLUMN IF NOT EXISTS damenbekleidung_color text,
ADD COLUMN IF NOT EXISTS damenbekleidung_marke text,

ADD COLUMN IF NOT EXISTS damenschuhe_art text,
ADD COLUMN IF NOT EXISTS damenschuhe_size text,
ADD COLUMN IF NOT EXISTS damenschuhe_color text,
ADD COLUMN IF NOT EXISTS damenschuhe_marke text,

ADD COLUMN IF NOT EXISTS herrenbekleidung_art text,
ADD COLUMN IF NOT EXISTS herrenbekleidung_size text,
ADD COLUMN IF NOT EXISTS herrenbekleidung_color text,
ADD COLUMN IF NOT EXISTS herrenbekleidung_marke text,

ADD COLUMN IF NOT EXISTS herrenschuhe_art text,
ADD COLUMN IF NOT EXISTS herrenschuhe_size text,
ADD COLUMN IF NOT EXISTS herrenschuhe_color text,
ADD COLUMN IF NOT EXISTS herrenschuhe_marke text,

-- Additional subcategories
ADD COLUMN IF NOT EXISTS kinderzimmermobel_art text,
ADD COLUMN IF NOT EXISTS spielzeug_art text,
ADD COLUMN IF NOT EXISTS fische_art text,
ADD COLUMN IF NOT EXISTS hunde_art text,
ADD COLUMN IF NOT EXISTS hunde_alter text,
ADD COLUMN IF NOT EXISTS hunde_geimpft text,
ADD COLUMN IF NOT EXISTS hunde_erlaubnis text,
ADD COLUMN IF NOT EXISTS katzen_art text,
ADD COLUMN IF NOT EXISTS katzen_alter text,
ADD COLUMN IF NOT EXISTS katzen_geimpft text,
ADD COLUMN IF NOT EXISTS katzen_erlaubnis text,
ADD COLUMN IF NOT EXISTS kleintiere_art text,
ADD COLUMN IF NOT EXISTS nutztiere_art text,
ADD COLUMN IF NOT EXISTS pferde_art text,
ADD COLUMN IF NOT EXISTS voegel_art text,
ADD COLUMN IF NOT EXISTS vermisste_tiere_status text,
ADD COLUMN IF NOT EXISTS haustier_zubehoer_art text;

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_listings_baby_kinderkleidung_color ON listings(baby_kinderkleidung_color);
CREATE INDEX IF NOT EXISTS idx_listings_baby_kinderschuhe_color ON listings(baby_kinderschuhe_color);
CREATE INDEX IF NOT EXISTS idx_listings_kinderwagen_buggys_color ON listings(kinderwagen_buggys_color);
CREATE INDEX IF NOT EXISTS idx_listings_damenbekleidung_color ON listings(damenbekleidung_color);
CREATE INDEX IF NOT EXISTS idx_listings_damenschuhe_color ON listings(damenschuhe_color);
CREATE INDEX IF NOT EXISTS idx_listings_herrenbekleidung_color ON listings(herrenbekleidung_color);
CREATE INDEX IF NOT EXISTS idx_listings_herrenschuhe_color ON listings(herrenschuhe_color);

-- Reload Schema Cache
NOTIFY pgrst, 'reload schema';
