-- Add column for Bau, Handwerk & Produktion filtering
ALTER TABLE listings 
ADD COLUMN IF NOT EXISTS bau_handwerk_produktion_art TEXT;

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_listings_bau_handwerk_produktion_art ON listings(bau_handwerk_produktion_art);

-- Comment on column
COMMENT ON COLUMN listings.bau_handwerk_produktion_art IS 'Job type/Art for Bau, Handwerk & Produktion (e.g. Maler/-in, Elektriker/-in)';
