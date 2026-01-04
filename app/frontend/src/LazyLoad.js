import React, { useState } from 'react';

export const LazyImage = ({ src, alt, className, imgClassName, ...props }) => {
    const [isLoaded, setIsLoaded] = useState(false);

    return (
        <div className={`relative overflow-hidden ${className}`} {...props}>
            {!isLoaded && (
                <div className="absolute inset-0 bg-gray-200 animate-pulse z-0" />
            )}
            <img
                src={src}
                alt={alt}
                loading="lazy"
                onLoad={() => setIsLoaded(true)}
                onError={() => setIsLoaded(true)}
                className={`w-full h-full transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'} ${imgClassName || 'object-cover'} relative z-10`}
            />
        </div>
    );
};
