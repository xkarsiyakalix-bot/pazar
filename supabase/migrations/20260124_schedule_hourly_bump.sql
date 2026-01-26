-- Enable pg_cron extension
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Schedule the "Exact Time Bump" Job
-- Instead of running once a day, we run this EVERY HOUR.
-- The Logic (in Edge Function) checks if 24 hours have passed since the last bump for each individual listing.
-- Example: 
-- User bought at 14:15 -> Last Bump = 14:15.
-- Next day 13:00 -> Job runs -> 23 hours passed -> Do nothing.
-- Next day 14:00 -> Job runs -> 23h 45m passed -> Do nothing.
-- Next day 15:00 -> Job runs -> 24h 45m passed -> MATCH! -> Bump to 15:00 (approx exact time).

SELECT cron.schedule(
    'hourly-bump-check', -- Job Name
    '0 * * * *',         -- Schedule: Every Hour (Minute 0)
    $$
    -- Call the edge function manually or via pg_net if available, 
    -- BUT since we want to keep it simple SQL if possible:
    
    -- We can just do the update logic here in SQL directly for maximum reliability and speed.
    -- This runs every hour and updates any listing that hasn't been bumped in 24 hours.
    
    UPDATE listings
    SET created_at = NOW()
    WHERE status = 'active'
      AND package_type IN ('multi-bump', 'z_multi_bump')
      AND promotion_expiry > NOW()
      AND created_at < NOW() - INTERVAL '24 hours';
    $$
);

-- Schedule the "Promotion Cleanup" Job
-- This runs every hour and resets flags for listings whose promotion has expired.
SELECT cron.schedule(
    'hourly-promotion-cleanup', -- Job Name
    '5 * * * *',                -- Schedule: Every Hour (Minute 5)
    $$
    -- Resets all promotion flags and the expiry date when the promotion period is over
    UPDATE listings
    SET 
        is_top = false, 
        is_gallery = false, 
        is_highlighted = false, 
        is_multi_bump = false,
        package_type = 'basic',
        promotion_expiry = NULL
    WHERE status = 'active'
      AND promotion_expiry < NOW();
    $$
);
