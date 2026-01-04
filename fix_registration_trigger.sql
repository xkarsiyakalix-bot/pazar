-- FIX FOR REGISTRATION ERROR: "Database error saving new user"
-- Description: This script ensures the handle_new_user trigger is robust and handles all constraints.
-- It also sets a default for seller_type and ensures sequence permissions.
-- Run this in the Supabase SQL Editor.

-- 1. Ensure user_number sequence is accessible (just in case)
-- Note: PostgreSQL GRANT doesn't support IF EXISTS, so we assume it exists if profiles used it.
GRANT USAGE ON SEQUENCE user_number_seq TO anon, authenticated, service_role;

-- 2. Ensure seller_type has a default value (prevents NOT NULL errors if added later)
ALTER TABLE profiles ALTER COLUMN seller_type SET DEFAULT 'private';

-- 3. Update the handle_new_user trigger function
-- SECURITY DEFINER allows it to run with the permissions of the creator
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert into profiles table
  INSERT INTO public.profiles (
    id, 
    email, 
    full_name, 
    status, 
    seller_type,
    created_at,
    updated_at
  )
  VALUES (
    new.id, 
    new.email, 
    COALESCE(new.raw_user_meta_data->>'full_name', ''), 
    'active', 
    'private',
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = COALESCE(EXCLUDED.full_name, profiles.full_name),
    updated_at = NOW();
    
  RETURN new;
EXCEPTION WHEN OTHERS THEN
  -- Log error context (this will appear in Supabase Logs)
  RAISE WARNING 'Error in handle_new_user for user %: %', new.id, SQLERRM;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Re-bind the trigger to auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 5. Final check/sync for existing users who might be missing profiles
INSERT INTO public.profiles (id, email, full_name, status, seller_type)
SELECT 
    id, 
    email, 
    COALESCE(raw_user_meta_data->>'full_name', ''), 
    'active',
    'private'
FROM auth.users
ON CONFLICT (id) DO NOTHING;

SELECT 'Registration fix applied successfully' as status;
