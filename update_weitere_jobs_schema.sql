-- Add column for Weitere Jobs Art
ALTER TABLE listings 
ADD COLUMN IF NOT EXISTS weitere_jobs_art text;

-- Comment on column
COMMENT ON COLUMN listings.weitere_jobs_art IS 'Art field for Weitere Jobs (e.g. Designer/-in, Hausmeister/-in)';
