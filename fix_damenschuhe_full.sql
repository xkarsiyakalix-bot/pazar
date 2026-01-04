-- 1. Add specific columns for Kadın Ayakkabıları if they don't exist
ALTER TABLE listings ADD COLUMN IF NOT EXISTS damenschuhe_art TEXT;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS damenschuhe_marke TEXT;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS damenschuhe_size TEXT;
ALTER TABLE listings ADD COLUMN IF NOT EXISTS damenschuhe_color TEXT;

-- 2. Standardize subcategory names to 'Kadın Ayakkabıları'
UPDATE listings 
SET sub_category = 'Kadın Ayakkabıları' 
WHERE sub_category IN ('Damenschuhe', 'Kadın Ayakkabı', 'Kadin Ayakkabi', 'Damen Schuhe');

-- 3. Ensure category is 'Moda & Güzellik' for these listings
UPDATE listings 
SET category = 'Moda & Güzellik' 
WHERE sub_category = 'Kadın Ayakkabıları';

-- 4. Populate damenschuhe_art (Type) for existing listings if NULL
UPDATE listings
SET damenschuhe_art = CASE
    WHEN title ILIKE '%Babet%' OR description ILIKE '%Babet%' THEN 'Babetler'
    WHEN title ILIKE '%Spor%' OR title ILIKE '%Sneaker%' OR description ILIKE '%Sneaker%' THEN 'Sneaker & Spor Ayakkabı'
    WHEN title ILIKE '%Bot%' OR title ILIKE '%Çizme%' OR title ILIKE '%Stiefel%' THEN 'Çizme & Botlar'
    WHEN title ILIKE '%Topuklu%' OR title ILIKE '%High Heels%' OR title ILIKE '%Heels%' THEN 'Topuklu Ayakkabılar'
    WHEN title ILIKE '%Sandalet%' OR title ILIKE '%Sandalen%' THEN 'Sandaletler'
    WHEN title ILIKE '%Terlik%' OR title ILIKE '%Hausschuh%' THEN 'Ev Terlikleri'
    ELSE 'Diğer Ayakkabılar'
END
WHERE sub_category = 'Kadın Ayakkabıları' AND damenschuhe_art IS NULL;

-- 5. Populate damenschuhe_marke (Brand) if NULL
UPDATE listings
SET damenschuhe_marke = 'Sonstige'
WHERE sub_category = 'Kadın Ayakkabıları' AND damenschuhe_marke IS NULL;

-- 6. Populate damenschuhe_size (Size) if NULL
UPDATE listings
SET damenschuhe_size = '38' -- Common default size, better than nothing for filter visibility
WHERE sub_category = 'Kadın Ayakkabıları' AND damenschuhe_size IS NULL;

-- 7. Populate damenschuhe_color (Color) if NULL
UPDATE listings
SET damenschuhe_color = 'Diğer Renkler'
WHERE sub_category = 'Kadın Ayakkabıları' AND damenschuhe_color IS NULL;

-- 8. Translate German values to Turkish (if any exist from previous data)
-- Art
UPDATE listings SET damenschuhe_art = 'Babetler' WHERE damenschuhe_art = 'Ballerinas';
UPDATE listings SET damenschuhe_art = 'Yürüyüş & Bağcıklı Ayakkabı' WHERE damenschuhe_art = 'Halb- & Schnürschuhe';
UPDATE listings SET damenschuhe_art = 'Ev Terlikleri' WHERE damenschuhe_art = 'Hausschuhe';
UPDATE listings SET damenschuhe_art = 'Outdoor & Doğa Yürüyüşü' WHERE damenschuhe_art = 'Outdoor & Wanderschuhe';
UPDATE listings SET damenschuhe_art = 'Topuklu Ayakkabılar' WHERE damenschuhe_art = 'Pumps & High Heels';
UPDATE listings SET damenschuhe_art = 'Sandaletler' WHERE damenschuhe_art = 'Sandalen';
UPDATE listings SET damenschuhe_art = 'Sneaker & Spor Ayakkabı' WHERE damenschuhe_art = 'Sneaker & Sportschuhe';
UPDATE listings SET damenschuhe_art = 'Çizme & Botlar' WHERE damenschuhe_art = 'Stiefel & Stiefeletten';
UPDATE listings SET damenschuhe_art = 'Diğer Ayakkabılar' WHERE damenschuhe_art = 'Weitere Schuhe';

-- Color
UPDATE listings SET damenschuhe_color = 'Bej' WHERE damenschuhe_color = 'Beige';
UPDATE listings SET damenschuhe_color = 'Mavi' WHERE damenschuhe_color = 'Blau';
UPDATE listings SET damenschuhe_color = 'Kahverengi' WHERE damenschuhe_color = 'Braun';
UPDATE listings SET damenschuhe_color = 'Renkli' WHERE damenschuhe_color = 'Bunt';
UPDATE listings SET damenschuhe_color = 'Krem' WHERE damenschuhe_color = 'Creme';
UPDATE listings SET damenschuhe_color = 'Sarı' WHERE damenschuhe_color = 'Gelb';
UPDATE listings SET damenschuhe_color = 'Altın' WHERE damenschuhe_color = 'Gold';
UPDATE listings SET damenschuhe_color = 'Gri' WHERE damenschuhe_color = 'Grau';
UPDATE listings SET damenschuhe_color = 'Yeşil' WHERE damenschuhe_color = 'Grün';
UPDATE listings SET damenschuhe_color = 'Haki' WHERE damenschuhe_color = 'Khaki';
UPDATE listings SET damenschuhe_color = 'Lavanta' WHERE damenschuhe_color = 'Lavendel';
UPDATE listings SET damenschuhe_color = 'Mor' WHERE damenschuhe_color = 'Lila';
UPDATE listings SET damenschuhe_color = 'Turuncu' WHERE damenschuhe_color = 'Orange';
UPDATE listings SET damenschuhe_color = 'Pembe' WHERE damenschuhe_color = 'Pink';
UPDATE listings SET damenschuhe_color = 'Desenli' WHERE damenschuhe_color = 'Print';
UPDATE listings SET damenschuhe_color = 'Kırmızı' WHERE damenschuhe_color = 'Rot';
UPDATE listings SET damenschuhe_color = 'Siyah' WHERE damenschuhe_color = 'Schwarz';
UPDATE listings SET damenschuhe_color = 'Gümüş' WHERE damenschuhe_color = 'Silber';
UPDATE listings SET damenschuhe_color = 'Turkuaz' WHERE damenschuhe_color = 'Türkis';
UPDATE listings SET damenschuhe_color = 'Beyaz' WHERE damenschuhe_color = 'Weiß';
