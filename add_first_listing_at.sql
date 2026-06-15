-- Add missing first_listing_at column to profiles table
-- This column is queried in getUserStats() in api/profile.js
-- Without it, a silent Supabase error occurs and the column returns NULL
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS first_listing_at TIMESTAMPTZ DEFAULT NULL;

-- Backfill: set first_listing_at to the earliest listing for each user
UPDATE profiles p
SET first_listing_at = (
  SELECT MIN(l.created_at)
  FROM listings l
  WHERE l.user_id = p.id
)
WHERE first_listing_at IS NULL
  AND EXISTS (
    SELECT 1 FROM listings l WHERE l.user_id = p.id
  );

SELECT 'first_listing_at column added and backfilled successfully' AS result;
