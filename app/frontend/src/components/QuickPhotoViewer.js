import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { getOptimizedImageUrl } from '../utils/imageUtils';
import { isPetAdoptionListing } from '../utils/formatUtils';

export const QuickPhotoViewer = ({ listing, initialIndex = 0, onClose }) => {
  const images = (listing?.images && listing.images.length > 0)
    ? listing.images
    : [listing?.image].filter(Boolean);

  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isVisible, setIsVisible] = useState(false);
  const [imgLoaded, setImgLoaded] = useState({});

  // Touch / swipe state
  const touchStartX = useRef(null);
  const touchStartY = useRef(null);
  const isDragging = useRef(false);
  const dragOffset = useRef(0);
  const [visualOffset, setVisualOffset] = useState(0);

  // Fade in on mount
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = useCallback(() => {
    setIsVisible(false);
    setTimeout(onClose, 200);
  }, [onClose]);

  const goNext = useCallback((e) => {
    if (e) e.stopPropagation();
    setCurrentIndex((i) => Math.min(i + 1, images.length - 1));
    setVisualOffset(0);
  }, [images.length]);

  const goPrev = useCallback((e) => {
    if (e) e.stopPropagation();
    setCurrentIndex((i) => Math.max(i - 1, 0));
    setVisualOffset(0);
  }, []);

  // Keyboard navigation & body scroll lock
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') handleClose();
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft') goPrev();
    };
    window.addEventListener('keydown', handleKey);

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [handleClose, goNext, goPrev]);

  // Touch events for swiping
  const onTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    isDragging.current = false;
  };

  const onTouchMove = (e) => {
    if (touchStartX.current === null) return;
    const dx = e.touches[0].clientX - touchStartX.current;
    const dy = e.touches[0].clientY - touchStartY.current;
    if (!isDragging.current && Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 10) {
      isDragging.current = true;
    }
    if (isDragging.current) {
      dragOffset.current = dx;
      setVisualOffset(dx * 0.4);
    }
  };

  const onTouchEnd = () => {
    if (isDragging.current) {
      const threshold = 50;
      if (dragOffset.current < -threshold) {
        goNext();
      } else if (dragOffset.current > threshold) {
        goPrev();
      }
    }
    setVisualOffset(0);
    dragOffset.current = 0;
    touchStartX.current = null;
    isDragging.current = false;
  };

  const priceDisplay = (() => {
    if (!listing) return '';
    if (isPetAdoptionListing(listing)) return '🐾 Sahiplendirme';
    if (listing.price_type === 'giveaway' || listing.price === 0) return 'Ücretsiz';
    if (listing.price) return `${listing.price.toLocaleString('tr-TR')} TL`;
    if (listing.price_type === 'negotiable') return 'Pazarlıklı';
    return 'Görüşülür';
  })();

  const isFree = listing?.price_type === 'giveaway' || listing?.price === 0;

  const currentImgUrl = images[currentIndex]
    ? getOptimizedImageUrl(images[currentIndex], 900, 900, 'contain')
    : '/favicon.png';

  const modal = (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center transition-opacity duration-200 select-none ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.88)', backdropFilter: 'blur(8px)' }}
      onClick={handleClose}
    >
      {/* Top Header Controls */}
      <div className="absolute top-4 left-0 right-0 px-4 flex items-center justify-between z-20 pointer-events-none">
        <div className="bg-black/60 text-white text-xs font-semibold px-3 py-1.5 rounded-full pointer-events-auto shadow-md">
          {images.length > 0 ? `${currentIndex + 1} / ${images.length}` : 'Önizleme'}
        </div>

        <button
          onClick={handleClose}
          className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/25 active:scale-95 text-white flex items-center justify-center pointer-events-auto transition-all shadow-md"
          aria-label="Kapat"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Main Preview Container */}
      <div
        className="relative w-full max-w-xl flex items-center justify-center px-4"
        style={{ height: 'calc(100vh - 160px)' }}
        onClick={(e) => e.stopPropagation()}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {/* Previous Button */}
        {currentIndex > 0 && (
          <button
            onClick={goPrev}
            className="absolute left-4 z-20 w-11 h-11 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center shadow-lg active:scale-95 transition-all"
            aria-label="Önceki Resim"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}

        {/* Center Image */}
        <div
          className="relative max-h-full max-w-full flex items-center justify-center transition-transform"
          style={{
            transform: `translateX(${visualOffset}px)`,
            transition: visualOffset === 0 ? 'transform 0.2s ease-out' : 'none'
          }}
        >
          {!imgLoaded[currentIndex] && (
            <div className="absolute inset-0 flex items-center justify-center min-h-[250px]">
              <div className="w-10 h-10 border-3 border-white/20 border-t-white rounded-full animate-spin" />
            </div>
          )}

          <img
            key={currentIndex}
            src={currentImgUrl}
            alt={listing?.title || 'İlan resmi'}
            className={`max-h-[70vh] max-w-full object-contain rounded-xl shadow-2xl transition-opacity duration-200 ${
              imgLoaded[currentIndex] ? 'opacity-100' : 'opacity-0'
            }`}
            draggable={false}
            onLoad={() => setImgLoaded((prev) => ({ ...prev, [currentIndex]: true }))}
          />
        </div>

        {/* Next Button */}
        {currentIndex < images.length - 1 && (
          <button
            onClick={goNext}
            className="absolute right-4 z-20 w-11 h-11 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center shadow-lg active:scale-95 transition-all"
            aria-label="Sonraki Resim"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}
      </div>

      {/* Bottom Info Bar */}
      <div
        className="w-full max-w-xl px-5 pb-5 pt-2 flex flex-col gap-2.5 z-20"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Pagination Dots */}
        {images.length > 1 && (
          <div className="flex justify-center items-center gap-1.5 py-1">
            {images.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setCurrentIndex(idx);
                  setVisualOffset(0);
                }}
                className={`transition-all duration-200 rounded-full ${
                  idx === currentIndex
                    ? 'w-6 h-2 bg-white'
                    : 'w-2 h-2 bg-white/40 hover:bg-white/70'
                }`}
                aria-label={`Resim ${idx + 1}`}
              />
            ))}
          </div>
        )}

        {/* Title & Price Card */}
        <div className="bg-white/10 dark:bg-neutral-900/80 backdrop-blur-md border border-white/15 rounded-2xl p-3.5 flex items-center justify-between gap-4 shadow-xl">
          <div className="min-w-0 flex-1">
            <h4 className="text-white text-sm font-semibold truncate leading-tight">
              {listing?.title}
            </h4>
            {listing?.city && (
              <p className="text-gray-300 text-xs mt-0.5 flex items-center gap-1">
                <span>📍</span>
                <span>{listing.city}</span>
              </p>
            )}
          </div>
          {priceDisplay && (
            <div className={`text-base font-black flex-shrink-0 ${isFree ? 'text-green-400' : 'text-red-400'}`}>
              {priceDisplay}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
};

export default QuickPhotoViewer;
