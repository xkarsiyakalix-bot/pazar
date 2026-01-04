-- Add show_location column if it doesn't exist
ALTER TABLE listings 
ADD COLUMN IF NOT EXISTS show_location BOOLEAN DEFAULT FALSE;

-- Add show_phone_number column if it doesn't exist
ALTER TABLE listings 
ADD COLUMN IF NOT EXISTS show_phone_number BOOLEAN DEFAULT FALSE;

-- Comment on columns for clarity
COMMENT ON COLUMN listings.show_location IS 'Whether to show the full address on the listing page';
COMMENT ON COLUMN listings.show_phone_number IS 'Whether to show the seller phone number on the listing page';
