import React from 'react';

/**
 * ListingCardSkeleton Component
 * İlan kartları için yükleme iskeleti
 */
const ListingCardSkeleton = () => {
    return (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden animate-pulse">
            {/* Image Skeleton */}
            <div className="w-full h-48 bg-gray-200"></div>

            {/* Content Skeleton */}
            <div className="p-4 space-y-3">
                {/* Title */}
                <div className="h-5 bg-gray-200 rounded w-3/4"></div>

                {/* Description */}
                <div className="space-y-2">
                    <div className="h-3 bg-gray-200 rounded w-full"></div>
                    <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                </div>

                {/* Price and Location */}
                <div className="flex justify-between items-center pt-2">
                    <div className="h-6 bg-gray-200 rounded w-20"></div>
                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                </div>
            </div>
        </div>
    );
};

/**
 * ListingGridSkeleton Component
 * Birden fazla ilan kartı iskeleti gösterir
 */
export const ListingGridSkeleton = ({ count = 8 }) => {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {Array.from({ length: count }).map((_, index) => (
                <ListingCardSkeleton key={index} />
            ))}
        </div>
    );
};

export default ListingCardSkeleton;
