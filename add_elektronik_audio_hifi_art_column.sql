-- Add elektronik_audio_hifi_art column to listings table
-- This column stores the "Art" (Type) filter value for Elektronik > Audio & HiFi subcategory

ALTER TABLE listings
ADD COLUMN IF NOT EXISTS elektronik_audio_hifi_art TEXT;

-- Add a comment to document the column
COMMENT ON COLUMN listings.elektronik_audio_hifi_art IS 'Type/Art filter for Audio & HiFi listings (e.g., Lautsprecher, Kopfhörer, etc.)';
