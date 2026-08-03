import React, { useEffect, useRef, useState } from 'react';

export const ImageLightbox = ({ isOpen, onClose, imageSrc, altText, images, currentIndex, onNavigate }) => {
  const containerRef = useRef(null);
  const [isProgrammaticScroll, setIsProgrammaticScroll] = useState(false);

  let parsedImages = [];
  if (Array.isArray(images)) {
    parsedImages = images;
  } else if (typeof images === 'string') {
    try {
      const parsed = JSON.parse(images);
      if (Array.isArray(parsed)) {
        parsedImages = parsed;
      } else {
        parsedImages = [images];
      }
    } catch (e) {
      parsedImages = [images];
    }
  }

  const hasMultipleImages = parsedImages.length > 1;
  const initialIndex = currentIndex !== undefined ? currentIndex : 0;
  
  // Use local state so swiping doesn't trigger a heavy re-render of the parent page
  const [localIndex, setLocalIndex] = useState(initialIndex);
  const displayImages = parsedImages.length > 0 ? parsedImages : [imageSrc];

  // Sync local state if parent changes it (unlikely while open)
  useEffect(() => {
    setLocalIndex(initialIndex);
  }, [initialIndex]);

  useEffect(() => {
    if (containerRef.current) {
      const width = containerRef.current.clientWidth;
      const currentScrollIndex = Math.round(containerRef.current.scrollLeft / width);
      
      if (currentScrollIndex === localIndex) return;

      setIsProgrammaticScroll(true);
      try {
        containerRef.current.scrollTo({
          left: localIndex * width,
          behavior: 'smooth'
        });
      } catch (e) {
        containerRef.current.scrollLeft = localIndex * width;
      }
      setTimeout(() => setIsProgrammaticScroll(false), 300);
    }
  }, [localIndex]);

  if (!isOpen) return null;

  const handleClose = (e) => {
    e.stopPropagation();
    if (onNavigate) onNavigate(localIndex);
    onClose();
  };

  const handlePrevious = (e) => {
    e.stopPropagation();
    if (hasMultipleImages) {
      setLocalIndex(prev => prev > 0 ? prev - 1 : displayImages.length - 1);
    }
  };

  const handleNext = (e) => {
    e.stopPropagation();
    if (hasMultipleImages) {
      setLocalIndex(prev => prev < displayImages.length - 1 ? prev + 1 : 0);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black bg-opacity-95 flex items-center justify-center p-4"
      onClick={handleClose}
    >
      {/* Close Button */}
      <button
        onClick={handleClose}
        className="absolute top-4 right-4 text-white hover:text-gray-300 focus:outline-none z-10 bg-black/50 rounded-full p-2 hover:bg-black/70 transition-all"
      >
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Previous Button */}
      {hasMultipleImages && (
        <button
          onClick={handlePrevious}
          className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 focus:outline-none z-10 bg-black/50 rounded-full p-2 sm:p-3 hover:bg-black/70 transition-all hover:scale-110"
        >
          <svg className="w-8 h-8 sm:w-10 sm:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}

      {/* Image - Swipeable Container */}
      <div
        ref={containerRef}
        className="relative w-full h-[85vh] flex overflow-x-auto snap-x snap-mandatory scrollbar-none"
        onClick={(e) => e.stopPropagation()}
        onScroll={(e) => {
          if (isProgrammaticScroll) return;
          const scrollLeft = e.target.scrollLeft;
          const width = e.target.clientWidth;
          const newIndex = Math.round(scrollLeft / width);
          if (newIndex !== localIndex && newIndex >= 0 && newIndex < displayImages.length) {
            setLocalIndex(newIndex);
          }
        }}
      >
        {displayImages.map((img, idx) => (
          <div key={idx} className="w-full h-full flex-shrink-0 flex items-center justify-center snap-center">
            <img
              src={img}
              alt={`${altText} ${idx + 1}`}
              draggable="false"
              className="max-w-full max-h-full object-contain cursor-default select-none pointer-events-none"
            />
          </div>
        ))}
      </div>

      {/* Image Counter */}
      {hasMultipleImages && (
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white text-sm bg-black/50 px-4 py-2 rounded-full z-10">
          {localIndex + 1} / {displayImages.length}
        </div>
      )}

      {/* Next Button */}
      {hasMultipleImages && (
        <button
          onClick={handleNext}
          className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 focus:outline-none z-10 bg-black/50 rounded-full p-2 sm:p-3 hover:bg-black/70 transition-all hover:scale-110"
        >
          <svg className="w-8 h-8 sm:w-10 sm:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}
    </div>
  );
};
