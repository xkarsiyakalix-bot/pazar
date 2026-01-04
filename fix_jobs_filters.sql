-- Fix working_time values (Turkish -> German)
UPDATE listings 
SET working_time = 'Vollzeit' 
WHERE working_time = 'Tam Zamanlı' AND category = 'İş İlanları';

UPDATE listings 
SET working_time = 'Teilzeit' 
WHERE working_time = 'Yarı Zamanlı' AND category = 'İş İlanları';

-- Fix weitere_jobs_art for known titles in 'Diğer İş İlanları'
UPDATE listings
SET weitere_jobs_art = 'Reinigungskraft'
WHERE category = 'İş İlanları' 
  AND sub_category = 'Diğer İş İlanları'
  AND title ILIKE '%Reinigungskraft%'
  AND (weitere_jobs_art IS NULL OR weitere_jobs_art = '');

-- Add other common mappings if needed based on title keywords
-- Designer
UPDATE listings
SET weitere_jobs_art = 'Designer/-in & Grafiker/-in'
WHERE category = 'İş İlanları' 
  AND sub_category = 'Diğer İş İlanları'
  AND (title ILIKE '%Designer%' OR title ILIKE '%Grafik%')
  AND (weitere_jobs_art IS NULL OR weitere_jobs_art = '');

-- Friseur
UPDATE listings
SET weitere_jobs_art = 'Friseur/-in'
WHERE category = 'İş İlanları' 
  AND sub_category = 'Diğer İş İlanları'
  AND (title ILIKE '%Friseur%' OR title ILIKE '%Kuaför%')
  AND (weitere_jobs_art IS NULL OR weitere_jobs_art = '');

-- Haushaltshilfe
UPDATE listings
SET weitere_jobs_art = 'Haushaltshilfe'
WHERE category = 'İş İlanları' 
  AND sub_category = 'Diğer İş İlanları'
  AND (title ILIKE '%Haushalt%' OR title ILIKE '%Ev İşleri%')
  AND (weitere_jobs_art IS NULL OR weitere_jobs_art = '');

-- Hausmeister
UPDATE listings
SET weitere_jobs_art = 'Hausmeister/-in'
WHERE category = 'İş İlanları' 
  AND sub_category = 'Diğer İş İlanları'
  AND (title ILIKE '%Hausmeister%' OR title ILIKE '%Kapıcı%')
  AND (weitere_jobs_art IS NULL OR weitere_jobs_art = '');
