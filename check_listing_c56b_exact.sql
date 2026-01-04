-- Check exact value of working_time and gastronomie_tourismus_art
SELECT 
    id,
    working_time,
    length(working_time) as wt_len,
    gastronomie_tourismus_art,
    length(gastronomie_tourismus_art) as gta_len
FROM listings
WHERE id = 'c56b2917-49bc-4e0e-8bdc-9ee6dfa277c0';
