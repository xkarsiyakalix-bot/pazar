-- Standardize Damenbekleidung 'Tür' (Type) values
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
    ELSE damenbekleidung_art
END
WHERE sub_category IN ('Kadın Giyimi', 'Kadın Giyim');

-- Standardize Damenbekleidung 'Beden' (Size) values if needed
-- (Example mapping, extend as needed)
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
    ELSE damenbekleidung_size
END
WHERE sub_category IN ('Kadın Giyimi', 'Kadın Giyim');

-- Standardize Damenbekleidung 'Renk' (Color) values
UPDATE listings
SET damenbekleidung_color = CASE
    WHEN damenbekleidung_color = 'Beige' THEN 'Bej'
    WHEN damenbekleidung_color = 'Blau' THEN 'Mavi'
    WHEN damenbekleidung_color = 'Braun' THEN 'Kahverengi'
    WHEN damenbekleidung_color = 'Bunt' THEN 'Renkli'
    WHEN damenbekleidung_color = 'Creme' THEN 'Krem'
    WHEN damenbekleidung_color = 'Gelb' THEN 'Sarı'
    WHEN damenbekleidung_color = 'Gold' THEN 'Altın'
    WHEN damenbekleidung_color = 'Grau' THEN 'Gri'
    WHEN damenbekleidung_color = 'Grün' THEN 'Yeşil'
    WHEN damenbekleidung_color = 'Khaki' THEN 'Haki'
    WHEN damenbekleidung_color = 'Lila' THEN 'Mor'
    WHEN damenbekleidung_color = 'Orange' THEN 'Turuncu'
    WHEN damenbekleidung_color = 'Rosa' THEN 'Pembe'
    WHEN damenbekleidung_color = 'Pink' THEN 'Pembe'
    WHEN damenbekleidung_color = 'Rot' THEN 'Kırmızı'
    WHEN damenbekleidung_color = 'Schwarz' THEN 'Siyah'
    WHEN damenbekleidung_color = 'Silber' THEN 'Gümüş'
    WHEN damenbekleidung_color = 'Türkis' THEN 'Turkuaz'
    WHEN damenbekleidung_color = 'Weiß' THEN 'Beyaz'
    ELSE damenbekleidung_color
END
WHERE sub_category IN ('Kadın Giyimi', 'Kadın Giyim');
