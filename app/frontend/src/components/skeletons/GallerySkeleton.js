import React from 'react';

/**
 * GallerySkeleton Component
 * Galeri bölümü için yükleme iskeleti
 */
const GallerySkeleton = () => {
    return (
        <div className="mb-8 animate-pulse">
            {/* Title */}
            <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>

            {/* Gallery Items - Horizontal Scroll */}
            <div className="flex gap-4 overflow-hidden">
                {Array.from({ length: 5 }).map((_, index) => (
                    <div key={index} className="flex-shrink-0 w-64">
                        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                            {/* Image */}
                            <div className="h-48 bg-gray-200"></div>

                            {/* Content */}
                            <div className="p-3 space-y-2">
                                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default GallerySkeleton;
