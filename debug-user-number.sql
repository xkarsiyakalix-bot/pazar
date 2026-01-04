-- Check if user_number field exists and has values
SELECT id, full_name, email, user_number, created_at 
FROM profiles 
ORDER BY created_at ASC 
LIMIT 10;

-- Check if user_number is unique
SELECT user_number, COUNT(*) 
FROM profiles 
GROUP BY user_number 
HAVING COUNT(*) > 1;

-- Check if there are any NULL user_numbers
SELECT COUNT(*) as null_count 
FROM profiles 
WHERE user_number IS NULL;

-- Get your user info
SELECT id, full_name, email, user_number 
FROM profiles 
WHERE email = 'elif_rad@aol.com';
