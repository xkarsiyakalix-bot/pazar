-- 1. Ensure user_number column exists
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS user_number INTEGER;

-- 2. Force sync of kerem_aydin@aol.com from Auth to Profiles
INSERT INTO public.profiles (id, email, full_name, status, user_number)
SELECT 
    id, 
    email, 
    COALESCE(raw_user_meta_data->>'full_name', 'Kerem Aydin'), 
    'active',
    1001 -- Grant Admin immediately
FROM auth.users
WHERE email = 'kerem_aydin@aol.com'
ON CONFLICT (id) DO UPDATE SET 
    user_number = 1001,
    status = 'active';

-- 3. Verify
SELECT id, email, user_number, status 
FROM public.profiles 
WHERE email = 'kerem_aydin@aol.com';
