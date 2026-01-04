
-- Normalize Main Categories to Turkish
UPDATE listings SET category = 'Eğitim & Kurslar' WHERE category IN ('Unterricht & Kurse', 'Eğitim ve Kurslar', 'Dersler & Kurslar');
UPDATE listings SET category = 'Komşu Yardımı' WHERE category IN ('Nachbarschaftshilfe');
UPDATE listings SET category = 'Ücretsiz & Takas' WHERE category IN ('Zu verschenken & Tauschen', 'Ücretsiz ve Takas');
UPDATE listings SET category = 'Hizmetler' WHERE category IN ('Dienstleistungen');
UPDATE listings SET category = 'Biletler' WHERE category IN ('Eintrittskarten & Tickets');
UPDATE listings SET category = 'Müzik, Film & Kitap' WHERE category IN ('Musik, Filme & Bücher', 'Musik, Film & Bücher', 'Müzik, Film ve Kitap');
UPDATE listings SET category = 'Eğlence, Hobi & Mahalle' WHERE category IN ('Freizeit, Hobby & Nachbarschaft', 'Eğlence, Hobi ve Mahalle', 'Hobiler & Komşuluk');
UPDATE listings SET category = 'İş İlanları' WHERE category IN ('Jobs');
UPDATE listings SET category = 'Aile, Çocuk & Bebek' WHERE category IN ('Familie, Kind & Baby', 'Aile, Çocuk ve Bebek');
UPDATE listings SET category = 'Evcil Hayvanlar' WHERE category IN ('Haustiere');
UPDATE listings SET category = 'Moda & Güzellik' WHERE category IN ('Mode & Beauty', 'Moda ve Güzellik');
UPDATE listings SET category = 'Ev & Bahçe' WHERE category IN ('Haus & Garten', 'Ev ve Bahçe');
UPDATE listings SET category = 'Emlak' WHERE category IN ('Immobilien');
UPDATE listings SET category = 'Otomobil, Bisiklet & Tekne' WHERE category IN ('Auto, Rad & Boot', 'Otomobil, Bisiklet ve Tekne');

-- Normalize Subcategories (Education / Eğitim)
UPDATE listings SET sub_category = 'Bilgisayar Kursları' WHERE sub_category IN ('Computerkurse');
UPDATE listings SET sub_category = 'Ezoterizm & Spiritüalizm' WHERE sub_category IN ('Esoterik & Spirituelles');
UPDATE listings SET sub_category = 'Yemek & Pastacılık' WHERE sub_category IN ('Kochen & Backen');
UPDATE listings SET sub_category = 'Sanat & Tasarım' WHERE sub_category IN ('Kunst & Gestaltung');
UPDATE listings SET sub_category = 'Müzik & Şan' WHERE sub_category IN ('Musik & Gesang');
UPDATE listings SET sub_category = 'Özel Ders' WHERE sub_category IN ('Nachhilfe');
UPDATE listings SET sub_category = 'Spor Kursları' WHERE sub_category IN ('Sportkurse');
UPDATE listings SET sub_category = 'Dil Kursları' WHERE sub_category IN ('Sprachkurse');
UPDATE listings SET sub_category = 'Dans Kursları' WHERE sub_category IN ('Tanzkurse');
UPDATE listings SET sub_category = 'Sürekli Eğitim' WHERE sub_category IN ('Weiterbildung');
UPDATE listings SET sub_category = 'Diğer Eğitim & Kurslar' WHERE sub_category IN ('Weitere Unterricht & Kurse', 'Sonstige Unterricht & Kurse');

-- Normalize Subcategories (Pets / Evcil Hayvanlar)
UPDATE listings SET sub_category = 'Balıklar' WHERE sub_category IN ('Fische', 'Balık');
UPDATE listings SET sub_category = 'Köpekler' WHERE sub_category IN ('Hunde', 'Köpek');
UPDATE listings SET sub_category = 'Kediler' WHERE sub_category IN ('Katzen', 'Kedi');
UPDATE listings SET sub_category = 'Küçük Hayvanlar' WHERE sub_category IN ('Kleintiere', 'Küçükbaş Hayvanlar');
UPDATE listings SET sub_category = 'Çiftlik Hayvanları' WHERE sub_category IN ('Nutztiere', 'Kümes Hayvanları');
UPDATE listings SET sub_category = 'Atlar' WHERE sub_category IN ('Pferde', 'At');
UPDATE listings SET sub_category = 'Kuşlar' WHERE sub_category IN ('Vögel', 'Kuş');
UPDATE listings SET sub_category = 'Aksesuarlar' WHERE sub_category IN ('Zubehör', 'Hayvan Aksesuarları');
UPDATE listings SET sub_category = 'Hayvan Bakımı & Eğitimi' WHERE sub_category IN ('Tierbetreuung & Training');
UPDATE listings SET sub_category = 'Kayıp Hayvanlar' WHERE sub_category IN ('Vermisste Tiere');

-- Normalize Subcategories (Electronics / Elektronik)
UPDATE listings SET sub_category = 'Cep Telefonu & Telefon' WHERE sub_category IN ('Handy & Telefon');
UPDATE listings SET sub_category = 'Bilgisayar Aksesuarları & Yazılım' WHERE sub_category IN ('PC-Zubehör & Software');
UPDATE listings SET sub_category = 'Dizüstü Bilgisayarlar' WHERE sub_category IN ('Notebooks');
UPDATE listings SET sub_category = 'Bilgisayarlar' WHERE sub_category IN ('PCs');
UPDATE listings SET sub_category = 'Video Oyunları' WHERE sub_category IN ('Videospiele');

-- Normalize Subcategories (Real Estate / Emlak)
UPDATE listings SET sub_category = 'Kiralık Daireler' WHERE sub_category IN ('Mietwohnungen');
UPDATE listings SET sub_category = 'Satılık Daireler' WHERE sub_category IN ('Eigentumswohnungen');
UPDATE listings SET sub_category = 'Kiralık Evler' WHERE sub_category IN ('Häuser zur Miete');
UPDATE listings SET sub_category = 'Satılık Evler' WHERE sub_category IN ('Häuser zum Kauf');
