import React, { useState, useEffect } from 'react';

export const getInitialAppBannerVisibility = () => {
    if (typeof window === 'undefined') return false;
    if (window.innerWidth >= 768) return false;
    if (window.Capacitor?.isNativePlatform?.()) return false;
    try {
        const dismissedAt = localStorage.getItem('exvitrin_app_banner_dismissed');
        if (dismissedAt) {
            const twoDays = 2 * 24 * 60 * 60 * 1000;
            if (Date.now() - parseInt(dismissedAt, 10) < twoDays) {
                return false;
            }
        }
    } catch (e) {
        return false;
    }
    return true;
};

export const AppDownloadBanner = ({ onVisibilityChange }) => {
    const [isVisible, setIsVisible] = useState(getInitialAppBannerVisibility);

    // Device detection: iOS vs Android
    const isIOS = typeof navigator !== 'undefined' && /iPhone|iPad|iPod/i.test(navigator.userAgent || '');
    const isAndroid = typeof navigator !== 'undefined' && /Android/i.test(navigator.userAgent || '');

    useEffect(() => {
        onVisibilityChange?.(isVisible);
    }, [isVisible, onVisibilityChange]);

    const handleDismiss = () => {
        setIsVisible(false);
        onVisibilityChange?.(false);
        try {
            localStorage.setItem('exvitrin_app_banner_dismissed', Date.now().toString());
        } catch (e) {}
    };

    if (!isVisible) return null;

    const APP_STORE_URL = "https://apps.apple.com/app/exvitrin/id6830856408";
    const PLAY_STORE_URL = "https://play.google.com/store/apps/details?id=com.exvitrin.app";

    return (
        <div className="md:hidden w-full bg-gradient-to-r from-neutral-900 via-neutral-950 to-neutral-900 text-white px-3 py-2 border-b border-red-500/20 shadow-md relative z-50">
            <div className="flex items-center justify-between gap-2">
                {/* Sol Taraf: Logo ve Bilgiler */}
                <div className="flex items-center gap-2 min-w-0 flex-1">
                    <img
                        src="/logo_exvitrin_2026_small.png"
                        alt="ExVitrin"
                        width="32"
                        height="32"
                        loading="lazy"
                        decoding="async"
                        className="w-8 h-8 rounded-lg shadow-sm flex-shrink-0 object-contain bg-white/10 p-0.5"
                    />
                    <div className="min-w-0 flex-1">
                        <div className="font-bold text-white text-xs truncate leading-tight">
                            ExVitrin Mobil Uygulaması
                        </div>
                        <div className="text-[11px] text-emerald-400 truncate leading-tight mt-0.5 font-semibold flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                            {isIOS ? 'App Store\'da Yayında! Hemen İndir' : isAndroid ? 'Google Play\'de Yayında! Hemen İndir' : 'App Store & Google Play\'de!'}
                        </div>
                    </div>
                </div>

                {/* Sağ Taraf: İndirme Butonları ve Kapatma Butonu */}
                <div className="flex items-center gap-1 flex-shrink-0">
                    {/* iOS Cihazı veya Genel: App Store Butonu */}
                    {(isIOS || !isAndroid) && (
                        <a
                            href={APP_STORE_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-white hover:bg-gray-100 text-black active:scale-95 font-bold px-2.5 py-1.5 rounded-lg text-[11px] transition-all shadow-sm inline-flex items-center gap-1"
                            title="App Store'dan İndir"
                        >
                            {/* Apple Logo */}
                            <svg className="w-3.5 h-3.5 fill-current shrink-0" viewBox="0 0 24 24">
                                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                            </svg>
                            <span>App Store</span>
                        </a>
                    )}

                    {/* Android Cihazı veya Genel: Google Play Butonu */}
                    {(isAndroid || !isIOS) && (
                        <a
                            href={PLAY_STORE_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-red-600 hover:bg-red-700 text-white active:scale-95 font-bold px-2.5 py-1.5 rounded-lg text-[11px] transition-all shadow-sm inline-flex items-center gap-1"
                            title="Google Play'den İndir"
                        >
                            {/* Android Logo */}
                            <svg className="w-3.5 h-3.5 fill-current shrink-0" viewBox="0 0 24 24">
                                <path d="M17.523 15.3414c-.5511 0-.9993-.4486-.9993-1.0003 0-.5517.4482-1.0003.9993-1.0003.5517 0 .9993.4486.9993 1.0003 0 .5517-.4476 1.0003-.9993 1.0003m-11.046 0c-.5511 0-.9993-.4486-.9993-1.0003 0-.5517.4482-1.0003.9993-1.0003.5517 0 .9993.4486.9993 1.0003 0 .5517-.4476 1.0003-.9993 1.0003m11.4045-6.02l1.996-3.4572c.1086-.188.0441-.4285-.1439-.5371-.1879-.1086-.4285-.0441-.5371.1439l-2.0234 3.5046C15.6318 8.4411 13.8824 8 12 8c-1.8824 0-3.6318.4411-5.1731 1.2156L4.8035 5.711c-.1086-.188-.3492-.2525-.5371-.1439-.188.1086-.2525.3491-.1439.5371l1.996 3.4572C2.6889 11.4552 1 14.7335 1 18.5h22c0-3.7665-1.6889-7.0448-5.1185-9.1786" />
                            </svg>
                            <span>Google Play</span>
                        </a>
                    )}

                    {/* Paneli Kapat Butonu */}
                    <button
                        onClick={handleDismiss}
                        aria-label="Kapat"
                        className="text-neutral-400 hover:text-white active:scale-90 p-1 rounded-lg hover:bg-white/10 transition-colors flex-shrink-0"
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
