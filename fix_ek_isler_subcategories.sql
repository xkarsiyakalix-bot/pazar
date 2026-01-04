-- Standardize 'Yarı Zamanlı & Ek İşler' to 'Mini & Ek İşler'
UPDATE listings
SET sub_category = 'Mini & Ek İşler'
WHERE category = 'İş İlanları' 
  AND (sub_category = 'Yarı Zamanlı & Ek İşler' OR sub_category = 'Ek İşler' OR sub_category = 'Minijobs & Aushilfen');

-- Standardize 'Mesleki Eğitim'
UPDATE listings
SET sub_category = 'Mesleki Eğitim'
WHERE category = 'İş İlanları' 
  AND (sub_category = 'Eğitim / Meslek Eğitimi' OR sub_category = 'Ausbildung');

-- Standardize 'Nakliye, Lojistik & Trafik'
UPDATE listings
SET sub_category = 'Nakliye, Lojistik & Trafik'
WHERE category = 'İş İlanları' 
  AND sub_category IN ('Taşıma, Lojistik & Ulaşım', 'Transport, Logistik & Verkehr');

-- Standardize 'Diğer İş İlanları'
UPDATE listings
SET sub_category = 'Diğer İş İlanları'
WHERE category = 'İş İlanları' 
  AND sub_category IN ('Diğer İşler', 'Sonstiges');

-- Check counts
SELECT sub_category, COUNT(*)
FROM listings
WHERE category = 'İş İlanları'
GROUP BY sub_category;
