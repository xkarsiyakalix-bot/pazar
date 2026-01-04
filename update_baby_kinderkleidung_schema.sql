-- Add columns for Baby- & Kinderkleidung category
ALTER TABLE listings 
ADD COLUMN IF NOT EXISTS baby_kinderkleidung_art text,
ADD COLUMN IF NOT EXISTS baby_kinderkleidung_size text,
ADD COLUMN IF NOT EXISTS baby_kinderkleidung_gender text,
ADD COLUMN IF NOT EXISTS baby_kinderkleidung_color text;

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_listings_baby_kinderkleidung_art ON listings(baby_kinderkleidung_art);
CREATE INDEX IF NOT EXISTS idx_listings_baby_kinderkleidung_size ON listings(baby_kinderkleidung_size);
CREATE INDEX IF NOT EXISTS idx_listings_baby_kinderkleidung_gender ON listings(baby_kinderkleidung_gender);
CREATE INDEX IF NOT EXISTS idx_listings_baby_kinderkleidung_color ON listings(baby_kinderkleidung_color);

COMMENT ON COLUMN listings.baby_kinderkleidung_art IS 'Type of clothing for Baby & Kinderkleidung';
COMMENT ON COLUMN listings.baby_kinderkleidung_size IS 'Size of clothing for Baby & Kinderkleidung';
COMMENT ON COLUMN listings.baby_kinderkleidung_gender IS 'Gender target (Jungen, Mädchen, Unisex)';
COMMENT ON COLUMN listings.baby_kinderkleidung_color IS 'Color of the item';
