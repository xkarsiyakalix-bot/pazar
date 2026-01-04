-- Add Art columns for Elektronik subcategories
ALTER TABLE listings 
ADD COLUMN IF NOT EXISTS audio_hifi_art TEXT,
ADD COLUMN IF NOT EXISTS handy_telefon_art TEXT,
ADD COLUMN IF NOT EXISTS foto_art TEXT,
ADD COLUMN IF NOT EXISTS haushaltsgeraete_art TEXT,
ADD COLUMN IF NOT EXISTS konsolen_art TEXT,
ADD COLUMN IF NOT EXISTS pc_zubehoer_software_art TEXT,
ADD COLUMN IF NOT EXISTS tablets_reader_art TEXT,
ADD COLUMN IF NOT EXISTS tv_video_art TEXT,
ADD COLUMN IF NOT EXISTS notebooks_art TEXT,
ADD COLUMN IF NOT EXISTS pcs_art TEXT,
ADD COLUMN IF NOT EXISTS videospiele_art TEXT,
ADD COLUMN IF NOT EXISTS weitere_elektronik_art TEXT,
ADD COLUMN IF NOT EXISTS dienstleistungen_elektronik_art TEXT;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_listings_audio_hifi_art ON listings(audio_hifi_art);
CREATE INDEX IF NOT EXISTS idx_listings_handy_telefon_art ON listings(handy_telefon_art);
CREATE INDEX IF NOT EXISTS idx_listings_foto_art ON listings(foto_art);
CREATE INDEX IF NOT EXISTS idx_listings_haushaltsgeraete_art ON listings(haushaltsgeraete_art);
CREATE INDEX IF NOT EXISTS idx_listings_konsolen_art ON listings(konsolen_art);
CREATE INDEX IF NOT EXISTS idx_listings_pc_zubehoer_software_art ON listings(pc_zubehoer_software_art);
CREATE INDEX IF NOT EXISTS idx_listings_tablets_reader_art ON listings(tablets_reader_art);
CREATE INDEX IF NOT EXISTS idx_listings_tv_video_art ON listings(tv_video_art);
CREATE INDEX IF NOT EXISTS idx_listings_notebooks_art ON listings(notebooks_art);
CREATE INDEX IF NOT EXISTS idx_listings_pcs_art ON listings(pcs_art);
CREATE INDEX IF NOT EXISTS idx_listings_videospiele_art ON listings(videospiele_art);
CREATE INDEX IF NOT EXISTS idx_listings_weitere_elektronik_art ON listings(weitere_elektronik_art);
CREATE INDEX IF NOT EXISTS idx_listings_dienstleistungen_elektronik_art ON listings(dienstleistungen_elektronik_art);
