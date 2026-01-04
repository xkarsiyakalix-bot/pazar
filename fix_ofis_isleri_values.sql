-- Standardize sub_category name
UPDATE listings
SET sub_category = 'Ofis İşleri & Yönetim'
WHERE category = 'İş İlanları'
  AND (sub_category = 'Büro İşleri & Yönetim' OR sub_category = 'Büroarbeit & Yönetim' OR sub_category = 'Büroarbeit & Verwaltung');

-- Fix buero_arbeit_verwaltung_art values (Turkish -> German)
UPDATE listings
SET buero_arbeit_verwaltung_art = 'Buchhalter/-in'
WHERE sub_category = 'Ofis İşleri & Yönetim' AND buero_arbeit_verwaltung_art = 'Muhasebeci';

UPDATE listings
SET buero_arbeit_verwaltung_art = 'Bürokaufmann/-frau'
WHERE sub_category = 'Ofis İşleri & Yönetim' AND buero_arbeit_verwaltung_art = 'Ofis Elemanı';

UPDATE listings
SET buero_arbeit_verwaltung_art = 'Sachbearbeiter/-in'
WHERE sub_category = 'Ofis İşleri & Yönetim' AND buero_arbeit_verwaltung_art = 'Dosya Sorumlusu';

UPDATE listings
SET buero_arbeit_verwaltung_art = 'Sekretär/-in'
WHERE sub_category = 'Ofis İşleri & Yönetim' AND buero_arbeit_verwaltung_art = 'Sekreter';

UPDATE listings
SET buero_arbeit_verwaltung_art = 'Weitere Berufe'
WHERE sub_category = 'Ofis İşleri & Yönetim' AND (buero_arbeit_verwaltung_art = 'Diğer Meslekler' OR buero_arbeit_verwaltung_art = 'Diğer');

-- Fix working_time (Turkish -> German)
UPDATE listings
SET working_time = 'Vollzeit'
WHERE sub_category = 'Ofis İşleri & Yönetim' AND working_time = 'Tam Zamanlı';

UPDATE listings
SET working_time = 'Teilzeit'
WHERE sub_category = 'Ofis İşleri & Yönetim' AND working_time = 'Yarı Zamanlı';

-- Fix job_type (Turkish -> German)
UPDATE listings
SET job_type = 'Vollzeit'
WHERE sub_category = 'Ofis İşleri & Yönetim' AND job_type = 'Tam Zamanlı';

UPDATE listings
SET job_type = 'Teilzeit'
WHERE sub_category = 'Ofis İşleri & Yönetim' AND job_type = 'Yarı Zamanlı';

UPDATE listings
SET job_type = 'Minijob'
WHERE sub_category = 'Ofis İşleri & Yönetim' AND job_type = 'Mini İş';

UPDATE listings
SET job_type = 'Praktikum'
WHERE sub_category = 'Ofis İşleri & Yönetim' AND job_type = 'Staj';

UPDATE listings
SET job_type = 'Werkstudent'
WHERE sub_category = 'Ofis İşleri & Yönetim' AND job_type = 'Çalışan Öğrenci';

UPDATE listings
SET job_type = 'Selbstständig'
WHERE sub_category = 'Ofis İşleri & Yönetim' AND job_type = 'Serbest Çalışan';

-- Verification Query
SELECT sub_category, buero_arbeit_verwaltung_art, working_time, job_type, COUNT(*) 
FROM listings 
WHERE sub_category = 'Ofis İşleri & Yönetim' 
GROUP BY sub_category, buero_arbeit_verwaltung_art, working_time, job_type;
