-- Set listing_number and user_number sequences to start from 1000

-- Step 1: Create sequences first
DO $$
BEGIN
    -- Create sequence for listing_number if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM pg_sequences WHERE schemaname = 'public' AND sequencename = 'listings_listing_number_seq') THEN
        CREATE SEQUENCE listings_listing_number_seq START WITH 1000;
    END IF;

    -- Create sequence for user_number if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM pg_sequences WHERE schemaname = 'public' AND sequencename = 'profiles_user_number_seq') THEN
        CREATE SEQUENCE profiles_user_number_seq START WITH 1000;
    END IF;
END $$;

-- Step 2: Add columns with default values
DO $$ 
BEGIN
    -- Add listing_number column to listings table if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'listings' AND column_name = 'listing_number'
    ) THEN
        ALTER TABLE listings ADD COLUMN listing_number INTEGER DEFAULT nextval('listings_listing_number_seq');
    END IF;

    -- Add user_number column to profiles table if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'profiles' AND column_name = 'user_number'
    ) THEN
        ALTER TABLE profiles ADD COLUMN user_number INTEGER DEFAULT nextval('profiles_user_number_seq');
    END IF;
END $$;

-- Step 3: Set sequences to correct values (1000 or max + 1)
DO $$
BEGIN
    PERFORM setval('listings_listing_number_seq', GREATEST(1000, (SELECT COALESCE(MAX(listing_number), 999) + 1 FROM listings)));
    PERFORM setval('profiles_user_number_seq', GREATEST(1000, (SELECT COALESCE(MAX(user_number), 999) + 1 FROM profiles)));
END $$;

-- Step 4: Update existing records that don't have numbers assigned
UPDATE listings SET listing_number = nextval('listings_listing_number_seq') WHERE listing_number IS NULL;
UPDATE profiles SET user_number = nextval('profiles_user_number_seq') WHERE user_number IS NULL;

-- Step 5: Add unique constraints
DO $$
BEGIN
    -- Add unique constraint for listing_number if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'listings_listing_number_unique'
    ) THEN
        ALTER TABLE listings ADD CONSTRAINT listings_listing_number_unique UNIQUE (listing_number);
    END IF;

    -- Add unique constraint for user_number if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'profiles_user_number_unique'
    ) THEN
        ALTER TABLE profiles ADD CONSTRAINT profiles_user_number_unique UNIQUE (user_number);
    END IF;
END $$;

-- Step 6: Add comments
COMMENT ON COLUMN listings.listing_number IS 'Unique listing number starting from 1000';
COMMENT ON COLUMN profiles.user_number IS 'Unique user number starting from 1000';
