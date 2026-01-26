import React from 'react';

/**
 * ProductDetailSkeleton Component
 * Ürün detay sayfası için yükleme iskeleti
 */
const ProductDetailSkeleton = () => {
    return (
        <div className="max-w-6xl mx-auto px-4 py-8 animate-pulse">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Image Gallery Skeleton */}
                <div className="space-y-4">
                    {/* Main Image */}
                    <div className="w-full h-96 bg-gray-200 rounded-lg"></div>

                    {/* Thumbnail Images */}
                    <div className="grid grid-cols-4 gap-2">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="h-20 bg-gray-200 rounded"></div>
                        ))}
                    </div>
                </div>

                {/* Product Info Skeleton */}
                <div className="space-y-6">
                    {/* Title */}
                    <div className="space-y-3">
                        <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                    </div>

                    {/* Price */}
                    <div className="h-10 bg-gray-200 rounded w-32"></div>

                    {/* Description */}
                    <div className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-full"></div>
                        <div className="h-4 bg-gray-200 rounded w-full"></div>
                        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                        <div className="h-4 bg-gray-200 rounded w-4/6"></div>
                    </div>

                    {/* Details */}
                    <div className="space-y-3">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <div key={i} className="flex justify-between">
                                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                            </div>
                        ))}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                        <div className="h-12 bg-gray-200 rounded flex-1"></div>
                        <div className="h-12 bg-gray-200 rounded w-12"></div>
                    </div>

                    {/* Seller Info */}
                    <div className="border-t pt-6 space-y-3">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                            <div className="flex-1 space-y-2">
                                <div className="h-4 bg-gray-200 rounded w-32"></div>
                                <div className="h-3 bg-gray-200 rounded w-24"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Related Listings Skeleton */}
            <div className="mt-12">
                <div className="h-6 bg-gray-200 rounded w-48 mb-6"></div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="space-y-3">
                            <div className="h-40 bg-gray-200 rounded"></div>
                            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ProductDetailSkeleton;
