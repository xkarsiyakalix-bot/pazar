import React from 'react';

export const LoadingSpinner = ({ size = 'medium', className = '' }) => {
    const sizeClasses = {
        small: 'h-8 w-8',
        medium: 'h-20 w-20',
        large: 'h-32 w-32'
    };

    const sz = sizeClasses[size] || sizeClasses.medium;

    return (
        <div className={`flex items-center justify-center ${className}`}>
            <div className={`relative ${sz}`}>
                <img
                    src="/logo_exvitrin_new.png"
                    alt="Yükleniyor..."
                    className="w-full h-full object-contain animate-pulse"
                    style={{
                        animation: 'pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite'
                    }}
                />
            </div>
        </div>
    );
};

export default LoadingSpinner;
