-- Update car listing values from Turkish to German to match AutosPage.js filter configuration

-- Update Fuel Types
UPDATE listings
SET kraftstoff = CASE
    WHEN kraftstoff = 'Dizel' THEN 'Diesel'
    WHEN kraftstoff = 'Benzin' THEN 'Benzin'
    WHEN kraftstoff = 'Elektrik' THEN 'Elektro'
    WHEN kraftstoff = 'Hibrit' THEN 'Hybrid'
    WHEN kraftstoff = 'Otogaz (LPG)' THEN 'Autogas (LPG)'
    WHEN kraftstoff = 'Doğalgaz (CNG)' THEN 'Erdgas (CNG)'
    WHEN kraftstoff = 'Diğer' THEN 'Andere Kraftstoffarten'
    ELSE kraftstoff
END
WHERE category = 'Otomobil, Bisiklet & Tekne' AND sub_category = 'Otomobiller';

-- Update Transmission
UPDATE listings
SET getriebe = CASE
    WHEN getriebe = 'Manuel' THEN 'Manuell'
    WHEN getriebe = 'Otomatik' THEN 'Automatik'
    ELSE getriebe
END
WHERE category = 'Otomobil, Bisiklet & Tekne' AND sub_category = 'Otomobiller';

-- Update Vehicle Types
UPDATE listings
SET fahrzeugtyp = CASE
    WHEN fahrzeugtyp = 'Küçük Araç' THEN 'Kleinwagen'
    WHEN fahrzeugtyp = 'Sedan' THEN 'Limousine'
    WHEN fahrzeugtyp = 'Station Wagon' THEN 'Kombi'
    WHEN fahrzeugtyp = 'Cabrio' THEN 'Cabrio'
    WHEN fahrzeugtyp = 'SUV/Arazi Aracı' THEN 'SUV/Geländewagen'
    WHEN fahrzeugtyp = 'Minivan/Panelvan' THEN 'Van/Bus'
    WHEN fahrzeugtyp = 'Kupe' THEN 'Coupé'
    WHEN fahrzeugtyp = 'Diğer' THEN 'Andere Fahrzeugtypen'
    ELSE fahrzeugtyp
END
WHERE category = 'Otomobil, Bisiklet & Tekne' AND sub_category = 'Otomobiller';

-- Update Exterior Colors
UPDATE listings
SET exterior_color = CASE
    WHEN exterior_color = 'Siyah' THEN 'Schwarz'
    WHEN exterior_color = 'Beyaz' THEN 'Weiß'
    WHEN exterior_color = 'Gri' THEN 'Grau'
    WHEN exterior_color = 'Gümüş' THEN 'Silber'
    WHEN exterior_color = 'Mavi' THEN 'Blau'
    WHEN exterior_color = 'Kırmızı' THEN 'Rot'
    WHEN exterior_color = 'Yeşil' THEN 'Grün'
    WHEN exterior_color = 'Kahverengi' THEN 'Braun'
    WHEN exterior_color = 'Bej' THEN 'Beige'
    WHEN exterior_color = 'Sarı' THEN 'Gelb'
    WHEN exterior_color = 'Turuncu' THEN 'Orange'
    WHEN exterior_color = 'Altın' THEN 'Gold'
    WHEN exterior_color = 'Mor' THEN 'Violet'
    WHEN exterior_color = 'Diğer' THEN 'Andere Farben'
    ELSE exterior_color
END
WHERE category = 'Otomobil, Bisiklet & Tekne' AND sub_category = 'Otomobiller';

-- Update Interior Materials
UPDATE listings
SET interior_material = CASE
    WHEN interior_material = 'Tam Deri' THEN 'Vollleder'
    WHEN interior_material = 'Yarı Deri' THEN 'Teilleder'
    WHEN interior_material = 'Kumaş' THEN 'Stoff'
    WHEN interior_material = 'Kadife' THEN 'Velours'
    WHEN interior_material = 'Alcantara' THEN 'Alcantara'
    WHEN interior_material = 'Diğer' THEN 'Andere Materialien Innenausstattung'
    ELSE interior_material
END
WHERE category = 'Otomobil, Bisiklet & Tekne' AND sub_category = 'Otomobiller';
