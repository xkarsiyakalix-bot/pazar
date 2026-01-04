-- EMERGENCY OPEN ACCESS & DEBUG
-- Run this to fix "0 listings" and "admin panel access"

-- 1. Ensure public roles have permission to access the schema
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon, authenticated;

-- 2. LISTINGS: Reset RLS to be completely open for reading
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;

-- Drop ALL existing Select policies on listings to remove conflicts/recursion
DROP POLICY IF EXISTS "Public View Active Listings" ON listings;
DROP POLICY IF EXISTS "Users can view own listings" ON listings;
DROP POLICY IF EXISTS "Admins can view all listings" ON listings;
DROP POLICY IF EXISTS "Enable read access for all users" ON listings;

-- Create ONE simple policy for reading active listings
CREATE POLICY "Public Read Active Listings"
ON listings FOR SELECT
USING (true); 
-- Note: 'true' allows reading EVERYTHING. We filter by status in the frontend/query usually, 
-- but strictly we can limit here. For debugging "0 listings", 'true' is safest to see if DATA exists.

-- 3. PROFILES: Reset RLS to be completely open for reading
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;

CREATE POLICY "Public Read Profiles"
ON profiles FOR SELECT
USING (true);

-- 4. PROMOTIONS: Open for reading (for Admin)
ALTER TABLE promotions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Admins can view all promotions" ON promotions;

CREATE POLICY "Public Read Promotions"
ON promotions FOR SELECT
USING (true);

-- 5. DIAGNOSTICS: Check if data actually exists
-- If these return 0, then the data was deleted or the table is empty.
SELECT 'Total Listings' as check_type, count(*) as count FROM listings
UNION ALL
SELECT 'Active Listings (Case Sensitive)', count(*) FROM listings WHERE status = 'active'
UNION ALL
SELECT 'Active Listings (Case Insensitive)', count(*) FROM listings WHERE status ILIKE 'active';
