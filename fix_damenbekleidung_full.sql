-- 1. Standardize Subcategory Names
UPDATE listings
SET sub_category = 'Kadın Giyimi'
WHERE sub_category IN ('Damenbekleidung', 'Damenmode', 'Kadın Giyim')
AND (category = 'Moda & Güzellik' OR category = 'Mode & Beauty');

-- 2. Standardize 'Tür' (Type) - Translate German to Turkish
UPDATE listings
SET damenbekleidung_art = CASE
    WHEN damenbekleidung_art IN ('Anzüge', 'Kombis') THEN 'Takımlar'
    WHEN damenbekleidung_art IN ('Bademode') THEN 'Deniz Giyimi'
    WHEN damenbekleidung_art IN ('Blusen', 'Hemden', 'Blusen & Tuniken') THEN 'Gömlek & Bluz'
    WHEN damenbekleidung_art IN ('Brautkleider', 'Hochzeitskleider') THEN 'Gelinlik & Düğün'
    WHEN damenbekleidung_art IN ('Hosen') THEN 'Pantolonlar'
    WHEN damenbekleidung_art IN ('Jacken', 'Mäntel', 'Jacken & Mäntel') THEN 'Ceket & Palto'
    WHEN damenbekleidung_art IN ('Jeans') THEN 'Kot Pantolonlar'
    WHEN damenbekleidung_art IN ('Kostüme') THEN 'Kostüm & Kıyafet'
    WHEN damenbekleidung_art IN ('Pullover', 'Strickwaren') THEN 'Kazaklar'
    WHEN damenbekleidung_art IN ('Röcke', 'Kleider', 'Röcke & Kleider') THEN 'Etek & Elbiseler'
    WHEN damenbekleidung_art IN ('T-Shirts', 'Tops', 'Shirts & Tops') THEN 'Tişört & Üst'
    WHEN damenbekleidung_art IN ('Shorts') THEN 'Şortlar'
    WHEN damenbekleidung_art IN ('Sportbekleidung') THEN 'Spor Giyim'
    WHEN damenbekleidung_art IN ('Umstandsmode') THEN 'Hamile Giyim'
    WHEN damenbekleidung_art IN ('Sonstiges', 'Andere', 'Sonstige Damenbekleidung') THEN 'Diğer Kadın Giyimi'
    ELSE damenbekleidung_art -- Keep existing if no match
END
WHERE sub_category = 'Kadın Giyimi';

-- 3. Standardize 'Beden' (Size)
UPDATE listings
SET damenbekleidung_size = CASE
    WHEN damenbekleidung_size IN ('XXS', '32') THEN 'XXS (32)'
    WHEN damenbekleidung_size IN ('XS', '34') THEN 'XS (34)'
    WHEN damenbekleidung_size IN ('S', '36') THEN 'S (36)'
    WHEN damenbekleidung_size IN ('M', '38') THEN 'M (38)'
    WHEN damenbekleidung_size IN ('L', '40') THEN 'L (40)'
    WHEN damenbekleidung_size IN ('XL', '42') THEN 'XL (42)'
    WHEN damenbekleidung_size IN ('XXL', '44') THEN 'XXL (44)'
    WHEN damenbekleidung_size IN ('XXXL', '46') THEN 'XXXL (46)'
    WHEN damenbekleidung_size IN ('4XL', '48') THEN '4XL (48)'
    WHEN damenbekleidung_size IN ('5XL', '50') THEN '5XL (50)'
    WHEN damenbekleidung_size IN ('6XL', '52') THEN '6XL (52)'
    ELSE damenbekleidung_size
END
WHERE sub_category = 'Kadın Giyimi';

-- 4. Standardize 'Renk' (Color)
UPDATE listings
SET damenbekleidung_color = CASE
    WHEN damenbekleidung_color IN ('Beige') THEN 'Bej'
    WHEN damenbekleidung_color IN ('Blau') THEN 'Mavi'
    WHEN damenbekleidung_color IN ('Braun') THEN 'Kahverengi'
    WHEN damenbekleidung_color IN ('Bunt') THEN 'Renkli'
    WHEN damenbekleidung_color IN ('Creme') THEN 'Krem'
    WHEN damenbekleidung_color IN ('Gelb') THEN 'Sarı'
    WHEN damenbekleidung_color IN ('Gold') THEN 'Altın'
    WHEN damenbekleidung_color IN ('Grau') THEN 'Gri'
    WHEN damenbekleidung_color IN ('Grün') THEN 'Yeşil'
    WHEN damenbekleidung_color IN ('Khaki') THEN 'Haki'
    WHEN damenbekleidung_color IN ('Lila', 'Violett') THEN 'Mor'
    WHEN damenbekleidung_color IN ('Orange') THEN 'Turuncu'
    WHEN damenbekleidung_color IN ('Rosa', 'Pink') THEN 'Pembe'
    WHEN damenbekleidung_color IN ('Rot') THEN 'Kırmızı'
    WHEN damenbekleidung_color IN ('Schwarz') THEN 'Siyah'
    WHEN damenbekleidung_color IN ('Silber') THEN 'Gümüş'
    WHEN damenbekleidung_color IN ('Türkis') THEN 'Turkuaz'
    WHEN damenbekleidung_color IN ('Weiß') THEN 'Beyaz'
    WHEN damenbekleidung_color IN ('Andere', 'Sonstige') THEN 'Diğer Renkler'
    ELSE damenbekleidung_color
END
WHERE sub_category = 'Kadın Giyimi';

-- 5. Fallback: If damenbekleidung_art is NULL but title contains keywords, try to populate
UPDATE listings
SET damenbekleidung_art = 'Etek & Elbiseler'
WHERE sub_category = 'Kadın Giyimi' AND damenbekleidung_art IS NULL AND (title ILIKE '%Elbise%' OR title ILIKE '%Etek%' OR title ILIKE '%Kleid%' OR title ILIKE '%Rock%');

UPDATE listings
SET damenbekleidung_art = 'Gömlek & Bluz'
WHERE sub_category = 'Kadın Giyimi' AND damenbekleidung_art IS NULL AND (title ILIKE '%Gömlek%' OR title ILIKE '%Bluz%' OR title ILIKE '%Bluse%' OR title ILIKE '%Hemd%');

-- Cleanup: Ensure category is Turkish
UPDATE listings
SET category = 'Moda & Güzellik'
WHERE category = 'Mode & Beauty' AND sub_category = 'Kadın Giyimi';
