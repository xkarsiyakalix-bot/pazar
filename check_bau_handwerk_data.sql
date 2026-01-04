-- Check current state of Bau, Handwerk & Produktion listings
SELECT 
    id,
    title,
    sub_category,
    bau_handwerk_produktion_art,
    category
FROM listings
WHERE category = 'İş İlanları'
  AND sub_category = 'Bau, Handwerk & Produktion'
  AND status = 'active'
ORDER BY created_at DESC
LIMIT 20;

-- Check all distinct values in the art field
SELECT 
    bau_handwerk_produktion_art,
    COUNT(*) as count
FROM listings
WHERE category = 'İş İlanları'
  AND sub_category = 'Bau, Handwerk & Produktion'
  AND status = 'active'
GROUP BY bau_handwerk_produktion_art;
