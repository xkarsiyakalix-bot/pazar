-- Check distinct values for Ofis İşleri & Yönetim fields
SELECT 
    sub_category,
    buero_arbeit_verwaltung_art,
    working_time,
    job_type,
    COUNT(*)
FROM listings
WHERE category = 'İş İlanları'
  AND (sub_category = 'Ofis İşleri & Yönetim' OR sub_category = 'Büro İşleri & Yönetim' OR sub_category = 'Büroarbeit & Yönetim' OR sub_category = 'Büroarbeit & Verwaltung')
GROUP BY sub_category, buero_arbeit_verwaltung_art, working_time, job_type;
