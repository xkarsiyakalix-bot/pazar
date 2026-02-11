import React from 'react';

/**
 * ListingCardSkeleton Component
 * İlan kartları için daha premium ve modern yükleme iskeleti
 */
const ListingCardSkeleton = () => {
    return (
        <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm overflow-hidden border border-gray-100 dark:border-white/5 h-full flex flex-col">
            {/* Image Skeleton */}
            <div className="w-full h-28 bg-gray-200 dark:bg-neutral-700 relative overflow-hidden">
                {/* Shimmer Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 dark:via-white/5 to-transparent -translate-x-full animate-[shimmer_2s_infinite]"></div>
            </div>

            {/* Content Skeleton */}
            <div className="p-3 space-y-3 flex-1 flex flex-col">
                {/* Title */}
                <div className="space-y-1.5">
                    <div className="h-4 bg-gray-200 dark:bg-neutral-700 rounded-md w-full relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 dark:via-white/5 to-transparent -translate-x-full animate-[shimmer_2s_infinite]"></div>
                    </div>
                    <div className="h-4 bg-gray-200 dark:bg-neutral-700 rounded-md w-2/3 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 dark:via-white/5 to-transparent -translate-x-full animate-[shimmer_2s_infinite]"></div>
                    </div>
                </div>

                <div className="mt-auto pt-2 space-y-2">
                    {/* Price */}
                    <div className="h-5 bg-gray-200 dark:bg-neutral-700 rounded-md w-1/3 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 dark:via-white/5 to-transparent -translate-x-full animate-[shimmer_2s_infinite]"></div>
                    </div>

                    {/* Bottom Info (Location/Category) */}
                    <div className="flex justify-between items-center">
                        <div className="h-2.5 bg-gray-100 dark:bg-neutral-800 rounded w-16"></div>
                        <div className="h-2.5 bg-gray-100 dark:bg-neutral-800 rounded w-12"></div>
                    </div>
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
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
            {Array.from({ length: count }).map((_, index) => (
                <ListingCardSkeleton key={index} />
            ))}
        </div>
    );
};

export default ListingCardSkeleton;
