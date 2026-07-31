import React from 'react';
import { useNavigate } from 'react-router-dom';
import { t } from '../translations';
import { LazyImage } from './LazyImage';
import { getListingUrl } from '../utils/slug';
import { getOptimizedImageUrl } from '../utils/imageUtils';

export const ListingCard = ({ listing, toggleFavorite, isFavorite, isOwnListing = false, hidePrice = false }) => {
  const navigate = useNavigate();
  const [imageLoaded, setImageLoaded] = React.useState(false);
  
  // Use isFavorite as a function or a simple boolean depending on how it's passed
  const favorite = typeof isFavorite === 'function' ? isFavorite(listing.id) : isFavorite;

  // Get first image from images array, fallback to placeholder
  const rawImageUrl = listing.images && listing.images.length > 0
    ? listing.images[0]
    : listing.image || 'https://via.placeholder.com/400x280?text=No+Image';

  const imageUrl = getOptimizedImageUrl(rawImageUrl, 400, 280, 'cover');

  const isReserved = listing?.reserved_by;

  // Override image for Mini- & Nebenjobs and Praktika
  const isMiniJob = listing.sub_category === 'Yarı Zamanlı & Ek İşler' || listing.sub_category === 'Staj';
  const displayImage = isMiniJob ? '/favicon.png' : imageUrl;
  const imageClasses = isMiniJob
    ? "w-full h-full object-contain p-6 transition-transform duration-500 group-hover:scale-105"
    : "w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]";

  // Determine card styles based on promotion type
  let cardClasses = "listing-card rounded-lg shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group relative bg-white dark:bg-neutral-800/60 dark:backdrop-blur-sm flex flex-col h-full overflow-hidden border ";

  const pkgType = listing?.package_type?.toLowerCase();
  const now = new Date();
  const promoExpiry = listing?.promotion_expiry ? new Date(listing.promotion_expiry) : null;
  const isPromoActive = !promoExpiry || promoExpiry > now;
  const isActiveVitrin = isPromoActive && (listing?.is_gallery || ['galerie', 'gallery', 'galeri', 'vitrin'].includes(pkgType));

  if (isActiveVitrin) {
    cardClasses += "border-purple-400/50 ring-2 ring-purple-200/30 dark:ring-purple-700/20 hover:border-purple-500/70 ";
  } else if (isPromoActive && (pkgType === 'premium' || pkgType === 'z_premium' || (listing.is_top && !pkgType))) {
    cardClasses += "border-red-400/50 ring-2 ring-red-200/20 dark:ring-red-700/20 hover:border-red-500/70 ";
  } else if (isPromoActive && (pkgType === 'multi-bump' || pkgType === 'z_multi_bump' || listing.is_multi_bump)) {
    cardClasses += "border-orange-400/50 ring-2 ring-orange-100/30 dark:ring-orange-700/20 hover:border-orange-500/70 ";
  } else if (isPromoActive && (listing.is_highlighted || pkgType === 'highlight' || pkgType === 'budget')) {
    cardClasses += "border-yellow-400/50 hover:border-yellow-500/70 ";
  } else {
    cardClasses += "border-gray-100 dark:border-white/[0.06] hover:border-red-200 dark:hover:border-red-800/40 ";
  }

  return (
    <div className={cardClasses} onClick={() => navigate(getListingUrl(listing), { state: { listing } })}>
      {/* ── Image Area ── */}
      <div className="relative overflow-hidden bg-gray-100 dark:bg-neutral-900 h-44" style={{ isolation: 'isolate', transform: 'translateZ(0)' }}>
        {/* Skeleton shimmer */}
        {!imageLoaded && !isMiniJob && (
          <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 dark:from-neutral-900 dark:via-neutral-800 dark:to-neutral-900 flex items-center justify-center">
            <svg className="w-10 h-10 text-gray-300 dark:text-neutral-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h0.01M6 20h14a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
        <img
          src={displayImage}
          alt={listing.title}
          width="400"
          height="280"
          loading="lazy"
          onLoad={() => setImageLoaded(true)}
          className={`absolute inset-0 w-full h-full ${imageClasses} ${!isMiniJob ? (imageLoaded ? 'opacity-100' : 'opacity-0') : 'opacity-100'} transition-opacity duration-300`}
        />

        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent pointer-events-none" />

        {/* REZERVE badge */}
        {isReserved && (
          <div className="absolute top-2 left-2 bg-yellow-500 text-white px-2 py-1 rounded-lg text-[9px] font-bold shadow-lg flex items-center gap-1 z-20">
            <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            REZERVE
          </div>
        )}

        {/* Package type badge */}
        {isPromoActive && listing?.package_type &&
          listing.package_type.toLowerCase() !== 'basic' &&
          listing.package_type.toLowerCase() !== 'top' &&
          listing.package_type.toLowerCase() !== 'galerie' &&
          listing.package_type.toLowerCase() !== 'gallery' &&
          listing.package_type.toLowerCase() !== 'galeri' &&
          listing.package_type.toLowerCase() !== 'vitrin' &&
          listing.package_type.toLowerCase() !== 'verlängerung' &&
          listing.package_type.toLowerCase() !== 'extension' && (
            <div className={`absolute ${isReserved ? 'top-10' : 'top-2'} left-2 px-2.5 py-1 rounded-lg text-[10px] font-black shadow-xl border border-white/20 z-10 uppercase tracking-tight flex items-center gap-1.5 ${
              listing.package_type.toLowerCase() === 'premium' || listing.package_type.toLowerCase() === 'z_premium'
                ? 'bg-gradient-to-br from-red-600 via-rose-500 to-amber-500 text-white'
                : listing.package_type.toLowerCase() === 'multi-bump' || listing.package_type.toLowerCase() === 'z_multi_bump'
                  ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white'
                  : listing.package_type.toLowerCase() === 'plus'
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
                    : 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-gray-900 border-yellow-200'
            }`}>
              {listing.package_type.toLowerCase() === 'premium' || listing.package_type.toLowerCase() === 'z_premium' ? (
                <><span className="text-sm">👑</span><span>PREMIUM</span></>
              ) : listing.package_type.toLowerCase() === 'budget' || listing.package_type.toLowerCase() === 'highlight'
                ? 'ÖNE ÇIKAN'
                : listing.package_type.toLowerCase() === 'multi-bump' || listing.package_type.toLowerCase() === 'z_multi_bump'
                  ? '⚡ YUKARI'
                  : listing.package_type}
            </div>
          )}

        {/* Gallery / Vitrin badge */}
        {isActiveVitrin && (
          <div className={`absolute ${
            isReserved
              ? (listing.package_type && !['basic','top','galerie','gallery','galeri','vitrin','verlängerung','extension'].includes(listing.package_type.toLowerCase()) ? 'top-16' : 'top-10')
              : (listing.package_type && !['basic','top','galerie','gallery','galeri','vitrin','verlängerung','extension'].includes(listing.package_type.toLowerCase()) ? 'top-10' : 'top-2')
          } left-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-2 py-1 rounded-lg text-[9px] font-bold shadow-md border border-white/20 z-10 flex items-center gap-1`}>
            <span>⭐ VİTRİN</span>
          </div>
        )}

        {/* Highlighted badge */}
        {isPromoActive && listing.is_highlighted && !listing.is_top && !listing.is_gallery && !listing.package_type && (
          <div className={`absolute ${isReserved ? 'top-10' : 'top-2'} left-2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 px-2 py-1 rounded-lg text-[9px] font-bold shadow-lg z-10`}>
            ✨ Öne Çıkarılan
          </div>
        )}

        {/* PRO / KURUMSAL badges */}
        {(listing.is_commercial || listing.is_pro) && (
          <div className="absolute bottom-2 right-2 flex flex-col items-end gap-1">
            {listing.is_pro && (
              <span className="bg-red-600 text-white px-1.5 py-0.5 rounded-md text-[8px] font-black uppercase tracking-tight shadow border border-red-500/40">
                PRO
              </span>
            )}
            {listing.is_commercial && (
              <span className="bg-blue-600 text-white px-1.5 py-0.5 rounded-md text-[8px] font-black uppercase tracking-tight shadow border border-blue-500/40">
                KURUMSAL
              </span>
            )}
          </div>
        )}

        {/* Favorite button */}
        {!isOwnListing && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (toggleFavorite) toggleFavorite(listing.id);
            }}
            className="absolute top-2 right-2 w-8 h-8 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white dark:hover:bg-neutral-800 hover:scale-110 transition-all duration-200 z-30 flex items-center justify-center border border-white/40 dark:border-white/10"
            aria-label={favorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            {favorite ? (
              <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            ) : (
              <svg className="w-4 h-4 text-gray-400 dark:text-neutral-500 group-hover:text-red-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            )}
          </button>
        )}
      </div>

      {/* ── Card Body ── */}
      <div className="p-3 flex flex-col justify-between flex-grow min-h-[116px]">
        <div>
          <h3 className="text-[13px] font-semibold text-gray-900 dark:text-neutral-100 mb-1.5 line-clamp-2 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors leading-snug">
            {(listing?.offer_type === 'Aranıyor' || listing?.offer_type === 'Gesuche') && (
              <span className="inline-block bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 px-1.5 py-0.5 rounded text-[10px] font-bold mr-1.5 uppercase tracking-wider align-middle border border-blue-200 dark:border-blue-800/50">
                Aranıyor
              </span>
            )}
            {listing.title}
          </h3>
          {(() => {
            const attrs = [];
            if (listing.erstzulassung) attrs.push(listing.erstzulassung);
            if (listing.kilometerstand) attrs.push(`${Math.round(listing.kilometerstand / 1000)}k km`);
            if (listing.rooms) attrs.push(`${listing.rooms} Oda`);
            if (listing.living_space) attrs.push(`${listing.living_space}m²`);
            if (listing.brand && attrs.length < 2) attrs.push(listing.brand);
            if (attrs.length === 0) return null;
            return (
              <div className="flex flex-wrap gap-1 mb-2">
                {attrs.slice(0, 2).map((attr, idx) => (
                  <span key={idx} className="text-[10px] text-gray-500 dark:text-neutral-400 bg-gray-100 dark:bg-neutral-700/60 px-1.5 py-0.5 rounded-md font-medium">
                    {attr}
                  </span>
                ))}
              </div>
            );
          })()}
        </div>

        <div className="mt-auto pt-2.5 border-t border-gray-100 dark:border-white/[0.06]">
          {/* Price */}
          {!hidePrice &&
            listing.sub_category !== 'Eğitim / Meslek Eğitimi' &&
            listing.sub_category !== 'İnşaat, Zanaat & Üretim' &&
            listing.category !== 'İş İlanları' && (
              <div className="mb-1.5">
                <span className={`text-[15px] font-black ${
                  listing.price_type === 'giveaway' || listing.price === 0
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-red-600 dark:text-red-400'
                }`}>
                  {listing.price_type === 'giveaway' || listing.price === 0
                    ? 'Ücretsiz'
                    : listing.price
                      ? `${listing.price.toLocaleString('tr-TR')} TL${listing.price_type === 'negotiable' ? ' (Pazarlıklı)' : ''}`
                      : listing.price_type === 'negotiable' ? 'Pazarlıklı' : 'Görüşülür'}
                </span>
              </div>
            )}

          {/* Location & Date */}
          <div className="flex items-center justify-between">
            {listing.city && (
              <div className="flex items-center gap-1 text-[11px] text-gray-400 dark:text-neutral-500 truncate max-w-[60%]">
                <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="truncate font-medium">{listing.city}</span>
              </div>
            )}
            <span className="text-[11px] text-gray-400 dark:text-neutral-500 flex-shrink-0">
              {listing.date || (listing.created_at ? new Date(listing.created_at).toLocaleDateString('tr-TR') : '')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingCard;
