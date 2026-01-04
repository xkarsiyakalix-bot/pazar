import React, { useState } from 'react';

function MagazinPage() {
    const [currentPage, setCurrentPage] = useState(1);

    const articles = [
        {
            date: '24.09.2025',
            title: 'Schallplatten verkaufen: Was sind Schallplatten wert?',
            excerpt: 'Schallplatten verkaufen & den Wert ermitteln: Mit diesen Tipps gelingt es. Hole das Beste aus deinem Vinyl heraus.',
            category: 'Verkaufen',
            image: 'https://images.unsplash.com/photo-1619983081563-430f63602796?w=800&q=80'
        },
        {
            date: '23.09.2025',
            title: 'Ü-Ei-Figuren: Wert ermitteln und verkaufen',
            excerpt: 'Welche sind Ü-Ei-Figuren wertvoll? Erfahre mehr über die teuersten Überraschungsei-Figuren.',
            category: 'Verkaufen',
            image: 'https://images.unsplash.com/photo-1599687267812-35c05ff70ee9?w=800&q=80'
        },
        {
            date: '16.09.2025',
            title: 'Hutschenreuther-Porzellan: Wert ermitteln für Ankauf & Verkauf',
            excerpt: 'Du möchtest wissen, was Hutschenreuther Porzellan wert ist? Erziele mit unserem Ratgeber beste Preise!',
            category: 'Ratgeber',
            image: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=800&q=80'
        },
        {
            date: '15.09.2025',
            title: 'Alte Reifen verkaufen: So einfach geht\'s',
            excerpt: 'Gebrauchte Reifen verkaufen ist nicht schwer. Erfahre in diesem Artikel mehr darüber, wie du deine Reifen zu Geld machst.',
            category: 'Verkaufen',
            image: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=800&q=80'
        },
        {
            date: '15.09.2025',
            title: 'Interesse an Wohnung bekunden: Musterschreiben',
            excerpt: 'So bekommst du die Wohnung ▶ Gutes Timing ✔ Die richtigen Dokumente ✔ Schufa & Gehaltsnachweise ✔ Vermieter überzeugen',
            category: 'Ratgeber',
            image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&q=80'
        },
        {
            date: '08.02.2025',
            title: 'Lebenshaltungskosten Dresden: Wie teuer ist hier das Wohnen?',
            excerpt: 'Was sind die Lebenshaltungskosten in Dresden? Wie viel kostet es, hier zu leben? Erfahre auf Basis von Statistiken, wie teuer Dresden wirklich ist.',
            category: 'Ratgeber',
            image: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=800&q=80'
        },
        {
            date: '08.02.2025',
            title: 'Lebenshaltungskosten Nürnberg: Wie teuer ist hier das Wohnen?',
            excerpt: 'Was sind die Lebenshaltungskosten in Nürnberg? Wie viel kostet es, hier zu leben? Erfahre auf Basis von Statistiken, wie teuer Nürnberg wirklich ist.',
            category: 'Ratgeber',
            image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80'
        },
        {
            date: '08.02.2025',
            title: 'Lebenshaltungskosten Düsseldorf: Wie hoch sind sie?',
            excerpt: 'Was sind die Lebenshaltungskosten in Düsseldorf? Wie viel kostet es, hier zu wohnen? Erfahre auf Basis von Statistiken, wie teuer Düsseldorf ist.',
            category: 'Ratgeber',
            image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&q=80'
        }
    ];

    const sellingTips = [
        'Antiquitäten verkaufen', 'Auto verkaufen', 'Autoreifen verkaufen', 'Babysachen verkaufen',
        'Bilder verkaufen', 'Boot verkaufen', 'Brautkleid verkaufen', 'Brettspiele verkaufen',
        'Briefmarken verkaufen', 'Bücher verkaufen', 'CDs verkaufen', 'Comics verkaufen',
        'Computer verkaufen', 'DVDs verkaufen', 'Digitalkamera verkaufen', 'Drucker verkaufen',
        'Elektronik verkaufen', 'Fahrrad verkaufen', 'Fernseher verkaufen', 'Games verkaufen',
        'Gemälde verkaufen', 'Goldschmuck verkaufen', 'Handy verkaufen', 'Haus verkaufen',
        'Immobilien verkaufen', 'Kamera verkaufen', 'Kinderkleidung verkaufen', 'Klavier verkaufen',
        'Laptop verkaufen', 'Lego verkaufen', 'MacBook verkaufen', 'Modellautos verkaufen',
        'Motorrad verkaufen', 'Möbel verkaufen', 'Münzen verkaufen', 'Notebook verkaufen',
        'PC verkaufen', 'Playmobil verkaufen', 'Porzellan verkaufen', 'Reifen verkaufen',
        'Schallplatten verkaufen', 'Schmuck verkaufen', 'Schuhe verkaufen', 'Smartphone verkaufen',
        'Tickets verkaufen', 'Uhr verkaufen', 'Wohnmobil verkaufen', 'Wohnwagen verkaufen'
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-red-600 to-red-700 text-white py-16">
                <div className="max-w-6xl mx-auto px-4">
                    <h1 className="text-5xl font-bold mb-4">Kleinbazaar Magazin</h1>
                    <p className="text-xl opacity-90 max-w-3xl">
                        Willkommen! Hier zeigen wir dir alles rund um den Kosmos von Kleinbazaar. Seien es Tipps für das perfekte Picknick, coole Cabrios, lustige Listen, die dich zum Schmunzeln bringen, oder auch Geschichten direkt aus der Community.
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
                                    <span className="text-sm text-gray-600">von Kleinbazaar</span>
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
                                    Mehr erfahren
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
                        Weiter →
                    </button>
                </div>

                {/* Selling Tips Section */}
                <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-8">Tipps zum Verkaufen von A bis Z</h2>
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
