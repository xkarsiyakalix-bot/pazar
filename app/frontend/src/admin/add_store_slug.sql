-- Add store_slug column to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS store_slug TEXT UNIQUE;

-- Create an index for faster lookups
CREATE INDEX IF NOT EXISTS idx_profiles_store_slug ON profiles(store_slug);

-- Add a comment to explain the column
COMMENT ON COLUMN profiles.store_slug IS 'Custom URL ending for Unlimited package users (e.g., exvitrin.com/s/electronics)';
