-- Add district column to profiles table
ALTER TABLE IF EXISTS public.profiles 
ADD COLUMN IF NOT EXISTS district TEXT;

-- Refresh PostgREST cache (optional as Supabase usually does this)
NOTIFY pgrst, 'reload schema';
