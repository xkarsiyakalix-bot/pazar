-- Add dekoration_art column to listings table
ALTER TABLE listings 
ADD COLUMN IF NOT EXISTS dekoration_art text;

-- Notify PostgREST to reload schema
NOTIFY pgrst, 'reload schema';
