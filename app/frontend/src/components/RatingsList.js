import React from 'react';
import StarRating from './StarRating';

/**
 * RatingsList Component
 * Displays a list of individual ratings with comments
 */
function RatingsList({ ratings }) {
    if (!ratings || ratings.length === 0) {
        return (
            <div className="text-center py-8 text-gray-500">
                <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
                <p className="font-medium">Henüz değerlendirme yapılmamış</p>
                <p className="text-sm mt-1">Bu satıcı için ilk değerlendirmeyi siz yapın!</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {ratings.map((rating, index) => (
                <div key={rating.id || index} className="border-b border-gray-100 pb-4 last:border-0">
                    <div className="flex items-start gap-3">
                        <div className="flex-shrink-0">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center text-white font-bold">
                                {rating.rater?.full_name?.[0]?.toUpperCase() || '?'}
                            </div>
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="font-semibold text-gray-900">
                                    {rating.rater?.full_name || 'Anonim Kullanıcı'}
                                </span>
                                <span className="text-xs text-gray-400">•</span>
                                <span className="text-xs text-gray-500">
                                    {new Date(rating.created_at).toLocaleDateString('tr-TR', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </span>
                            </div>
                            <div className="mb-2">
                                <StarRating rating={rating.rating} readOnly size={16} />
                            </div>
                            {rating.comment && (
                                <p className="text-sm text-gray-700 leading-relaxed">
                                    {rating.comment}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default RatingsList;
