-- CLEANUP SCRIPT: Synchronization of Listings and Promotions
-- This script removes "forced" or "expired" status flags from listings that do not have an active promotion in the promotions table.

-- 1. Create a function to refresh listing promotion flags
CREATE OR REPLACE FUNCTION refresh_listing_promotion_flags()
RETURNS void AS $$
BEGIN
    -- Step A: Reset all promotion-related flags for listings that don't have ANY active record in promotions table
    -- or whose promotion_expiry has passed.
    UPDATE listings
    SET 
        is_gallery = false,
        is_top = false,
        is_highlighted = false,
        is_multi_bump = false,
        package_type = 'basic',
        promotion_expiry = NULL
    WHERE id NOT IN (
        SELECT listing_id FROM promotions 
        WHERE (status = 'active' OR status = 'paid') 
        AND end_date > NOW()
    );

    -- Step B: Re-sync flags for listings that DO have active promotions
    -- This ensures that if a record exists in promotions, the listing table reflects it.
    
    -- Gallery (Vitrin)
    UPDATE listings
    SET is_gallery = true, package_type = 'galerie'
    WHERE id IN (
        SELECT listing_id FROM promotions 
        WHERE (status = 'active' OR status = 'paid') 
        AND package_type IN ('galerie', 'gallery', 'galeri', 'vitrin')
        AND end_date > NOW()
    );

    -- Top (Premium)
    UPDATE listings
    SET is_top = true, package_type = 'premium'
    WHERE id IN (
        SELECT listing_id FROM promotions 
        WHERE (status = 'active' OR status = 'paid') 
        AND package_type IN ('top', 'premium', 'z_premium')
        AND end_date > NOW()
    );

    -- Highlight (Öne Çıkan)
    UPDATE listings
    SET is_highlighted = true
    WHERE id IN (
        SELECT listing_id FROM promotions 
        WHERE (status = 'active' OR status = 'paid') 
        AND package_type IN ('highlight', 'budget')
        AND end_date > NOW()
    );

    -- Multi-Bump (Tekrarlı Yukarı Çıkar)
    UPDATE listings
    SET is_multi_bump = true
    WHERE id IN (
        SELECT listing_id FROM promotions 
        WHERE (status = 'active' OR status = 'paid') 
        AND package_type IN ('multi-bump', 'z_multi_bump')
        AND end_date > NOW()
    );

    -- Update promotion_expiry to match the latest promotion end_date
    UPDATE listings l
    SET promotion_expiry = p.latest_end_date
    FROM (
        SELECT listing_id, MAX(end_date) as latest_end_date
        FROM promotions
        WHERE (status = 'active' OR status = 'paid') 
        AND end_date > NOW()
        GROUP BY listing_id
    ) p
    WHERE l.id = p.listing_id;

END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Execute the refresh function immediately
SELECT refresh_listing_promotion_flags();

-- 3. (Optional) Schedule this to run periodically if your Supabase plan supports pg_cron
-- SELECT cron.schedule('0 * * * *', 'SELECT refresh_listing_promotion_flags()');

-- 4. Clean up any stuck status in promotions table itself
UPDATE promotions
SET status = 'expired'
WHERE (status = 'active' OR status = 'paid')
AND end_date < NOW();

-- Reload PostgREST schema cache
NOTIFY pgrst, 'reload schema';
