import React from 'react';
import { useNavigate } from 'react-router-dom';

function KarrierePage() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-red-600 to-red-700 text-white py-20">
                <div className="max-w-6xl mx-auto px-4 text-center">
                    <h1 className="text-5xl font-bold mb-6">Großartige Jobs mit großer Wirkung.</h1>
                    <button className="bg-white text-red-600 font-bold py-3 px-8 rounded-lg hover:bg-gray-100 transition-colors text-lg">
                        Alle offenen Stellen ansehen
                    </button>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 py-12">
                {/* Intro */}
                <div className="mb-16 text-center">
                    <p className="text-xl text-gray-700 leading-relaxed max-w-4xl mx-auto">
                        Als Deutschlands Nr. 1 Plattform zum Verbinden, Kaufen, Verkaufen oder einfach Verschenken von Artikeln bringen wir das Beste aus allen Welten zusammen: eine beliebte Marke, großartige Kollegen und ein Geschäftsmodell mit gesellschaftlicher Wirkung: Nachhaltigkeit.
                    </p>
                </div>

                {/* Main Content */}
                <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">
                        Stellen Sie sich einen Job vor, der ein großartiges Angebot für Sie und den Planeten ist.
                    </h2>
                    <div className="space-y-4 text-lg text-gray-700 leading-relaxed">
                        <p>
                            Kleinbazaar ist mehr als nur eine Online-Kleinanzeigenplattform; es ist ein dynamisches Ökosystem, in dem Ihre Karriereziele und nachhaltigen Werte übereinstimmen. Wir kombinieren modernste Technologie mit einem menschenzentrierten Fokus. Wir ermöglichen Re-Commerce innerhalb unserer Community, fördern eine Kreislaufwirtschaft und erzeugen Begeisterung für Artikel, die bereits in den Schränken der Menschen vorhanden sind.
                        </p>
                        <p>
                            Mit über 50 Millionen Anzeigen in verschiedenen Kategorien, von Kinderbedarf über Elektronik bis hin zu Immobilien, und mehr als 36 Millionen Nutzern pro Monat haben wir die größte Reichweite aller Online-Verkaufsplattformen im Land.
                        </p>
                        <p>
                            Egal, wie Sie in der Vergangenheit gearbeitet haben oder welche Art von Karriereweg hinter Ihnen liegt, Kleinbazaar ist der Ort, an dem Sie einen Job finden können, der ein großartiges Angebot für Sie und den Planeten ist.
                        </p>
                    </div>
                </div>

                {/* Job Categories */}
                <div className="mb-16">
                    <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Unsere Bereiche</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[
                            'Product & Tech, UX/UI, Data',
                            'Sales & Advertising & Customer Service',
                            'Finance, Strategy & Legal',
                            'Marketing & Communications',
                            'People',
                            'Administration & Support'
                        ].map((category, index) => (
                            <div key={index} className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all p-6 text-center">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">{category}</h3>
                                <button className="text-red-600 hover:text-red-700 font-medium">
                                    Offene Stellen ansehen →
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Culture Section */}
                <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-lg p-8 md:p-12 mb-12 text-white">
                    <h2 className="text-3xl font-bold mb-6">
                        Stellen Sie sich einen Job vor, in dem High-Tech auf höhere Ziele trifft.
                    </h2>
                    <p className="text-lg leading-relaxed opacity-90 mb-6">
                        Als menschenzentrierter Arbeitsplatz bieten wir Ihnen eine sinnvolle Karriere und gleichzeitig eine große Wirkung.
                    </p>
                    <p className="text-lg leading-relaxed opacity-90">
                        Unsere Teams arbeiten funktionsübergreifend daran, unsere Plattform mit Lösungen zu verbessern, die auf die Bedürfnisse unserer Kunden eingehen. Dies bedeutet, dass jedes Team aus Mitgliedern verschiedener Funktionen besteht, wie Product & Tech, UX und Design, Analytics, Marketing und mehr.
                    </p>
                </div>

                {/* Values - CAKE */}
                <div className="mb-16">
                    <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                        Unsere kulturellen Werte - mehr als nur CAKE
                    </h2>
                    <p className="text-center text-lg text-gray-700 mb-8 max-w-3xl mx-auto">
                        Ja, wir haben eine Schwäche für Süßes und lieben Kuchen – aber unsere CAKE-Werte sind uns noch wichtiger. Sie prägen unsere einzigartige Kultur, die uns erfolgreich gemacht hat.
                    </p>
                    <div className="grid md:grid-cols-2 gap-6">
                        {[
                            {
                                title: 'Customer Focus',
                                points: ['Wir sind der Kunde', 'Wir werden durch Kundenfeedback und Daten angetrieben', 'Wir entwickeln Lösungen, um unsere Kunden zu begeistern']
                            },
                            {
                                title: 'Accountable for Change',
                                points: ['Wir begrüßen Veränderungen', 'Wir sind der Nachhaltigkeit verpflichtet', 'Wir übernehmen Verantwortung und lösen Probleme']
                            },
                            {
                                title: 'Kleinbazaar Style',
                                points: ['Wir respektieren und vertrauen einander', 'Wir kommunizieren direkt und ehrlich', 'Wir ergreifen die Initiative, um ein besseres Kleinbazaar zu schaffen']
                            },
                            {
                                title: 'Everyone Together',
                                points: ['Wir sind vereint in unserer Vielfalt', 'Wir priorisieren kollektive Ziele über individuelle Interessen', 'Wir kommen zusammen, um Spaß zu haben und Erfolge zu feiern']
                            }
                        ].map((value, index) => (
                            <div key={index} className="bg-white rounded-xl shadow-md p-6">
                                <h3 className="text-xl font-bold text-red-600 mb-4">{value.title}</h3>
                                <ul className="space-y-2">
                                    {value.points.map((point, i) => (
                                        <li key={i} className="flex items-start">
                                            <span className="text-red-600 mr-2">•</span>
                                            <span className="text-gray-700">{point}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Sustainability */}
                <div className="bg-green-50 rounded-2xl shadow-lg p-8 md:p-12 mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">
                        Stellen Sie sich einen Job vor, in dem CO2 wichtiger ist als der CEO.
                    </h2>
                    <p className="text-lg text-gray-700 leading-relaxed mb-6">
                        Nachhaltigkeit ist für uns nicht nur ein Schlagwort; sie steht im Kern unseres Geschäftsmodells. Alles, was wir tun, zielt darauf ab, „die Freude am nachhaltigen Handel für alle zu bringen".
                    </p>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <h3 className="font-bold text-lg mb-2">Green Sunday</h3>
                            <p className="text-gray-700">Ein jährliches Event, das nachhaltigen Konsum feiert.</p>
                        </div>
                        <div>
                            <h3 className="font-bold text-lg mb-2">Soziales Engagement</h3>
                            <p className="text-gray-700">Aktive Teilnahme an Fridays for Future, Earth Day und mehr.</p>
                        </div>
                        <div>
                            <h3 className="font-bold text-lg mb-2">Klima-Investition</h3>
                            <p className="text-gray-700">CO2-neutrale Marketingkommunikation durch akkreditierte Projekte.</p>
                        </div>
                        <div>
                            <h3 className="font-bold text-lg mb-2">Campus-Sauberkeit</h3>
                            <p className="text-gray-700">Recycling-Stationen und jährliche Campus-Reinigungsevents.</p>
                        </div>
                    </div>
                </div>

                {/* Benefits */}
                <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">
                        Warum uns wählen? Entdecken Sie unsere Benefits.
                    </h2>
                    <div className="grid md:grid-cols-2 gap-6 text-gray-700">
                        <div>
                            <h3 className="font-bold text-lg mb-2">Smart Working</h3>
                            <p>Flexibilität beim Arbeitsort. Bis zu 4 Wochen pro Jahr von überall arbeiten.</p>
                        </div>
                        <div>
                            <h3 className="font-bold text-lg mb-2">Elternzeit</h3>
                            <p>5 Monate voll bezahlte Elternzeit für Geburtseltern, 3 Monate für Nicht-Geburtseltern.</p>
                        </div>
                        <div>
                            <h3 className="font-bold text-lg mb-2">Weiterentwicklung</h3>
                            <p>Bildungsbudget, Coaching-Sessions und Zeit für eigene Projekte.</p>
                        </div>
                        <div>
                            <h3 className="font-bold text-lg mb-2">Kultur</h3>
                            <p>Regelmäßige Team-Events, gemeinsame Mittagessen und Sportaktivitäten.</p>
                        </div>
                    </div>
                </div>

                {/* Application Process */}
                <div className="bg-gray-100 rounded-2xl shadow-lg p-8 md:p-12 mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">Bewerbungsprozess</h2>
                    <p className="text-lg text-gray-700 leading-relaxed mb-6">
                        Wie gesagt, Menschen stehen an erster Stelle, und das gilt auch für Kandidaten. Wir versuchen, so schnell wie möglich auf Ihre Bewerbung zu antworten.
                    </p>
                    <p className="text-gray-700 mb-6">
                        Die nächsten Schritte variieren je nach Rolle. Der Prozess umfasst in der Regel einen Anruf mit einem Recruiter, ein Video-Interview mit dem Hiring Manager und je nach Jobkategorie eine Coding-Challenge oder Fallstudie.
                    </p>
                    <button className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-lg transition-colors">
                        Alle offenen Stellen ansehen
                    </button>
                </div>

                {/* Social Links */}
                <div className="text-center">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">Folgen Sie uns auf</h3>
                    <div className="flex justify-center gap-6">
                        {['LinkedIn', 'Instagram', 'Facebook', 'X'].map((platform) => (
                            <a key={platform} href="#" className="text-red-600 hover:text-red-700 font-medium text-lg">
                                {platform}
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default KarrierePage;
