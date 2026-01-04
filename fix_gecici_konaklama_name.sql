-- Normalize 'Geçici Konaklama & Paylaşımlı Oda' to 'Geçici Konaklama & Paylaşımlı Ev'
UPDATE listings
SET sub_category = 'Geçici Konaklama & Paylaşımlı Ev'
WHERE sub_category = 'Geçici Konaklama & Paylaşımlı Oda' OR sub_category = 'Geçici Konaklama & Paylaşımlı Ev';

-- Verify the update
SELECT count(*) as count, sub_category 
FROM listings 
WHERE category = 'Emlak' AND (sub_category LIKE 'Geçici Konaklama%')
GROUP BY sub_category;
