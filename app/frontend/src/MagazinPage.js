import React, { useState } from 'react';
import { t } from './translations';

function MagazinPage() {
    const [currentPage, setCurrentPage] = useState(1);

    const articles = [
        {
            date: '24.09.2025',
            title: 'Plak Satmak: Plakların Değeri Nedir?',
            excerpt: 'Plak satmak ve değeri belirlemek: Bu ipuçlarıyla başarıya ulaşın. Vinilinizden en iyi şekilde yararlanın.',
            category: t.magazin.categories.selling,
            image: 'https://images.unsplash.com/photo-1619983081563-430f63602796?w=800&q=80'
        },
        {
            date: '23.09.2025',
            title: 'Sürpriz Yumurta Figürleri: Değer Belirleme ve Satış',
            excerpt: 'Hangi sürpriz yumurta figürleri değerlidir? En pahalı sürpriz yumurta figürleri hakkında daha fazla bilgi edinin.',
            category: t.magazin.categories.selling,
            image: 'https://images.unsplash.com/photo-1599687267812-35c05ff70ee9?w=800&q=80'
        },
        {
            date: '16.09.2025',
            title: 'Hutschenreuther Porselen: Alım ve Satım İçin Değer Belirleme',
            excerpt: 'Hutschenreuther porseleninin ne kadar değerli olduğunu bilmek ister misiniz? Rehberimizle en iyi fiyatları alın!',
            category: t.magazin.categories.lifestyle,
            image: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=800&q=80'
        },
        {
            date: '15.09.2025',
            title: 'Eski Lastikleri Satmak: İşte Bu Kadar Kolay',
            excerpt: 'İkinci el lastik satmak zor değil. Bu makalede lastiklerinizi nasıl paraya dönüştürebileceğiniz hakkında daha fazla bilgi edinin.',
            category: t.magazin.categories.selling,
            image: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=800&q=80'
        },
        {
            date: '15.09.2025',
            title: 'Daireye İlgi Bildirmek: Örnek Yazı',
            excerpt: 'Daireyi bu şekilde tutun ▶ Doğru zamanlama ✔ Gerekli belgeler ✔ Kredi notu ve maaş bordrosu ✔ Ev sahibini ikna etmek',
            category: t.magazin.categories.lifestyle,
            image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&q=80'
        },
        {
            date: '08.02.2025',
            title: 'Dresden\'de Yaşam Maliyeti: Burada Yaşamak Ne Kadar Pahalı?',
            excerpt: 'Dresden\'de yaşam maliyeti nedir? Burada yaşamanın maliyeti ne kadar? İstatistiklere dayanarak Dresden\'in gerçekte ne kadar pahalı olduğunu öğrenin.',
            category: t.magazin.categories.lifestyle,
            image: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=800&q=80'
        }
    ];

    const sellingTips = [
        'Antika satmak', 'Araba satmak', 'Araba lastiği satmak', 'Bebek eşyaları satmak',
        'Resim satmak', 'Tekne satmak', 'Gelinlik satmak', 'Masa oyunları satmak',
        'Pul satmak', 'Kitap satmak', 'CD satmak', 'Çizgi roman satmak',
        'Bilgisayar satmak', 'DVD satmak', 'Dijital kamera satmak', 'Yazıcı satmak',
        'Elektronik satmak', 'Bisiklet satmak', 'Televizyon satmak', 'Oyun satmak',
        'Tablo satmak', 'Altın takı satmak', 'Cep telefonu satmak', 'Ev satmak',
        'Emlak satmak', 'Kamera satmak', 'Çocuk kıyafeti satmak', 'Piyano satmak',
        'Laptop satmak', 'Lego satmak', 'MacBook satmak', 'Model araba satmak',
        'Motosiklet satmak', 'Mobilya satmak', 'Madeni para satmak', 'Notebook satmak',
        'PC satmak', 'Playmobil satmak', 'Porselen satmak', 'Lastik satmak',
        'Plak satmak', 'Takı satmak', 'Ayakkabı satmak', 'Akıllı telefon satmak',
        'Bilet satmak', 'Saat satmak', 'Karavan satmak'
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-red-600 to-red-700 text-white py-16">
                <div className="max-w-6xl mx-auto px-4">
                    <h1 className="text-5xl font-bold mb-4">{t.magazin.hero.title}</h1>
                    <p className="text-xl opacity-90 max-w-3xl">
                        {t.magazin.hero.subtitle}
                    </p>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 py-12">
                {/* Articles Grid */}
                <div className="grid md:grid-cols-2 gap-8 mb-12">
                    {articles.map((article, index) => (
                        <div key={index} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer">
                            <img
                                src={article.image}
                                alt={article.title}
                                className="w-full h-64 object-cover"
                            />
                            <div className="p-6">
                                <div className="flex items-center gap-3 mb-3">
                                    <span className="text-sm text-red-600 font-semibold">{article.date}</span>
                                    <span className="text-gray-400">|</span>
                                    <span className="text-sm text-gray-600">ExVitrin tarafından</span>
                                </div>
                                <span className="inline-block px-3 py-1 bg-red-100 text-red-600 text-xs font-semibold rounded-full mb-3">
                                    {article.category}
                                </span>
                                <h2 className="text-xl font-bold text-gray-900 mb-3 hover:text-red-600 transition-colors">
                                    {article.title}
                                </h2>
                                <p className="text-gray-700 mb-4 leading-relaxed">
                                    {article.excerpt}
                                </p>
                                <button className="text-red-600 hover:text-red-700 font-semibold flex items-center gap-2">
                                    {t.magazin.readMore}
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Pagination */}
                <div className="flex justify-center gap-2 mb-16">
                    {[1, 2, 3, 4, 5, 6, 7, '...', 51].map((page, index) => (
                        <button
                            key={index}
                            onClick={() => typeof page === 'number' && setCurrentPage(page)}
                            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${page === currentPage
                                ? 'bg-red-600 text-white'
                                : page === '...'
                                    ? 'text-gray-400 cursor-default'
                                    : 'bg-white text-gray-700 hover:bg-gray-100'
                                }`}
                        >
                            {page}
                        </button>
                    ))}
                    <button className="px-4 py-2 bg-white text-gray-700 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                        İleri →
                    </button>
                </div>

                {/* Selling Tips Section */}
                <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-8">A'dan Z'ye Satış İpuçları</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {sellingTips.map((tip, index) => (
                            <a
                                key={index}
                                href="#"
                                className="text-gray-700 hover:text-red-600 transition-colors py-2 flex items-center gap-2"
                            >
                                <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                                {tip}
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MagazinPage;
