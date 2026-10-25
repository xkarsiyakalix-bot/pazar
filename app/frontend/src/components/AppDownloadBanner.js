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

    return (
        <div className="md:hidden w-full bg-gradient-to-r from-neutral-900 via-neutral-950 to-neutral-900 text-white px-3 py-2 border-b border-red-500/20 shadow-md relative z-50">
            <div className="flex items-center justify-between gap-2">
                {/* Sol Taraf: Logo ve Bilgiler */}
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
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
                            Google Play'de Yayında! Hemen İndir
                        </div>
                    </div>
                </div>

                {/* Sağ Taraf: İndir Butonu ve Kapatma Butonu */}
                <div className="flex items-center gap-1.5 flex-shrink-0">
                    <a
                        href="https://play.google.com/store/apps/details?id=com.exvitrin.app"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-red-600 hover:bg-red-700 active:scale-95 text-white font-bold px-3 py-1.5 rounded-lg text-xs transition-all shadow-sm inline-flex items-center gap-1.5"
                    >
                        {/* Android Logo */}
                        <svg className="w-3.5 h-3.5 fill-current shrink-0" viewBox="0 0 24 24">
                            <path d="M17.523 15.3414c-.5511 0-.9993-.4486-.9993-1.0003 0-.5517.4482-1.0003.9993-1.0003.5517 0 .9993.4486.9993 1.0003 0 .5517-.4476 1.0003-.9993 1.0003m-11.046 0c-.5511 0-.9993-.4486-.9993-1.0003 0-.5517.4482-1.0003.9993-1.0003.5517 0 .9993.4486.9993 1.0003 0 .5517-.4476 1.0003-.9993 1.0003m11.4045-6.02l1.996-3.4572c.1086-.188.0441-.4285-.1439-.5371-.1879-.1086-.4285-.0441-.5371.1439l-2.0234 3.5046C15.6318 8.4411 13.8824 8 12 8c-1.8824 0-3.6318.4411-5.1731 1.2156L4.8035 5.711c-.1086-.188-.3492-.2525-.5371-.1439-.188.1086-.2525.3491-.1439.5371l1.996 3.4572C2.6889 11.4552 1 14.7335 1 18.5h22c0-3.7665-1.6889-7.0448-5.1185-9.1786" />
                        </svg>
                        <span>İndir</span>
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
