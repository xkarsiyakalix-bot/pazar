-- Insert a sample luxury motorcycle listing
INSERT INTO listings (
    title,
    description,
    price,
    -- currency removed as it doesn't exist
    category,
    sub_category,
    images,
    status,
    created_at,
    user_id,
    
    -- Specific fields
    motorrad_art,
    marke,
    kilometerstand,
    erstzulassung,
    hubraum,
    getriebe,
    offer_type,
    federal_state,
    postal_code
) VALUES (
    'Ducati Panigale V4 S - Neuwertig',
    'Verkaufe meine wunderschöne Ducati Panigale V4 S. Das Motorrad ist in einem absoluten Traumzustand, scheckheftgepflegt und hat keine Kratzer. Nur bei schönem Wetter gefahren. Ein echtes Sammlerstück für Liebhaber italienischer Designkunst und purer Leistung.',
    28500,
    -- 'EUR' removed
    'Auto, Rad & Boot',
    'Motorräder & Motorroller',
    ARRAY['/luxury_motorcycle.png'],
    'active',
    NOW(),
    (SELECT id FROM auth.users LIMIT 1), -- Assign to the first available user
    
    'Motorräder',
    'Ducati',
    3500,
    2023,
    1103,
    'Manuell',
    'Angebote',
    'Bayern',
    '80331'
);
