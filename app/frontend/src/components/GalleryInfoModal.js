import React from 'react';
import { t } from '../translations';

export const GalleryInfoModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 dark:bg-black dark:bg-opacity-80 transition-opacity" aria-hidden="true" onClick={onClose}></div>
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <div className="inline-block align-middle bg-white dark:bg-neutral-900 rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle w-[95%] sm:max-w-lg sm:w-full relative">
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:text-neutral-500 dark:hover:text-neutral-300 focus:outline-none z-10 transition-colors">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div className="bg-white dark:bg-neutral-900 px-4 pt-5 pb-4 sm:p-8 sm:pb-4">
            <div className="sm:flex sm:items-start text-center">
              <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                <div className="flex flex-col items-center sm:items-start mb-6">
                  <div className="w-16 h-16 bg-red-50 dark:bg-red-900/20 rounded-2xl flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.175 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.382-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl leading-8 font-black text-gray-900 dark:text-neutral-50" id="modal-title">{t.topAds.modalTitle}</h3>
                  <p className="mt-2 text-gray-500 dark:text-neutral-400 font-medium whitespace-pre-line">{t.topAds.modalSubtitle}</p>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-neutral-800/50 rounded-xl border border-gray-100 dark:border-white/5 transition-colors">
                    <div className="w-10 h-10 bg-white dark:bg-neutral-800 rounded-lg flex-shrink-0 flex items-center justify-center shadow-sm border border-gray-100 dark:border-white/5 text-xl">🏠</div>
                    <div>
                      <h4 className="font-bold text-gray-900 dark:text-neutral-100">{t.topAds.feature1Title}</h4>
                      <p className="text-sm text-gray-500 dark:text-neutral-400">{t.topAds.feature1Desc}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-neutral-800/50 rounded-xl border border-gray-100 dark:border-white/5 transition-colors">
                    <div className="w-10 h-10 bg-white dark:bg-neutral-800 rounded-lg flex-shrink-0 flex items-center justify-center shadow-sm border border-gray-100 dark:border-white/5 text-xl">👀</div>
                    <div>
                      <h4 className="font-bold text-gray-900 dark:text-neutral-100">{t.topAds.feature2Title}</h4>
                      <p className="text-sm text-gray-500 dark:text-neutral-400">{t.topAds.feature2Desc}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-neutral-800/50 rounded-xl border border-gray-100 dark:border-white/5 transition-colors">
                    <div className="w-10 h-10 bg-white dark:bg-neutral-800 rounded-lg flex-shrink-0 flex items-center justify-center shadow-sm border border-gray-100 dark:border-white/5 text-xl">⚡</div>
                    <div>
                      <h4 className="font-bold text-gray-900 dark:text-neutral-100">{t.topAds.feature3Title}</h4>
                      <p className="text-sm text-gray-500 dark:text-neutral-400">{t.topAds.feature3Desc}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-neutral-900/50 px-4 py-6 sm:px-8 sm:flex sm:flex-row-reverse gap-3 transition-colors">
            <button type="button" className="w-full inline-flex justify-center rounded-xl border border-transparent shadow-lg px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-base font-black text-white hover:from-red-700 hover:to-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:w-auto sm:text-sm transform transition-all hover:scale-[1.02] active:scale-[0.98]" onClick={onClose}>
              {t.topAds.gotIt}
            </button>
            <button type="button" className="mt-3 w-full inline-flex justify-center rounded-xl border border-gray-200 dark:border-white/10 shadow-sm px-6 py-3 bg-white dark:bg-neutral-800 text-base font-bold text-gray-700 dark:text-neutral-300 hover:bg-gray-50 dark:hover:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:mt-0 sm:w-auto sm:text-sm transition-all" onClick={onClose}>
              {t.common.cancel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GalleryInfoModal;
