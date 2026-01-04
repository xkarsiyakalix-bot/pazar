-- Force the most recent active listing to be a Top listing
UPDATE listings
SET 
  is_top = true,
  is_gallery = true,
  is_highlighted = true,
  promotion_expiry = NOW() + INTERVAL '7 days'
WHERE id = (
  SELECT id FROM listings 
  WHERE status = 'active'
  ORDER BY created_at DESC 
  LIMIT 1
);
