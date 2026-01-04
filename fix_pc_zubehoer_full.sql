-- Fix Bilgisayar Aksesuarları & Yazılım Subcategory and Filter Values

-- 1. Standardize Subcategory Name
-- Standardize to "Bilgisayar Aksesuarları & Yazılım" (Plural "Aksesuarları")
UPDATE listings
SET sub_category = 'Bilgisayar Aksesuarları & Yazılım'
WHERE category = 'Elektronik'
  AND (
    sub_category = 'Bilgisayar Aksesuar & Yazılım' OR
    sub_category = 'PC-Zubehör & Software' OR
    sub_category ILIKE '%pc%zubehör%' OR
    sub_category ILIKE '%yazılım%'
  )
  AND sub_category != 'Bilgisayar Aksesuarları & Yazılım';

-- 2. Translate Filter Values (pc_zubehoer_software_art) to Turkish
UPDATE listings
SET pc_zubehoer_software_art = CASE
    WHEN pc_zubehoer_software_art = 'Drucker & Scanner' THEN 'Yazıcı & Tarayıcılar'
    WHEN pc_zubehoer_software_art = 'Festplatten & Laufwerke' THEN 'Sabit Sürücüler & Optik Sürücüler'
    WHEN pc_zubehoer_software_art = 'Gehäuse' THEN 'Kasa'
    WHEN pc_zubehoer_software_art = 'Grafikkarten' THEN 'Ekran Kartları'
    WHEN pc_zubehoer_software_art = 'Kabel & Adapter' THEN 'Kablolar & Adaptörler'
    WHEN pc_zubehoer_software_art = 'Mainboards' THEN 'Anakartlar'
    WHEN pc_zubehoer_software_art = 'Monitore' THEN 'Monitörler'
    WHEN pc_zubehoer_software_art = 'Multimedia' THEN 'Multimedya'
    WHEN pc_zubehoer_software_art = 'Netzwerk & Modem' THEN 'Ağ & Modem'
    WHEN pc_zubehoer_software_art = 'Prozessoren / CPUs' THEN 'İşlemciler / CPU'
    WHEN pc_zubehoer_software_art = 'Speicher' THEN 'Bellek'
    WHEN pc_zubehoer_software_art = 'Software' THEN 'Yazılım'
    WHEN pc_zubehoer_software_art = 'Tastatur & Maus' THEN 'Klavye & Fare'
    WHEN pc_zubehoer_software_art = 'Weiteres PC-Zubehör' THEN 'Diğer Bilgisayar Aksesuarları'

    -- Fix casing / pluralization for existing Turkish values if needed
    WHEN pc_zubehoer_software_art = 'Yazıcı & Tarayıcı' THEN 'Yazıcı & Tarayıcılar'
    WHEN pc_zubehoer_software_art = 'Kablo & Adaptör' THEN 'Kablolar & Adaptörler'
    WHEN pc_zubehoer_software_art = 'Diğer PC Aksesuarları' THEN 'Diğer Bilgisayar Aksesuarları'
    
    ELSE pc_zubehoer_software_art
END
WHERE category = 'Elektronik'
  AND sub_category = 'Bilgisayar Aksesuarları & Yazılım'
  AND pc_zubehoer_software_art IN (
    'Drucker & Scanner', 'Festplatten & Laufwerke', 'Gehäuse', 'Grafikkarten',
    'Kabel & Adapter', 'Mainboards', 'Monitore', 'Multimedia', 'Netzwerk & Modem',
    'Prozessoren / CPUs', 'Speicher', 'Software', 'Tastatur & Maus', 'Weiteres PC-Zubehör',
    'Yazıcı & Tarayıcı', 'Kablo & Adaptör', 'Diğer PC Aksesuarları'
  );

-- Verify updates
SELECT sub_category, COUNT(*) 
FROM listings 
WHERE category = 'Elektronik' AND sub_category = 'Bilgisayar Aksesuarları & Yazılım'
GROUP BY sub_category;

SELECT pc_zubehoer_software_art, COUNT(*)
FROM listings
WHERE category = 'Elektronik' AND sub_category = 'Bilgisayar Aksesuarları & Yazılım'
GROUP BY pc_zubehoer_software_art;
