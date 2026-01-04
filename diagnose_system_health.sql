-- DIAGNOSE SYSTEM HEALTH
-- Run this to see ANY data exists

-- 1. Count Total Records
SELECT 'Listings (Total)' as metric, count(*) as count FROM listings
UNION ALL
SELECT 'Listings (Active)' as metric, count(*) FROM listings WHERE status = 'active'
UNION ALL
SELECT 'Promotions (Total)' as metric, count(*) FROM promotions
UNION ALL
SELECT 'Profiles (Users)' as metric, count(*) FROM profiles;

-- 2. Check Permissions (RLS)
SELECT tablename, policyname, cmd, qual 
FROM pg_policies 
WHERE tablename IN ('listings', 'promotions', 'profiles');

-- 3. Check specific mock promotion (if it was created)
SELECT * FROM promotions WHERE package_type = 'premium' LIMIT 1;
