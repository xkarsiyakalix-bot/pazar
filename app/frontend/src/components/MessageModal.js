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
    <div className="fixed inset-0 z-[200] overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-start sm:items-center justify-center min-h-screen pt-10 sm:pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 dark:bg-black dark:bg-opacity-80 transition-opacity" aria-hidden="true" onClick={onClose}></div>
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <div className="inline-block align-middle bg-white dark:bg-neutral-900 rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle w-[95%] sm:max-w-xl sm:w-full relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:text-neutral-500 dark:hover:text-neutral-300 focus:outline-none z-10"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div className="bg-white dark:bg-neutral-900 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start text-center">
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <h3 className="text-xl leading-8 font-bold text-gray-900 dark:text-neutral-100 pr-8" id="modal-title">
                  {t.sellerProfile.message} - {sellerName}
                </h3>
                {listingTitle && (
                  <div className="mt-2">
                    <p className="text-sm font-medium text-red-600 dark:text-red-400">
                      📅 {listingTitle}
                    </p>
                  </div>
                )}
                <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                  <div>
                    <label htmlFor="modal-name" className="block text-sm font-medium text-gray-700 dark:text-neutral-300">{t.addListing.name}</label>
                    <input
                      type="text"
                      id="modal-name"
                      required
                      className="mt-1 block w-full border border-gray-300 dark:border-white/10 dark:bg-neutral-800 dark:text-white rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <div>
                    <label htmlFor="modal-phone" className="block text-sm font-medium text-gray-700 dark:text-neutral-300">{t.addListing.phoneNumber}</label>
                    <input
                      type="tel"
                      id="modal-phone"
                      className="mt-1 block w-full border border-gray-300 dark:border-white/10 dark:bg-neutral-800 dark:text-white rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                  <div>
                    <label htmlFor="modal-message" className="block text-sm font-medium text-gray-700 dark:text-neutral-300">{t.sellerProfile.message}</label>
                    <textarea
                      id="modal-message"
                      required
                      rows={6}
                      className="mt-1 block w-full border border-gray-300 dark:border-white/10 dark:bg-neutral-800 dark:text-white rounded-xl shadow-sm py-3 px-4 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm transition-all"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                    />
                  </div>
                  <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                    <button
                      type="submit"
                      className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-base font-medium text-white hover:from-red-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                    >
                      {t.productDetail.message}
                    </button>
                    <button
                      type="button"
                      className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-white/10 shadow-sm px-4 py-2 bg-white dark:bg-neutral-800 text-base font-medium text-gray-700 dark:text-neutral-300 hover:bg-gray-50 dark:hover:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:mt-0 sm:w-auto sm:text-sm transition-colors"
                      onClick={onClose}
                    >
                      {t.common.cancel}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default MessageModal;

