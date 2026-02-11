-- Migration: Add cancel_at_period_end to profiles
-- Purpose: Support "Turn off renewal" feature where user keeps benefit until expiry
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS cancel_at_period_end BOOLEAN DEFAULT FALSE;

COMMENT ON COLUMN profiles.cancel_at_period_end IS 'If true, the current subscription will not renew and the user will be downgraded at the end of the period.';
