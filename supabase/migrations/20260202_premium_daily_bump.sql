-- Add Premium and Z_Premium to the hourly bump schedule
-- This ensures that listings with Premium packages are "bumped" back to the top 
-- every 24 hours (at approximately the same hour they were last bumped/created).

-- We update the existing 'hourly-bump-check' logic or add a new one.
-- Since we already have a job named 'hourly-bump-check' from 20260124_schedule_hourly_bump.sql,
-- we'll just update the SQL it runs to include premium packages.

SELECT cron.unschedule('hourly-bump-check');

SELECT cron.schedule(
    'hourly-bump-check', -- Job Name
    '0 * * * *',         -- Schedule: Every Hour (Minute 0)
    $$
    -- Update listings to NOW() if they are active premium/multi-bump 
    -- and it has been at least 24 hours since the last bump.
    UPDATE listings
    SET created_at = NOW()
    WHERE status = 'active'
      AND package_type IN ('multi-bump', 'z_multi_bump', 'premium', 'z_premium', 'plus')
      AND (promotion_expiry > NOW() OR promotion_expiry IS NULL)
      AND created_at < NOW() - INTERVAL '24 hours';
    $$
);

COMMENT ON COLUMN listings.created_at IS 'Used for sorting. Updated automatically for Premium/Multi-bump listings every 24h.';
