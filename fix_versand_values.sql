UPDATE listings
SET versand_art = 'Kargo Mümkün'
WHERE versand_art = 'Versand möglich';

UPDATE listings
SET versand_art = 'Sadece Elden Teslim'
WHERE versand_art = 'Nur Abholung';
