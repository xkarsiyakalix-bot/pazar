-- VERIFY FIX STATUS
-- Run this to check if the previous script worked

-- 1. Check if Foreign Keys exist
SELECT 
    tc.table_name, 
    kcu.column_name, 
    ccu.table_name AS foreign_table_name
FROM 
    information_schema.table_constraints AS tc 
    JOIN information_schema.key_column_usage AS kcu
      ON tc.constraint_name = kcu.constraint_name
      AND tc.table_schema = kcu.table_schema
    JOIN information_schema.constraint_column_usage AS ccu
      ON ccu.constraint_name = tc.constraint_name
      AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY' 
AND tc.table_name IN ('messages', 'promotions', 'user_follows');

-- 2. Check Active Gallery Listings (Should be 5)
SELECT id, title, is_gallery, is_top, status 
FROM listings 
WHERE is_gallery = true;

-- 3. Check User Follows Table
SELECT count(*) as user_follows_count FROM user_follows;

-- 4. Reload Schema Cache (Just in case)
NOTIFY pgrst, 'reload schema';
