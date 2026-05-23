import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { t } from '../translations';

export const MessageModal = ({ isOpen, onClose, onSubmit, sellerName, listingTitle }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const loadUserProfile = async () => {
      if (user && isOpen) {
        try {
          const { fetchUserProfile } = await import('../api/profile');
          const profile = await fetchUserProfile(user.id);
          if (profile) {
            setName(profile.full_name || '');
            setPhone(profile.phone || '');
          }
        } catch (error) {
          console.error('Error loading user profile:', error);
        }
      }
    };
    loadUserProfile();
  }, [user, isOpen]);

  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert(t.sellerProfile.loginToMessage);
      return;
    }

    try {
      setLoading(true);
      await onSubmit({ name, phone, message });
      setName('');
      setPhone('');
      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      alert(t.sellerProfile.messageError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[300]" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        aria-hidden="true"
        onClick={onClose}
      />

      {/* Mobile: Bottom Sheet | Desktop: Centered Modal */}
      <div className="fixed inset-0 flex items-end sm:items-center justify-center sm:p-4 pointer-events-none">
        <div className="pointer-events-auto w-full sm:max-w-xl bg-white dark:bg-neutral-900 rounded-t-3xl sm:rounded-2xl shadow-2xl flex flex-col"
          style={{ maxHeight: '90vh' }}>

          {/* Drag handle (mobile only) */}
          <div className="flex justify-center pt-3 pb-1 sm:hidden flex-shrink-0">
            <div className="w-10 h-1 bg-neutral-300 dark:bg-neutral-600 rounded-full" />
          </div>

          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-100 dark:border-white/10 flex-shrink-0">
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100" id="modal-title">
                {t.sellerProfile.message}
              </h3>
              {sellerName && (
                <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">{sellerName}</p>
              )}
              {listingTitle && (
                <p className="text-xs font-medium text-red-500 mt-0.5 truncate">📋 {listingTitle}</p>
              )}
            </div>
            <button
              onClick={onClose}
              className="ml-3 p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500 transition-colors flex-shrink-0"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Scrollable Form */}
          <div className="overflow-y-auto flex-1 px-5 py-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="modal-name" className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  {t.addListing.name}
                </label>
                <input
                  type="text"
                  id="modal-name"
                  required
                  className="w-full border border-neutral-200 dark:border-white/10 dark:bg-neutral-800 dark:text-white rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-sm transition-all"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="modal-phone" className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  {t.addListing.phoneNumber}
                </label>
                <input
                  type="tel"
                  id="modal-phone"
                  className="w-full border border-neutral-200 dark:border-white/10 dark:bg-neutral-800 dark:text-white rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-sm transition-all"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="modal-message" className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  {t.sellerProfile.message}
                </label>
                <textarea
                  id="modal-message"
                  required
                  rows={5}
                  className="w-full border border-neutral-200 dark:border-white/10 dark:bg-neutral-800 dark:text-white rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-sm transition-all resize-none"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-2 pb-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-3 rounded-xl border border-neutral-200 dark:border-white/10 text-neutral-700 dark:text-neutral-300 font-bold text-sm hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
                >
                  {t.common.cancel}
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-red-500 to-red-600 text-white font-bold text-sm hover:from-red-600 hover:to-red-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-red-500/20"
                >
                  {loading ? '...' : t.productDetail.message}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
export default MessageModal;
