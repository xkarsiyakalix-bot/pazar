import React from 'react';

export const ImageLightbox = ({ isOpen, onClose, imageSrc, altText, images, currentIndex, onNavigate }) => {
  if (!isOpen) return null;

  const hasMultipleImages = images && images.length > 1;
  const currentImageIndex = currentIndex !== undefined ? currentIndex : 0;
  const currentImage = images && images[currentImageIndex] ? images[currentImageIndex] : imageSrc;

  const handlePrevious = (e) => {
    e.stopPropagation();
    if (onNavigate && hasMultipleImages) {
      const newIndex = currentImageIndex > 0 ? currentImageIndex - 1 : images.length - 1;
      onNavigate(newIndex);
    }
  };

  const handleNext = (e) => {
    e.stopPropagation();
    if (onNavigate && hasMultipleImages) {
      const newIndex = currentImageIndex < images.length - 1 ? currentImageIndex + 1 : 0;
      onNavigate(newIndex);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black bg-opacity-95 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Close Button */}
      <button
        onClick={onClose}
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
          className="hidden md:block absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 focus:outline-none z-10 bg-black/50 rounded-full p-3 hover:bg-black/70 transition-all hover:scale-110"
        >
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}

      {/* Image - Swipeable Container */}
      <div
        className="relative w-full h-[85vh] flex overflow-x-auto snap-x snap-mandatory scrollbar-none"
        onClick={(e) => e.stopPropagation()}
        onScroll={(e) => {
          const scrollLeft = e.target.scrollLeft;
          const width = e.target.clientWidth;
          const newIndex = Math.round(scrollLeft / width);
          if (newIndex !== currentImageIndex && onNavigate) {
            onNavigate(newIndex);
          }
        }}
        ref={(el) => {
          if (el && el.scrollLeft !== currentImageIndex * el.clientWidth) {
            el.scrollLeft = currentImageIndex * el.clientWidth;
          }
        }}
      >
        {(images && images.length > 0 ? images : [imageSrc]).map((img, idx) => (
          <div key={idx} className="w-full h-full flex-shrink-0 flex items-center justify-center snap-center">
            <img
              src={img}
              alt={`${altText} ${idx + 1}`}
              className="max-w-full max-h-full object-contain cursor-default"
            />
          </div>
        ))}
      </div>

      {/* Image Counter */}
      {hasMultipleImages && (
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white text-sm bg-black/50 px-4 py-2 rounded-full z-10">
          {currentImageIndex + 1} / {images.length}
        </div>
      )}

      {/* Next Button */}
      {hasMultipleImages && (
        <button
          onClick={handleNext}
          className="hidden md:block absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 focus:outline-none z-10 bg-black/50 rounded-full p-3 hover:bg-black/70 transition-all hover:scale-110"
        >
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}
    </div>
  );
};
