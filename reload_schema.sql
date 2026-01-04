-- Reload the PostgREST schema cache
-- This is often necessary after adding new columns so the API becomes aware of them.

NOTIFY pgrst, 'reload schema';
