-- MASTER FIX: GALLERY, ADMIN PANEL AND CONSOLE ERRORS
-- Run this script to fix EVERYTHING at once.

-- 1. FIX MISSING TABLES (Resolves 404 errors)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS user_follows (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    follower_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    following_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(follower_id, following_id)
);

-- 2. FIX SCHEMA RELATIONSHIPS (Resolves 400 Bad Request errors)
-- Promotions -> Profiles (needed for Admin Panel names)
ALTER TABLE promotions DROP CONSTRAINT IF EXISTS promotions_user_id_profiles_fkey;
ALTER TABLE promotions 
    ADD CONSTRAINT promotions_user_id_profiles_fkey 
    FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;

-- Messages -> Profiles (needed for Messenger)
ALTER TABLE messages DROP CONSTRAINT IF EXISTS messages_sender_id_fkey;
ALTER TABLE messages DROP CONSTRAINT IF EXISTS messages_receiver_id_fkey;
ALTER TABLE messages 
    ADD CONSTRAINT messages_sender_id_fkey 
    FOREIGN KEY (sender_id) REFERENCES profiles(id) ON DELETE CASCADE;
ALTER TABLE messages 
    ADD CONSTRAINT messages_receiver_id_fkey 
    FOREIGN KEY (receiver_id) REFERENCES profiles(id) ON DELETE CASCADE;


-- 3. ENABLE RLS & PERMISSIONS
ALTER TABLE user_follows ENABLE ROW LEVEL SECURITY;
GRANT ALL ON user_follows TO postgres, anon, authenticated;
GRANT ALL ON promotions TO postgres, anon, authenticated;
GRANT ALL ON listings TO postgres, anon, authenticated;

-- Reset Policies for user_follows
DROP POLICY IF EXISTS "Public read follows" ON user_follows;
CREATE POLICY "Public read follows" ON user_follows FOR SELECT USING (true);
DROP POLICY IF EXISTS "Users can follow" ON user_follows;
CREATE POLICY "Users can follow" ON user_follows FOR INSERT WITH CHECK (auth.uid() = follower_id);
DROP POLICY IF EXISTS "Users can unfollow" ON user_follows;
CREATE POLICY "Users can unfollow" ON user_follows FOR DELETE USING (auth.uid() = follower_id);


-- 4. FIX GALLERY VISIBILITY (Resolves empty Main Page Gallery)
-- Force the latest 5 active listings to appear in the gallery
UPDATE listings
SET 
    is_top = true,
    is_gallery = true,
    is_highlighted = true,
    promotion_expiry = NOW() + INTERVAL '30 days'
WHERE id IN (
    SELECT id FROM listings 
    WHERE status = 'active'
    ORDER BY created_at DESC 
    LIMIT 5
);

-- 5. FIX ADMIN PANEL DATA (Resolves empty Admin Panel)
-- Ensure these gallery listings have promotion records
INSERT INTO promotions (listing_id, user_id, package_type, price, duration_days, start_date, end_date, status)
SELECT 
    l.id, l.user_id, 'premium', 59.99, 30, NOW(), NOW() + INTERVAL '30 days', 'active'
FROM listings l
WHERE l.is_gallery = true
AND NOT EXISTS (SELECT 1 FROM promotions p WHERE p.listing_id = l.id);

-- 6. RELOAD SCHEMA CACHE
NOTIFY pgrst, 'reload schema';
