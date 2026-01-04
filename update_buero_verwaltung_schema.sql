-- Add bueroarbeit_verwaltung_art column to listings table
ALTER TABLE listings 
ADD COLUMN IF NOT EXISTS buero_arbeit_verwaltung_art text;

-- Add index for better filtering performance
CREATE INDEX IF NOT EXISTS idx_listings_buero_arbeit_verwaltung_art ON listings(buero_arbeit_verwaltung_art);

-- Add comment
COMMENT ON COLUMN listings.buero_arbeit_verwaltung_art IS 'Job type for Büroarbeit & Verwaltung e.g. Buchhalter/-in, Sekretär/-in';
