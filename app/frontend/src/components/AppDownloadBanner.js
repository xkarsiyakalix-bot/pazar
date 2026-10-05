import React, { useState, useEffect } from 'react';

export const AppDownloadBanner = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Zaten native uygulama icindeyse gosterme
        if (typeof window !== 'undefined' && window.Capacitor?.isNativePlatform?.()) {
            return;
        }

        // Kullanici daha once kapattiysa gosterme (3 gun boyunca)
        try {
            const dismissedAt = localStorage.getItem('exvitrin_app_banner_dismissed');
            if (dismissedAt) {
                const threeDays = 3 * 24 * 60 * 60 * 1000;
                if (Date.now() - parseInt(dismissedAt, 10) < threeDays) {
                    return;
                }
            }
        } catch (e) {
            // localStorage erisim hatasi durumunda yoksay
        }

        setIsVisible(true);
    }, []);

    const handleDismiss = () => {
        setIsVisible(false);
        try {
            localStorage.setItem('exvitrin_app_banner_dismissed', Date.now().toString());
        } catch (e) {}
    };

    if (!isVisible) return null;

    return (
        <div className="bg-gradient-to-r from-gray-900 via-neutral-900 to-gray-900 text-white px-3 py-2.5 shadow-md border-b border-rose-500/30 sticky top-0 z-50 flex items-center justify-between text-xs sm:text-sm">
            <div className="flex items-center gap-2.5 min-w-0">
                <button
                    onClick={handleDismiss}
                    aria-label="Kapat"
                    className="text-gray-400 hover:text-white p-1 rounded-full transition-colors flex-shrink-0"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <img
                    src="/logo_exvitrin_2026_small.png"
                    alt="ExVitrin"
                    className="w-8 h-8 rounded-lg shadow-sm flex-shrink-0 object-contain bg-white/10 p-0.5"
                />

                <div className="min-w-0">
                    <div className="font-bold text-white truncate flex items-center gap-1.5">
                        <span>ExVitrin Mobil</span>
                        <span className="bg-rose-500 text-[10px] font-extrabold px-1.5 py-0.5 rounded text-white uppercase tracking-wider hidden sm:inline">
                            Yeni
                        </span>
                    </div>
                    <div className="text-[11px] text-gray-300 truncate">
                        Google Play Store'da ücretsiz indirin
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                <a
                    href="https://play.google.com/store/apps/details?id=com.exvitrin.app"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-rose-600 hover:bg-rose-500 active:bg-rose-700 text-white font-bold px-3.5 py-1.5 rounded-full text-xs transition-all shadow-md flex items-center gap-1.5"
                >
                    <span>YÜKLE</span>
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                </a>
            </div>
        </div>
    );
};

export default AppDownloadBanner;
