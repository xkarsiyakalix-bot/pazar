import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getOptimizedImageUrl } from '../utils/imageUtils';
import { t } from '../translations';

export const ListingCard = ({ listing, toggleFavorite, isFavorite, isOwnListing = false, hidePrice = false }) => {
    const navigate = useNavigate();
    const [imageLoaded, setImageLoaded] = React.useState(false);
    const favorite = isFavorite ? isFavorite(listing.id) : false;

    // Get first image from images array, fallback to placeholder
    const rawImageUrl = listing.images && listing.images.length > 0
        ? listing.images[0]
        : listing.image || 'https://via.placeholder.com/300x128?text=No+Image';

    const imageUrl = getOptimizedImageUrl(rawImageUrl, 300, 200, 'cover');

    const isReserved = listing?.reserved_by;

    // Override image for Mini- & Nebenjobs and Praktika
    const isMiniJob = listing.sub_category === 'Yarı Zamanlı & Ek İşler' || listing.sub_category === 'Staj';
    const displayImage = isMiniJob ? '/favicon.png' : imageUrl;
    const imageClasses = isMiniJob
        ? "w-full h-24 object-contain p-4 group-hover:scale-105 transition-transform duration-500"
        : "w-full h-24 object-cover group-hover:scale-105 transition-transform duration-500";

    // Determine card styles based on promotion Type
    let cardClasses = "listing-card rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer group relative hover:-translate-y-1 bg-white ";

    const pkgType = listing?.package_type?.toLowerCase();

    if (listing?.is_gallery || ['galerie', 'gallery', 'galeri', 'vitrin'].includes(pkgType)) {
        cardClasses += "border-2 border-purple-400 ring-2 ring-purple-50 shadow-[0_0_10px_rgba(147,51,234,0.15)] bg-purple-50/10 ";
    } else if (pkgType === 'premium' || pkgType === 'z_premium' || (listing.is_top && !pkgType)) {
        cardClasses += "border-2 border-amber-400 ring-2 ring-amber-50/50 bg-amber-50/5 ";
    } else if (pkgType === 'multi-bump' || pkgType === 'z_multi_bump' || listing.is_multi_bump) {
        cardClasses += "border-2 border-orange-400 ring-2 ring-orange-50/50 bg-orange-50/5 ";
    } else if (listing.is_highlighted || pkgType === 'highlight' || pkgType === 'budget') {
        cardClasses += "border border-yellow-400 bg-yellow-50/5 shadow-yellow-50 ";
    }

    return (
        <div className={cardClasses} onClick={() => navigate(`/product/${listing.id}`)}>
            <div className="relative overflow-hidden rounded-t-xl bg-gray-100 h-24" style={{ isolation: 'isolate', transform: 'translateZ(0)' }}>
                {!imageLoaded && !isMiniJob && (
                    <div className="absolute inset-0 animate-pulse bg-gray-200 flex items-center justify-center">
                        <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h14a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                )}
                <img
                    src={displayImage}
                    alt={listing.title}
                    width="300"
                    height="200"
                    loading="lazy"
                    onLoad={() => setImageLoaded(true)}
                    className={`${imageClasses} ${!isMiniJob ? (imageLoaded ? 'opacity-100' : 'opacity-0') : 'opacity-100'} transition-opacity duration-300`}
                />
                {/* RESERVIERT Badge - highest priority */}
                {isReserved && (
                    <div className="absolute top-1 left-1 bg-yellow-500 text-white px-2 py-0.5 rounded text-[9px] font-bold shadow-lg flex items-center gap-1 z-20">
                        <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                        </svg>
                        REZERVE
                    </div>
                )}
                {/* Package Badge */}
                {listing?.package_type &&
                    listing.package_type.toLowerCase() !== 'basic' &&
                    listing.package_type.toLowerCase() !== 'top' &&
                    listing.package_type.toLowerCase() !== 'galerie' &&
                    listing.package_type.toLowerCase() !== 'gallery' &&
                    listing.package_type.toLowerCase() !== 'galeri' &&
                    listing.package_type.toLowerCase() !== 'vitrin' &&
                    listing.package_type.toLowerCase() !== 'verlängerung' &&
                    listing.package_type.toLowerCase() !== 'extension' && (
                        <div className={`absolute ${isReserved ? 'top-8' : 'top-1'} left-1 px-2 py-1 rounded-md text-[10px] font-bold shadow-md border border-white/20 z-10 uppercase tracking-wider ${listing.package_type.toLowerCase() === 'premium' || listing.package_type.toLowerCase() === 'z_premium' ? 'bg-gradient-to-r from-red-600 via-red-500 to-rose-600 text-white shadow-[0_0_15px_rgba(239,68,68,0.4)]' :
                            listing.package_type.toLowerCase() === 'multi-bump' || listing.package_type.toLowerCase() === 'z_multi_bump' ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-orange-200' :
                                listing.package_type.toLowerCase() === 'plus' ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white' :
                                    'bg-gradient-to-r from-yellow-400 to-yellow-600 text-gray-900 border-yellow-200'
                            }`}>
                            {listing.package_type.toLowerCase() === 'budget' || listing.package_type.toLowerCase() === 'highlight' ? 'ÖNE ÇIKAN' :
                                listing.package_type.toLowerCase() === 'multi-bump' || listing.package_type.toLowerCase() === 'z_multi_bump' ? '⚡ YUKARI' :
                                    listing.package_type.toLowerCase() === 'premium' || listing.package_type.toLowerCase() === 'z_premium' ? '👑 PREMIUM' :
                                        listing.package_type}
                        </div>
                    )}
                {/* Vitrin Badge */}
                {(listing?.is_gallery || ['galerie', 'gallery', 'galeri', 'vitrin'].includes(listing?.package_type?.trim().toLowerCase())) && (
                    <div className={`absolute ${isReserved ? (listing.package_type && !['basic', 'top', 'galerie', 'gallery', 'galeri', 'vitrin', 'verlängerung', 'extension'].includes(listing.package_type.toLowerCase()) ? 'top-14' : 'top-8') : (listing.package_type && !['basic', 'top', 'galerie', 'gallery', 'galeri', 'vitrin', 'verlängerung', 'extension'].includes(listing.package_type.toLowerCase()) ? 'top-8' : 'top-1')} left-1 bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-1.5 py-0.5 rounded-md text-[9px] font-bold shadow-md border border-white/20 z-10 flex items-center gap-1`}>
                        <span>⭐ VİTRİN</span>
                    </div>
                )}
                {listing.is_highlighted && !listing.is_top && !listing.is_gallery && !listing.package_type && (
                    <div className={`absolute ${isReserved ? 'top-8' : 'top-1'} left-1 bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 px-1.5 py-0.5 rounded text-[9px] font-bold shadow-lg z-10`}>
                        ✨ Öne Çıkarılan
                    </div>
                )}
                {/* Commercial/PRO Badge */}
                {(listing.is_commercial || listing.is_pro) && (
                    <div className="absolute bottom-1.5 right-1.5 flex flex-col items-end gap-1">
                        {listing.is_pro && (
                            <span className="bg-red-600 text-white px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-tighter shadow-sm border border-red-500">
                                PRO
                            </span>
                        )}
                        {listing.is_commercial && (
                            <span className="bg-blue-600 text-white px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-tighter shadow-sm border border-blue-500">
                                KURUMSAL
                            </span>
                        )}
                    </div>
                )}
                {/* Favorite Button */}
                {!isOwnListing && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            if (toggleFavorite) toggleFavorite(listing.id);
                        }}
                        className="absolute top-2 right-2 w-7 h-7 bg-white/90 backdrop-blur-sm rounded-full shadow hover:bg-white hover:scale-110 transition-all duration-200 z-30 flex items-center justify-center"
                        aria-label={favorite ? 'Remove from favorites' : 'Add to favorites'}
                    >
                        {favorite ? (
                            <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                        ) : (
                            <svg className="w-4 h-4 text-gray-400 group-hover:text-red-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                        )}
                    </button>
                )}
            </div>

            <div className="p-2">
                <h3 className="text-xs font-semibold text-gray-800 mb-1.5 line-clamp-2 group-hover:text-red-600 transition-colors">
                    {listing.title}
                </h3>

                <div className="mb-1.5">
                    <span className="text-base font-bold text-gray-900">
                        {!hidePrice && listing.sub_category !== 'Eğitim / Meslek Eğitimi' && listing.sub_category !== 'İnşaat, Zanaat & Üretim' && listing.category !== 'İş İlanları' && (
                            listing.price_type === 'giveaway' || listing.price === 0
                                ? 'Ücretsiz'
                                : listing.price
                                    ? `${listing.price.toLocaleString('tr-TR')} ₺${listing.price_type === 'negotiable' ? ' ' + t.addListing.options.negotiable : ''}`
                                    : t.addListing.options.negotiable
                        )}
                    </span>
                    {listing.city && (
                        <div className="text-xs text-gray-700 mt-1 flex items-center gap-1">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            {listing.city}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
