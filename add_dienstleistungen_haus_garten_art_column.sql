ALTER TABLE listings 
ADD COLUMN IF NOT EXISTS dienstleistungen_haus_garten_art TEXT;

-- Reload schema cache
NOTIFY pgrst, 'reload schema';
