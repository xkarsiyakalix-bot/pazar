-- Standardize 'Sosyal Sektör & Bakım' subcategory name
UPDATE listings
SET sub_category = 'Sosyal Sektör & Bakım'
WHERE category = 'İş İlanları' 
  AND (sub_category = 'Sosyal Sektor & Bakım' OR sub_category = 'Sozialer Sektor & Pflege');

-- Fix 'sozialer_sektor_pflege_art' (Turkish -> German)
UPDATE listings SET sozialer_sektor_pflege_art = 'Altenpfleger/-in' WHERE sub_category = 'Sosyal Sektör & Bakım' AND sozialer_sektor_pflege_art = 'Yaşlı Bakıcısı';
UPDATE listings SET sozialer_sektor_pflege_art = 'Arzthelfer/-in' WHERE sub_category = 'Sosyal Sektör & Bakım' AND sozialer_sektor_pflege_art = 'Doktor Asistanı';
UPDATE listings SET sozialer_sektor_pflege_art = 'Erzieher/-in' WHERE sub_category = 'Sosyal Sektör & Bakım' AND sozialer_sektor_pflege_art = 'Eğitmen';
UPDATE listings SET sozialer_sektor_pflege_art = 'Krankenpfleger/-in' WHERE sub_category = 'Sosyal Sektör & Bakım' AND sozialer_sektor_pflege_art = 'Hemşire';
UPDATE listings SET sozialer_sektor_pflege_art = 'Physiotherapeut/-in' WHERE sub_category = 'Sosyal Sektör & Bakım' AND sozialer_sektor_pflege_art = 'Fizyoterapist';
UPDATE listings SET sozialer_sektor_pflege_art = 'Weitere Berufe' WHERE sub_category = 'Sosyal Sektör & Bakım' AND sozialer_sektor_pflege_art = 'Diğer Meslekler';

-- Fix 'working_time' (Turkish -> German)
UPDATE listings SET working_time = 'Vollzeit' WHERE sub_category = 'Sosyal Sektör & Bakım' AND working_time = 'Tam Zamanlı';
UPDATE listings SET working_time = 'Teilzeit' WHERE sub_category = 'Sosyal Sektör & Bakım' AND working_time = 'Yarı Zamanlı';

-- Fix 'job_type' (Turkish -> German)
UPDATE listings SET job_type = 'Vollzeit' WHERE sub_category = 'Sosyal Sektör & Bakım' AND job_type = 'Tam Zamanlı';
UPDATE listings SET job_type = 'Teilzeit' WHERE sub_category = 'Sosyal Sektör & Bakım' AND job_type = 'Yarı Zamanlı';
UPDATE listings SET job_type = 'Minijob' WHERE sub_category = 'Sosyal Sektör & Bakım' AND job_type = 'Mini İş';
UPDATE listings SET job_type = 'Praktikum' WHERE sub_category = 'Sosyal Sektör & Bakım' AND job_type = 'Staj';
UPDATE listings SET job_type = 'Werkstudent' WHERE sub_category = 'Sosyal Sektör & Bakım' AND job_type = 'Çalışan Öğrenci';
UPDATE listings SET job_type = 'Selbstständig' WHERE sub_category = 'Sosyal Sektör & Bakım' AND job_type = 'Serbest Çalışan';

-- Verification
SELECT sub_category, sozialer_sektor_pflege_art, working_time, job_type, COUNT(*)
FROM listings
WHERE sub_category = 'Sosyal Sektör & Bakım'
GROUP BY sub_category, sozialer_sektor_pflege_art, working_time, job_type;
