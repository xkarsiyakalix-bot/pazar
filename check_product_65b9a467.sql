-- Check if the product exists and get its details
SELECT 
    id,
    title,
    category,
    sub_category,
    price,
    status,
    created_at,
    user_id,
    description,
    city,
    federal_state
FROM listings
WHERE id = '65b9a467-b9e3-4970-b645-e1dfe23dfd2e';

-- Also check if there are any similar IDs (in case of typo)
SELECT 
    id,
    title,
    category,
    sub_category,
    status
FROM listings
WHERE id::text LIKE '65b9a467%'
LIMIT 5;
