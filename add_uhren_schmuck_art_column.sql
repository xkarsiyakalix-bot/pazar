ALTER TABLE listings 
ADD COLUMN IF NOT EXISTS uhren_schmuck_art TEXT;

-- Reload schema cache
NOTIFY pgrst, 'reload schema';
