-- Manually insert a mock promotion for the most recent active listing
-- This ensures the Admin Panel has at least one item to display

INSERT INTO promotions (
    listing_id,
    user_id,
    package_type,
    price,
    duration_days,
    start_date,
    end_date,
    status
)
SELECT 
    id as listing_id,
    user_id,
    'premium' as package_type,
    59.99 as price,
    10 as duration_days,
    NOW() as start_date,
    NOW() + INTERVAL '10 days' as end_date,
    'active' as status
FROM listings
WHERE status = 'active'
ORDER BY created_at DESC
LIMIT 1
RETURNING *;
