import React from 'react';

export const LoadingSpinner = ({ size = 'medium', className = '' }) => {
    const sizeClasses = {
        small: 'h-8 w-8',
        medium: 'h-16 w-16',
        large: 'h-24 w-24'
    };

    const sz = sizeClasses[size] || sizeClasses.medium;

    return (
        <div className={`flex items-center justify-center ${className}`}>
            <div className={`relative ${sz} animate-logo-pulse`}>
                {/* Base semi-transparent logo */}
                <img
                    src="/logo_exvitrin_2026_cropped.png"
                    alt="Loading..."
                    className="w-full h-full object-contain opacity-20"
                />
                {/* Shimmering 'Light' Layer */}
                <img
                    src="/logo_exvitrin_2026_cropped.png"
                    alt=""
                    className="absolute top-0 left-0 w-full h-full object-contain animate-logo-shimmer"
                />
            </div>
        </div>
    );
};

export default LoadingSpinner;
