-- Fix 'Güzellik & Sağlık' type values
-- Translates German values to Turkish in beauty_gesundheit_art column

-- Make-Up & Gesichtspflege -> Makyaj & Cilt Bakımı
UPDATE listings
SET beauty_gesundheit_art = 'Makyaj & Cilt Bakımı'
WHERE beauty_gesundheit_art = 'Make-Up & Gesichtspflege';

-- Haarpflege -> Saç Bakımı
UPDATE listings
SET beauty_gesundheit_art = 'Saç Bakımı'
WHERE beauty_gesundheit_art = 'Haarpflege';

-- Körperpflege -> Vücut Bakımı
UPDATE listings
SET beauty_gesundheit_art = 'Vücut Bakımı'
WHERE beauty_gesundheit_art = 'Körperpflege';

-- Hand- & Nagelpflege -> El & Tırnak Bakımı
UPDATE listings
SET beauty_gesundheit_art = 'El & Tırnak Bakımı'
WHERE beauty_gesundheit_art = 'Hand- & Nagelpflege';

-- Gesundheit -> Sağlık
UPDATE listings
SET beauty_gesundheit_art = 'Sağlık'
WHERE beauty_gesundheit_art = 'Gesundheit';

-- Weiteres Beauty & Gesundheit -> Diğer Güzellik & Sağlık
UPDATE listings
SET beauty_gesundheit_art = 'Diğer Güzellik & Sağlık'
WHERE beauty_gesundheit_art = 'Weiteres Beauty & Gesundheit';
