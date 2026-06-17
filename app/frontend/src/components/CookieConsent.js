import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const CookieConsent = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Kullanıcı daha önce kabul etti mi kontrol et
        const consent = localStorage.getItem('cookie_consent_accepted');
        if (!consent) {
            // Eğer kabul edilmediyse ve 1 saniye geçtikten sonra göster
            const timer = setTimeout(() => {
                setIsVisible(true);
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem('cookie_consent_accepted', 'true');
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-[150] p-4 pb-24 md:p-6 md:pb-6 pointer-events-none">
            <div className="max-w-4xl mx-auto pointer-events-auto">
                <div className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-white/10 rounded-2xl p-4 md:p-5 shadow-2xl flex flex-col md:flex-row items-center gap-4 md:gap-6 animate-slide-up-fade">
                    
                    {/* Icon */}
                    <div className="hidden md:flex shrink-0 w-12 h-12 bg-red-50 dark:bg-rose-500/10 text-red-600 dark:text-rose-400 rounded-full items-center justify-center">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
                        </svg>
                    </div>

                    {/* Text content */}
                    <div className="flex-1 text-center md:text-left">
                        <h3 className="text-gray-900 dark:text-white font-bold text-base mb-1">
                            Çerez (Cookie) Kullanımı
                        </h3>
                        <p className="text-gray-600 dark:text-neutral-400 text-sm leading-relaxed">
                            ExVitrin'de size daha iyi bir deneyim sunabilmek, hizmetlerimizi optimize etmek ve güvenliği sağlamak amacıyla çerezler kullanılmaktadır. 
                            Sitemizi kullanarak çerez politikamızı kabul etmiş olursunuz.
                            <Link to="/gizlilik-politikasi" className="text-red-600 dark:text-rose-400 hover:underline ml-1 font-medium whitespace-nowrap">
                                Detaylı Bilgi
                            </Link>
                        </p>
                    </div>

                    {/* Action button */}
                    <div className="w-full md:w-auto shrink-0">
                        <button
                            onClick={handleAccept}
                            className="w-full md:w-auto px-8 py-3 bg-red-600 hover:bg-red-700 text-white text-sm font-bold rounded-xl transition-colors shadow-sm"
                        >
                            Kabul Et ve Kapat
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default CookieConsent;
