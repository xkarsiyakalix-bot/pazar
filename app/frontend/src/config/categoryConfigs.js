import { t } from '../translations';

// Common options
export const providerOptions = [
    { value: 'Privatnutzer', label: 'Bireysel', displayLabel: 'Bireysel' },
    { value: 'Gewerblicher Nutzer', label: 'Kurumsal', displayLabel: 'Kurumsal' }
];

export const offerOptions = [
    { value: 'Angebote', label: 'Satılık', displayLabel: 'Satılık' },
    { value: 'Gesuche', label: 'Aranıyor', displayLabel: 'Aranıyor' }
];

export const conditionOptions = [
    { value: 'neu', label: 'Yeni', displayLabel: 'Yeni' },
    { value: 'gebraucht', label: 'İkinci El', displayLabel: 'İkinci El' },
    { value: 'defekt', label: 'Arızalı', displayLabel: 'Arızalı' }
];

// Helper to get Turkish cities for filters
const getCityOptions = () => {
    // This could import from turkey_cities but for now we define common ones or use a placeholder
    return [
        'İstanbul', 'Ankara', 'İzmir', 'Bursa', 'Antalya', 'Adana', 'Konya', 'Gaziantep', 'Şanlıurfa', 'Kocaeli'
    ].map(city => ({ value: city, label: city, displayLabel: city }));
};

export const categoryConfigs = {
    'otomobil': {
        name: 'Vasıta (Otomobil, Bisiklet & Tekne)',
        slug: 'vasita',
        filters: {
            price: { type: 'range', label: 'Fiyat', field: 'price' },
            marke: { type: 'multiselect', label: 'Marka', field: 'marke' },
            kraftstoff: { 
                type: 'multiselect', 
                label: 'Yakıt Tipi', 
                options: [
                    { value: 'Benzin', displayLabel: 'Benzin' },
                    { value: 'Dizel', displayLabel: 'Dizel' },
                    { value: 'Hybrid', displayLabel: 'Hibrit' },
                    { value: 'Elektro', displayLabel: 'Elektrik' }
                ] 
            },
            getriebe: {
                type: 'multiselect',
                label: 'Vites',
                options: [
                    { value: 'Otomatik', displayLabel: 'Otomatik' },
                    { value: 'Manuel', displayLabel: 'Manuel' }
                ]
            }
        }
    },
    'emlak': {
        name: 'Emlak (Konut, İş Yeri, Arsa)',
        slug: 'emlak',
        filters: {
            price: { type: 'range', label: 'Fiyat', field: 'price' },
            room_count: { type: 'multiselect', label: 'Oda Sayısı', options: ['1+0', '1+1', '2+1', '3+1', '4+1', '5+1'] },
            square_meters: { type: 'range', label: 'Metrekare', field: 'square_meters' }
        }
    },
    'ev-bahce': {
        name: 'Ev ve Bahçe Eşyaları',
        slug: 'ev-ve-bahce',
        filters: {
            price: { type: 'range', label: 'Fiyat', field: 'price' },
            condition: { type: 'multiselect', label: 'Durum', options: conditionOptions }
        }
    },
    'moda-guzellik': {
        name: 'Moda, Giyim ve Güzellik',
        slug: 'moda-ve-giyim',
        filters: {
            price: { type: 'range', label: 'Fiyat', field: 'price' },
            size: { type: 'multiselect', label: 'Beden', options: ['S', 'M', 'L', 'XL', 'XXL'] },
            condition: { type: 'multiselect', label: 'Durum', options: conditionOptions }
        }
    },
    'elektronik': {
        name: 'Elektronik Ürünler ve Aletler',
        slug: 'elektronik',
        filters: {
            price: { type: 'range', label: 'Fiyat', field: 'price' },
            condition: { type: 'multiselect', label: 'Durum', options: conditionOptions }
        }
    },
    'is-ilanlari': {
        name: 'İş İlanları ve Kariyer Fırsatları',
        slug: 'is-ilanlari',
        filters: {
            hourly_wage: { type: 'range', label: 'Saatlik Ücret', field: 'hourly_wage' },
            employment_type: { 
                type: 'multiselect', 
                label: 'Çalışma Tipi', 
                options: [
                    { value: 'Vollzeit', displayLabel: 'Tam Zamanlı' },
                    { value: 'Teilzeit', displayLabel: 'Yarı Zamanlı' },
                    { value: 'Minijob', displayLabel: 'Ek İş' }
                ] 
            }
        }
    }
};

// Map URL slugs to internal category names
export const slugToCategoryMap = {
    'vasita': 'Otomobil, Bisiklet & Tekne',
    'otomobil-bisiklet-tekne': 'Otomobil, Bisiklet & Tekne',
    'emlak': 'Emlak',
    'ev-bahce': 'Ev & Bahçe',
    'moda-guzellik': 'Moda & Güzellik',
    'elektronik': 'Elektronik',
    'evcil-hayvanlar': 'Evcil Hayvanlar',
    'aile-cocuk-bebek': 'Aile, Çocuk & Bebek',
    'is-ilanlari': 'İş İlanları',
    'eglence-hobi-mahalle': 'Eğlence, Hobi & Mahalle',
    'muzik-film-kitap': 'Müzik, Film & Kitap',
    'biletler': 'Biletler',
    'hizmetler': 'Hizmetler',
    'ucretsiz-takas': 'Ücretsiz & Takas',
    'egitim-kurslar': 'Eğitim & Kurslar',
    'komsu-yardimi': 'Komşu Yardımı'
};

export const slugToSubCategoryMap = {
    // Otomobil
    'otomobiller': 'Otomobiller',
    'bisiklet-aksesuarlar': 'Bisiklet & Aksesuarlar',
    'oto-parca-lastik': 'Oto Parça & Lastik',
    'tekne-tekne-malzemeleri': 'Tekne & Tekne Malzemeleri',
    'motosiklet-scooter': 'Motosiklet & Scooter',
    'motosiklet-parca-aksesuarlar': 'Motosiklet Parça & Aksesuarlar',
    'ticari-araclar-romorklar': 'Ticari Araçlar & Römorklar',
    'tamir-servis': 'Tamir & Servis',
    'karavan-motokaravan': 'Karavan & Motokaravan',
    'diger-otomobil-bisiklet-tekne': 'Diğer Otomobil, Bisiklet & Tekne',
    
    // Emlak
    'gecici-konaklama-paylasimli-ev': 'Geçici Konaklama & Paylaşımlı Ev',
    'konteyner': 'Konteyner',
    'satilik-daireler': 'Satılık Daireler',
    'satilik-yazlik': 'Satılık Yazlık',
    'tatil-evi-yurt-disi-emlak': 'Tatil Evi & Yurt Dışı Emlak',
    'garaj-otopark': 'Garaj & Otopark',
    'ticari-emlak': 'Ticari Emlak',
    'arsa-bahce': 'Arsa & Bahçe',
    'satilik-evler': 'Satılık Evler',
    'kiralik-evler': 'Kiralık Evler',
    'kiralik-daireler': 'Kiralık Daireler',
    'yeni-projeler': 'Yeni Projeler',
    'tasimacilik-nakliye': 'Taşımacılık & Nakliye',
    'diger-emlak': 'Diğer Emlak',
    
    // Ev & Bahçe
    'banyo': 'Banyo',
    'ofis': 'Ofis',
    'dekorasyon': 'Dekorasyon',
    'ev-hizmetleri': 'Ev Hizmetleri',
    'bahce-malzemeleri-bitkiler': 'Bahçe Malzemeleri & Bitkiler',
    'ev-tekstili': 'Ev Tekstili',
    'ev-tadilati': 'Ev Tadilatı',
    'mutfak-yemek-odasi': 'Mutfak & Yemek Odası',
    'lamba-aydinlatma': 'Lamba & Aydınlatma',
    'yatak-odasi': 'Yatak Odası',
    'oturma-odasi': 'Oturma Odası',
    'diger-ev-bahce': 'Diğer Ev & Bahçe',
    
    // Moda
    'guzellik-saglik': 'Güzellik & Sağlık',
    'kadin-giyimi': 'Kadın Giyimi',
    'kadin-ayakkabilari': 'Kadın Ayakkabıları',
    'erkek-giyimi': 'Erkek Giyimi',
    'erkek-ayakkabilari': 'Erkek Ayakkabıları',
    'canta-aksesuarlar': 'Çanta & Aksesuarlar',
    'saat-taki': 'Saat & Takı',
    'diger-moda-guzellik': 'Diğer Moda & Güzellik',

    // Aile, Çocuk & Bebek
    'yasli-bakimi': 'Yaşlı Bakımı',
    'bebek-cocuk-giyimi': 'Bebek & Çocuk Giyimi',
    'bebek-cocuk-ayakkabilari': 'Bebek & Çocuk Ayakkabıları',
    'bebek-ekipmanlari': 'Bebek Ekipmanları',
    'oto-koltuklari': 'Bebek Koltuğu & Oto Koltukları',
    'babysitter-cocuk-bakimi': 'Babysitter & Çocuk Bakımı',
    'bebek-arabalari-pusetler': 'Bebek Arabaları & Pusetler',
    'cocuk-odasi-mobilyalari': 'Bebek Odası Mobilyaları',
    'oyuncaklar': 'Oyuncaklar',
    'diger-aile-cocuk-bebek': 'Diğer Aile, Çocuk & Bebek',

    // İş İlanları
    'mesleki-egitim': 'Mesleki Eğitim',
    'insaat-sanat-uretim': 'İnşaat, El Sanatları & Üretim',
    'buroarbeit-yonetim': 'Büro İşleri & Yönetim',
    'gastronomi-turizm': 'Gastronomi & Turizm',
    'musteri-hizmetleri-cagri-merkezi': 'Müşteri Hizmetleri & Çağrı Merkezi',
    'ek-isler': 'Ek İşler',
    'staj': 'Staj',
    'sosyal-sektor-bakim': 'Sosyal Sektör & Bakım',
    'tasimacilik-lojistik': 'Taşımacılık & Lojistik',
    'satis-pazarlama': 'Satış & Pazarlama',
    'diger-is-ilanlari': 'Diğer İş İlanları',

    // Eğlence, Hobi & Mahalle
    'ezoterizm-spiritualizm': 'Ezoterizm & Spiritüalizm',
    'yiyecek-icecek': 'Yiyecek & İçecek',
    'bos-zaman-aktiviteleri': 'Boş Zaman Aktiviteleri',
    'el-sanatlari-hobi': 'El Sanatları & Hobi',
    'sanat-antikalar': 'Sanat & Antikalar',
    'sanatcilar-muzisyenler': 'Sanatçılar & Müzisyenler',
    'model-yapimi': 'Model Yapımı',
    'seyahat-etkinlik-hizmetleri': 'Seyahat & Etkinlik Hizmetleri',
    'koleksiyon': 'Koleksiyon',
    'spor-kamp': 'Spor & Kamp',
    'bit-pazari': 'Bit Pazarı',
    'kayip-buluntu': 'Kayıp & Buluntu',
    'diger-eglence-hobi-mahalle': 'Diğer Eğlence, Hobi & Mahalle'
};
