
-- 1. Make listing_id nullable to support subscriptions without listings
ALTER TABLE promotions 
ALTER COLUMN listing_id DROP NOT NULL;

-- 2. Ensure RLS is enabled and policies are correct (re-applying just in case)
ALTER TABLE promotions ENABLE ROW LEVEL SECURITY;

-- 3. Just in case, re-apply the permissive policy
DROP POLICY IF EXISTS "Access control for promotions" ON promotions;

CREATE POLICY "Access control for promotions"
ON promotions
FOR SELECT
TO authenticated
USING (
    auth.uid() = user_id
    OR
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = auth.uid() 
        AND user_number = 1001
    )
);

DROP POLICY IF EXISTS "Users can insert their own promotions" ON promotions;
CREATE POLICY "Users can insert their own promotions"
ON promotions
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);
