-- Enable RLS on promotions table
ALTER TABLE IF EXISTS promotions ENABLE ROW LEVEL SECURITY;

-- Create promotions table if it doesn't exist
CREATE TABLE IF NOT EXISTS promotions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    listing_id UUID REFERENCES listings(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    package_type TEXT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    duration_days INTEGER NOT NULL,
    start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    end_date TIMESTAMP WITH TIME ZONE NOT NULL,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'expired', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Re-enable RLS just in case table was just created
ALTER TABLE promotions ENABLE ROW LEVEL SECURITY;

-- Policy to allow users to insert their own promotions
DROP POLICY IF EXISTS "Users can create their own promotions" ON promotions;
CREATE POLICY "Users can create their own promotions"
ON promotions FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Policy to allow users to view their own promotions
DROP POLICY IF EXISTS "Users can view their own promotions" ON promotions;
CREATE POLICY "Users can view their own promotions"
ON promotions FOR SELECT
USING (auth.uid() = user_id);

-- Add indexes for performance (if they don't exist)
CREATE INDEX IF NOT EXISTS idx_promotions_listing_id ON promotions(listing_id);
CREATE INDEX IF NOT EXISTS idx_promotions_user_id ON promotions(user_id);
