-- Allow Admin (User 1001) to view ALL promotions
DROP POLICY IF EXISTS "Admins can view all promotions" ON promotions;
CREATE POLICY "Admins can view all promotions"
ON promotions FOR SELECT
USING (
  (SELECT user_number FROM profiles WHERE id = auth.uid()) = 1001
);

-- Allow Admin (User 1001) to view ALL listings
-- This is crucial for the admin panel to show listing details alongside promotions
DROP POLICY IF EXISTS "Admins can view all listings" ON listings;
CREATE POLICY "Admins can view all listings"
ON listings FOR SELECT
USING (
  (SELECT user_number FROM profiles WHERE id = auth.uid()) = 1001
);

-- Allow Admin (User 1001) to view ALL profiles
-- This is crucial for the admin panel to show user details (name, user_number)
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
CREATE POLICY "Admins can view all profiles"
ON profiles FOR SELECT
USING (
  (SELECT user_number FROM profiles WHERE id = auth.uid()) = 1001
);

-- Verify policies are effective by notifying
DO $$
BEGIN
  Perform pg_notify('pgrst', 'reload schema');
END $$;
