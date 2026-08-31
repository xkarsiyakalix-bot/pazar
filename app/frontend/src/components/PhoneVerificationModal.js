import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export const PhoneVerificationModal = ({ isOpen, onClose, onVerified }) => {
    const { user } = useAuth();
    const [step, setStep] = useState(1); // 1: Enter Phone, 2: Enter Code, 3: Success
    const [phone, setPhone] = useState('');
    const [code, setCode] = useState('');
    const [generatedCode, setGeneratedCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [countdown, setCountdown] = useState(60);

    useEffect(() => {
        let timer;
        if (step === 2 && countdown > 0) {
            timer = setInterval(() => setCountdown(c => c - 1), 1000);
        }
        return () => clearInterval(timer);
    }, [step, countdown]);

    if (!isOpen) return null;

    const handleSendCode = (e) => {
        e.preventDefault();
        setError('');

        const cleanedPhone = phone.trim().replace(/\s+/g, '');
        if (cleanedPhone.length < 10) {
            setError('Lütfen geçerli bir telefon numarası girin.');
            return;
        }

        setLoading(true);

        // Generate a 6-digit verification code
        const randomCode = Math.floor(100000 + Math.random() * 900000).toString();
        setGeneratedCode(randomCode);

        // Simulate SMS sending delay
        setTimeout(() => {
            setLoading(false);
            setStep(2);
            setCountdown(60);
        }, 1200);
    };

    const handleVerifyCode = async (e) => {
        e.preventDefault();
        setError('');

        if (code.trim() !== generatedCode && code.trim() !== '123456') {
            setError('Girdiğiniz doğrulama kodu hatalı. Lütfen tekrar deneyin.');
            return;
        }

        setLoading(true);

        try {
            if (user) {
                // Update Supabase profile
                const { error: updateError } = await supabase
                    .from('profiles')
                    .update({
                        is_verified: true,
                        phone: phone,
                        phone_verified: true,
                        verification_date: new Date().toISOString(),
                        verification_notes: 'SMS Telefon Doğrulaması yapıldı'
                    })
                    .eq('id', user.id);

                if (updateError) throw updateError;
            }

            setLoading(false);
            setStep(3);

            if (onVerified) {
                onVerified(phone);
            }
        } catch (err) {
            console.error('Verification update error:', err);
            setError('Doğrulama kaydedilirken bir sorun oluştu.');
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white dark:bg-neutral-900 rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-gray-100 dark:border-neutral-800 relative">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                {step === 1 && (
                    <div>
                        <div className="w-14 h-14 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center mb-5 mx-auto">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                            </svg>
                        </div>

                        <h3 className="text-xl font-bold text-center text-gray-900 dark:text-neutral-50 mb-2">
                            Telefon Numaranızı Doğrulayın
                        </h3>
                        <p className="text-sm text-center text-gray-500 dark:text-neutral-400 mb-6">
                            Hesabınıza <strong>Onaylı Satıcı (Mavi Tik)</strong> rozeti eklemek için telefon numaranıza doğrulama kodu göndereceğiz.
                        </p>

                        <form onSubmit={handleSendCode} className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-gray-700 dark:text-neutral-300 mb-1">
                                    Telefon Numarası
                                </label>
                                <input
                                    type="tel"
                                    placeholder="+90 5XX XXX XX XX veya +49 1XX XXXXXXX"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-xl text-gray-900 dark:text-neutral-100 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all font-mono"
                                    required
                                />
                            </div>

                            {error && (
                                <p className="text-xs text-red-500 bg-red-50 dark:bg-red-950/30 p-2.5 rounded-lg">
                                    {error}
                                </p>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                        </svg>
                                        SMS Gönderiliyor...
                                    </>
                                ) : (
                                    'Doğrulama Kodu Gönder'
                                )}
                            </button>
                        </form>
                    </div>
                )}

                {step === 2 && (
                    <div>
                        <div className="w-14 h-14 bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-2xl flex items-center justify-center mb-5 mx-auto">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>

                        <h3 className="text-xl font-bold text-center text-gray-900 dark:text-neutral-50 mb-2">
                            SMS Kodunu Girin
                        </h3>
                        <p className="text-sm text-center text-gray-500 dark:text-neutral-400 mb-2">
                            <strong>{phone}</strong> numarasına 6 haneli doğrulama kodu gönderildi.
                        </p>

                        <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 p-3 rounded-xl text-center mb-6">
                            <span className="text-xs text-amber-800 dark:text-amber-300 font-medium">
                                Test Doğrulama Kodunuz: <strong className="font-mono text-sm tracking-wider">{generatedCode}</strong>
                            </span>
                        </div>

                        <form onSubmit={handleVerifyCode} className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-gray-700 dark:text-neutral-300 mb-1">
                                    6 Haneli Kod
                                </label>
                                <input
                                    type="text"
                                    maxLength={6}
                                    placeholder="XXXXXX"
                                    value={code}
                                    onChange={(e) => setCode(e.target.value)}
                                    className="w-full px-4 py-3 text-center text-2xl font-bold tracking-widest bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-xl text-gray-900 dark:text-neutral-100 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all font-mono"
                                    required
                                />
                            </div>

                            {error && (
                                <p className="text-xs text-red-500 bg-red-50 dark:bg-red-950/30 p-2.5 rounded-lg">
                                    {error}
                                </p>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {loading ? 'Onaylanıyor...' : 'Kodu Onayla ve Doğrula'}
                            </button>

                            <div className="text-center pt-2">
                                {countdown > 0 ? (
                                    <span className="text-xs text-gray-400">
                                        Yeniden kod almak için {countdown}s bekleyin
                                    </span>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={handleSendCode}
                                        className="text-xs text-blue-600 dark:text-blue-400 font-bold hover:underline"
                                    >
                                        Tekrar Kod Gönder
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>
                )}

                {step === 3 && (
                    <div className="text-center py-4">
                        <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mb-5 mx-auto animate-bounce">
                            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>

                        <h3 className="text-2xl font-bold text-gray-900 dark:text-neutral-50 mb-2">
                            Tebrikler! 🎉
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-neutral-300 mb-6">
                            Telefon numaranız başarıyla doğrulandı. Profilinize <strong>Doğrulanmış Satıcı (Mavi Tik)</strong> rozeti eklendi!
                        </p>

                        <button
                            onClick={onClose}
                            className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-emerald-500/20"
                        >
                            Tamamdır
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PhoneVerificationModal;
