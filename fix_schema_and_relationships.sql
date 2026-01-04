-- FIX SCHEMA RELATIONSHIPS AND MISSING TABLES
-- Run this to resolve 400 Bad Request and 404 Not Found errors

-- 1. Create missing 'user_follows' table
CREATE TABLE IF NOT EXISTS user_follows (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    follower_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    following_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(follower_id, following_id)
);

-- Enable RLS for user_follows
ALTER TABLE user_follows ENABLE ROW LEVEL SECURITY;

-- Policies for user_follows
DROP POLICY IF EXISTS "Users can view who they follow" ON user_follows;
CREATE POLICY "Users can view who they follow"
ON user_follows FOR SELECT
USING (auth.uid() = follower_id);

DROP POLICY IF EXISTS "Users can follow others" ON user_follows;
CREATE POLICY "Users can follow others"
ON user_follows FOR INSERT
WITH CHECK (auth.uid() = follower_id);

DROP POLICY IF EXISTS "Users can unfollow" ON user_follows;
CREATE POLICY "Users can unfollow"
ON user_follows FOR DELETE
USING (auth.uid() = follower_id);


-- 2. Repair Relationships for 'promotions'
-- Explicitly recreate Foreign Keys with correct names to ensure PostgREST detects them

-- Drop existing constraints if fuzzy/incorrect
ALTER TABLE promotions DROP CONSTRAINT IF EXISTS promotions_user_id_fkey;
ALTER TABLE promotions DROP CONSTRAINT IF EXISTS promotions_listing_id_fkey;
ALTER TABLE promotions DROP CONSTRAINT IF EXISTS promotions_profiles_fkey; 

-- Add strict constraints linking to public tables
-- Note: Linking to auth.users is fine for auth, but for 'select=*,profiles(...)' we need a link to profiles table if we want to expand it.
-- However, the query asks for `profiles`. 
-- If 'user_id' refers to auth.users, we can't expand 'profiles' directly unless there is a FK from promotions to profiles OR profiles is primary key of auth.users (which it is usually 1:1).
-- BETTER STRATEGY: Add a virtual foreign key or ensure 'user_id' can be joined to 'profiles.id'.

-- Standard ForeignKey to auth.users (for RLS)
ALTER TABLE promotions 
ADD CONSTRAINT promotions_user_id_fkey 
FOREIGN KEY (user_id) 
REFERENCES auth.users(id) 
ON DELETE CASCADE;

-- Add explicit Foreign Key to 'listings'
ALTER TABLE promotions 
ADD CONSTRAINT promotions_listing_id_fkey 
FOREIGN KEY (listing_id) 
REFERENCES listings(id) 
ON DELETE CASCADE;

-- CRITICAL: PostgREST sometimes needs a direct FK to join 'profiles'. 
-- Since 'promotions.user_id' = 'profiles.id' (both are uuid), let's add an explicit FK to profiles as well.
-- This allows: promotions?select=*,profiles(*)
ALTER TABLE promotions 
ADD CONSTRAINT promotions_user_id_profiles_fkey 
FOREIGN KEY (user_id) 
REFERENCES profiles(id) 
ON DELETE CASCADE;


-- 3. Messages Relationships (fixing 400 error on messages)
-- Ensure messages have FK to profiles for sender/receiver expansion
ALTER TABLE messages DROP CONSTRAINT IF EXISTS messages_sender_id_fkey;
ALTER TABLE messages DROP CONSTRAINT IF EXISTS messages_receiver_id_fkey;

ALTER TABLE messages 
ADD CONSTRAINT messages_sender_id_fkey 
FOREIGN KEY (sender_id) 
REFERENCES profiles(id) 
ON DELETE CASCADE;

ALTER TABLE messages 
ADD CONSTRAINT messages_receiver_id_fkey 
FOREIGN KEY (receiver_id) 
REFERENCES profiles(id) 
ON DELETE CASCADE;


-- 4. Reload Schema Cache
NOTIFY pgrst, 'reload schema';
