-- EMERGENCY CONNECTIVITY FIX
-- Run this script to restore access to the site and admin panel

-- 1. Grant usage on schema to everyone (Anon/Public + Authenticated)
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO postgres;

-- 2. LISTINGS: Restore Public Visibility
-- Essential for "sitede hicbir ilan görünmüyor" issue
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public View Active Listings" ON listings;
CREATE POLICY "Public View Active Listings"
ON listings FOR SELECT
USING (status = 'active');

DROP POLICY IF EXISTS "Users can view own listings" ON listings;
CREATE POLICY "Users can view own listings"
ON listings FOR SELECT
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can view all listings" ON listings;
CREATE POLICY "Admins can view all listings"
ON listings FOR SELECT
USING (
  (SELECT user_number FROM profiles WHERE id = auth.uid()) = 1001
);

-- 3. PROFILES: Restore Self-Access (Critical for Admin Check)
-- Essential for "admin paneline girilmiyor" issue
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
CREATE POLICY "Public profiles are viewable by everyone"
ON profiles FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
USING (auth.uid() = id);

-- 4. PROMOTIONS: Admin Access
ALTER TABLE promotions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can view all promotions" ON promotions;
CREATE POLICY "Admins can view all promotions"
ON promotions FOR SELECT
USING (
  (SELECT user_number FROM profiles WHERE id = auth.uid()) = 1001
);

-- 5. Force Refresh
NOTIFY pgrst, 'reload schema';
