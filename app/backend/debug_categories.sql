
-- List distinct categories and their counts
SELECT category, count(*) as count 
FROM listings 
GROUP BY category 
ORDER BY count DESC;

-- List distinct subcategories and their counts
SELECT category, sub_category, count(*) as count 
FROM listings 
GROUP BY category, sub_category 
ORDER BY category, count DESC;
