-- Fix working_time and job_type values for İnşaat, Sanat & Üretim
-- Convert Turkish values to German to match frontend filters

-- Check current values
SELECT 
    working_time,
    job_type,
    COUNT(*) as count
FROM listings
WHERE category = 'İş İlanları'
  AND sub_category = 'İnşaat, Sanat & Üretim'
  AND status = 'active'
GROUP BY working_time, job_type;

-- Update working_time from Turkish to German
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

-- Update job_type from Turkish to German
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

-- Verify the changes
SELECT 
    id,
    title,
    working_time,
    job_type,
    hourly_wage,
    bau_handwerk_produktion_art
FROM listings
WHERE category = 'İş İlanları'
  AND sub_category = 'İnşaat, Sanat & Üretim'
  AND status = 'active';

-- Show counts for filters
SELECT 
    'working_time' as field,
    working_time as value,
    COUNT(*) as count
FROM listings
WHERE category = 'İş İlanları'
  AND sub_category = 'İnşaat, Sanat & Üretim'
  AND status = 'active'
  AND working_time IS NOT NULL
GROUP BY working_time

UNION ALL

SELECT 
    'job_type' as field,
    job_type as value,
    COUNT(*) as count
FROM listings
WHERE category = 'İş İlanları'
  AND sub_category = 'İnşaat, Sanat & Üretim'
  AND status = 'active'
  AND job_type IS NOT NULL
GROUP BY job_type

ORDER BY field, count DESC;
