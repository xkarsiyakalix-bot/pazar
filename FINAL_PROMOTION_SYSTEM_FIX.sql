-- Comprehensive Fix for Promotion Purchase Errors
-- 1. Ensure Listings Table has all required columns
ALTER TABLE listings 
ADD COLUMN IF NOT EXISTS is_gallery BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS is_multi_bump BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS is_top BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS is_highlighted BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS promotion_expiry TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS package_type TEXT;

-- 2. Ensure Promotions Table has correct structure
CREATE TABLE IF NOT EXISTS promotions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    listing_id UUID REFERENCES listings(id) ON DELETE SET NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    package_type TEXT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    duration_days INTEGER NOT NULL,
    start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    end_date TIMESTAMP WITH TIME ZONE NOT NULL,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'expired', 'cancelled')),
    listing_title TEXT,
    user_email TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ensure existing columns exist if table already existed
ALTER TABLE promotions ADD COLUMN IF NOT EXISTS listing_title TEXT;
ALTER TABLE promotions ADD COLUMN IF NOT EXISTS user_email TEXT;

-- 3. Fix Permissions & RLS
ALTER TABLE promotions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can create their own promotions" ON promotions;
CREATE POLICY "Users can create their own promotions"
ON promotions FOR INSERT
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can view their own promotions" ON promotions;
CREATE POLICY "Users can view their own promotions"
ON promotions FOR SELECT
USING (auth.uid() = user_id OR (SELECT admin_role FROM profiles WHERE id = auth.uid()) IS NOT NULL);

-- 4. Fix Listings Update Policy (Crucial for promotions)
DROP POLICY IF EXISTS "Users can update own listings" ON listings;
CREATE POLICY "Users can update own listings"
ON listings FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- 5. Create/Update Trigger Function (SECURITY DEFINER is critical for auth.users access)
CREATE OR REPLACE FUNCTION preserve_promotion_info()
RETURNS TRIGGER AS $$
BEGIN
    -- If listing_id exists, capture the title
    IF NEW.listing_id IS NOT NULL THEN
        SELECT title INTO NEW.listing_title 
        FROM listings 
        WHERE id = NEW.listing_id;
    END IF;
    
    -- If user_id exists, capture the email
    -- SECURITY DEFINER allows accessing auth.users even if the user doesn't have permissions
    IF NEW.user_id IS NOT NULL THEN
        SELECT email INTO NEW.user_email 
        FROM auth.users 
        WHERE id = NEW.user_id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Re-create trigger
DROP TRIGGER IF EXISTS preserve_promotion_info_trigger ON promotions;
CREATE TRIGGER preserve_promotion_info_trigger
BEFORE INSERT OR UPDATE ON promotions
FOR EACH ROW
EXECUTE FUNCTION preserve_promotion_info();

-- 6. Grant Permissions
GRANT ALL ON promotions TO authenticated;
GRANT ALL ON listings TO authenticated;
GRANT SELECT ON profiles TO authenticated;

-- Refresh schema cache
NOTIFY pgrst, 'reload schema';
