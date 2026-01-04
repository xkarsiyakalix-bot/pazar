-- Add column for Sozialer Sektor & Pflege Art
ALTER TABLE listings 
ADD COLUMN IF NOT EXISTS sozialer_sektor_pflege_art text;

-- Comment on column
COMMENT ON COLUMN listings.sozialer_sektor_pflege_art IS 'Art field for Sozialer Sektor & Pflege (e.g. Altenpfleger/-in, Arzthelfer/-in)';
