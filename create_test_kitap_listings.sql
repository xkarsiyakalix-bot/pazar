-- Create a test listing for Kitap & Dergi to verify the filter works
INSERT INTO listings (
    title,
    description,
    price,
    category,
    sub_category,
    buecher_zeitschriften_art,
    city,
    federal_state,
    status,
    user_id,
    offer_type,
    seller_type,
    versand_art,
    condition
) VALUES (
    'Test Kitap - Polisiye Roman',
    'Bu bir test ilanıdır. Tür filtresi çalışıyor mu kontrol için.',
    25.00,
    'Müzik, Film & Kitap',
    'Kitap & Dergi',
    'Krimis & Thriller',
    'Berlin',
    'Berlin',
    'active',
    (SELECT id FROM auth.users LIMIT 1),
    'Angebote',
    'Privatnutzer',
    'Versand möglich',
    'gut'
),
(
    'Test Kitap - Çocuk Kitabı',
    'İkinci test ilanı - farklı tür.',
    15.00,
    'Müzik, Film & Kitap',
    'Kitap & Dergi',
    'Kinderbücher',
    'München',
    'Bayern',
    'active',
    (SELECT id FROM auth.users LIMIT 1),
    'Angebote',
    'Privatnutzer',
    'Nur Abholung',
    'sehr_gut'
),
(
    'Test Kitap - Bilim Kurgu',
    'Üçüncü test ilanı.',
    30.00,
    'Müzik, Film & Kitap',
    'Kitap & Dergi',
    'Science Fiction',
    'Hamburg',
    'Hamburg',
    'active',
    (SELECT id FROM auth.users LIMIT 1),
    'Angebote',
    'Privatnutzer',
    'Versand möglich',
    'neu'
);

-- Verify the test listings were created
SELECT 
    id,
    title,
    category,
    sub_category,
    buecher_zeitschriften_art,
    created_at
FROM listings
WHERE category = 'Müzik, Film & Kitap'
  AND sub_category = 'Kitap & Dergi'
ORDER BY created_at DESC
LIMIT 10;
