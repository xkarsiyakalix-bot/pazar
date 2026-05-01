import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { t } from '../translations';

// This would normally come from an API
const mockSellers = {};

export const SpecialSellers = ({ toggleFollowSeller, isSellerFollowed }) => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(5);

  // Filter only commercial sellers (Kurumsal Kullanıcı)
  const companies = Object.entries(mockSellers)
    .map(([id, seller]) => ({ ...seller, id }))
    .filter(seller => seller.sellerType === 'Kurumsal Kullanıcı');

  // Update itemsPerView based on screen size
  useEffect(() => {
    const updateItemsPerView = () => {
      if (window.innerWidth < 640) {
        setItemsPerView(2); // Mobile: 2 columns
      } else if (window.innerWidth < 1024) {
        setItemsPerView(3); // Tablet: 3 columns
      } else {
        setItemsPerView(5); // Desktop: 5 columns
      }
    };

    updateItemsPerView();
    window.addEventListener('resize', updateItemsPerView);
    return () => window.removeEventListener('resize', updateItemsPerView);
  }, []);

  const maxIndex = Math.max(0, companies.length - itemsPerView);

  const nextSlide = () => {
    setCurrentIndex(prev => Math.min(prev + 1, maxIndex));
  };

  const prevSlide = () => {
    setCurrentIndex(prev => Math.max(prev - 1, 0));
  };

  if (companies.length === 0) return null;

  return (
    <section className="mt-8 sm:mt-12 mb-8 sm:mb-12">
      <div className="flex items-center justify-between mb-4 sm:mb-6 px-4 sm:px-0">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-neutral-50 tracking-tight">Türkiye'deki Kurumsal Sayfalar</h2>
        <div className="flex items-center gap-3 sm:gap-4">
          <Link
            to="/Unternehmensseiten"
            className="text-sm text-red-600 hover:text-red-700 dark:text-red-500 dark:hover:text-red-400 font-bold transition-colors"
          >
            {t.common.all || 'Hepsini göster'}
          </Link>
          <div className="flex gap-2">
            <button
              onClick={prevSlide}
              disabled={currentIndex === 0}
              className="p-2 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-neutral-800 hover:bg-gray-50 dark:hover:bg-neutral-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
              aria-label="Previous companies"
            >
              <svg className="w-5 h-5 text-gray-600 dark:text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={nextSlide}
              disabled={currentIndex >= maxIndex}
              className="p-2 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-neutral-800 hover:bg-gray-50 dark:hover:bg-neutral-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
              aria-label="Next companies"
            >
              <svg className="w-5 h-5 text-gray-600 dark:text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className="relative overflow-hidden px-4 sm:px-0">
        <div
          className="flex transition-transform duration-500 cubic-bezier(0.4, 0, 0.2, 1) gap-4"
          style={{ transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)` }}
        >
          {companies.map((company) => (
            <Link
              key={company.id}
              to={`/seller/${company.user_number}`}
              state={{ sellerProfile: company }}
              className="w-[calc(20%-16px)] sm:w-[calc(20%-16px)] flex-shrink-0 bg-white dark:bg-neutral-900 rounded-2xl shadow-sm hover:shadow-xl dark:shadow-none dark:border dark:border-white/10 transition-all cursor-pointer group border border-gray-100 overflow-hidden block transform hover:-translate-y-1"
            >
              <div className="relative w-full h-40 bg-gray-50 dark:bg-neutral-800 flex items-center justify-center overflow-hidden">
                <img
                  src={company.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(company.name)}&background=0D8ABC&color=fff&size=400`}
                  alt={company.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>

              <div className="p-4">
                <h3 className="font-bold text-sm sm:text-base text-gray-900 dark:text-neutral-100 mb-1 line-clamp-1 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                  {company.name}
                </h3>

                {company.businessType && (
                  <p className="text-xs text-gray-500 dark:text-neutral-400 mb-2 font-medium">
                    {company.businessType}
                  </p>
                )}

                <div className="flex items-center gap-1.5 text-gray-400 dark:text-neutral-500 text-xs mb-3">
                  <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="line-clamp-1">
                    {company.address
                      ? (() => {
                        const parts = company.address.split(',');
                        const lastPart = parts[parts.length - 1].trim();
                        const match = lastPart.match(/(\d{5})\s+(.+)/);
                        return match ? `${match[1]} ${match[2]}` : lastPart;
                      })()
                      : 'Türkiye'}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-gray-50 dark:border-white/5">
                   <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      <span className="text-[10px] uppercase font-bold text-gray-400 dark:text-neutral-500 tracking-wider">
                         {company.totalListings || 0} İLAN
                      </span>
                   </div>
                   <div className="text-red-500 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7-7 7" />
                      </svg>
                   </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SpecialSellers;
