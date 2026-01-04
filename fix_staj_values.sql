-- Standardize 'Staj' subcategory name
UPDATE listings
SET sub_category = 'Staj'
WHERE category = 'İş İlanları' 
  AND (sub_category = 'Praktika' OR sub_category = 'Stajlar');

-- Fix working_time (Turkish -> German) for Staj
UPDATE listings SET working_time = 'Vollzeit' WHERE sub_category = 'Staj' AND working_time = 'Tam Zamanlı';
UPDATE listings SET working_time = 'Teilzeit' WHERE sub_category = 'Staj' AND working_time = 'Yarı Zamanlı';
UPDATE listings SET working_time = 'Minijob' WHERE sub_category = 'Staj' AND working_time = 'Mini İş';

-- Fix job_type (Turkish -> German) for Staj
-- Assuming 'Staj' listings might have 'Praktikum' as job type, or 'Vollzeit'/'Teilzeit' if they are paid internships with specific hours
UPDATE listings SET job_type = 'Praktikum' WHERE sub_category = 'Staj' AND job_type = 'Staj';
UPDATE listings SET job_type = 'Vollzeit' WHERE sub_category = 'Staj' AND job_type = 'Tam Zamanlı';
UPDATE listings SET job_type = 'Teilzeit' WHERE sub_category = 'Staj' AND job_type = 'Yarı Zamanlı';
UPDATE listings SET job_type = 'Minijob' WHERE sub_category = 'Staj' AND job_type = 'Mini İş';
UPDATE listings SET job_type = 'Werkstudent' WHERE sub_category = 'Staj' AND job_type = 'Çalışan Öğrenci';

-- Verification
SELECT sub_category, working_time, job_type, COUNT(*)
FROM listings
WHERE sub_category = 'Staj'
GROUP BY sub_category, working_time, job_type;
