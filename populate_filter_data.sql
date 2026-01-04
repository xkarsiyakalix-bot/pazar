-- Populate federal_state based on postal_code for German listings
-- This uses approximate ranges for the first 1 or 2 digits

UPDATE listings
SET federal_state = CASE
    -- 0xxxx - Sachsen / Brandenburg / Thüringen
    WHEN postal_code LIKE '01%' OR postal_code LIKE '02%' OR postal_code LIKE '03%' THEN 'Sachsen'
    WHEN postal_code LIKE '04%' OR postal_code LIKE '05%' OR postal_code LIKE '06%' OR postal_code LIKE '07%' OR postal_code LIKE '08%' OR postal_code LIKE '09%' THEN 'Sachsen'
    
    -- 1xxxx - Berlin / Brandenburg / MV
    WHEN postal_code LIKE '10%' OR postal_code LIKE '12%' OR postal_code LIKE '13%' OR postal_code LIKE '14%' THEN 'Berlin'
    WHEN postal_code LIKE '15%' OR postal_code LIKE '16%' OR postal_code LIKE '17%' OR postal_code LIKE '18%' OR postal_code LIKE '19%' THEN 'Brandenburg'
    
    -- 2xxxx - Hamburg / SH / Niedersachsen / Bremen
    WHEN postal_code LIKE '20%' OR postal_code LIKE '21%' OR postal_code LIKE '22%' THEN 'Hamburg'
    WHEN postal_code LIKE '23%' OR postal_code LIKE '24%' OR postal_code LIKE '25%' THEN 'Schleswig-Holstein'
    WHEN postal_code LIKE '26%' OR postal_code LIKE '27%' OR postal_code LIKE '28%' THEN 'Niedersachsen'
    WHEN postal_code LIKE '29%' THEN 'Niedersachsen'

    -- 3xxxx - Niedersachsen / Hessen / NRW / Sachsen-Anhalt
    WHEN postal_code LIKE '30%' OR postal_code LIKE '31%' OR postal_code LIKE '32%' OR postal_code LIKE '33%' OR postal_code LIKE '34%' THEN 'Niedersachsen'
    WHEN postal_code LIKE '35%' OR postal_code LIKE '36%' THEN 'Hessen'
    WHEN postal_code LIKE '37%' OR postal_code LIKE '38%' OR postal_code LIKE '39%' THEN 'Sachsen-Anhalt'

    -- 4xxxx - NRW / Niedersachsen
    WHEN postal_code LIKE '4%' THEN 'Nordrhein-Westfalen'

    -- 5xxxx - NRW / RLP
    WHEN postal_code LIKE '50%' OR postal_code LIKE '51%' OR postal_code LIKE '52%' OR postal_code LIKE '53%' OR postal_code LIKE '57%' OR postal_code LIKE '58%' OR postal_code LIKE '59%' THEN 'Nordrhein-Westfalen'
    WHEN postal_code LIKE '54%' OR postal_code LIKE '55%' OR postal_code LIKE '56%' THEN 'Rheinland-Pfalz'

    -- 6xxxx - Hessen / RLP / Saarland / BW
    WHEN postal_code LIKE '60%' OR postal_code LIKE '61%' OR postal_code LIKE '63%' OR postal_code LIKE '64%' OR postal_code LIKE '65%' THEN 'Hessen'
    WHEN postal_code LIKE '66%' THEN 'Saarland'
    WHEN postal_code LIKE '67%' OR postal_code LIKE '68%' OR postal_code LIKE '69%' THEN 'Rheinland-Pfalz'

    -- 7xxxx - BW
    WHEN postal_code LIKE '7%' THEN 'Baden-Württemberg'

    -- 8xxxx - Bayern / BW
    WHEN postal_code LIKE '8%' THEN 'Bayern'

    -- 9xxxx - Bayern / Thüringen
    WHEN postal_code LIKE '90%' OR postal_code LIKE '91%' OR postal_code LIKE '92%' OR postal_code LIKE '93%' OR postal_code LIKE '94%' OR postal_code LIKE '95%' OR postal_code LIKE '96%' THEN 'Bayern'
    WHEN postal_code LIKE '97%' OR postal_code LIKE '98%' OR postal_code LIKE '99%' THEN 'Thüringen'
    
    ELSE 'Berlin' -- Default fallback if unknown
END
WHERE federal_state IS NULL AND postal_code IS NOT NULL;


-- Populate boote_art for listings in 'Boote & Bootszubehör'
UPDATE listings
SET boote_art = CASE
    WHEN title ILIKE '%Motorboot%' OR title ILIKE '%Sportboot%' OR title ILIKE '%Cruiser%' OR title ILIKE '%Yacht%' THEN 'Motorboote'
    WHEN title ILIKE '%Segel%' OR title ILIKE '%Jolle%' OR title ILIKE '%Katamaran%' THEN 'Segelboote'
    WHEN title ILIKE '%Schlauch%' OR title ILIKE '%Zodiac%' OR title ILIKE '%Dinghy%' THEN 'Schlauchboote'
    WHEN title ILIKE '%Kanu%' OR title ILIKE '%Kajak%' OR title ILIKE '%Ruder%' OR title ILIKE '%Paddle%' THEN 'Kleinboote'
    WHEN title ILIKE '%Jet%' OR title ILIKE '%Ski%' OR title ILIKE '%Seadoo%' THEN 'Jetski'
    WHEN title ILIKE '%Trailer%' OR title ILIKE '%Anhänger%' THEN 'Bootstrailer'
    WHEN title ILIKE '%Motor%' OR title ILIKE '%Propeller%' OR title ILIKE '%Anker%' OR title ILIKE '%Fender%' OR title ILIKE '%Zubehör%' OR title ILIKE '%Teile%' THEN 'Bootszubehör'
    ELSE 'Weitere Boote'
END
WHERE category = 'Auto, Rad & Boot' 
  AND sub_category = 'Boote & Bootszubehör'
  AND boote_art IS NULL;

-- Default for offer_type
UPDATE listings
SET offer_type = 'Angebote'
WHERE offer_type IS NULL;
