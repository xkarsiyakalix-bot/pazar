-- 1. Ensure columns exist on profiles table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS user_number INTEGER;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS admin_role TEXT;

-- 2. Ensure sequence for user_number exists and sync it
CREATE SEQUENCE IF NOT EXISTS user_number_seq START WITH 1000;
ALTER TABLE public.profiles ALTER COLUMN user_number SET DEFAULT nextval('user_number_seq');

-- 3. Set Kerem Aydin as the admin
UPDATE public.profiles 
SET user_number = 1001,
    is_admin = true,
    admin_role = 'super_admin'
WHERE email = 'kerem_aydin@aol.com';

-- 4. Enable RLS on promotions table
ALTER TABLE IF EXISTS public.promotions ENABLE ROW LEVEL SECURITY;

-- 5. Drop old policies on promotions to prevent duplicate conflicts
DROP POLICY IF EXISTS "Users can view own promotions" ON public.promotions;
DROP POLICY IF EXISTS "Users can view their own promotions" ON public.promotions;
DROP POLICY IF EXISTS "Admins can view all promotions" ON public.promotions;
DROP POLICY IF EXISTS "Access control for promotions" ON public.promotions;
DROP POLICY IF EXISTS "Users can create their own promotions" ON public.promotions;
DROP POLICY IF EXISTS "Users can purchase promotions" ON public.promotions;
DROP POLICY IF EXISTS "Users can insert own promotions" ON public.promotions;
DROP POLICY IF EXISTS "Users can insert their own promotions" ON public.promotions;
DROP POLICY IF EXISTS "Admins can update promotions" ON public.promotions;

-- 6. Create robust SELECT policy for promotions
-- Normal users can view their own; Admins (user_number 1001, is_admin true, or admin_role set) can view all
CREATE POLICY "Select promotions access control"
ON public.promotions
FOR SELECT
TO authenticated
USING (
    auth.uid() = user_id
    OR
    EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = auth.uid() 
        AND (user_number = 1001 OR is_admin = true OR admin_role IS NOT NULL)
    )
);

-- 7. Create robust INSERT policy for promotions
-- Users can insert/purchase their own promotions
CREATE POLICY "Insert promotions access control"
ON public.promotions
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- 8. Create robust UPDATE policy for promotions
-- Admins can update promotions (cancellations, invoice sending, etc.)
CREATE POLICY "Update promotions access control"
ON public.promotions
FOR UPDATE
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = auth.uid() 
        AND (user_number = 1001 OR is_admin = true OR admin_role IS NOT NULL)
    )
);

-- 9. Create robust DELETE policy for promotions
-- Admins can delete promotions if needed
CREATE POLICY "Delete promotions access control"
ON public.promotions
FOR DELETE
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = auth.uid() 
        AND (user_number = 1001 OR is_admin = true OR admin_role IS NOT NULL)
    )
);

-- 10. Refresh postgrest schema cache
NOTIFY pgrst, 'reload schema';
