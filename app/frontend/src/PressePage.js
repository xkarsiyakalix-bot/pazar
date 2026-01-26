import React from 'react';
import { t } from './translations';

function PressePage() {
    const pressReleases = [
        {
            date: '20.11.2025',
            title: 'Tehlikeli Özgüven: Tüketicilerin dörtte üçü sahte mağaza uyarı sinyallerini yetersiz tanıyor',
            excerpt: 'Giderek daha fazla sahte mağaza profesyonel tasarım ve sahte incelemelerle aldatıyor. Aynı zamanda birçok tüketicinin uyanıklığı azalıyor: Yüzde 80\'den fazlası sahte mağazaların ne olduğunu bildiğini söylese de, sadece yaklaşık dörtte biri tüm önemli uyarı sinyallerini tanıyor.',
            image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80'
        },
        {
            date: '18.11.2025',
            title: 'Fotoğraftan Satışa: ExVitrin\'in yeni yapay zeka asistanı saniyeler içinde ilan oluşturuyor',
            excerpt: 'ExVitrin, uygulama içindeki yapay zeka tabanlı ilan oluşturma fonksiyonunu yeniden genişletiyor. Gelecekte birçok kategoride yeni bir ilan oluşturmak için sadece bir fotoğraf yeterli olacak.',
            image: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&q=80'
        },
        {
            date: '06.11.2025',
            title: 'Konut ve Ev Piyasası: Kiralık daire arzı fark edilir şekilde toparlanıyor',
            excerpt: 'Almanya\'daki büyük şehirlerde devam eden konut sıkıntısının gölgesinde, konut ve ev piyasasında olumlu bir gelişme görülüyor.',
            image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80'
        },
        {
            date: '04.11.2025',
            title: 'Ghosting, Pazarlık, Ani İptaller: İşte ankete göre ExVitrin anlaşmalarındaki en büyük "yapılmaması gerekenler"',
            excerpt: 'Özel kişiler arasında alım satım bir güven meselesidir - ve genellikle gerçek bir denge oyunudur. ExVitrin adına yapılan güncel bir YouGov anketi, kullanıcıları gerçekte neyin rahatsız ettiğini gösteriyor.',
            image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800&q=80'
        },
        {
            date: '29.10.2025',
            title: '"Korku Evleri": Neredeyse her iki kişiden biri cinayetten korkmuyor',
            excerpt: 'Bir kişinin şiddet görerek öldüğü mülkler, emlakçıları her zaman büyük zorluklarla karşı karşıya bırakır. Temsili bir ankete göre, her on katılımcıdan dördü sözde bir "cinayet evi"ne taşınabilir.',
            image: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=800&q=80'
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-red-600 to-red-700 text-white py-16">
                <div className="max-w-6xl mx-auto px-4">
                    <h1 className="text-5xl font-bold mb-4">{t.presse.hero.title}</h1>
                    <p className="text-xl opacity-90">{t.presse.hero.subtitle}</p>
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
                                        {release.date} | ExVitrin tarafından
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                                        {release.title}
                                    </h2>
                                    <p className="text-gray-700 mb-6 leading-relaxed">
                                        {release.excerpt}
                                    </p>
                                    <button className="text-red-600 hover:text-red-700 font-semibold flex items-center gap-2">
                                        {t.presse.more}
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
                        {t.presse.showAll}
                    </button>
                </div>

                {/* Contact Section */}
                <div className="mt-16 bg-white rounded-2xl shadow-lg p-8 md:p-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">{t.presse.contact.title}</h2>
                    <div className="grid md:grid-cols-2 gap-8">
                        <div>
                            <h3 className="font-bold text-lg mb-2">{t.presse.contact.generalTitle}</h3>
                            <p className="text-gray-700 mb-2">E-Posta: presse@exvitrin.de</p>
                            <p className="text-gray-700">Telefon: +49 30 12345678</p>
                        </div>
                        <div>
                            <h3 className="font-bold text-lg mb-2">{t.presse.contact.materialTitle}</h3>
                            <p className="text-gray-700 mb-4">
                                {t.presse.contact.materialDescription}
                            </p>
                            <button className="text-red-600 hover:text-red-700 font-semibold">
                                {t.presse.contact.materialCta} →
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PressePage;
