-- Add is_admin column to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT FALSE;

-- Optional: Set default admin user (replace with actual user ID if known, or user runs this manually)
-- UPDATE profiles SET is_admin = TRUE WHERE user_number = 1001;
