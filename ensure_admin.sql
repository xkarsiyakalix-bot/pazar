
-- Set the current user to be admin (user_number 1001)
-- Replace the ID with your actual user ID if known, otherwise this updates the most likely candidate (e.g. valid email).
-- Better approach: Update based on the user executing the script if possible, but in SQL Editor 'auth.uid()' works.

UPDATE profiles
SET user_number = 1001
WHERE id = auth.uid();

-- Force RLS cache refresh just in case
ALTER TABLE promotions DISABLE ROW LEVEL SECURITY;
ALTER TABLE promotions ENABLE ROW LEVEL SECURITY;
