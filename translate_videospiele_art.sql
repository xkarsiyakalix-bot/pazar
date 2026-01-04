-- Fix Video Oyunları Filter Values

-- Translate Filter Values (videospiele_art) to Turkish
UPDATE listings
SET videospiele_art = CASE
    WHEN videospiele_art = 'DS(i)- & PSP Spiele' THEN 'DS(i) & PSP Oyunları'
    WHEN videospiele_art = 'Nintendo Spiele' THEN 'Nintendo Oyunları'
    WHEN videospiele_art = 'PlayStation Spiele' THEN 'PlayStation Oyunları'
    WHEN videospiele_art = 'Xbox Spiele' THEN 'Xbox Oyunları'
    WHEN videospiele_art = 'Wii Spiele' THEN 'Wii Oyunları'
    WHEN videospiele_art = 'PC Spiele' THEN 'PC Oyunları'
    WHEN videospiele_art = 'Weitere Videospiele' THEN 'Diğer Video Oyunları'
    ELSE videospiele_art
END
WHERE category = 'Elektronik'
  AND sub_category = 'Video Oyunları'
  AND videospiele_art IN (
    'DS(i)- & PSP Spiele', 'Nintendo Spiele', 'PlayStation Spiele', 
    'Xbox Spiele', 'Wii Spiele', 'PC Spiele', 'Weitere Videospiele'
  );

-- Verify updates
SELECT videospiele_art, COUNT(*)
FROM listings
WHERE category = 'Elektronik' AND sub_category = 'Video Oyunları'
GROUP BY videospiele_art;
