import React from 'react';

export const LazyImage = ({ src, alt, className, imgClassName, loading = 'lazy', fetchpriority, ...props }) => {
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [error, setError] = React.useState(false);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {!isLoaded && !error && (
        <div className="absolute inset-0 bg-neutral-200 dark:bg-neutral-800 animate-pulse" />
      )}
      <img
        src={src}
        alt={alt}
        loading={loading}
        fetchpriority={fetchpriority}
        className={`${imgClassName} transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        onLoad={() => setIsLoaded(true)}
        onError={() => setError(true)}
        {...props}
      />
    </div>
  );
};

export default LazyImage;
