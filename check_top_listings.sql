-- Check for any active listings that are marked as 'is_top'
SELECT id, title, status, is_top, is_gallery, is_highlighted, promotion_expiry 
FROM listings 
WHERE is_top = true;
