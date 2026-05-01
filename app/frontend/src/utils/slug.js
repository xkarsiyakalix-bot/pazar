export const createSlug = (title) => {
    if (!title) return "";

    const trMap = {
        'ç': 'c', 'Ç': 'c', 'ğ': 'g', 'Ğ': 'g', 'ı': 'i', 'İ': 'i',
        'ö': 'o', 'Ö': 'o', 'ş': 's', 'Ş': 's', 'ü': 'u', 'Ü': 'u'
    };

    let slug = title.toLowerCase();

    // Replace Turkish characters
    Object.keys(trMap).forEach(key => {
        slug = slug.replaceAll(key, trMap[key]);
    });

    return slug
        .replace(/[^a-z0-9]/g, '-') // Replace non-alphanumeric with hyphen
        .replace(/-+/g, '-')        // Replace multiple hyphens with single one
        .trim('-')                  // Trim leading/trailing hyphens
        .replace(/^-+|-+$/g, '');   // Regex cleanup for leading/trailing hyphens
};

export const getListingUrl = (listing) => {
    if (!listing) return "/";
    
    let baseSlug = listing.slug || createSlug(listing.title || "ilan");
    
    // Ensure the URL always ends with the listing.id for 100% reliable routing
    if (listing.id) {
        if (baseSlug.endsWith(listing.id)) {
            return `/${baseSlug}`;
        }
        baseSlug = baseSlug.replace(/-+$/, '');
        return `/${baseSlug}-${listing.id}`;
    }
    
    return `/${baseSlug}`;
};

/**
 * Get seller profile URL based on subscription status
 * @param {Object} profile - User profile object
 * @returns {string} URL to store or seller page
 */
export const getSellerUrl = (profile) => {
    if (!profile) return "/";

    // In this project, is_pro or subscription_tier indicates a corporate/pro account
    const hasCorporateTier = profile.is_pro || profile.is_commercial || (profile.subscription_tier && profile.subscription_tier !== 'free');

    // Check if subscription is still valid
    const now = new Date();
    const expiry = profile.subscription_expiry ? new Date(profile.subscription_expiry) : null;
    const isSubscriptionActive = expiry ? expiry > now : false;

    // Special cases for admin or specific users could be added here if needed
    // But per user request: if no active payment/package, go to normal seller page
    if (hasCorporateTier && isSubscriptionActive) {
        return profile.store_slug ? `/${profile.store_slug}` : `/store/${profile.id}`;
    }

    // Default to normal seller page
    return `/seller/${profile.user_number || profile.id}`;
};
/**
 * Get category path URL
 */
export const getCategoryPath = (categoryName, subcategoryName = null) => {
    const mainMappings = {
        'Tüm Kategoriler': 'butun-kategoriler',
        'Vasıta (Otomobil, Bisiklet & Tekne)': 'vasita',
        'Otomobil, Bisiklet & Tekne': 'vasita',
        'Otomobil, Bisiklet & Tekne Servisi': 'vasita',
        'Emlak': 'emlak',
        'Ev & Bahçe': 'ev-bahce',
        'Moda & Güzellik': 'moda-guzellik',
        'Elektronik': 'elektronik',
        'Evcil Hayvanlar': 'evcil-hayvanlar',
        'Aile, Çocuk & Bebek': 'aile-cocuk-bebek',
        'İş İlanları': 'is-ilanlari',
        'Eğlence, Hobi & Mahalle': 'eglence-hobi-mahalle',
        'Müzik, Film & Kitap': 'muzik-film-kitap',
        'Biletler': 'biletler',
        'Hizmetler': 'hizmetler',
        'Ücretsiz & Takas': 'ucretsiz-takas',
        'Eğitim & Kurslar': 'egitim-kurslar',
        'Dersler & Kurslar': 'egitim-kurslar',
        'Komşu Yardımı': 'komsu-yardimi'
    };

    const subMappings = {
        'Otomobiller': 'otomobiller',
        'Bisiklet & Aksesuarlar': 'bisiklet-aksesuarlar',
        'Oto Parça & Lastik': 'oto-parca-lastik',
        'Tekne & Tekne Malzemeleri': 'tekne-tekne-malzemeleri',
        'Motosiklet & Scooter': 'motosiklet-scooter',
        'Motosiklet Parça & Aksesuarlar': 'motosiklet-parca-aksesuarlar',
        'Ticari Araçlar & Römorklar': 'ticari-araclar-romorklar',
        'Tamir & Servis': 'tamir-servis',
        'Karavan & Motokaravan': 'karavan-motokaravan',
        'Diğer Otomobil, Bisiklet & Tekne': 'diger-otomobil-bisiklet-tekne',
        'Geçici Konaklama & Paylaşımlı Ev': 'gecici-konaklama-paylasimli-ev',
        'Konteyner': 'konteyner',
        'Satılık Daireler': 'satilik-daireler',
        'Satılık Daire': 'satilik-daireler',
        'Satılık Yazlık': 'satilik-yazlik',
        'Tatil Evi & Yurt Dışı Emlak': 'tatil-evi-yurt-disi-emlak',
        'Garaj & Otopark': 'garaj-otopark',
        'Ticari Emlak': 'ticari-emlak',
        'Arsa & Bahçe': 'arsa-bahce',
        'Satılık Evler': 'satilik-evler',
        'Satılık Müstakil Ev': 'satilik-evler',
        'Satılık Ev': 'satilik-evler',
        'Kiralık Evler': 'kiralik-evler',
        'Kiralık Müstakil Ev': 'kiralik-evler',
        'Kiralık Ev': 'kiralik-evler',
        'Kiralık Daireler': 'kiralik-daireler',
        'Kiralık Daire': 'kiralik-daireler',
        'Yeni Projeler': 'yeni-projeler',
        'Taşımacılık & Nakliye': 'tasimacilik-nakliye',
        'Diğer Emlak': 'diger-emlak',
        'Banyo': 'banyo',
        'Ofis': 'ofis',
        'Dekorasyon': 'dekorasyon',
        'Ev Hizmetleri': 'ev-hizmetleri',
        'Bahçe Malzemeleri & Bitkiler': 'bahce-malzemeleri-bitkiler',
        'Ev Tekstili': 'ev-tekstili',
        'Ev Tadilatı': 'ev-tadilati',
        'Mutfak & Yemek Odası': 'mutfak-yemek-odasi',
        'Lamba & Aydınlatma': 'lamba-aydinlatma',
        'Yatak Odası': 'yatak-odasi',
        'Oturma Odası': 'oturma-odasi',
        'Diğer Ev & Bahçe': 'diger-ev-bahce',
        'Güzellik & Sağlık': 'guzellik-saglik',
        'Kadın Giyimi': 'kadin-giyimi',
        'Kadın Ayakkabıları': 'kadin-ayakkabilari',
        'Erkek Giyimi': 'erkek-giyimi',
        'Erkek Ayakkabıları': 'erkek-ayakkabilari',
        'Çanta & Aksesuarlar': 'canta-aksesuarlar',
        'Saat & Takı': 'saat-taki',
        'Diğer Moda & Güzellik': 'diger-moda-guzellik',
        'Ses & Hifi': 'ses-hifi',
        'Elektronik Hizmetler': 'elektronik-hizmetler',
        'Fotoğraf & Kamera': 'fotograf-kamera',
        'Cep Telefonu & Telefon': 'cep-telefonu-telefon',
        'Ev Aletleri': 'ev-aletleri',
        'Konsollar': 'konsollar',
        'Dizüstü Bilgisayarlar': 'dizustu-bilgisayarlar',
        'Bilgisayarlar': 'bilgisayarlar',
        'Bilgisayar Aksesuarları & Yazılım': 'bilgisayar-aksesuarlari-yazilim',
        'Tabletler & E-Okuyucular': 'tabletler-e-okuyucular',
        'TV & Video': 'tv-video',
        'Video Oyunları': 'video-oyunlari',
        'Diğer Elektronik': 'diger-elektronik',
        'Balıklar': 'baliklar',
        'Köpekler': 'kopekler',
        'Kediler': 'kedi',
        'Küçük Hayvanlar': 'kucuk-hayvanlar',
        'Çiftlik Hayvanları': 'ciftlik-hayvanlari',
        'Atlar': 'atlar',
        'Hayvan Bakımı & Eğitim': 'hayvan-bakimi-egitimi',
        'Kayıp Hayvanlar': 'kayip-hayvanlar',
        'Kuşlar': 'kuslar',
        'Aksesuarlar': 'aksesuarlar',
        'Yaşlı Bakımı': 'yasli-bakimi',
        'Bebek & Çocuk Giyimi': 'bebek-cocuk-giyimi',
        'Bebek & Çocuk Ayakkabıları': 'bebek-cocuk-ayakkabilari',
        'Bebek Ekipmanları': 'bebek-ekipmanlari',
        'Bebek Koltuğu & Oto Koltukları': 'oto-koltuklari',
        'Babysitter & Çocuk Bakımı': 'babysitter-cocuk-bakimi',
        'Bebek Arabaları & Pusetler': 'bebek-arabalari-pusetler',
        'Bebek Odası Mobilyaları': 'cocuk-odasi-mobilyalari',
        'Oyuncaklar': 'oyuncaklar',
        'Diğer Aile, Çocuk & Bebek': 'diger-aile-cocuk-bebek',
        'Mesleki Eğitim': 'mesleki-egitim',
        'İnşaat, El Sanatları & Üretim': 'insaat-sanat-uretim',
        'Büro İşleri & Yönetim': 'buroarbeit-yonetim',
        'Gastronomi & Turizm': 'gastronomi-turizm',
        'Müşteri Hizmetleri & Çağrı Merkezi': 'musteri-hizmetleri-cagri-merkezi',
        'Ek İşler': 'ek-isler',
        'Staj': 'staj',
        'Sosyal Sektör & Bakım': 'sosyal-sektor-bakim',
        'Taşımacılık & Lojistik': 'tasimacilik-lojistik',
        'Satış & Pazarlama': 'satis-pazarlama',
        'Diğer İş İlanları': 'diger-is-ilanlari',
        'Ezoterizm & Spiritüalizm': 'ezoterizm-spiritualizm',
        'Yiyecek & İçecek': 'yiyecek-icecek',
        'Boş Zaman Aktiviteleri': 'bos-zaman-aktiviteleri',
        'El Sanatları & Hobi': 'el-sanatlari-hobi',
        'Sanat & Antikalar': 'sanat-antikalar',
        'Sanatçılar & Müzisyenler': 'sanatcilar-muzisyenler',
        'Model Yapımı': 'model-yapimi',
        'Seyahat & Etkinlik Hizmetleri': 'seyahat-etkinlik-hizmetleri',
        'Koleksiyon': 'koleksiyon',
        'Spor & Kamp': 'spor-kamp',
        'Bit Pazarı': 'bit-pazari',
        'Kayıp & Buluntu': 'kayip-buluntu',
        'Diğer Eğlence, Hobi & Mahalle': 'diger-eglence-hobi-mahalle',
        'Kitap & Dergi': 'kitap-dergi',
        'Kırtasiye': 'kirtasiye',
        'Çizgi Romanlar': 'cizgi-romanlar',
        'Ders Kitapları, Okul & Eğitim': 'ders-kitaplari-okul-egitim',
        'Film & DVD': 'film-dvd',
        'Müzik & CD\'ler': 'muzik-cdler',
        'Müzik Enstrümanları': 'muzik-enstrumanlari',
        'Diğer Müzik, Film & Kitap': 'diger-muzik-film-kitap',
        'Tren & Toplu Taşıma': 'tren-toplu-tasima',
        'Komedi & Kabare': 'komedi-kabare',
        'Hediye Çekleri': 'hediye-kartlari',
        'Çocuk Etkinlikleri': 'cocuk',
        'Konserler': 'konserler',
        'Spor': 'spor',
        'Tiyatro & Müzikal': 'tiyatro-muzikal',
        'Diğer Biletler': 'diger-biletler',
        'Bebek Bakıcısı & Kreş': 'babysitter-cocuk-bakimi',
        'Hizmetler': 'hizmetler',
        'Seyahat & Etkinlik': 'seyahat-etkinlik',
        'Diğer Hizmetler': 'diger-hizmetler',
        'Takas': 'takas',
        'Kiralama': 'kiralama',
        'Ücretsiz': 'ucretsiz',
        'Bilgisayar Kursları': 'bilgisayar-kurslari',
        'Yemek & Pastacılık': 'yemek-pastacilik-kurslari',
        'Sanat & Tasarım': 'sanat-tasarim-kurslari',
        'Müzik & Şan': 'muzik-san-dersleri',
        'Özel Ders': 'ozel-ders',
        'Spor Kursları': 'spor-kurslari',
        'Dil Kursları': 'dil-kurslari',
        'Dans Kursları': 'dans-kurslari',
        'Sürekli Eğitim': 'surekli-egitim',
        'Diğer Dersler & Kurslar': 'diger-dersler-kurslar',
        'Komşu Yardımı': 'komsu-yardimi'
    };

    const slugify = (text) => {
        if (!text) return '';
        const trMap = {
            'ç': 'c', 'Ç': 'c', 'ğ': 'g', 'Ğ': 'g', 'ş': 's', 'Ş': 's',
            'ı': 'i', 'İ': 'i', 'ö': 'o', 'Ö': 'o', 'ü': 'u', 'Ü': 'u'
        };
        let t = text.toLowerCase();
        for (let key in trMap) {
            t = t.replace(new RegExp(key, 'g'), trMap[key]);
        }
        return t.replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
    };

    const catSlug = mainMappings[categoryName] || slugify(categoryName);
    if (!subcategoryName || subcategoryName === 'Tümü' || subcategoryName === 'Alle' || subcategoryName === 'Tüm' || subcategoryName === categoryName) {
        return `/${catSlug}`;
    }

    const subSlug = subMappings[subcategoryName] || slugify(subcategoryName);
    return `/${catSlug}/${subSlug}`;
};
