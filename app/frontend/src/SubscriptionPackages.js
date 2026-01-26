import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from './lib/supabase';
import { fetchUserProfile, updateUserProfile } from './api/profile';
import LoadingSpinner from './components/LoadingSpinner';

const SubscriptionPackages = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [message, setMessage] = useState(null);

    useEffect(() => {
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
            features: [
                'Her ay 20 Ücretsiz İlan',
                'İlan başına 9,90 TL ek ücret',
                'Temel istatistikler',
                'Mesajlaşma özelliği'
            ],
            color: 'gray',
            buttonText: 'Mevcut Paket',
            popular: false
        },
        {
            id: 'pack1',
            name: 'Başlangıç Kurumsal',
            price: '59',
            limit: '40',
            features: [
                'Her ay 40 İlan hakkı',
                '20 Bonus ilan dahil',
                'Kurumsal Rozet',
                'Mağaza Sayfası',
                'Müşteri Hattı Gösterimi'
            ],
            color: 'blue',
            buttonText: 'Hemen Başla',
            popular: false
        },
        {
            id: 'pack2',
            name: 'Pro Kurumsal',
            price: '99',
            limit: '70',
            features: [
                'Her ay 70 İlan hakkı',
                '50 Bonus ilan dahil',
                'Öncelikli Destek',
                'Gelişmiş Mağaza Görünümü',
                'Arama Sonuçlarında Öne Çıkma'
            ],
            color: 'red',
            buttonText: 'En Çok Tercih Edilen',
            popular: true
        },
        {
            id: 'unlimited',
            name: 'Sınırsız',
            price: '199',
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
            color: 'purple',
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

        // Navigate to payment page with package details
        navigate('/payment', { state: { package: pkg } });
    };



    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <LoadingSpinner size="large" />
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 pt-32 pb-20 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
                        Mağazanızı <span className="text-red-600">Büyütün</span>
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto font-medium">
                        İşinizi genişletmek için size en uygun paketi seçin. Sınırlara takılmadan ilan verin, satışlarınızı artırın.
                    </p>
                </div>

                {message && (
                    <div className={`max-w-md mx-auto mb-8 p-4 rounded-xl text-center font-bold animate-in fade-in slide-in-from-top-2 ${message.type === 'success' ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-red-100 text-red-700 border border-red-200'
                        }`}>
                        {message.text}
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {packages.map((pkg) => (
                        <div
                            key={pkg.id}
                            className={`relative bg-white rounded-3xl p-8 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 border-2 ${(pkg.popular || user?.subscription_tier === pkg.id) ? 'border-red-500 shadow-xl' : 'border-transparent'
                                } hover:border-red-500`}
                        >
                            {pkg.popular && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-red-500 text-white px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest">
                                    En Popüler
                                </div>
                            )}

                            <div className="mb-8">
                                <h3 className="text-xl font-black text-gray-900 mb-2">{pkg.name}</h3>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-4xl font-black text-gray-900">{pkg.price}</span>
                                    <span className="text-lg font-bold text-gray-500">₺/ay</span>
                                </div>
                            </div>

                            <ul className="space-y-4 mb-8">
                                {pkg.features.map((feature, idx) => (
                                    <li key={idx} className="flex items-start gap-3 text-sm text-gray-600 font-medium">
                                        <svg className={`w-5 h-5 flex-shrink-0 mt-0.5 ${pkg.color === 'red' ? 'text-red-500' : pkg.color === 'blue' ? 'text-blue-500' : pkg.color === 'purple' ? 'text-purple-500' : 'text-gray-400'}`} fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        {feature}
                                    </li>
                                ))}
                            </ul>

                            <button
                                onClick={() => handlePurchase(pkg)}
                                disabled={processing || user?.subscription_tier === pkg.id}
                                className={`w-full py-4 rounded-2xl font-black text-sm transition-all ${user?.subscription_tier === pkg.id
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    : pkg.popular
                                        ? 'bg-red-600 text-white hover:bg-red-700 shadow-lg shadow-red-200'
                                        : 'bg-gray-900 text-white hover:bg-black shadow-lg shadow-gray-200'
                                    }`}
                            >
                                {processing ? (
                                    <div className="flex items-center justify-center gap-2">
                                        <LoadingSpinner size="small" />
                                        <span>İşleniyor...</span>
                                    </div>
                                ) : (
                                    user?.subscription_tier === pkg.id ? 'Aktif Paket' : pkg.buttonText
                                )}
                            </button>
                        </div>
                    ))}
                </div>

                <div className="mt-20 bg-gray-900 rounded-[3rem] p-12 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/20 rounded-full blur-3xl -mr-32 -mt-32"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl -ml-32 -mb-32"></div>

                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                        <div>
                            <h2 className="text-3xl font-black mb-4">Daha Fazla İlana mı İhtiyacınız Var?</h2>
                            <p className="text-gray-400 font-medium max-w-xl">
                                Paketinizin limitini aştığınızda, ilan başına sadece 9,90 ₺ ödeyerek yeni ilanlar eklemeye devam edebilirsiniz.
                                Hiçbir fırsatı kaçırmayın!
                            </p>
                        </div>
                        <button
                            onClick={() => navigate('/add-listing')}
                            className="whitespace-nowrap bg-white text-gray-900 px-8 py-4 rounded-2xl font-black hover:bg-red-50 transition-colors"
                        >
                            İlan Ver
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SubscriptionPackages;
