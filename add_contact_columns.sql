-- Add contact_phone column if it doesn't exist
ALTER TABLE listings 
ADD COLUMN IF NOT EXISTS contact_phone TEXT;

-- Add contact_name column if it doesn't exist
ALTER TABLE listings 
ADD COLUMN IF NOT EXISTS contact_name TEXT;

-- Comment on columns for clarity
COMMENT ON COLUMN listings.contact_phone IS 'Custom contact phone for this specific listing';
COMMENT ON COLUMN listings.contact_name IS 'Custom contact name for this specific listing';
