import React from 'react';

function MobileAppsPage() {
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
            <div className="bg-gradient-to-r from-red-600 to-red-700 text-white py-20">
                <div className="max-w-6xl mx-auto px-4 text-center">
                    <h1 className="text-5xl font-bold mb-6">Kleinbazaar Mobile Apps</h1>
                    <p className="text-2xl opacity-90">Trennen leicht gemacht: Die Kleinbazaar App fürs Handy</p>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 py-12">
                {/* iPhone App Section */}
                <div className="grid md:grid-cols-2 gap-12 mb-16">
                    <div className="flex flex-col justify-center">
                        <h2 className="text-4xl font-bold text-gray-900 mb-6">iPhone App</h2>
                        <p className="text-xl text-gray-700 leading-relaxed mb-8">
                            Immer über alles im Bilde sein: Mit der Kleinbazaar iPhone App hast du vollen Zugriff auf alle Inserate aus über 280 Kategorien. Jederzeit und kostenlos.
                        </p>
                        <button className="bg-black text-white font-bold py-4 px-8 rounded-xl hover:bg-gray-800 transition-colors w-fit flex items-center gap-3">
                            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                            </svg>
                            Jetzt Herunterladen
                        </button>
                    </div>
                    <div>
                        <img
                            src="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&q=80"
                            alt="iPhone App"
                            className="w-full h-auto rounded-2xl shadow-2xl"
                        />
                    </div>
                </div>

                {/* Android App Section */}
                <div className="grid md:grid-cols-2 gap-12 mb-16">
                    <div className="order-2 md:order-1">
                        <img
                            src="https://images.unsplash.com/photo-1607252650355-f7fd0460ccdb?w=800&q=80"
                            alt="Android App"
                            className="w-full h-auto rounded-2xl shadow-2xl"
                        />
                    </div>
                    <div className="flex flex-col justify-center order-1 md:order-2">
                        <h2 className="text-4xl font-bold text-gray-900 mb-6">Android App</h2>
                        <p className="text-xl text-gray-700 leading-relaxed mb-8">
                            Auch für Android verfügbar: Nutze die volle Power von Kleinbazaar auf deinem Android-Smartphone. Kostenlos im Google Play Store.
                        </p>
                        <button className="bg-black text-white font-bold py-4 px-8 rounded-xl hover:bg-gray-800 transition-colors w-fit flex items-center gap-3">
                            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
                            </svg>
                            Jetzt Herunterladen
                        </button>
                    </div>
                </div>

                {/* Features */}
                <div className="mb-16">
                    <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">App Features</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Anzeigen aufgeben – einfach und kostenlos</h3>
                            <p className="text-gray-700">
                                Kategorie auswählen, kurze Beschreibung eingeben, Foto machen - fertig!
                            </p>
                        </div>
                        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-red-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="8" />
                                    <circle cx="12" cy="12" r="2.5" fill="currentColor" stroke="none" />
                                    <line x1="12" y1="2" x2="12" y2="4" />
                                    <line x1="12" y1="20" x2="12" y2="22" />
                                    <line x1="2" y1="12" x2="4" y2="12" />
                                    <line x1="20" y1="12" x2="22" y2="12" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Schätze in deiner Nähe finden</h3>
                            <p className="text-gray-700">
                                Über Ortseingabe oder GPS suchst du ganz gezielt nach Anzeigen in deiner Umgebung.
                            </p>
                        </div>
                        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Immer auf dem Laufenden bleiben</h3>
                            <p className="text-gray-700">
                                Die neuesten Anzeigen aus deiner Umgebung werden dir automatisch angezeigt.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Anzeige hervorheben */}
                <div className="bg-gradient-to-br from-red-600 to-red-700 rounded-2xl shadow-lg p-8 md:p-12 mb-16 text-white text-center">
                    <h2 className="text-3xl font-bold mb-4">Anzeige hervorheben</h2>
                    <p className="text-xl mb-6 opacity-90">
                        Steigere deinen Verkaufserfolg – bei Kleinbazaar kannst du deine Anzeige mit verschiedenen Features pushen. Auch über die kostenlose App.
                    </p>
                    <button className="bg-white text-red-600 font-bold py-3 px-8 rounded-lg hover:bg-gray-100 transition-colors">
                        Mehr Infos
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

export default MobileAppsPage;
