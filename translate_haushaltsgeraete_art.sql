-- Translate Ev Aletleri "Tür" values to standardized Turkish Plural forms
-- This ensures the type field displays correctly on both category and detail pages

-- First, check current values
SELECT DISTINCT haushaltsgeraete_art, COUNT(*) as count
FROM listings
WHERE category = 'Elektronik' 
  AND sub_category IN ('Ev Aletleri', 'Beyaz Eşya & Ev Aletleri', 'Haushaltsgeräte')
  AND haushaltsgeraete_art IS NOT NULL
GROUP BY haushaltsgeraete_art;

-- Update values to standardized Turkish Plural
UPDATE listings
SET haushaltsgeraete_art = CASE
    -- German to Turkish
    WHEN haushaltsgeraete_art = 'Haushaltskleingeräte' THEN 'Küçük Ev Aletleri'
    WHEN haushaltsgeraete_art = 'Herde & Backöfen' THEN 'Ocak & Fırınlar'
    WHEN haushaltsgeraete_art = 'Kaffee- & Espressomaschinen' THEN 'Kahve & Espresso Makineleri'
    WHEN haushaltsgeraete_art = 'Kühlschränke & Gefriergeräte' THEN 'Buzdolapları & Dondurucular'
    WHEN haushaltsgeraete_art = 'Spülmaschinen' THEN 'Bulaşık Makineleri'
    WHEN haushaltsgeraete_art = 'Staubsauger' THEN 'Elektrikli Süpürgeler'
    WHEN haushaltsgeraete_art = 'Waschmaschinen & Trockner' THEN 'Çamaşır & Kurutma Makineleri'
    WHEN haushaltsgeraete_art = 'Weitere Haushaltsgeräte' THEN 'Diğer Ev Aletleri'
    
    -- Turkish Singular to Plural (Correction)
    WHEN haushaltsgeraete_art = 'Ocak & Fırın' THEN 'Ocak & Fırınlar'
    WHEN haushaltsgeraete_art = 'Buzdolabı & Dondurucu' THEN 'Buzdolapları & Dondurucular'
    WHEN haushaltsgeraete_art = 'Elektrikli Süpürge' THEN 'Elektrikli Süpürgeler'
    
    ELSE haushaltsgeraete_art
END
WHERE category = 'Elektronik'
  AND sub_category IN ('Ev Aletleri', 'Beyaz Eşya & Ev Aletleri', 'Haushaltsgeräte')
  AND haushaltsgeraete_art IN (
    'Haushaltskleingeräte', 'Herde & Backöfen', 'Kaffee- & Espressomaschinen', 
    'Kühlschränke & Gefriergeräte', 'Spülmaschinen', 'Staubsauger', 
    'Waschmaschinen & Trockner', 'Weitere Haushaltsgeräte',
    'Ocak & Fırın', 'Buzdolabı & Dondurucu', 'Elektrikli Süpürge'
  );

-- Verify the update
SELECT DISTINCT haushaltsgeraete_art, COUNT(*) as count
FROM listings
WHERE category = 'Elektronik' 
  AND sub_category IN ('Ev Aletleri', 'Beyaz Eşya & Ev Aletleri', 'Haushaltsgeräte')
  AND haushaltsgeraete_art IS NOT NULL
GROUP BY haushaltsgeraete_art;
