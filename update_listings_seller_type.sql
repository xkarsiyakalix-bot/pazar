-- Backfill seller_type from profiles to listings
-- This ensures existing listings have the correct seller type based on the user's profile settings.

UPDATE listings
SET seller_type = profiles.seller_type
FROM profiles
WHERE listings.user_id = profiles.id;
