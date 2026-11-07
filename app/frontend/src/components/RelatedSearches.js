import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getRelatedSearches } from '../config/relatedSearchesData';

const RelatedSearches = ({
  query = '',
  category = '',
  subCategory = '',
  city = '',
  className = ''
}) => {
  const data = useMemo(() => {
    return getRelatedSearches({ query, category, subCategory, city });
  }, [query, category, subCategory, city]);

  if (!data.primaryPills || data.primaryPills.length === 0) {
    return null;
  }

  return (
    <section 
      aria-label="İlgili Aramalar"
      className={`mt-8 mb-6 p-4 sm:p-6 bg-white dark:bg-neutral-900 rounded-2xl sm:rounded-3xl border border-gray-100 dark:border-white/10 shadow-sm transition-colors ${className}`}
    >
      {/* Primary Related Searches */}
      <div>
        <div className="flex items-center justify-between mb-3.5">
          <h3 className="text-xs sm:text-sm font-bold text-gray-900 dark:text-neutral-100 uppercase tracking-wider flex items-center gap-2">
            <svg 
              className="w-4 h-4 text-blue-600 dark:text-blue-400" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            İlgili Aramalar
          </h3>
          <span className="text-[11px] text-gray-500 dark:text-neutral-400 hidden sm:inline">
            Popüler arama önerileri
          </span>
        </div>

        {/* Primary Pills */}
        <div className="flex flex-wrap gap-2">
          {data.primaryPills.map((pill, idx) => (
            <Link
              key={idx}
              to={pill.url}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs sm:text-sm font-medium bg-gray-50 dark:bg-neutral-800/80 text-gray-700 dark:text-neutral-200 border border-gray-200/80 dark:border-neutral-700 hover:bg-blue-50 dark:hover:bg-blue-950/40 hover:border-blue-300 dark:hover:border-blue-700 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-150 active:scale-95 shadow-2xs"
            >
              <span>{pill.name}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Secondary Pills (Sibling Categories, Brands or Cities) */}
      {data.secondaryPills && data.secondaryPills.length > 0 && (
        <div className="mt-4 pt-3.5 border-t border-gray-100 dark:border-neutral-800">
          <div className="text-[11px] font-semibold text-gray-500 dark:text-neutral-400 mb-2 uppercase tracking-wider">
            {data.detectedCategory ? `${data.detectedCategory} İle İlgili Kategoriler & Markalar:` : 'Popüler Seçenekler:'}
          </div>
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {data.secondaryPills.map((sec, idx) => (
              <Link
                key={idx}
                to={sec.url}
                className="text-xs px-2.5 py-1 rounded-lg bg-gray-100/70 dark:bg-neutral-800 text-gray-600 dark:text-neutral-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-colors"
              >
                {sec.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default RelatedSearches;

