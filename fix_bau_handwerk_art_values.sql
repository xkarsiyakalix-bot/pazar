-- Fix bau_handwerk_produktion_art values to match frontend filter options
-- Frontend uses German values like 'Fliesenleger/-in', but DB has Turkish 'Fayans Ustası'

-- First check current values
SELECT 
    bau_handwerk_produktion_art,
    COUNT(*) as count
FROM listings
WHERE category = 'İş İlanları'
  AND sub_category = 'İnşaat, Sanat & Üretim'
  AND status = 'active'
GROUP BY bau_handwerk_produktion_art;

-- Update Turkish values to German to match frontend
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

-- Verify the update
SELECT 
    bau_handwerk_produktion_art,
    COUNT(*) as count
FROM listings
WHERE category = 'İş İlanları'
  AND sub_category = 'İnşaat, Sanat & Üretim'
  AND status = 'active'
GROUP BY bau_handwerk_produktion_art;

-- Show sample listings
SELECT id, title, bau_handwerk_produktion_art
FROM listings
WHERE category = 'İş İlanları'
  AND sub_category = 'İnşaat, Sanat & Üretim'
  AND status = 'active'
LIMIT 5;
