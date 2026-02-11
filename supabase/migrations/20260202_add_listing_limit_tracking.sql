-- Migration to add listing limit tracking
-- Description: Adds first_listing_at to profiles to track the start of the 30-day listing cycle.

DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'first_listing_at') THEN
        ALTER TABLE public.profiles ADD COLUMN first_listing_at TIMESTAMP WITH TIME ZONE;
    END IF;
END $$;

-- Update existing profiles that already have listings
-- We'll set their first_listing_at to the date of their oldest listing
UPDATE public.profiles p
SET first_listing_at = (
    SELECT MIN(created_at)
    FROM public.listings l
    WHERE l.user_id = p.id
)
WHERE first_listing_at IS NULL
AND EXISTS (
    SELECT 1
    FROM public.listings l
    WHERE l.user_id = p.id
);
