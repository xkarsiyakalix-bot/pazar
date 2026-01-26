import React from 'react';
import { t } from './translations';

function EngagementPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-red-600 to-red-700 text-white py-20">
                <div className="max-w-6xl mx-auto px-4 text-center">
                    <h1 className="text-5xl font-bold mb-6">{t.engagement.hero.title}</h1>
                    <p className="text-2xl opacity-90">{t.engagement.hero.subtitle}</p>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 py-12">
                {/* Intro */}
                <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 mb-12">
                    <p className="text-xl text-gray-700 leading-relaxed">
                        {t.engagement.intro.description}
                    </p>
                </div>

                {/* Social Fridays */}
                <div className="grid md:grid-cols-2 gap-8 mb-12">
                    <div>
                        <img src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800&q=80" alt="Bahnhofsmission" className="w-full h-96 object-cover rounded-2xl shadow-lg" />
                    </div>
                    <div className="flex flex-col justify-center">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Sosyal Cuma Günleri</h2>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            2018'den beri Zoologischer Garten'deki Tren İstasyonu Misyonu'nda düzenli olarak görev alıyoruz. Cuma günleri dört iş arkadaşımız yemek veya kıyafet dağıtımı, bulaşık yıkama ve diğer görevlerde yardımcı oluyor.
                        </p>
                        <div className="bg-red-50 p-6 rounded-xl">
                            <div className="text-4xl font-bold text-red-600 mb-2">285 Saat</div>
                            <p className="text-gray-700">Ekibimiz sadece 2022'nin ikinci yarısında istasyon misyonunda bu kadar saat yardımda bulundu.</p>
                        </div>
                    </div>
                </div>

                {/* Kinder.Akademie */}
                <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">Çocuk Akademisi – sosyal konular çocuklar için uygun şekilde paketlendi</h2>
                    <p className="text-lg text-gray-700 leading-relaxed mb-6">
                        Haziran 2022'den bu yana öğrenciler için sosyal konularda dersler düzenleniyor. Deneyimli öğretim üyeleri ve ilgililer tarafından çocuklara uygun bir şekilde hazırlanıp sunuluyor. Çocuk Akademisi'ni finansal olarak destekliyoruz çünkü eğitimin aynı zamanda bir gönül işi olması gerektiğine inanıyoruz.
                    </p>
                    <button className="text-red-600 hover:text-red-700 font-semibold">Çocuk Akademisi hakkında daha fazla bilgi →</button>
                </div>

                {/* Diversität */}
                <div className="grid md:grid-cols-2 gap-8 mb-12">
                    <div className="flex flex-col justify-center">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Çeşitlilik, Eşitlik ve Kapsayıcılık</h2>
                        <p className="text-gray-700 leading-relaxed">
                            Tüm çalışanlarımızın iş yerlerinde kendilerini rahat hissetmeleri, eşit muamele görmeleri ve bireyselliklerine değer verilmesi için çalışıyoruz. Adevinta for Everyone ekiplerimiz çeşitlilik, eşitlik ve kapsayıcılık konularımızı ileriye taşıyor.
                        </p>
                    </div>
                    <div>
                        <img src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80" alt="Diversität" className="w-full h-96 object-cover rounded-2xl shadow-lg" />
                    </div>
                </div>

                {/* Sicher im Internet */}
                <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl shadow-lg p-8 md:p-12 mb-12 text-white">
                    <h2 className="text-3xl font-bold mb-6">İnternette Güvenle Gezinin</h2>
                    <p className="text-lg leading-relaxed mb-6 opacity-90">
                        Deutschland sicher im Netz e. V. (kısaca DsiN) ile deneyimli bir ortağımız var. Dijital eğitim projelerine katılıyoruz. Odak noktamız internet üzerinden güvenli ticaret yapmaktır.
                    </p>
                    <button className="bg-white text-blue-600 font-bold py-3 px-8 rounded-lg hover:bg-gray-100 transition-colors">
                        Daha Fazla Bilgi
                    </button>
                </div>

                {/* Nachbarschaftshilfe */}
                <div className="grid md:grid-cols-2 gap-8 mb-12">
                    <div>
                        <img src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&q=80" alt="Nachbarschaftshilfe" className="w-full h-96 object-cover rounded-2xl shadow-lg" />
                    </div>
                    <div className="flex flex-col justify-center">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Komşu Yardımı</h2>
                        <p className="text-gray-700 leading-relaxed mb-6">
                            Korona pandemisinin başlangıcında Komşu Yardımı kategorisini oluşturduk. Burada komşular; alışveriş yapmak, matkap ödünç almak veya kayıp anahtarı aramak gibi tüm konularda ağ kurabilirler.
                        </p>
                        <button className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-lg transition-colors w-fit">
                            Komşu yardımı bul
                        </button>
                    </div>
                </div>

                {/* PRO bono */}
                <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">ExVitrin PRO bono</h2>
                    <p className="text-lg text-gray-700 leading-relaxed">
                        PRO paketlerimizle küçük ve orta ölçekli işletmeler kendilerini daha iyi tanıtabilirler. Bu avantajları hayvan barınaklarına ve evsizlere yardım kuruluşlarına da ücretsiz olarak sunuyoruz.
                    </p>
                </div>

                {/* Initiative Sicher Handeln */}
                <div className="bg-gray-900 rounded-2xl shadow-lg p-8 md:p-12 text-white">
                    <h2 className="text-3xl font-bold mb-6">Güvenli Ticaret Girişimi</h2>
                    <p className="text-lg leading-relaxed mb-6 opacity-90">
                        Tüketicileri dolandırıcılıktan korumak için Güvenli Ticaret Girişimi mevcuttur. ExVitrin, polis tarafından da desteklenen bu girişimin kurucu üyeleri arasındadır.
                    </p>
                    <button className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-lg transition-colors">
                        Güvenli Ticaret Girişimi hakkında daha fazla bilgi
                    </button>
                </div>
            </div>
        </div>
    );
}

export default EngagementPage;
