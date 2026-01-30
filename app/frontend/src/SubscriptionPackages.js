import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from './lib/supabase';
import { fetchUserProfile } from './api/profile';
import LoadingSpinner from './components/LoadingSpinner';

const SubscriptionPackages = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [processing] = useState(false);
    const [isAnnual, setIsAnnual] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0);
        const getSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                const profile = await fetchUserProfile(session.user.id);
                setUser(profile);
            }
            setLoading(false);
        };
        getSession();
    }, []);

    const packages = [
        {
            id: 'free',
            name: 'Standart',
            price: '0',
            annualPrice: '0',
            features: [
                'Her ay 20 Ücretsiz İlan',
                'İlan başına 9,90 TL ek ücret',
                'Temel istatistikler',
                'Mesajlaşma özelliği'
            ],
            color: 'from-slate-400 to-slate-600',
            glow: 'shadow-slate-200/50',
            buttonText: 'Mevcut Paket',
            popular: false
        },
        {
            id: 'pack1',
            name: 'Başlangıç Kurumsal',
            price: '399',
            annualPrice: '3999',
            limit: '40',
            features: [
                'Her ay 40 İlan hakkı',
                '20 Bonus ilan dahil',
                'Kurumsal Rozet',
                'Mağaza Sayfası',
                'Müşteri Hattı Gösterimi'
            ],
            color: 'from-blue-500 to-indigo-600',
            glow: 'shadow-blue-200/50',
            buttonText: 'Hemen Başla',
            popular: false
        },
        {
            id: 'pack2',
            name: 'Pro Kurumsal',
            price: '599',
            annualPrice: '5999',
            limit: '70',
            features: [
                'Her ay 70 İlan hakkı',
                '50 Bonus ilan dahil',
                'Öncelikli Destek',
                'Gelişmiş Mağaza Görünümü',
                'Arama Sonuçlarında Öne Çıkma'
            ],
            color: 'from-rose-500 to-red-700',
            glow: 'shadow-rose-400/50',
            buttonText: 'En Çok Tercih Edilen',
            popular: true
        },
        {
            id: 'unlimited',
            name: 'Sınırsız Abonelik',
            price: '899',
            annualPrice: '8999',
            limit: 'Sınırsız',
            features: [
                'Sınırsız İlan Hakkı',
                'Tüm Pro Özellikler',
                'Ücretsiz Vitrin Özelliği',
                'Özel Müşteri Temsilcisi',
                'Logo & Banner Desteği',
                'Reklasız Mağaza Deneyimi',
                'Özel Mağaza URL\'si (exvitrin.com/isminiz)'
            ],
            color: 'from-purple-600 to-violet-900',
            glow: 'shadow-purple-400/50',
            buttonText: 'Sınırsıza Geç',
            popular: false
        }
    ];

    const handlePurchase = (pkg) => {
        if (pkg.id === user?.subscription_tier) return;
        if (!user) {
            navigate('/login');
            return;
        }
        navigate('/payment', { state: { package: pkg, isAnnual } });
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <LoadingSpinner size="large" />
        </div>
    );

    return (
        <div className="min-h-screen bg-[#fafafa] pt-32 pb-40 px-4 relative overflow-hidden font-sans">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[800px] h-[800px] bg-rose-50 rounded-full blur-[120px] opacity-40"></div>
            <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-[800px] h-[800px] bg-blue-50 rounded-full blur-[120px] opacity-40"></div>

            <div className="max-w-7xl mx-auto relative z-10 font-sans">
                {/* Header */}
                <div className="text-center mb-20">
                    <span className="inline-block px-4 py-1.5 mb-6 text-sm font-black tracking-[0.2em] text-rose-600 uppercase bg-rose-50 rounded-full">
                        KURUMSAL ÜYELİK PAKETLERİ
                    </span>
                    <h1 className="text-5xl md:text-7xl font-black text-gray-900 mb-6 tracking-tight leading-[1.1]">
                        Mağazanızı <br />
                        <span className="bg-gradient-to-r from-rose-600 to-red-800 bg-clip-text text-transparent">Zirveye Taşıyın.</span>
                    </h1>
                    <p className="text-xl text-gray-500 max-w-2xl mx-auto font-medium leading-relaxed">
                        İşinizi genişletmek için size en uygun paketi seçin. Sınırlara takılmadan ilan verin, satışlarınızı profesyonel araçlarla yönetin.
                    </p>

                    {/* Pricing Toggle */}
                    <div className="mt-12 flex items-center justify-center gap-4">
                        <span className={`text-sm font-bold transition-colors ${!isAnnual ? 'text-gray-900' : 'text-gray-400'}`}>Aylık</span>
                        <button
                            onClick={() => setIsAnnual(!isAnnual)}
                            className="w-14 h-8 bg-gray-200 rounded-full relative p-1 transition-all duration-300"
                        >
                            <div className={`w-6 h-6 bg-white rounded-full shadow-md transition-all duration-300 transform ${isAnnual ? 'translate-x-6 bg-rose-500' : 'translate-x-0'}`}></div>
                        </button>
                        <span className={`text-sm font-bold transition-colors ${isAnnual ? 'text-gray-900' : 'text-gray-400'}`}>Yıllık <span className="text-rose-600 ml-1">(2 Ay Bedava!)</span></span>
                    </div>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
                    {packages.map((pkg) => {
                        const isCurrent = user?.subscription_tier === pkg.id;
                        const displayPrice = isAnnual ? Math.round(pkg.annualPrice / 12) : pkg.price;

                        return (
                            <div
                                key={pkg.id}
                                className={`group relative bg-white rounded-[2.5rem] p-10 flex flex-col transition-all duration-500 hover:shadow-[0_40px_80px_-15px_rgba(0,0,0,0.1)] hover:-translate-y-3 border border-gray-100 ${pkg.popular ? 'ring-2 ring-rose-500 ring-offset-4 ring-offset-[#fafafa]' : ''}`}
                            >
                                {pkg.popular && (
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-rose-600 text-white px-6 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-rose-200 z-20">
                                        EN ÇOK TERCİH EDİLEN
                                    </div>
                                )}

                                <div className="mb-10">
                                    <h3 className="text-2xl font-black text-gray-900 mb-6">{pkg.name}</h3>
                                    <div className="flex flex-col mb-2">
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-5xl font-black text-gray-900 tracking-tighter">
                                                {isAnnual ? pkg.annualPrice : pkg.price}
                                            </span>
                                            <span className="text-xl font-bold text-gray-400"> TL{isAnnual ? '/yıl' : '/ay'}</span>
                                        </div>
                                        {isAnnual && pkg.id !== 'free' && (
                                            <p className="text-sm font-bold text-rose-600 mt-1">
                                                (Aylık {Math.round(pkg.annualPrice / 12)} TL)
                                            </p>
                                        )}
                                    </div>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest leading-none">
                                        {isAnnual ? 'Yıllık Tek Ödeme' : 'Aylık Ödeme'}
                                    </p>
                                </div>

                                <div className="space-y-5 mb-12 flex-grow">
                                    {pkg.features.map((feature, idx) => (
                                        <div key={idx} className="flex items-start gap-4 text-[15px] font-bold text-gray-600">
                                            <div className={`flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br ${pkg.color} flex items-center justify-center p-1 text-white shadow-lg ${pkg.glow}`}>
                                                <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={4}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                </svg>
                                            </div>
                                            <span className="leading-tight">{feature}</span>
                                        </div>
                                    ))}
                                </div>

                                <button
                                    onClick={() => handlePurchase(pkg)}
                                    disabled={processing || isCurrent}
                                    className={`w-full py-5 rounded-[1.5rem] font-black text-lg transition-all duration-300 active:scale-95 ${isCurrent
                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-2 border-gray-100'
                                        : pkg.popular
                                            ? 'bg-rose-600 text-white hover:bg-red-700 shadow-2xl shadow-rose-200'
                                            : 'bg-white border-2 border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white'
                                        }`}
                                >
                                    {isCurrent ? 'AKTİF PAKET' : pkg.buttonText.toUpperCase()}
                                </button>
                            </div>
                        );
                    })}
                </div>

                {/* Info Box */}
                <div className="mt-32 relative overflow-hidden rounded-[3rem] bg-gray-900 p-12 md:p-20 text-white text-left">
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-rose-600/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
                    <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2"></div>

                    <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <span className="text-rose-500 font-black tracking-[0.3em] text-[10px] mb-4 block uppercase leading-none">EKSTRA KAPASİTE</span>
                            <h2 className="text-4xl md:text-5xl font-black mb-8 leading-tight tracking-tighter">İlanlarınız Sınırlara <br /> Takılmasın.</h2>
                            <p className="text-xl text-gray-400 font-medium leading-relaxed max-w-xl">
                                Paketinizin limitini aştığınızda endişelenmeyin! İlan başına sadece <span className="text-white font-black underline decoration-rose-500">9,90 TL</span> ödeyerek sınırsızca yeni ilanlar eklemeye devam edebilir, hiçbir satış fırsatını kaçırmazsınız.
                            </p>
                        </div>
                        <div className="flex justify-start lg:justify-end gap-6 items-center">
                            <button
                                onClick={() => navigate('/add-listing')}
                                className="group px-12 py-5 bg-white text-gray-900 rounded-[2rem] font-black text-xl hover:bg-rose-500 hover:text-white transition-all shadow-2xl flex items-center gap-3"
                            >
                                HEMEN İLAN VER
                                <svg className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* FAQ Style Footer */}
                <div className="mt-24 text-center">
                    <p className="text-gray-400 font-bold text-sm tracking-widest uppercase">Güvenli Ödeme • 7/24 Teknik Destek • Kurumsal Çözümler</p>
                </div>
            </div>
        </div>
    );
};

export default SubscriptionPackages;

