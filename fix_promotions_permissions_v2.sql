
-- 1. Enable RLS
ALTER TABLE promotions ENABLE ROW LEVEL SECURITY;

-- 2. Policy for INSERT: Users can insert their own promotions
DROP POLICY IF EXISTS "Users can insert their own promotions" ON promotions;
CREATE POLICY "Users can insert their own promotions"
ON promotions
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- 3. Policy for SELECT: Users can see their own, Admin (1001) can see all
DROP POLICY IF EXISTS "Users can view their own promotions" ON promotions;
DROP POLICY IF EXISTS "Admins can view all promotions" ON promotions;

CREATE POLICY "Access control for promotions"
ON promotions
FOR SELECT
TO authenticated
USING (
    -- User sees their own data
    auth.uid() = user_id
    OR
    -- Admin (user_number 1001) sees all data
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = auth.uid() 
        AND user_number = 1001
    )
);
