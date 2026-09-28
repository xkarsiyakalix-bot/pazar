import React from 'react';

/**
 * ProductDetailSkeleton Component
 * Modern, responsive loading skeleton for ProductDetail page matching exact mobile & desktop layouts
 */
const ProductDetailSkeleton = () => {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-neutral-950 pb-20 sm:pb-12 animate-pulse">
            <div className="max-w-[1400px] mx-auto px-2 sm:px-4 py-3 sm:py-6">
                {/* Breadcrumb skeleton */}
                <div className="hidden sm:flex items-center gap-2 mb-4">
                    <div className="h-4 w-16 bg-gray-200 dark:bg-neutral-800 rounded"></div>
                    <div className="h-4 w-4 bg-gray-200 dark:bg-neutral-800 rounded"></div>
                    <div className="h-4 w-24 bg-gray-200 dark:bg-neutral-800 rounded"></div>
                    <div className="h-4 w-4 bg-gray-200 dark:bg-neutral-800 rounded"></div>
                    <div className="h-4 w-32 bg-gray-200 dark:bg-neutral-800 rounded"></div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                    {/* Left Column (Gallery & Details) */}
                    <div className="lg:col-span-2 space-y-4 sm:space-y-6">
                        {/* Gallery / Image Box */}
                        <div className="w-full h-[300px] sm:h-[500px] bg-gray-200 dark:bg-neutral-800 rounded-none sm:rounded-2xl relative overflow-hidden -mx-2 sm:mx-0">
                            {/* Floating back button on mobile skeleton */}
                            <div className="sm:hidden absolute top-3 left-3 w-8 h-8 rounded-full bg-black/20"></div>
                            {/* Floating share & fav buttons */}
                            <div className="absolute top-3 right-3 flex gap-2">
                                <div className="w-8 h-8 rounded-full bg-black/20"></div>
                                <div className="w-8 h-8 rounded-full bg-black/20"></div>
                            </div>
                        </div>

                        {/* Title & Price Card */}
                        <div className="bg-white dark:bg-neutral-900 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100 dark:border-white/5 space-y-4">
                            {/* Price */}
                            <div className="h-8 w-44 bg-gray-200 dark:bg-neutral-800 rounded-lg"></div>
                            
                            {/* Title */}
                            <div className="space-y-2">
                                <div className="h-6 w-5/6 bg-gray-200 dark:bg-neutral-800 rounded"></div>
                                <div className="h-5 w-2/3 bg-gray-200 dark:bg-neutral-800 rounded"></div>
                            </div>

                            {/* Location & Date Meta */}
                            <div className="flex gap-4 pt-2">
                                <div className="h-4 w-28 bg-gray-200 dark:bg-neutral-800 rounded"></div>
                                <div className="h-4 w-20 bg-gray-200 dark:bg-neutral-800 rounded"></div>
                            </div>
                        </div>

                        {/* Description Card */}
                        <div className="bg-white dark:bg-neutral-900 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100 dark:border-white/5 space-y-3">
                            <div className="h-5 w-32 bg-gray-200 dark:bg-neutral-800 rounded mb-4"></div>
                            <div className="h-4 w-full bg-gray-200 dark:bg-neutral-800 rounded"></div>
                            <div className="h-4 w-full bg-gray-200 dark:bg-neutral-800 rounded"></div>
                            <div className="h-4 w-4/5 bg-gray-200 dark:bg-neutral-800 rounded"></div>
                            <div className="h-4 w-3/5 bg-gray-200 dark:bg-neutral-800 rounded"></div>
                        </div>
                    </div>

                    {/* Right Column (Seller Card & Actions) */}
                    <div className="lg:col-span-1 space-y-4">
                        <div className="bg-white dark:bg-neutral-900 rounded-xl sm:rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-white/5 space-y-4">
                            {/* Seller Header */}
                            <div className="flex items-center gap-3">
                                <div className="w-14 h-14 rounded-full bg-gray-200 dark:bg-neutral-800 flex-shrink-0"></div>
                                <div className="space-y-2 flex-1">
                                    <div className="h-5 w-32 bg-gray-200 dark:bg-neutral-800 rounded"></div>
                                    <div className="h-3 w-20 bg-gray-200 dark:bg-neutral-800 rounded"></div>
                                </div>
                            </div>

                            {/* Contact / Action Buttons */}
                            <div className="space-y-2 pt-2">
                                <div className="h-11 w-full bg-gray-200 dark:bg-neutral-800 rounded-xl"></div>
                                <div className="h-11 w-full bg-gray-200 dark:bg-neutral-800 rounded-xl"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailSkeleton;
