import React, { useEffect } from 'react';
import { t } from './translations';
import { useIsMobile } from './hooks/useIsMobile';

function MobileAppsPage() {
    const isMobile = useIsMobile();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const sellingTips = [
        'Antika', 'Araba', 'Lastik', 'Bebek', 'Resim', 'Tekne', 'Gelinlik', 'Masa Oyunları',
        'Pul', 'Kitap', 'CD', 'Çizgi Roman', 'Bilgisayar', 'DVD', 'Dijital Kamera', 'Yazıcı',
        'Elektronik', 'Bisiklet', 'Televizyon', 'Oyun', 'Tablo', 'Takı', 'Cep Telefonu', 'Ev',
        'Emlak', 'Kamera', 'Piyano', 'Laptop', 'Lego', 'MacBook', 'Model Araba',
        'Motosiklet', 'Mobilya', 'Madeni Para', 'Notebook', 'PC', 'Playmobil', 'Porselen',
        'Lastik', 'Plak', 'Ayakkabı', 'Akıllı Telefon', 'Bilet', 'Saat', 'Karavan'
    ];

    const features = [
        {
            title: t.mobileApps.features.postAds,
            desc: 'Kategori seçin, açıklama girin, tek tuşla fotoğraf çekin ve saniyeler içinde yayına alın.',
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
            ),
            color: 'bg-rose-500'
        },
        {
            title: t.mobileApps.features.nearby,
            desc: 'GPS tabanlı akıllı konumlama ile çevrenizdeki en şahane fırsatları anında keşfedin.',
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
            ),
            color: 'bg-blue-600'
        },
        {
            title: t.mobileApps.features.updates,
            desc: 'Anlık bildirimlerle aradığınız ürünler düştüğü anda haberdar olun, fırsatı kaçırmayın.',
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-0.214 1.055-0.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
            ),
            color: 'bg-amber-500'
        }
    ];

    return (
        <div className="min-h-screen bg-white font-sans selection:bg-rose-100 selection:text-rose-600">
            {/* Custom Styles for this page */}
            <style>{`
                @keyframes float {
                    0% { transform: translateY(0px); }
                    50% { transform: translateY(-20px); }
                    100% { transform: translateY(0px); }
                }
                .animate-float {
                    animation: float 6s ease-in-out infinite;
                }
                .glass-card {
                    background: rgba(255, 255, 255, 0.8);
                    backdrop-filter: blur(12px);
                    border: 1px solid rgba(255, 255, 255, 0.3);
                }
                .gradient-text-red {
                    background: linear-gradient(135deg, #e11d48 0%, #be123c 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }
            `}</style>

            {/* Hero Section - iOS Perspective */}
            <div className="relative pt-32 pb-20 md:pt-48 md:pb-40 overflow-hidden bg-[#fafafa]">
                {/* Background Blobs */}
                <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[600px] h-[600px] bg-rose-50 rounded-full blur-3xl opacity-60"></div>
                <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-[600px] h-[600px] bg-blue-50 rounded-full blur-3xl opacity-60"></div>

                <div className="max-w-7xl mx-auto px-4 relative z-10">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div className="text-left">
                            <span className="inline-block px-4 py-1.5 mb-6 text-sm font-bold tracking-widest text-rose-600 uppercase bg-rose-50 rounded-full">
                                YEPYENİ EXVİTRİN DENEYİMİ
                            </span>
                            <h1 className="text-5xl md:text-7xl font-black text-gray-900 leading-tight mb-8">
                                Cebinizdeki <br />
                                <span className="gradient-text-red">Dijital Vitrinimiz.</span>
                            </h1>
                            <p className="text-xl text-gray-600 leading-relaxed mb-10 max-w-xl">
                                Alışverişin en akıllı hali artık cebinizde. ExVitrin mobil uygulaması ile binlerce ilana saniyeler içinde ulaşın, satın veya kolayca yayınlayın.
                            </p>

                            <div className="flex flex-wrap gap-4">
                                <button className="flex items-center gap-3 bg-gray-900 text-white px-8 py-4 rounded-2xl hover:bg-black transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 group">
                                    <svg className="w-8 h-8 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M18.71 19.5c-0.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-0.79-3.29-0.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-0.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-0.91.65.03 2.47.26 3.64 1.98-0.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-0.03.07-0.42 1.44-1.38 2.83M13 3.5c.73-0.83 1.94-1.46 2.94-1.5.13 1.17-0.34 2.35-1.04 3.19-0.69.85-1.83 1.51-2.95 1.42-0.15-1.15.41-2.35 1.05-3.11z" />
                                    </svg>
                                    <div className="text-left">
                                        <div className="text-[10px] uppercase font-bold opacity-70 leading-none">Download on the</div>
                                        <div className="text-xl font-bold leading-none mt-1 uppercase tracking-tight">App Store</div>
                                    </div>
                                </button>

                                <button className="flex items-center gap-3 bg-white border-2 border-gray-100 text-gray-900 px-8 py-4 rounded-2xl hover:bg-gray-50 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 group">
                                    <svg className="w-8 h-8 text-gray-900 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
                                    </svg>
                                    <div className="text-left">
                                        <div className="text-[10px] uppercase font-bold opacity-70 leading-none">Get it on</div>
                                        <div className="text-xl font-bold leading-none mt-1 uppercase tracking-tight">Google Play</div>
                                    </div>
                                </button>
                            </div>
                        </div>

                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-tr from-rose-500/20 to-blue-500/20 rounded-full blur-[100px] animate-pulse"></div>
                            <img
                                src="/images/mobile_ios.png"
                                alt="ExVitrin App Mockup"
                                className="w-full h-auto relative z-10 animate-float pointer-events-none drop-shadow-2xl hover:drop-shadow-[0_35px_35px_rgba(0,0,0,0.25)] transition-all duration-700"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center max-w-3xl mx-auto mb-20">
                        <h2 className="text-4xl font-black text-gray-900 mb-6">Neden ExVitrin Mobil?</h2>
                        <p className="text-xl text-gray-600">Her özelliği sizin için en hızlı ve en kolay hale getirdik.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {features.map((f, i) => (
                            <div key={i} className="group p-10 rounded-[2.5rem] bg-[#fdfdfd] border border-gray-100 hover:border-rose-100 hover:bg-rose-50/30 transition-all duration-500 shadow-sm hover:shadow-xl hover:-translate-y-2">
                                <div className={`w-16 h-16 ${f.color} text-white rounded-2xl flex items-center justify-center mb-8 shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                                    {f.icon}
                                </div>
                                <h3 className="text-2xl font-black text-gray-900 mb-4 tracking-tight">{f.title}</h3>
                                <p className="text-gray-600 leading-relaxed text-lg">{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Android Section - Dark Style */}
            <div className="py-24 bg-gray-900 overflow-hidden relative">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-rose-500 to-transparent opacity-50"></div>

                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid lg:grid-cols-2 gap-20 items-center">
                        <div className="order-2 lg:order-1 relative">
                            <div className="absolute -inset-10 bg-rose-500/30 blur-[80px] rounded-full"></div>
                            <img
                                src="/images/mobile_android.png"
                                alt="Android App Mockup"
                                className="w-full h-auto relative z-10 rounded-3xl shadow-2xl lg:rotate-[-5deg] hover:rotate-0 transition-transform duration-700"
                            />
                        </div>

                        <div className="order-1 lg:order-2 text-left">
                            <h2 className="text-4xl md:text-5xl font-black text-white leading-tight mb-8">
                                Android Dünyasına <br />
                                <span className="text-rose-500 uppercase tracking-widest text-3xl">Tam Entegrasyon.</span>
                            </h2>
                            <p className="text-xl text-gray-400 leading-relaxed mb-10">
                                Google Play üzerinden anında erişin. Gelişmiş Android API'ları ile en akıcı ilan verme deneyimini yaşayın.
                            </p>
                            <button className="inline-flex items-center gap-4 bg-white text-gray-900 px-10 py-5 rounded-3xl font-black hover:bg-rose-500 hover:text-white transition-all shadow-xl group">
                                PLAY STORE'DAN İNDİR
                                <svg className="w-6 h-6 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sell Booster Section */}
            <div className="py-24">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="relative p-10 md:p-20 rounded-[3rem] bg-gradient-to-br from-rose-600 to-red-800 text-white overflow-hidden shadow-2xl shadow-rose-200">
                        {/* Abstract Shapes */}
                        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-red-400/20 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2"></div>

                        <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center text-left">
                            <div>
                                <h2 className="text-4xl md:text-6xl font-black mb-8 leading-tight">İlanını <br /> Süper Güçlerle <br /> Donat.</h2>
                                <p className="text-xl opacity-90 leading-relaxed mb-10 max-w-lg">
                                    Satış başarınızı %300 artırın. Vitrin, Premium ve turbo yükseltmelerle ilanınız binlerce kişinin önüne saniyeler içinde çıksın.
                                </p>
                                <button className="px-12 py-5 bg-white text-rose-600 rounded-[2rem] font-black text-xl hover:bg-gray-100 transition-all shadow-2xl hover:scale-105 active:scale-95">
                                    Paketlerimizi İncele
                                </button>
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="p-8 rounded-[2rem] bg-white/10 backdrop-blur-xl border border-white/20">
                                    <div className="text-4xl font-black mb-2 tracking-tighter">10K+</div>
                                    <div className="text-white/70 font-bold uppercase tracking-widest text-xs">Günlük Kullanıcı</div>
                                </div>
                                <div className="p-8 rounded-[2rem] bg-white/10 backdrop-blur-xl border border-white/20 mt-12">
                                    <div className="text-4xl font-black mb-2 tracking-tighter">50K+</div>
                                    <div className="text-white/70 font-bold uppercase tracking-widest text-xs">Aktif İlan</div>
                                </div>
                                <div className="p-8 rounded-[2rem] bg-white/10 backdrop-blur-xl border border-white/20">
                                    <div className="text-4xl font-black mb-2 tracking-tighter">85%</div>
                                    <div className="text-white/70 font-bold uppercase tracking-widest text-xs">Hızlı Satış Oranı</div>
                                </div>
                                <div className="p-8 rounded-[2rem] bg-white/10 backdrop-blur-xl border border-white/20 mt-12">
                                    <div className="text-4xl font-black mb-2 tracking-tighter">4.9/5</div>
                                    <div className="text-white/70 font-bold uppercase tracking-widest text-xs">App Puanı</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* A to Z Selling Tips - Creative Grid */}
            <div className="py-32 bg-[#fafafa] relative overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>

                <div className="max-w-7xl mx-auto px-4 relative z-10">
                    <div className="text-center mb-20">
                        <span className="text-rose-600 font-black tracking-[0.3em] text-xs mb-4 block uppercase">Kategorilerimiz</span>
                        <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 tracking-tight">Neler Satabilirsin?</h2>
                        <p className="text-xl text-gray-500 max-w-2xl mx-auto">ExVitrin'de her eşyanın bir değeri, her ilanın bir alıcısı vardır. İşte popüler kategorilerimizden bazıları:</p>
                    </div>

                    <div className="flex flex-wrap justify-center gap-4">
                        {sellingTips.map((tip, index) => (
                            <a
                                key={index}
                                href={`/search?q=${tip}`}
                                className="px-8 py-4 rounded-[1.5rem] bg-white border border-gray-100 text-gray-800 font-bold text-base hover:border-rose-200 hover:text-rose-600 hover:bg-rose-50/50 transition-all duration-300 shadow-sm hover:shadow-xl hover:-translate-y-1.5 flex items-center gap-2 group"
                            >
                                <span className="w-1.5 h-1.5 bg-gray-200 rounded-full group-hover:bg-rose-500 transition-colors"></span>
                                {tip}
                            </a>
                        ))}
                    </div>

                    <div className="mt-20 text-center">
                        <button
                            onClick={() => window.location.href = '/Butun-Kategoriler'}
                            className="text-rose-600 font-black text-lg hover:underline underline-offset-8 decoration-2"
                        >
                            Tüm Kategorileri Gör →
                        </button>
                    </div>
                </div>
            </div>

            {/* Premium Download CTA */}
            <div className="py-24 bg-white">
                <div className="max-w-5xl mx-auto px-4">
                    <div className="glass-card p-12 md:p-20 rounded-[4rem] text-center border-2 border-rose-50 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-rose-500 to-amber-500"></div>
                        <h2 className="text-4xl md:text-6xl font-black text-gray-900 mb-8 tracking-tighter">İndirmeye Hazır Mısın?</h2>
                        <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto font-medium">Binlerce kullanıcı arasına katıl, alışverişin keyfini ExVitrin mobil hızıyla çıkar.</p>

                        <div className="flex flex-wrap justify-center gap-6">
                            <img src="/images/mobile_ios.png" className="h-16 w-auto grayscale hover:grayscale-0 transition-all duration-500 cursor-pointer" alt="App Store" />
                            <img src="/images/mobile_android.png" className="h-16 w-auto grayscale hover:grayscale-0 transition-all duration-500 cursor-pointer" alt="Google Play" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Modern Footer Mini */}
            <div className="py-16 bg-[#0f172a] text-center relative">
                <div className="max-w-3xl mx-auto px-4">
                    <div className="flex justify-center gap-6 mb-12">
                        <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-white/40 hover:text-rose-500 hover:bg-white/10 transition-all cursor-pointer">
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-0.883.392-1.832.656-2.828.775 1.017-0.609 1.798-1.574 2.165-2.724-0.951.564-2.005.974-3.127 1.195-0.897-0.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-0.205-7.719-2.165-10.148-5.144-1.29 2.213-0.669 5.108 1.523 6.574-0.806-0.026-1.566-0.247-2.229-0.616-0.054 2.281 1.581 4.415 3.949 4.89-0.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-0.695 1.797-1.562 2.457-2.549z" /></svg>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-white/40 hover:text-rose-500 hover:bg-white/10 transition-all cursor-pointer">
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584 0.012 4.85 0.07 3.252 0.148 4.771 1.691 4.919 4.919 0.058 1.265 0.069 1.645 0.069 4.849 0 3.205-0.012 3.584-0.069 4.849-0.149 3.225-1.664 4.771-4.919 4.919-1.266 0.058-1.644 0.07-4.85 0.07-3.204 0-3.584-0.012-4.849-0.07-3.26-0.149-4.771-1.699-4.919-4.92-0.058-1.265-0.07-1.644-0.07-4.849 0-3.204 0.013-3.584 0.07-4.849 0.149-3.227 1.664-4.771 4.919-4.919 1.266-0.057 1.645-0.069 4.849-0.069zm0-2.163c-3.259 0-3.667 0.014-4.947 0.072-4.358 0.2-6.78 2.618-6.98 6.98-0.059 1.281-0.073 1.689-0.073 4.948 0 3.259 0.014 3.668 0.072 4.948 0.2 4.358 2.618 6.78 6.98 6.98 1.281 0.058 1.689 0.072 4.948 0.072 3.259 0 3.668-0.014 4.948-0.072 4.354-0.2 6.782-2.618 6.979-6.98 0.059-1.28 0.073-1.689 0.073-4.948 0-3.259-0.014-3.667-0.072-4.947-0.196-4.354-2.617-6.78-6.979-6.98-1.281-0.059-1.69-0.073-4.949-0.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-0.796 0-1.441 0.645-1.441 1.44s0.645 1.44 1.441 1.44c0.795 0 1.439-0.645 1.439-1.44s-0.644-1.44-1.439-1.44z" /></svg>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-white/40 hover:text-rose-500 hover:bg-white/10 transition-all cursor-pointer">
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M19.615 3.184c-3.604-0.246-11.631-0.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-0.266 4.356-2.62 4.385-8.816-0.029-6.185-0.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" /></svg>
                        </div>
                    </div>
                    <p className="text-gray-500 font-bold uppercase tracking-[0.3em] text-[10px]">© 2026 EXVİTRIN DİJİTAL HİZMETLER • GELECEĞİN İLAN DENEYİMİ</p>
                </div>
            </div>
        </div>
    );
}

export default MobileAppsPage;

