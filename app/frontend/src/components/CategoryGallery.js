import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { t } from '../translations';
import { useAuth } from '../contexts/AuthContext';
import ListingCard from './ListingCard';

export const CategoryGallery = ({ category, subCategory, listings, toggleFavorite = () => { }, isFavorite = () => false, hidePrice = false }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [galleryItems, setGalleryItems] = useState([]);
  const [itemsPerView, setItemsPerView] = useState(5);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const isMobile = window.innerWidth < 768;
  const { user } = useAuth();

  // Update itemsPerView based on screen size
  useEffect(() => {
    const updateItemsPerView = () => {
      if (window.innerWidth < 640) {
        setItemsPerView(2);
      } else if (window.innerWidth < 1024) {
        setItemsPerView(3);
      } else {
        setItemsPerView(5);
      }
    };

    updateItemsPerView();
    window.addEventListener('resize', updateItemsPerView);
    return () => window.removeEventListener('resize', updateItemsPerView);
  }, []);

  useEffect(() => {
    const fetchCategoryTopListings = async () => {
      try {
        if (listings) {
          const shuffled = [...listings].sort(() => 0.5 - Math.random());
          setGalleryItems(shuffled.slice(0, 10));
          return;
        }

        const { fetchListings } = await import('../api/listings');
        let filters = { is_top: true };
        if (category) filters.category = category;
        if (subCategory) filters.subCategory = subCategory;

        const topListings = await fetchListings(filters);
        const filteredTop = topListings.filter(l =>
          l.package_type?.toLowerCase() !== 'premium' &&
          l.package_type?.toLowerCase() !== 'z_premium' &&
          l.package_type?.toLowerCase() !== 'multi-bump' &&
          l.package_type?.toLowerCase() !== 'z_multi_bump' &&
          l.package_type?.toLowerCase() !== 'basic' &&
          l.package_type?.toLowerCase() !== 'verlängerung' &&
          l.package_type?.toLowerCase() !== 'extension'
        );

        const shuffled = [...filteredTop].sort(() => 0.5 - Math.random());

        if (shuffled.length === 0) {
          const allListings = await fetchListings(category || subCategory ? { category, subCategory } : {});
          const randomFallback = [...allListings].sort(() => 0.5 - Math.random());
          setGalleryItems(randomFallback.slice(0, 10));
        } else {
          setGalleryItems(shuffled.slice(0, 10));
        }
      } catch (error) {
        console.error('Error fetching category top listings:', error);
        setGalleryItems([]);
      }
    };
    fetchCategoryTopListings();
  }, [category, subCategory, listings]);

  const maxIndex = Math.max(0, galleryItems.length - itemsPerView);

  const nextSlide = () => {
    setCurrentIndex(prev => Math.min(prev + 1, maxIndex));
  };

  const prevSlide = () => {
    setCurrentIndex(prev => Math.max(prev - 1, 0));
  };

  return (
    <section className="mb-4 sm:mb-6 overflow-hidden">
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-neutral-100">{t.topAds.title}</h2>
        <div className="flex items-center gap-2 sm:gap-4">
          <button
            onClick={() => setShowInfoModal(true)}
            className="text-xs sm:text-sm text-red-600 hover:text-red-700 font-medium hover:underline transition-colors"
          >
            {t.topAds.placeAd}
          </button>
          {galleryItems.length > itemsPerView && !isMobile && (
            <div className="hidden md:flex gap-1 sm:gap-2">
              <button
                onClick={prevSlide}
                disabled={currentIndex === 0}
                className="p-1.5 sm:p-2.5 rounded-full bg-white dark:bg-neutral-800 border-2 border-gray-200 dark:border-white/10 hover:border-red-500 dark:hover:border-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md focus:outline-none"
                aria-label="Previous items"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700 dark:text-neutral-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={nextSlide}
                disabled={currentIndex >= maxIndex}
                className="p-1.5 sm:p-2.5 rounded-full bg-white dark:bg-neutral-800 border-2 border-gray-200 dark:border-white/10 hover:border-red-500 dark:hover:border-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md focus:outline-none"
                aria-label="Next items"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700 dark:text-neutral-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="relative overflow-hidden">
        {galleryItems.length === 0 ? (
          <div className="bg-white dark:bg-neutral-950 rounded-3xl overflow-hidden border border-gray-200 dark:border-white/5 shadow-lg max-w-4xl mx-auto my-4 transform transition-all">
            {/* Header with Premium Pattern */}
            <div className="relative h-28 md:h-36 bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 dark:from-neutral-900 dark:via-neutral-950 dark:to-neutral-900 flex items-center justify-center overflow-hidden border-b border-gray-200 dark:border-white/10">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent"></div>
              <div className="text-center z-10 p-6">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black tracking-wider uppercase bg-gradient-to-r from-amber-400 to-amber-500 text-white shadow-md mb-2">
                  ⭐ VİTRİN İLANI
                </span>
                <h2 className="text-xl md:text-2xl font-black text-gray-900 dark:text-white tracking-tight uppercase">
                  Kategoride Fark Edilin!
                </h2>
              </div>
            </div>

            {/* Content Body */}
            <div className="p-4 md:p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-5">
                <div className="flex flex-col items-center text-center gap-2 p-3 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-500 text-white flex items-center justify-center flex-shrink-0 font-bold text-lg shadow-sm">🚀</div>
                  <div>
                    <h3 className="text-xs font-black text-gray-900 dark:text-white mb-1">Daha Fazla Başvuru</h3>
                    <p className="text-[10px] text-gray-600 dark:text-neutral-400 font-medium">Öne çıkan konumla daha fazla alıcıya ulaşın.</p>
                  </div>
                </div>
                <div className="flex flex-col items-center text-center gap-2 p-3 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-500 text-white flex items-center justify-center flex-shrink-0 font-bold text-lg shadow-sm">📅</div>
                  <div>
                    <h3 className="text-xs font-black text-gray-900 dark:text-white mb-1">10 Günlük Döngü</h3>
                    <p className="text-[10px] text-gray-600 dark:text-neutral-400 font-medium">İlanınız kategori sayfasında en üstte döner.</p>
                  </div>
                </div>
                <div className="flex flex-col items-center text-center gap-2 p-3 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-500 text-white flex items-center justify-center flex-shrink-0 font-bold text-lg shadow-sm">💎</div>
                  <div>
                    <h3 className="text-xs font-black text-gray-900 dark:text-white mb-1">Premium Etkisi</h3>
                    <p className="text-[10px] text-gray-600 dark:text-neutral-400 font-medium">Dikkat çeken ilanlarla satışınızı hızlandırın.</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3">
                <button
                  onClick={() => {
                    const navigate = window.location.href.includes('/profile') 
                      ? () => window.location.reload() 
                      : () => window.location.href = '/profile?tab=listings';
                    navigate();
                  }}
                  className="w-full bg-gradient-to-r from-amber-400 to-amber-500 text-white font-black py-3 px-6 rounded-xl shadow-md hover:shadow-lg transition-all text-sm transform hover:-translate-y-0.5"
                >
                  Şimdi İlan Seç
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div
            className="flex gap-2 sm:gap-3 overflow-x-auto md:overflow-hidden snap-x snap-mandatory scrollbar-hide md:transition-transform md:duration-500 md:ease-in-out py-1.5 px-0.5"
            style={{
              transform: !isMobile ? `translateX(-${currentIndex * (100 / itemsPerView)}%)` : 'none',
              scrollSnapType: 'x mandatory',
              WebkitOverflowScrolling: 'touch'
            }}
          >
            {galleryItems.map((item) => (
              <div
                key={item.id}
                className="gallery-item flex-shrink-0 snap-start"
                style={{
                  width: window.innerWidth < 768
                    ? 'calc(45% - 8px)'
                    : `calc(${100 / itemsPerView}% - ${(itemsPerView - 1) * (itemsPerView === 2 ? 8 : 12) / itemsPerView}px)`
                }}
              >
                <ListingCard
                  listing={item}
                  toggleFavorite={toggleFavorite}
                  isFavorite={isFavorite}
                  isOwnListing={user && item.user_id === user.id}
                  hidePrice={hidePrice}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default CategoryGallery;
