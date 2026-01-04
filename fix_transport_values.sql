-- Standardize 'Nakliye, Lojistik & Trafik' subcategory name
UPDATE listings
SET sub_category = 'Nakliye, Lojistik & Trafik'
WHERE category = 'İş İlanları' 
  AND (sub_category = 'Taşımacılık & Lojistik' OR sub_category = 'Transport, Logistik & Verkehr' OR sub_category = 'Tasimacilik-Lojistik');

-- Fix 'transport_logistik_verkehr_art' (Turkish -> German)
UPDATE listings SET transport_logistik_verkehr_art = 'Kraftfahrer/-in' WHERE sub_category = 'Nakliye, Lojistik & Trafik' AND transport_logistik_verkehr_art = 'Şoför';
UPDATE listings SET transport_logistik_verkehr_art = 'Kurierfahrer/-in' WHERE sub_category = 'Nakliye, Lojistik & Trafik' AND transport_logistik_verkehr_art = 'Kurye';
UPDATE listings SET transport_logistik_verkehr_art = 'Lagerhelfer/-in' WHERE sub_category = 'Nakliye, Lojistik & Trafik' AND transport_logistik_verkehr_art = 'Depo Elemanı';
UPDATE listings SET transport_logistik_verkehr_art = 'Lagerhelfer/-in' WHERE sub_category = 'Nakliye, Lojistik & Trafik' AND transport_logistik_verkehr_art = 'Depo Yardımcısı';
UPDATE listings SET transport_logistik_verkehr_art = 'Staplerfahrer/-in' WHERE sub_category = 'Nakliye, Lojistik & Trafik' AND transport_logistik_verkehr_art = 'Forklift Operatörü';
UPDATE listings SET transport_logistik_verkehr_art = 'Weitere Berufe' WHERE sub_category = 'Nakliye, Lojistik & Trafik' AND transport_logistik_verkehr_art = 'Diğer Meslekler';

-- Fix 'working_time' (Turkish -> German)
UPDATE listings SET working_time = 'Vollzeit' WHERE sub_category = 'Nakliye, Lojistik & Trafik' AND working_time = 'Tam Zamanlı';
UPDATE listings SET working_time = 'Teilzeit' WHERE sub_category = 'Nakliye, Lojistik & Trafik' AND working_time = 'Yarı Zamanlı';

-- Verification
SELECT sub_category, transport_logistik_verkehr_art, working_time, COUNT(*)
FROM listings
WHERE sub_category = 'Nakliye, Lojistik & Trafik'
GROUP BY sub_category, transport_logistik_verkehr_art, working_time;
