-- SQL Script to fix missing art_type and federal_state values in bike listings
-- Run this in Supabase SQL Editor

-- Update listing: "gazelle e bike"
-- This is a Damen E-Bike based on similar listings
UPDATE listings
SET 
  art_type = 'Damen',
  federal_state = 'Nordrhein-Westfalen'
WHERE id = '9cea72ca-3e69-4d47-b5dd-b5775944c968';

-- Update listing: "Gazelle Areoyo E-Bike Damen 57cm 7gang 28Zoll Hollandrad"
-- Clearly Damen from title
UPDATE listings
SET 
  art_type = 'Damen',
  federal_state = 'Nordrhein-Westfalen'
WHERE id = '5e93155e-70e8-40b1-ad2f-33e6620a73de';

-- Update listing: "Gazelle Arroyo C7 E-​Bike Damen 53cm 7gang Hollandrad"
-- Clearly Damen from title, already has federal_state but missing art_type
UPDATE listings
SET 
  art_type = 'Damen'
WHERE id = '6b5fbf84-da24-4d14-82c3-5f284669a57c';

-- Verify the updates
SELECT 
  id,
  title,
  art_type,
  bike_type,
  federal_state,
  postal_code,
  city
FROM listings
WHERE category = 'Auto, Rad & Boot'
  AND sub_category = 'Fahrräder & Zubehör'
ORDER BY created_at DESC;
