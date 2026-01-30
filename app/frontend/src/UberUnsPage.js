import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { t } from './translations';
import { fetchTotalActiveListingsCount } from './api/listings';
import { fetchTotalUserCount } from './api/profile';
import { supabase } from './lib/supabase';

function UberUnsPage() {
    const navigate = useNavigate();
    const [listingCount, setListingCount] = useState(null);
    const [userCount, setUserCount] = useState(null);

    useEffect(() => {
        const loadCounts = async () => {
            const [lCount, uCount] = await Promise.all([
                fetchTotalActiveListingsCount(),
                fetchTotalUserCount()
            ]);
            setListingCount(lCount);
            setUserCount(uCount);
        };
        loadCounts();

        const subscription = supabase
            .channel('public:listings')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'listings' }, () => {
                fetchTotalActiveListingsCount().then(setListingCount);
            })
            .subscribe();

        return () => {
            supabase.removeChannel(subscription);
        };
    }, []);

    const stats = [
        {
            label: t.aboutUs.facts.adsLabel,
            value: listingCount !== null ? listingCount.toLocaleString('tr-TR') : '...',
            icon: (
                <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
            )
        },
        {
            label: t.aboutUs.facts.locationLabel,
            value: t.aboutUs.facts.locationCity,
            icon: (
                <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
            )
        },
        {
            label: "Aktif Kullanıcı",
            value: userCount !== null ? userCount.toLocaleString('tr-TR') : '...',
            icon: (
                <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
            )
        }
    ];

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section with Glassmorphism Overlay */}
            <div className="relative h-[60vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img
                        src="/team_modern.png"
                        alt="ExVitrin Team"
                        className="w-full h-full object-cover filter brightness-50"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/10 to-white"></div>
                </div>

                <div className="relative z-10 text-center px-4 max-w-4xl animate-in fade-in zoom-in duration-700">
                    <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 tracking-tight drop-shadow-2xl">
                        {t.aboutUs.hero.title}
                    </h1>
                    <p className="text-xl md:text-3xl text-gray-100 font-medium drop-shadow-lg">
                        {t.aboutUs.hero.subtitle}
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-20">
                {/* Stats Grid - Floating Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
                    {stats.map((stat, idx) => (
                        <div
                            key={idx}
                            className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl hover:shadow-red-200/50 transition-all duration-300 transform hover:-translate-y-2 group"
                        >
                            <div className="mb-4 inline-flex p-3 bg-red-50 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                                {stat.icon}
                            </div>
                            <div className="text-4xl font-black text-gray-900 mb-1">{stat.value}</div>
                            <div className="text-gray-500 font-semibold uppercase tracking-wider text-sm">{stat.label}</div>
                        </div>
                    ))}
                </div>

                {/* About & Philosophy */}
                <div className="grid lg:grid-cols-2 gap-16 items-center mb-32">
                    <div className="space-y-8 animate-in slide-in-from-left duration-700">
                        <div>
                            <span className="text-red-600 font-bold uppercase tracking-widest text-sm mb-2 block">Vizyonumuz</span>
                            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
                                {t.aboutUs.about.title}
                            </h2>
                        </div>
                        <div className="space-y-6 text-lg text-gray-600 leading-relaxed">
                            <p className="bg-red-50 p-6 rounded-2xl border-l-4 border-red-500 font-medium text-red-900">
                                {t.aboutUs.about.description1}
                            </p>
                            <p>
                                {t.aboutUs.about.description2}
                            </p>
                        </div>
                    </div>
                    <div className="relative group animate-in slide-in-from-right duration-700">
                        <div className="absolute -inset-4 bg-gradient-to-r from-red-500 to-rose-500 rounded-3xl opacity-20 blur-2xl group-hover:opacity-30 transition-opacity"></div>
                        <div className="relative bg-white rounded-3xl overflow-hidden shadow-2xl">
                            <img
                                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=2070"
                                alt="Innovation"
                                className="w-full h-[400px] object-cover group-hover:scale-110 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8">
                                <p className="text-white text-xl font-bold italic">"Geleceği İzmir'den şekillendiriyoruz."</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mission Section - Full Width Gradient */}
                <div className="relative mb-32 overflow-hidden rounded-[2.5rem] bg-gray-900 text-white p-12 md:p-24 shadow-2xl">
                    <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-red-600/20 to-transparent"></div>
                    <div className="relative z-10 max-w-3xl">
                        <h2 className="text-4xl md:text-6xl font-black mb-8 leading-tight">
                            {t.aboutUs.mission.title}
                        </h2>
                        <p className="text-2xl md:text-3xl font-light text-red-400 mb-8 italic">
                            {t.aboutUs.mission.tagline}
                        </p>
                        <div className="space-y-6 text-lg text-gray-300 leading-relaxed">
                            <p>{t.aboutUs.mission.description1}</p>
                            <p>{t.aboutUs.mission.description2}</p>
                        </div>
                        <div className="mt-12 flex flex-wrap gap-4">
                            <button
                                onClick={() => navigate('/karriere')}
                                className="bg-red-600 hover:bg-red-700 text-white px-10 py-4 rounded-2xl font-bold transition-all shadow-xl shadow-red-900/40 transform hover:-translate-y-1"
                            >
                                {t.aboutUs.career.cta}
                            </button>
                            <button
                                onClick={() => navigate('/iletisim')}
                                className="bg-white/10 hover:bg-white/20 backdrop-blur-lg text-white border border-white/20 px-10 py-4 rounded-2xl font-bold transition-all transform hover:-translate-y-1"
                            >
                                {t.aboutUs.contact.cta}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Values / Why Us - Simple but Elegant */}
                <div className="text-center mb-32">
                    <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-16">Neden ExVitrin?</h2>
                    <div className="grid md:grid-cols-4 gap-8">
                        {[
                            { title: "Güvenlik", desc: "En üst düzey güvenlik protokolleri ile huzurlu ticaret.", icon: "🛡️" },
                            { title: "Hız", desc: "Saniyeler içinde ilan verin, dakikalar içinde satın.", icon: "🚀" },
                            { title: "Yerellik", desc: "İzmir'den tüm Türkiye'ye uzanan güçlü bağlar.", icon: "📍" },
                            { title: "Yenilik", desc: "Sürekli güncellenen modern kullanıcı deneyimi.", icon: "💡" }
                        ].map((item, i) => (
                            <div key={i} className="p-8 rounded-3xl bg-gray-50 hover:bg-white hover:shadow-xl transition-all duration-300">
                                <div className="text-4xl mb-4">{item.icon}</div>
                                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bottom CTA with Map/Location vibe */}
            <div className="bg-red-600 py-24 text-white">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <h2 className="text-4xl md:text-5xl font-black mb-6">Hala Sorularınız mı Var?</h2>
                    <p className="text-xl opacity-90 mb-10">Müşteri hizmetlerimiz size yardımcı olmaktan mutluluk duyacaktır.</p>
                    <button
                        onClick={() => navigate('/iletisim')}
                        className="bg-white text-red-600 px-12 py-5 rounded-[2rem] font-black text-lg hover:scale-105 transition-transform shadow-2xl"
                    >
                        Bizimle İletişime Geçin
                    </button>
                </div>
            </div>
        </div>
    );
}

export default UberUnsPage;

