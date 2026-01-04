-- 1. Ensure the user_number column and sequence exist
CREATE SEQUENCE IF NOT EXISTS user_number_seq START WITH 1000;

ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS user_number INTEGER DEFAULT nextval('user_number_seq');

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'profiles_user_number_unique') THEN
        ALTER TABLE profiles ADD CONSTRAINT profiles_user_number_unique UNIQUE (user_number);
    END IF;
END $$;

-- 2. Manually sync missing users from auth.users to public.profiles
INSERT INTO public.profiles (id, email, full_name, status)
SELECT 
    id, 
    email, 
    raw_user_meta_data->>'full_name', 
    'active'
FROM auth.users
ON CONFLICT (id) DO UPDATE SET 
    email = EXCLUDED.email,
    full_name = COALESCE(profiles.full_name, EXCLUDED.full_name);

-- 3. Grant Admin access to kerem_aydin@aol.com
UPDATE profiles 
SET user_number = 1001 
WHERE email = 'kerem_aydin@aol.com';

-- 4. Verification queries
SELECT 'Sync Complete' as status;
SELECT id, email, user_number FROM profiles WHERE email = 'kerem_aydin@aol.com';
SELECT count(*) as total_profiles from profiles;
