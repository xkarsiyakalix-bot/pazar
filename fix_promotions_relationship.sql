-- Fix promotions table relationship to profiles
-- This ensures that the frontend can join promotions with the profiles table

-- 1. Drop the existing foreign key to auth.users
ALTER TABLE promotions 
DROP CONSTRAINT IF EXISTS promotions_user_id_fkey;

-- 2. Add the new foreign key to public.profiles
-- Note: Assuming profiles table exists and has an 'id' column
ALTER TABLE promotions
ADD CONSTRAINT promotions_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES public.profiles(id) 
ON DELETE CASCADE;

-- 3. Verify if foreign key to listings is correct (it usually is if it points to public schema)
-- No changes needed for listings_id if it already points to public.listings(id)
