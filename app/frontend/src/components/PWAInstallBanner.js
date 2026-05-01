import React from 'react';
import pwaManager from '../utils/pwaManager';

export const PWAInstallBanner = ({ onClose }) => {
  const handleInstall = async () => {
    const installed = await pwaManager.promptInstall();
    if (installed) {
      onClose();
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-gradient-to-r from-purple-600 to-red-600 text-white shadow-2xl animate-slide-up md:bottom-4 md:left-4 md:right-auto md:max-w-md md:rounded-2xl">
      <div className="flex items-start gap-4">
        {/* App Icon */}
        <div className="flex-shrink-0">
          <img 
            src="/logo_exvitrin_2026_cropped.png" 
            alt="ExVitrin" 
            className="w-16 h-16 rounded-2xl shadow-lg bg-white p-2"
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-bold mb-1">
            ExVitrin'i Yükle
          </h3>
          <p className="text-sm text-white/90 mb-3">
            Ana ekranınıza ekleyin ve uygulama gibi kullanın. Hızlı erişim, offline çalışma ve bildirimler!
          </p>

          {/* Actions */}
          <div className="flex gap-2">
            <button
              onClick={handleInstall}
              className="px-4 py-2 bg-white text-purple-600 font-bold rounded-lg hover:bg-gray-100 transition-colors text-sm shadow-lg"
            >
              Yükle
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-white/10 backdrop-blur-sm text-white font-medium rounded-lg hover:bg-white/20 transition-colors text-sm"
            >
              Daha Sonra
            </button>
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="flex-shrink-0 p-1 hover:bg-white/10 rounded-full transition-colors"
          aria-label="Kapat"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Features */}
      <div className="mt-4 pt-4 border-t border-white/20 grid grid-cols-3 gap-2 text-xs">
        <div className="flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <span>Hızlı</span>
        </div>
        <div className="flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
          <span>Offline</span>
        </div>
        <div className="flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <span>Bildirim</span>
        </div>
      </div>
    </div>
  );
};

export default PWAInstallBanner;

