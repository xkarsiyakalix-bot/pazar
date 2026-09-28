import React, { useMemo, useState } from 'react';

const LocationMap = ({ city, district, address }) => {
  const [loaded, setLoaded] = useState(false);

  const query = useMemo(() => {
    const parts = [address, district, city, 'Türkiye'].filter(Boolean);
    return parts.join(', ');
  }, [city, district, address]);

  const zoom = address ? 16 : district ? 14 : 12;

  if (!city && !address) {
    return null;
  }

  const embedSrc = `https://www.google.com/maps?q=${encodeURIComponent(query)}&hl=tr&z=${zoom}&output=embed`;
  const mapsHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;

  return (
    <div className="w-full rounded-lg overflow-hidden border border-gray-200 dark:border-white/5 shadow-sm relative z-0">
      <div className="relative w-full h-48 md:h-64 bg-gray-100 dark:bg-neutral-800">
        {!loaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-gray-400 dark:text-neutral-500 font-medium">Harita Yükleniyor...</span>
          </div>
        )}
        <iframe
          title={`Konum: ${query}`}
          src={embedSrc}
          className="absolute inset-0 w-full h-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
          onLoad={() => setLoaded(true)}
        />
      </div>
      <a
        href={mapsHref}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 py-2.5 px-3 text-sm font-semibold text-gray-700 dark:text-neutral-200 bg-white dark:bg-neutral-900 hover:bg-gray-50 dark:hover:bg-neutral-800 border-t border-gray-200 dark:border-white/5 cursor-pointer"
      >
        <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        Google Haritalar’da aç
      </a>
    </div>
  );
};

export default LocationMap;
