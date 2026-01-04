-- Add kundenservice_call_center_art column to listings table
ALTER TABLE listings 
ADD COLUMN IF NOT EXISTS kundenservice_call_center_art text;

-- Add index for better filtering performance
CREATE INDEX IF NOT EXISTS idx_listings_kundenservice_call_center_art ON listings(kundenservice_call_center_art);

-- Add comment
COMMENT ON COLUMN listings.kundenservice_call_center_art IS 'Job type for Kundenservice & Call Center';
