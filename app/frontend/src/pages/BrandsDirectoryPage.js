import React, { useState, useEffect, useMemo } from 'react';
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
    const [allBrands, setAllBrands] = useState([]);
    const [groupedBrands, setGroupedBrands] = useState({});

    // Load all brands data on mount (lazy — not in main bundle)
    useEffect(() => {
        let cancelled = false;
        Promise.all([getAllBrandsList(), getAlphabeticalBrands()]).then(([list, groups]) => {
            if (!cancelled) {
                setAllBrands(list);
                setGroupedBrands(groups);
            }
        });
        return () => { cancelled = true; };
    }, []);

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
        <div className="min-h-screen bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 transition-colors pb-16">
            <SEO
                title="A'dan Z'ye Tüm Markalar Dizini | ExVitrin"
                description="2.400'den fazla markayı A'dan Z'ye keşfedin. Zara, Apple, Nike, Dyson, Samsung, BMW ve binlerce markanın sıfır ve ikinci el ilanları ExVitrin'de!"
                canonical="https://www.exvitrin.com/markalar"
                openGraph={{
                    title: "A'dan Z'ye Tüm Markalar Dizini | ExVitrin",
                    description: "2.400'den fazla markanın ikinci el ve sıfır ilanlarını keşfedin.",
                    url: 'https://www.exvitrin.com/markalar'
                }}
            />

            {/* Top Breadcrumb */}
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 pt-5 pb-2">
                <Breadcrumb items={breadcrumbs} />
            </div>

            {/* Editorial Hero Header */}
            <header className="max-w-[1400px] mx-auto px-4 sm:px-6 pt-2 pb-8 border-b border-neutral-100 dark:border-neutral-800">
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                    <div className="max-w-2xl">
                        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-neutral-100 dark:bg-neutral-900 text-[11px] font-medium text-neutral-600 dark:text-neutral-400 tracking-wide uppercase mb-3 border border-neutral-200/60 dark:border-neutral-800">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-600"></span>
                            A'dan Z'ye Marka Dizini
                        </div>
                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-neutral-950 dark:text-white">
                            Tüm Markalar Dizini
                        </h1>
                        <p className="mt-2 text-sm sm:text-base text-neutral-500 dark:text-neutral-400 leading-relaxed font-normal">
                            2.400'den fazla markayı A'dan Z'ye keşfedin. İlgilendiğiniz markaya tıklayarak en güncel sıfır ve ikinci el ilanlara anında ulaşın.
                        </p>
                    </div>

                    {/* Quick Metrics */}
                    <div className="flex items-center gap-6 sm:gap-8 pt-2 lg:pt-0 shrink-0">
                        <div>
                            <p className="text-2xl sm:text-3xl font-semibold tracking-tight text-neutral-950 dark:text-white leading-none">
                                {allBrands.length > 0 ? `${allBrands.length.toLocaleString('tr-TR')}` : '2.400+'}
                            </p>
                            <p className="text-[11px] text-neutral-400 dark:text-neutral-500 uppercase tracking-wider font-medium mt-1">
                                Kayıtlı Marka
                            </p>
                        </div>
                        <div className="w-px h-8 bg-neutral-200 dark:border-neutral-800" />
                        <div>
                            <p className="text-2xl sm:text-3xl font-semibold tracking-tight text-neutral-950 dark:text-white leading-none">
                                {letters.length || '30+'}
                            </p>
                            <p className="text-[11px] text-neutral-400 dark:text-neutral-500 uppercase tracking-wider font-medium mt-1">
                                Harf Grubu
                            </p>
                        </div>
                    </div>
                </div>

                {/* Sleek Search Box */}
                <div className="mt-6 max-w-xl">
                    <div className="relative flex items-center bg-neutral-50 dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-xl px-3.5 py-2.5 focus-within:border-neutral-950 dark:focus-within:border-white focus-within:bg-white dark:focus-within:bg-neutral-950 transition-all shadow-xs">
                        <svg className="w-4 h-4 text-neutral-400 shrink-0 mr-2.5 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Marka adı veya kategori ara (örn: Zara, Apple, Dyson, BMW)..."
                            className="w-full bg-transparent text-xs sm:text-sm text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 outline-none"
                        />
                        {searchTerm && (
                            <button
                                onClick={() => setSearchTerm('')}
                                className="text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 p-1 cursor-pointer transition-colors"
                                title="Aramayı Temizle"
                            >
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        )}
                    </div>
                </div>
            </header>

            {/* Popular Brands Strip */}
            {!searchTerm && (
                <div className="max-w-[1400px] mx-auto px-4 sm:px-6 pt-6 pb-2">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-[11px] font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">
                            Popüler Markalar
                        </span>
                        <span className="text-[11px] text-neutral-400">
                            En Çok Ziyaret Edilenler
                        </span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 sm:gap-2">
                        {POPULAR_BRANDS_HIGHLIGHT.map((pb) => (
                            <Link
                                key={pb.slug}
                                to={`/${pb.slug}`}
                                className="px-3 py-1.5 bg-neutral-50 dark:bg-neutral-900/60 hover:bg-neutral-100 dark:hover:bg-neutral-800 border border-neutral-200/70 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-lg text-xs font-medium transition-all"
                            >
                                {pb.name}
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {/* Sticky A-Z Alphabet Strip */}
            {!searchTerm && (
                <div className="sticky top-0 z-30 bg-white/90 dark:bg-neutral-950/90 backdrop-blur-md border-y border-neutral-100 dark:border-neutral-800/80 my-6 py-2.5 shadow-2xs">
                    <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
                        <div className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto custom-scrollbar pb-0.5 justify-start sm:justify-center">
                            {letters.map((letter) => (
                                <button
                                    key={letter}
                                    onClick={() => scrollToLetter(letter)}
                                    className="min-w-[28px] sm:min-w-[32px] h-7 sm:h-8 px-1.5 flex items-center justify-center rounded-lg text-xs font-semibold text-neutral-600 dark:text-neutral-400 hover:bg-neutral-950 hover:text-white dark:hover:bg-white dark:hover:text-neutral-950 transition-colors cursor-pointer shrink-0"
                                >
                                    {letter}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
                {/* Search Results Mode */}
                {searchTerm ? (
                    <div className="bg-white dark:bg-neutral-900 rounded-2xl p-6 sm:p-8 border border-neutral-200/80 dark:border-neutral-800">
                        <div className="flex items-center justify-between mb-6 pb-4 border-b border-neutral-100 dark:border-neutral-800">
                            <div>
                                <h2 className="text-base sm:text-lg font-semibold text-neutral-950 dark:text-white">
                                    "{searchTerm}" için Arama Sonuçları
                                </h2>
                                <p className="text-xs text-neutral-400 mt-0.5">
                                    Marka adı veya kategoride eşleşenler
                                </p>
                            </div>
                            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-200/60 dark:border-neutral-700">
                                {searchResults?.length || 0} marka
                            </span>
                        </div>

                        {searchResults && searchResults.length > 0 ? (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
                                {searchResults.map((brand) => (
                                    <Link
                                        key={brand.slug}
                                        to={`/${brand.slug}`}
                                        className="p-3 rounded-xl border border-neutral-200/70 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/40 hover:bg-white dark:hover:bg-neutral-800/80 hover:border-neutral-300 dark:hover:border-neutral-700 transition-all flex flex-col justify-between"
                                    >
                                        <span className="font-semibold text-neutral-900 dark:text-neutral-100 text-xs sm:text-sm line-clamp-1">
                                            {brand.name}
                                        </span>
                                        {brand.category && (
                                            <span className="text-[10px] text-neutral-400 mt-1 line-clamp-1">
                                                {brand.category}
                                            </span>
                                        )}
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-16">
                                <div className="w-10 h-10 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-400 flex items-center justify-center mx-auto mb-3">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-sm font-semibold text-neutral-900 dark:text-white mb-1">
                                    Aradığınız marka bulunamadı
                                </h3>
                                <p className="text-xs text-neutral-400 max-w-sm mx-auto mb-4">
                                    Farklı bir arama terimi deneyebilir veya A-Z harf listesini inceleyebilirsiniz.
                                </p>
                                <button
                                    onClick={() => setSearchTerm('')}
                                    className="px-4 py-2 bg-neutral-950 hover:bg-neutral-800 text-white dark:bg-white dark:hover:bg-neutral-100 dark:text-neutral-950 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                                >
                                    Tüm Markaları Göster
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    /* Alphabetical Groups */
                    <div className="space-y-6">
                        {letters.map((letter) => {
                            const brandsInLetter = groupedBrands[letter] || [];
                            return (
                                <section
                                    key={letter}
                                    id={`harf-${letter}`}
                                    className="bg-white dark:bg-neutral-900 rounded-2xl p-5 sm:p-6 border border-neutral-200/70 dark:border-neutral-800 scroll-mt-20"
                                >
                                    <div className="flex items-center justify-between mb-4 pb-3 border-b border-neutral-100 dark:border-neutral-800">
                                        <div className="flex items-center gap-3">
                                            <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 font-bold text-sm tracking-tight shadow-2xs font-mono">
                                                {letter}
                                            </span>
                                            <div>
                                                <h2 className="text-sm sm:text-base font-semibold text-neutral-950 dark:text-white">
                                                    {letter} ile Başlayan Markalar
                                                </h2>
                                                <p className="text-[11px] text-neutral-400">
                                                    {brandsInLetter.length} marka listeleniyor
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                                            className="text-[11px] text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 cursor-pointer"
                                            title="Sayfa Başına Dön"
                                        >
                                            Başa Dön ↑
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-2.5">
                                        {brandsInLetter.map((brand) => (
                                            <Link
                                                key={brand.slug}
                                                to={`/${brand.slug}`}
                                                className="group p-2.5 rounded-xl border border-neutral-200/60 dark:border-neutral-800 bg-neutral-50/40 dark:bg-neutral-900/30 hover:bg-white dark:hover:bg-neutral-800/80 hover:border-neutral-300 dark:hover:border-neutral-700 transition-all flex flex-col justify-between"
                                            >
                                                <span className="font-medium text-neutral-800 dark:text-neutral-200 group-hover:text-red-600 dark:group-hover:text-red-400 text-xs sm:text-sm line-clamp-1 transition-colors">
                                                    {brand.name}
                                                </span>
                                                {brand.category && (
                                                    <span className="text-[10px] text-neutral-400 mt-0.5 line-clamp-1">
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

