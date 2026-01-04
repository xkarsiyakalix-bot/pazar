-- Standardize Gastronomi & Turizm subcategory name just in case
UPDATE listings
SET sub_category = 'Gastronomi & Turizm'
WHERE category = 'İş İlanları' AND (sub_category = 'Gastronomi ve Turizm' OR sub_category = 'Gastronomie & Tourismus');

-- Fix gastronomie_tourismus_art values (Turkish -> German)
UPDATE listings SET gastronomie_tourismus_art = 'Barkeeper/-in' WHERE sub_category = 'Gastronomi & Turizm' AND gastronomie_tourismus_art = 'Barmen/Barmaid';
UPDATE listings SET gastronomie_tourismus_art = 'Hotelfachmann/-frau' WHERE sub_category = 'Gastronomi & Turizm' AND gastronomie_tourismus_art = 'Otel Elemanı';
UPDATE listings SET gastronomie_tourismus_art = 'Kellner/-in' WHERE sub_category = 'Gastronomi & Turizm' AND gastronomie_tourismus_art = 'Garson';
UPDATE listings SET gastronomie_tourismus_art = 'Koch/Köchin' WHERE sub_category = 'Gastronomi & Turizm' AND gastronomie_tourismus_art = 'Aşçı';
UPDATE listings SET gastronomie_tourismus_art = 'Küchenhilfe' WHERE sub_category = 'Gastronomi & Turizm' AND gastronomie_tourismus_art = 'Mutfak Yardımcısı';
UPDATE listings SET gastronomie_tourismus_art = 'Servicekraft' WHERE sub_category = 'Gastronomi & Turizm' AND gastronomie_tourismus_art = 'Servis Elemanı';
UPDATE listings SET gastronomie_tourismus_art = 'Housekeeping' WHERE sub_category = 'Gastronomi & Turizm' AND gastronomie_tourismus_art = 'Kat Hizmetleri';
UPDATE listings SET gastronomie_tourismus_art = 'Weitere Berufe' WHERE sub_category = 'Gastronomi & Turizm' AND (gastronomie_tourismus_art = 'Diğer Meslekler' OR gastronomie_tourismus_art = 'Diğer');

-- Fix working_time (Turkish -> German) for Gastronomi
UPDATE listings SET working_time = 'Vollzeit' WHERE sub_category = 'Gastronomi & Turizm' AND working_time = 'Tam Zamanlı';
UPDATE listings SET working_time = 'Teilzeit' WHERE sub_category = 'Gastronomi & Turizm' AND working_time = 'Yarı Zamanlı';

-- Fix job_type (Turkish -> German) for Gastronomi
UPDATE listings SET job_type = 'Vollzeit' WHERE sub_category = 'Gastronomi & Turizm' AND job_type = 'Tam Zamanlı';
UPDATE listings SET job_type = 'Teilzeit' WHERE sub_category = 'Gastronomi & Turizm' AND job_type = 'Yarı Zamanlı';
UPDATE listings SET job_type = 'Minijob' WHERE sub_category = 'Gastronomi & Turizm' AND job_type = 'Mini İş';
UPDATE listings SET job_type = 'Praktikum' WHERE sub_category = 'Gastronomi & Turizm' AND job_type = 'Staj';
UPDATE listings SET job_type = 'Werkstudent' WHERE sub_category = 'Gastronomi & Turizm' AND job_type = 'Çalışan Öğrenci';
UPDATE listings SET job_type = 'Selbstständig' WHERE sub_category = 'Gastronomi & Turizm' AND job_type = 'Serbest Çalışan';

-- Verification
SELECT sub_category, gastronomie_tourismus_art, working_time, job_type, COUNT(*)
FROM listings
WHERE sub_category = 'Gastronomi & Turizm'
GROUP BY sub_category, gastronomie_tourismus_art, working_time, job_type;
