-- Add job_type column for main Jobs category
ALTER TABLE listings 
ADD COLUMN IF NOT EXISTS job_type text;

-- Comment on column
COMMENT ON COLUMN listings.job_type IS 'General Job Type (e.g. Vollzeit, Teilzeit, Minijob, Praktikum)';
