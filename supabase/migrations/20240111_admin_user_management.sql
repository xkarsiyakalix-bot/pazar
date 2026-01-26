-- Migration to enable admin user management (blocking/unblocking)
-- Description: Adds 'status' column to profiles if missing and sets up RLS policies for admin access.

-- 1. Ensure 'status' column exists in profiles
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'status') THEN
        ALTER TABLE public.profiles ADD COLUMN status TEXT DEFAULT 'active';
    END IF;
END $$;

-- 2. Enable RLS (just in case)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 3. Drop existing update policy if it exists to recreate it
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

-- 4. Create Policy for Admin (user_number 1001)
-- This allows user 1001 to update any profile (e.g., to ban or make PRO)
CREATE POLICY "Admins can update all profiles"
ON public.profiles
FOR UPDATE
TO authenticated
USING (
  (SELECT user_number FROM public.profiles WHERE id = auth.uid()) = 1001
);

-- 5. Create Policy for normal users (can only update their own)
-- Explicitly exclude user 1001 if we want to separate policies, or just let them overlap.
-- overlap is fine in Postgres (OR condition).
CREATE POLICY "Users can update own profile"
ON public.profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = id);

-- Note: The admin check needs to be efficient. 
-- In production, a specific 'role' column would be better than checking 'user_number'.
