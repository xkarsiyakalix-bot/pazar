-- Check if any promotion records exist
SELECT count(*) as total_promotions FROM promotions;

-- Check the last 10 promotions if they exist
SELECT 
  id, 
  package_type, 
  created_at, 
  user_id 
FROM promotions 
ORDER BY created_at DESC 
LIMIT 10;
