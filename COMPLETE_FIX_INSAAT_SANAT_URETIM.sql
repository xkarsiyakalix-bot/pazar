-- COMPLETE FIX for İnşaat, Sanat & Üretim category
-- Run this in Supabase SQL Editor

-- Step 1: Check current state
SELECT 
    id,
    title,
    sub_category,
    bau_handwerk_produktion_art,
    status
FROM listings
WHERE category = 'İş İlanları'
  AND (sub_category LIKE '%Bau%' OR sub_category LIKE '%İnşaat%')
ORDER BY created_at DESC;

-- Step 2: Update subcategory name to Turkish (if needed)
UPDATE listings
SET sub_category = 'İnşaat, Sanat & Üretim'
WHERE category = 'İş İlanları'
  AND sub_category IN ('Bau, Handwerk & Produktion', 'İnşaat, El Sanatları & Üretim');

-- Step 3: Update art values from Turkish to German to match frontend filters
UPDATE listings
SET bau_handwerk_produktion_art = 
  CASE 
    WHEN bau_handwerk_produktion_art = 'İnşaat Yardımcısı' THEN 'Bauhelfer/-in'
    WHEN bau_handwerk_produktion_art = 'Çatı Ustası' THEN 'Dachdecker/-in'
    WHEN bau_handwerk_produktion_art = 'Elektrikçi' THEN 'Elektriker/-in'
    WHEN bau_handwerk_produktion_art IN ('Fayans Ustası', 'Fayansçı') THEN 'Fliesenleger/-in'
    WHEN bau_handwerk_produktion_art = 'Boyacı' THEN 'Maler/-in'
    WHEN bau_handwerk_produktion_art = 'Duvarcı' THEN 'Maurer/-in'
    WHEN bau_handwerk_produktion_art = 'Üretim Yardımcısı' THEN 'Produktionshelfer/-in'
    WHEN bau_handwerk_produktion_art = 'Çilingir' THEN 'Schlosser/-in'
    WHEN bau_handwerk_produktion_art = 'Marangoz' THEN 'Tischler/-in'
    WHEN bau_handwerk_produktion_art = 'Diğer Meslekler' THEN 'Weitere Berufe'
    ELSE bau_handwerk_produktion_art
  END
WHERE category = 'İş İlanları'
  AND sub_category = 'İnşaat, Sanat & Üretim';

-- Step 4: For listings without art value, try to infer from title/description
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

-- Step 5: Verify the results
SELECT 
    bau_handwerk_produktion_art,
    COUNT(*) as count
FROM listings
WHERE category = 'İş İlanları'
  AND sub_category = 'İnşaat, Sanat & Üretim'
  AND status = 'active'
GROUP BY bau_handwerk_produktion_art
ORDER BY count DESC;

-- Step 6: Show sample listings
SELECT 
    id,
    title,
    sub_category,
    bau_handwerk_produktion_art,
    job_type,
    working_time
FROM listings
WHERE category = 'İş İlanları'
  AND sub_category = 'İnşaat, Sanat & Üretim'
  AND status = 'active'
LIMIT 10;
