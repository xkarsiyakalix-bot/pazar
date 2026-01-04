-- 1. Create sequence if not exists
CREATE SEQUENCE IF NOT EXISTS user_number_seq START WITH 1000;

-- 2. Add user_number column if not exists
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS user_number INTEGER DEFAULT nextval('user_number_seq');

-- 3. Set the unique constraint
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'profiles_user_number_unique') THEN
        ALTER TABLE profiles ADD CONSTRAINT profiles_user_number_unique UNIQUE (user_number);
    END IF;
END $$;

-- 4. Grant Admin access to specific user
-- This assumes the user already exists in the profiles table.
-- If they haven't logged in yet, they will need to log in once first.
UPDATE profiles 
SET user_number = 1001 
WHERE email = 'kerem_aydin@aol.com';

-- 5. Verification
SELECT id, email, user_number FROM profiles WHERE email = 'kerem_aydin@aol.com';
