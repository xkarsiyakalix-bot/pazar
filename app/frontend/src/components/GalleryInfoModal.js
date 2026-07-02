import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { t } from '../translations';

export const GalleryInfoModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const modal = (
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}
    >
      <div
        className="relative bg-white dark:bg-neutral-900 rounded-2xl overflow-hidden shadow-2xl w-full max-w-md"
        onClick={e => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 text-gray-400 hover:text-gray-700 dark:text-white/40 dark:hover:text-white bg-gray-100 hover:bg-gray-200 dark:bg-white/5 dark:hover:bg-white/10 rounded-full p-1.5 transition-all"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Compact Header */}
        <div className="relative bg-gradient-to-br from-amber-400 to-orange-500 px-6 pt-6 pb-5 text-center">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent pointer-events-none"></div>
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-wider uppercase bg-white/20 text-white mb-2">
            ⭐ VİTRİN İLANI
          </span>
          <h2 className="text-xl font-black text-white tracking-tight">
            {t.topAds.modal.title}
          </h2>
          <p className="text-white/80 text-xs font-semibold mt-1">
            {t.topAds.modal.subtitle}
          </p>
        </div>

        {/* Compact Features - horizontal row */}
        <div className="px-5 pt-4 pb-3 grid grid-cols-3 gap-2">
          <div className="flex flex-col items-center text-center gap-1.5 p-2.5 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5">
            <span className="text-xl">🚀</span>
            <h3 className="text-[10px] font-black text-gray-900 dark:text-white leading-tight">{t.topAds.modal.queriesTitle}</h3>
            <p className="text-[9px] text-gray-500 dark:text-neutral-400 font-medium leading-tight hidden sm:block">{t.topAds.modal.queriesDesc}</p>
          </div>
          <div className="flex flex-col items-center text-center gap-1.5 p-2.5 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5">
            <span className="text-xl">📅</span>
            <h3 className="text-[10px] font-black text-gray-900 dark:text-white leading-tight">{t.topAds.modal.rotationTitle}</h3>
            <p className="text-[9px] text-gray-500 dark:text-neutral-400 font-medium leading-tight hidden sm:block">{t.topAds.modal.rotationDesc}</p>
          </div>
          <div className="flex flex-col items-center text-center gap-1.5 p-2.5 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5">
            <span className="text-xl">💎</span>
            <h3 className="text-[10px] font-black text-gray-900 dark:text-white leading-tight">{t.topAds.modal.premiumTitle}</h3>
            <p className="text-[9px] text-gray-500 dark:text-neutral-400 font-medium leading-tight hidden sm:block">{t.topAds.modal.premiumDesc}</p>
          </div>
        </div>

        {/* Compact Tip */}
        <div className="mx-5 mb-4 bg-amber-50 dark:bg-amber-500/10 border border-amber-200/70 dark:border-amber-500/20 rounded-xl px-3 py-2.5 flex items-start gap-2">
          <span className="text-sm mt-0.5">💡</span>
          <p className="text-[10px] text-amber-800 dark:text-amber-200 leading-relaxed font-medium">
            <span className="font-black text-amber-600 dark:text-amber-400">{t.topAds.modal.tip}</span> {t.topAds.modal.tipDesc}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="px-5 pb-5 flex gap-2.5">
          <button
            onClick={onClose}
            className="flex-1 border border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5 text-gray-600 dark:text-neutral-400 font-bold py-3 px-4 rounded-xl transition-all text-sm"
          >
            {t.common.cancel}
          </button>
          <button
            onClick={() => {
              onClose();
              navigate('/profile?tab=listings');
            }}
            className="flex-2 flex-grow bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-white font-black py-3 px-5 rounded-xl shadow-md hover:shadow-lg transition-all text-sm transform hover:-translate-y-0.5 active:translate-y-0"
          >
            {t.topAds.modal.selectListing}
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
};

export default GalleryInfoModal;
