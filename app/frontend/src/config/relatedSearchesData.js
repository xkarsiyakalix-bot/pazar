/**
 * ExVitrin - Comprehensive Related Searches & SEO Keyword Suggestions
 * Covers all 16 main categories, all subcategories, and intelligent keyword/brand expansion.
 */

// Turkish stop words to filter out when parsing user search queries
const STOP_WORDS = new Set([
  've', 'veya', 'ile', 'için', 'bir', 'bu', 'şu', 'o', 'de', 'da', 'mi', 'mu', 'mü', 'mı',
  'en', 'cok', 'çok', 'daha', 'kadar', 'gibi', 'olan', 'olarak', 'var', 'yok'
]);

// Popular Turkish brands mapped to related sibling brands & product lines
export const BRAND_ECOSYSTEMS = {
  lacoste: {
    name: 'Lacoste',
    category: 'Moda & Güzellik',
    siblings: ['Tommy Hilfiger', 'Ralph Lauren', 'Gant', 'Fred Perry', 'Calvin Klein'],
    products: ['Mont', 'Ceket', 'Polo Tişört', 'Ayakkabı', 'Çanta', 'Saat', 'Yağmurluk']
  },
  nike: {
    name: 'Nike',
    category: 'Moda & Güzellik',
    siblings: ['Adidas', 'Puma', 'New Balance', 'Under Armour', 'Jordan'],
    products: ['Spor Ayakkabı', 'Eşofman', 'Sweatshirt', 'Mont', 'Çanta', 'Krampon']
  },
  adidas: {
    name: 'Adidas',
    category: 'Moda & Güzellik',
    siblings: ['Nike', 'Puma', 'Reebok', 'New Balance'],
    products: ['Spor Ayakkabı', 'Eşofman Takımı', 'Samba', 'Superstar', 'Mont']
  },
  zara: {
    name: 'Zara',
    category: 'Moda & Güzellik',
    siblings: ['Mango', 'Massimo Dutti', 'Bershka', 'Pull&Bear', 'Stradivarius', 'H&M'],
    products: ['Kaban', 'Deri Ceket', 'Elbise', 'Blazer Ceket', 'Pantolon', 'Çanta']
  },
  apple: {
    name: 'Apple',
    category: 'Elektronik',
    siblings: ['Samsung', 'Xiaomi', 'Huawei'],
    products: ['iPhone 13', 'iPhone 14 Pro', 'iPhone 15', 'MacBook Air', 'MacBook Pro', 'iPad', 'AirPods', 'Apple Watch']
  },
  samsung: {
    name: 'Samsung',
    category: 'Elektronik',
    siblings: ['Apple', 'Xiaomi', 'Huawei', 'LG'],
    products: ['Galaxy S23', 'Galaxy S24', 'Galaxy A Serisi', 'Galaxy Z Flip', 'Tablet', 'Akıllı Saat', 'Smart TV']
  },
  bmw: {
    name: 'BMW',
    category: 'Otomobil, Bisiklet & Tekne',
    siblings: ['Mercedes-Benz', 'Audi', 'Volkswagen', 'Volvo'],
    products: ['320i', '520d', '116d', 'M Paket', 'Dizel Otomatik', 'Hasarsız']
  },
  mercedes: {
    name: 'Mercedes-Benz',
    category: 'Otomobil, Bisiklet & Tekne',
    siblings: ['BMW', 'Audi', 'Porsche', 'Volkswagen'],
    products: ['C 200', 'E 250', 'A 180', 'AMG', 'Dizel Otomatik']
  },
  ikea: {
    name: 'IKEA',
    category: 'Ev & Bahçe',
    siblings: ['Doğtaş', 'Kelebek', 'Vivense', 'Bellona', 'İstikbal'],
    products: ['Çalışma Masası', 'Kitaplık', 'Koltuk Takımı', 'Gardırop', 'Yemek Masası']
  },
  bosch: {
    name: 'Bosch',
    category: 'Elektronik',
    siblings: ['Siemens', 'Arçelik', 'Beko', 'Profilo', 'Makita'],
    products: ['Çamaşır Makinesi', 'Bulaşık Makinesi', 'Buzdolabı', 'Matkap', 'Kırıcı Delici']
  }
};

// Popular product term associations
export const PRODUCT_EXPANSIONS = {
  ceket: ['Deri Ceket', 'Mont', 'Kaban', 'Yağmurluk', 'Blazer Ceket', 'Vintage Ceket', 'Kot Ceket'],
  mont: ['Şişme Mont', 'Deri Mont', 'Kaban', 'Parka', 'Kışlık Mont', 'Yağmurluk'],
  daire: ['Satılık Daire', 'Kiralık Daire', '1+1 Daire', '2+1 Daire', '3+1 Daire', 'Eşyalı Daire', 'Kiralık Villa', 'Kiralık Konteyner'],
  ev: ['Müstakil Ev', 'Kiralık Villa', 'Satılık Yazlık', 'Köy Evi', 'Bahçeli Ev', 'Prefabrik Ev'],
  araba: ['Sahibinden Otomobil', 'Dizel Otomatik', 'Temiz 2. El Araç', 'Hasarsız Araba', 'Düşük KM', 'SUV Araçlar'],
  telefon: ['iPhone', 'Samsung Galaxy', 'Xiaomi', 'Sıfır Kapalı Kutu', 'Kutulu Faturalı', 'Yurt Dışı Telefon'],
  laptop: ['MacBook Pro', 'MacBook Air', 'Gaming Laptop', 'Asus ROG', 'Lenovo ThinkPad', 'i7 Laptop', 'Ofis Laptop'],
  bilgisayar: ['Masaüstü Oyuncu PC', 'Gaming Kasa', 'Monitör', 'Ekran Kartı', 'RTX Sistem', 'i5 Bilgisayar'],
  saat: ['Otomatik Saat', 'Akıllı Saat', 'Seiko', 'Casio', 'Tissot', 'Apple Watch', 'Deri Kordon Saat'],
  ayakkabi: ['Sneaker', 'Spor Ayakkabı', 'Deri Bot', 'Klasik Ayakkabı', 'Koşu Ayakkabısı'],
  motor: ['125cc Scooter', '250cc Motosiklet', 'Honda Motor', 'Yamaha', 'Vespa', 'Motosiklet Kaskı'],
  bisiklet: ['Dağ Bisikleti', 'Şehir Bisikleti', 'Elektrikli Bisiklet', 'Yol Bisikleti', 'Çocuk Bisikleti']
};

// Comprehensive Main Category & Subcategory Related Searches Directory
export const CATEGORY_RELATED_DATA = {
  'Otomobil, Bisiklet & Tekne': {
    popular: [
      'Sahibinden Otomobil', 'Dizel Otomatik Araba', 'Hasarsız Araç', 'Düşük KM',
      'Motosiklet & Scooter', 'Elektrikli Bisiklet', 'Ticari Araç & Kamyonet',
      'Karavan & Çekme Karavan', 'Oto Lastik & Jant', 'Tekne & Şişme Bot'
    ],
    brands: ['Volkswagen', 'Renault', 'Fiat', 'Ford', 'BMW', 'Mercedes-Benz', 'Toyota', 'Honda', 'Hyundai', 'Peugeot'],
    subcategories: [
      { name: 'Otomobiller', route: '/Otomobil-Bisiklet-Tekne/Otomobiller' },
      { name: 'Oto Parça & Lastik', route: '/Otomobil-Bisiklet-Tekne/Oto-Parca-Lastik' },
      { name: 'Motosiklet & Scooter', route: '/Otomobil-Bisiklet-Tekne/Motosiklet-Scooter' },
      { name: 'Bisiklet & Aksesuarlar', route: '/Otomobil-Bisiklet-Tekne/Bisiklet-Aksesuarlar' },
      { name: 'Ticari Araçlar & Römorklar', route: '/Otomobil-Bisiklet-Tekne/Ticari-Araclar-Romorklar' },
      { name: 'Karavan & Motokaravan', route: '/Otomobil-Bisiklet-Tekne/Karavan-Motokaravan' },
      { name: 'Tekne & Tekne Malzemeleri', route: '/Otomobil-Bisiklet-Tekne/Tekne-Tekne-Malzemeleri' }
    ]
  },
  'Emlak': {
    popular: [
      'Satılık Daire', 'Kiralık Daire', 'Kiralık Villa', 'Satılık Yazlık',
      'Konteyner Ev', 'Arsa & Bahçe', 'Sahibinden Kiralık Ev', 'Eşyalı Daire',
      '1+1 Kiralık Daire', '2+1 Kiralık Daire', 'Ticari Dükkan & Ofis', 'Müstakil Bahçeli Ev'
    ],
    cities: ['İstanbul', 'Ankara', 'İzmir', 'Bursa', 'Antalya', 'Muğla', 'Kocaeli', 'Adana'],
    subcategories: [
      { name: 'Kiralık Daire', route: '/Emlak/Kiralik-Daireler' },
      { name: 'Satılık Daire', route: '/Emlak/Satilik-Daireler' },
      { name: 'Kiralık Müstakil Ev & Villa', route: '/Emlak/Kiralik-Evler' },
      { name: 'Satılık Müstakil Ev', route: '/Emlak/Satilik-Evler' },
      { name: 'Satılık Yazlık', route: '/Emlak/Satilik-Yazlik' },
      { name: 'Konteyner', route: '/Emlak/Konteyner' },
      { name: 'Arsa & Bahçe', route: '/Emlak/Arsa-Bahce' },
      { name: 'Ticari Emlak', route: '/Emlak/Ticari-Emlak' }
    ]
  },
  'Ev & Bahçe': {
    popular: [
      'Koltuk Takımı', 'Yatak Odası Takımı', 'Yemek Odası & Masa Sandalye', 'Gardırop',
      'Bahçe Mobilyası', 'Çalışma Masası & Ofis Koltuğu', 'Avize & Aydınlatma',
      'Halı & Kilim', 'Mutfak Dolabı', 'Matkap & El Aletleri'
    ],
    brands: ['IKEA', 'İstikbal', 'Bellona', 'Doğtaş', 'Vivense', 'Kelebek', 'Yataş'],
    subcategories: [
      { name: 'Oturma Odası', route: '/Ev-Bahce/Oturma-Odasi' },
      { name: 'Yatak Odası', route: '/Ev-Bahce/Yatak-Odasi' },
      { name: 'Mutfak & Yemek Odası', route: '/Ev-Bahce/Mutfak-Yemek-Odasi' },
      { name: 'Bahçe Malzemeleri & Bitkiler', route: '/Ev-Bahce/Bahce-Malzemeleri-Bitkiler' },
      { name: 'Dekorasyon', route: '/Ev-Bahce/Dekorasyon' },
      { name: 'Ofis Mobilyası', route: '/Ev-Bahce/Ofis' },
      { name: 'Lamba & Aydınlatma', route: '/Ev-Bahce/Lamba-Aydinlatma' }
    ]
  },
  'Moda & Güzellik': {
    popular: [
      'Satılık Lacoste Ceket', 'Deri Ceket & Mont', 'Sneaker Ayakkabı', 'Abiye Elbise',
      'Erkek Takım Elbise', 'Deri Çanta', 'Kol Saati', 'Vintage Giyim',
      'Kışlık Kaban', 'Altın & Gümüş Takı', 'Güneş Gözlüğü'
    ],
    brands: ['Lacoste', 'Zara', 'Nike', 'Adidas', 'Mango', 'Tommy Hilfiger', 'Massimo Dutti', 'Gucci', 'Calvin Klein'],
    subcategories: [
      { name: 'Erkek Giyimi', route: '/Moda-Guzellik/Erkek-Giyimi' },
      { name: 'Kadın Giyimi', route: '/Moda-Guzellik/Kadin-Giyimi' },
      { name: 'Erkek Ayakkabıları', route: '/Moda-Guzellik/Erkek-Ayakkabilari' },
      { name: 'Kadın Ayakkabıları', route: '/Moda-Guzellik/Kadin-Ayakkabilari' },
      { name: 'Çanta & Aksesuarlar', route: '/Moda-Guzellik/Canta-Aksesuarlar' },
      { name: 'Saat & Takı', route: '/Moda-Guzellik/Saat-Taki' }
    ]
  },
  'Elektronik': {
    popular: [
      'iPhone 13', 'iPhone 14 Pro', 'Samsung Galaxy', 'MacBook Air & Pro',
      'Gaming Laptop', 'PlayStation 5 Konsol', 'Akıllı TV 4K', 'AirPods Kulaklık',
      'Fotoğraf Makinesi & DSLR', 'Akıllı Robot Süpürge', 'Masaüstü Oyuncu Bilgisayarı'
    ],
    brands: ['Apple', 'Samsung', 'Xiaomi', 'Sony', 'Asus', 'Lenovo', 'Dell', 'Canon', 'Dyson'],
    subcategories: [
      { name: 'Cep Telefonu & Telefon', route: '/Elektronik/Cep-Telefonu-Telefon' },
      { name: 'Dizüstü Bilgisayarlar', route: '/Elektronik/Dizustu-Bilgisayarlar' },
      { name: 'Bilgisayarlar', route: '/Elektronik/Bilgisayarlar' },
      { name: 'Konsollar', route: '/Elektronik/Konsollar' },
      { name: 'TV & Video', route: '/Elektronik/TV-Video' },
      { name: 'Fotoğraf & Kamera', route: '/Elektronik/Fotograf-Kamera' },
      { name: 'Ev Aletleri', route: '/Elektronik/Ev-Aletleri' }
    ]
  },
  'Evcil Hayvanlar': {
    popular: [
      'Yavru Kedi Sahiplendirme', 'Köpek Eğitimi & Bakımı', 'Kedi Tırmalama Ağacı',
      'Akvaryum & Balık Malzemeleri', 'Kuş Kafesi & Papağan', 'Köpek Kulübesi',
      'Taşıma Çantası & Kafesi', 'Mama & Aksesuar'
    ],
    subcategories: [
      { name: 'Kediler', route: '/Evcil-Hayvanlar/Kedi' },
      { name: 'Köpekler', route: '/Evcil-Hayvanlar/Kopekler' },
      { name: 'Kuşlar', route: '/Evcil-Hayvanlar/Kuslar' },
      { name: 'Balıklar', route: '/Evcil-Hayvanlar/Baliklar' },
      { name: 'Aksesuarlar', route: '/Evcil-Hayvanlar/Aksesuarlar' }
    ]
  },
  'Aile, Çocuk & Bebek': {
    popular: [
      'Bebek Arabası & Puset', 'Oto Koltuğu', 'Bebek Beşiği & Yatağı',
      'Oyuncak & Eğitici Setler', 'Çocuk Bisikleti & Akülü Araba',
      'Bebek Kıyafetleri', 'Mama Sandalyesi', 'Oyun Parkı'
    ],
    brands: ['Chicco', 'Kraft', 'Joie', 'Fisher-Price', 'Lego', 'Maxi-Cosi'],
    subcategories: [
      { name: 'Bebek Arabaları & Pusetler', route: '/Aile-Cocuk-Bebek/Bebek-Arabalari-Pusetler' },
      { name: 'Oto Koltukları', route: '/Aile-Cocuk-Bebek/Oto-Koltuklari' },
      { name: 'Oyuncaklar', route: '/Aile-Cocuk-Bebek/Oyuncaklar' },
      { name: 'Bebek & Çocuk Giyimi', route: '/Aile-Cocuk-Bebek/Bebek-Cocuk-Giyimi' },
      { name: 'Çocuk Odası Mobilyaları', route: '/Aile-Cocuk-Bebek/Cocuk-Odasi-Mobilyalari' }
    ]
  },
  'İş İlanları': {
    popular: [
      'Part Time İş İlanları', 'Evden Çalışma / Remote İş', 'Şoför & Kurye İlanları',
      'Garson & Barista', 'Müşteri Temsilcisi & Çağrı Merkezi', 'Muhasebe Elemanı',
      'Satış & Pazarlama Temsilcisi', 'Özel Güvenlik', 'Staj Fırsatları'
    ],
    subcategories: [
      { name: 'Gastronomi & Turizm', route: '/Is-Ilanlari/Gastronomi-Turizm' },
      { name: 'Müşteri Hizmetleri', route: '/Is-Ilanlari/Musteri-Hizmetleri-Cagri-Merkezi' },
      { name: 'Ek İşler', route: '/Is-Ilanlari/Ek-Isler' },
      { name: 'Taşımacılık & Lojistik', route: '/Is-Ilanlari/Tasimacilik-Lojistik' },
      { name: 'Satış & Pazarlama', route: '/Is-Ilanlari/Satis-Pazarlama' },
      { name: 'Büro İşleri & Yönetim', route: '/Is-Ilanlari/Buroarbeit-Yonetim' }
    ]
  },
  'Eğlence, Hobi & Mahalle': {
    popular: [
      'Kamp Çadırı & Ekipmanları', 'Olta & Balık Malzemeleri', 'Antika Eşyalar & Plaklar',
      'Koleksiyon Para & Pul', 'Masa Tenisi & Spor Aletleri', 'Drone & Model Uçak',
      'Kutu Oyunları', 'Kaykay & Paten'
    ],
    subcategories: [
      { name: 'Spor & Kamp', route: '/Eglence-Hobi-Mahalle/Spor-Kamp' },
      { name: 'Sanat & Antikalar', route: '/Eglence-Hobi-Mahalle/Sanat-Antikalar' },
      { name: 'Koleksiyon', route: '/Eglence-Hobi-Mahalle/Koleksiyon' },
      { name: 'Model Yapımı', route: '/Eglence-Hobi-Mahalle/Model-Yapimi' },
      { name: 'Boş Zaman Aktiviteleri', route: '/Eglence-Hobi-Mahalle/Bos-Zaman-Aktiviteleri' }
    ]
  },
  'Müzik, Film & Kitap': {
    popular: [
      'Akustik & Klasik Gitar', 'Elektronik Piyano & Org', 'Bağlama & Saz',
      'Roman & Edebiyat Kitapları', 'Ders Kitapları & KPSS', 'Plak & Pikap',
      'Bateri & Davul Seti', 'Müzik Stüdyo Ekipmanları'
    ],
    brands: ['Yamaha', 'Fender', 'Gibson', 'Roland', 'Casio', 'Marshall'],
    subcategories: [
      { name: 'Müzik Enstrümanları', route: '/Muzik-Film-Kitap/Muzik-Enstrumanlari' },
      { name: 'Müzik & CD\'ler', route: '/Muzik-Film-Kitap/Muzik-CDler' },
      { name: 'Film & DVD', route: '/Muzik-Film-Kitap/Film-DVD' },
      { name: 'Ders Kitapları & Okul', route: '/Muzik-Film-Kitap/Ders-Kitaplari-Okul-Egitim' }
    ]
  },
  'Biletler': {
    popular: [
      'Konser Biletleri', 'Futbol Maç Biletleri', 'Tiyatro & Müzikal',
      'Festival Biletleri', 'Stand-up & Gösteri', 'Sinema Biletleri'
    ],
    subcategories: [
      { name: 'Konserler', route: '/Biletler/Konserler' },
      { name: 'Spor Müsabakaları', route: '/Biletler/Spor' },
      { name: 'Tiyatro & Müzikal', route: '/Biletler/Tiyatro-Muzikal' },
      { name: 'Çocuk Etkinlikleri', route: '/Biletler/Cocuk' }
    ]
  },
  'Hizmetler': {
    popular: [
      'Evden Eve Nakliyat', 'Ev Temizliği Hizmeti', 'Boya Badana & Tadilat',
      'Elektrikçi & Tesisatçı', 'Klima & Kombi Bakımı', 'Grafik Tasarım & Web',
      'Fotoğraf & Video Çekimi', 'Halı Yıkama'
    ],
    subcategories: [
      { name: 'Taşımacılık & Nakliye', route: '/Hizmetler/Tasimacilik-Nakliye' },
      { name: 'Sanatçılar & Müzisyenler', route: '/Hizmetler/Sanatcilar-Muzisyenler' },
      { name: 'Diğer Hizmetler', route: '/Hizmetler/Diger-Hizmetler' }
    ]
  },
  'Ücretsiz & Takas': {
    popular: [
      'Ücretsiz Eşya', 'Kitap Takası', 'Elektronik Takas', 'Kıyafet Bağışı',
      'Mobilya Takası', 'Takaslık Telefon', 'Takaslık Araba'
    ],
    subcategories: [
      { name: 'Ücretsiz', route: '/Ucretsiz-Takas/Ucretsiz' },
      { name: 'Takas', route: '/Ucretsiz-Takas/Takas' },
      { name: 'Kiralama', route: '/Ucretsiz-Takas/Kiralama' }
    ]
  },
  'Eğitim & Kurslar': {
    popular: [
      'İngilizce Özel Ders', 'Matematik Özel Ders', 'Direksiyon Dersi',
      'Gitar & Piyano Dersi', 'Yazılım & Kodlama Kursu', 'Almanca Kursu',
      'Yüzme & Fitness Dersi', 'YKS & LGS Hazırlık'
    ],
    subcategories: [
      { name: 'Özel Ders', route: '/Egitim-Kurslar/Ozel-Ders' },
      { name: 'Dil Kursları', route: '/Egitim-Kurslar/Dil-Kurslari' },
      { name: 'Müzik & Şan Dersleri', route: '/Egitim-Kurslar/Muzik-San-Dersleri' },
      { name: 'Spor Kursları', route: '/Egitim-Kurslar/Spor-Kurslari' },
      { name: 'Dans Kursları', route: '/Egitim-Kurslar/Dans-Kurslari' }
    ]
  },
  'Komşu Yardımı': {
    popular: [
      'Komşu Dayanışması', 'Gönüllü Yardım', 'Mahalle İlanları',
      'Eşya Paylaşımı', 'Kayıp Eşya & Hayvan', 'Yaşlılara Destek'
    ],
    subcategories: []
  }
};

/**
 * Intelligent helper to get related searches for any page context
 * (Query, Category, SubCategory, or City)
 */
export function getRelatedSearches({ query = '', category = '', subCategory = '', city = '' }) {
  const results = {
    title: 'İlgili Aramalar',
    primaryPills: [],   // Main chips to display prominently
    secondaryPills: [], // Sub-chips (categories, sibling terms, or nearby cities)
    detectedCategory: null
  };

  const normalizedQuery = (query || '').toLowerCase().trim();

  // SCENARIO 1: USER PERFORMED A SEARCH (e.g., "lacoste ceket", "iphone 13", "kiralik daire")
  if (normalizedQuery) {
    const words = normalizedQuery.split(/\s+/).filter(w => !STOP_WORDS.has(w));
    
    // Check if any recognized brand exists in query
    let detectedBrand = null;
    for (const [key, bData] of Object.entries(BRAND_ECOSYSTEMS)) {
      if (normalizedQuery.includes(key)) {
        detectedBrand = bData;
        break;
      }
    }

    // Secondary brand alias checks (e.g. "iphone" -> Apple, "galaxy" -> Samsung, "ps5" -> Sony, "civic" -> Honda)
    if (!detectedBrand) {
      if (normalizedQuery.includes('iphone') || normalizedQuery.includes('ipad') || normalizedQuery.includes('macbook') || normalizedQuery.includes('airpods')) {
        detectedBrand = BRAND_ECOSYSTEMS.apple;
      } else if (normalizedQuery.includes('galaxy')) {
        detectedBrand = BRAND_ECOSYSTEMS.samsung;
      } else if (normalizedQuery.includes('amg')) {
        detectedBrand = BRAND_ECOSYSTEMS.mercedes;
      } else if (normalizedQuery.includes('m paket')) {
        detectedBrand = BRAND_ECOSYSTEMS.bmw;
      }
    }

    // Check if any recognized product exists in query
    let detectedProductList = null;
    for (const [pKey, pList] of Object.entries(PRODUCT_EXPANSIONS)) {
      if (normalizedQuery.includes(pKey)) {
        detectedProductList = pList;
        break;
      }
    }

    // Generate dynamic brand + product pills (e.g. "Lacoste Ceket" -> "Lacoste Mont", "Deri Ceket", etc.)
    const pillsSet = new Set();

    if (detectedBrand) {
      results.detectedCategory = detectedBrand.category;
      // Combine brand with related products
      detectedBrand.products.forEach(prod => {
        if (!normalizedQuery.includes(prod.toLowerCase())) {
          pillsSet.add(`${detectedBrand.name} ${prod}`);
        }
      });
      // Sibling brands for comparison
      detectedBrand.siblings.slice(0, 3).forEach(sib => {
        pillsSet.add(`${sib} ${words[words.length - 1] || 'Ürünleri'}`);
      });
    }

    if (detectedProductList) {
      detectedProductList.forEach(item => {
        if (!normalizedQuery.includes(item.toLowerCase())) {
          pillsSet.add(item);
        }
      });
    }

    // Add city-based query variants if city exists or common cities
    if (city) {
      pillsSet.add(`${city} ${normalizedQuery}`);
    } else {
      const topCities = ['İstanbul', 'Ankara', 'İzmir'];
      topCities.forEach(c => pillsSet.add(`${c} ${normalizedQuery}`));
    }

    results.primaryPills = Array.from(pillsSet).slice(0, 8).map(term => ({
      name: term,
      type: 'search',
      url: `/search?q=${encodeURIComponent(term)}`
    }));

    // Secondary: category suggestions
    const catData = CATEGORY_RELATED_DATA[category] || (detectedBrand ? CATEGORY_RELATED_DATA[detectedBrand.category] : null);
    if (catData && catData.subcategories) {
      results.secondaryPills = catData.subcategories.slice(0, 6).map(sub => ({
        name: sub.name,
        type: 'category',
        url: sub.route
      }));
    }

    return results;
  }

  // SCENARIO 2: CATEGORY OR SUBCATEGORY PAGE (e.g. Emlak, Kiralık Daire, Erkek Giyimi)
  const catKey = Object.keys(CATEGORY_RELATED_DATA).find(k => 
    k.toLowerCase() === (category || '').toLowerCase()
  ) || category;

  const catData = CATEGORY_RELATED_DATA[catKey];

  if (catData) {
    results.detectedCategory = catKey;

    // Primary: popular searches for this category
    const popularPills = (catData.popular || []).map(term => ({
      name: term,
      type: 'search',
      url: `/search?q=${encodeURIComponent(term)}`
    }));

    // If viewing a subcategory, put sibling subcategories at the front
    if (subCategory && catData.subcategories) {
      const siblingSubcats = catData.subcategories
        .filter(s => s.name.toLowerCase() !== subCategory.toLowerCase())
        .map(s => ({
          name: s.name,
          type: 'category',
          url: s.route
        }));
      results.primaryPills = [...siblingSubcats.slice(0, 5), ...popularPills.slice(0, 5)];
    } else {
      results.primaryPills = popularPills.slice(0, 9);
    }

    // Secondary: brands or subcategories or cities
    if (catData.brands && catData.brands.length > 0) {
      results.secondaryPills = catData.brands.map(b => ({
        name: b,
        type: 'brand',
        url: `/search?q=${encodeURIComponent(b)}`
      }));
    } else if (catData.subcategories && catData.subcategories.length > 0) {
      results.secondaryPills = catData.subcategories.map(s => ({
        name: s.name,
        type: 'category',
        url: s.route
      }));
    } else if (catData.cities) {
      results.secondaryPills = catData.cities.map(c => ({
        name: `${c} ${catKey}`,
        type: 'search',
        url: `/search?q=${encodeURIComponent(`${c} ${catKey}`)}`
      }));
    }
  }

  return results;
}
