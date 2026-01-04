-- Comprehensive fix for Promotion Purchase Error
-- Run this script in the Supabase SQL Editor

-- 1. Enable necessary extensions for UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Ensure listings table has all required columns for promotions
ALTER TABLE listings ADD COLUMN IF NOT EXISTS is_highlighted BOOLEAN DEFAULT FALSE;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS is_top BOOLEAN DEFAULT FALSE;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS is_gallery BOOLEAN DEFAULT FALSE;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS is_multi_bump BOOLEAN DEFAULT FALSE;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS promotion_expiry TIMESTAMP WITH TIME ZONE;

-- 3. Create promotions table if it doesn't exist
CREATE TABLE IF NOT EXISTS promotions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    listing_id UUID REFERENCES listings(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    package_type TEXT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    duration_days INTEGER NOT NULL,
    start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    end_date TIMESTAMP WITH TIME ZONE NOT NULL,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'expired', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Enable RLS on promotions
ALTER TABLE promotions ENABLE ROW LEVEL SECURITY;

-- 5. Promotion Policies: Allow users to insert and view their own promotions
DROP POLICY IF EXISTS "Users can buy promotions" ON promotions;
CREATE POLICY "Users can buy promotions"
ON promotions FOR INSERT
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can view own promotions" ON promotions;
CREATE POLICY "Users can view own promotions"
ON promotions FOR SELECT
USING (auth.uid() = user_id);

-- 6. Listings Policies: CRITICAL - Allow users to update their own listings
-- This is necessary because purchaing a promotion updates the listing's status columns.
-- We verify if a policy exists, if not, we create a standard owner-update policy.
DROP POLICY IF EXISTS "Users can update own listings" ON listings;
CREATE POLICY "Users can update own listings"
ON listings FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- 7. Grant permissions to authenticated users
GRANT ALL ON promotions TO authenticated;
GRANT ALL ON listings TO authenticated;

-- 8. Refresh schema cache (optional but recommended)
NOTIFY pgrst, 'reload schema';
