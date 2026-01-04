-- Update kinderzimmermobel_art values from German to Turkish
UPDATE listings
SET kinderzimmermobel_art = 'Yatak & Beşik'
WHERE kinderzimmermobel_art = 'Betten & Wiegen';

UPDATE listings
SET kinderzimmermobel_art = 'Mama Sandalyesi & Oyun Parkı'
WHERE kinderzimmermobel_art = 'Hochstühle & Laufställe';

UPDATE listings
SET kinderzimmermobel_art = 'Dolap & Şifonyer'
WHERE kinderzimmermobel_art = 'Schränke & Kommoden';

UPDATE listings
SET kinderzimmermobel_art = 'Alt Değiştirme Masası & Aksesuar'
WHERE kinderzimmermobel_art = 'Wickeltische & Zubehör';

UPDATE listings
SET kinderzimmermobel_art = 'Ana Kucağı & Salıncak'
WHERE kinderzimmermobel_art = 'Wippen & Schaukeln';

UPDATE listings
SET kinderzimmermobel_art = 'Diğer Çocuk Odası Mobilyaları'
WHERE kinderzimmermobel_art = 'Weitere Kinderzimmermöbel';
