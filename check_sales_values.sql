SELECT sub_category, vertrieb_einkauf_verkauf_art, working_time, COUNT(*)
FROM listings
WHERE category = 'İş İlanları' 
  AND (
    sub_category ILIKE '%Satış%' 
    OR sub_category ILIKE '%Pazarlama%' 
    OR sub_category ILIKE '%Vertrieb%' 
    OR sub_category ILIKE '%Verkauf%'
    OR sub_category = 'Satis-Pazarlama'
  )
GROUP BY sub_category, vertrieb_einkauf_verkauf_art, working_time;
