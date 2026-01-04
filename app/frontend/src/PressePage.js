import React from 'react';

function PressePage() {
    const pressReleases = [
        {
            date: '20.11.2025',
            title: 'Gefährliche Selbstsicherheit: Drei Viertel der Verbraucher erkennen Fakeshop-Warnsignale nur unzureichend',
            excerpt: 'Immer mehr Fakeshops täuschen mit professionellem Design und gefälschten Bewertungen. Zugleich sinkt die Wachsamkeit vieler Verbraucher: Zwar sagen über 80 Prozent, sie wüssten, was Fakeshops sind – doch nur rund ein Viertel erkennt alle wichtigen Warnsignale.',
            image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80'
        },
        {
            date: '18.11.2025',
            title: 'Vom Foto zum Verkauf: Der neue KI-Assistent von Kleinanzeigen erstellt Anzeigen in Sekunden',
            excerpt: 'Kleinanzeigen erweitert erneut seine Funktion zur KI-basierten Anzeigenerstellung in der App. Künftig ist in zahlreichen Kategorien lediglich ein Foto nötig, um eine neue Anzeige zu erstellen.',
            image: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&q=80'
        },
        {
            date: '06.11.2025',
            title: 'Wohnungs- und Häusermarkt in Baden-Württemberg: Angebot für Mietwohnungen erholt sich spürbar',
            excerpt: 'Im Schatten der weiterhin angespannten Wohnungsnot in deutschen Großstädten zeigt sich in Baden-Württemberg eine positive Entwicklung auf dem Wohnungs- und Häusermarkt.',
            image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80'
        },
        {
            date: '04.11.2025',
            title: 'Ghosting, Feilschen, Blitzabsagen: Das sind laut Umfrage die größten No-Gos bei Kleinanzeigen-Deals',
            excerpt: 'Kaufen und Verkaufen zwischen Privatpersonen ist Vertrauenssache – und oft ein echter Drahtseilakt. Eine aktuelle YouGov-Umfrage im Auftrag von Kleinanzeigen zeigt, was die Deutschen wirklich nervt.',
            image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800&q=80'
        },
        {
            date: '29.10.2025',
            title: '„Horrorhäuser": Fast jeder Zweite lässt sich von Mord nicht abschrecken',
            excerpt: 'Immobilien, in denen eine Person gewaltsam zu Tode gekommen ist, stellen Makler immer wieder vor große Herausforderungen. Laut einer repräsentativen Umfrage würden vier von zehn Befragten in ein sogenanntes Mörderhaus ziehen.',
            image: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=800&q=80'
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-red-600 to-red-700 text-white py-16">
                <div className="max-w-6xl mx-auto px-4">
                    <h1 className="text-5xl font-bold mb-4">Presse</h1>
                    <p className="text-xl opacity-90">Aktuelle Pressemitteilungen von Kleinbazaar</p>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 py-12">
                {/* Press Releases */}
                <div className="space-y-8">
                    {pressReleases.map((release, index) => (
                        <div key={index} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                            <div className="md:flex">
                                <div className="md:w-1/3">
                                    <img
                                        src={release.image}
                                        alt={release.title}
                                        className="w-full h-64 md:h-full object-cover"
                                    />
                                </div>
                                <div className="md:w-2/3 p-8">
                                    <div className="text-sm text-red-600 font-semibold mb-2">
                                        {release.date} | von Kleinanzeigen
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                                        {release.title}
                                    </h2>
                                    <p className="text-gray-700 mb-6 leading-relaxed">
                                        {release.excerpt}
                                    </p>
                                    <button className="text-red-600 hover:text-red-700 font-semibold flex items-center gap-2">
                                        Mehr erfahren
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Load More Button */}
                <div className="text-center mt-12">
                    <button className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-lg transition-colors">
                        Alle anzeigen
                    </button>
                </div>

                {/* Contact Section */}
                <div className="mt-16 bg-white rounded-2xl shadow-lg p-8 md:p-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">Pressekontakt</h2>
                    <div className="grid md:grid-cols-2 gap-8">
                        <div>
                            <h3 className="font-bold text-lg mb-2">Allgemeine Presseanfragen</h3>
                            <p className="text-gray-700 mb-2">E-Mail: presse@kleinbazaar.de</p>
                            <p className="text-gray-700">Telefon: +49 30 12345678</p>
                        </div>
                        <div>
                            <h3 className="font-bold text-lg mb-2">Pressematerial</h3>
                            <p className="text-gray-700 mb-4">
                                Logos, Bilder und weitere Materialien für die Presse finden Sie in unserem Pressebereich.
                            </p>
                            <button className="text-red-600 hover:text-red-700 font-semibold">
                                Zum Pressebereich →
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PressePage;
