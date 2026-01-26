-- Migration: Cleanup Expired Promotions
-- Description: Resets promotion flags for listings where the promotion has expired
-- Date: 2024-01-10

UPDATE listings
SET 
    is_top = false, 
    is_gallery = false, 
    is_highlighted = false, 
    is_multi_bump = false,
    promotion_expiry = NULL
WHERE promotion_expiry < NOW();

-- Optional: Create a function that can be called via RPC if needed
CREATE OR REPLACE FUNCTION cleanup_expired_promotions()
RETURNS void AS $$
BEGIN
    UPDATE listings
    SET 
        is_top = false, 
        is_gallery = false, 
        is_highlighted = false, 
        is_multi_bump = false,
        promotion_expiry = NULL
    WHERE promotion_expiry < NOW();
END;
$$ LANGUAGE plpgsql;
