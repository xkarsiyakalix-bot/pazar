import React, { useState, useEffect } from 'react';

export const AppDownloadBanner = ({ onVisibilityChange }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Zaten native uygulama içindeyse gösterme
        if (typeof window !== 'undefined' && window.Capacitor?.isNativePlatform?.()) {
            setIsVisible(false);
            onVisibilityChange?.(false);
            return;
        }

        // Kullanıcı daha önce kapattıysa gösterme (örneğin 2 gün)
        try {
            const dismissedAt = localStorage.getItem('exvitrin_app_banner_dismissed');
            if (dismissedAt) {
                const twoDays = 2 * 24 * 60 * 60 * 1000;
                if (Date.now() - parseInt(dismissedAt, 10) < twoDays) {
                    setIsVisible(false);
                    onVisibilityChange?.(false);
                    return;
                }
            }
        } catch (e) {
            // localStorage erişim hatası
        }

        setIsVisible(true);
        onVisibilityChange?.(true);
    }, [onVisibilityChange]);

    const handleDismiss = () => {
        setIsVisible(false);
        onVisibilityChange?.(false);
        try {
            localStorage.setItem('exvitrin_app_banner_dismissed', Date.now().toString());
        } catch (e) {}
    };

    if (!isVisible) return null;

    return (
        <div className="md:hidden w-full bg-gradient-to-r from-neutral-900 via-neutral-950 to-neutral-900 text-white px-3 py-2 border-b border-red-500/20 shadow-md relative z-50">
            <div className="flex items-center justify-between gap-2">
                {/* Sol Taraf: Logo ve Bilgiler */}
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <img
                        src="/logo_exvitrin_2026_small.png"
                        alt="ExVitrin"
                        className="w-8 h-8 rounded-lg shadow-sm flex-shrink-0 object-contain bg-white/10 p-0.5"
                    />
                    <div className="min-w-0 flex-1">
                        <div className="font-bold text-white text-xs truncate leading-tight">
                            ExVitrin Mobil Uygulaması
                        </div>
                        <div className="text-[11px] text-neutral-300 dark:text-neutral-400 truncate leading-tight mt-0.5 font-medium">
                            Şu an sadece kayıtlı kullanıcılar
                        </div>
                    </div>
                </div>

                {/* Sağ Taraf: İndir Butonu ve Kapatma Butonu */}
                <div className="flex items-center gap-1.5 flex-shrink-0">
                    <a
                        href="https://play.google.com/store/apps/details?id=com.exvitrin.app"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-red-600 hover:bg-red-700 active:scale-95 text-white font-bold px-3 py-1.5 rounded-lg text-xs transition-all shadow-sm inline-flex items-center gap-1"
                    >
                        <span>İndir</span>
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </a>

                    {/* Sağ tarafta paneli kapatma butonu */}
                    <button
                        onClick={handleDismiss}
                        aria-label="Kapat"
                        className="text-neutral-400 hover:text-white active:scale-90 p-1.5 rounded-lg hover:bg-white/10 transition-colors flex-shrink-0"
                        title="Kapat"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AppDownloadBanner;
