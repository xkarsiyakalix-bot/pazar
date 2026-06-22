import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { t } from '../translations';
import { LazyImage } from './LazyImage';
import { useAuth } from '../contexts/AuthContext';
import { getListingUrl } from '../utils/slug';
import { getOptimizedImageUrl } from '../utils/imageUtils';
import VisibilityPackagesModal from './VisibilityPackagesModal';

export const HorizontalListingCard = ({ listing, toggleFavorite, isFavorite, isOwnListing = false, compact = false, hidePrice = false, renderCustomFields = null }) => {
  const navigate = useNavigate();
  const [showVisibilityModal, setShowVisibilityModal] = useState(false);
  const { user } = useAuth();

  if (!listing) return null;

  const favorite = isFavorite ? isFavorite(listing.id) : false;

  const handleEdit = (e) => {
    e.stopPropagation();
    // Navigate to edit page with listing ID
    navigate(`/add-listing?edit=${listing.id}`);
  };

  const handleReserve = async (e) => {
    e.stopPropagation();

    // Check if already reserved (only check reserved_by since we don't use expiry)
    const isReservedInternal = listing.reserved_by;

    if (isReservedInternal) {
      // Cancel reservation - seller can cancel anytime
      if (window.confirm(`${t.productDetail.ownerDashboard.unreserveConfirm}\n\n${listing.title}`)) {
        try {
          // Use existing Supabase client
          const { supabase } = await import('../lib/supabase');

          const { data, error } = await supabase
            .from('listings')
            .update({
              reserved_by: null,
              reserved_until: null
            })
            .eq('id', listing.id)
            .select();

          if (error) {
            console.error('Supabase error:', error);
            alert('Hata: ' + error.message);
          } else {
            alert(t.productDetail.ownerDashboard.unreserveSuccess);
            window.location.reload();
          }
        } catch (error) {
          console.error('Error canceling reservation:', error);
          alert('Rezervasyonu kaldırırken hata oluştu');
        }
      }
    } else {
      // Create reservation
      if (window.confirm(`${t.productDetail.ownerDashboard.reserveConfirm}\n\n${listing.title}`)) {
        try {
          // Use existing Supabase client
          const { supabase } = await import('../lib/supabase');

          const { data, error } = await supabase
            .from('listings')
            .update({
              reserved_by: listing.user_id,
              reserved_until: new Date().toISOString()
            })
            .eq('id', listing.id)
            .select();

          console.log('Supabase update result:', { data, error });

          if (error) {
            console.error('Supabase error:', error);
            alert('Hata: ' + error.message);
          } else if (data && data.length > 0) {
            alert(t.productDetail.ownerDashboard.reserveSuccess);
            window.location.reload();
          } else {
            alert('Hata: İlan bulunamadı');
          }
        } catch (error) {
          console.error('Error creating reservation:', error);
          alert('Rezervasyon yapılırken hata oluştu');
        }
      }
    }
  };

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (window.confirm(`${t.productDetail.ownerDashboard.deleteConfirm}\n\n${listing.title}`)) {
      try {
        // Use existing Supabase client
        const { supabase } = await import('../lib/supabase');

        const { error } = await supabase
          .from('listings')
          .delete()
          .eq('id', listing.id);

        if (error) {
          console.error('Supabase error:', error);
          alert('Silme sırasında hata oluştu: ' + error.message);
        } else {
          alert(t.productDetail.ownerDashboard.deleteSuccess);
          // Redirect to profile page
          window.location.href = '/profile?tab=listings';
        }
      } catch (error) {
        console.error('Error deleting listing:', error);
      }
    }
  };

  const handleExtend = async (e) => {
    e.stopPropagation();
    if (window.confirm(t.productDetail.ownerDashboard.extendConfirm.replace('{price}', '9,99 TL'))) {
      try {
        const { purchasePromotion } = await import('../api/promotions');

        // New Logic: Update expiry_date directly by 90 days
        // If currently expired, set to now + 90 days
        // If active, add 90 days to current expiry_date
        const now = new Date();
        const currentExpiry = listing.expiry_date ? new Date(listing.expiry_date) : new Date(new Date(listing.created_at).getTime() + 365 * 24 * 60 * 60 * 1000);

        let newExpiryDate;

        if (currentExpiry < now) {
          // Already expired, start fresh 90 days from now
          newExpiryDate = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000);
        } else {
          // Still active, extend current expiry by 90 days
          newExpiryDate = new Date(currentExpiry.getTime() + 365 * 24 * 60 * 60 * 1000);
        }

        // Use purchasePromotion to record the transaction and update the listing
        await purchasePromotion(listing.id, {
          id: 'verlängerung',
          price: 9.99,
          duration: 90
        }, user.id, {
          expiry_date: newExpiryDate.toISOString(),
          status: 'active'
        });

        alert(t.productDetail.ownerDashboard.extendSuccess);
        window.location.reload();
      } catch (error) {
        console.error('Error extending listing:', error);
        alert(t.addListing.error);
      }
    }
  };

  const handleBump = (e) => {
    e.stopPropagation();
    setShowVisibilityModal(true);
  };

  const isReserved = listing?.reserved_by;
  const isVitrin = listing?.is_gallery || ['galerie', 'gallery', 'galeri', 'vitrin'].includes(listing?.package_type?.toLowerCase());
  const isExpired = listing?.created_at && (new Date() > new Date(new Date(listing.created_at).getTime() + 30 * 24 * 60 * 60 * 1000));

  return (
    <>
      <div
        className={`${
          isVitrin
            ? 'bg-purple-50/40 dark:bg-purple-900/10 border-l-4 border-purple-500 shadow-[0_0_16px_rgba(147,51,234,0.15)] rounded-lg mx-0.5 sm:mx-0'
            : 'bg-white dark:bg-neutral-800/70 border border-gray-100 dark:border-white/[0.06] hover:border-red-200 dark:hover:border-red-800/40 rounded-lg'
        } transition-all duration-300 cursor-pointer hover:shadow-xl hover:-translate-y-0.5 overflow-hidden group/horizontal flex flex-col`}
        onClick={() => navigate(getListingUrl(listing))}
      >
        <div className="flex flex-row">
          {/* Image Section */}
          <div className="w-32 sm:w-48 md:w-60 h-32 sm:h-40 md:h-48 relative group flex-shrink-0 bg-gray-100 dark:bg-neutral-900 border-r border-gray-100 dark:border-white/5 overflow-hidden">
            <img
              src={getOptimizedImageUrl(
                Array.isArray(listing?.images) && listing.images.length > 0
                  ? listing.images[0]
                  : listing?.image || 'https://via.placeholder.com/300x200?text=No+Image',
                300, 200, 'cover'
              )}
              alt={listing?.title || 'İlan Resmi'}
              className="w-full h-full object-cover transition-transform duration-500 group-hover/horizontal:scale-[1.06]"
              loading="lazy"
            />
            {/* Subtle gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
            {/* RESERVIERT Badge - always on top */}
            {isReserved && (
              <div className="absolute top-1 left-1 bg-yellow-500 text-white px-1.5 py-0.5 rounded text-[9px] font-bold shadow-sm z-30">
                REZERVE
              </div>
            )}

            {/* Package Badges */}
            {!isExpired && (
              <div className="absolute top-1 right-1 flex flex-col gap-1 items-end z-20">
                {/* Vitrin / Gallery Badge */}
                {(listing?.is_gallery || ['galerie', 'gallery', 'galeri', 'vitrin'].includes(listing?.package_type?.toLowerCase())) && (
                  <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-1.5 py-0.5 rounded text-[8px] font-black shadow-md border border-white/20 uppercase tracking-wider">
                    ⭐ VİTRİN
                  </div>
                )}

                {/* Premium / Plus Badges */}
                {listing?.package_type && !['basic', 'top', 'galerie', 'gallery', 'galeri', 'vitrin'].includes(listing.package_type.toLowerCase()) && (
                  <div className={`px-1.5 py-0.5 rounded text-[8px] font-black shadow-md border border-white/20 uppercase tracking-wider ${['premium', 'z_premium'].includes(listing.package_type.toLowerCase())
                    ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white'
                    : 'bg-neutral-800 text-white'
                    }`}>
                    {['premium', 'z_premium'].includes(listing.package_type.toLowerCase()) ? '👑 PREMIUM' :
                      listing.package_type.toLowerCase() === 'plus' ? '⭐ PLUS' :
                        listing.package_type.toUpperCase()}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Info Section */}
          <div className="flex-1 p-3 sm:p-5 flex flex-col justify-between overflow-hidden">
            <div className="space-y-1">
              <h4 className="text-sm sm:text-lg font-bold text-neutral-900 dark:text-neutral-100 line-clamp-1 group-hover/horizontal:text-red-600 dark:group-hover/horizontal:text-red-400 transition-colors">
                {listing?.title}
              </h4>
              <p className="text-[11px] sm:text-sm text-neutral-500 dark:text-neutral-400 line-clamp-1">
                {listing?.description}
              </p>
              <div className="pt-1">
                {!hidePrice && (
                  <span className={`text-sm sm:text-xl font-black ${
                    listing?.price_type === 'giveaway' || listing?.price === 0
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-red-600 dark:text-red-400'
                  }`}>
                    {listing?.price_type === 'giveaway' || listing?.price === 0
                      ? 'Ücretsiz'
                      : listing?.price
                        ? `${listing.price.toLocaleString('tr-TR')} TL`
                        : 'Görüşülür'
                    }
                  </span>
                )}
              </div>
            </div>

            {/* Location and Date */}
            <div className="flex items-center text-[10px] text-neutral-500 dark:text-neutral-400 gap-3 mt-auto pt-2">
              <span className="flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                {listing.city}
              </span>
              <span className="ml-auto flex items-center gap-2">
                {isOwnListing && <span>{listing?.views || 0} İzlenme</span>}
                <span>{new Date(listing.created_at).toLocaleDateString('tr-TR')}</span>
              </span>
            </div>

            {/* Desktop Actions - Only inside info on desktop */}
            {isOwnListing && (
              <div className="hidden sm:flex flex-wrap gap-2 mt-3 pt-3 border-t border-neutral-100 dark:border-white/5">
                <button onClick={handleEdit} className="px-3 py-1.5 text-[11px] font-bold bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 border border-neutral-200 dark:border-white/10 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-all shadow-sm">Düzenle</button>
                <button onClick={handleExtend} className="px-3 py-1.5 text-[11px] font-bold bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 border border-neutral-200 dark:border-white/10 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-all shadow-sm">Uzat</button>
                <button onClick={handleReserve} className="px-3 py-1.5 text-[11px] font-bold bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 border border-neutral-200 dark:border-white/10 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-all shadow-sm">{isReserved ? 'Rezerve Kaldır' : 'Rezerve Et'}</button>
                <button onClick={handleDelete} className="px-3 py-1.5 text-[11px] font-bold bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 border border-neutral-200 dark:border-white/10 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-all shadow-sm">Sil</button>
                <button onClick={handleBump} className="px-3 py-1.5 text-[11px] font-bold bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 border border-neutral-200 dark:border-white/10 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-all shadow-sm">Yukarı Çıkar</button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Actions - Full width scrollable row below everything */}
        {isOwnListing && (
          <div className="sm:hidden flex flex-nowrap overflow-x-auto no-scrollbar gap-1.5 px-3 pb-3 pt-2 border-t border-neutral-50 dark:border-white/5 bg-neutral-50/50 dark:bg-neutral-900/50">
            <button onClick={handleEdit} className="whitespace-nowrap flex-shrink-0 px-3 py-1.5 text-[10px] font-bold bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 border border-neutral-200 dark:border-white/10 rounded-md">Düzenle</button>
            <button onClick={handleExtend} className="whitespace-nowrap flex-shrink-0 px-3 py-1.5 text-[10px] font-bold bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 border border-neutral-200 dark:border-white/10 rounded-md">Uzat</button>
            <button onClick={handleReserve} className="whitespace-nowrap flex-shrink-0 px-3 py-1.5 text-[10px] font-bold bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 border border-neutral-200 dark:border-white/10 rounded-md">{isReserved ? 'Dur' : 'Rezerve'}</button>
            <button onClick={handleDelete} className="whitespace-nowrap flex-shrink-0 px-3 py-1.5 text-[10px) font-bold bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 border border-neutral-200 dark:border-white/10 rounded-md">Sil</button>
            <button onClick={handleBump} className="whitespace-nowrap flex-shrink-0 px-3 py-1.5 text-[10px] font-bold bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 border border-neutral-200 dark:border-white/10 rounded-md">Yukarı Çıkar</button>
          </div>
        )}
      </div>

      <VisibilityPackagesModal
        isOpen={showVisibilityModal}
        onClose={() => setShowVisibilityModal(false)}
        listing={listing}
      />
    </>
  );
};




// Listing Countdown Component

export default HorizontalListingCard;

