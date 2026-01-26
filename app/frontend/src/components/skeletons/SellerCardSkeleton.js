import React from 'react';

/**
 * SellerCardSkeleton Component
 * Satıcı kartları için yükleme iskeleti
 */
const SellerCardSkeleton = () => {
    return (
        <div className="bg-white rounded-lg shadow-sm p-4 animate-pulse">
            <div className="flex items-center gap-3 mb-3">
                {/* Avatar */}
                <div className="w-12 h-12 bg-gray-200 rounded-full flex-shrink-0"></div>

                {/* Name and Info */}
                <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-32"></div>
                    <div className="h-3 bg-gray-200 rounded w-24"></div>
                </div>
            </div>

            {/* Stats */}
            <div className="flex gap-4 mb-3">
                <div className="h-3 bg-gray-200 rounded w-20"></div>
                <div className="h-3 bg-gray-200 rounded w-20"></div>
            </div>

            {/* Follow Button */}
            <div className="h-9 bg-gray-200 rounded w-full"></div>
        </div>
    );
};

/**
 * SellerGridSkeleton Component
 * Birden fazla satıcı kartı iskeleti
 */
export const SellerGridSkeleton = ({ count = 4 }) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: count }).map((_, index) => (
                <SellerCardSkeleton key={index} />
            ))}
        </div>
    );
};

export default SellerCardSkeleton;
