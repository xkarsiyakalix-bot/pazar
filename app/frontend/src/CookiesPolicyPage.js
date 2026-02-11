import React from 'react';
import { Link } from 'react-router-dom';
import SEO from './SEO';

const CookiesPolicyPage = () => {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-neutral-950 transition-colors duration-300 pb-12">
            <SEO
                title="Çerez Politikası | ExVitrin"
                description="ExVitrin Çerez Politikası. Web sitemizde kullanılan çerezler, amaçları ve bunları nasıl yönetebileceğiniz hakkında bilgi edinin."
            />

            {/* Header Section */}
            <div className="bg-gradient-to-r from-neutral-900 via-neutral-800 to-neutral-900 text-white py-16 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
                <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl"></div>

                <div className="max-w-4xl mx-auto px-4 relative z-10 text-center">
                    <div className="inline-block px-4 py-1.5 mb-6 text-xs font-black tracking-widest text-blue-400 uppercase bg-blue-500/10 rounded-full border border-blue-500/20">
                        🍪 GİZLİLİK VE GÜVENLİK
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">
                        Çerez Politikası
                    </h1>
                    <p className="text-lg text-white/70 max-w-2xl mx-auto">
                        ExVitrin olarak gizliliğinize önem veriyoruz. Çerezleri nasıl kullandığımızı şeffaf bir şekilde açıklıyoruz.
                    </p>
                </div>
            </div>

            {/* Content Section */}
            <div className="max-w-4xl mx-auto px-4 -mt-8 relative z-20">
                <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-xl border border-neutral-100 dark:border-white/5 p-8 md:p-12">

                    {/* Introduction */}
                    <div className="prose prose-lg dark:prose-invert max-w-none">
                        <p className="lead text-xl text-neutral-600 dark:text-neutral-400 mb-8">
                            Bu Çerez Politikası, ExVitrin ("biz", "bize" veya "bizim") tarafından işletilen web sitesi (exvitrin.com) ve mobil uygulamaları için geçerlidir.
                        </p>

                        <h3 className="text-2xl font-bold text-neutral-900 dark:text-neutral-50 mb-4 flex items-center gap-3">
                            <span className="text-blue-500">1.</span> Çerez (Cookie) Nedir?
                        </h3>
                        <p className="text-neutral-600 dark:text-neutral-400 mb-6">
                            Çerezler, bir web sitesini ziyaret ettiğinizde tarayıcınız aracılığıyla cihazınıza (bilgisayar, tablet, telefon vb.) kaydedilen küçük metin dosyalarıdır.
                            Çerezler, web sitesinin daha verimli çalışmasını sağlamak, kullanıcı deneyimini iyileştirmek ve site sahiplerine bilgi sağlamak amacıyla yaygın olarak kullanılır.
                        </p>

                        <h3 className="text-2xl font-bold text-neutral-900 dark:text-neutral-50 mb-4 flex items-center gap-3">
                            <span className="text-blue-500">2.</span> Hangi Çerezleri Kullanıyoruz?
                        </h3>
                        <p className="text-neutral-600 dark:text-neutral-400 mb-4">
                            Sitemizde farklı amaçlarla çeşitli çerez türleri kullanılmaktadır:
                        </p>

                        <div className="grid gap-4 mb-8">
                            <div className="bg-gray-50 dark:bg-neutral-800 p-5 rounded-xl border-l-4 border-blue-500">
                                <h4 className="font-bold text-neutral-900 dark:text-neutral-100 mb-2">Zorunlu Çerezler</h4>
                                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                    Web sitesinin düzgün çalışması için gereklidir. Oturum açma, güvenli alanlara erişim ve sepet işlemleri gibi temel fonksiyonları sağlarlar.
                                    Bu çerezler olmadan web sitesi amaçlandığı gibi çalışamaz.
                                </p>
                            </div>
                            <div className="bg-gray-50 dark:bg-neutral-800 p-5 rounded-xl border-l-4 border-green-500">
                                <h4 className="font-bold text-neutral-900 dark:text-neutral-100 mb-2">Performans ve Analiz Çerezleri</h4>
                                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                    Siteyi nasıl kullandığınızı analiz ederek performansımızı ölçmemize ve iyileştirmemize yardımcı olur (örn. en çok ziyaret edilen sayfalar, hata mesajları).
                                    Bu veriler anonim olarak toplanır.
                                </p>
                            </div>
                            <div className="bg-gray-50 dark:bg-neutral-800 p-5 rounded-xl border-l-4 border-purple-500">
                                <h4 className="font-bold text-neutral-900 dark:text-neutral-100 mb-2">İşlevsellik Çerezleri</h4>
                                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                    Dil tercihleriniz, konumunuz veya kullanıcı adınız gibi seçimlerinizi hatırlayarak size daha kişiselleştirilmiş bir deneyim sunmamızı sağlar.
                                </p>
                            </div>
                            <div className="bg-gray-50 dark:bg-neutral-800 p-5 rounded-xl border-l-4 border-orange-500">
                                <h4 className="font-bold text-neutral-900 dark:text-neutral-100 mb-2">Hedefleme ve Reklam Çerezleri</h4>
                                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                    İlgi alanlarınıza uygun reklamlar göstermek ve reklam kampanyalarının etkinliğini ölçmek için kullanılır. Bu çerezler genellikle üçüncü taraf reklam ağları tarafından yerleştirilir.
                                </p>
                            </div>
                        </div>

                        <h3 className="text-2xl font-bold text-neutral-900 dark:text-neutral-50 mb-4 flex items-center gap-3">
                            <span className="text-blue-500">3.</span> Çerezleri Nasıl Yönetebilirsiniz?
                        </h3>
                        <p className="text-neutral-600 dark:text-neutral-400 mb-4">
                            Çoğu internet tarayıcısı çerezleri otomatik olarak kabul edecek şekilde ayarlanmıştır. Ancak, tarayıcı ayarlarınızı değiştirerek çerezleri engelleyebilir veya silebilirsiniz.
                            Çerezleri devre dışı bırakmanız durumunda, web sitemizin bazı özellikleri düzgün çalışmayabilir.
                        </p>
                        <p className="text-neutral-600 dark:text-neutral-400 mb-6">
                            Tarayıcınızın yardım menüsünden çerez ayarlarını nasıl değiştireceğinizi öğrenebilirsiniz.
                        </p>

                        <h3 className="text-2xl font-bold text-neutral-900 dark:text-neutral-50 mb-4 flex items-center gap-3">
                            <span className="text-blue-500">4.</span> Değişiklikler ve İletişim
                        </h3>
                        <p className="text-neutral-600 dark:text-neutral-400 mb-6">
                            Bu Çerez Politikası'nı zaman zaman güncelleyebiliriz. Herhangi bir değişiklik yaptığımızda, güncelleme tarihini sayfanın en altında belirteceğiz.
                        </p>
                        <p className="text-neutral-600 dark:text-neutral-400">
                            Çerez politikamızla ilgili sorularınız varsa, lütfen bizimle <Link to="/iletisim" className="text-blue-600 hover:underline font-bold">iletişim sayfası</Link> üzerinden irtibata geçin.
                        </p>

                        <div className="mt-12 pt-8 border-t border-neutral-100 dark:border-white/10 text-sm text-neutral-400 text-center">
                            Son Güncelleme: 01.02.2026
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
