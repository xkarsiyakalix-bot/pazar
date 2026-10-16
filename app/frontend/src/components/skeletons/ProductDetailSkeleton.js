import React from 'react';

const ProductDetailSkeleton = () => {
    return (
        <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 pb-20 sm:pb-12">
            <div className="max-w-7xl mx-auto px-2 sm:px-4 py-3 sm:py-6">
                <div className="hidden sm:flex items-center gap-2 mb-4">
                    <div className="h-3 w-16 bg-neutral-200 dark:bg-neutral-800 rounded-sm"></div>
                    <div className="h-3 w-3 bg-neutral-200 dark:bg-neutral-800 rounded-sm"></div>
                    <div className="h-3 w-24 bg-neutral-200 dark:bg-neutral-800 rounded-sm"></div>
                    <div className="h-3 w-3 bg-neutral-200 dark:bg-neutral-800 rounded-sm"></div>
                    <div className="h-3 w-32 bg-neutral-200 dark:bg-neutral-800 rounded-sm"></div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                    <div className="lg:col-span-2 space-y-4">
                        <div className="w-full h-[300px] sm:h-[525px] bg-neutral-200 dark:bg-neutral-800 -mx-2 sm:mx-0 sm:rounded-md border border-neutral-200 dark:border-neutral-800"></div>

                        <div className="bg-white dark:bg-neutral-900 sm:rounded-md p-4 sm:p-6 border-y sm:border border-neutral-200 dark:border-neutral-800 space-y-4">
                            <div className="h-7 w-40 bg-neutral-200 dark:bg-neutral-800 rounded-sm"></div>
                            <div className="space-y-2">
                                <div className="h-5 w-5/6 bg-neutral-200 dark:bg-neutral-800 rounded-sm"></div>
                                <div className="h-4 w-2/3 bg-neutral-200 dark:bg-neutral-800 rounded-sm"></div>
                            </div>
                            <div className="flex gap-4 pt-2 border-t border-neutral-200 dark:border-neutral-800">
                                <div className="h-3 w-28 bg-neutral-200 dark:bg-neutral-800 rounded-sm"></div>
                                <div className="h-3 w-20 bg-neutral-200 dark:bg-neutral-800 rounded-sm"></div>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-1">
                        <div className="bg-white dark:bg-neutral-900 sm:rounded-md p-5 border border-neutral-200 dark:border-neutral-800 space-y-4">
                            <div className="flex items-start gap-3 pb-4 border-b border-neutral-200 dark:border-neutral-800">
                                <div className="w-20 h-20 rounded-full bg-neutral-200 dark:bg-neutral-800 flex-shrink-0"></div>
                                <div className="space-y-2 flex-1 pt-1">
                                    <div className="h-4 w-32 bg-neutral-200 dark:bg-neutral-800 rounded-sm"></div>
                                    <div className="h-3 w-20 bg-neutral-200 dark:bg-neutral-800 rounded-sm"></div>
                                    <div className="h-3 w-28 bg-neutral-200 dark:bg-neutral-800 rounded-sm"></div>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="h-10 w-full bg-neutral-200 dark:bg-neutral-800 rounded-md"></div>
                                <div className="h-10 w-full bg-neutral-200 dark:bg-neutral-800 rounded-md"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailSkeleton;
