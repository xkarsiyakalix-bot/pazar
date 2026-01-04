-- DIAGNOSE SCHEMA DEFICIENCIES
-- Run this to find why 400 errors happen and Gallery is empty

-- 1. Check columns in 'messages' table
-- We suspect 'deleted_by_receiver' or 'deleted_by_sender' might be missing
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'messages';

-- 2. Check if there are ANY listings with is_gallery = true
SELECT count(*) as gallery_listings_count FROM listings WHERE is_gallery = true;

-- 3. Check if there are ANY listings with is_top = true
SELECT count(*) as top_listings_count FROM listings WHERE is_top = true;

-- 4. Check 'promotions' count
SELECT count(*) as promotions_count FROM promotions;
