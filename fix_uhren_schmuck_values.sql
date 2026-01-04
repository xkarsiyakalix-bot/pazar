-- Fix German values in Saat & Takı (Uhren & Schmuck) category
UPDATE listings
SET uhren_schmuck_art = CASE
    WHEN uhren_schmuck_art = 'Schmuck' THEN 'Takı'
    WHEN uhren_schmuck_art = 'Uhren' THEN 'Saat'
    WHEN uhren_schmuck_art = 'Weiteres' THEN 'Diğer'
    ELSE uhren_schmuck_art
END
WHERE category = 'Moda & Güzellik' 
  AND sub_category = 'Saat & Takı'
  AND uhren_schmuck_art IN ('Schmuck', 'Uhren', 'Weiteres');
