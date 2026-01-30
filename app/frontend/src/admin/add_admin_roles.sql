-- Create admin_role enum if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'admin_role') THEN
        CREATE TYPE admin_role AS ENUM ('admin', 'super_admin');
    END IF;
END
$$;

-- Add admin_role column to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS admin_role admin_role DEFAULT 'admin';

-- Update existing admins to have a role
-- We'll set Kerem and user 1001 as super_admin by default
UPDATE profiles 
SET admin_role = 'super_admin' 
WHERE user_number = 1001 OR email = 'kerem_aydin@aol.com' OR is_admin = true;

-- EnsureKerem Aydın is specifically super_admin
UPDATE profiles 
SET admin_role = 'super_admin', is_admin = true
WHERE id IN (SELECT id FROM auth.users WHERE email = 'kerem_aydin@aol.com');
