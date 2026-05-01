import React from 'react';
import { useNavigate } from 'react-router-dom';
import { t } from '../translations';

export const WelcomeModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
      <div className="bg-white dark:bg-neutral-900 rounded-3xl p-8 max-w-md w-full relative shadow-2xl transform transition-all animate-in fade-in zoom-in duration-300">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 dark:hover:text-neutral-200 transition-colors p-1"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="mb-8 text-center">
          <div className="w-20 h-20 bg-red-50 dark:bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6 transform hover:scale-110 transition-transform duration-300">
             <span className="text-4xl">✨</span>
          </div>
          <h2 className="text-2xl font-bold mb-3 text-gray-900 dark:text-neutral-50">{t.welcome.title}</h2>
          <p className="text-gray-600 dark:text-neutral-400">
            {t.welcome.subtitle}
          </p>
        </div>

        <div className="space-y-4 mb-10">
          {[t.welcome.feature3, t.welcome.feature1, t.welcome.feature2].map((feature, idx) => (
            <div key={idx} className="flex items-center gap-4 group">
              <div className="w-8 h-8 bg-green-50 dark:bg-green-500/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-green-100 dark:group-hover:bg-green-500/20 transition-colors">
                <svg className="w-5 h-5 text-green-600 dark:text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-gray-700 dark:text-neutral-300 font-medium">{feature}</span>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => { navigate('/register'); onClose(); }}
            className="flex-1 px-6 py-3.5 border border-gray-200 dark:border-white/10 rounded-2xl text-gray-700 dark:text-neutral-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-all font-semibold text-center"
          >
            {t.nav.register}
          </button>
          <button
            onClick={() => { navigate('/login'); onClose(); }}
            className="flex-1 px-6 py-3.5 bg-red-500 hover:bg-red-600 text-white rounded-2xl shadow-lg shadow-red-500/25 hover:shadow-red-600/30 transform hover:-translate-y-0.5 transition-all duration-200 font-semibold text-center"
          >
            {t.nav.login}
          </button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeModal;
