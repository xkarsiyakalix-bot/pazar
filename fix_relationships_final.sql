-- FINAL FIX FOR 400 ERROR AND GALLERY
-- It seems the previous script was not run or failed. 
-- Please run this to fix missing tables and connections.

-- 1. Create missing table 'user_follows' (Fixes 404 Error)
CREATE TABLE IF NOT EXISTS user_follows (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    follower_id UUID NOT NULL,
    following_id UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(follower_id, following_id)
);

-- 2. Explicitly Link Tables to 'profiles' (Fixes 400 Bad Request)
-- We remove old constraints and add new ones pointing to 'profiles' table

-- Fix user_follows -> profiles
ALTER TABLE user_follows DROP CONSTRAINT IF EXISTS user_follows_follower_id_fkey;
ALTER TABLE user_follows DROP CONSTRAINT IF EXISTS user_follows_following_id_fkey;
ALTER TABLE user_follows DROP CONSTRAINT IF EXISTS user_follows_follower_id_profiles_fkey;
ALTER TABLE user_follows DROP CONSTRAINT IF EXISTS user_follows_following_id_profiles_fkey;

ALTER TABLE user_follows 
    ADD CONSTRAINT user_follows_follower_id_profiles_fkey 
    FOREIGN KEY (follower_id) REFERENCES profiles(id) ON DELETE CASCADE;

ALTER TABLE user_follows 
    ADD CONSTRAINT user_follows_following_id_profiles_fkey 
    FOREIGN KEY (following_id) REFERENCES profiles(id) ON DELETE CASCADE;

-- Fix messages -> profiles
ALTER TABLE messages DROP CONSTRAINT IF EXISTS messages_sender_id_fkey;
ALTER TABLE messages DROP CONSTRAINT IF EXISTS messages_receiver_id_fkey;
ALTER TABLE messages DROP CONSTRAINT IF EXISTS messages_sender_id_profiles_fkey;
ALTER TABLE messages DROP CONSTRAINT IF EXISTS messages_receiver_id_profiles_fkey;

ALTER TABLE messages 
    ADD CONSTRAINT messages_sender_id_profiles_fkey 
    FOREIGN KEY (sender_id) REFERENCES profiles(id) ON DELETE CASCADE;

ALTER TABLE messages 
    ADD CONSTRAINT messages_receiver_id_profiles_fkey 
    FOREIGN KEY (receiver_id) REFERENCES profiles(id) ON DELETE CASCADE;

-- Fix promotions -> profiles
ALTER TABLE promotions DROP CONSTRAINT IF EXISTS promotions_user_id_fkey;
ALTER TABLE promotions DROP CONSTRAINT IF EXISTS promotions_user_id_profiles_fkey;

ALTER TABLE promotions 
    ADD CONSTRAINT promotions_user_id_profiles_fkey 
    FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;


-- 3. PERMISSIONS (Grant Access)
ALTER TABLE user_follows ENABLE ROW LEVEL SECURITY;
GRANT ALL ON user_follows TO postgres, anon, authenticated;
GRANT ALL ON promotions TO postgres, anon, authenticated;

-- Allow reading
DROP POLICY IF EXISTS "Public read follows" ON user_follows;
CREATE POLICY "Public read follows" ON user_follows FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public read promotions" ON promotions;
CREATE POLICY "Public read promotions" ON promotions FOR SELECT USING (true);


-- 4. FIX GALLERY (Force Data)
-- This ensures 'is_gallery' is TRUE for latest listings
UPDATE listings 
SET is_gallery = true, is_top = true, promotion_expiry = NOW() + INTERVAL '30 days'
WHERE status = 'active'
ORDER BY created_at DESC 
LIMIT 5;

-- 5. RELOAD API CACHE
NOTIFY pgrst, 'reload schema';
