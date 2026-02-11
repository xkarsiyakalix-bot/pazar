import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { CategoryGallery, HorizontalListingCard, ListingCard, getCategoryPath } from './components';
import { getTurkishCities, getCategoryTranslation } from './translations';
import { fetchListings } from './api/listings';
import { Breadcrumb } from './components/Breadcrumb';
import LoadingSpinner from './components/LoadingSpinner';
import { supabase } from './lib/supabase';

const areSubCategoriesEquivalent = (sub1, sub2) => {
    if (!sub1 || !sub2) return sub1 === sub2;
    const normalize = s => String(s).toLowerCase().trim();
    const n1 = normalize(sub1);
    const n2 = normalize(sub2);
    if (n1 === n2) return true;

    const mappings = [
        ['kiralık daireler', 'kiralık daire', 'mietwohnungen'],
        ['satılık daireler', 'satılık daire', 'eigentumswohnungen'],
        ['kiralık evler', 'kiralık müstakil ev', 'kiralık ev', 'häuser zur miete'],
        ['satılık evler', 'satılık müstakil ev', 'satılık ev', 'häuser zum kauf'],
        ['otomobil, bisiklet & tekne', 'oto, bisiklet & tekne', 'auto, rad & boot']
    ];
    return mappings.some(group => group.includes(n1) && group.includes(n2));
};

const AlleKategorienPage = ({ toggleFavorite, isFavorite }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams] = useSearchParams();
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('Tüm Kategoriler');
    const [selectedSubCategory, setSelectedSubCategory] = useState('');
    const [selectedLocations, setSelectedLocations] = useState([]);
    const [priceFrom, setPriceFrom] = useState('');
    const [priceTo, setPriceTo] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [showMobileFilters, setShowMobileFilters] = useState(false);
    const [inactiveCategories, setInactiveCategories] = useState(new Set());
    const [expandedCategories, setExpandedCategories] = useState([]);

    const toggleCategory = (categoryName) => {
        setExpandedCategories(prev =>
            prev.includes(categoryName)
                ? prev.filter(c => c !== categoryName)
                : [...prev, categoryName]
        );
    };

    const categories = [
        { name: 'Tüm Kategoriler', icon: '🏪', count: 0, subcategories: [] },
        {
            name: 'Otomobil, Bisiklet & Tekne', icon: '🚗', count: 0,
            subcategories: [
                'Otomobiller', 'Oto Parça & Lastik', 'Tekne & Tekne Malzemeleri',
                'Bisiklet & Aksesuarlar', 'Motosiklet & Scooter', 'Motosiklet Parça & Aksesuarlar',
                'Ticari Araçlar & Römorklar', 'Tamir & Servis', 'Karavan & Motokaravan', 'Diğer Otomobil, Bisiklet & Tekne'
            ]
        },
        {
            name: 'Emlak', icon: '🏠', count: 0,
            subcategories: [
                'Geçici Konaklama & Paylaşımlı Ev', 'Konteyner', 'Satılık Daire', 'Satılık Yazlık',
                'Tatil Evi & Yurt Dışı Emlak', 'Garaj & Otopark', 'Ticari Emlak', 'Arsa & Bahçe',
                'Satılık Müstakil Ev', 'Kiralık Müstakil Ev', 'Kiralık Daire', 'Yeni Projeler',
                'Taşımacılık & Nakliye', 'Diğer Emlak'
            ]
        },
        {
            name: 'Ev & Bahçe', icon: '🏡', count: 0,
            subcategories: ['Banyo', 'Ofis', 'Dekorasyon', 'Ev Hizmetleri', 'Bahçe Malzemeleri & Bitkiler', 'Ev Tekstili', 'Ev Tadilatı', 'Mutfak & Yemek Odası', 'Lamba & Aydınlatma', 'Yatak Odası', 'Oturma Odası', 'Diğer Ev & Bahçe']
        },
        {
            name: 'Moda & Güzellik', icon: '👗', count: 0,
            subcategories: ['Güzellik & Sağlık', 'Kadın Giyimi', 'Kadın Ayakkabıları', 'Erkek Giyimi', 'Erkek Ayakkabıları', 'Çanta & Aksesuarlar', 'Saat & Takı', 'Diğer Moda & Güzellik']
        },
        {
            name: 'Elektronik', icon: '📱', count: 0,
            subcategories: ['Ses & Hifi', 'Elektronik Hizmetler', 'Fotoğraf & Kamera', 'Cep Telefonu & Telefon', 'Ev Aletleri', 'Konsollar', 'Dizüstü Bilgisayarlar', 'Bilgisayarlar', 'Bilgisayar Aksesuarları & Yazılım', 'Tabletler & E-Okuyucular', 'TV & Video', 'Video Oyunları', 'Diğer Elektronik']
        },
        {
            name: 'Evcil Hayvanlar', icon: '🐾', count: 0,
            subcategories: ['Balıklar', 'Köpekler', 'Kediler', 'Küçük Hayvanlar', 'Çiftlik Hayvanları', 'Atlar', 'Hayvan Bakımı & Eğitim', 'Kayıp Hayvanlar', 'Kuşlar', 'Aksesuarlar']
        },
        {
            name: 'Aile, Çocuk & Bebek', icon: '👶', count: 0,
            subcategories: ['Yaşlı Bakımı', 'Bebek & Çocuk Giyimi', 'Bebek & Çocuk Ayakkabıları', 'Bebek Ekipmanları', 'Bebek Koltuğu & Oto Koltukları', 'Babysitter & Çocuk Bakımı', 'Bebek Arabaları & Pusetler', 'Bebek Odası Mobilyaları', 'Oyuncaklar', 'Diğer Aile, Çocuk & Bebek']
        },
        {
            name: 'İş İlanları', icon: '💼', count: 0,
            subcategories: ['Mesleki Eğitim', 'İnşaat, El Sanatları & Üretim', 'Büro İşleri & Yönetim', 'Gastronomi & Turizm', 'Müşteri Hizmetleri & Çağrı Merkezi', 'Ek İşler', 'Staj', 'Sosyal Sektör & Bakım', 'Taşımacılık & Lojistik', 'Satış & Pazarlama', 'Diğer İş İlanları']
        },
        {
            name: 'Eğlence, Hobi & Mahalle', icon: '⚽', count: 0,
            subcategories: ['Ezoterizm & Spiritüalizm', 'Yiyecek & İçecek', 'Boş Zaman Aktiviteleri', 'El Sanatları & Hobi', 'Sanat & Antikalar', 'Sanatçılar & Müzisyenler', 'Model Yapımı', 'Seyahat & Etkinlik Hizmetleri', 'Koleksiyon', 'Spor & Camping', 'Bit Pazarı', 'Kayıp & Buluntu', 'Diğer Eğlence, Hobi & Mahalle']
        },
        {
            name: 'Müzik, Film & Kitap', icon: '🎵', count: 0,
            subcategories: ['Kitap & Dergi', 'Kırtasiye', 'Çizgi Romanlar', 'Ders Kitapları, Okul & Eğitim', 'Film & DVD', "Müzik & CD'ler", 'Müzik Enstrümanları', 'Diğer Müzik, Film & Kitap']
        },
        {
            name: 'Biletler', icon: '🎫', count: 0,
            subcategories: ['Tren & Toplu Taşıma', 'Komedi & Kabare', 'Hediye Çekleri', 'Çocuk Etkinlikleri', 'Konserler', 'Spor', 'Tiyatro & Müzikal', 'Diğer Biletler']
        },
        {
            name: 'Hizmetler', icon: '🔧', count: 0,
            subcategories: ['Yaşlı Bakımı', 'Otomobil, Bisiklet & Tekne', 'Babysitter & Çocuk Bakımı', 'Elektronik', 'Ev & Bahçe', 'Sanatçılar & Müzisyenler', 'Seyahat & Etkinlik', 'Hayvan Bakımı & Eğitim', 'Taşımacılık & Nakliye', 'Diğer Hizmetler']
        },
        {
            name: 'Ücretsiz & Takas', icon: '🎁', count: 0,
            subcategories: ['Takas', 'Kiralama', 'Ücretsiz']
        },
        {
            name: 'Eğitim & Kurslar', icon: '📚', count: 0,
            subcategories: ['Bilgisayar Kursları', 'Ezoterizm & Spiritüalizm', 'Yemek & Pastacılık', 'Sanat & Tasarım', 'Müzik & Şan', 'Özel Ders', 'Spor Kursları', 'Dil Kursları', 'Dans Kursları', 'Sürekli Eğitim', 'Diğer Eğitim & Kurslar']
        },
        {
            name: 'Komşu Yardımı', icon: '🤝', count: 0,
            subcategories: ['Komşu Yardımı']
        }
    ];

    const federalStates = getTurkishCities();

    // Fetch inactive categories on mount
    useEffect(() => {
        const fetchInactive = async () => {
            try {
                const { data } = await supabase
                    .from('category_settings')
                    .select('category_name')
                    .eq('is_active', false);
                if (data) {
                    setInactiveCategories(new Set(data.map(item => item.category_name)));
                }
            } catch (err) {
                console.error('Error fetching inactive categories:', err);
            }
        };
        fetchInactive();
    }, [location.pathname]);

    // Read URL parameters on mount and when they change
    useEffect(() => {
        const search = searchParams.get('search') || '';
        const category = searchParams.get('category') || 'Tüm Kategoriler';
        const subCategory = searchParams.get('subCategory') || '';
        const loc = searchParams.get('location') || '';
        const priceFromParam = searchParams.get('priceFrom') || '';
        const priceToParam = searchParams.get('priceTo') || '';

        setSearchTerm(search);
        setSelectedCategory(category);
        setSelectedSubCategory(subCategory);
        setSelectedLocations(loc ? loc.split(',') : []);
        setPriceFrom(priceFromParam);
        setPriceTo(priceToParam);

        // Redirect to clean SEO URL if category/subcategory is present in query params
        if (category && category !== 'Tüm Kategoriler') {
            const path = getCategoryPath(category, subCategory);
            const params = new URLSearchParams(searchParams);
            params.delete('category');
            params.delete('subCategory');
            const qs = params.toString();
            navigate(`${path}${qs ? `?${qs}` : ''}`, { replace: true });
        }
    }, [searchParams, navigate]);

    // Update URL when filters change
    const updateFilters = (newFilters) => {
        const params = new URLSearchParams(searchParams);
        if (newFilters.locations !== undefined) {
            if (newFilters.locations && newFilters.locations.length > 0) params.set('location', newFilters.locations.join(','));
            else params.delete('location');
        }
        if (newFilters.priceFrom !== undefined) {
            if (newFilters.priceFrom) params.set('priceFrom', newFilters.priceFrom);
            else params.delete('priceFrom');
        }
        if (newFilters.priceTo !== undefined) {
            if (newFilters.priceTo) params.set('priceTo', newFilters.priceTo);
            else params.delete('priceTo');
        }
        if (newFilters.category !== undefined || newFilters.subCategory !== undefined) {
            const cat = newFilters.category !== undefined ? newFilters.category : selectedCategory;
            const sub = newFilters.subCategory !== undefined ? newFilters.subCategory : selectedSubCategory;
            const path = getCategoryPath(cat, sub);
            params.delete('category');
            params.delete('subCategory');
            const qs = params.toString();
            navigate(`${path}${qs ? `?${qs}` : ''}`);
            return;
        }
        navigate(`?${params.toString()}`);
    };



    // Fetch listings from Supabase
    useEffect(() => {
        let isMounted = true;

        const fetchListingsFromSupabase = async () => {
            // Increased safety timeout to 30s to accommodate slower Safari/Mobile initializations
            const safetyTimeout = new Promise(resolve => setTimeout(() => resolve('TIMEOUT'), 30000));

            try {
                setLoading(true);
                console.log('AlleKategorien - Starting fetch...');

                // Race between fetch and 30s timeout
                const result = await Promise.race([
                    fetchListings({}),
                    safetyTimeout
                ]);

                if (result === 'TIMEOUT') {
                    console.warn('AlleKategorien - Fetch timed out after 30s');
                    if (isMounted) {
                        setListings([]);
                    }
                } else {
                    console.log('AlleKategorien - Fetched listings successfully:', result?.length);
                    if (isMounted) setListings(result || []);
                }
            } catch (error) {
                console.error('AlleKategorien - Error in fetchListingsFromSupabase:', error);
                if (isMounted) setListings([]);
            } finally {
                if (isMounted) {
                    setLoading(false);
                    console.log('AlleKategorien - Loading state set to false');
                }
            }
        };

        fetchListingsFromSupabase();

        return () => { isMounted = false; };
    }, []);

    // Calculate category counts based on current filters (except category)
    const categoriesWithCounts = React.useMemo(() => {
        return categories
            .filter(cat => !inactiveCategories.has(cat.name)) // Filter inactive main
            .map(cat => {
                let count = 0;
                if (cat.name === 'Tüm Kategoriler') {
                    count = listings.filter(listing => {
                        if (searchTerm && listing.title) {
                            const searchLower = searchTerm.toLowerCase();
                            if (!listing.title.toLowerCase().includes(searchLower) && !listing.description?.toLowerCase().includes(searchLower)) return false;
                        }
                        if (priceFrom && listing.price < parseFloat(priceFrom)) return false;
                        if (priceTo && listing.price > parseFloat(priceTo)) return false;
                        if (selectedLocations.length > 0 && !selectedLocations.includes(listing.federal_state)) return false;
                        return true;
                    }).length;
                    return { ...cat, count };
                }

                count = listings.filter(listing => {
                    // Search term
                    if (searchTerm && listing.title) {
                        const searchLower = searchTerm.toLowerCase();
                        if (!listing.title.toLowerCase().includes(searchLower) && !listing.description?.toLowerCase().includes(searchLower)) return false;
                    }
                    // Price
                    if (priceFrom && listing.price < parseFloat(priceFrom)) return false;
                    if (priceTo && listing.price > parseFloat(priceTo)) return false;
                    // Location
                    if (selectedLocations.length > 0 && !selectedLocations.includes(listing.federal_state)) return false;

                    // Category match
                    if (cat.name === 'Müzik, Film & Kitap') {
                        return listing.category === 'Müzik, Film & Kitap' || listing.category === 'Müzik, Filme & Bücher';
                    }
                    return listing.category === cat.name;
                }).length;

                // Filter inactive subcategories
                const filteredSubcategories = cat.subcategories?.filter(sub => !inactiveCategories.has(sub));

                // Calculate top 2 subcategories for quick preview
                const topSubs = filteredSubcategories
                    ? filteredSubcategories
                        .map(subName => ({
                            name: subName,
                            count: listings.filter(l => (l.category === cat.name || (cat.name === 'Müzik, Film & Kitap' && (l.category === 'Müzik, Filme & Bücher' || l.category === 'Müzik, Film & Kitap'))) && l.sub_category === subName).length
                        }))
                        .sort((a, b) => b.count - a.count)
                        .slice(0, 2)
                    : [];

                return { ...cat, count, subcategories: filteredSubcategories || cat.subcategories, topSubcategories: topSubs };
            }).filter(cat => cat.count > 0 || cat.name === 'Tüm Kategoriler' || cat.name === selectedCategory);
    }, [listings, searchTerm, selectedLocations, priceFrom, priceTo, selectedCategory, inactiveCategories]);

    // Filter listings
    const filteredListings = listings.filter(listing => {
        // Search term filter
        if (searchTerm && listing.title) {
            const searchLower = searchTerm.toLowerCase();
            const titleMatch = listing.title.toLowerCase().includes(searchLower);
            const descMatch = listing.description?.toLowerCase().includes(searchLower);
            if (!titleMatch && !descMatch) return false;
        }

        // Category filter
        if (selectedCategory !== 'Tüm Kategoriler' && listing.category !== selectedCategory) {
            return false;
        }

        // Subcategory filter
        if (selectedSubCategory && listing.sub_category !== selectedSubCategory) {
            return false;
        }

        // Price filter
        if (priceFrom && listing.price < parseFloat(priceFrom)) return false;
        if (priceTo && listing.price > parseFloat(priceTo)) return false;

        // Location filter (multi-select)
        if (selectedLocations.length > 0 && !selectedLocations.includes(listing.federal_state)) return false;

        return true;
    });

    const getLocationCount = (state) => {
        return listings.filter(l => l.federal_state === state).length;
    };

    const handleCategoryClick = (categoryName) => {
        if (categoryName === 'Tüm Kategoriler') {
            navigate('/Butun-Kategoriler');
            return;
        }

        // Navigate to category page without preserving query params
        const path = getCategoryPath(categoryName);
        navigate(path);
    };

    const handleSubCategoryClick = (subName, e) => {
        e.stopPropagation();

        // Find which category this subcategory belongs to
        const parentCategory = categories.find(cat =>
            cat.subcategories && cat.subcategories.includes(subName)
        );

        if (!parentCategory) {
            console.error('Parent category not found for subcategory:', subName);
            return;
        }

        if (selectedSubCategory === subName) {
            // If clicking the same subcategory, go back to main category
            const path = getCategoryPath(parentCategory.name);
            navigate(path);
        } else {
            // Navigate to subcategory
            const path = getCategoryPath(parentCategory.name, subName);
            navigate(path);
        }
    };

    console.log('AlleKategorien - Filtered listings:', filteredListings.length);
    console.log('AlleKategorien - Selected category:', selectedCategory);

    // Sort listings: Premium (z_premium) first, then is_top, then highlighted, then newest
    const sortedListings = [...filteredListings].sort((a, b) => {
        // Priority: z_premium > multi-bump > other is_top > highlighted > basic
        const getPriority = (l) => {
            const type = l.package_type?.toLowerCase();
            if (type === 'z_premium' || type === 'premium') return 100;
            if (type === 'multi-bump' || type === 'z_multi_bump') return 80;
            if (l.is_gallery || ['galerie', 'gallery', 'galeri', 'vitrin'].includes(type)) return 60;
            if (l.is_top) return 50;
            if (l.is_highlighted || type === 'highlight' || type === 'budget') return 10;
            return 0;
        };

        const prioA = getPriority(a);
        const prioB = getPriority(b);

        if (prioA !== prioB) return prioB - prioA;
        return new Date(b.created_at) - new Date(a.created_at);
    });

    // Generate breadcrumb items
    const breadcrumbItems = [
        { label: 'ExVitrin', path: '/' }
    ];

    if (searchTerm) {
        breadcrumbItems.push({ label: `"${searchTerm}" Arama Sonuçları`, isActive: true });
    } else if (selectedCategory && selectedCategory !== 'Tüm Kategoriler') {
        breadcrumbItems.push({ label: selectedCategory, isActive: !selectedSubCategory });
        if (selectedSubCategory) {
            breadcrumbItems.push({ label: selectedSubCategory, isActive: true });
        }
    } else {
        breadcrumbItems.push({ label: 'Tüm Kategoriler', isActive: true });
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-neutral-900 transition-colors">
            <div className="max-w-[1400px] mx-auto px-4 py-6">



                <div className="flex items-center gap-3 mb-6 bg-white dark:bg-neutral-800/50 p-3 rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm">
                    {/* Mobile/Tablet Filter Button */}
                    <button
                        onClick={() => setShowMobileFilters(true)}
                        className="xl:hidden flex items-center gap-2 px-4 py-2 bg-gradient-to-br from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white rounded-xl shadow-md hover:shadow-lg transition-all active:scale-95 group shrink-0"
                    >
                        <svg className="w-5 h-5 transition-transform group-hover:rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                        </svg>
                        <span className="text-sm font-bold">Filtrele</span>
                        {(selectedCategory !== 'Tüm Kategoriler' || selectedSubCategory || selectedLocations.length > 0 || priceFrom || priceTo) && (
                            <span className="w-5 h-5 bg-yellow-400 text-gray-900 text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
                                !
                            </span>
                        )}
                    </button>

                    <div className="flex-1 overflow-hidden">
                        <Breadcrumb items={breadcrumbItems} />
                    </div>
                </div>

                <div className="flex flex-col xl:flex-row gap-8">
                    {/* Left Sidebar - Categories & Filters (Drawer on Mobile) */}
                    <aside className={`
                        fixed inset-0 z-[1002] xl:relative xl:inset-auto xl:z-0 xl:w-[20%] xl:min-w-[320px] xl:block
                        ${showMobileFilters ? 'block' : 'hidden xl:block'}
                    `}>
                        {/* Mobile Overlay Backdrop */}
                        <div
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm xl:hidden animate-in fade-in duration-300"
                            onClick={() => setShowMobileFilters(false)}
                        />

                        {/* Sidebar Content Column - Half screen width on mobile */}
                        <div className={`
                            relative w-[85vw] sm:w-[70vw] md:w-[50vw] xl:w-auto h-full xl:h-fit bg-white dark:bg-neutral-800 xl:rounded-2xl shadow-2xl xl:shadow-lg p-6 
                            overflow-y-auto xl:overflow-visible sticky top-0 xl:top-6 xl:ml-0 border-r dark:border-white/5 xl:border-none
                            ${showMobileFilters ? 'animate-in slide-in-from-left duration-300' : ''}
                        `}>
                            {/* Mobile Header */}
                            <div className="flex items-center justify-between xl:hidden mb-6 pb-4 border-b dark:border-white/5">
                                <h3 className="font-bold text-gray-900 dark:text-neutral-100 text-lg">Filtreleme</h3>
                                <button
                                    onClick={() => setShowMobileFilters(false)}
                                    className="p-2 -mr-2 text-gray-400 hover:text-red-600 transition-colors"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            {/* Categories Section */}
                            <div className="mb-6 pb-6 border-b border-gray-200 dark:border-white/5">
                                <h3 className="font-bold text-gray-900 dark:text-neutral-100 text-lg mb-4">Kategoriler</h3>
                                <div className="space-y-1">
                                    {categoriesWithCounts.map((category) => (
                                        <div key={category.name} className="mb-1">
                                            <button
                                                onClick={() => handleCategoryClick(category.name)}
                                                className={`w-full text-left px-3 py-2 rounded-lg transition-all flex items-center justify-between group ${selectedCategory === category.name
                                                    ? 'bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-md'
                                                    : 'hover:bg-gray-50 text-gray-700'
                                                    }`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <span className={`text-sm font-medium ${selectedCategory === category.name
                                                        ? 'text-white'
                                                        : 'text-gray-700 dark:text-neutral-300 group-hover:text-red-600 dark:group-hover:text-rose-400'
                                                        }`}>
                                                        {getCategoryTranslation(category.name)}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    {category.name !== 'Tüm Kategoriler' && (
                                                        <span className={`text-xs ${selectedCategory === category.name
                                                            ? 'text-white/80'
                                                            : 'text-gray-400 dark:text-neutral-500'
                                                            }`}>
                                                            ({category.count.toLocaleString('tr-TR')})
                                                        </span>
                                                    )}
                                                    <svg
                                                        className={`w-4 h-4 ${selectedCategory === category.name
                                                            ? 'text-white rotate-90'
                                                            : 'text-gray-400 dark:text-neutral-500 group-hover:text-red-600 dark:group-hover:text-rose-400'
                                                            } transition-all duration-200`}
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                    </svg>
                                                </div>
                                            </button>

                                            {/* Subcategories (Top 2 by default, All when selected OR expanded) */}
                                            {category.subcategories && category.subcategories.length > 0 && category.name !== 'Tüm Kategoriler' && (
                                                <div className="ml-4 pl-4 border-l-2 border-gray-100 dark:border-white/5 mt-2 space-y-1 animate-in slide-in-from-top-2 duration-200">
                                                    {(selectedCategory === category.name || expandedCategories.includes(category.name)
                                                        ? [...(category.subcategories || [])]
                                                            .filter(sub => {
                                                                // On mobile/tablet, if a subcategory is selected, hide other subcategories
                                                                if (window.innerWidth < 1280 && selectedSubCategory) {
                                                                    const isAll = sub === 'Tümü' || sub === 'Alle' || sub === 'Tüm';
                                                                    return areSubCategoriesEquivalent(sub, selectedSubCategory) || isAll;
                                                                }
                                                                return true;
                                                            })
                                                            .map(sub => ({
                                                                name: sub,
                                                                count: listings.filter(l => (l.category === category.name || (category.name === 'Müzik, Film & Kitap' && (l.category === 'Müzik, Filme & Bücher' || l.category === 'Müzik, Film & Kitap'))) && l.sub_category === sub).length
                                                            })).sort((a, b) => b.count - a.count)
                                                        : category.topSubcategories
                                                    ).map(sub => (
                                                        <button
                                                            key={sub.name}
                                                            onClick={(e) => handleSubCategoryClick(sub.name, e)}
                                                            className={`w-full text-left px-3 py-1.5 rounded-lg text-sm transition-all flex justify-between items-center ${selectedSubCategory === sub.name
                                                                ? 'bg-gradient-to-r from-red-50 to-rose-50 dark:from-rose-500/10 dark:to-red-500/10 text-red-600 dark:text-rose-400 font-bold'
                                                                : 'text-gray-600 dark:text-neutral-400 hover:bg-gray-50 dark:hover:bg-neutral-700 hover:text-red-600 dark:hover:text-rose-400'
                                                                }`}
                                                        >
                                                            <span>{getCategoryTranslation(sub.name)}</span>
                                                            <span className={`text-sm font-medium ${selectedSubCategory === sub.name ? 'text-red-400 dark:text-rose-300' : 'text-gray-400 dark:text-neutral-500'}`}>({sub.count})</span>
                                                        </button>
                                                    ))}
                                                    {selectedCategory !== category.name && !expandedCategories.includes(category.name) && category.subcategories.length > 2 && (
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                toggleCategory(category.name);
                                                            }}
                                                            className="w-full text-left px-3 py-1 text-[11px] font-bold text-gray-900 dark:text-neutral-400 hover:text-red-500 hover:underline transition-colors flex items-center gap-1"
                                                        >
                                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                                                            </svg>
                                                            {category.subcategories.length - 2} alt kategori daha
                                                        </button>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Filters Section */}
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="font-bold text-gray-900 dark:text-neutral-100 text-lg">Filtreler</h3>
                                <button
                                    onClick={() => {
                                        updateFilters({
                                            priceFrom: '',
                                            priceTo: '',
                                            locations: [],
                                            category: 'Tüm Kategoriler'
                                        });
                                    }}
                                    className="text-sm text-red-600 dark:text-rose-400 hover:text-red-700 dark:hover:text-rose-300 font-medium"
                                >
                                    Sıfırla
                                </button>
                            </div>

                            {/* Price Filter */}
                            <div className="mb-6 pb-6 border-b border-gray-200">
                                <h4 className="font-bold text-gray-900 mb-3 text-base">Fiyat</h4>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs text-gray-600 mb-1">Min</label>
                                        <input
                                            type="number"
                                            value={priceFrom}
                                            onChange={(e) => {
                                                setPriceFrom(e.target.value);
                                                updateFilters({ priceFrom: e.target.value });
                                            }}
                                            placeholder="0"
                                            className="w-full border border-gray-300 dark:border-white/10 bg-white dark:bg-neutral-800 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-red-300 dark:focus:ring-rose-500/20"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs text-gray-600 mb-1">Max</label>
                                        <input
                                            type="number"
                                            value={priceTo}
                                            onChange={(e) => {
                                                setPriceTo(e.target.value);
                                                updateFilters({ priceTo: e.target.value });
                                            }}
                                            placeholder="∞"
                                            className="w-full border border-gray-300 dark:border-white/10 bg-white dark:bg-neutral-800 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-red-300 dark:focus:ring-rose-500/20"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Location Filter */}
                            <div className="mb-6">
                                <h4 className="font-bold text-gray-900 mb-3 text-base">Konum</h4>
                                <div className="space-y-2">
                                    {federalStates.map((state) => (
                                        <label key={state} className="flex items-center justify-between cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors">
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="checkbox"
                                                    name="location"
                                                    value={state}
                                                    checked={selectedLocations.includes(state)}
                                                    onChange={(e) => {
                                                        const val = e.target.value;
                                                        const newLocations = selectedLocations.includes(val)
                                                            ? selectedLocations.filter(l => l !== val)
                                                            : [...selectedLocations, val];
                                                        setSelectedLocations(newLocations);
                                                        updateFilters({ locations: newLocations });
                                                    }}
                                                    className="w-4 h-4 text-red-600 dark:text-rose-500 border-gray-300 dark:border-white/10 rounded focus:ring-red-500 dark:focus:ring-rose-500/20 dark:bg-neutral-800"
                                                />
                                                <span className="text-sm text-gray-700 dark:text-neutral-300">{state}</span>
                                            </div>
                                            <span className="text-xs text-gray-400 dark:text-neutral-500">({getLocationCount(state)})</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* Right Side - Banner + Listings */}
                    <div className="flex-1">
                        {/* Banner */}
                        <div className="bg-gradient-to-r from-red-500 to-rose-600 sm:rounded-2xl rounded-none shadow-xl p-4 sm:p-8 mb-6 relative overflow-hidden">
                            <div className="absolute inset-0 opacity-10">
                                <div
                                    className="absolute top-0 left-0 w-full h-full"
                                    style={{
                                        backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,.1) 35px, rgba(255,255,255,.1) 70px)'
                                    }}
                                ></div>
                            </div>
                            <div className="relative z-10">
                                <div className="flex items-center justify-between">
                                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 w-full sm:w-auto text-center sm:text-left">
                                        <div className="w-full">
                                            <h1 className="text-2xl sm:text-4xl font-bold text-white mb-0.5 sm:mb-1">
                                                {searchTerm ? `"${searchTerm}" için arama sonuçları` : 'Tüm Kategoriler'}
                                            </h1>
                                            <p className="text-white text-sm sm:text-lg opacity-90 leading-tight">
                                                {searchTerm
                                                    ? `${filteredListings.length} sonuç bulundu`
                                                    : selectedCategory === 'Tüm Kategoriler'
                                                        ? 'Tüm ilanlara göz atın'
                                                        : selectedCategory
                                                }
                                            </p>
                                        </div>
                                    </div>
                                    <div className="hidden lg:flex items-center gap-6 text-white">
                                        <div className="text-center">
                                            <div className="text-3xl font-bold">{listings.length}</div>
                                            <div className="text-sm opacity-90">İlanlar</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div style={{ maxWidth: '960px' }}>
                            <CategoryGallery
                                listings={filteredListings.filter(l =>
                                    l.is_gallery || ['galerie', 'gallery', 'galeri', 'vitrin'].includes(l.package_type?.toLowerCase())
                                )}
                                toggleFavorite={toggleFavorite}
                                isFavorite={isFavorite}
                            />
                        </div>

                        {/* Listings */}
                        <div className="w-full">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-neutral-100 mb-4 px-0 sm:px-4 md:px-0">
                                {filteredListings.length} İlan
                            </h2>

                            {loading ? (
                                <div className="flex justify-center items-center py-12">
                                    <LoadingSpinner size="medium" />
                                </div>
                            ) : filteredListings.length === 0 ? (
                                <div className="text-center py-12">
                                    <p className="text-gray-500 text-lg">İlan bulunamadı</p>
                                </div>
                            ) : (
                                <>
                                    {/* Mobile: 2-column grid */}
                                    <div className="grid grid-cols-2 gap-2 px-0 sm:hidden">
                                        {sortedListings.map((listing) => (
                                            <ListingCard
                                                key={listing.id}
                                                listing={listing}
                                                toggleFavorite={toggleFavorite}
                                                isFavorite={isFavorite}
                                            />
                                        ))}
                                    </div>

                                    {/* Desktop: Horizontal cards */}
                                    <div className="hidden sm:block space-y-4 px-0 sm:px-4 md:px-0">
                                        {sortedListings.map((listing) => (
                                            <HorizontalListingCard
                                                key={listing.id}
                                                listing={listing}
                                                toggleFavorite={toggleFavorite}
                                                isFavorite={isFavorite}
                                            />
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AlleKategorienPage;
