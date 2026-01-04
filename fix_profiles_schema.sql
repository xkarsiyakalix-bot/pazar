-- FIX FOR MISSING PROFILE COLUMNS
-- RUN THIS IN THE SUPABASE SQL EDITOR

ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS bio TEXT,
ADD COLUMN IF NOT EXISTS website TEXT,
ADD COLUMN IF NOT EXISTS street TEXT,
ADD COLUMN IF NOT EXISTS postal_code TEXT,
ADD COLUMN IF NOT EXISTS city TEXT,
ADD COLUMN IF NOT EXISTS legal_info TEXT,
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active';

-- Refresh the trigger function to handle meta_data correctly if needed
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, status)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name', 'active')
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
