-- Add seller_type column to listings table
ALTER TABLE listings 
ADD COLUMN seller_type TEXT;

-- Optional: Update existing listings based on user profiles (requires a join, but simple version below)
-- This is a best-effort backfill. Ideally, you'd run a script.
-- UPDATE listings l
-- SET seller_type = p.seller_type
-- FROM profiles p
-- WHERE l.user_id = p.id;
