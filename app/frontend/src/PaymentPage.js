
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from './lib/supabase';
import { updateUserProfile } from './api/profile';
import LoadingSpinner from './components/LoadingSpinner';

const PaymentPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { package: pkg } = location.state || {}; // Access passed package details
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState(null);
    const [cardDetails, setCardDetails] = useState({
        number: '',
        expiry: '',
        cvc: '',
        holder: ''
    });

    useEffect(() => {
        if (!pkg) {
            navigate('/packages');
            return;
        }

        const getSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                navigate('/login');
                return;
            }
            setUser(session.user);
        };
        getSession();
    }, [pkg, navigate]);

    const handlePayment = async (e) => {
        if (e && e.preventDefault) e.preventDefault();
        setLoading(true);

        try {
            // 1. Brief visual delay
            await new Promise(resolve => setTimeout(resolve, 800));

            // 2. Data Preparation
            const expiryDate = new Date();
            expiryDate.setMonth(expiryDate.getMonth() + 1);
            const durationDays = 30;

            if (!user) {
                alert('Oturum hatası. Lütfen tekrar giriş yapın.');
                navigate('/login');
                return;
            }

            // 3. Update User Profile
            console.log('Updating profile for user:', user.id);
            await updateUserProfile(user.id, {
                subscription_tier: pkg.id,
                subscription_expiry: expiryDate.toISOString(),
                is_commercial: true,
                is_pro: pkg.id !== 'free'
            });

            // 4. Log Transaction (Promotion / Invoice)
            // Note: We use the server-side logic via sql or strict RLS check
            // Make sure "listing_id" is NULLABLE in promotions table!

            const { error: promoError } = await supabase
                .from('promotions')
                .insert({
                    user_id: user.id,
                    package_type: `subscription_${pkg.id}`,
                    price: parseFloat(pkg.price),
                    duration_days: durationDays,
                    start_date: new Date().toISOString(),
                    end_date: expiryDate.toISOString(),
                    status: 'active',
                    // listing_id intentionally omitted/null
                });

            if (promoError) {
                console.error('Promotion log error:', promoError);
                // We don't block success, just warn
            }

            // 5. Success & Redirect
            navigate('/settings', {
                state: {
                    successMessage: `${pkg.name} paketi başarıyla satın alındı ve aktif edildi!`
                }
            });

        } catch (error) {
            console.error('Payment failed:', error);
            alert('Ödeme işleminde hata oluştu: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    if (!pkg) return null;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-neutral-950 pt-24 pb-12 px-4 transition-colors duration-300">
            <div className="max-w-xl mx-auto bg-white dark:bg-neutral-900 rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-white/5">
                <div className="bg-gray-900 dark:bg-neutral-950 p-6 text-white text-center border-b border-white/5">
                    <h2 className="text-2xl font-bold mb-2">Paket Aktivasyonu (Ücretsiz / Demo)</h2>
                    <p className="text-emerald-400 text-sm font-semibold">Temsili işlem: Kartınızdan herhangi bir ücret çekilmez.</p>
                </div>

                <div className="p-8">
                    <div className="mb-6 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs leading-relaxed">
                        <strong>Bilgilendirme:</strong> Platformumuz tanıtım sürecinde tamamen ücretsizdir. Fiyatlar temsili olup ödeme adımında test amacıyla kart bilgilerini rastgele girebilirsiniz, hiçbir ücret tahsil edilmez.
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-8 flex justify-between items-center border border-blue-100 dark:border-blue-900/30">
                        <div>
                            <div className="text-xs text-blue-600 dark:text-blue-400 font-bold uppercase tracking-wider">Seçilen Paket</div>
                            <div className="text-lg font-bold text-gray-900 dark:text-neutral-50">{pkg.name}</div>
                        </div>
                        <div className="text-right">
                            <div className="text-2xl font-black text-gray-900 dark:text-neutral-50">{pkg.price} TL</div>
                            <div className="text-xs text-gray-500 dark:text-neutral-400">/ay</div>
                        </div>
                    </div>

                    <form onSubmit={handlePayment} className="space-y-6">
                        <div className="p-4 rounded-xl bg-gray-50 dark:bg-neutral-800/50 border border-gray-100 dark:border-white/5 text-xs text-gray-500 dark:text-neutral-400">
                            Kart bilgisi girmeniz gerekmez. Doğrudan aşağıdaki butona basarak paketi hesabınızda anında aktifleştirebilirsiniz.
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1">Kart Sahibi Ad Soyad <span className="text-xs text-gray-400 font-normal">(İsteğe Bağlı)</span></label>
                            <input
                                type="text"
                                className="w-full border border-gray-300 dark:border-white/10 bg-white dark:bg-neutral-800 text-gray-900 dark:text-neutral-50 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-red-500 transition-all"
                                placeholder="Örn: Ahmet Yılmaz"
                                value={cardDetails.holder}
                                onChange={e => setCardDetails({ ...cardDetails, holder: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1">Kart Numarası <span className="text-xs text-gray-400 font-normal">(İsteğe Bağlı)</span></label>
                            <div className="relative">
                                <input
                                    type="text"
                                    maxLength="19"
                                    className="w-full border border-gray-300 dark:border-white/10 bg-white dark:bg-neutral-800 text-gray-900 dark:text-neutral-50 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-red-500 transition-all pl-12 font-mono"
                                    placeholder="0000 0000 0000 0000"
                                    value={cardDetails.number}
                                    onChange={e => setCardDetails({ ...cardDetails, number: e.target.value })}
                                />
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl">💳</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1">Son Kullanma Tarihi <span className="text-xs text-gray-400 font-normal">(İsteğe Bağlı)</span></label>
                                <input
                                    type="text"
                                    maxLength="5"
                                    className="w-full border border-gray-300 dark:border-white/10 bg-white dark:bg-neutral-800 text-gray-900 dark:text-neutral-50 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-red-500 transition-all text-center"
                                    placeholder="AA/YY"
                                    value={cardDetails.expiry}
                                    onChange={e => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1">CVC / CVV <span className="text-xs text-gray-400 font-normal">(İsteğe Bağlı)</span></label>
                                <input
                                    type="text"
                                    maxLength="3"
                                    className="w-full border border-gray-300 dark:border-white/10 bg-white dark:bg-neutral-800 text-gray-900 dark:text-neutral-50 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-red-500 transition-all text-center"
                                    placeholder="123"
                                    value={cardDetails.cvc}
                                    onChange={e => setCardDetails({ ...cardDetails, cvc: e.target.value })}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-xl transition-colors shadow-lg shadow-emerald-200 dark:shadow-emerald-900/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
                        >
                            {loading ? (
                                <>
                                    <LoadingSpinner size="small" />
                                    <span>Paket Aktifleştiriliyor...</span>
                                </>
                            ) : (
                                <span>Ücretsiz Olarak Hemen Aktifleştir</span>
                            )}
                        </button>

                        <p className="text-xs text-center text-gray-400 dark:text-neutral-500 mt-4">
                            Kredi kartı bilgisi girmek zorunlu değildir. Herhangi bir ödeme yapmadan doğrudan aktifleştirebilirsiniz.
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default PaymentPage;
