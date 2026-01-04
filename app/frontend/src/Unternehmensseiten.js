import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTurkishCities, t } from './translations';

const Unternehmensseiten = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');

    // Filter states
    const [showUnternehmenDropdown, setShowUnternehmenDropdown] = useState(false);
    const [showOrtDropdown, setShowOrtDropdown] = useState(false);
    const [showKategorieDropdown, setShowKategorieDropdown] = useState(false);
    const [showPreisDropdown, setShowPreisDropdown] = useState(false);

    const [selectedUnternehmen, setSelectedUnternehmen] = useState('Tüm İşletmeler');
    const [selectedOrt, setSelectedOrt] = useState('Tüm Şehirler');
    const [selectedKategorie, setSelectedKategorie] = useState('Tüm Kategoriler');
    const [selectedPreis, setSelectedPreis] = useState('Tüm Fiyatlar');
    const [showBWCities, setShowBWCities] = useState(false);
    const [showCategorySubmenu, setShowCategorySubmenu] = useState(null); // stores category name when showing subcategories
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [hideVB, setHideVB] = useState(false);

    const turkishCities = getTurkishCities();

    // Categories with subcategories
    const categories = {
        'Oto, Bisiklet & Tekne': ['Otomobil', 'Oto Parça & Lastik', 'Tekne & Aksesuarları', 'Bisiklet & Aksesuarları', 'Motosiklet & Scooter', 'Motosiklet Parça & Aksesuar', 'Ticari Araç & Römork', 'Tamir & Servis', 'Karavan & Karavan Ekipmanı', 'Diğer Oto, Bisiklet & Tekne'],
        'Emlak': ['Geçici Konaklama & Paylaşımlı Oda', 'Konteyner', 'Satılık Daire', 'Tatil ve Yurt Dışı Emlak', 'Garaj & Park Yeri', 'Ticari Emlak', 'Arsa & Bahçe', 'Satılık Müstakil Ev', 'Kiralık Müstakil Ev', 'Kiralık Daire', 'Yeni Projeler', 'Nakliye & Taşıma', 'Diğer Emlak'],
        'Ev & Bahçe': ['Banyo', 'Ofis', 'Dekorasyon', 'Ev & Bahçe Hizmetleri', 'Bahçe Malzemeleri & Bitkiler', 'Ev Tekstili', 'Yapı Market & Tadilat', 'Mutfak & Yemek Odası', 'Aydınlatma', 'Yatak Odası', 'Oturma Odası', 'Diğer Ev & Bahçe'],
        'Moda & Güzellik': ['Kişisel Bakım & Sağlık', 'Kadın Giyim', 'Kadın Ayakkabı', 'Erkek Giyim', 'Erkek Ayakkabı', 'Çanta & Aksesuar', 'Saat & Takı', 'Diğer Moda & Güzellik'],
        'Elektronik': ['Ses & Hifi', 'Elektronik Servisler', 'Fotoğraf & Kamera', 'Cep Telefonu & Aksesuar', 'Beyaz Eşya & Ev Aletleri', 'Oyun Konsolları', 'Dizüstü Bilgisayar', 'Masaüstü Bilgisayar', 'Bilgisayar Aksesuar & Yazılım', 'Tablet & E-Okuyucu', 'TV & Video', 'Video Oyunları', 'Diğer Elektronik'],
        'Evcil Hayvanlar': ['Balık', 'Köpek', 'Kedi', 'Küçükbaş Hayvanlar', 'Kümes Hayvanları', 'At', 'Evcil Hayvan Bakımı & Eğitim', 'Kayıp Hayvanlar', 'Kuş', 'Hayvan Aksesuarları'],
        'Aile, Çocuk & Bebek': ['Yaşlı Bakımı', 'Bebek & Çocuk Giyimi', 'Bebek & Çocuk Ayakkabıları', 'Bebek Ekipmanları', 'Bebek Koltuğu & Oto Koltukları', 'Bebek Bakıcısı & Kreş', 'Bebek Arabaları & Pusetler', 'Bebek Odası Mobilyaları', 'Oyuncak', 'Diğer Aile, Çocuk & Bebek'],
        'İş İlanları': ['Eğitim / Meslek Eğitimi', 'İnşaat, Sanat & Üretim', 'Ofis İşleri & Yönetim', 'Gastronomi & Turizm', 'Müşteri Hizmetleri & Çağrı Merkezi', 'Yarı Zamanlı & Ek İşler', 'Staj', 'Sosyal Sektör & Bakım', 'Taşıma, Lojistik & Ulaşım', 'Satış, Satın Alma & Pazarlama', 'Diğer İşler'],
        'Hobiler & Komşuluk': ['Ezoterik & Spiritüel', 'Yeme & İçme', 'Boş Zaman Aktiviteleri', 'El Sanatları & Sanatsal Çalışmalar', 'Sanat & Antika', 'Müzik & Film', 'Müzik Enstrümanları', 'Koleksiyon', 'Spor & Kamp', 'Biletler', 'Diğer Hobiler & Komşuluk'],
        'Dersler & Kurslar': ['Bilgisayar', 'Ezoterik & Spiritüel', 'Müzik & Şan Dersleri', 'Özel Ders', 'Dil Kursları', 'Spor Kursları', 'Mesleki Eğitim', 'Diğer Dersler & Kurslar'],
        'Mahalle Yardımı': ['Mahalle Yardımı']
    };


    // Import mockSellers from components
    const mockSellers = {
        1: {
            name: 'Ali Yılmaz',
            phone: '+90 532 123 45 67',
            email: 'ali@gmail.com',
            address: 'Atatürk Cad. No:12, 34000 İstanbul',
            city: 'İstanbul',
            website: 'www.ali-handel.de',
            memberSince: '2020-03-15',
            rating: 4.8,
            totalRatings: 127,
            responseRate: '98%',
            responseTime: '1 saat',
            profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
            sellerType: 'Gewerblicher Nutzer',
            totalListings: 45,
            followers: 156,
            following: 12
        },
        2: {
            name: 'Ayşe Demir',
            phone: '+90 542 987 65 43',
            email: 'ayse@hotmail.com',
            address: 'Ziya Gökalp Bulvarı 45, 06000 Ankara',
            city: 'Ankara',
            website: 'www.ayse-design.com',
            memberSince: '2021-06-22',
            rating: 4.9,
            totalRatings: 84,
            responseRate: '100%',
            responseTime: '30 dk',
            profileImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
            sellerType: 'Privater Nutzer',
            totalListings: 12,
            followers: 42,
            following: 8
        },
        3: {
            name: 'Fatma Kaya',
            phone: '+90 555 555 55 55',
            email: 'fatma@web.de',
            address: 'Liman Cad. No:8, 35000 İzmir',
            city: 'İzmir',
            website: null,
            memberSince: '2019-11-05',
            rating: 4.5,
            totalRatings: 215,
            responseRate: '92%',
            responseTime: '2 saat',
            profileImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
            sellerType: 'Gewerblicher Nutzer',
            totalListings: 89,
            followers: 312,
            following: 45
        },
        4: {
            name: 'Mehmet Öz',
            phone: '555-444-5555',
            email: 'mehmet@gmail.com',
            city: 'İstanbul',
            memberSince: '2023-01-10',
            rating: 5.0,
            totalRatings: 12,
            totalListings: 3,
            sellerType: 'Gewerblicher Nutzer',
            profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
        },
        6: {
            name: 'Zeynep Tunç',
            phone: '555-666-7788',
            email: 'zeynep@gmail.com',
            city: 'Ankara',
            memberSince: '2020-09-12',
            rating: 4.8,
            totalRatings: 156,
            totalListings: 31,
            sellerType: 'Gewerblicher Nutzer',
            profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
        },
        9: {
            name: 'Elif Rad',
            businessCategory: 'Fahrrad Handel',
            phone: '+90 224 123 45 67',
            email: 'info@elifrad.de',
            address: 'Mudanya Cad. No:5, 16000 Bursa',
            city: 'Bursa',
            website: 'www.elifrad.de',
            memberSince: '2018-03-15',
            rating: 4.9,
            totalRatings: 245,
            responseRate: '99%',
            responseTime: '30 dk',
            profileImage: 'https://www.elifrad.de/images/IMG_2158.JPG',
            sellerType: 'Gewerblicher Nutzer',
            totalListings: 87,
            followers: 423,
            following: 15
        }
    };

    // Filter only commercial sellers
    const companies = Object.entries(mockSellers)
        .map(([id, seller]) => ({ ...seller, id }))
        .filter(seller => seller.sellerType === 'Gewerblicher Nutzer')
        .filter(company =>
            (selectedOrt === 'Tüm Şehirler' || company.city === selectedOrt) &&
            (selectedKategorie === 'Tüm Kategoriler' || company.businessCategory === selectedKategorie) &&
            (!searchTerm ||
                company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (company.address && company.address.toLowerCase().includes(searchTerm.toLowerCase())))
        );

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-[1400px] mx-auto px-4 py-6">
                {/* Back Button */}
                <button
                    onClick={() => navigate('/')}
                    className="mb-4 text-red-500 hover:text-red-600 flex items-center gap-2"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Zurück zur Startseite
                </button>

                {/* Red Banner */}
                <div className="bg-red-600 rounded-2xl shadow-xl p-8 mb-6 relative overflow-hidden">
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-0 left-0 w-full h-full" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,.1) 35px, rgba(255,255,255,.1) 70px)' }}></div>
                    </div>

                    <div className="relative z-10">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                                    <svg className="w-10 h-10 text-white" viewBox="0 0 64 64" fill="none" stroke="currentColor">
                                        <rect x="20" y="16" width="24" height="32" strokeWidth="2.5" fill="currentColor" opacity="0.3" rx="2" />
                                        <rect x="20" y="16" width="24" height="32" strokeWidth="2.5" rx="2" />
                                        <path d="M26 22 L38 22 M26 28 L38 28 M26 34 L38 34 M26 40 L32 40" strokeWidth="2" strokeLinecap="round" />
                                    </svg>
                                </div>
                                <div>
                                    <h1 className="text-4xl font-bold text-white mb-1">Türkiye'deki İşletme Sayfaları</h1>
                                    <p className="text-white text-lg opacity-90">Platformumuzdaki kurumsal satıcılar</p>
                                </div>
                            </div>

                            <div className="hidden lg:flex items-center gap-6 text-white">
                                <div className="text-center">
                                    <div className="text-3xl font-bold">{companies.length}</div>
                                    <div className="text-sm opacity-80">İşletme</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filter Buttons */}
                <div className="flex gap-3 mb-6">
                    {/* Unternehmen Filter */}
                    <div className="relative">
                        <button
                            onClick={() => setShowUnternehmenDropdown(!showUnternehmenDropdown)}
                            className="px-4 py-2.5 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 text-sm font-medium text-gray-700"
                        >
                            İşletmeler
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>

                        {/* Dropdown Menu */}
                        {showUnternehmenDropdown && (
                            <div className="absolute top-full mt-2 left-0 bg-white border border-gray-200 rounded-lg shadow-lg py-2 w-80 z-10">
                                {/* Options */}
                                <button
                                    onClick={() => {
                                        setSelectedUnternehmen('Yerel İşletmeler');
                                        setShowUnternehmenDropdown(false);
                                    }}
                                    className="w-full text-left px-4 py-2.5 hover:bg-gray-100 text-sm text-gray-700 transition-colors flex items-center justify-between"
                                >
                                    <span>Yerel İşletmeler</span>
                                    {selectedUnternehmen === 'Yerel İşletmeler' && (
                                        <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    )}
                                </button>

                                <button
                                    onClick={() => {
                                        setSelectedUnternehmen('Yerel işletmelerin ilanları');
                                        setShowUnternehmenDropdown(false);
                                    }}
                                    className="w-full text-left px-4 py-2.5 hover:bg-gray-100 text-sm text-gray-700 transition-colors flex items-center justify-between"
                                >
                                    <span>Yerel işletmelerin ilanları</span>
                                    {selectedUnternehmen === 'Yerel işletmelerin ilanları' && (
                                        <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Ort Filter */}
                    <div className="relative">
                        <button
                            onClick={() => setShowOrtDropdown(!showOrtDropdown)}
                            className="px-4 py-2.5 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 text-sm font-medium text-gray-700"
                        >
                            Şehir seçin
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>

                        {/* Dropdown Menu */}
                        {showOrtDropdown && (
                            <div className="absolute top-full mt-2 left-0 bg-white border border-gray-200 rounded-lg shadow-lg py-2 w-80 z-10 max-h-96 overflow-y-auto">
                                {/* Deutschland Option */}
                                <button
                                    onClick={() => {
                                        setSelectedOrt('Alle Orte');
                                        setShowOrtDropdown(false);
                                    }}
                                    className="w-full text-left px-4 py-2.5 hover:bg-gray-100 text-sm text-gray-700 transition-colors flex items-center justify-between font-medium"
                                >
                                    <span>Türkei</span>
                                    {selectedOrt === 'Alle Orte' && (
                                        <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    )}
                                </button>

                                {/* Divider */}
                                <div className="border-t border-gray-200 my-2"></div>

                                {/* German States */}
                                {getTurkishCities().map((city) => (
                                    <button
                                        key={city}
                                        onClick={() => {
                                            setSelectedOrt(city);
                                            setShowOrtDropdown(false);
                                        }}
                                        className="w-full text-left px-4 py-2.5 hover:bg-gray-100 text-sm text-gray-700 transition-colors flex items-center justify-between"
                                    >
                                        <span>{city}</span>
                                        {selectedOrt === city && (
                                            <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        )}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Kategorie Filter */}
                    <div className="relative">
                        <button
                            onClick={() => setShowKategorieDropdown(!showKategorieDropdown)}
                            className="px-4 py-2.5 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 text-sm font-medium text-gray-700"
                        >
                            Kategori seçin
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>

                        {/* Dropdown Menu */}
                        {showKategorieDropdown && (
                            <div className="absolute top-full mt-2 left-0 bg-white border border-gray-200 rounded-lg shadow-lg py-2 w-80 z-10 max-h-96 overflow-y-auto">
                                {!showCategorySubmenu ? (
                                    // Main categories list
                                    <>
                                        <button
                                            onClick={() => {
                                                setSelectedKategorie('Alle Kategorien');
                                                setShowKategorieDropdown(false);
                                            }}
                                            className="w-full text-left px-4 py-2.5 hover:bg-gray-100 text-sm text-gray-700 transition-colors flex items-center justify-between font-medium"
                                        >
                                            <span>Alle Kategorien</span>
                                            {selectedKategorie === 'Alle Kategorien' && (
                                                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                            )}
                                        </button>

                                        <div className="border-t border-gray-200 my-2"></div>

                                        {Object.keys(categories).map((category) => (
                                            <button
                                                key={category}
                                                onClick={() => {
                                                    if (categories[category].length > 1) {
                                                        setShowCategorySubmenu(category);
                                                    } else {
                                                        setSelectedKategorie(category);
                                                        setShowKategorieDropdown(false);
                                                    }
                                                }}
                                                className="w-full text-left px-4 py-2.5 hover:bg-gray-100 text-sm text-gray-700 transition-colors flex items-center justify-between"
                                            >
                                                <span>{category}</span>
                                                {categories[category].length > 1 ? (
                                                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                    </svg>
                                                ) : selectedKategorie === category && (
                                                    <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                )}
                                            </button>
                                        ))}
                                    </>
                                ) : (
                                    // Subcategories submenu
                                    <>
                                        <button
                                            onClick={() => setShowCategorySubmenu(null)}
                                            className="w-full text-left px-4 py-2.5 hover:bg-gray-100 text-sm font-medium text-gray-900 transition-colors flex items-center gap-2 border-b border-gray-200"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                            </svg>
                                            Geri
                                        </button>

                                        <button
                                            onClick={() => {
                                                setSelectedKategorie(showCategorySubmenu);
                                                setShowKategorieDropdown(false);
                                                setShowCategorySubmenu(null);
                                            }}
                                            className="w-full text-left px-4 py-2.5 hover:bg-gray-100 text-sm text-gray-700 transition-colors flex items-center justify-between font-medium"
                                        >
                                            <span>Tüm {showCategorySubmenu} kategorisinde ara</span>
                                            {selectedKategorie === showCategorySubmenu && (
                                                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                            )}
                                        </button>

                                        {categories[showCategorySubmenu].map((subcategory) => (
                                            <button
                                                key={subcategory}
                                                onClick={() => {
                                                    setSelectedKategorie(subcategory);
                                                    setShowKategorieDropdown(false);
                                                    setShowCategorySubmenu(null);
                                                }}
                                                className="w-full text-left px-4 py-2.5 hover:bg-gray-100 text-sm text-gray-700 transition-colors flex items-center justify-between"
                                            >
                                                <span>{subcategory}</span>
                                                {selectedKategorie === subcategory && (
                                                    <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                )}
                                            </button>
                                        ))}
                                    </>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Preis Filter */}
                    <div className="relative">
                        <button
                            onClick={() => setShowPreisDropdown(!showPreisDropdown)}
                            className="px-4 py-2.5 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 text-sm font-medium text-gray-700"
                        >
                            Fiyat seçin
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>

                        {/* Dropdown Menu */}
                        {showPreisDropdown && (
                            <div className="absolute top-full mt-2 left-0 bg-white border border-gray-200 rounded-lg shadow-lg p-4 w-80 z-10">
                                <div className="space-y-4">
                                    {/* Price Range Inputs */}
                                    <div className="flex items-center gap-3">
                                        {/* Min Price */}
                                        <div className="flex-1">
                                            <label className="block text-xs font-medium text-gray-700 mb-1">En Az Fiyat (₺)</label>
                                            <input
                                                type="number"
                                                value={minPrice}
                                                onChange={(e) => setMinPrice(e.target.value)}
                                                placeholder="0"
                                                className="w-full px-2 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
                                            />
                                        </div>

                                        {/* Divider */}
                                        <div className="text-gray-400 pt-5">-</div>

                                        {/* Max Price */}
                                        <div className="flex-1">
                                            <label className="block text-xs font-medium text-gray-700 mb-1">En Fazla Fiyat (₺)</label>
                                            <input
                                                type="number"
                                                value={maxPrice}
                                                onChange={(e) => setMaxPrice(e.target.value)}
                                                placeholder="∞"
                                                className="w-full px-2 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
                                            />
                                        </div>
                                    </div>
                                    {/* VB Checkbox */}
                                    <div className="flex items-center gap-2 pt-2">
                                        <input
                                            type="checkbox"
                                            id="hideVB"
                                            checked={hideVB}
                                            onChange={(e) => setHideVB(e.target.checked)}
                                            className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                                        />
                                        <label htmlFor="hideVB" className="text-sm text-gray-700 cursor-pointer">
                                            Pazarlık Payı (VB) gizle
                                        </label>
                                    </div>

                                    {/* Apply Button */}
                                    <button
                                        onClick={() => {
                                            const priceText = minPrice || maxPrice
                                                ? `${minPrice || '0'}₺ - ${maxPrice || '∞'}₺`
                                                : 'Tüm Fiyatlar';
                                            setSelectedPreis(priceText);
                                            setShowPreisDropdown(false);
                                        }}
                                        className="w-full py-2 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium text-sm"
                                    >
                                        Uygula
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Selected Filters Display */}
                <div className="flex flex-wrap gap-2 mb-6">
                    {selectedUnternehmen !== 'Tüm İşletmeler' && (
                        <div className="px-3 py-1.5 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 flex items-center gap-2">
                            <span className="font-medium">İşletme:</span>
                            <span>{selectedUnternehmen}</span>
                            <button
                                onClick={() => setSelectedUnternehmen('Tüm İşletmeler')}
                                className="ml-1 hover:text-red-900"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    )}

                    {selectedOrt !== 'Tüm Şehirler' && (
                        <div className="px-3 py-1.5 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 flex items-center gap-2">
                            <span className="font-medium">Şehir:</span>
                            <span>{selectedOrt}</span>
                            <button
                                onClick={() => setSelectedOrt('Tüm Şehirler')}
                                className="ml-1 hover:text-red-900"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    )}

                    {selectedKategorie !== 'Tüm Kategoriler' && (
                        <div className="px-3 py-1.5 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 flex items-center gap-2">
                            <span className="font-medium">Kategori:</span>
                            <span>{selectedKategorie}</span>
                            <button
                                onClick={() => setSelectedKategorie('Tüm Kategoriler')}
                                className="ml-1 hover:text-red-900"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    )}

                    {selectedPreis !== 'Tüm Fiyatlar' && (
                        <div className="px-3 py-1.5 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 flex items-center gap-2">
                            <span className="font-medium">Fiyat:</span>
                            <span>{selectedPreis}</span>
                            <button
                                onClick={() => setSelectedPreis('Tüm Fiyatlar')}
                                className="ml-1 hover:text-red-900"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    )}
                </div>

                {/* Search Bar */}
                <div className="mb-6">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="İşletme veya lokasyon ara..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                        />
                        <svg className="w-5 h-5 text-gray-400 absolute left-4 top-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                </div>

                {/* Companies Grid */}
                <div className="grid grid-cols-5 gap-4">
                    {companies.map((company) => (
                        <div
                            key={company.id}
                            className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all cursor-pointer group border border-gray-100 overflow-hidden"
                            onClick={() => navigate(`/seller/${company.user_number || company.id}`)}
                        >
                            {/* Company Image */}
                            <div className="relative w-full h-40 bg-gray-100">
                                <img
                                    src={company.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(company.name)}&background=0D8ABC&color=fff&size=400`}
                                    alt={company.name}
                                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                                />
                            </div>

                            {/* Company Info */}
                            <div className="p-3">
                                {/* Company Name */}
                                <h3 className="font-semibold text-sm text-gray-900 mb-1 line-clamp-2 group-hover:text-blue-600 transition-colors">
                                    {company.name}
                                </h3>

                                {/* Business Category */}
                                {company.businessCategory && (
                                    <p className="text-xs text-gray-500 mb-2">{company.businessCategory}</p>
                                )}

                                {/* Location */}
                                <div className="flex items-center gap-1 text-gray-500 text-xs mb-2">
                                    <svg className="w-3.5 h-3.5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <circle cx="12" cy="12" r="8" />
                                        <circle cx="12" cy="12" r="2.5" fill="currentColor" stroke="none" />
                                        <line x1="12" y1="2" x2="12" y2="4" />
                                        <line x1="12" y1="20" x2="12" y2="22" />
                                        <line x1="2" y1="12" x2="4" y2="12" />
                                        <line x1="20" y1="12" x2="22" y2="12" />
                                    </svg>
                                    <span className="line-clamp-1">
                                        {company.city || 'Türkei'}
                                    </span>
                                </div>

                                {/* Stats */}
                                <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                                    <div className="flex items-center gap-1">
                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        <span>{company.totalListings || 0} İlan</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <span className="text-yellow-500">★</span>
                                        <span className="font-medium text-gray-700">{company.rating}</span>
                                    </div>
                                </div>

                                {/* Action Button */}
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        navigate(`/seller/${company.user_number || company.id}`);
                                    }}
                                    className="w-full py-2 px-3 rounded-lg font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors text-xs"
                                >
                                    İşletme Sayfasına Git
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* No Results */}
                {companies.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">İşletme bulunamadı</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Unternehmensseiten;
