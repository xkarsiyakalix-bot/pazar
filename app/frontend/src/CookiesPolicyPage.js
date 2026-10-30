import React from 'react';
import { Link } from 'react-router-dom';
import SEO from './SEO';

const CookiesPolicyPage = () => {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-neutral-950 transition-colors duration-300 pb-16">
            <SEO
                title="Çerez Aydınlatma Metni ve Politikası | ExVitrin"
                description="ExVitrin Çerez Aydınlatma Metni. 6698 sayılı KVKK kapsamında platformumuzda kullanılan çerez türleri, hukuki sebepleri ve haklarınız."
            />

            {/* Header Section */}
            <div className="bg-gradient-to-r from-neutral-900 via-neutral-800 to-neutral-900 text-white py-16 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
                <div className="absolute -top-24 -right-24 w-96 h-96 bg-rose-600/20 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl"></div>

                <div className="max-w-4xl mx-auto px-4 relative z-10 text-center">
                    <div className="inline-block px-4 py-1.5 mb-6 text-xs font-black tracking-widest text-rose-400 uppercase bg-rose-500/10 rounded-full border border-rose-500/20">
                        🍪 6698 SAYILI KVKK UYARINCA
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">
                        Çerez Aydınlatma Metni
                    </h1>
                    <p className="text-lg text-white/70 max-w-2xl mx-auto">
                        ExVitrin olarak kişisel verilerinizin güvenliğine ve gizliliğinize en üst düzeyde önem veriyoruz.
                    </p>
                </div>
            </div>

            {/* Content Section */}
            <div className="max-w-4xl mx-auto px-4 -mt-8 relative z-20">
                <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-xl border border-neutral-100 dark:border-white/5 p-8 md:p-12 text-neutral-700 dark:text-neutral-300">

                    <div className="space-y-8">
                        {/* Giriş */}
                        <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200/60 dark:border-neutral-700 text-sm leading-relaxed">
                            <p className="font-medium text-neutral-800 dark:text-neutral-200 mb-2">
                                <strong>Veri Sorumlusu:</strong> ExVitrin İnternet Platformu (“ExVitrin” veya “Platform”)
                            </p>
                            <p>
                                İşbu Çerez Aydınlatma Metni, 6698 Sayılı Kişisel Verilerin Korunması Kanunu (“KVKK”) ve Kişisel Verileri Koruma Kurulu’nun Çerez Uygulamaları Hakkında Rehberi uyarınca, <strong>exvitrin.com</strong> internet sitemiz ve mobil uygulamalarımız üzerinden kullanılan çerezlerin cihazınıza yerleştirilmesi aracılığıyla elde edilen kişisel verilerin işlenmesine ilişkin sizleri bilgilendirmek amacıyla hazırlanmıştır.
                            </p>
                        </div>

                        {/* 1. Çerez Nedir */}
                        <div>
                            <h3 className="text-2xl font-black text-neutral-900 dark:text-neutral-50 mb-3 flex items-center gap-3">
                                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-rose-500/10 text-rose-600 text-base font-black">1</span>
                                Çerez (Cookie) Nedir?
                            </h3>
                            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                                Çerezler, web sitemizi ziyaret ettiğinizde veya mobil uygulamamızı kullandığınızda tarayıcınız vasıtasıyla cihazınıza (bilgisayar, tablet, akıllı telefon) kaydedilen küçük metin dosyalarıdır. Çerezler; oturumunuzun açık kalmasını sağlamak, site performansını analiz etmek ve tercihlerinizi hatırlayarak sizlere daha hızlı ve kişiselleştirilmiş bir kullanıcı deneyimi sunmak amacıyla kullanılır.
                            </p>
                        </div>

                        {/* 2. Çerez Türleri */}
                        <div>
                            <h3 className="text-2xl font-black text-neutral-900 dark:text-neutral-50 mb-3 flex items-center gap-3">
                                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-rose-500/10 text-rose-600 text-base font-black">2</span>
                                Hangi Çerez Türlerini Kullanıyoruz?
                            </h3>
                            <p className="text-neutral-600 dark:text-neutral-400 mb-4 leading-relaxed">
                                Platformumuz üzerinde kullanım sürelerine göre <strong>oturum çerezleri</strong> (tarayıcı kapatıldığında silinen) ve <strong>kalıcı çerezler</strong> (belirli bir süre cihazınızda saklanan); kaynaklarına göre ise doğrudan sitemizce yerleştirilen <strong>birinci taraf</strong> ve iş ortaklarımızca yerleştirilen <strong>üçüncü taraf</strong> çerezler kullanılmaktadır:
                            </p>

                            <div className="grid gap-4 mt-4">
                                <div className="bg-neutral-50 dark:bg-neutral-800/80 p-5 rounded-xl border-l-4 border-blue-500">
                                    <h4 className="font-bold text-neutral-900 dark:text-neutral-100 mb-1 flex items-center justify-between">
                                        <span>Zorunlu Çerezler</span>
                                        <span className="text-[11px] font-black uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/40 px-2 py-0.5 rounded">Temel / Birinci Taraf</span>
                                    </h4>
                                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                        Web sitesinin ve mobil uygulamanın çalışması, kullanıcı girişi (login), güvenlik doğrulaması, ilan yükleme formlarının korunması ve güvenli sepet/profil adımlarının yürütülmesi için zorunludur. Bu çerezler kapatılamaz.
                                    </p>
                                </div>

                                <div className="bg-neutral-50 dark:bg-neutral-800/80 p-5 rounded-xl border-l-4 border-emerald-500">
                                    <h4 className="font-bold text-neutral-900 dark:text-neutral-100 mb-1 flex items-center justify-between">
                                        <span>İşlevsel Çerezler</span>
                                        <span className="text-[11px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/40 px-2 py-0.5 rounded">Tercihler</span>
                                    </h4>
                                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                        Gece modu (karanlık/aydınlık tema), seçilen şehir ve ilçe filtreleri, dil tercihleri gibi ayarlarınızı hatırlamamızı sağlayarak platformu bir sonraki ziyaretinizde daha kolay kullanmanıza imkân tanır.
                                    </p>
                                </div>

                                <div className="bg-neutral-50 dark:bg-neutral-800/80 p-5 rounded-xl border-l-4 border-purple-500">
                                    <h4 className="font-bold text-neutral-900 dark:text-neutral-100 mb-1 flex items-center justify-between">
                                        <span>Performans ve Analitik Çerezler</span>
                                        <span className="text-[11px] font-black uppercase tracking-wider text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/40 px-2 py-0.5 rounded">İstatistik</span>
                                    </h4>
                                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                        Ziyaretçilerin sayfaları nasıl kullandığını, sayfa yükleme hızlarını ve olası teknik hataları anonim/istatistiki olarak analiz etmemizi sağlar. Bu veriler yalnızca sitemizi geliştirmek ve hızlandırmak amacıyla kullanılır.
                                    </p>
                                </div>

                                <div className="bg-neutral-50 dark:bg-neutral-800/80 p-5 rounded-xl border-l-4 border-amber-500">
                                    <h4 className="font-bold text-neutral-900 dark:text-neutral-100 mb-1 flex items-center justify-between">
                                        <span>Pazarlama ve Reklam Çerezleri</span>
                                        <span className="text-[11px] font-black uppercase tracking-wider text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/40 px-2 py-0.5 rounded">Üçüncü Taraf</span>
                                    </h4>
                                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                        İlgi alanlarınıza uygun ilan ve içerik önerileri sunmak ve reklam kampanyalarının etkinliğini ölçümlemek amacıyla iş ortaklarımız aracılığıyla yerleştirilebilen çerezlerdir.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* 3. Hukuki Sebepler */}
                        <div>
                            <h3 className="text-2xl font-black text-neutral-900 dark:text-neutral-50 mb-3 flex items-center gap-3">
                                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-rose-500/10 text-rose-600 text-base font-black">3</span>
                                Kişisel Verilerinizin İşlenme Amacı ve Hukuki Sebebi
                            </h3>
                            <p className="text-neutral-600 dark:text-neutral-400 mb-3 leading-relaxed">
                                Çerezler vasıtasıyla toplanan kişisel verileriniz, 6698 Sayılı KVKK’nın 5. maddesinde belirtilen aşağıdaki hukuki sebeplere dayanılarak işlenmektedir:
                            </p>
                            <ul className="list-disc pl-6 space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
                                <li>
                                    <strong>Zorunlu Çerezler:</strong> KVKK m. 5/2 (c) kapsamında <em>“Bir sözleşmenin kurulması veya ifasıyla doğrudan doğruya ilgili olması”</em> ve m. 5/2 (f) kapsamında <em>“Veri sorumlusunun meşru menfaatleri için veri işlenmesinin zorunlu olması”</em> hukuki sebebine dayanır.
                                </li>
                                <li>
                                    <strong>İşlevsel Çerezler:</strong> Tercihlerinizin hatırlanması ve kişiselleştirilmiş hizmet sunulması amacıyla KVKK m. 5/1 uyarınca <strong>açık rızanız</strong> dahilinde işlenir.
                                </li>
                                <li>
                                    <strong>Performans ve Analitik Çerezler:</strong> Birinci taraf anonim ölçümler meşru menfaat kapsamında; üçüncü taraf analiz araçları ise KVKK m. 5/1 uyarınca <strong>açık rızanız</strong> kapsamında işlenir.
                                </li>
                                <li>
                                    <strong>Pazarlama ve Reklam Çerezleri:</strong> KVKK m. 5/1 uyarınca yalnızca kullanıcıların <strong>açık rızası</strong> bulunması halinde işlenmektedir.
                                </li>
                            </ul>
                        </div>

                        {/* 4. Çerezleri Nasıl Yönetebilirsiniz */}
                        <div>
                            <h3 className="text-2xl font-black text-neutral-900 dark:text-neutral-50 mb-3 flex items-center gap-3">
                                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-rose-500/10 text-rose-600 text-base font-black">4</span>
                                Çerez Tercihlerinizi Nasıl Yönetebilirsiniz?
                            </h3>
                            <p className="text-neutral-600 dark:text-neutral-400 mb-4 leading-relaxed">
                                Tarayıcınızın ayarlarını değiştirerek çerezlere ilişkin tercihlerinizi dilediğiniz zaman özelleştirebilir, çerezleri engelleyebilir veya silebilirsiniz. Ancak zorunlu çerezlerin kapatılması durumunda platformun bazı fonksiyonları (oturum açma, ilan ekleme vb.) düzgün çalışmayabilir.
                            </p>
                            <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-3">
                                Sık Kullanılan Tarayıcılarda Çerez Yönetimi:
                            </p>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-bold">
                                <a
                                    href="https://support.google.com/chrome/answer/95647?hl=tr"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-3 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-200 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-center transition-colors flex items-center justify-center gap-1.5"
                                >
                                    Google Chrome ↗
                                </a>
                                <a
                                    href="https://support.apple.com/tr-tr/guide/safari/sfri11471/mac"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-3 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-200 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-center transition-colors flex items-center justify-center gap-1.5"
                                >
                                    Apple Safari ↗
                                </a>
                                <a
                                    href="https://support.mozilla.org/tr/kb/cerezler-web-sitelerinin-bilgisayarinizda-depoladi"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-3 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-200 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-center transition-colors flex items-center justify-center gap-1.5"
                                >
                                    Mozilla Firefox ↗
                                </a>
                                <a
                                    href="https://support.microsoft.com/tr-tr/microsoft-edge/microsoft-edge-te-%C3%A7erezleri-silme-63947406-40ac-c3b8-57b9-2a946a29ae09"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-3 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-200 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-center transition-colors flex items-center justify-center gap-1.5"
                                >
                                    Microsoft Edge ↗
                                </a>
                            </div>
                        </div>

                        {/* 5. KVKK Madde 11 Hakları */}
                        <div>
                            <h3 className="text-2xl font-black text-neutral-900 dark:text-neutral-50 mb-3 flex items-center gap-3">
                                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-rose-500/10 text-rose-600 text-base font-black">5</span>
                                KVKK’nın 11. Maddesi Uyarınca Haklarınız
                            </h3>
                            <p className="text-neutral-600 dark:text-neutral-400 mb-3 leading-relaxed">
                                Kişisel veri sahibi olarak dilediğiniz zaman Kanun’un 11. maddesi kapsamında aşağıdaki haklarınızı kullanabilirsiniz:
                            </p>
                            <div className="grid md:grid-cols-2 gap-2.5 text-xs text-neutral-600 dark:text-neutral-400">
                                <div className="p-3 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg border border-neutral-100 dark:border-white/5">
                                    • Kişisel verilerinizin işlenip işlenmediğini öğrenme
                                </div>
                                <div className="p-3 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg border border-neutral-100 dark:border-white/5">
                                    • Kişisel verileriniz işlenmişse buna ilişkin bilgi talep etme
                                </div>
                                <div className="p-3 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg border border-neutral-100 dark:border-white/5">
                                    • İşlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme
                                </div>
                                <div className="p-3 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg border border-neutral-100 dark:border-white/5">
                                    • Yurt içinde veya yurt dışında aktarıldığı 3. kişileri bilme
                                </div>
                                <div className="p-3 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg border border-neutral-100 dark:border-white/5">
                                    • Eksik veya yanlış işlenmişse düzeltilmesini isteme
                                </div>
                                <div className="p-3 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg border border-neutral-100 dark:border-white/5">
                                    • KVKK m. 7 uyarınca silinmesini veya yok edilmesini talep etme
                                </div>
                                <div className="p-3 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg border border-neutral-100 dark:border-white/5">
                                    • Düzeltme ve silme işlemlerinin aktarılan 3. kişilere bildirilmesini isteme
                                </div>
                                <div className="p-3 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg border border-neutral-100 dark:border-white/5">
                                    • Kanuna aykırı işleme nedeniyle zarara uğranması halinde zararın giderilmesini talep etme
                                </div>
                            </div>
                        </div>

                        {/* 6. İletişim & Başvuru */}
                        <div className="pt-6 border-t border-neutral-100 dark:border-neutral-800">
                            <h3 className="text-xl font-black text-neutral-900 dark:text-neutral-50 mb-3">
                                6. Veri Sorumlusu ile İletişim ve Başvuru
                            </h3>
                            <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed mb-4">
                                Yukarıda belirtilen haklarınızı kullanmak ve çerez politikamızla ilgili tüm soru ve talepleriniz için bizimle iletişime geçebilirsiniz. Başvurularınız en geç 30 (otuz) gün içerisinde ücretsiz olarak sonuçlandırılacaktır:
                            </p>
                            <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/70 border border-neutral-200 dark:border-neutral-700 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between text-sm">
                                <div>
                                    <div className="font-bold text-neutral-900 dark:text-neutral-100">ExVitrin Destek ve KVKK İletişim:</div>
                                    <div className="text-neutral-500 dark:text-neutral-400 text-xs">E-posta: <a href="mailto:destek@exvitrin.com" className="text-rose-600 dark:text-rose-400 font-bold hover:underline">destek@exvitrin.com</a></div>
                                </div>
                                <Link
                                    to="/iletisim"
                                    className="px-5 py-2.5 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-xl font-bold text-xs hover:bg-rose-600 dark:hover:bg-rose-500 hover:text-white dark:hover:text-white transition-colors"
                                >
                                    İletişim Formuna Git
                                </Link>
                            </div>

                            <div className="mt-8 text-center text-xs text-neutral-400">
                                Son Güncelleme: 30 Ekim 2026 • ExVitrin Platformu
                            </div>
                        </div>
                    </div>
                </div>

                {/* Navigation Buttons */}
                <div className="mt-8 flex justify-center">
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-white dark:bg-neutral-800 rounded-xl shadow-sm hover:shadow-md text-neutral-700 dark:text-neutral-200 font-bold transition-all hover:-translate-y-1"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Ana Sayfaya Dön
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default CookiesPolicyPage;
