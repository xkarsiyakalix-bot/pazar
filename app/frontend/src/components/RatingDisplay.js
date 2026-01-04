import React from 'react';
import StarRating from './StarRating';

/**
 * RatingDisplay Component
 * Satıcı puanlarını gösterir
 * 
 * @param {object} userRating - Kullanıcı puanlama bilgisi
 * @param {boolean} showDetails - Detaylı puanları göster
 * @param {string} size - Boyut: 'small', 'medium', 'large'
 */
function RatingDisplay({ userRating, showDetails = false, size = 'medium' }) {
    if (!userRating || userRating.total_ratings === 0) {
        return (
            <div className="text-gray-500 text-sm">
                Henüz değerlendirme yok
            </div>
        );
    }

    const sizeClasses = {
        small: {
            star: 16,
            text: 'text-sm',
            title: 'text-xs'
        },
        medium: {
            star: 20,
            text: 'text-base',
            title: 'text-sm'
        },
        large: {
            star: 24,
            text: 'text-lg',
            title: 'text-base'
        }
    };

    const currentSize = sizeClasses[size];

    return (
        <div className="space-y-2">
            {/* Genel Puan */}
            <div className="flex items-center gap-2">
                <StarRating
                    rating={Math.round(userRating.average_rating)}
                    readOnly
                    size={currentSize.star}
                />
                <span className={`font-bold text-gray-900 ${currentSize.text}`}>
                    {parseFloat(userRating.average_rating).toFixed(1)}
                </span>
                <span className={`text-gray-500 ${currentSize.title}`}>
                    ({userRating.total_ratings} {userRating.total_ratings === 1 ? 'Bewertung' : 'Bewertungen'})
                </span>
            </div>

            {/* Detaylı Puanlar */}
            {showDetails && (
                <div className="space-y-1.5 mt-3 pl-1">
                    <DetailRating
                        label="Kommunikation"
                        rating={userRating.communication_avg}
                        size={size}
                    />
                    <DetailRating
                        label="Produktbeschreibung"
                        rating={userRating.description_avg}
                        size={size}
                    />
                    <DetailRating
                        label="Lieferung"
                        rating={userRating.delivery_avg}
                        size={size}
                    />
                </div>
            )}
        </div>
    );
}

/**
 * DetailRating - Detaylı puan satırı
 */
function DetailRating({ label, rating, size }) {
    const sizeClasses = {
        small: { star: 14, text: 'text-xs' },
        medium: { star: 16, text: 'text-sm' },
        large: { star: 18, text: 'text-base' }
    };

    const currentSize = sizeClasses[size];

    return (
        <div className="flex items-center justify-between">
            <span className={`text-gray-600 ${currentSize.text}`}>{label}</span>
            <div className="flex items-center gap-2">
                <StarRating
                    rating={Math.round(rating)}
                    readOnly
                    size={currentSize.star}
                />
                <span className={`text-gray-700 font-medium ${currentSize.text} w-8 text-right`}>
                    {parseFloat(rating).toFixed(1)}
                </span>
            </div>
        </div>
    );
}

export default RatingDisplay;
