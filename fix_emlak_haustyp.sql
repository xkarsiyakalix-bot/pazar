-- Normalize "Haustyp" (Ev Tipi) for Kiralık & Satılık Evler

-- Expected German values:
-- 'Einfamilienhaus freistehend' (Bağımsız Müstakil Ev)
-- 'Reihenhaus' (Sıra Ev)
-- 'Mehrfamilienhaus' (Apartman)
-- 'Bungalow' (Bungalow)
-- 'Bauernhaus' (Çiftlik Evi)
-- 'Doppelhaushälfte' (İkiz Villa)
-- 'Villa' (Villa)
-- 'Andere Haustypen' (Diğer Ev Tipleri)

-- Apply to both Kiralık and Satılık subcategories
-- Subcategories: 'Kiralık Müstakil Ev', 'Satılık Müstakil Ev'

-- 'Bağımsız Müstakil Ev' -> 'Einfamilienhaus freistehend'
UPDATE listings
SET haustyp = 'Einfamilienhaus freistehend'
WHERE sub_category IN ('Kiralık Müstakil Ev', 'Satılık Müstakil Ev')
  AND (haustyp IN ('Bağımsız Müstakil Ev', 'Müstakil Ev', 'Detached House') OR haustyp ILIKE '%Bağımsız%');

-- 'Sıra Ev' -> 'Reihenhaus'
UPDATE listings
SET haustyp = 'Reihenhaus'
WHERE sub_category IN ('Kiralık Müstakil Ev', 'Satılık Müstakil Ev')
  AND (haustyp IN ('Sıra Ev', 'Sıralı Ev', 'Row House') OR haustyp ILIKE '%Sıra%');

-- 'Apartman' -> 'Mehrfamilienhaus'
UPDATE listings
SET haustyp = 'Mehrfamilienhaus'
WHERE sub_category IN ('Kiralık Müstakil Ev', 'Satılık Müstakil Ev')
  AND (haustyp IN ('Apartman', 'Apartman Dairesi', 'Apartment Building') OR haustyp ILIKE '%Apartman%');

-- 'Bungalow' -> 'Bungalow' (Just in case of case mismatches)
UPDATE listings
SET haustyp = 'Bungalow'
WHERE sub_category IN ('Kiralık Müstakil Ev', 'Satılık Müstakil Ev')
  AND haustyp ILIKE 'Bungalow';

-- 'Çiftlik Evi' -> 'Bauernhaus'
UPDATE listings
SET haustyp = 'Bauernhaus'
WHERE sub_category IN ('Kiralık Müstakil Ev', 'Satılık Müstakil Ev')
  AND (haustyp IN ('Çiftlik Evi', 'Farmhouse') OR haustyp ILIKE '%Çiftlik%');

-- 'İkiz Villa' -> 'Doppelhaushälfte'
UPDATE listings
SET haustyp = 'Doppelhaushälfte'
WHERE sub_category IN ('Kiralık Müstakil Ev', 'Satılık Müstakil Ev')
  AND (haustyp IN ('İkiz Villa', 'İkiz Ev', 'Semi-detached') OR haustyp ILIKE '%İkiz%');

-- 'Villa' -> 'Villa' (Just in case)
UPDATE listings
SET haustyp = 'Villa'
WHERE sub_category IN ('Kiralık Müstakil Ev', 'Satılık Müstakil Ev')
  AND haustyp ILIKE 'Villa';

-- 'Diğer Ev Tipleri' -> 'Andere Haustypen'
UPDATE listings
SET haustyp = 'Andere Haustypen'
WHERE sub_category IN ('Kiralık Müstakil Ev', 'Satılık Müstakil Ev')
  AND (haustyp IN ('Diğer Ev Tipleri', 'Diğer', 'Other') OR haustyp ILIKE '%Diğer%');

-- Verify
SELECT sub_category, haustyp, count(*)
FROM listings
WHERE sub_category IN ('Kiralık Müstakil Ev', 'Satılık Müstakil Ev')
GROUP BY sub_category, haustyp;
