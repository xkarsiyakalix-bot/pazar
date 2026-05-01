import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { t } from '../translations';

export const VisibilityPackagesModal = ({ isOpen, onClose, listing }) => {
  const [selectedPromotions, setSelectedPromotions] = useState([]);
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!isOpen) return null;

  const promotionPackages = [
    { id: 'bump', name: 'Yukarı Çıkar', price: '9,99', duration: 1, durationLabel: 'bir kerelik', effect: 'Yeni dikkat çekin! İlanınız yeni bir ilan gibi görünecek.' },
    { id: 'highlight', name: 'Öne Çıkan', price: '79,99', duration: 7, durationLabel: '7 Gün', effect: '2 kata kadar daha fazla görünürlük! İlanınız renkli olarak vurgulanacak.' },
    { id: 'multi-bump', name: 'Tekrarlı Yukarı Çıkarma', price: '99,99', duration: 7, durationLabel: '7 Gün', effect: '5 kata kadar daha fazla görünürlük! Bir hafta boyunca ilanınız her gün yukarı çıkarılacak.' },
    { id: 'z_premium', name: 'Premium', price: '129,99', duration: 7, durationLabel: '7 Gün', effect: '10 kata kadar daha fazla görünürlük! İlanınız listenin en başında yer alacak!' },
    { id: 'galerie', name: 'Vitrin', price: '199,99', duration: 10, durationLabel: '10 Gün', effect: '15 kata kadar daha fazla görünürlük! İlanınız ana sayfada da görünecek!' },
  ];

  const togglePromotionSelection = (pkgId) => {
    setSelectedPromotions(prev =>
      prev.includes(pkgId) ? [] : [pkgId]
    );
  };

  const calculateTotal = () => {
    return selectedPromotions.reduce((acc, id) => {
      const pkg = promotionPackages.find(p => p.id === id);
      return acc + (pkg ? parseFloat(pkg.price.replace(',', '.')) : 0);
    }, 0).toFixed(2).replace('.', ',');
  };

  const handlePromotionPurchase = async () => {
    const packagesToPurchase = selectedPromotions.map(id => promotionPackages.find(p => p.id === id));

    if (packagesToPurchase.length === 0) return;

    const totalStr = calculateTotal();
    const names = packagesToPurchase.map(p => p.name).join(', ');

    if (window.confirm(`${names} toplam ${totalStr} TL karşılığında satın alınsın mı?\n\nÜcret hesabınızdan düşülecektir.`)) {
      try {
        const { purchasePromotion } = await import('../api/promotions');

        // Process each promotion
        for (const p of packagesToPurchase) {
          await purchasePromotion(listing.id, {
            id: p.id,
            price: parseFloat(p.price.replace(',', '.')),
            duration: p.duration
          }, user.id);
        }

        alert(`Teşekkürler! Seçilen paketler aktif edildi.`);
        setSelectedPromotions([]);
        onClose();
        window.location.reload();
      } catch (error) {
        console.error('Error purchasing promotions:', error);
        alert('Promosyon satın alınırken hata oluştu');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md transition-all duration-300" onClick={onClose}>
      <div className="bg-white dark:bg-neutral-900 rounded-3xl shadow-2xl w-full max-w-5xl overflow-hidden max-h-[90vh] flex flex-col border border-transparent dark:border-white/5 transition-colors duration-300" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-4 sm:p-6 text-white flex justify-between items-center">
          <div>
            <h2 className="text-lg sm:text-2xl font-black flex items-center gap-2">
              <span className="bg-red-500 text-white p-1 sm:p-1.5 rounded-lg">
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </span>
              Görünürlüğü Artır
            </h2>
            <p className="text-gray-400 text-[10px] sm:text-xs font-bold uppercase tracking-widest mt-0.5 sm:mt-1">İlan: <span className="text-white">{listing.title}</span></p>
          </div>
          <button onClick={onClose} className="p-1 sm:p-2 hover:bg-white/10 rounded-full transition-colors">
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-3 sm:p-6 bg-gray-50/50 dark:bg-neutral-950/50 transition-colors duration-300">
          <div className="bg-white dark:bg-neutral-900 rounded-2xl border-2 border-gray-100 dark:border-white/5 overflow-hidden shadow-sm transition-colors duration-300">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 dark:bg-neutral-950/50 border-b-2 border-gray-100 dark:border-white/5 transition-colors duration-300">
                  <tr className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-neutral-400">
                    <th className="px-3 sm:px-6 py-3 sm:py-4 w-12 sm:w-16">Seç</th>
                    <th className="px-2 sm:px-4 py-3 sm:py-4">Paket Detayı</th>
                    <th className="px-3 sm:px-6 py-3 sm:py-4">Süre</th>
                    <th className="px-3 sm:px-6 py-3 sm:py-4 text-right w-24 sm:w-32">Fiyat</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-white/5 text-xs sm:text-sm transition-colors duration-300">
                  {promotionPackages.map((pkg, idx) => (
                    <tr
                      key={pkg.id}
                      onClick={() => togglePromotionSelection(pkg.id)}
                      className={`hover:bg-red-50/40 dark:hover:bg-red-900/10 transition-all cursor-pointer group ${idx % 2 !== 0 ? 'bg-gray-50/30 dark:bg-neutral-950/20' : ''} ${selectedPromotions.includes(pkg.id) ? 'bg-red-50 dark:bg-red-900/20' : ''}`}
                    >
                      <td className="px-3 sm:px-6 py-3 sm:py-5">
                        <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-300 ${selectedPromotions.includes(pkg.id) ? 'bg-red-500 border-red-500 scale-110 shadow-lg shadow-red-200' : 'border-gray-200 dark:border-white/10 bg-white dark:bg-neutral-800 group-hover:border-red-300'}`}>
                          {selectedPromotions.includes(pkg.id) && (
                            <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3.5} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                      </td>
                      <td className="px-2 sm:px-4 py-3 sm:py-5">
                        <div className="font-bold sm:font-black text-gray-900 dark:text-neutral-50 group-hover:text-red-600 transition-colors uppercase tracking-tight">{pkg.name}</div>
                        <div className="text-[10px] sm:text-xs text-gray-500 dark:text-neutral-400 mt-0.5 leading-tight italic font-medium transition-colors">{pkg.effect}</div>
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-5">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-gray-100 dark:bg-neutral-800 text-gray-600 dark:text-neutral-400 transition-colors">
                          {pkg.durationLabel || (pkg.duration === 1 ? '1x' : `${pkg.duration}G`)}
                        </span>
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-5 text-right font-black text-red-600 text-sm sm:text-xl tabular-nums">
                        {pkg.price} TL
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer / Cart Summary */}
        <div className={`p-4 sm:p-6 bg-white dark:bg-neutral-900 border-t-2 border-gray-100 dark:border-white/5 transition-all duration-500 ${selectedPromotions.length > 0 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-70 grayscale pointer-events-none'}`}>
          <div className="bg-gray-900 rounded-2xl p-4 sm:p-6 text-white flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6 shadow-2xl">
            <div className="flex items-center gap-4 sm:gap-6">
              <div className={`bg-red-500 text-white p-2 sm:p-3 rounded-xl ${selectedPromotions.length > 0 ? 'animate-bounce shadow-lg shadow-red-500/50' : ''}`}>
                <svg className="w-5 h-5 sm:w-7 sm:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-0.63.63-0.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div className="text-center sm:text-left">
                <div className="text-[8px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-red-500 mb-0.5 sm:mb-1">{selectedPromotions.length} Paket Seçildi</div>
                <div className="text-xl sm:text-3xl font-black tracking-tight tabular-nums">Toplam: {calculateTotal()} TL</div>
              </div>
            </div>
            <button
              onClick={handlePromotionPurchase}
              disabled={selectedPromotions.length === 0}
              className="w-full sm:w-auto px-8 sm:px-12 py-3 sm:py-5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-bold sm:font-black text-base sm:text-xl shadow-xl shadow-red-500/30 hover:shadow-red-500/50 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 sm:gap-3 group"
            >
              Şimdi Satın Al
              <svg className="w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>
          <div className="mt-4 text-center">
            <p className="text-[10px] font-bold text-gray-400 dark:text-neutral-500 uppercase tracking-widest flex items-center justify-center gap-2 transition-colors">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              Güvenli Ödeme • Fiyatlara KDV dahildir
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisibilityPackagesModal;
