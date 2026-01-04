-- Fix Audio & Hifi column naming inconsistency
-- The filter uses 'audio_hifi_art' but the save function was using 'elektronik_audio_hifi_art'
-- This script ensures the audio_hifi_art column exists and migrates any data

-- Step 1: Add audio_hifi_art column if it doesn't exist
ALTER TABLE listings
ADD COLUMN IF NOT EXISTS audio_hifi_art TEXT;

-- Step 2: If elektronik_audio_hifi_art column exists, migrate data to audio_hifi_art
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'listings' 
        AND column_name = 'elektronik_audio_hifi_art'
    ) THEN
        -- Copy data from elektronik_audio_hifi_art to audio_hifi_art where audio_hifi_art is null
        UPDATE listings
        SET audio_hifi_art = elektronik_audio_hifi_art
        WHERE elektronik_audio_hifi_art IS NOT NULL 
          AND audio_hifi_art IS NULL;
        
        -- Drop the old column
        ALTER TABLE listings DROP COLUMN elektronik_audio_hifi_art;
    END IF;
END $$;

-- Add a comment to document the column
COMMENT ON COLUMN listings.audio_hifi_art IS 'Type/Art filter for Audio & HiFi listings (e.g., CD Player, Lautsprecher & Kopfhörer, etc.)';
