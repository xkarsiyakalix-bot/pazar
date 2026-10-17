import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { SEO } from '../SEO';
import { Breadcrumb } from '../components';
import { getAlphabeticalBrands, getAllBrandsList } from '../utils/brandUtils';

const POPULAR_BRANDS_HIGHLIGHT = [
    { name: 'Zara', slug: 'zara', category: 'Moda' },
    { name: 'Nike', slug: 'nike', category: 'Spor & Moda' },
    { name: 'Apple', slug: 'apple', category: 'Elektronik' },
    { name: 'Dyson', slug: 'dyson', category: 'Elektronik' },
    { name: 'Samsung', slug: 'samsung', category: 'Elektronik' },
    { name: 'Mango', slug: 'mango', category: 'Moda' },
    { name: 'Adidas', slug: 'adidas', category: 'Spor & Moda' },
    { name: 'H&M', slug: 'hm', category: 'Moda' },
    { name: 'Bosch', slug: 'bosch', category: 'Beyaz Eşya' },
    { name: 'BMW', slug: 'bmw', category: 'Otomobil' },
    { name: 'Mercedes-Benz', slug: 'mercedes-benz', category: 'Otomobil' },
    { name: 'Bershka', slug: 'bershka', category: 'Moda' },
    { name: 'Stradivarius', slug: 'stradivarius', category: 'Moda' },
    { name: 'Pull & Bear', slug: 'pull-and-bear', category: 'Moda' },
    { name: 'Puma', slug: 'puma', category: 'Spor & Moda' },
    { name: 'New Balance', slug: 'new-balance', category: 'Ayakkabı' },
    { name: 'Koton', slug: 'koton', category: 'Moda' },
    { name: 'LC Waikiki', slug: 'lc-waikiki', category: 'Moda' },
    { name: 'Tommy Hilfiger', slug: 'tommy-hilfiger', category: 'Moda' },
    { name: "Levi's", slug: 'levis', category: 'Moda' },
    { name: 'Converse', slug: 'converse', category: 'Ayakkabı' },
    { name: 'Mavi', slug: 'mavi', category: 'Moda' },
    { name: 'Rolex', slug: 'rolex', category: 'Saat' },
    { name: 'Xiaomi', slug: 'xiaomi', category: 'Elektronik' },
    { name: 'Sony', slug: 'sony', category: 'Elektronik' },
    { name: 'Arçelik', slug: 'arcelik', category: 'Beyaz Eşya' },
    { name: 'Beko', slug: 'beko', category: 'Beyaz Eşya' },
    { name: 'Tefal', slug: 'tefal', category: 'Ev Aletleri' },
    { name: 'Zuzu', slug: 'zuzu', category: 'Moda' }
];

export const BrandsDirectoryPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');

    const allBrands = useMemo(() => getAllBrandsList(), []);
    const groupedBrands = useMemo(() => getAlphabeticalBrands(), []);

    const letters = useMemo(() => {
        const standardLetters = [
            '0-9', 'A', 'B', 'C', 'Ç', 'D', 'E', 'F', 'G', 'H',
            'I', 'İ', 'J', 'K', 'L', 'M', 'N', 'O', 'Ö', 'P',
            'Q', 'R', 'S', 'Ş', 'T', 'U', 'Ü', 'V', 'W', 'X', 'Y', 'Z'
        ];
        return standardLetters.filter(l => groupedBrands[l] && groupedBrands[l].length > 0);
    }, [groupedBrands]);

    // Canlı Arama Sonuçları
    const searchResults = useMemo(() => {
        const cleanQuery = searchTerm.trim().toLowerCase();
        if (!cleanQuery) return null;

        return allBrands.filter(b => {
            const matchesName = b.name.toLowerCase().includes(cleanQuery);
            const matchesSlug = b.slug.toLowerCase().includes(cleanQuery);
            const matchesCategory = selectedCategory === 'all' || 
                (b.category && b.category.toLowerCase().includes(selectedCategory.toLowerCase()));
            return (matchesName || matchesSlug) && matchesCategory;
        });
    }, [searchTerm, allBrands, selectedCategory]);

    const scrollToLetter = (letter) => {
        const element = document.getElementById(`harf-${letter}`);
        if (element) {
            const headerOffset = 100;
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    };

    const breadcrumbs = [
        { label: 'Ana Sayfa', path: '/' },
        { label: 'Markalar', path: '/markalar' }
    ];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-neutral-900 transition-colors">
            <SEO
                title="A'dan Z'ye Tüm Markalar | ExVitrin"
                description="2.400'den fazla markayı A'dan Z'ye keşfedin. Zara, Apple, Nike, Dyson, Samsung, Zuzu ve binlerce markanın sıfır ve ikinci el ilanları ExVitrin'de!"
                canonical="https://www.exvitrin.com/markalar"
                openGraph={{
                    title: "A'dan Z'ye Tüm Markalar | ExVitrin",
                    description: "2.400'den fazla markanın ikinci el ve sıfır ilanlarını keşfedin.",
                    url: 'https://www.exvitrin.com/markalar'
                }}
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <Breadcrumb items={breadcrumbs} />

                {/* Hero Header */}
                <div className="bg-gradient-to-r from-red-600 via-rose-600 to-red-700 rounded-3xl p-6 sm:p-10 text-white shadow-xl mt-4 mb-8 relative overflow-hidden">
                    <div className="relative z-10 max-w-3xl">
                        <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md text-white rounded-full text-xs font-bold tracking-wider uppercase mb-3">
                            A'dan Z'ye Marka Vitrini
                        </span>
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight mb-3">
                            A’dan Z’ye Tüm Markalar
                        </h1>
                        <p className="text-white/90 text-sm sm:text-base leading-relaxed mb-6">
                            2.400'den fazla marka sayfasını A'dan Z'ye keşfet. Sevdiğin markaya tıkla, sıfır ve 2. el ilanları hemen incele!
                        </p>

                        {/* Canlı Arama Input */}
                        <div className="relative max-w-xl">
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Marka adı veya kategori ara (örn: Zara, Apple, Zuzu, Dyson)..."
                                className="w-full bg-white text-gray-900 pl-11 pr-10 py-3.5 rounded-2xl shadow-lg text-sm sm:text-base placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-white/30 transition-all"
                            />
                            <svg className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            {searchTerm && (
                                <button
                                    onClick={() => setSearchTerm('')}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1 cursor-pointer"
                                    title="Aramayı Temizle"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Arka plan dekoratif daireler */}
                    <div className="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-white/10 blur-2xl pointer-events-none" />
                    <div className="absolute -right-8 -bottom-8 w-60 h-60 rounded-full bg-black/10 blur-xl pointer-events-none" />
                </div>

                {/* Popüler Markalar Şeridi */}
                {!searchTerm && (
                    <div className="bg-white dark:bg-neutral-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-neutral-700 mb-8">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <span className="w-2.5 h-2.5 rounded-full bg-red-600" />
                                <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                                    Popüler Markalar
                                </h2>
                            </div>
                            <span className="text-xs text-gray-400">En Çok Ziyaret Edilenler</span>
                        </div>
                        <div className="flex flex-wrap gap-2 sm:gap-2.5">
                            {POPULAR_BRANDS_HIGHLIGHT.map((pb) => (
                                <Link
                                    key={pb.slug}
                                    to={`/${pb.slug}`}
                                    className="px-3.5 py-1.5 bg-gray-50 dark:bg-neutral-700/60 hover:bg-red-50 hover:dark:bg-red-950/40 border border-gray-200 dark:border-neutral-700 hover:border-red-300 dark:hover:border-red-700 text-gray-800 dark:text-neutral-200 hover:text-red-600 dark:hover:text-red-400 rounded-xl text-xs sm:text-sm font-semibold transition-all hover:scale-105"
                                >
                                    {pb.name}
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                {/* A-Z Harf İndeksi Çubuğu */}
                {!searchTerm && (
                    <div className="sticky top-20 z-20 bg-white/95 dark:bg-neutral-800/95 backdrop-blur-md rounded-2xl p-3 shadow-md border border-gray-200 dark:border-neutral-700 mb-8">
                        <div className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto custom-scrollbar pb-1 text-center justify-start sm:justify-center">
                            {letters.map((letter) => (
                                <button
                                    key={letter}
                                    onClick={() => scrollToLetter(letter)}
                                    className="min-w-[32px] sm:min-w-[36px] h-8 sm:h-9 px-2 flex items-center justify-center rounded-lg text-xs sm:text-sm font-bold text-gray-700 dark:text-neutral-300 hover:bg-red-600 hover:text-white transition-all cursor-pointer flex-shrink-0"
                                >
                                    {letter}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Arama Sonuçları */}
                {searchTerm ? (
                    <div className="bg-white dark:bg-neutral-800 rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100 dark:border-neutral-700">
                        <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100 dark:border-neutral-700">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                "{searchTerm}" için Arama Sonuçları
                            </h2>
                            <span className="text-sm font-medium text-red-600 dark:text-red-400">
                                {searchResults?.length || 0} marka bulundu
                            </span>
                        </div>

                        {searchResults && searchResults.length > 0 ? (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                                {searchResults.map((brand) => (
                                    <Link
                                        key={brand.slug}
                                        to={`/${brand.slug}`}
                                        className="group p-3.5 bg-gray-50 dark:bg-neutral-700/50 hover:bg-red-50 hover:dark:bg-red-950/30 rounded-xl border border-gray-200 dark:border-neutral-700 hover:border-red-300 dark:hover:border-red-600 transition-all flex flex-col justify-between"
                                    >
                                        <span className="font-semibold text-gray-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-400 text-sm transition-colors">
                                            {brand.name}
                                        </span>
                                        {brand.category && (
                                            <span className="text-[11px] text-gray-400 dark:text-neutral-400 mt-1">
                                                {brand.category}
                                            </span>
                                        )}
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-16">
                                <div className="w-12 h-12 bg-gray-100 dark:bg-neutral-700 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-1">
                                    Aradığınız marka bulunamadı
                                </h3>
                                <p className="text-sm text-gray-500 dark:text-neutral-400 max-w-sm mx-auto mb-4">
                                    Farklı bir arama terimi deneyebilir veya aşağıdaki tüm marka listesini inceleyebilirsiniz.
                                </p>
                                <button
                                    onClick={() => setSearchTerm('')}
                                    className="px-4 py-2 bg-red-600 text-white text-xs font-semibold rounded-xl hover:bg-red-700 transition-colors"
                                >
                                    Tüm Markaları Göster
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    /* Harf Grupları */
                    <div className="space-y-8">
                        {letters.map((letter) => {
                            const brandsInLetter = groupedBrands[letter] || [];
                            return (
                                <section
                                    key={letter}
                                    id={`harf-${letter}`}
                                    className="bg-white dark:bg-neutral-800 rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100 dark:border-neutral-700 scroll-mt-36"
                                >
                                    <div className="flex items-center gap-3 mb-6 pb-3 border-b border-gray-100 dark:border-neutral-700">
                                        <div className="w-10 h-10 rounded-xl bg-red-600 text-white font-black text-lg flex items-center justify-center shadow-md">
                                            {letter}
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-extrabold text-gray-900 dark:text-white">
                                                {letter} ile Başlayan Markalar
                                            </h2>
                                            <span className="text-xs text-gray-400">
                                                {brandsInLetter.length} marka
                                            </span>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5 sm:gap-3">
                                        {brandsInLetter.map((brand) => (
                                            <Link
                                                key={brand.slug}
                                                to={`/${brand.slug}`}
                                                className="group p-2.5 sm:p-3 bg-gray-50 dark:bg-neutral-700/40 hover:bg-red-50 hover:dark:bg-red-950/30 rounded-xl border border-gray-100 dark:border-neutral-700/60 hover:border-red-300 dark:hover:border-red-700 transition-all flex flex-col justify-between"
                                            >
                                                <span className="font-semibold text-gray-800 dark:text-neutral-200 group-hover:text-red-600 dark:group-hover:text-red-400 text-xs sm:text-sm line-clamp-1 transition-colors">
                                                    {brand.name}
                                                </span>
                                                {brand.category && (
                                                    <span className="text-[10px] text-gray-400 dark:text-neutral-400 mt-1 line-clamp-1">
                                                        {brand.category}
                                                    </span>
                                                )}
                                            </Link>
                                        ))}
                                    </div>
                                </section>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default BrandsDirectoryPage;

