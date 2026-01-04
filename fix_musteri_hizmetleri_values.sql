-- Standardize Müşteri Hizmetleri & Çağrı Merkezi subcategory name
UPDATE listings
SET sub_category = 'Müşteri Hizmetleri & Çağrı Merkezi'
WHERE category = 'İş İlanları' 
  AND (sub_category = 'Müşteri Hizmetleri' OR sub_category = 'Çağrı Merkezi' OR sub_category = 'Kundenservice & Call Center');

-- Fix working_time (Turkish -> German) for Müşteri Hizmetleri
UPDATE listings SET working_time = 'Vollzeit' WHERE sub_category = 'Müşteri Hizmetleri & Çağrı Merkezi' AND working_time = 'Tam Zamanlı';
UPDATE listings SET working_time = 'Teilzeit' WHERE sub_category = 'Müşteri Hizmetleri & Çağrı Merkezi' AND working_time = 'Yarı Zamanlı';

-- Fix job_type (Turkish -> German) for Müşteri Hizmetleri
UPDATE listings SET job_type = 'Vollzeit' WHERE sub_category = 'Müşteri Hizmetleri & Çağrı Merkezi' AND job_type = 'Tam Zamanlı';
UPDATE listings SET job_type = 'Teilzeit' WHERE sub_category = 'Müşteri Hizmetleri & Çağrı Merkezi' AND job_type = 'Yarı Zamanlı';
UPDATE listings SET job_type = 'Minijob' WHERE sub_category = 'Müşteri Hizmetleri & Çağrı Merkezi' AND job_type = 'Mini İş';
UPDATE listings SET job_type = 'Praktikum' WHERE sub_category = 'Müşteri Hizmetleri & Çağrı Merkezi' AND job_type = 'Staj';
UPDATE listings SET job_type = 'Werkstudent' WHERE sub_category = 'Müşteri Hizmetleri & Çağrı Merkezi' AND job_type = 'Çalışan Öğrenci';
UPDATE listings SET job_type = 'Selbstständig' WHERE sub_category = 'Müşteri Hizmetleri & Çağrı Merkezi' AND job_type = 'Serbest Çalışan';

-- Verification
SELECT sub_category, working_time, job_type, COUNT(*)
FROM listings
WHERE sub_category = 'Müşteri Hizmetleri & Çağrı Merkezi'
GROUP BY sub_category, working_time, job_type;
