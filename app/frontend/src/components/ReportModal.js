import React from 'react';
import { t } from '../translations';

export const ReportModal = ({ isOpen, onClose, onSubmit, reason, setReason, description, setDescription }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-xl max-w-md w-full border border-transparent dark:border-white/5">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-neutral-50">{t.productDetail.reportTitle}</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-neutral-400 mb-2">
                {t.productDetail.reportReasonTitle}
              </label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-neutral-800 border border-gray-300 dark:border-white/10 rounded-lg text-gray-900 dark:text-neutral-50 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                required
              >
                <option value="">{t.productDetail.pleaseChoose}</option>
                {Object.entries(t.productDetail.reportReasons).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-neutral-400 mb-2">
                {t.productDetail.reportDescriptionLabel}
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 dark:border-white/10 dark:bg-neutral-800 dark:text-neutral-50 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                placeholder={t.productDetail.reportDescriptionPlaceholder}
              />
            </div>

            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-900/30 rounded-lg p-3">
              <p className="text-sm text-gray-700 dark:text-neutral-300">
                <strong>{t.addListing.details}:</strong> {t.productDetail.reportNotice}
              </p>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-white/10 rounded-lg hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors text-gray-700 dark:text-neutral-300 font-medium"
            >
              {t.productDetail.reportCancel}
            </button>
            <button
              onClick={onSubmit}
              className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors font-medium"
            >
              {t.productDetail.reportSubmit}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportModal;
