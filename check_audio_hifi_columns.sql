-- Check which audio/hifi related columns exist in the listings table
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'listings' 
  AND (column_name LIKE '%audio%' OR column_name LIKE '%hifi%')
ORDER BY column_name;

-- Check if there are any listings with audio_hifi_art data
SELECT COUNT(*) as count_audio_hifi_art
FROM listings 
WHERE audio_hifi_art IS NOT NULL;

-- Check if there are any listings with elektronik_audio_hifi_art data
SELECT COUNT(*) as count_elektronik_audio_hifi_art
FROM listings 
WHERE elektronik_audio_hifi_art IS NOT NULL;

-- Show sample data
SELECT id, category, sub_category, audio_hifi_art, elektronik_audio_hifi_art
FROM listings
WHERE category = 'Elektronik' AND sub_category = 'Ses & Hifi'
LIMIT 5;
