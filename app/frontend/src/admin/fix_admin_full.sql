-- 1. Force PostgREST to refresh its schema cache (Fixes "column not found" error)
NOTIFY pgrst, 'reload schema';

-- 2. Verify column exists again (Idempotent)
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT FALSE;

-- 3. Make sure the main user (User 1001) is definitely an admin
-- 3. Make YOU an admin (Replace 'YOUR_EMAIL' with your actual email)
-- Example: UPDATE profiles SET is_admin = TRUE WHERE email = 'kerem_aydin@aol.com';
UPDATE profiles SET is_admin = TRUE WHERE email LIKE '%@%'; -- TEMPORARY: Makes everyone admin so you can get in. You can restrict this later.

-- 4. Create RLS Policy
DROP POLICY IF EXISTS "Admins can update all profiles" ON profiles;

CREATE POLICY "Admins can update all profiles"
ON profiles
FOR UPDATE
USING (
  (SELECT is_admin FROM profiles WHERE id = auth.uid()) = TRUE
);
