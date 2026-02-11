import React from 'react';

/**
 * VerifiedBadge Component
 * Displays a blue checkmark badge for verified sellers
 * @param {boolean} isVerified - Whether the seller is verified
 * @param {string} size - Size variant: 'sm', 'md', 'lg'
 * @param {boolean} showTooltip - Whether to show tooltip on hover
 */
export const VerifiedBadge = ({ isVerified, size = 'md', showTooltip = true }) => {
    if (!isVerified) return null;

    const sizeClasses = {
        sm: 'w-4 h-4',
        md: 'w-5 h-5',
        lg: 'w-6 h-6'
    };

    return (
        <div className="inline-flex items-center relative group">
            <svg
                className={`${sizeClasses[size]} text-blue-500 flex-shrink-0`}
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-label="Doğrulanmış Satıcı"
            >
                <path d="M23,12L20.56,9.22L20.9,5.54L17.29,4.72L15.4,1.54L12,3L8.6,1.54L6.71,4.72L3.1,5.53L3.44,9.21L1,12L3.44,14.78L3.1,18.47L6.71,19.29L8.6,22.47L12,21L15.4,22.47L17.29,19.28L20.9,18.46L20.56,14.78L23,12M10,17L6,13L7.41,11.59L10,14.17L16.59,7.58L18,9L10,17Z" />
            </svg>

            {showTooltip && (
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1.5 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 shadow-lg">
                    <div className="relative">
                        Doğrulanmış Satıcı
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
                            <div className="border-4 border-transparent border-t-gray-900"></div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VerifiedBadge;
