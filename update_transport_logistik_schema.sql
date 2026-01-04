-- Add column for Transport, Logistik & Verkehr Art
ALTER TABLE listings 
ADD COLUMN IF NOT EXISTS transport_logistik_verkehr_art text;

-- Comment on column
COMMENT ON COLUMN listings.transport_logistik_verkehr_art IS 'Art field for Transport, Logistik & Verkehr (e.g. Kraftfahrer/-in, Kurierfahrer/-in)';
