-- Enable RLS on promotions table
ALTER TABLE IF EXISTS promotions ENABLE ROW LEVEL SECURITY;

-- 1. Policy for users to view their own promotions
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'promotions' 
        AND policyname = 'Users can view own promotions'
    ) THEN
        CREATE POLICY "Users can view own promotions"
        ON promotions FOR SELECT
        USING (auth.uid() = user_id);
    END IF;
END $$;

-- 2. Policy for users to insert their own promotions (needed for purchasing)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'promotions' 
        AND policyname = 'Users can insert own promotions'
    ) THEN
        CREATE POLICY "Users can insert own promotions"
        ON promotions FOR INSERT
        WITH CHECK (auth.uid() = user_id);
    END IF;
END $$;

-- 3. Policy for admins to view all promotions
-- Note: Assuming admin is identified by user_number 1001 in profiles table
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'promotions' 
        AND policyname = 'Admins can view all promotions'
    ) THEN
        CREATE POLICY "Admins can view all promotions"
        ON promotions FOR SELECT
        USING (
            EXISTS (
                SELECT 1 FROM profiles 
                WHERE id = auth.uid() 
                AND user_number = 1001
            )
        );
    END IF;
END $$;

-- 4. Policy for admins to update promotions (e.g. marking as invoice sent)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'promotions' 
        AND policyname = 'Admins can update promotions'
    ) THEN
        CREATE POLICY "Admins can update promotions"
        ON promotions FOR UPDATE
        USING (
            EXISTS (
                SELECT 1 FROM profiles 
                WHERE id = auth.uid() 
                AND user_number = 1001
            )
        );
    END IF;
END $$;
