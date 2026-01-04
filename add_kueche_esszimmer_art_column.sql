ALTER TABLE listings 
ADD COLUMN IF NOT EXISTS kueche_esszimmer_art TEXT;

-- Reload schema cache
NOTIFY pgrst, 'reload schema';
