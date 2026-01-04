UPDATE listings
SET sub_category = 'Satış, Satın Alma & Pazarlama'
WHERE category = 'İş İlanları' 
  AND (
    sub_category ILIKE '%Satış%' 
    OR sub_category ILIKE '%Pazarlama%' 
    OR sub_category ILIKE '%Vertrieb%' 
    OR sub_category ILIKE '%Verkauf%'
  );

-- Fix 'vertrieb_einkauf_verkauf_art' (Turkish -> German)
UPDATE listings SET vertrieb_einkauf_verkauf_art = 'Verkäufer/-in' WHERE sub_category = 'Satış, Satın Alma & Pazarlama' AND vertrieb_einkauf_verkauf_art IN ('Satış Elemanı', 'Satış Danışmanı', 'Satış Temsilcisi', 'Tezgahtar');
UPDATE listings SET vertrieb_einkauf_verkauf_art = 'Kaufmann/-frau' WHERE sub_category = 'Satış, Satın Alma & Pazarlama' AND vertrieb_einkauf_verkauf_art IN ('Ticari Eleman', 'Pazarlamacı', 'Pazarlama Uzmanı', 'Satın Alma Uzmanı', 'Tüccar');
UPDATE listings SET vertrieb_einkauf_verkauf_art = 'Immobilienmakler/-in' WHERE sub_category = 'Satış, Satın Alma & Pazarlama' AND vertrieb_einkauf_verkauf_art IN ('Emlak Danışmanı', 'Gayrimenkul Danışmanı', 'Emlakçı');
UPDATE listings SET vertrieb_einkauf_verkauf_art = 'Buchhalter/-in' WHERE sub_category = 'Satış, Satın Alma & Pazarlama' AND vertrieb_einkauf_verkauf_art IN ('Muhasebeci', 'Mali Müşavir', 'Ön Muhasebe');
UPDATE listings SET vertrieb_einkauf_verkauf_art = 'Weitere Berufe' WHERE sub_category = 'Satış, Satın Alma & Pazarlama' AND vertrieb_einkauf_verkauf_art IN ('Diğer Meslekler', 'Diğer');

-- Fix 'working_time' (Turkish -> German)
UPDATE listings SET working_time = 'Vollzeit' WHERE sub_category = 'Satış, Satın Alma & Pazarlama' AND working_time = 'Tam Zamanlı';
UPDATE listings SET working_time = 'Teilzeit' WHERE sub_category = 'Satış, Satın Alma & Pazarlama' AND working_time = 'Yarı Zamanlı';

-- Verification
SELECT sub_category, vertrieb_einkauf_verkauf_art, working_time, COUNT(*)
FROM listings
WHERE sub_category = 'Satış, Satın Alma & Pazarlama'
GROUP BY sub_category, vertrieb_einkauf_verkauf_art, working_time;
