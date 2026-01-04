-- Add user_number field to profiles table
-- This will create a sequential number starting from 1000 for seller IDs

-- Step 1: Create sequence starting from 1000
CREATE SEQUENCE IF NOT EXISTS user_number_seq START WITH 1000;

-- Step 2: Add user_number column to profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS user_number INTEGER DEFAULT nextval('user_number_seq');

-- Step 3: Update existing users with sequential numbers starting from 1000
DO $$
DECLARE
  user_record RECORD;
  counter INTEGER := 1000;
BEGIN
  FOR user_record IN 
    SELECT id FROM profiles ORDER BY created_at ASC
  LOOP
    UPDATE profiles 
    SET user_number = counter 
    WHERE id = user_record.id;
    counter := counter + 1;
  END LOOP;
END $$;

-- Step 4: Set the sequence to continue from the last assigned number
SELECT setval('user_number_seq', (SELECT MAX(user_number) FROM profiles) + 1, false);

-- Step 5: Make user_number NOT NULL and UNIQUE
ALTER TABLE profiles 
ALTER COLUMN user_number SET NOT NULL,
ADD CONSTRAINT profiles_user_number_unique UNIQUE (user_number);
