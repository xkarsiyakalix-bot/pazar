-- Add columns for Jobs (Ausbildung) filtering
ALTER TABLE listings 
ADD COLUMN IF NOT EXISTS working_time text,
ADD COLUMN IF NOT EXISTS hourly_wage numeric;

-- Comment on columns
COMMENT ON COLUMN listings.working_time IS 'Working time model (e.g. Vollzeit, Teilzeit)';
COMMENT ON COLUMN listings.hourly_wage IS 'Hourly wage in EUR';
