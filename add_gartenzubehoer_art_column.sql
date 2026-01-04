ALTER TABLE listings 
ADD COLUMN IF NOT EXISTS gartenzubehoer_art TEXT;

-- Reload schema cache
NOTIFY pgrst, 'reload schema';
