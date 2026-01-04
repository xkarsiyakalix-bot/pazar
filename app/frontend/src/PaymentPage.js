
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from './lib/supabase';
import { updateUserProfile } from './api/profile';

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
        e.preventDefault();
        setLoading(true);

        try {
            // 1. Simulate Payment Gateway Delay
            await new Promise(resolve => setTimeout(resolve, 2000));

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
        <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4">
            <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                <div className="bg-gray-900 p-6 text-white text-center">
                    <h2 className="text-2xl font-bold mb-2">Güvenli Ödeme</h2>
                    <p className="text-gray-400 text-sm">Paket aktivasyonu için ödeme bilgilerinizi giriniz.</p>
                </div>

                <div className="p-8">
                    <div className="bg-blue-50 p-4 rounded-lg mb-8 flex justify-between items-center border border-blue-100">
                        <div>
                            <div className="text-xs text-blue-600 font-bold uppercase tracking-wider">Seçilen Paket</div>
                            <div className="text-lg font-bold text-gray-900">{pkg.name}</div>
                        </div>
                        <div className="text-right">
                            <div className="text-2xl font-black text-gray-900">{pkg.price} ₺</div>
                            <div className="text-xs text-gray-500">/ay</div>
                        </div>
                    </div>

                    <form onSubmit={handlePayment} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Kart Sahibi Ad Soyad</label>
                            <input
                                required
                                type="text"
                                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black transition-all"
                                placeholder="Örn: Ahmet Yılmaz"
                                value={cardDetails.holder}
                                onChange={e => setCardDetails({ ...cardDetails, holder: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Kart Numarası</label>
                            <div className="relative">
                                <input
                                    required
                                    type="text"
                                    maxLength="19"
                                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black transition-all pl-12 font-mono"
                                    placeholder="0000 0000 0000 0000"
                                    value={cardDetails.number}
                                    onChange={e => setCardDetails({ ...cardDetails, number: e.target.value })}
                                />
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl">💳</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Son Kullanma Tarihi</label>
                                <input
                                    required
                                    type="text"
                                    maxLength="5"
                                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black transition-all text-center"
                                    placeholder="AA/YY"
                                    value={cardDetails.expiry}
                                    onChange={e => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">CVC / CVV</label>
                                <input
                                    required
                                    type="text"
                                    maxLength="3"
                                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-black transition-all text-center"
                                    placeholder="123"
                                    value={cardDetails.cvc}
                                    onChange={e => setCardDetails({ ...cardDetails, cvc: e.target.value })}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-red-600 text-white font-bold py-4 rounded-xl hover:bg-red-700 transition-colors shadow-lg shadow-red-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    <span>Ödeme İşleniyor...</span>
                                </>
                            ) : (
                                <span>{pkg.price} ₺ Öde ve Aktifleştir</span>
                            )}
                        </button>

                        <p className="text-xs text-center text-gray-400 mt-4">
                            Bu işlem güvenli bir şekilde şifrelenmektedir. Demo amaçlı kart bilgilerini rastgele girebilirsiniz.
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default PaymentPage;
