-- Migration: Add last_seen tracking for online users
-- Description: Adds last_seen column to profiles table and creates a function to update it
-- Date: 2024-01-08

-- 1. Add last_seen column to profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS last_seen TIMESTAMPTZ DEFAULT NOW();

-- 2. Create index for faster online user queries
CREATE INDEX IF NOT EXISTS idx_profiles_last_seen ON profiles(last_seen);

-- 3. Create function to update last_seen
CREATE OR REPLACE FUNCTION update_last_seen()
RETURNS TRIGGER AS $$
BEGIN
    NEW.last_seen = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 4. Create trigger to auto-update last_seen on profile updates
DROP TRIGGER IF EXISTS trigger_update_last_seen ON profiles;
CREATE TRIGGER trigger_update_last_seen
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_last_seen();

-- 5. Update existing profiles to have current timestamp
UPDATE profiles SET last_seen = NOW() WHERE last_seen IS NULL;
