-- IMPLEMENT EXPIRY LOGIC (90 DAYS)
-- Run this to switch to expiry_date based system

-- 1. Add expiry_date column if not exists
ALTER TABLE listings 
ADD COLUMN IF NOT EXISTS expiry_date TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '90 days');

-- 2. Migrate existing data
-- Set expiry_date to created_at + 90 days for all listings
UPDATE listings 
SET expiry_date = created_at + INTERVAL '90 days'
WHERE expiry_date IS NULL;

-- 3. Create a function to auto-expire listings
-- This function can be called periodically or we can rely on RLS/View filtering
CREATE OR REPLACE FUNCTION check_expired_listings()
RETURNS void AS $$
BEGIN
    UPDATE listings
    SET status = 'expired'
    WHERE status = 'active' 
    AND expiry_date < NOW();
END;
$$ LANGUAGE plpgsql;

-- 4. Set NOT NULL constraint after migration (optional but good practice)
-- ALTER TABLE listings ALTER COLUMN expiry_date SET NOT NULL;

-- 5. Reload Schema
NOTIFY pgrst, 'reload schema';
