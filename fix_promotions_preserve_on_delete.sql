-- Fix promotions table to preserve records when listings or users are deleted
-- This ensures revenue tracking remains intact in admin reports

-- Step 1: Drop existing foreign key constraints
ALTER TABLE promotions 
DROP CONSTRAINT IF EXISTS promotions_listing_id_fkey;

ALTER TABLE promotions 
DROP CONSTRAINT IF EXISTS promotions_user_id_fkey;

-- Step 2: Re-add foreign keys with SET NULL instead of CASCADE
-- This way, when a listing is deleted, the promotion record stays but listing_id becomes NULL
ALTER TABLE promotions 
ADD CONSTRAINT promotions_listing_id_fkey 
FOREIGN KEY (listing_id) 
REFERENCES listings(id) 
ON DELETE SET NULL;

-- For user_id, we keep the reference but don't cascade delete
-- If a user deletes their account, we still want to track the revenue
ALTER TABLE promotions 
ADD CONSTRAINT promotions_user_id_fkey 
FOREIGN KEY (user_id) 
REFERENCES auth.users(id) 
ON DELETE SET NULL;

-- Step 3: Make listing_id and user_id nullable since they can be set to NULL
ALTER TABLE promotions 
ALTER COLUMN listing_id DROP NOT NULL;

ALTER TABLE promotions 
ALTER COLUMN user_id DROP NOT NULL;

-- Step 4: Add helpful columns to track deleted entities
ALTER TABLE promotions 
ADD COLUMN IF NOT EXISTS listing_title TEXT,
ADD COLUMN IF NOT EXISTS user_email TEXT;

-- Step 5: Create a trigger to capture listing and user info before deletion
CREATE OR REPLACE FUNCTION preserve_promotion_info()
RETURNS TRIGGER AS $$
BEGIN
    -- If listing_id exists, capture the title
    IF NEW.listing_id IS NOT NULL THEN
        SELECT title INTO NEW.listing_title 
        FROM listings 
        WHERE id = NEW.listing_id;
    END IF;
    
    -- If user_id exists, capture the email
    IF NEW.user_id IS NOT NULL THEN
        SELECT email INTO NEW.user_email 
        FROM auth.users 
        WHERE id = NEW.user_id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger that runs before insert or update
DROP TRIGGER IF EXISTS preserve_promotion_info_trigger ON promotions;
CREATE TRIGGER preserve_promotion_info_trigger
BEFORE INSERT OR UPDATE ON promotions
FOR EACH ROW
EXECUTE FUNCTION preserve_promotion_info();

-- Step 6: Backfill existing records with listing titles and user emails
UPDATE promotions p
SET listing_title = l.title
FROM listings l
WHERE p.listing_id = l.id 
AND p.listing_title IS NULL;

UPDATE promotions p
SET user_email = u.email
FROM auth.users u
WHERE p.user_id = u.id 
AND p.user_email IS NULL;

COMMENT ON TABLE promotions IS 'Tracks all promotion purchases. Records are preserved even when listings or users are deleted to maintain revenue history.';
COMMENT ON COLUMN promotions.listing_title IS 'Cached listing title, preserved even after listing deletion';
COMMENT ON COLUMN promotions.user_email IS 'Cached user email, preserved even after user account deletion';
