
-- Allow AUTHENTICATED users to INSERT into promotions table
-- This allows users to create records of their own purchases/subscriptions.

-- 1. Enable RLS on promotions if not already enabled (it likely is)
ALTER TABLE promotions ENABLE ROW LEVEL SECURITY;

-- 2. Drop existing policy if it conflicts (or create new one safely)
DROP POLICY IF EXISTS "Users can insert their own promotions" ON promotions;

-- 3. Create the policy
CREATE POLICY "Users can insert their own promotions"
ON promotions
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- 4. Ensure users can SELECT their own promotions (optional but good for verification)
DROP POLICY IF EXISTS "Users can view their own promotions" ON promotions;

CREATE POLICY "Users can view their own promotions"
ON promotions
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);
