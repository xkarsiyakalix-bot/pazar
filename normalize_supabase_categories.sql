-- Normalize ALL category and subcategory names in Supabase tables to Turkish
-- This updates the categories and subcategories tables themselves, not just listings

-- ============================================
-- PART 1: Update Categories Table
-- ============================================

-- Update category names to Turkish (they are already Turkish, but ensuring consistency)
-- Update slugs to Turkish-based slugs

UPDATE categories SET slug = 'Otomobil-Bisiklet-Tekne' WHERE name = 'Otomobil, Bisiklet & Tekne';
UPDATE categories SET slug = 'Emlak' WHERE name = 'Emlak';
UPDATE categories SET slug = 'Ev-Bahce' WHERE name = 'Ev & Bahçe';
UPDATE categories SET slug = 'Moda-Guzellik' WHERE name = 'Moda & Güzellik';
UPDATE categories SET slug = 'Elektronik' WHERE name = 'Elektronik';
UPDATE categories SET slug = 'Evcil-Hayvanlar' WHERE name = 'Evcil Hayvanlar';
UPDATE categories SET slug = 'Aile-Cocuk-Bebek' WHERE name = 'Aile, Çocuk & Bebek';
UPDATE categories SET slug = 'Is-Ilanlari' WHERE name = 'İş İlanları';
UPDATE categories SET slug = 'Eglence-Hobi-Mahalle' WHERE name = 'Eğlence, Hobi & Mahalle';
UPDATE categories SET slug = 'Muzik-Film-Kitap' WHERE name = 'Müzik, Film & Kitap';
UPDATE categories SET slug = 'Biletler' WHERE name = 'Biletler';
UPDATE categories SET slug = 'Hizmetler' WHERE name = 'Hizmetler';
UPDATE categories SET slug = 'Ucretsiz-Takas' WHERE name = 'Ücretsiz & Takas';
UPDATE categories SET slug = 'Komsu-Yardimi' WHERE name = 'Komşu Yardımı';

-- ============================================
-- PART 2: Update Subcategories Table Names to Turkish
-- ============================================

-- Auto, Rad & Boot -> Otomobil, Bisiklet & Tekne
UPDATE subcategories SET name = 'Otomobiller' WHERE name = 'Autos';
UPDATE subcategories SET name = 'Oto Parça & Lastik' WHERE name = 'Autoteile & Reifen';
UPDATE subcategories SET name = 'Tekne & Tekne Malzemeleri' WHERE name = 'Boote & Bootszubehör';
UPDATE subcategories SET name = 'Bisiklet & Aksesuarlar' WHERE name = 'Fahrräder & Zubehör';
UPDATE subcategories SET name = 'Motosiklet & Scooter' WHERE name = 'Motorräder & Motorroller';
UPDATE subcategories SET name = 'Motosiklet Parça & Aksesuarlar' WHERE name = 'Motorradteile & Zubehör';
UPDATE subcategories SET name = 'Ticari Araçlar & Römorklar' WHERE name = 'Nutzfahrzeuge & Anhänger';
UPDATE subcategories SET name = 'Tamir & Servis' WHERE name = 'Reparaturen & Dienstleistungen';
UPDATE subcategories SET name = 'Karavan & Motokaravan' WHERE name = 'Wohnwagen & Wohnmobile';
UPDATE subcategories SET name = 'Diğer Otomobil, Bisiklet & Tekne' WHERE name = 'Weiteres Auto, Rad & Boot';

-- Immobilien -> Emlak (already Turkish, just ensuring)
-- (Emlak subcategories are already in Turkish based on previous work)

-- Haus & Garten -> Ev & Bahçe
UPDATE subcategories SET name = 'Banyo' WHERE name = 'Badezimmer';
UPDATE subcategories SET name = 'Ofis' WHERE name = 'Büro';
UPDATE subcategories SET name = 'Dekorasyon' WHERE name = 'Dekoration';
UPDATE subcategories SET name = 'Ev Hizmetleri' WHERE name = 'Dienstleistungen Haus & Garten';
UPDATE subcategories SET name = 'Bahçe Malzemeleri & Bitkiler' WHERE name = 'Gartenzubehör & Pflanzen';
UPDATE subcategories SET name = 'Ev Tekstili' WHERE name = 'Heimtextilien';
UPDATE subcategories SET name = 'Ev Tadilatı' WHERE name = 'Heimwerken';
UPDATE subcategories SET name = 'Mutfak & Yemek Odası' WHERE name = 'Küche & Esszimmer';
UPDATE subcategories SET name = 'Lamba & Aydınlatma' WHERE name = 'Lampen & Licht';
UPDATE subcategories SET name = 'Yatak Odası' WHERE name = 'Schlafzimmer';
UPDATE subcategories SET name = 'Oturma Odası' WHERE name = 'Wohnzimmer';
UPDATE subcategories SET name = 'Diğer Ev & Bahçe' WHERE name = 'Weiteres Haus & Garten';

-- Mode & Beauty -> Moda & Güzellik
UPDATE subcategories SET name = 'Güzellik & Sağlık' WHERE name = 'Beauty & Gesundheit';
UPDATE subcategories SET name = 'Kadın Giyimi' WHERE name = 'Damenbekleidung';
UPDATE subcategories SET name = 'Kadın Ayakkabıları' WHERE name = 'Damenschuhe';
UPDATE subcategories SET name = 'Erkek Giyimi' WHERE name = 'Herrenbekleidung';
UPDATE subcategories SET name = 'Erkek Ayakkabıları' WHERE name = 'Herrenschuhe';
UPDATE subcategories SET name = 'Çanta & Aksesuarlar' WHERE name = 'Taschen & Accessoires';
UPDATE subcategories SET name = 'Saat & Takı' WHERE name = 'Uhren & Schmuck';
UPDATE subcategories SET name = 'Diğer Moda & Güzellik' WHERE name = 'Weiteres Mode & Beauty';

-- Elektronik (already Turkish names based on previous check)
UPDATE subcategories SET name = 'Ses & Hifi' WHERE name = 'Audio & Hifi';
UPDATE subcategories SET name = 'Elektronik Hizmetler' WHERE name = 'Dienstleistungen Elektronik';
UPDATE subcategories SET name = 'Fotoğraf & Kamera' WHERE name = 'Foto & Kamera';
UPDATE subcategories SET name = 'Cep Telefonu & Telefon' WHERE name = 'Handy & Telefon';
UPDATE subcategories SET name = 'Ev Aletleri' WHERE name = 'Haushaltsgeräte';
UPDATE subcategories SET name = 'Konsollar' WHERE name = 'Konsolen';
UPDATE subcategories SET name = 'Dizüstü Bilgisayarlar' WHERE name = 'Notebooks';
UPDATE subcategories SET name = 'Bilgisayarlar' WHERE name = 'PCs';
UPDATE subcategories SET name = 'Bilgisayar Aksesuarları & Yazılım' WHERE name = 'PC-Zubehör & Software';
UPDATE subcategories SET name = 'Tabletler & E-Okuyucular' WHERE name = 'Tablets & Reader';
UPDATE subcategories SET name = 'TV & Video' WHERE name = 'TV & Video';
UPDATE subcategories SET name = 'Video Oyunları' WHERE name = 'Videospiele';
UPDATE subcategories SET name = 'Diğer Elektronik' WHERE name = 'Weitere Elektronik';

-- Haustiere -> Evcil Hayvanlar (already normalized in listings)
UPDATE subcategories SET name = 'Balıklar' WHERE name = 'Fische';
UPDATE subcategories SET name = 'Köpekler' WHERE name = 'Hunde';
UPDATE subcategories SET name = 'Kediler' WHERE name = 'Katzen';
UPDATE subcategories SET name = 'Küçük Hayvanlar' WHERE name = 'Kleintiere';
UPDATE subcategories SET name = 'Çiftlik Hayvanları' WHERE name = 'Nutztiere';
UPDATE subcategories SET name = 'Atlar' WHERE name = 'Pferde';
UPDATE subcategories SET name = 'Hayvan Bakımı & Eğitimi' WHERE name = 'Tierbetreuung & Training';
UPDATE subcategories SET name = 'Kayıp Hayvanlar' WHERE name = 'Vermisste Tiere';
UPDATE subcategories SET name = 'Kuşlar' WHERE name = 'Vögel';
UPDATE subcategories SET name = 'Aksesuarlar' WHERE name = 'Zubehör';

-- Familie, Kind & Baby -> Aile, Çocuk & Bebek
UPDATE subcategories SET name = 'Yaşlı Bakımı' WHERE name = 'Altenpflege';
UPDATE subcategories SET name = 'Bebek & Çocuk Giyimi' WHERE name = 'Baby- & Kinderkleidung';
UPDATE subcategories SET name = 'Bebek & Çocuk Ayakkabıları' WHERE name = 'Baby- & Kinderschuhe';
UPDATE subcategories SET name = 'Bebek Gereçleri' WHERE name = 'Babyausstattung';
UPDATE subcategories SET name = 'Oto Koltukları' WHERE name = 'Babyschalen & Kindersitze';
UPDATE subcategories SET name = 'Babysitter & Çocuk Bakımı' WHERE name = 'Babysitter & Kinderbetreuung';
UPDATE subcategories SET name = 'Bebek Arabaları & Pusetler' WHERE name = 'Kinderwagen & Buggys';
UPDATE subcategories SET name = 'Çocuk Odası Mobilyaları' WHERE name = 'Kinderzimmermöbel';
UPDATE subcategories SET name = 'Oyuncaklar' WHERE name = 'Spielzeug';
UPDATE subcategories SET name = 'Diğer Aile, Çocuk & Bebek' WHERE name = 'Weiteres Familie, Kind & Baby';

-- Jobs -> İş İlanları
UPDATE subcategories SET name = 'Mesleki Eğitim' WHERE name = 'Ausbildung';
UPDATE subcategories SET name = 'İnşaat, El Sanatları & Üretim' WHERE name = 'Bau, Handwerk & Produktion';
UPDATE subcategories SET name = 'Ofis İşleri & Yönetim' WHERE name = 'Büroarbeit & Verwaltung';
UPDATE subcategories SET name = 'Gastronomi & Turizm' WHERE name = 'Gastronomie & Tourismus';
UPDATE subcategories SET name = 'Müşteri Hizmetleri & Çağrı Merkezi' WHERE name = 'Kundenservice & Callcenter';
UPDATE subcategories SET name = 'Mini & Ek İşler' WHERE name = 'Mini- & Nebenjobs';
UPDATE subcategories SET name = 'Stajlar' WHERE name = 'Praktika';
UPDATE subcategories SET name = 'Sosyal Sektör & Bakım' WHERE name = 'Sozialer Sektor & Pflege';
UPDATE subcategories SET name = 'Nakliye, Lojistik & Trafik' WHERE name = 'Transport, Logistik & Verkehr';
UPDATE subcategories SET name = 'Satış, Satın Alma & Pazarlama' WHERE name = 'Vertrieb, Einkauf & Verkauf';
UPDATE subcategories SET name = 'Diğer İş İlanları' WHERE name = 'Weitere Jobs';

-- Freizeit, Hobby & Nachbarschaft -> Eğlence, Hobi & Mahalle
UPDATE subcategories SET name = 'Ezoterizm & Spiritüalizm' WHERE name = 'Esoterik & Spirituelles';
UPDATE subcategories SET name = 'Yiyecek & İçecek' WHERE name = 'Essen & Trinken';
UPDATE subcategories SET name = 'Boş Zaman Aktiviteleri' WHERE name = 'Freizeitaktivitäten';
UPDATE subcategories SET name = 'El Sanatları & Hobi' WHERE name = 'Handarbeit, Basteln & Kunsthandwerk';
UPDATE subcategories SET name = 'Sanat & Antikalar' WHERE name = 'Kunst & Antiquitäten';
UPDATE subcategories SET name = 'Sanatçılar & Müzisyenler' WHERE name = 'Künstler/-in & Musiker/-in';
UPDATE subcategories SET name = 'Model Yapımı' WHERE name = 'Modellbau';
UPDATE subcategories SET name = 'Seyahat & Etkinlik Hizmetleri' WHERE name = 'Reise & Eventservices';
UPDATE subcategories SET name = 'Koleksiyon' WHERE name = 'Sammeln';
UPDATE subcategories SET name = 'Spor & Kamp' WHERE name = 'Sport & Camping';
UPDATE subcategories SET name = 'Bit Pazarı' WHERE name = 'Trödel';
UPDATE subcategories SET name = 'Kayıp & Buluntu' WHERE name = 'Verloren & Gefunden';
UPDATE subcategories SET name = 'Diğer Eğlence, Hobi & Mahalle' WHERE name = 'Weiteres Freizeit, Hobby & Nachbarschaft';

-- Musik, Filme & Bücher -> Müzik, Film & Kitap
UPDATE subcategories SET name = 'Kitap & Dergi' WHERE name = 'Bücher & Zeitschriften';
UPDATE subcategories SET name = 'Ofis & Kırtasiye' WHERE name = 'Büro & Schreibwaren';
UPDATE subcategories SET name = 'Çizgi Romanlar' WHERE name = 'Comics';
UPDATE subcategories SET name = 'Ders Kitapları, Okul & Eğitim' WHERE name = 'Fachbücher, Schule & Studium';
UPDATE subcategories SET name = 'Film & DVD' WHERE name = 'Film & DVD';
UPDATE subcategories SET name = 'Müzik & CD''ler' WHERE name = 'Musik & CDs';
UPDATE subcategories SET name = 'Müzik Enstrümanları' WHERE name = 'Musikinstrumente';
UPDATE subcategories SET name = 'Diğer Müzik, Film & Kitap' WHERE name = 'Weitere Musik, Filme & Bücher';

-- Eintrittskarten & Tickets -> Biletler
UPDATE subcategories SET name = 'Tren & Toplu Taşıma' WHERE name = 'Bahn & ÖPNV';
UPDATE subcategories SET name = 'Komedi & Kabare' WHERE name = 'Comedy & Kabarett';
UPDATE subcategories SET name = 'Hediye Kartları' WHERE name = 'Gutscheine';
UPDATE subcategories SET name = 'Çocuk' WHERE name = 'Kinder';
UPDATE subcategories SET name = 'Konserler' WHERE name = 'Konzerte';
UPDATE subcategories SET name = 'Spor' WHERE name = 'Sport';
UPDATE subcategories SET name = 'Tiyatro & Müzikal' WHERE name = 'Theater & Musical';
UPDATE subcategories SET name = 'Diğer Biletler' WHERE name = 'Weitere Eintrittskarten & Tickets';

-- Dienstleistungen -> Hizmetler
UPDATE subcategories SET name = 'Yaşlı Bakımı' WHERE name IN ('Altenpflege', 'Dienstleistungen Altenpflege');
UPDATE subcategories SET name = 'Otomobil, Bisiklet & Tekne' WHERE name = 'Dienstleistungen Auto, Rad & Boot';
UPDATE subcategories SET name = 'Bebek Bakıcısı & Kreş' WHERE name = 'Dienstleistungen Babysitter';
UPDATE subcategories SET name = 'Elektronik' WHERE name = 'Dienstleistungen Elektronik';
UPDATE subcategories SET name = 'Ev & Bahçe' WHERE name IN ('Dienstleistungen Haus & Garten', 'Ev & Bahçe Hizmetleri');
UPDATE subcategories SET name = 'Sanatçı & Müzisyen' WHERE name = 'Dienstleistungen Künstler & Musiker';
UPDATE subcategories SET name = 'Seyahat & Etkinlik' WHERE name = 'Dienstleistungen Reise & Event';
UPDATE subcategories SET name = 'Evcil Hayvan Bakımı & Eğitim' WHERE name = 'Dienstleistungen Tierbetreuung';
UPDATE subcategories SET name = 'Taşımacılık & Nakliye' WHERE name = 'Dienstleistungen Umzug & Transport';
UPDATE subcategories SET name = 'Diğer Hizmetler' WHERE name = 'Dienstleistungen Weitere';

-- Zu verschenken & Tauschen -> Ücretsiz & Takas
UPDATE subcategories SET name = 'Takas' WHERE name = 'Tauschen';
UPDATE subcategories SET name = 'Kiralama' WHERE name = 'Verleihen';
UPDATE subcategories SET name = 'Ücretsiz' WHERE name = 'Verschenken';

-- Unterricht & Kurse -> Eğitim & Kurslar (already handled in previous scripts)

-- ============================================
-- PART 3: Update Subcategories Slugs to Turkish
-- ============================================

-- Auto, Rad & Boot -> Otomobil, Bisiklet & Tekne
UPDATE subcategories SET slug = 'Otomobiller' WHERE name = 'Otomobiller';
UPDATE subcategories SET slug = 'Oto-Parca-Lastik' WHERE name = 'Oto Parça & Lastik';
UPDATE subcategories SET slug = 'Tekne-Tekne-Malzemeleri' WHERE name = 'Tekne & Tekne Malzemeleri';
UPDATE subcategories SET slug = 'Bisiklet-Aksesuarlar' WHERE name = 'Bisiklet & Aksesuarlar';
UPDATE subcategories SET slug = 'Motosiklet-Scooter' WHERE name = 'Motosiklet & Scooter';
UPDATE subcategories SET slug = 'Motosiklet-Parca-Aksesuarlar' WHERE name = 'Motosiklet Parça & Aksesuarlar';
UPDATE subcategories SET slug = 'Ticari-Araclar-Romorklar' WHERE name = 'Ticari Araçlar & Römorklar';
UPDATE subcategories SET slug = 'Tamir-Servis' WHERE name = 'Tamir & Servis';
UPDATE subcategories SET slug = 'Karavan-Motokaravan' WHERE name = 'Karavan & Motokaravan';
UPDATE subcategories SET slug = 'Diger-Otomobil-Bisiklet-Tekne' WHERE name = 'Diğer Otomobil, Bisiklet & Tekne';

-- Ev & Bahçe
UPDATE subcategories SET slug = 'Banyo' WHERE name = 'Banyo';
UPDATE subcategories SET slug = 'Ofis' WHERE name = 'Ofis';
UPDATE subcategories SET slug = 'Dekorasyon' WHERE name = 'Dekorasyon';
UPDATE subcategories SET slug = 'Ev-Hizmetleri' WHERE name = 'Ev Hizmetleri';
UPDATE subcategories SET slug = 'Bahce-Malzemeleri-Bitkiler' WHERE name = 'Bahçe Malzemeleri & Bitkiler';
UPDATE subcategories SET slug = 'Ev-Tekstili' WHERE name = 'Ev Tekstili';
UPDATE subcategories SET slug = 'Ev-Tadilati' WHERE name = 'Ev Tadilatı';
UPDATE subcategories SET slug = 'Mutfak-Yemek-Odasi' WHERE name = 'Mutfak & Yemek Odası';
UPDATE subcategories SET slug = 'Lamba-Aydinlatma' WHERE name = 'Lamba & Aydınlatma';
UPDATE subcategories SET slug = 'Yatak-Odasi' WHERE name = 'Yatak Odası';
UPDATE subcategories SET slug = 'Oturma-Odasi' WHERE name = 'Oturma Odası';
UPDATE subcategories SET slug = 'Diger-Ev-Bahce' WHERE name = 'Diğer Ev & Bahçe';

-- Moda & Güzellik
UPDATE subcategories SET slug = 'Guzellik-Saglik' WHERE name = 'Güzellik & Sağlık';
UPDATE subcategories SET slug = 'Kadin-Giyimi' WHERE name = 'Kadın Giyimi';
UPDATE subcategories SET slug = 'Kadin-Ayakkabilari' WHERE name = 'Kadın Ayakkabıları';
UPDATE subcategories SET slug = 'Erkek-Giyimi' WHERE name = 'Erkek Giyimi';
UPDATE subcategories SET slug = 'Erkek-Ayakkabilari' WHERE name = 'Erkek Ayakkabıları';
UPDATE subcategories SET slug = 'Canta-Aksesuarlar' WHERE name = 'Çanta & Aksesuarlar';
UPDATE subcategories SET slug = 'Saat-Taki' WHERE name = 'Saat & Takı';
UPDATE subcategories SET slug = 'Diger-Moda-Guzellik' WHERE name = 'Diğer Moda & Güzellik';

-- Elektronik
UPDATE subcategories SET slug = 'Ses-Hifi' WHERE name = 'Ses & Hifi';
UPDATE subcategories SET slug = 'Elektronik-Hizmetler' WHERE name = 'Elektronik Hizmetler';
UPDATE subcategories SET slug = 'Fotograf-Kamera' WHERE name = 'Fotoğraf & Kamera';
UPDATE subcategories SET slug = 'Cep-Telefonu-Telefon' WHERE name = 'Cep Telefonu & Telefon';
UPDATE subcategories SET slug = 'Ev-Aletleri' WHERE name = 'Ev Aletleri';
UPDATE subcategories SET slug = 'Konsollar' WHERE name = 'Konsollar';
UPDATE subcategories SET slug = 'Dizustu-Bilgisayarlar' WHERE name = 'Dizüstü Bilgisayarlar';
UPDATE subcategories SET slug = 'Bilgisayarlar' WHERE name = 'Bilgisayarlar';
UPDATE subcategories SET slug = 'Bilgisayar-Aksesuarlari-Yazilim' WHERE name = 'Bilgisayar Aksesuarları & Yazılım';
UPDATE subcategories SET slug = 'Tabletler-E-Okuyucular' WHERE name = 'Tabletler & E-Okuyucular';
UPDATE subcategories SET slug = 'TV-Video' WHERE name = 'TV & Video';
UPDATE subcategories SET slug = 'Video-Oyunlari' WHERE name = 'Video Oyunları';
UPDATE subcategories SET slug = 'Diger-Elektronik' WHERE name = 'Diğer Elektronik';

-- Evcil Hayvanlar
UPDATE subcategories SET slug = 'Baliklar' WHERE name = 'Balıklar';
UPDATE subcategories SET slug = 'Kopekler' WHERE name = 'Köpekler';
UPDATE subcategories SET slug = 'Kediler' WHERE name = 'Kediler';
UPDATE subcategories SET slug = 'Kucuk-Hayvanlar' WHERE name = 'Küçük Hayvanlar';
UPDATE subcategories SET slug = 'Ciftlik-Hayvanlari' WHERE name = 'Çiftlik Hayvanları';
UPDATE subcategories SET slug = 'Atlar' WHERE name = 'Atlar';
UPDATE subcategories SET slug = 'Hayvan-Bakimi-Egitimi' WHERE name = 'Hayvan Bakımı & Eğitimi';
UPDATE subcategories SET slug = 'Kayip-Hayvanlar' WHERE name = 'Kayıp Hayvanlar';
UPDATE subcategories SET slug = 'Kuslar' WHERE name = 'Kuşlar';
UPDATE subcategories SET slug = 'Aksesuarlar' WHERE name = 'Aksesuarlar';

-- Aile, Çocuk & Bebek
UPDATE subcategories SET slug = 'Yasli-Bakimi' WHERE name = 'Yaşlı Bakımı';
UPDATE subcategories SET slug = 'Bebek-Cocuk-Giyimi' WHERE name = 'Bebek & Çocuk Giyimi';
UPDATE subcategories SET slug = 'Bebek-Cocuk-Ayakkabilari' WHERE name = 'Bebek & Çocuk Ayakkabıları';
UPDATE subcategories SET slug = 'Bebek-Gerecleri' WHERE name = 'Bebek Gereçleri';
UPDATE subcategories SET slug = 'Oto-Koltuklari' WHERE name = 'Oto Koltukları';
UPDATE subcategories SET slug = 'Babysitter-Cocuk-Bakimi' WHERE name = 'Babysitter & Çocuk Bakımı';
UPDATE subcategories SET slug = 'Bebek-Arabalari-Pusetler' WHERE name = 'Bebek Arabaları & Pusetler';
UPDATE subcategories SET slug = 'Cocuk-Odasi-Mobilyalari' WHERE name = 'Çocuk Odası Mobilyaları';
UPDATE subcategories SET slug = 'Oyuncaklar' WHERE name = 'Oyuncaklar';
UPDATE subcategories SET slug = 'Diger-Aile-Cocuk-Bebek' WHERE name = 'Diğer Aile, Çocuk & Bebek';

-- İş İlanları
UPDATE subcategories SET slug = 'Mesleki-Egitim' WHERE name = 'Mesleki Eğitim';
UPDATE subcategories SET slug = 'Insaat-El-Sanatlari-Uretim' WHERE name = 'İnşaat, El Sanatları & Üretim';
UPDATE subcategories SET slug = 'Ofis-Isleri-Yonetim' WHERE name = 'Ofis İşleri & Yönetim';
UPDATE subcategories SET slug = 'Gastronomi-Turizm' WHERE name = 'Gastronomi & Turizm';
UPDATE subcategories SET slug = 'Musteri-Hizmetleri-Cagri-Merkezi' WHERE name = 'Müşteri Hizmetleri & Çağrı Merkezi';
UPDATE subcategories SET slug = 'Mini-Ek-Isler' WHERE name = 'Mini & Ek İşler';
UPDATE subcategories SET slug = 'Stajlar' WHERE name = 'Stajlar';
UPDATE subcategories SET slug = 'Sosyal-Sektor-Bakim' WHERE name = 'Sosyal Sektör & Bakım';
UPDATE subcategories SET slug = 'Nakliye-Lojistik-Trafik' WHERE name = 'Nakliye, Lojistik & Trafik';
UPDATE subcategories SET slug = 'Satis-Satin-Alma-Pazarlama' WHERE name = 'Satış, Satın Alma & Pazarlama';
UPDATE subcategories SET slug = 'Diger-Is-Ilanlari' WHERE name = 'Diğer İş İlanları';

-- Eğlence, Hobi & Mahalle
UPDATE subcategories SET slug = 'Ezoterizm-Spiritualizm' WHERE name = 'Ezoterizm & Spiritüalizm';
UPDATE subcategories SET slug = 'Yiyecek-Icecek' WHERE name = 'Yiyecek & İçecek';
UPDATE subcategories SET slug = 'Bos-Zaman-Aktiviteleri' WHERE name = 'Boş Zaman Aktiviteleri';
UPDATE subcategories SET slug = 'El-Sanatlari-Hobi' WHERE name = 'El Sanatları & Hobi';
UPDATE subcategories SET slug = 'Sanat-Antikalar' WHERE name = 'Sanat & Antikalar';
UPDATE subcategories SET slug = 'Sanatcilar-Muzisyenler' WHERE name = 'Sanatçılar & Müzisyenler';
UPDATE subcategories SET slug = 'Model-Yapimi' WHERE name = 'Model Yapımı';
UPDATE subcategories SET slug = 'Seyahat-Etkinlik-Hizmetleri' WHERE name = 'Seyahat & Etkinlik Hizmetleri';
UPDATE subcategories SET slug = 'Koleksiyon' WHERE name = 'Koleksiyon';
UPDATE subcategories SET slug = 'Spor-Kamp' WHERE name = 'Spor & Kamp';
UPDATE subcategories SET slug = 'Bit-Pazari' WHERE name = 'Bit Pazarı';
UPDATE subcategories SET slug = 'Kayip-Buluntu' WHERE name = 'Kayıp & Buluntu';
UPDATE subcategories SET slug = 'Diger-Eglence-Hobi-Mahalle' WHERE name = 'Diğer Eğlence, Hobi & Mahalle';

-- Müzik, Film & Kitap
UPDATE subcategories SET slug = 'Kitap-Dergi' WHERE name = 'Kitap & Dergi';
UPDATE subcategories SET slug = 'Ofis-Kirtasiye' WHERE name = 'Ofis & Kırtasiye';
UPDATE subcategories SET slug = 'Cizgi-Romanlar' WHERE name = 'Çizgi Romanlar';
UPDATE subcategories SET slug = 'Ders-Kitaplari-Okul-Egitim' WHERE name = 'Ders Kitapları, Okul & Eğitim';
UPDATE subcategories SET slug = 'Film-DVD' WHERE name = 'Film & DVD';
UPDATE subcategories SET slug = 'Muzik-CDler' WHERE name = 'Müzik & CD''ler';
UPDATE subcategories SET slug = 'Muzik-Enstrumanlari' WHERE name = 'Müzik Enstrümanları';
UPDATE subcategories SET slug = 'Diger-Muzik-Film-Kitap' WHERE name = 'Diğer Müzik, Film & Kitap';

-- Biletler
UPDATE subcategories SET slug = 'Tren-Toplu-Tasima' WHERE name = 'Tren & Toplu Taşıma';
UPDATE subcategories SET slug = 'Komedi-Kabare' WHERE name = 'Komedi & Kabare';
UPDATE subcategories SET slug = 'Hediye-Kartlari' WHERE name = 'Hediye Kartları';
UPDATE subcategories SET slug = 'Cocuk' WHERE name = 'Çocuk';
UPDATE subcategories SET slug = 'Konserler' WHERE name = 'Konserler';
UPDATE subcategories SET slug = 'Spor' WHERE name = 'Spor';
UPDATE subcategories SET slug = 'Tiyatro-Muzikal' WHERE name = 'Tiyatro & Müzikal';
UPDATE subcategories SET slug = 'Diger-Biletler' WHERE name = 'Diğer Biletler';

-- Hizmetler
UPDATE subcategories SET slug = 'Yasli-Bakimi' WHERE name = 'Yaşlı Bakımı' AND slug != 'Yasli-Bakimi';
UPDATE subcategories SET slug = 'Otomobil-Bisiklet-Tekne-Servisi' WHERE name = 'Otomobil, Bisiklet & Tekne';
UPDATE subcategories SET slug = 'Bebek-Bakicisi-Kres' WHERE name = 'Bebek Bakıcısı & Kreş';
UPDATE subcategories SET slug = 'Elektronik-Servisler' WHERE name = 'Elektronik';
UPDATE subcategories SET slug = 'Ev-Bahce-Hizmetleri' WHERE name = 'Ev & Bahçe';
UPDATE subcategories SET slug = 'Sanatci-Muzisyen' WHERE name = 'Sanatçı & Müzisyen';
UPDATE subcategories SET slug = 'Seyahat-Etkinlik' WHERE name = 'Seyahat & Etkinlik';
UPDATE subcategories SET slug = 'Evcil-Hayvan-Bakimi-Egitim' WHERE name = 'Evcil Hayvan Bakımı & Eğitim';
UPDATE subcategories SET slug = 'Tasimacilik-Nakliye' WHERE name = 'Taşımacılık & Nakliye';
UPDATE subcategories SET slug = 'Diger-Hizmetler' WHERE name = 'Diğer Hizmetler';

-- Ücretsiz & Takas
UPDATE subcategories SET slug = 'Takas' WHERE name = 'Takas';
UPDATE subcategories SET slug = 'Kiralama' WHERE name = 'Kiralama';
UPDATE subcategories SET slug = 'Ucretsiz' WHERE name = 'Ücretsiz';

-- Eğitim & Kurslar (will be added by add_missing_categories.sql)
UPDATE subcategories SET slug = 'Bilgisayar-Kurslari' WHERE name = 'Bilgisayar Kursları';
UPDATE subcategories SET slug = 'Ezoterizm-Spiritualizm' WHERE name = 'Ezoterizm & Spiritüalizm' AND slug LIKE '%Esoterik%';
UPDATE subcategories SET slug = 'Yemek-Pastacilik' WHERE name = 'Yemek & Pastacılık';
UPDATE subcategories SET slug = 'Sanat-Tasarim' WHERE name = 'Sanat & Tasarım';
UPDATE subcategories SET slug = 'Muzik-San' WHERE name = 'Müzik & Şan';
UPDATE subcategories SET slug = 'Ozel-Ders' WHERE name = 'Özel Ders';
UPDATE subcategories SET slug = 'Spor-Kurslari' WHERE name = 'Spor Kursları';
UPDATE subcategories SET slug = 'Dil-Kurslari' WHERE name = 'Dil Kursları';
UPDATE subcategories SET slug = 'Dans-Kurslari' WHERE name = 'Dans Kursları';
UPDATE subcategories SET slug = 'Surekli-Egitim' WHERE name = 'Sürekli Eğitim';
UPDATE subcategories SET slug = 'Diger-Egitim-Kurslar' WHERE name = 'Diğer Eğitim & Kurslar';

-- Komşu Yardımı
UPDATE subcategories SET slug = 'Komsu-Yardimi' WHERE name = 'Komşu Yardımı';

-- Verification query
SELECT 'Categories' as table_name, name, slug FROM categories
UNION ALL
SELECT 'Subcategories' as table_name, name, slug FROM subcategories
ORDER BY table_name, name;
