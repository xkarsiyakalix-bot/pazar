-- Normalize Erkek Giyimi / Herrenbekleidung values to Turkish

UPDATE listings
SET condition = CASE 
    WHEN condition = 'neu' THEN 'Yeni'
    WHEN condition = 'neu_mit_etikett' THEN 'Yeni & Etiketli'
    WHEN condition = 'sehr_gut' THEN 'Çok İyi'
    WHEN condition = 'gut' THEN 'İyi'
    WHEN condition = 'in_ordnung' THEN 'Makul'
    WHEN condition = 'gebraucht' THEN 'İkinci El'
    WHEN condition = 'used' THEN 'İkinci El'
    WHEN condition = 'defekt' THEN 'Kusurlu'
    ELSE condition
END
WHERE sub_category IN ('Erkek Giyimi', 'Herrenbekleidung') AND condition IN ('neu', 'neu_mit_etikett', 'sehr_gut', 'gut', 'in_ordnung', 'gebraucht', 'used', 'defekt');

UPDATE listings
SET versand_art = CASE 
    WHEN versand_art = 'Versand möglich' THEN 'Kargo Mümkün'
    WHEN versand_art = 'Nur Abholung' THEN 'Sadece Elden Teslim'
    ELSE versand_art
END
WHERE sub_category IN ('Erkek Giyimi', 'Herrenbekleidung') AND versand_art IN ('Versand möglich', 'Nur Abholung');

UPDATE listings
SET offer_type = CASE 
    WHEN offer_type = 'Angebote' THEN 'Satılık'
    WHEN offer_type = 'Gesuche' THEN 'Aranıyor'
    ELSE offer_type
END
WHERE sub_category IN ('Erkek Giyimi', 'Herrenbekleidung') AND offer_type IN ('Angebote', 'Gesuche');

UPDATE listings
SET seller_type = CASE 
    WHEN seller_type = 'Privatnutzer' THEN 'Bireysel'
    WHEN seller_type = 'Privat' THEN 'Bireysel'
    WHEN seller_type = 'Gewerblich' THEN 'Kurumsal'
    ELSE seller_type
END
WHERE sub_category IN ('Erkek Giyimi', 'Herrenbekleidung') AND seller_type IN ('Privatnutzer', 'Privat', 'Gewerblich');

-- Colors
UPDATE listings
SET herrenbekleidung_color = CASE 
    WHEN herrenbekleidung_color = 'Beige' THEN 'Bej'
    WHEN herrenbekleidung_color = 'Blau' THEN 'Mavi'
    WHEN herrenbekleidung_color = 'Braun' THEN 'Kahverengi'
    WHEN herrenbekleidung_color = 'Bunt' THEN 'Renkli'
    WHEN herrenbekleidung_color = 'Creme' THEN 'Krem'
    WHEN herrenbekleidung_color = 'Gelb' THEN 'Sarı'
    WHEN herrenbekleidung_color = 'Gold' THEN 'Altın'
    WHEN herrenbekleidung_color = 'Grau' THEN 'Gri'
    WHEN herrenbekleidung_color = 'Grün' THEN 'Yeşil'
    WHEN herrenbekleidung_color = 'Khaki' THEN 'Haki'
    WHEN herrenbekleidung_color = 'Lavendel' THEN 'Lavanta'
    WHEN herrenbekleidung_color = 'Lila' THEN 'Mor'
    WHEN herrenbekleidung_color = 'Orange' THEN 'Turuncu'
    WHEN herrenbekleidung_color = 'Pink' THEN 'Pembe'
    WHEN herrenbekleidung_color = 'Print' THEN 'Desenli'
    WHEN herrenbekleidung_color = 'Rot' THEN 'Kırmızı'
    WHEN herrenbekleidung_color = 'Schwarz' THEN 'Siyah'
    WHEN herrenbekleidung_color = 'Silber' THEN 'Gümüş'
    WHEN herrenbekleidung_color = 'Türkis' THEN 'Turkuaz'
    WHEN herrenbekleidung_color = 'Weiß' THEN 'Beyaz'
    WHEN herrenbekleidung_color = 'Andere Farben' THEN 'Diğer Renkler'
    ELSE herrenbekleidung_color
END
WHERE sub_category IN ('Erkek Giyimi', 'Herrenbekleidung');
