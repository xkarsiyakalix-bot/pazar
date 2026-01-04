ALTER TABLE listings 
ADD COLUMN IF NOT EXISTS shoe_type TEXT,
ADD COLUMN IF NOT EXISTS size TEXT;

-- Reload schema cache
NOTIFY pgrst, 'reload schema';
