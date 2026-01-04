-- Standardize 'Mini & Ek İşler' subcategory name (already done in fix_ek_isler_subcategories.sql but good to be sure)
UPDATE listings
SET sub_category = 'Mini & Ek İşler'
WHERE category = 'İş İlanları' 
  AND (sub_category = 'Yarı Zamanlı & Ek İşler' OR sub_category = 'Ek İşler' OR sub_category = 'Minijobs & Aushilfen');

-- Fix working_time (Turkish -> German) for Mini & Ek İşler
UPDATE listings SET working_time = 'Vollzeit' WHERE sub_category = 'Mini & Ek İşler' AND working_time = 'Tam Zamanlı';
UPDATE listings SET working_time = 'Teilzeit' WHERE sub_category = 'Mini & Ek İşler' AND working_time = 'Yarı Zamanlı';
UPDATE listings SET working_time = 'Minijob' WHERE sub_category = 'Mini & Ek İşler' AND working_time = 'Mini İş';

-- Fix job_type (Turkish -> German) for Mini & Ek İşler (if applicable)
UPDATE listings SET job_type = 'Vollzeit' WHERE sub_category = 'Mini & Ek İşler' AND job_type = 'Tam Zamanlı';
UPDATE listings SET job_type = 'Teilzeit' WHERE sub_category = 'Mini & Ek İşler' AND job_type = 'Yarı Zamanlı';
UPDATE listings SET job_type = 'Minijob' WHERE sub_category = 'Mini & Ek İşler' AND job_type = 'Mini İş';
UPDATE listings SET job_type = 'Praktikum' WHERE sub_category = 'Mini & Ek İşler' AND job_type = 'Staj';
UPDATE listings SET job_type = 'Werkstudent' WHERE sub_category = 'Mini & Ek İşler' AND job_type = 'Çalışan Öğrenci';
UPDATE listings SET job_type = 'Selbstständig' WHERE sub_category = 'Mini & Ek İşler' AND job_type = 'Serbest Çalışan';

-- Verification
SELECT sub_category, working_time, job_type, COUNT(*)
FROM listings
WHERE sub_category = 'Mini & Ek İşler'
GROUP BY sub_category, working_time, job_type;
