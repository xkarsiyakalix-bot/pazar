import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const CookieConsent = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Check if user has already consented
        const consent = localStorage.getItem('cookieConsentGiven');
        if (!consent) {
            // Show banner after a small delay for better UX
            const timer = setTimeout(() => setIsVisible(true), 1000);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem('cookieConsentGiven', 'true');
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-[9999] bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md border-t border-gray-200 dark:border-white/10 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] animate-in slide-in-from-bottom-full duration-500">
            <div className="max-w-7xl mx-auto px-4 py-4 md:py-5 flex flex-col md:flex-row items-center justify-between gap-4 md:gap-8">

                {/* Icon & Text */}
                <div className="flex items-center gap-4 flex-1">

                    <div>
                        <p className="text-sm md:text-base text-gray-700 dark:text-gray-300 leading-snug">
                            Sitemizden en iyi şekilde faydalanabilmeniz için çerezler kullanıyoruz. Sitemizi kullanmaya devam ederek <Link to="/cerez-politikasi" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 font-bold hover:underline">Çerez Politikası</Link>'nı kabul etmiş sayılırsınız.
                        </p>
                    </div>
                </div>

                {/* Buttons */}
                <div className="flex items-center gap-3 w-full md:w-auto shrink-0">
                    <button
                        onClick={handleAccept}
                        className="flex-1 md:flex-none px-8 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-neutral-900 text-sm font-bold rounded-lg hover:bg-black dark:hover:bg-gray-200 transition-colors shadow-sm whitespace-nowrap"
                    >
                        Kabul Et
                    </button>
                    <button
                        onClick={() => setIsVisible(false)}
                        className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                        aria-label="Kapat"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CookieConsent;
