SELECT id, sub_category, COUNT(*) as count
FROM listings
WHERE sub_category IN ('Tatil ve Yurt Dışı Emlak', 'Tatil Evi & Yurt Dışı Emlak')
GROUP BY id, sub_category;
