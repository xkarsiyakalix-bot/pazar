import React, { useState } from 'react';

/**
 * StarRating Component
 * Yıldız seçici ve gösterici
 * 
 * @param {number} rating - Mevcut puan (0-5)
 * @param {function} onRatingChange - Puan değiştiğinde çağrılacak fonksiyon
 * @param {boolean} readOnly - Sadece gösterim modu
 * @param {number} size - Yıldız boyutu (px)
 */
function StarRating({
    rating = 0,
    onRatingChange = null,
    readOnly = false,
    size = 24
}) {
    const [hoverRating, setHoverRating] = useState(0);

    const handleClick = (value) => {
        if (!readOnly && onRatingChange) {
            onRatingChange(value);
        }
    };

    const handleMouseEnter = (value) => {
        if (!readOnly) {
            setHoverRating(value);
        }
    };

    const handleMouseLeave = () => {
        if (!readOnly) {
            setHoverRating(0);
        }
    };

    const displayRating = hoverRating || rating;

    return (
        <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    type="button"
                    onClick={() => handleClick(star)}
                    onMouseEnter={() => handleMouseEnter(star)}
                    onMouseLeave={handleMouseLeave}
                    disabled={readOnly}
                    className={`transition-all duration-200 ${readOnly ? 'cursor-default' : 'cursor-pointer hover:scale-110'
                        }`}
                    aria-label={`${star} star${star > 1 ? 's' : ''}`}
                >
                    <svg
                        width={size}
                        height={size}
                        viewBox="0 0 24 24"
                        fill={star <= displayRating ? '#FCD34D' : '#E5E7EB'}
                        stroke={star <= displayRating ? '#F59E0B' : '#D1D5DB'}
                        strokeWidth="1"
                        className="transition-colors duration-200"
                    >
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                </button>
            ))}
            {!readOnly && (
                <span className="ml-2 text-sm text-gray-600">
                    {displayRating > 0 ? `${displayRating}/5` : 'Seçiniz'}
                </span>
            )}
        </div>
    );
}

export default StarRating;
