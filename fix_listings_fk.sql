-- Add Foreign Key Relationship between listings and profiles
-- This allows PostgREST to detect the relationship and enable joining profiles in listing queries

DO $$
BEGIN
    -- Check if constraint handles exist to avoid errors
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.table_constraints 
        WHERE constraint_name = 'listings_user_id_fkey' 
        AND table_name = 'listings'
    ) THEN
        ALTER TABLE public.listings
        ADD CONSTRAINT listings_user_id_fkey
        FOREIGN KEY (user_id)
        REFERENCES public.profiles(id)
        ON DELETE CASCADE;
    END IF;
END $$;

-- Notify PostgREST to reload schema
NOTIFY pgrst, 'reload schema';
