-- Add last_seen column to track user activity
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS last_seen TIMESTAMP WITH TIME ZONE DEFAULT now();

-- Create an index for faster queries on last_seen
CREATE INDEX IF NOT EXISTS idx_profiles_last_seen ON profiles(last_seen);

-- Update RLS if necessary (assuming profiles are generally manageable by the user)
-- No special RLS changes needed if users can already update their own profile.
