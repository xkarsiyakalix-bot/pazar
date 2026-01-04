import React from 'react';

function EngagementPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-red-600 to-red-700 text-white py-20">
                <div className="max-w-6xl mx-auto px-4 text-center">
                    <h1 className="text-5xl font-bold mb-6">In bester Gesellschaft</h1>
                    <p className="text-2xl opacity-90">Und was wir tun, damit es so bleibt</p>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 py-12">
                {/* Intro */}
                <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 mb-12">
                    <p className="text-xl text-gray-700 leading-relaxed">
                        Was können wir (noch) besser machen? Diese Frage treibt uns bei Kleinbazaar an. Wir glauben daran, dass alle etwas dazu beitragen können, dass unsere Gesellschaft (zusammen)wächst. Und das beginnt schon mit kleinen Dingen. Deswegen haben wir einfach mal angefangen.
                    </p>
                </div>

                {/* Social Fridays */}
                <div className="grid md:grid-cols-2 gap-8 mb-12">
                    <div>
                        <img src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800&q=80" alt="Bahnhofsmission" className="w-full h-96 object-cover rounded-2xl shadow-lg" />
                    </div>
                    <div className="flex flex-col justify-center">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Social Fridays</h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            Seit 2018 packen wir regelmäßig bei der Bahnhofsmission am Zoologischen Garten an. Bis zu vier Kolleginnen und Kollegen helfen freitags mit – bei der Essens- oder Kleiderausgabe, beim Abwasch und anderen Aufgaben.
                        </p>
                        <div className="bg-red-50 p-6 rounded-xl">
                            <div className="text-4xl font-bold text-red-600 mb-2">285 Stunden</div>
                            <p className="text-gray-700">So viele Stunden hat das Team allein im zweiten Halbjahr 2022 in der Bahnhofsmission ausgeholfen.</p>
                        </div>
                    </div>
                </div>

                {/* Kinder.Akademie */}
                <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">Die Kinder.Akademie – soziale Themen kindgerecht verpackt</h2>
                    <p className="text-lg text-gray-700 leading-relaxed mb-6">
                        Seit Juni 2022 finden Vorlesungen für Schülerinnen und Schüler zu sozialen Themen statt. Kindgerecht aufbereitet und präsentiert von erfahrenen Dozentinnen und Dozenten – und Betroffenen. Wir fördern die Kinder.Akademie finanziell, weil wir finden, dass Bildung auch Herzensbildung sein sollte.
                    </p>
                    <button className="text-red-600 hover:text-red-700 font-semibold">Mehr zur Kinder.Akademie →</button>
                </div>

                {/* Diversität */}
                <div className="grid md:grid-cols-2 gap-8 mb-12">
                    <div className="flex flex-col justify-center">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Diversität, Gleichberechtigung und Inklusion</h2>
                        <p className="text-gray-700 leading-relaxed">
                            Wir arbeiten daran, dass alle Mitarbeiterinnen und Mitarbeiter sich an ihrem Arbeitsplatz wohlfühlen, gleich behandelt und für ihre Individualität geschätzt werden. Unsere Teams von Adevinta for Everyone treiben unsere Diversitäts-, Gleichberechtigungs- und Inklusionsthemen voran.
                        </p>
                    </div>
                    <div>
                        <img src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80" alt="Diversität" className="w-full h-96 object-cover rounded-2xl shadow-lg" />
                    </div>
                </div>

                {/* Sicher im Internet */}
                <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl shadow-lg p-8 md:p-12 mb-12 text-white">
                    <h2 className="text-3xl font-bold mb-6">Sicher im Internet unterwegs</h2>
                    <p className="text-lg leading-relaxed mb-6 opacity-90">
                        Mit Deutschland sicher im Netz e. V. (kurz DsiN) haben wir einen erfahrenen Partner. Wir beteiligen uns an DsiN-Projekten zur digitalen Aufklärung. Unser Schwerpunkt ist dabei das sichere Handeln über das Internet.
                    </p>
                    <button className="bg-white text-blue-600 font-bold py-3 px-8 rounded-lg hover:bg-gray-100 transition-colors">
                        Mehr Infos
                    </button>
                </div>

                {/* Nachbarschaftshilfe */}
                <div className="grid md:grid-cols-2 gap-8 mb-12">
                    <div>
                        <img src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&q=80" alt="Nachbarschaftshilfe" className="w-full h-96 object-cover rounded-2xl shadow-lg" />
                    </div>
                    <div className="flex flex-col justify-center">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Nachbarschaftshilfe</h2>
                        <p className="text-gray-700 leading-relaxed mb-6">
                            Zu Beginn der Corona-Pandemie haben wir die Kategorie Nachbarschaftshilfe geschaffen. Hier können sich Nachbarinnen und Nachbarn zu allen Themen vernetzen – ob Einkauf erledigen, Bohrmaschine leihen oder den verlorenen Schlüssel suchen.
                        </p>
                        <button className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-lg transition-colors w-fit">
                            Nachbarschaftshilfe finden
                        </button>
                    </div>
                </div>

                {/* PRO bono */}
                <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">Kleinbazaar PRO bono</h2>
                    <p className="text-lg text-gray-700 leading-relaxed">
                        Mit unseren PRO-Paketen können sich kleine und mittelständische Unternehmen noch besser präsentieren. Diese Vorteile bieten wir auch Tierschutzvereinen und Einrichtungen der Obdachlosenhilfe – und das kostenfrei.
                    </p>
                </div>

                {/* Initiative Sicher Handeln */}
                <div className="bg-gray-900 rounded-2xl shadow-lg p-8 md:p-12 text-white">
                    <h2 className="text-3xl font-bold mb-6">Initiative Sicher Handeln</h2>
                    <p className="text-lg leading-relaxed mb-6 opacity-90">
                        Um Verbraucherinnen und Verbraucher vor Betrug zu schützen, gibt es die Initiative Sicher Handeln. Kleinbazaar gehört zu den Gründungsmitgliedern dieser Initiative, die auch von der Polizei getragen wird.
                    </p>
                    <button className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-lg transition-colors">
                        Weitere Infos zur Initiative Sicher Handeln
                    </button>
                </div>
            </div>
        </div>
    );
}

export default EngagementPage;
