-- ULTIMATE FIX for İnşaat, Sanat & Üretim - All Fields
-- Run this in Supabase SQL Editor
-- This will fix: subcategory name, art, working_time, job_type

-- ============================================================
-- STEP 1: Check current state
-- ============================================================
SELECT 
    id,
    title,
    sub_category,
    bau_handwerk_produktion_art,
    working_time,
    job_type,
    hourly_wage
FROM listings
WHERE category = 'İş İlanları'
  AND (sub_category LIKE '%Bau%' OR sub_category LIKE '%İnşaat%')
ORDER BY created_at DESC;

-- ============================================================
-- STEP 2: Fix subcategory name
-- ============================================================
UPDATE listings
SET sub_category = 'İnşaat, Sanat & Üretim'
WHERE category = 'İş İlanları'
  AND sub_category IN ('Bau, Handwerk & Produktion', 'İnşaat, El Sanatları & Üretim');

-- ============================================================
-- STEP 3: Fix bau_handwerk_produktion_art (Turkish → German)
-- ============================================================
UPDATE listings
SET bau_handwerk_produktion_art = 
  CASE bau_handwerk_produktion_art
    WHEN 'İnşaat Yardımcısı' THEN 'Bauhelfer/-in'
    WHEN 'Çatı Ustası' THEN 'Dachdecker/-in'
    WHEN 'Elektrikçi' THEN 'Elektriker/-in'
    WHEN 'Fayans Ustası' THEN 'Fliesenleger/-in'
    WHEN 'Fayansçı' THEN 'Fliesenleger/-in'
    WHEN 'Boyacı' THEN 'Maler/-in'
    WHEN 'Duvarcı' THEN 'Maurer/-in'
    WHEN 'Üretim Yardımcısı' THEN 'Produktionshelfer/-in'
    WHEN 'Çilingir' THEN 'Schlosser/-in'
    WHEN 'Marangoz' THEN 'Tischler/-in'
    WHEN 'Diğer Meslekler' THEN 'Weitere Berufe'
    ELSE bau_handwerk_produktion_art
  END
WHERE category = 'İş İlanları'
  AND sub_category = 'İnşaat, Sanat & Üretim'
  AND bau_handwerk_produktion_art IS NOT NULL;

-- ============================================================
-- STEP 4: Fix working_time (Turkish → German)
-- ============================================================
UPDATE listings
SET working_time = 
  CASE working_time
    WHEN 'Tam Zamanlı' THEN 'Vollzeit'
    WHEN 'Yarı Zamanlı' THEN 'Teilzeit'
    WHEN 'Tam zamanlı' THEN 'Vollzeit'
    WHEN 'Yarı zamanlı' THEN 'Teilzeit'
    ELSE working_time
  END
WHERE category = 'İş İlanları'
  AND sub_category = 'İnşaat, Sanat & Üretim'
  AND working_time IS NOT NULL;

-- ============================================================
-- STEP 5: Fix job_type (Turkish → German)
-- ============================================================
UPDATE listings
SET job_type = 
  CASE job_type
    WHEN 'Tam Zamanlı' THEN 'Vollzeit'
    WHEN 'Yarı Zamanlı' THEN 'Teilzeit'
    WHEN 'Mini İş' THEN 'Minijob'
    WHEN 'Staj' THEN 'Praktikum'
    WHEN 'Çalışan Öğrenci' THEN 'Werkstudent'
    WHEN 'Serbest Çalışan' THEN 'Selbstständig'
    WHEN 'Tam zamanlı' THEN 'Vollzeit'
    WHEN 'Yarı zamanlı' THEN 'Teilzeit'
    ELSE job_type
  END
WHERE category = 'İş İlanları'
  AND sub_category = 'İnşaat, Sanat & Üretim'
  AND job_type IS NOT NULL;

-- ============================================================
-- STEP 6: Fill empty art fields based on title/description
-- ============================================================
UPDATE listings
SET bau_handwerk_produktion_art = 
  CASE 
    WHEN (title ILIKE '%metallbauer%' OR title ILIKE '%industriemechaniker%' OR 
          title ILIKE '%feinwerkmechaniker%' OR title ILIKE '%konstruktionsmechaniker%')
    THEN 'Schlosser/-in'
    
    WHEN (title ILIKE '%bauhelfer%' OR description ILIKE '%bauhelfer%')
    THEN 'Bauhelfer/-in'
    
    WHEN (title ILIKE '%dachdecker%' OR description ILIKE '%dachdecker%')
    THEN 'Dachdecker/-in'
    
    WHEN (title ILIKE '%elektriker%' OR description ILIKE '%elektriker%')
    THEN 'Elektriker/-in'
    
    WHEN (title ILIKE '%fliesenleger%' OR description ILIKE '%fliesenleger%' OR
          title ILIKE '%fayans%' OR description ILIKE '%fayans%')
    THEN 'Fliesenleger/-in'
    
    WHEN (title ILIKE '%maler%' OR description ILIKE '%maler%')
    THEN 'Maler/-in'
    
    WHEN (title ILIKE '%maurer%' OR description ILIKE '%maurer%')
    THEN 'Maurer/-in'
    
    WHEN (title ILIKE '%produktionshelfer%' OR description ILIKE '%produktionshelfer%')
    THEN 'Produktionshelfer/-in'
    
    WHEN (title ILIKE '%tischler%' OR description ILIKE '%tischler%' OR
          title ILIKE '%marangoz%' OR description ILIKE '%marangoz%')
    THEN 'Tischler/-in'
    
    ELSE 'Weitere Berufe'
  END
WHERE category = 'İş İlanları'
  AND sub_category = 'İnşaat, Sanat & Üretim'
  AND (bau_handwerk_produktion_art IS NULL OR bau_handwerk_produktion_art = '');

-- ============================================================
-- STEP 7: Verify all changes
-- ============================================================
SELECT 
    id,
    title,
    sub_category,
    bau_handwerk_produktion_art,
    working_time,
    job_type,
    hourly_wage,
    status
FROM listings
WHERE category = 'İş İlanları'
  AND sub_category = 'İnşaat, Sanat & Üretim'
ORDER BY created_at DESC;

-- ============================================================
-- STEP 8: Show filter counts
-- ============================================================
-- Art filter counts
SELECT 
    'Art' as filter_type,
    bau_handwerk_produktion_art as value,
    COUNT(*) as count
FROM listings
WHERE category = 'İş İlanları'
  AND sub_category = 'İnşaat, Sanat & Üretim'
  AND status = 'active'
  AND bau_handwerk_produktion_art IS NOT NULL
GROUP BY bau_handwerk_produktion_art

UNION ALL

-- Working time filter counts
SELECT 
    'Working Time' as filter_type,
    working_time as value,
    COUNT(*) as count
FROM listings
WHERE category = 'İş İlanları'
  AND sub_category = 'İnşaat, Sanat & Üretim'
  AND status = 'active'
  AND working_time IS NOT NULL
GROUP BY working_time

UNION ALL

-- Job type filter counts
SELECT 
    'Job Type' as filter_type,
    job_type as value,
    COUNT(*) as count
FROM listings
WHERE category = 'İş İlanları'
  AND sub_category = 'İnşaat, Sanat & Üretim'
  AND status = 'active'
  AND job_type IS NOT NULL
GROUP BY job_type

ORDER BY filter_type, count DESC;
