import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { categories } from '../data/categories';

export const getCategoryPath = (categoryName, subcategoryName = null) => {
    const mainMappings = {
        'Tüm Kategoriler': 'Butun-Kategoriler',
        'Otomobil, Bisiklet & Tekne': 'Otomobil-Bisiklet-Tekne',
        'Otomobil, Bisiklet & Tekne Servisi': 'Otomobil-Bisiklet-Tekne',
        'Emlak': 'Emlak',
        'Ev & Bahçe': 'Ev-Bahce',
        'Moda & Güzellik': 'Moda-Guzellik',
        'Elektronik': 'Elektronik',
        'Evcil Hayvanlar': 'Evcil-Hayvanlar',
        'Aile, Çocuk & Bebek': 'Aile-Cocuk-Bebek',
        'İş İlanları': 'Is-Ilanlari',
        'Eğlence, Hobi & Mahalle': 'Eglence-Hobi-Mahalle',
        'Müzik, Film & Kitap': 'Muzik-Film-Kitap',
        'Biletler': 'Biletler',
        'Hizmetler': 'Hizmetler',
        'Ücretsiz & Takas': 'Ucretsiz-Takas',
        'Eğitim & Kurslar': 'Egitim-Kurslar',
        'Dersler & Kurslar': 'Egitim-Kurslar',
        'Komşu Yardımı': 'Komsu-Yardimi'
    };

    const subMappings = {
        // Auto, Rad & Boot
        'Otomobiller': 'Otomobiller',
        'Bisiklet & Aksesuarlar': 'Bisiklet-Aksesuarlar',
        'Bisiklet & Aksesuarları': 'Bisiklet-Aksesuarlar',
        'Oto Parça & Lastik': 'Oto-Parca-Lastik',
        'Tekne & Tekne Malzemeleri': 'Tekne-Tekne-Malzemeleri',
        'Motosiklet & Scooter': 'Motosiklet-Scooter',
        'Motosiklet Parça & Aksesuarlar': 'Motosiklet-Parca-Aksesuarlar',
        'Ticari Araçlar & Römorklar': 'Ticari-Araclar-Romorklar',
        'Tamir & Servis': 'Tamir-Servis',
        'Karavan & Motokaravan': 'Karavan-Motokaravan',
        'Diğer Otomobil, Bisiklet & Tekne': 'Diger-Otomobil-Bisiklet-Tekne',

        // Immobilien
        'Geçici Konaklama & Paylaşımlı Ev': 'Gecici-Konaklama-Paylasimli-Ev',
        'Geçici Konaklama & Paylaşımlı Oda': 'Gecici-Konaklama-Paylasimli-Ev',
        'Gecici Konaklamalar': 'Gecici-Konaklama-Paylasimli-Ev',
        'Konteyner': 'Konteyner',
        'Satılık Daireler': 'Satilik-Daireler',
        'Satılık Daire': 'Satilik-Daireler',
        'Satılık Yazlık': 'Satilik-Yazlik',
        'Tatil Evi & Yurt Dışı Emlak': 'Tatil-Evi-Yurt-Disi-Emlak',
        'Tatil ve Yurt Dışı Emlak': 'Tatil-Evi-Yurt-Disi-Emlak',
        'Garaj & Otopark': 'Garaj-Otopark',
        'Garaj & Park Yeri': 'Garaj-Otopark',
        'Ticari Emlak': 'Ticari-Emlak',
        'Arsa & Bahçe': 'Arsa-Bahce',
        'Satılık Evler': 'Satilik-Evler',
        'Satılık Müstakil Ev': 'Satilik-Evler',
        'Satılık Ev': 'Satilik-Evler',
        'Kiralık Evler': 'Kiralik-Evler',
        'Kiralık Müstakil Ev': 'Kiralik-Evler',
        'Kiralık Ev': 'Kiralik-Evler',
        'Kiralık Daireler': 'Kiralik-Daireler',
        'Kiralık Daire': 'Kiralik-Daireler',
        'Yeni Projeler': 'Yeni-Projeler',
        'Taşımacılık & Nakliye': 'Tasimacilik-Nakliye',
        'Diğer Emlak': 'Diger-Emlak',

        // Haus & Garten
        'Banyo': 'Banyo',
        'Ofis': 'Ofis',
        'Dekorasyon': 'Dekorasyon',
        'Ev Hizmetleri': 'Ev-Hizmetleri',
        'Bahçe Malzemeleri & Bitkiler': 'Bahce-Malzemeleri-Bitkiler',
        'Ev Tekstili': 'Ev-Tekstili',
        'Ev Tadilatı': 'Ev-Tadilati',
        'Yapı Market & Tadilat': 'Ev-Tadilati',
        'Mutfak & Yemek Odası': 'Mutfak-Yemek-Odasi',
        'Lamba & Aydınlatma': 'Lamba-Aydinlatma',
        'Aydınlatma': 'Lamba-Aydinlatma',
        'Yatak Odası': 'Yatak-Odasi',
        'Oturma Odası': 'Oturma-Odasi',
        'Diğer Ev & Bahçe': 'Diger-Ev-Bahce',

        // Moda & Güzellik
        'Güzellik & Sağlık': 'Guzellik-Saglik',
        'Kadın Giyimi': 'Kadin-Giyimi',
        'Kadın Ayakkabıları': 'Kadin-Ayakkabilari',
        'Erkek Giyimi': 'Erkek-Giyimi',
        'Erkek Ayakkabıları': 'Erkek-Ayakkabilari',
        'Çanta & Aksesuarlar': 'Canta-Aksesuarlar',
        'Saat & Takı': 'Saat-Taki',
        'Diğer Moda & Güzellik': 'Diger-Moda-Guzellik',

        // Elektronik
        'Ses & Hifi': 'Ses-Hifi',
        'Elektronik Servisler': 'Elektronik-Hizmetler',
        'Elektronik Hizmetler': 'Elektronik-Hizmetler',
        'Fotoğraf & Kamera': 'Fotograf-Kamera',
        'Cep Telefonu & Aksesuar': 'Cep-Telefonu-Telefon',
        'Cep Telefonu & Telefon': 'Cep-Telefonu-Telefon',
        'Beyaz Eşya & Ev Aletleri': 'Ev-Aletleri',
        'Ev Aletleri': 'Ev-Aletleri',
        'Oyun Konsolları': 'Konsollar',
        'Konsollar': 'Konsollar',
        'Dizüstü Bilgisayar': 'Dizustu-Bilgisayarlar',
        'Dizüstü Bilgisayarlar': 'Dizustu-Bilgisayarlar',
        'Masaüstü Bilgisayar': 'Bilgisayarlar',
        'Bilgisayarlar': 'Bilgisayarlar',
        'Bilgisayar Aksesuar & Yazılım': 'Bilgisayar-Aksesuarlari-Yazilim',
        'Bilgisayar Aksesuarları & Yazılım': 'Bilgisayar-Aksesuarlari-Yazilim',
        'Tablet & E-Okuyucu': 'Tabletler-E-Okuyucular',
        'Tabletler & E-Okuyucular': 'Tabletler-E-Okuyucular',
        'TV & Video': 'TV-Video',
        'Video Oyunları': 'Video-Oyunlari',
        'Diğer Elektronik': 'Diger-Elektronik',

        // Evcil Hayvanlar
        'Balıklar': 'Baliklar',
        'Köpekler': 'Kopekler',
        'Kediler': 'Kedi',
        'Küçük Hayvanlar': 'Kucuk-Hayvanlar',
        'Çiftlik Hayvanları': 'Ciftlik-Hayvanlari',
        'Atlar': 'Atlar',
        'Hayvan Bakımı & Eğitimi': 'Hayvan-Bakimi-Egitimi',
        'Hayvan Bakımı & Eğitim': 'Hayvan-Bakimi-Egitimi',
        'Kayıp Hayvanlar': 'Kayip-Hayvanlar',
        'Kuşlar': 'Kuslar',
        'Aksesuarlar': 'Aksesuarlar',

        // Aile, Çocuk & Bebek
        'Yaşlı Bakımı': 'Yasli-Bakimi',
        'Bebek & Çocuk Giyimi': 'Bebek-Cocuk-Giyimi',
        'Bebek & Çocuk Ayakkabıları': 'Bebek-Cocuk-Ayakkabilari',
        'Bebek Ekipmanları': 'Bebek-Ekipmanlari',
        'Oto Koltukları': 'Oto-Koltuklari',
        'Bebek Koltuğu & Oto Koltukları': 'Oto-Koltuklari',
        'Babysitter & Çocuk Bakımı': 'Babysitter-Cocuk-Bakimi',
        'Bebek Arabaları & Pusetler': 'Bebek-Arabalari-Pusetler',
        'Çocuk Odası Mobilyaları': 'Cocuk-Odasi-Mobilyalari',
        'Bebek Odası Mobilyaları': 'Cocuk-Odasi-Mobilyalari',
        'Oyuncaklar': 'Oyuncaklar',
        'Oyuncak': 'Oyuncaklar',
        'Diğer Aile, Çocuk & Bebek': 'Diger-Aile-Cocuk-Bebek',

        // İş İlanları
        'Mesleki Eğitim': 'Mesleki-Egitim',
        'İnşaat, Zanaat & Üretim': 'Insaat-Sanat-Uretim',
        'İnşaat, El Sanatları & Üretim': 'Insaat-Sanat-Uretim',
        'Büro İşleri & Yönetim': 'Buroarbeit-Yonetim',
        'Büroarbeit & Yönetim': 'Buroarbeit-Yonetim',
        'Ofis İşleri & Yönetim': 'Buroarbeit-Yonetim',
        'Büroarbeit-Yonetim': 'Buroarbeit-Yonetim',
        'Gastronomi & Turizm': 'Gastronomi-Turizm',
        'Müşteri Hizmetleri & Çağrı Merkezi': 'Musteri-Hizmetleri-Cagri-Merkezi',
        'Yarı Zamanlı & Ek İşler': 'Ek-Isler',
        'Mini & Ek İşler': 'Ek-Isler',
        'Ek İşler': 'Ek-Isler',
        'Staj': 'Staj',
        'Sosyal Sektör & Bakım': 'Sosyal-Sektor-Bakim',
        'Nakliye, Lojistik & Trafik': 'Tasimacilik-Lojistik',
        'Taşımacılık & Lojistik': 'Tasimacilik-Lojistik',
        'Satış, Satın Alma & Pazarlama': 'Satis-Pazarlama',
        'Satış & Pazarlama': 'Satis-Pazarlama',
        'Diğer İş İlanları': 'Diger-Is-Ilanlari',

        // Eğlence, Hobi & Mahalle
        'Ezoterizm & Spiritüalizm': 'Ezoterizm-Spiritualizm',
        'Yiyecek & İçecek': 'Yiyecek-Icecek',
        'Boş Zaman Aktiviteleri': 'Bos-Zaman-Aktiviteleri',
        'El Sanatları & Hobi': 'El-Sanatlari-Hobi',
        'Sanat & Antikalar': 'Sanat-Antikalar',
        'Sanatçılar & Müzisyenler': 'Sanatcilar-Muzisyenler',
        'Model Yapımı': 'Model-Yapimi',
        'Seyahat & Etkinlik Hizmetleri': 'Seyahat-Etkinlik-Hizmetleri',
        'Koleksiyon': 'Koleksiyon',
        'Spor & Kamp': 'Spor-Kamp',
        'Bit Pazarı': 'Bit-Pazari',
        'Kayıp & Buluntu': 'Kayip-Buluntu',
        'Diğer Eğlence, Hobi & Mahalle': 'Diger-Eglence-Hobi-Mahalle',

        // Müzik, Film & Kitap
        'Kitap & Dergi': 'Kitap-Dergi',
        'Kırtasiye': 'Kirtasiye',
        'Çizgi Romanlar': 'Cizgi-Romanlar',
        'Ders Kitapları, Okul & Eğitim': 'Ders-Kitaplari-Okul-Egitim',
        'Film & DVD': 'Film-DVD',
        'Müzik & CD\'ler': 'Muzik-CDler',
        'Müzik Enstrümanları': 'Muzik-Enstrumanlari',
        'Diğer Müzik, Film & Kitap': 'Diger-Muzik-Film-Kitap',

        // Biletler
        'Tren & Toplu Taşıma': 'Tren-Toplu-Tasima',
        'Komedi & Kabare': 'Komedi-Kabare',
        'Hediye Kartları': 'Hediye-Kartlari',
        'Hediye Çekleri': 'Hediye-Kartlari',
        'Çocuk': 'Cocuk',
        'Çocuk Etkinlikleri': 'Cocuk',
        'Konserler': 'Konserler',
        'Spor': 'Spor',
        'Spor Etkinlikleri': 'Spor',
        'Tiyatro & Müzikal': 'Tiyatro-Muzikal',
        'Diğer Biletler': 'Diger-Biletler',

        // Hizmetler
        'Otomobil, Bisiklet & Tekne Servisi': 'Otomobil-Bisiklet-Tekne-Servisi',
        'Yaşlı Bakımı': 'Yasli-Bakimi',
        'Bebek Bakıcısı & Kreş': 'Babysitter-Cocuk-Bakimi',
        'Babysitter & Çocuk Bakımı': 'Babysitter-Cocuk-Bakimi',
        'Elektronik': 'Elektronik',
        'Elektronik Servisler': 'Elektronik-Hizmetler',
        'Ev & Bahçe': 'Ev-Bahce',
        'Ev & Bahçe Hizmetleri': 'Ev-Hizmetleri',
        'Ev Hizmetleri': 'Ev-Hizmetleri',
        'Sanatçılar & Müzisyenler': 'Sanatcilar-Muzisyenler',
        'Seyahat & Etkinlik': 'Seyahat-Etkinlik',
        'Hayvan Bakımı & Eğitimi': 'Hayvan-Bakimi-Egitimi',
        'Taşımacılık & Nakliye': 'Tasimacilik-Nakliye',
        'Diğer Hizmetler': 'Diger-Hizmetler',

        // Ücretsiz & Takas
        'Takas': 'Takas',
        'Ödünç Verme': 'Kiralama',
        'Kiralama': 'Kiralama',
        'Ücretsiz': 'Ucretsiz',
        'Ücretsiz Verilecekler': 'Ucretsiz',

        // Eğitim & Kurslar
        'Bilgisayar Kursları': 'Bilgisayar-Kurslari',
        'Ezoterizm & Spiritüalizm': 'Ezoterizm-Spiritualizm',
        'Yemek & Pastacılık': 'Yemek-Pastacilik-Kurslari',
        'Yemek & Pastacılık Kursları': 'Yemek-Pastacilik-Kurslari',
        'Sanat & Tasarım': 'Sanat-Tasarim-Kurslari',
        'Sanat & Tasarım Kursları': 'Sanat-Tasarim-Kurslari',
        'Müzik & Şan': 'Muzik-San-Dersleri',
        'Müzik & Şan Dersleri': 'Muzik-San-Dersleri',
        'Özel Ders': 'Ozel-Ders',
        'Spor Kursları': 'Spor-Kurslari',
        'Dil Kursları': 'Dil-Kurslari',
        'Dans Kursları': 'Dans-Kurslari',
        'Sürekli Eğitim': 'Surekli-Egitim',
        'Diğer Dersler & Kurslar': 'Diger-Dersler-Kurslar',
        'Diğer Eğitim & Kurslar': 'Diger-Dersler-Kurslar',

        // Komşu Yardımı
        'Komşu Yardımı': 'Komsu-Yardimi'
    };

    const slugify = (text) => {
        const trMap = {
            'ç': 'c', 'Ç': 'C', 'ğ': 'g', 'Ğ': 'G', 'ş': 's', 'Ş': 'S',
            'ı': 'i', 'İ': 'I', 'ö': 'o', 'Ö': 'O', 'ü': 'u', 'Ü': 'U'
        };
        for (let key in trMap) {
            text = text.replace(new RegExp(key, 'g'), trMap[key]);
        }
        return text.replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
    };

    const catSlug = mainMappings[categoryName] || slugify(categoryName);
    if (!subcategoryName || subcategoryName === 'Tümü' || subcategoryName === 'Alle' || subcategoryName === 'Tüm' || subcategoryName === categoryName) {
        return `/${catSlug}`;
    }

    const subSlug = subMappings[subcategoryName] || slugify(subcategoryName);
    return `/${catSlug}/${subSlug}`;
};


export const CategorySidebar = ({ selectedCategory, setSelectedCategory }) => {
    const [expandedCategories, setExpandedCategories] = useState([]);
    const [categoriesWithCounts, setCategoriesWithCounts] = useState(categories);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCategoryCounts = async () => {
            try {
                const { fetchCategoryCounts: fetchCounts } = await import('../api/listings');
                const allListings = await fetchCounts();
                const counts = {};

                allListings.forEach(listing => {
                    let cat = listing.category;
                    const subCat = listing.sub_category;

                    if (cat === 'Musik, Film & Bücher' || cat === 'Musik, Filme & Bücher') {
                        cat = 'Müzik, Film & Kitap';
                    }
                    if (cat === 'Immobilien') {
                        cat = 'Emlak';
                    }

                    counts[cat] = (counts[cat] || 0) + 1;
                    if (subCat) {
                        const key = `${cat}:${subCat}`;
                        counts[key] = (counts[key] || 0) + 1;
                    }
                });

                const updatedCategories = categories.map(category => {
                    if (category.name === 'Tüm Kategoriler') {
                        return { ...category, count: allListings.length };
                    }

                    const mainCount = counts[category.name] || 0;
                    const updatedSubcategories = category.subcategories?.map(sub => ({
                        ...sub,
                        count: counts[`${category.name}:${sub.name}`] || 0
                    }));

                    return {
                        ...category,
                        count: mainCount,
                        subcategories: updatedSubcategories || category.subcategories
                    };
                });

                setCategoriesWithCounts(updatedCategories);
            } catch (error) {
                console.error('Error fetching category counts:', error);
            }
        };

        fetchCategoryCounts();
    }, []);

    const toggleCategory = (categoryName) => {
        setExpandedCategories(prev =>
            prev.includes(categoryName)
                ? prev.filter(c => c !== categoryName)
                : [...prev, categoryName]
        );
    };

    return (
        <aside className="w-96 flex-shrink-0 bg-white rounded-2xl shadow-lg p-6 h-fit border border-gray-100 hidden lg:block">
            <h3 className="font-bold text-gray-900 mb-5 text-lg">Kategoriler</h3>
            <div className="space-y-1.5">
                {categoriesWithCounts.map((category) => (
                    <div key={category.name}>
                        <button
                            onClick={() => {
                                if (category.subcategories) {
                                    toggleCategory(category.name);
                                } else {
                                    const url = getCategoryPath(category.name);
                                    navigate(url);
                                    setSelectedCategory(category.name);
                                }
                            }}
                            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 text-left ${selectedCategory === category.name
                                ? 'bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-md'
                                : 'hover:bg-gray-50 text-gray-700 hover:shadow-sm'
                                }`}
                        >
                            <span className="font-semibold text-sm flex-grow">{category.name}</span>
                            <div className="flex items-center gap-2">
                                {category.count > 0 && (
                                    <span className={`text-xs px-2 py-0.5 rounded-full ${selectedCategory === category.name ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'}`}>
                                        {category.count.toLocaleString('tr-TR')}
                                    </span>
                                )}
                                {category.subcategories && (
                                    <div className={`p-1 rounded-lg transition-colors ${selectedCategory === category.name ? 'hover:bg-white/10' : 'hover:bg-gray-200'}`}>
                                        <svg
                                            className={`w-4 h-4 transition-transform duration-200 ${expandedCategories.includes(category.name) ? 'rotate-180' : ''} ${selectedCategory === category.name ? 'text-white' : 'text-gray-400'}`}
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>
                                )}
                            </div>
                        </button>
                        {category.subcategories && expandedCategories.includes(category.name) && (
                            <div className="mt-1 ml-4 space-y-1 px-2 animate-in slide-in-from-top-1 duration-200">
                                {category.subcategories.map((sub) => (
                                    <button
                                        key={sub.name}
                                        onClick={() => {
                                            const url = getCategoryPath(category.name, sub.name);
                                            navigate(url);
                                            setSelectedCategory(sub.name);
                                        }}
                                        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all ${selectedCategory === sub.name
                                            ? 'bg-red-50 text-red-600 font-bold'
                                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                            }`}
                                    >
                                        <span>{sub.name}</span>
                                        {sub.count > 0 && (
                                            <span className="text-[10px] text-gray-400 font-medium">
                                                {sub.count.toLocaleString('tr-TR')}
                                            </span>
                                        )}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </aside>
    );
};
