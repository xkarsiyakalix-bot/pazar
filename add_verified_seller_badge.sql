-- Add verified seller badge system to profiles table
-- This allows admins to mark trusted sellers with a blue checkmark

-- Add is_verified column to profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT FALSE;

-- Add verification_date to track when seller was verified
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS verification_date TIMESTAMP WITH TIME ZONE;

-- Add verification_notes for admin reference
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS verification_notes TEXT;

-- Create index for faster queries on verified sellers
CREATE INDEX IF NOT EXISTS idx_profiles_verified ON profiles(is_verified) WHERE is_verified = TRUE;

-- Add comment for documentation
COMMENT ON COLUMN profiles.is_verified IS 'Indicates if the seller has been verified by admin (blue checkmark)';
COMMENT ON COLUMN profiles.verification_date IS 'Date when the seller was verified';
COMMENT ON COLUMN profiles.verification_notes IS 'Admin notes about verification process';
