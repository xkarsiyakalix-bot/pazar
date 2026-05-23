import React from 'react';
import { useNavigate } from 'react-router-dom';
import { t } from '../translations';

export const GalleryInfoModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.55)' }}
      onClick={onClose}
    >
      <div
        className="relative bg-white dark:bg-neutral-900 rounded-3xl overflow-hidden shadow-2xl max-w-lg w-full"
        style={{ maxHeight: '90vh', overflowY: 'auto' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Glow Effects */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-red-500/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Header with Premium Pattern */}
        <div className="relative h-44 bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 dark:from-neutral-900 dark:via-neutral-950 dark:to-neutral-900 flex items-center justify-center overflow-hidden border-b border-gray-200 dark:border-white/10">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent"></div>
          <div className="text-center z-10 p-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black tracking-wider uppercase bg-gradient-to-r from-amber-400 to-amber-500 text-white shadow-md mb-3">
              ⭐ VİTRİN İLANI
            </span>
            <h2 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white tracking-tight uppercase">
              {t.topAds.modal.title}
            </h2>
            <p className="text-amber-600 dark:text-amber-400/80 text-sm font-semibold mt-1">
              {t.topAds.modal.subtitle}
            </p>
          </div>
          
          {/* Close button */}
          <button 
            onClick={onClose} 
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-900 dark:text-white/55 dark:hover:text-white bg-gray-200/50 hover:bg-gray-200 dark:bg-white/5 dark:hover:bg-white/10 rounded-full p-2 transition-all border border-transparent dark:border-white/10"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 md:p-8 space-y-5">
          
          {/* Feature 1 */}
          <div className="flex items-start gap-4 p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 hover:border-amber-500/20 transition-all duration-300">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-500 text-white flex items-center justify-center flex-shrink-0 font-bold text-lg shadow-sm">
              🚀
            </div>
            <div>
              <h3 className="text-base font-black text-gray-900 dark:text-white mb-1">
                {t.topAds.modal.queriesTitle}
              </h3>
              <p className="text-xs text-gray-600 dark:text-neutral-400 font-medium leading-relaxed">
                {t.topAds.modal.queriesDesc}
              </p>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="flex items-start gap-4 p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 hover:border-amber-500/20 transition-all duration-300">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-500 text-white flex items-center justify-center flex-shrink-0 font-bold text-lg shadow-sm">
              📅
            </div>
            <div>
              <h3 className="text-base font-black text-gray-900 dark:text-white mb-1">
                {t.topAds.modal.rotationTitle}
              </h3>
              <p className="text-xs text-gray-600 dark:text-neutral-400 font-medium leading-relaxed">
                {t.topAds.modal.rotationDesc}
              </p>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="flex items-start gap-4 p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 hover:border-amber-500/20 transition-all duration-300">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-500 text-white flex items-center justify-center flex-shrink-0 font-bold text-lg shadow-sm">
              💎
            </div>
            <div>
              <h3 className="text-base font-black text-gray-900 dark:text-white mb-1">
                {t.topAds.modal.premiumTitle}
              </h3>
              <p className="text-xs text-gray-600 dark:text-neutral-400 font-medium leading-relaxed">
                {t.topAds.modal.premiumDesc}
              </p>
            </div>
          </div>

          {/* Tip Box */}
          <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-2xl p-4 flex gap-3">
            <span className="text-xl">💡</span>
            <p className="text-xs text-amber-800 dark:text-amber-200 leading-relaxed font-semibold">
              <span className="font-black text-amber-600 dark:text-amber-400">{t.topAds.modal.tip}</span> {t.topAds.modal.tipDesc}
            </p>
          </div>

          {/* Buttons & Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button 
              onClick={onClose}
              className="w-full sm:w-1/3 order-2 sm:order-1 border border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5 text-gray-600 dark:text-neutral-400 hover:text-gray-900 dark:hover:text-white font-bold py-3.5 px-6 rounded-2xl transition-all text-sm"
            >
              {t.common.cancel}
            </button>
            <button
              onClick={() => {
                onClose();
                navigate('/profile?tab=listings');
              }}
              className="w-full sm:w-2/3 order-1 sm:order-2 bg-gradient-to-r from-amber-400 to-amber-500 text-white font-black py-3.5 px-6 rounded-2xl shadow-md hover:shadow-lg transition-all text-sm transform hover:-translate-y-0.5 active:translate-y-0"
            >
              {t.topAds.modal.selectListing}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default GalleryInfoModal;
