-- Fix Bau, Handwerk & Produktion subcategory name mismatch
-- Standardize to Turkish name: İnşaat, Sanat & Üretim

-- First, check current state
SELECT sub_category, COUNT(*) as count
FROM listings
WHERE category = 'İş İlanları'
  AND (sub_category LIKE '%Bau%' OR sub_category LIKE '%İnşaat%' OR sub_category LIKE '%Handwerk%')
GROUP BY sub_category;

-- Update all variations to the standard Turkish name
UPDATE listings
SET sub_category = 'İnşaat, Sanat & Üretim'
WHERE category = 'İş İlanları'
  AND (
    sub_category = 'Bau, Handwerk & Produktion' OR
    sub_category = 'İnşaat, El Sanatları & Üretim' OR
    sub_category LIKE '%Bau%Handwerk%' OR
    sub_category LIKE '%İnşaat%Sanat%'
  );

-- Populate the art field if it's empty based on title/description
UPDATE listings
SET bau_handwerk_produktion_art = 
  CASE 
    WHEN (title ILIKE '%bauhelfer%' OR description ILIKE '%bauhelfer%' OR 
          title ILIKE '%inşaat yardım%' OR description ILIKE '%inşaat yardım%')
    THEN 'Bauhelfer/-in'
    
    WHEN (title ILIKE '%dachdecker%' OR description ILIKE '%dachdecker%' OR
          title ILIKE '%çatı%' OR description ILIKE '%çatı%')
    THEN 'Dachdecker/-in'
    
    WHEN (title ILIKE '%elektriker%' OR description ILIKE '%elektriker%' OR
          title ILIKE '%elektrik%' OR description ILIKE '%elektrik%')
    THEN 'Elektriker/-in'
    
    WHEN (title ILIKE '%fliesenleger%' OR description ILIKE '%fliesenleger%' OR
          title ILIKE '%fayans%' OR description ILIKE '%fayans%')
    THEN 'Fliesenleger/-in'
    
    WHEN (title ILIKE '%maler%' OR description ILIKE '%maler%' OR
          title ILIKE '%boya%' OR description ILIKE '%boya%')
    THEN 'Maler/-in'
    
    WHEN (title ILIKE '%maurer%' OR description ILIKE '%maurer%' OR
          title ILIKE '%duvar%' OR description ILIKE '%duvar%')
    THEN 'Maurer/-in'
    
    WHEN (title ILIKE '%produktionshelfer%' OR description ILIKE '%produktionshelfer%' OR
          title ILIKE '%üretim%' OR description ILIKE '%üretim%')
    THEN 'Produktionshelfer/-in'
    
    WHEN (title ILIKE '%schlosser%' OR description ILIKE '%schlosser%' OR
          title ILIKE '%çilingir%' OR description ILIKE '%çilingir%')
    THEN 'Schlosser/-in'
    
    WHEN (title ILIKE '%tischler%' OR description ILIKE '%tischler%' OR
          title ILIKE '%marangoz%' OR description ILIKE '%marangoz%')
    THEN 'Tischler/-in'
    
    ELSE 'Weitere Berufe'
  END
WHERE category = 'İş İlanları'
  AND sub_category = 'İnşaat, Sanat & Üretim'
  AND (bau_handwerk_produktion_art IS NULL OR bau_handwerk_produktion_art = '');

-- Verify the changes
SELECT 
    sub_category,
    bau_handwerk_produktion_art,
    COUNT(*) as count
FROM listings
WHERE category = 'İş İlanları'
  AND sub_category = 'İnşaat, Sanat & Üretim'
  AND status = 'active'
GROUP BY sub_category, bau_handwerk_produktion_art
ORDER BY count DESC;

-- Show sample listings
SELECT id, title, sub_category, bau_handwerk_produktion_art, job_type, working_time
FROM listings
WHERE category = 'İş İlanları'
  AND sub_category = 'İnşaat, Sanat & Üretim'
  AND status = 'active'
LIMIT 10;
