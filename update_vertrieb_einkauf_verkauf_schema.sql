-- Add column for Vertrieb, Einkauf & Verkauf Art
ALTER TABLE listings 
ADD COLUMN IF NOT EXISTS vertrieb_einkauf_verkauf_art text;

-- Comment on column
COMMENT ON COLUMN listings.vertrieb_einkauf_verkauf_art IS 'Art field for Vertrieb, Einkauf & Verkauf (e.g. Buchhalter/-in, Kaufmann/-frau)';
