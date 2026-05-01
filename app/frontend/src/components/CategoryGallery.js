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
          <div className="bg-gray-50 dark:bg-neutral-900/50 border-2 border-dashed border-gray-300 dark:border-white/5 rounded-lg sm:rounded-xl p-8 sm:p-12 text-center">
            <svg className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 dark:text-neutral-600 mx-auto mb-3 sm:mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-0.707.293l-2.414 2.414a1 1 0 01-0.707.293h-3.172a1 1 0 01-0.707-0.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <p className="text-sm sm:text-base text-gray-500 dark:text-neutral-400 font-medium">{t.topAds.noAds}</p>
            <p className="text-xs sm:text-sm text-gray-400 dark:text-neutral-500 mt-1 sm:mt-2">{t.topAds.checkBackLater}</p>
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
