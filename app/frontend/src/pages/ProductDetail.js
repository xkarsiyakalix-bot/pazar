import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { t } from '../translations';
import { useIsMobile } from '../hooks/useIsMobile';
import LoadingSpinner from '../components/LoadingSpinner';
import { LazyImage } from '../components/LazyImage';
import { formatLastSeen, formatPrice } from '../utils/formatUtils';
import { getListingUrl, getSellerUrl, getCategoryPath } from '../utils/slug';
import { getOptimizedImageUrl } from '../utils/imageUtils';
import ListingCountdown from '../components/ListingCountdown';
import MessageModal from '../components/MessageModal';
import GalleryInfoModal from '../components/GalleryInfoModal';
import { translateVal } from '../utils/amenityTranslations';
import { ProductSEO } from '../SEO';
import { ImageLightbox } from '../components/ImageLightbox';
import { ShareModal } from '../components/ShareModal';
import { RatingDisplay } from '../components/RatingDisplay';
import { ListingCard } from '../components/ListingCard';
import { normalizeSubcategoryName, ReportModal } from '../components.legacy';
import { generateListingNumber } from '../utils/format';
import VerifiedBadge from '../components/VerifiedBadge';
import LocationMap from '../components/LocationMap';

const DashboardContent = ({ listing, favoriteCount, handleEditDetail, handleReserveDetail, handleExtendDetail, handleDeleteDetail, promotionPackages, selectedPromotions, togglePromotionSelection, calculateTotal, handlePromotionPurchase, navigate, setPrintHideContact, t }) => {
  return (
    <>
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-3 sm:p-6 text-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6">
          <div className="space-y-1">
            <h2 className="text-base sm:text-2xl font-black flex items-center gap-1.5 sm:gap-2">
              <span className="bg-red-500 text-white p-1 rounded-lg">
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </span>
              {t.productDetail.ownerDashboard.title}
            </h2>
            <p className="text-gray-400 text-[10px] sm:text-xs font-medium uppercase tracking-wider">{t.productDetail.ownerDashboard.subtitle}</p>
          </div>

          <div className="flex flex-wrap items-center gap-4 sm:gap-8">
            <div className="text-center group cursor-help">
              <div className="text-xl sm:text-3xl font-black text-white group-hover:text-red-400 transition-colors">{(listing.views || 0).toLocaleString('tr-TR')}</div>
              <div className="text-[10px] sm:text-[10px] font-bold text-gray-400 uppercase tracking-widest">{t.productDetail.ownerDashboard.visits}</div>
            </div>
            <div className="w-px h-8 sm:h-10 bg-gray-700" />
            <div className="text-center group cursor-help">
              <div className="text-xl sm:text-3xl font-black text-white group-hover:text-red-400 transition-colors">{(favoriteCount || 0).toLocaleString('tr-TR')}</div>
              <div className="text-[10px] sm:text-[10px] font-bold text-gray-400 uppercase tracking-widest">{t.productDetail.ownerDashboard.wishlist}</div>
            </div>
            <div className="w-px h-8 sm:h-10 bg-gray-700" />
            {listing.promotion_expiry && new Date(listing.promotion_expiry) > new Date() && (
              <>
                <div className="text-center">
                  <ListingCountdown
                    expiryDate={new Date(listing.promotion_expiry)}
                    onExpire={() => { }}
                  />
                  <div className="text-[6px] sm:text-[10px] font-bold text-yellow-400 uppercase tracking-widest">{t.productDetail.ownerDashboard.activePromotion}</div>
                </div>
                <div className="w-px h-8 sm:h-10 bg-gray-700" />
              </>
            )}
            <div className="text-center">
              <ListingCountdown
                expiryDate={listing.expiry_date ? new Date(listing.expiry_date) : new Date(new Date(listing.created_at).getTime() + 365 * 24 * 60 * 60 * 1000)}
                onExpire={() => { }}
              />
              <div className="text-[10px] sm:text-[10px] font-bold text-gray-400 uppercase tracking-widest">{t.productDetail.ownerDashboard.adExpiry}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-2 sm:p-4 bg-gray-50/50 dark:bg-neutral-950/50 transition-colors duration-300">
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-4 sm:mb-6">
          <button
            onClick={handleEditDetail}
            className="flex flex-col items-center justify-center p-2 sm:p-3 bg-white dark:bg-neutral-900 rounded-lg sm:rounded-xl border border-gray-200 dark:border-white/10 hover:border-red-500 dark:hover:border-red-700 hover:shadow-lg transition-all group"
          >
            <svg className="w-5 h-5 sm:w-5 sm:h-5 text-gray-400 dark:text-neutral-500 group-hover:text-red-500 transition-colors mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            <span className="text-xs sm:text-xs font-bold text-gray-700 dark:text-neutral-300 transition-colors">{t.productDetail.ownerDashboard.edit}</span>
          </button>

          <button
            onClick={handleReserveDetail}
            className={`flex flex-col items-center justify-center p-2 sm:p-3 bg-white dark:bg-neutral-900 rounded-lg sm:rounded-xl border ${listing.reserved_by ? 'border-orange-500 bg-orange-50 dark:bg-orange-950/20' : 'border-gray-200 dark:border-white/10'} hover:border-blue-500 dark:hover:border-blue-700 hover:shadow-lg transition-all group`}
          >
            <svg className={`w-5 h-5 sm:w-5 sm:h-5 ${listing.reserved_by ? 'text-orange-500' : 'text-gray-400 dark:text-neutral-500'} group-hover:text-blue-500 transition-colors mb-1`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-xs sm:text-xs font-bold text-gray-700 dark:text-neutral-300 text-center transition-colors">{listing.reserved_by ? t.productDetail.ownerDashboard.unreserve : t.productDetail.ownerDashboard.reserve}</span>
          </button>

          <button
            onClick={handleExtendDetail}
            className="flex flex-col items-center justify-center p-2 sm:p-3 bg-white dark:bg-neutral-900 rounded-lg sm:rounded-xl border border-gray-200 dark:border-white/10 hover:border-green-500 dark:hover:border-green-700 hover:shadow-lg transition-all group relative"
          >
            <svg className="w-5 h-5 sm:w-5 sm:h-5 text-gray-400 dark:text-neutral-500 group-hover:text-green-500 transition-colors mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-0.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span className="text-xs sm:text-xs font-bold text-gray-700 dark:text-neutral-300 text-center leading-none transition-colors">{t.productDetail.ownerDashboard.extend}<br /><span className="text-[10px] text-green-600 dark:text-green-400 font-black">(9,99 TL)</span></span>
          </button>

          <button
            onClick={handleDeleteDetail}
            className="flex flex-col items-center justify-center p-2 sm:p-3 bg-white dark:bg-neutral-900 rounded-lg sm:rounded-xl border border-gray-200 dark:border-white/10 hover:border-red-600 dark:hover:border-red-800 hover:shadow-lg transition-all group"
          >
            <svg className="w-5 h-5 sm:w-5 sm:h-5 text-gray-400 dark:text-neutral-500 group-hover:text-red-600 transition-colors mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-0.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            <span className="text-xs sm:text-xs font-bold text-gray-700 dark:text-neutral-300 transition-colors">{t.productDetail.ownerDashboard.delete}</span>
          </button>

          <button
            onClick={() => {
              setPrintHideContact(true);
              setTimeout(() => window.print(), 100);
            }}
            className="flex flex-col items-center justify-center p-2 sm:p-3 bg-white dark:bg-neutral-900 rounded-lg sm:rounded-xl border border-gray-200 dark:border-white/10 hover:border-purple-500 dark:hover:border-purple-700 hover:shadow-lg transition-all group"
          >
            <svg className="w-5 h-5 sm:w-5 sm:h-5 text-gray-400 dark:text-neutral-500 group-hover:text-purple-500 transition-colors mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            <span className="text-xs sm:text-xs font-bold text-gray-700 dark:text-neutral-300 text-center leading-none transition-colors">İlanı Yazdır</span>
          </button>

          <button
            onClick={() => navigate('/my-invoices')}
            className="flex flex-col items-center justify-center p-2 sm:p-3 bg-white dark:bg-neutral-900 rounded-lg sm:rounded-xl border border-gray-200 dark:border-white/10 hover:border-red-500 dark:hover:border-red-700 hover:shadow-lg transition-all group"
          >
            <svg className="w-5 h-5 sm:w-5 sm:h-5 text-gray-400 dark:text-neutral-500 group-hover:text-red-500 transition-colors mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span className="text-xs sm:text-xs font-bold text-gray-700 dark:text-neutral-300 transition-colors">{t.productDetail.ownerDashboard.invoices}</span>
          </button>
        </div>

        <div className="bg-white dark:bg-neutral-900 rounded-lg sm:rounded-xl border border-gray-200 dark:border-white/5 overflow-hidden shadow-inner transition-colors duration-300">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-100/80 dark:bg-neutral-950/80 transition-colors duration-300">
                <tr className="text-[8px] sm:text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-neutral-400">
                  <th className="px-3 sm:px-6 py-3 w-8 sm:w-10">#</th>
                  <th className="px-3 sm:px-6 py-3">{t.productDetail.ownerDashboard.highlightTitle}</th>
                  <th className="px-3 sm:px-6 py-3 hidden sm:table-cell">{t.productDetail.ownerDashboard.effect}</th>
                  <th className="px-3 sm:px-6 py-3">{t.productDetail.ownerDashboard.duration}</th>
                  <th className="px-3 sm:px-6 py-3 text-right">{t.productDetail.ownerDashboard.price}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-white/5 text-[11px] sm:text-sm transition-colors duration-300">
                {promotionPackages.map((pkg, idx) => (
                  <tr
                    key={pkg.id}
                    onClick={() => togglePromotionSelection(pkg.id)}
                    className={`hover:bg-red-50/30 dark:hover:bg-red-900/10 transition-colors group cursor-pointer ${idx % 2 !== 0 ? 'bg-red-50/10 dark:bg-neutral-950/20' : ''} ${selectedPromotions.includes(pkg.id) ? 'bg-red-50 dark:bg-red-900/20' : ''}`}
                  >
                    <td className="px-3 sm:px-6 py-3">
                      <div className={`w-4 h-4 sm:w-5 sm:h-5 rounded border-2 flex items-center justify-center transition-all ${selectedPromotions.includes(pkg.id) ? 'bg-red-500 border-red-500' : 'border-gray-300 dark:border-white/10 bg-white dark:bg-neutral-800'}`}>
                        {selectedPromotions.includes(pkg.id) && (
                          <svg className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                    </td>
                    <td className="px-3 sm:px-6 py-3">
                      <div className="font-black text-gray-900 dark:text-neutral-50 group-hover:text-red-500 transition-colors text-xs sm:text-base">{pkg.name}</div>
                      <div className="text-[10px] text-gray-400 dark:text-neutral-500 sm:hidden mt-1 leading-relaxed transition-colors">{pkg.effect}</div>
                    </td>
                    <td className="px-3 sm:px-6 py-3 text-gray-500 dark:text-neutral-400 font-medium hidden sm:table-cell transition-colors">{pkg.effect}</td>
                    <td className="px-3 sm:px-6 py-3 font-bold text-gray-600 dark:text-neutral-300 whitespace-nowrap transition-colors">{pkg.duration === 1 ? t.productDetail.ownerDashboard.once : `${pkg.duration} Gün`}</td>
                    <td className="px-3 sm:px-6 py-3 text-right font-black text-red-600 whitespace-nowrap">{pkg.price} TL</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {selectedPromotions.length > 0 && (
            <div className="p-2 sm:p-6 bg-gray-900 text-white border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
              <div className="flex items-center gap-3 sm:gap-6">
                <div className="bg-red-500 text-white p-1 rounded-lg animate-bounce hidden sm:block">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-0.63.63-0.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div>
                  <div className="text-[7px] font-black uppercase tracking-widest text-gray-400">Seçilen: {selectedPromotions.length}</div>
                  <div className="text-base sm:text-2xl font-black">{t.productDetail.ownerDashboard.totalPrice}: {calculateTotal()} TL</div>
                </div>
              </div>
              <button
                onClick={() => handlePromotionPurchase()}
                className="w-full sm:w-auto px-4 sm:px-10 py-2 sm:py-4 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-black text-[10px] sm:text-lg shadow-xl shadow-red-600/20 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                {t.productDetail.ownerDashboard.buyNow}
                <svg className="w-3.5 h-3.5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>
          )}

          <div className="bg-gray-50 dark:bg-neutral-950 px-4 sm:px-6 py-1.5 sm:py-3 text-[6px] sm:text-[10px] font-bold text-gray-400 dark:text-neutral-500 text-right uppercase tracking-[0.1em] sm:tracking-[0.2em] transition-colors duration-300">
            {t.productDetail.ownerDashboard.vatIncluded}
          </div>
        </div>
      </div>
    </>
  );
};

// Professional Print Flyer (Sales Sign) Component - Optimized for multi-page printing
const PrintFlyer = ({ listing, sellerProfile, hideContact = false }) => {
  if (!listing) return null;

  const displayImage = Array.isArray(listing.images) && listing.images.length > 0
    ? listing.images[0]
    : (listing.image || '');

  // Current URL for QR code
  const currentUrl = window.location.href;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(currentUrl)}`;

  const renderDetailRow = (label, value) => {
    if (value === undefined || value === null || value === '') return null;
    return (
      <div className="flex justify-between items-center py-1 border-b border-gray-100 last:border-0">
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">{label}</span>
        <span className="text-sm font-black text-gray-900 text-right ml-2">{value}</span>
      </div>
    );
  };

  return (
    <div className="hidden print:block print-flyer bg-white text-gray-900 font-sans relative overflow-visible box-border border-0 p-0 max-w-[21cm] mx-auto">
      <div className="flex-grow">
        {/* Header with Title and Price - Compact */}
        <div className="flex justify-between items-start border-b-4 border-red-600 pb-4 mb-6 pt-1">
          <div className="flex-1 pr-4">
            <h1 className="text-2xl font-black uppercase tracking-tight leading-tight mb-1">
              {listing.title}
            </h1>
            <div className="text-[12px] text-gray-500 font-bold uppercase tracking-widest">
              No: {listing.id ? listing.id.toString().split('-')[0] : '---'} | {new Date().toLocaleDateString('tr-TR')}
            </div>
          </div>
          <div className="bg-red-600 text-white px-6 py-4 rounded-xl text-center shadow-lg flex-shrink-0 min-w-[150px]">
            <div className="text-[12px] font-bold uppercase tracking-widest leading-none mb-2 opacity-90">Fiyat</div>
            <div className="text-5xl font-black tabular-nums leading-none">
              {listing.category !== 'Jobs' && listing.category !== 'İş İlanları' && (
                listing.price_type === 'giveaway' || listing.price === 0
                  ? 'Ücretsiz'
                  : `${listing.price || '---'} TL`
              )}
            </div>
            {listing.price_type === 'negotiable' && <div className="text-[10px] font-black uppercase mt-1">{t.addListing?.options?.negotiable || 'Pazarlıklı'}</div>}
          </div>
        </div>

        <div className="grid grid-cols-12 gap-8">
          {/* Main Content Area */}
          <div className="col-span-12">
            <div className="grid grid-cols-12 gap-8 mb-6">
              <div className="col-span-7">
                <div className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm max-h-[400px]">
                  <img src={displayImage} alt={listing.title} className="w-full h-full object-cover" />
                </div>
              </div>
              <div className="col-span-5 flex flex-col gap-4">
                {/* Kontakt Section */}
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                  <h3 className="text-sm font-black uppercase tracking-tight mb-3 flex items-center gap-2">
                    <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    {t.common?.contact || 'İletişim'}
                  </h3>
                  <div className="space-y-2.5">
                    <div>
                      <div className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">{t.productDetail?.seller || 'Satıcı'}</div>
                      <div className="text-sm font-black truncate">{listing.contact_name || sellerProfile?.username || sellerProfile?.full_name || listing.sellerName || t.common?.privateSeller}</div>
                    </div>

                    {!hideContact && (
                      <div>
                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{t.common?.phone || 'Telefon'}</div>
                        <div className="text-lg font-black text-red-600">
                          {listing.show_phone_number && (listing.contact_phone || sellerProfile?.phone) ? (listing.contact_phone || sellerProfile?.phone) : (t.common?.notSpecified || 'Belirtilmemiş')}
                        </div>
                      </div>
                    )}

                    <div>
                      <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{t.common?.location || 'Konum'}</div>
                      <div className="text-[11px] font-bold leading-tight">
                        {listing.show_location && listing.address && <div className="text-gray-900 line-clamp-1">{listing.address}</div>}
                        <div className="text-gray-500 line-clamp-1">{listing.district ? listing.district + ', ' : ''}{listing.city || ''}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* QR Code Section */}
                {!hideContact && (
                  <div className="bg-white p-4 rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-2 text-center">
                    <div className="text-[8px] font-bold text-gray-400 uppercase tracking-widest mb-1">Detaylı Bilgi İçin Tara</div>
                    <div className="w-20 h-20 bg-gray-50 rounded-lg flex items-center justify-center p-1">
                      <img src={qrCodeUrl} alt="QR Code" className="w-full h-full" />
                    </div>
                    <div className="text-[8px] font-black text-red-600 uppercase">exvitrin.com</div>
                  </div>
                )}
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-lg font-black uppercase tracking-tight border-b border-gray-100 pb-1 mb-2">
                {t.productDetail?.description || 'Açıklama'}
              </h2>



              <div className="text-[13px] text-gray-700 whitespace-pre-wrap leading-relaxed">
                {listing.description}
              </div>
            </div>

            {/* Technical Details Grid */}
            <div className="mb-6">
              <h2 className="text-lg font-black uppercase tracking-tight border-b border-gray-100 pb-1 mb-3">
                {t.productDetail?.details || 'Detaylar'}
              </h2>
              <div className="grid grid-cols-2 gap-x-12 gap-y-1">
                {/* Common Fields */}
                {renderDetailRow(t.productDetail?.condition || 'Durum', listing.condition)}
                {renderDetailRow(t.addListing?.brand || 'Marka', listing.marke || listing.car_brand || listing.brand || listing.carBrand)}
                {renderDetailRow(t.productDetail?.model || 'Model', listing.modell || listing.car_model || listing.carModel)}

                {/* Car Specific */}
                {renderDetailRow(t.productDetail?.mileage || 'Kilometre', (listing.kilometerstand || listing.kilometer || listing.kilometerStand) ? `${(listing.kilometerstand || listing.kilometer || listing.kilometerStand).toLocaleString('tr-TR')} km` : null)}
                {renderDetailRow(t.productDetail?.firstRegistration || 'İlk Kayıt', listing.erstzulassung || listing.bj)}
                {renderDetailRow(t.productDetail?.fuelType || 'Yakıt Türü', listing.kraftstoff || listing.fuel_type)}
                {renderDetailRow(t.productDetail?.power || 'Güç', (listing.leistung || listing.power) ? `${listing.leistung || listing.power} PS` : null)}
                {renderDetailRow(t.productDetail?.transmission || 'Vites', listing.getriebe)}
                {renderDetailRow(t.productDetail?.exteriorColor || 'Dış Renk', listing.exterior_color)}
                {renderDetailRow(t.productDetail?.interiorMaterial || 'İç Donanım', listing.interior_material)}
                {renderDetailRow(t.productDetail?.huUntil || 'Muayene', listing.hu)}

                {/* Real Estate Specific */}
                {renderDetailRow(t.productDetail?.propertyType || 'Emlak Tipi', listing.wohnungstyp || listing.haustyp || listing.objektart)}
                {renderDetailRow(t.productDetail?.livingSpace || 'Metrekare', listing.living_space ? `${listing.living_space} m²` : null)}
                {renderDetailRow(t.productDetail?.rooms || 'Oda Sayısı', listing.rooms)}
                {renderDetailRow(t.productDetail?.floor || 'Kat', listing.floor)}
                {renderDetailRow(t.productDetail?.constructionYear || 'Yapım Yılı', listing.construction_year)}
                {renderDetailRow(t.productDetail?.plotArea || 'Arazi Alanı', listing.plot_area ? `${listing.plot_area} m²` : null)}
                {renderDetailRow(t.productDetail?.availableFrom || 'Uygunluk', listing.available_from)}

                {/* Pet Specific */}
                {renderDetailRow(t.productDetail?.art || 'Tür', listing.katzen_art || listing.dog_art || listing.pet_art || listing.art)}
                {renderDetailRow(t.productDetail?.age || 'Yaş', listing.katzen_alter || listing.pet_age || listing.alter)}
                {renderDetailRow(t.productDetail?.vaccinatedAndChipped || 'Aşı/Çip', listing.katzen_geimpft || listing.vaccinated)}
                {renderDetailRow(t.productDetail?.officialPermission || 'İzin', listing.katzen_erlaubnis || listing.permission)}

                {/* Clothes Specific */}
                {renderDetailRow(t.addListing?.size || 'Beden', listing.size || listing.baby_kinderkleidung_size || listing.baby_kinderschuhe_size || listing.damenbekleidung_size)}
                {renderDetailRow(t.addListing?.color || 'Renk', listing.color || listing.baby_kinderkleidung_color || listing.baby_kinderschuhe_color || listing.damenbekleidung_color)}
              </div>
            </div>

            {/* Amenities & Features */}
            {(listing.car_amenities?.length > 0 || listing.amenities?.length > 0 || listing.general_features?.length > 0) && (
              <div className="mb-6">
                <h2 className="text-lg font-black uppercase tracking-tight border-b border-gray-100 pb-1 mb-3">
                  {(t.productDetail?.amenities || 'Donanımlar')} & {(t.productDetail?.features || 'Özellikler')}
                </h2>
                <div className="flex flex-wrap gap-x-6 gap-y-2">
                  {[...(listing.car_amenities || []), ...(listing.amenities || []), ...(listing.general_features || [])].map((item, i) => (
                    <div key={`feat-${i}`} className="flex items-center gap-1.5 text-[11px] font-bold text-gray-700">
                      <svg className="w-3.5 h-3.5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Internal Branding */}
            <div className="border-t border-gray-100 pt-3 flex justify-between items-center text-gray-300 font-bold uppercase tracking-widest text-[8px] w-full mt-4">
              <div className="flex items-center gap-1">
                <span className="text-red-600 text-[10px] font-black">ExVitrin</span>
                <span>{t.common?.onlineMarketplace || 'Online Pazaryeri'}</span>
              </div>
              <div>www.exvitrin.com</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tear-off Tabs (Kesilecek İletişim Bilgileri) */}
      {!hideContact && listing.show_phone_number && (listing.contact_phone || sellerProfile?.phone) && (
        <div className="pt-8 border-t-2 border-dashed border-gray-300 relative flex justify-between min-h-[100px] mb-2">
          {/* Dikey Kesme Çizgileri */}
          <div className="absolute top-0 left-0 right-0 bottom-0 flex justify-between pointer-events-none">
            {[...Array(11)].map((_, i) => (
              <div key={`split-${i}`} className="border-l-2 border-dashed border-gray-200 h-full"></div>
            ))}
          </div>

          {[...Array(10)].map((_, i) => (
            <div key={`tab-${i}`} className="flex-1 flex flex-col items-center justify-center py-2 z-10 overflow-hidden">
              <div className="[writing-mode:vertical-rl] rotate-180 text-base font-black text-gray-900 whitespace-nowrap tracking-tight">
                {listing.contact_phone || sellerProfile?.phone}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export const ProductDetail = ({ addToCart, toggleFavorite, isFavorite, toggleFollowSeller, isSellerFollowed, id: propId, slug: propSlug }) => {
  const params = useParams();
  const routeId = propId || params.id;
  const slug = propSlug || params.slug || params['*'];
  const navigate = useNavigate();
  const [printHideContact, setPrintHideContact] = useState(false);
  const thumbnailScrollRef = useRef(null);

  const scrollThumbnails = (direction) => {
    if (thumbnailScrollRef.current) {
      const scrollAmount = 200; // Scroll by roughly 2.5 thumbnails
      thumbnailScrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  // Extract potential ID from slug if it exists (pattern: title-slug_ID or title-slug-ID)
  // If no ID-like structure is found at the end, 'id' will be null or the whole slug
  const idFromSlug = slug ? (slug.match(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i) || [])[0] : null;
  const id = idFromSlug || routeId;

  // Cache Keys
  const CACHE_KEY = `listing_detail_${id || slug}`;

  // Load from Cache Helper
  const getCachedData = () => {
    try {
      const saved = sessionStorage.getItem(CACHE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      console.error('Error parsing listing cache:', e);
      return null;
    }
  };

  const cachedData = getCachedData();

  // ALL HOOKS MUST BE CALLED BEFORE ANY CONDITIONAL RETURNS
  // State for listing data - Init from Cache
  const [listing, setListing] = useState(cachedData?.listing || null);
  const [loading, setLoading] = useState(!cachedData?.listing);
  const [error, setError] = useState(null);

  // State for seller profile - Init from Cache  
  const [sellerProfile, setSellerProfile] = useState(cachedData?.sellerProfile || null);
  const [sellerLoading, setSellerLoading] = useState(!cachedData?.sellerProfile);

  const [activeImage, setActiveImage] = useState(0);
  const galleryRef = useRef(null);
  const targetImageRef = useRef(null);
  const [showPhone, setShowPhone] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [currentStock, setCurrentStock] = useState(1);
  const [showContactForm, setShowContactForm] = useState(false);
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [showLegal, setShowLegal] = useState(false);
  const [showLightbox, setShowLightbox] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const [favoriteCount, setFavoriteCount] = useState(0);

  // Reservation states
  const [showReservationModal, setShowReservationModal] = useState(false);
  const [reservationLoading, setReservationLoading] = useState(false);

  // Report modal states
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [reportDescription, setReportDescription] = useState('');
  const [reservation, setReservation] = useState(cachedData?.reservation || null);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  // Related Listings - Init from Cache
  const [sellerRecentListings, setSellerRecentListings] = useState(cachedData?.sellerRecentListings || []);
  const [categoryListings, setCategoryListings] = useState(cachedData?.categoryListings || []);
  const [sellerRating, setSellerRating] = useState(cachedData?.sellerRating || null);
  const [sellerRatings, setSellerRatings] = useState(cachedData?.sellerRatings || []);
  const [selectedPromotions, setSelectedPromotions] = useState([]);
  const [showMobileStats, setShowMobileStats] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const { user } = useAuth();
  const isMobile = useIsMobile();

  const promotionPackages = [
    { id: 'bump', name: 'Yukarı Çıkar', price: '9,99', duration: 1, durationLabel: 'bir kerelik', effect: 'Yeni dikkat çekin! İlanınız yeni bir ilan gibi görünecek.' },
    { id: 'highlight', name: 'Öne Çıkan', price: '79,99', duration: 7, durationLabel: '7 Gün', effect: '2 kata kadar daha fazla görünürlük! İlanınız renkli olarak vurgulanacak.' },
    { id: 'multi-bump', name: 'Tekrarlı Yukarı Çıkarma', price: '99,99', duration: 7, durationLabel: '7 Gün', effect: '5 kata kadar daha fazla görünürlük! Bir hafta boyunca ilanınız her gün yukarı çıkarılacak.' },
    { id: 'z_premium', name: 'Premium', price: '129,99', duration: 7, durationLabel: '7 Gün', effect: '10 kata kadar daha fazla görünürlük! İlanınız listenin en başında yer alacak!' },
    { id: 'galerie', name: 'Vitrin', price: '199,99', duration: 10, durationLabel: '10 Gün', effect: '15 kata kadar daha fazla görünürlük! İlanınız ana sayfada da görünecek!' },
  ];

  // Fetch listing from Supabase
  const isOwnListing = user && listing && user.id === listing.user_id;

  // Save to Cache whenever critical data changes
  useEffect(() => {
    if (listing) {
      const dataToCache = {
        listing,
        sellerProfile,
        sellerRecentListings,
        categoryListings,
        sellerRating,
        sellerRatings,
        reservation
      };
      try {
        sessionStorage.setItem(CACHE_KEY, JSON.stringify(dataToCache));
      } catch (e) {
        console.warn('Could not save data to cache:', e);
      }
    }
  }, [listing, sellerProfile, sellerRecentListings, categoryListings, sellerRating, sellerRatings, reservation, CACHE_KEY]);

  useEffect(() => {
    // Check if we already have the correct listing data loaded (e.g. from cache)
    // to prevent unnecessary loading state (flash effect)
    const hasCorrectData = listing && (
      (id && listing.id === id) ||
      (slug && listing.slug === slug)
    );

    if (!hasCorrectData) {
      // Reset state immediately only if we don't have the correct data
      setListing(null);
      setLoading(true);
      setError(null);
      setActiveImage(0);
      setSellerProfile(null);
    }

    const loadListing = async () => {
      try {
        const { fetchListingById, fetchListingBySlug } = await import('../api/listings');

        let data = null;
        if (id) {
          data = await fetchListingById(id);
        }

        // If not found by ID, try fetching by slug
        if (!data && slug) {
          data = await fetchListingBySlug(slug);
        }
        console.log('Fetched listing:', data);

        // Demo enhancement for VW Käfer listing (98fd3675-0163-4c93-9a81-318bedc7c31a)
        if (data && data.id === '98fd3675-0163-4c93-9a81-318bedc7c31a') {
          data.kilometerstand = 85000;
          data.erstzulassung = '07/1970';
          data.kraftstoff = 'Benzin';
          data.leistung = 44;
          data.getriebe = 'Manuel';
          data.car_brand = 'Volkswagen';
          data.car_model = 'Käfer';
          data.hubraum = 1493;
          data.fahrzeugtyp = 'Sedan';
          data.exterior_color = 'Helleres Beigegrau';
          data.unfallfrei = true;
          data.scheckheftgepflegt = true;
          data.nichtraucher_fahrzeug = true;
          data.car_amenities = ['H-Zulassung', 'Radio', 'Originalzustand'];

          // Match user's specific request for top info
          data.created_at = new Date().toISOString();
          data.listing_number = "1154";
          data.postal_code = '48653';
          data.city = "Coesfeld";
          data.address = "Alter Kirchplatz 5";
          data.views = 1;
          data.versand_art = "Sadece Elden Teslim";
        }

        // Demo enhancement for Mercedes A200 listing (b707bb19-ac7b-45df-a5a8-cbd8f25d9461)
        if (data && data.id === 'b707bb19-ac7b-45df-a5a8-cbd8f25d9461') {
          data.kilometerstand = 24500;
          data.erstzulassung = '06/2021';
          data.kraftstoff = 'Benzin';
          data.leistung = 163;
          data.getriebe = 'Otomatik';
          data.car_brand = 'Mercedes Benz';
          data.car_model = 'A 200';
          data.hubraum = 1332;
          data.fahrzeugtyp = 'Sedan';
          data.exterior_color = 'Kosmosschwarz Metallic';
          data.unfallfrei = true;
          data.scheckheftgepflegt = true;
          data.nichtraucher_fahrzeug = true;
          data.car_amenities = ['AMG-Line', 'Night-Paket', 'LED High Performance', 'Park-Assistent', 'MBUX Multimediasystem'];

          // Match top info
          data.created_at = "2024-03-15T10:00:00.000Z";
          data.listing_number = "1018";
          data.postal_code = '48653';
          data.city = "Coesfeld";
          data.views = 6;
          data.versand_art = "Kargo Mümkün";
        }

        // Check for expiry (Use expiry_date or default to 90 days)
        if (data && (data.expiry_date || data.created_at)) {
          const expiryDate = data.expiry_date
            ? new Date(data.expiry_date)
            : new Date(new Date(data.created_at).getTime() + 365 * 24 * 60 * 60 * 1000);

          const isExpired = new Date() > expiryDate;
          const isOwner = user && user.id === data.user_id;

          if (isExpired && !isOwner) {
            setError('Bu ilan mevcut değil.');
            setLoading(false);
            return;
          }
        }

        // Fetch seller profile immediately to prevent flicker
        if (data?.user_id) {
          try {
            const { fetchUserProfile } = await import('../api/profile');
            const profile = await fetchUserProfile(data.user_id);
            setSellerProfile(profile);
          } catch (profileErr) {
            console.error('Error loading seller profile during listing load:', profileErr);
          }
        }

        setListing(data);
        setCurrentStock(data?.stock || 1); // Update currentStock once listing data is fetched
      } catch (err) {
        console.error('Error loading listing:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id || slug) {
      loadListing();
    }
  }, [id, slug, user?.id]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id, slug]);

  // Sync gallery scroll with activeImage state
  useEffect(() => {
    if (galleryRef.current) {
      const width = galleryRef.current.clientWidth;
      if (width > 0) {
        galleryRef.current.scrollTo({
          left: activeImage * width,
          behavior: 'smooth'
        });
      }
    }
  }, [activeImage]);

  const handleThumbnailClick = (index) => {
    targetImageRef.current = index;
    setActiveImage(index);
  };

  // Handle scroll events to update activeImage index
  const handleGalleryScroll = (e) => {
    if (isMobile) {
      const scrollLeft = e.target.scrollLeft;
      const width = e.target.clientWidth;
      if (width <= 0) return;

      const newIndex = Math.round(scrollLeft / width);

      // If we are currently moving towards a target (programmatically from thumbnail click), 
      // only unlock when we reach that target index.
      if (targetImageRef.current !== null) {
        if (newIndex === targetImageRef.current) {
          targetImageRef.current = null;
        }
        return;
      }

      if (newIndex !== activeImage) {
        setActiveImage(newIndex);
      }
    }
  };

  // Auto-fill contact form with user profile data
  useEffect(() => {
    const loadUserProfile = async () => {
      if (user) {
        try {
          const { fetchUserProfile } = await import('../api/profile');
          const profile = await fetchUserProfile(user.id);
          if (profile) {
            setContactName(profile.username || profile.full_name || '');
            setContactPhone(profile.phone || '');
          }
        } catch (error) {
          console.error('Error loading user profile for contact form:', error);
        }
      }
    };

    loadUserProfile();
  }, [user]);

  // Track user activity for personalized recommendations
  useEffect(() => {
    if (listing) {
      // Track viewed listing
      const viewedListings = JSON.parse(localStorage.getItem('viewedListings') || '[]');
      if (!viewedListings.includes(listing.id)) {
        viewedListings.push(listing.id);
        // Keep only last 50 viewed listings
        if (viewedListings.length > 50) {
          viewedListings.shift();
        }
        try {
          localStorage.setItem('viewedListings', JSON.stringify(viewedListings));
        } catch (e) {
          console.warn('Could not save viewed listings to local storage:', e);
        }
      }

      // Track viewed categories
      const viewedCategories = JSON.parse(localStorage.getItem('viewedCategories') || '[]');
      if (!viewedCategories.includes(listing.category)) {
        viewedCategories.push(listing.category);
        try {
          localStorage.setItem('viewedCategories', JSON.stringify(viewedCategories));
        } catch (e) {
          console.warn('Could not save viewed categories to local storage:', e);
        }
      }
      if (listing.sub_category && !viewedCategories.includes(listing.sub_category)) {
        viewedCategories.push(listing.sub_category);
        try {
          localStorage.setItem('viewedCategories', JSON.stringify(viewedCategories));
        } catch (e) {
          console.warn('Could not save viewed categories to local storage:', e);
        }
      }
    }
  }, [listing]);

  // Load seller rating
  useEffect(() => {
    if (listing?.user_id) {
      const loadSellerRating = async () => {
        try {
          const { getUserRating, getRatings } = await import('../api/ratings');
          const rating = await getUserRating(listing.user_id);
          setSellerRating(rating);

          // Also fetch the list of ratings
          const ratingsList = await getRatings(listing.user_id);
          setSellerRatings(ratingsList || []);
        } catch (error) {
          console.error('Error loading seller rating:', error);
        }
      };

      loadSellerRating();
    }
  }, [listing]);

  // Load seller's recent 3 listings
  useEffect(() => {
    if (listing?.user_id) {
      const loadSellerListings = async () => {
        try {
          const { supabase } = await import('../lib/supabase');
          const { data, error } = await supabase
            .from('listings')
            .select('*')
            .eq('user_id', listing.user_id)
            .neq('id', listing.id)
            .order('created_at', { ascending: false })
            .limit(3);

          if (error) throw error;
          setSellerRecentListings(data || []);
        } catch (error) {
          console.error('Error loading seller listings:', error);
        }
      };

      loadSellerListings();
    }
  }, [listing]);

  // Load 10 category-related listings
  useEffect(() => {
    if (listing?.id) {
      const loadCategoryListings = async () => {
        try {
          const { fetchListings } = await import('../api/listings');

          // Determine search parameters
          const mainCat = listing.category;
          const subCat = listing.sub_category;

          // Fetch from both category and subcategory for better coverage
          const [catData, subCatData] = await Promise.all([
            fetchListings({ category: mainCat }, { count: false }).catch(() => []),
            subCat ? fetchListings({ subCategory: subCat }, { count: false }).catch(() => []) : Promise.resolve([])
          ]);

          let combinedData = [...(catData || []), ...(subCatData || [])];

          // STAGE 2: Broad category fallback
          if (combinedData.length <= 1 && (mainCat === 'Otomobiller' || mainCat?.includes('Otomobil'))) {
            const autoData = await fetchListings({ category: 'Otomobil, Bisiklet & Tekne' }, { count: false }).catch(() => []);
            combinedData = [...combinedData, ...(autoData || [])];
          }

          // STAGE 3: Final fallback to general listings
          if (combinedData.length <= 1) {
            const latestData = await fetchListings({}, { count: false }).catch(() => []);
            combinedData = [...combinedData, ...(latestData || [])];
          }

          // Filter out duplicates and current listing
          const seenIds = new Set();
          const uniqueResults = combinedData.filter(item => {
            if (!item || seenIds.has(item.id)) return false;
            seenIds.add(item.id);
            return item.id !== listing.id;
          });

          // Mix with priority for other sellers
          const otherSellersListings = uniqueResults.filter(l => l.user_id !== listing.user_id);
          const sameSellerListings = uniqueResults.filter(l => l.user_id === listing.user_id);
          const pool = [...otherSellersListings, ...sameSellerListings];

          const randomized = pool
            .slice(0, 20)
            .sort(() => 0.5 - Math.random())
            .slice(0, 10);

          setCategoryListings(randomized);
        } catch (error) {
          console.error('Error loading category listings:', error);
        }
      };

      loadCategoryListings();
    }
  }, [listing?.id, listing?.category, listing?.sub_category]);

  // Fetch favorite count
  useEffect(() => {
    const fetchFavoriteCount = async () => {
      if (!id) return;

      try {
        const { favoritesApi } = await import('../api/favorites');
        const count = await favoritesApi.getFavoriteCount(id);
        setFavoriteCount(count);
      } catch (error) {
        console.error('Error fetching favorite count:', error);
      }
    };

    fetchFavoriteCount();
  }, [id]);


  // Increment view count (with 3 second delay to avoid counting quick bounces)
  useEffect(() => {
    if (listing && listing.id && (!user || user.id !== listing.user_id)) {
      const incrementView = async () => {
        try {
          const { incrementListingView } = await import('../api/views');
          await incrementListingView(listing.id);
        } catch (error) {
          console.error('Error incrementing view:', error);
        }
      };

      // Delay to avoid counting quick bounces
      const timer = setTimeout(incrementView, 3000); // 3 seconds

      return () => clearTimeout(timer);
    }
  }, [listing?.id]);

  // NOW conditional returns AFTER all hooks
  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-neutral-950 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="medium" className="mb-4" />
        </div>
      </div>
    );
  }

  // Show error state
  if (error || !listing) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-neutral-950 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-neutral-50 mb-2">İlan bulunamadı</h2>
          <p className="text-gray-600 dark:text-neutral-400 mb-4">{error || 'Bu ilan mevcut değil.'}</p>
          <Link
            to="/"
            className="inline-block px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            {t.common.backToHome}
          </Link>
        </div>
      </div>
    );
  }

  // Use seller profile from Supabase or fallback to default
  // Use seller profile from Supabase or fallback to listing data if joined, otherwise default
  const seller = sellerProfile || {
    id: listing?.user_id,
    full_name: listing?.profiles?.username || listing?.profiles?.full_name || t.productDetail.unknownSeller,
    avatar_url: listing?.profiles?.avatar_url || null,
    store_logo: listing?.profiles?.store_logo || null,
    created_at: listing?.profiles?.created_at || new Date().toISOString(),
    is_pro: listing?.profiles?.is_pro,
    is_commercial: listing?.profiles?.is_commercial,
    subscription_tier: listing?.profiles?.subscription_tier,
    user_number: listing?.profiles?.user_number,
    last_seen: listing?.profiles?.last_seen,
    seller_type: listing?.profiles?.seller_type,
    store_slug: listing?.profiles?.store_slug,
    subscription_expiry: listing?.profiles?.subscription_expiry
  };

  // Pre-calculate seller path to avoid redundant logic in JSX
  const getSellerPath = () => {
    return getSellerUrl(seller);
  };
  const sellerPath = getSellerPath();

  // Calculate actual seller listing count
  // TODO: Fetch actual count from Supabase when needed
  const sellerListingsCount = 0;

  // NOW conditional returns AFTER all hooks
  const sellerId = listing?.sellerId;

  const handleModalSubmit = async (data) => {
    try {
      const { sendMessage } = await import('../api/messages');
      // listing.user_id is the seller's ID
      await sendMessage(listing.user_id, data.message, listing.id);
      alert(t.sellerProfile.messageSuccess);
      setShowMessageModal(false);
    } catch (error) {
      console.error('Error sending message:', error);
      alert(t.sellerProfile.messageError);
    }
  };
  const favorite = isFavorite ? isFavorite(listing.id) : false;

  const handleShare = () => {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({
        title: listing.title,
        text: listing.description,
        url: url,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(url).then(() => {
        alert('Bağlantı panoya kopyalandı!');
      });
    }
  };

  const defaultDescription = 'Bu ürün çok iyi durumdadır. Diğer detaylar talep üzerine verilebilir. Elden teslim tercih edilir, ek ücret karşılığında kargo mümkündür.';
  const description = listing.description || defaultDescription;

  const activeSinceDisplay = seller.created_at
    ? new Date(seller.created_at).toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' })
    : '-';
  const isCommercial = seller.is_pro || seller.is_commercial || seller.seller_type === 'Kurumsal Kullanıcı' || (seller && seller.seller_type === 'commercial') || sellerProfile?.seller_type === 'Kurumsal Kullanıcı';
  const sellerTypeLabel = isCommercial ? t.addListing.commercial : t.addListing.private;

  const handleAddToCart = () => {
    if (quantity > currentStock) {
      alert(`Sadece ${currentStock} adet kaldı.`);
      return;
    }
    if (addToCart) {
      addToCart({ ...listing, quantity });
      setCurrentStock(prev => prev - quantity);
      setQuantity(1); // Reset quantity to 1
      alert(`${quantity}x ${listing.title} sepete eklendi.`);
    }
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      alert(t.sellerProfile.loginToMessage);
      return;
    }

    try {
      const { sendMessage } = await import('../api/messages');
      await sendMessage(
        listing.user_id,
        contactMessage,
        listing.id,
        contactPhone
      );

      alert(t.sellerProfile.messageSuccess);
      setContactMessage('');
      setShowContactForm(false);
    } catch (error) {
      console.error('Error sending message:', error);
      alert(t.sellerProfile.messageError);
    }
  };

  const handleSendMessage = (e) => {
    const handleModalSubmit = async (data) => {
      try {
        const { sendMessage } = await import('../api/messages');
        await sendMessage(listing.user_id, data.message, listing.id);
        alert('Mesaj başarıyla gönderildi!');
        setShowMessageModal(false);
      } catch (error) {
        console.error('Error sending message:', error);
        alert('Mesaj gönderilirken hata oluştu. Lütfen tekrar deneyin.');
      }
    };
    setContactPhone('');
    setContactMessage('');
  };

  const handleReportSubmit = async () => {
    if (!reportReason) {
      alert(t.productDetail.pleaseChoose);
      return;
    }

    try {
      const { reportListing } = await import('../api/reports');
      await reportListing(listing.id, reportReason, reportDescription);
      alert('İlan başarıyla bildirildi. Teşekkürler!');
      setShowReportModal(false);
      setReportReason('');
      setReportDescription('');
    } catch (error) {
      console.error('Error reporting listing:', error);
      if (error.message.includes('angemeldet')) {
        alert(error.message);
      } else {
        alert('İlan bildirilirken hata oluştu');
      }
    }
  };

  // Owner Dashboard Handlers
  const handleEditDetail = () => {
    navigate(`/add-listing?edit=${listing.id}`);
  };

  const handleReserveDetail = async () => {
    const isReservedInternal = listing.reserved_by;
    const confirmMsg = isReservedInternal
      ? `Rezervasyonu kaldır:\n\n${listing.title}`
      : `Ürünü rezerve et:\n\n${listing.title}\n\nRezervasyonu istediğiniz zaman kaldırabilirsiniz.`;

    if (window.confirm(confirmMsg)) {
      try {
        const { supabase } = await import('../lib/supabase');
        const { data, error } = await supabase
          .from('listings')
          .update({
            reserved_by: isReservedInternal ? null : user.id,
            reserved_until: isReservedInternal ? null : new Date().toISOString()
          })
          .eq('id', listing.id)
          .select();

        if (error) throw error;
        alert(isReservedInternal ? 'Rezervasyon kaldırıldı!' : 'Ürün rezerve edildi!');
        window.location.reload();
      } catch (error) {
        console.error('Error toggling reservation:', error);
        alert('Rezervasyonda hata oluştu');
      }
    }
  };

  const handleExtendDetail = async () => {
    // Note: Price updated to 9,99 for 90 days
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
          price: 9.99, // Adjusted price for longer duration
          duration: 90
        }, user.id, {
          expiry_date: newExpiryDate.toISOString(),
          status: 'active' // Ensure it's reactive if it was expired
        });

        alert('İlanınız başarıyla 90 gün uzatıldı!');
        window.location.reload();
      } catch (error) {
        console.error('Error extending listing:', error);
        alert('İlan uzatılırken hata oluştu');
      }
    }
  };

  const handleDeleteDetail = async () => {
    if (window.confirm(t.productDetail.deleteConfirm.replace('{title}', listing.title))) {
      try {
        const { supabase } = await import('../lib/supabase');
        const { error } = await supabase
          .from('listings')
          .delete()
          .eq('id', listing.id);

        if (error) throw error;
        alert('İlan başarıyla silindi!');
        navigate('/profile?tab=listings');
      } catch (error) {
        console.error('Error deleting listing:', error);
        alert('İlan silinirken hata oluştu');
      }
    }
  };

  const handlePromotionPurchase = async (pkg) => {
    const packagesToPurchase = pkg ? [pkg] : selectedPromotions.map(id => promotionPackages.find(p => p.id === id));

    if (packagesToPurchase.length === 0) return;

    const totalStr = packagesToPurchase.reduce((acc, p) => acc + parseFloat(p.price.replace(',', '.')), 0).toFixed(2).replace('.', ',');
    const names = packagesToPurchase.map(p => p.name).join(', ');

    if (window.confirm(`${names} toplam ${totalStr} TL karşılığında satın alınsın mı?\n\nÜcret hesabınızdan düşülecektir.`)) {
      try {
        const { purchasePromotion } = await import('../api/promotions');

        // Process each promotion
        for (const p of packagesToPurchase) {
          await purchasePromotion(listing.id, {
            id: p.id,
            price: parseFloat(p.price.replace(',', '.')),
            duration: p.duration
          }, user.id);
        }

        alert(`Teşekkür ederiz! Seçilen paketler aktif edildi.`);
        setSelectedPromotions([]);
        window.location.reload();
      } catch (error) {
        console.error('Error purchasing promotions:', error);
        alert('Promosyon satın alınırken hata oluştu');
      }
    }
  };

  const togglePromotionSelection = (pkgId) => {
    setSelectedPromotions(prev =>
      prev.includes(pkgId) ? [] : [pkgId]
    );
  };

  const calculateTotal = () => {
    return selectedPromotions.reduce((acc, id) => {
      const pkg = promotionPackages.find(p => p.id === id);
      return acc + (pkg ? parseFloat(pkg.price.replace(',', '.')) : 0);
    }, 0).toFixed(2).replace('.', ',');
  };

  return (
    <>
      {/* Print-Only Flyer */}
      <PrintFlyer listing={listing} sellerProfile={sellerProfile} hideContact={printHideContact} />

      {/* Web-Only Styles and Content */}
      {/* Safe Print Styles - Optimized for Single Page */}
      <style>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 0;
          }
          
          html, body {
            margin: 0 !important;
            padding: 0 !important;
            height: auto !important;
            overflow: visible !important;
          }

          /* Hide Web UI components */
          .no-print, nav, header, footer, section, button, aside {
            display: none !important;
          }

          .print-flyer {
            display: flex !important;
            flex-direction: column !important;
            position: absolute !important;
            top: 0 !important;
            left: 0 !important;
            width: 100% !important;
            min-height: 285mm !important;
            margin: 0 !important;
            padding: 10mm 15mm !important;
            background: white !important;
            box-sizing: border-box !important;
            z-index: 9999 !important;
          }

          #root, .App {
            height: auto !important;
            min-height: 0 !important;
            display: block !important;
          }
        }
      `}</style>

      <div className={`min-h-screen bg-gray-50 dark:bg-neutral-950 no-print ${isMobile ? 'pb-48' : ''}`}>
        {listing && <ProductSEO listing={listing} />}
        <div className="max-w-7xl mx-auto px-2 sm:px-4 py-3 sm:py-6">
          <div className="mb-3 sm:mb-4 flex items-center gap-1 sm:gap-2 text-xs sm:text-sm overflow-x-auto no-print">
            <button
              onClick={() => navigate('/')}
              className="text-red-500 hover:text-red-600 font-medium whitespace-nowrap"
            >
              ExVitrin
            </button>
            <span className="text-gray-400">›</span>
            <button
              onClick={() => navigate(getCategoryPath(listing.category))}
              className="text-gray-700 dark:text-neutral-400 hover:text-red-500 font-medium transition-colors whitespace-nowrap"
            >
              {listing.category}
            </button>
            {listing.sub_category && (
              <>
                <span className="text-gray-400">›</span>
                <button
                  onClick={() => navigate(getCategoryPath(listing.category, listing.sub_category))}
                  className="text-gray-700 dark:text-neutral-400 hover:text-red-500 font-medium transition-colors whitespace-nowrap truncate max-w-[150px] sm:max-w-none"
                >
                  {normalizeSubcategoryName(listing.sub_category)}
                </button>
              </>
            )}
          </div>

          {/* Owner Dashboard Overlay */}
          {isOwnListing && (
            <div className="mb-6 no-print">
              {isMobile ? (
                <>
                  <button
                    onClick={() => setShowMobileStats(true)}
                    className="w-full bg-gradient-to-r from-gray-900 to-gray-800 text-white p-4 rounded-xl shadow-lg border-2 border-red-500/30 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <span className="bg-red-500 text-white p-2 rounded-lg">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-0.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-0.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-0.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-0.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-0.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-0.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </span>
                      <div className="text-left">
                        <div className="font-black text-sm uppercase tracking-wider">İlan Yönetimi</div>
                        <div className="text-[10px] text-gray-400 font-bold uppercase">Ayarlar, İstatistikler & Paketler</div>
                      </div>
                    </div>
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>

                  {showMobileStats && (
                    <div className="fixed inset-0 z-[200] bg-gray-100 dark:bg-neutral-950 overflow-y-auto">
                      <div className="sticky top-0 z-[210] bg-white dark:bg-neutral-900 border-b border-gray-200 dark:border-white/10 px-4 py-3 flex justify-between items-center shadow-sm">
                        <div className="flex items-center gap-2">
                          <span className="bg-red-500 text-white p-1 rounded-lg">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-0.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-0.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-0.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-0.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-0.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-0.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            </svg>
                          </span>
                          <h2 className="text-sm font-black text-gray-900 dark:text-neutral-50 uppercase tracking-tight">İlan Yönetimi</h2>
                        </div>
                        <button
                          onClick={() => setShowMobileStats(false)}
                          className="bg-gray-100 dark:bg-neutral-800 hover:bg-gray-200 dark:hover:bg-neutral-700 text-gray-600 dark:text-neutral-400 p-1.5 rounded-full transition-colors"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                      <div className="p-2 pb-10">
                        <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-lg overflow-hidden border border-gray-200 dark:border-white/10">
                          <DashboardContent
                            listing={listing}
                            favoriteCount={favoriteCount}
                            handleEditDetail={handleEditDetail}
                            handleReserveDetail={handleReserveDetail}
                            handleExtendDetail={handleExtendDetail}
                            handleDeleteDetail={handleDeleteDetail}
                            promotionPackages={promotionPackages}
                            selectedPromotions={selectedPromotions}
                            togglePromotionSelection={togglePromotionSelection}
                            calculateTotal={calculateTotal}
                            handlePromotionPurchase={handlePromotionPurchase}
                            navigate={navigate}
                            setPrintHideContact={setPrintHideContact}
                            t={t}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-xl overflow-hidden border-2 border-red-500/20">
                  <DashboardContent
                    listing={listing}
                    favoriteCount={favoriteCount}
                    handleEditDetail={handleEditDetail}
                    handleReserveDetail={handleReserveDetail}
                    handleExtendDetail={handleExtendDetail}
                    handleDeleteDetail={handleDeleteDetail}
                    promotionPackages={promotionPackages}
                    selectedPromotions={selectedPromotions}
                    togglePromotionSelection={togglePromotionSelection}
                    calculateTotal={calculateTotal}
                    handlePromotionPurchase={handlePromotionPurchase}
                    navigate={navigate}
                    setPrintHideContact={setPrintHideContact}
                    t={t}
                  />
                </div>
              )}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 printable-content">
            {/* Sol Taraf - Ürün Açıklaması */}
            <div className="lg:col-span-2 space-y-4 sm:space-y-6">
              {/* Ürün Resmi */}
              <div className="bg-transparent sm:bg-white dark:sm:bg-neutral-900 rounded-none sm:rounded-lg shadow-none sm:shadow-lg overflow-hidden relative hover:shadow-xl transition-shadow duration-300 z-0 -mx-2 sm:mx-0 border border-transparent dark:sm:border-white/5">
                <div className="bg-transparent sm:bg-white dark:sm:bg-neutral-900 rounded-none sm:rounded-lg overflow-hidden shadow-none sm:shadow-inner p-0 sm:p-3">
                  <div className="relative w-full h-[300px] sm:h-[525px] bg-gray-50 dark:bg-neutral-800 flex items-center justify-center rounded-none sm:rounded-lg overflow-hidden border-0 sm:border border-gray-100 dark:sm:border-white/5">
                    {isMobile && (
                      <button
                        onClick={() => navigate(-1)}
                        className="absolute left-2 top-2 z-30 text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] active:scale-90 transition-all no-print"
                        aria-label="Geri"
                      >
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                    )}
                    <div
                      ref={galleryRef}
                      onScroll={handleGalleryScroll}
                      className="absolute inset-0 flex overflow-x-auto snap-x snap-mandatory scrollbar-none z-10"
                      style={{ scrollBehavior: 'smooth' }}
                    >
                      {(() => {
                        const images = listing.images && listing.images.length > 0 ? listing.images : (listing.image ? [listing.image] : []);
                        return images.map((img, index) => (
                          <div key={index} className="w-full h-full flex-shrink-0 snap-center">
                            <img
                              src={getOptimizedImageUrl(img, 1000, 750, 'cover')}
                              alt={`${listing.title} - ${index + 1}`}
                              className="w-full h-full object-cover"
                              onClick={() => setShowLightbox(true)}
                              loading={index === 0 ? "eager" : "lazy"}
                              decoding="async"
                            />
                          </div>
                        ));
                      })()}
                    </div>

                    {listing.images && listing.images.length > 0 && (
                      <div className="absolute bottom-3 right-3 bg-black/60 text-white px-3 py-1 rounded-full text-xs font-medium z-20 backdrop-blur-sm">
                        {t.productDetail.imageCount.replace('{current}', activeImage + 1).replace('{total}', listing.images.length)}
                      </div>
                    )}

                    {/* Navigation Arrows - Hidden on mobile, shown on desktop */}
                    {listing.images && listing.images.length > 1 && !isMobile && (
                      <>
                        {/* Previous Button */}
                        <button
                          onClick={() => setActiveImage(activeImage === 0 ? listing.images.length - 1 : activeImage - 1)}
                          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all duration-200 hover:scale-110"
                          aria-label={t.productDetail.prevImage}
                        >
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                          </svg>
                        </button>

                        {/* Next Button */}
                        <button
                          onClick={() => setActiveImage(activeImage === listing.images.length - 1 ? 0 : activeImage + 1)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all duration-200 hover:scale-110"
                          aria-label={t.productDetail.nextImage}
                        >
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      </>
                    )}

                    {/* Status Badges Container */}
                    <div className="absolute top-4 left-4 z-20 flex flex-col items-start gap-2">
                      {/* RESERVIERT Badge */}
                      {listing?.reserved_by && (
                        <div className="bg-yellow-500 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-lg flex items-center gap-2">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                          </svg>
                          {t.productDetail.reservedLabel}
                        </div>
                      )}
                      {/* Vitrin Badge - Inclusive check */}
                      {(listing?.is_gallery || ['galerie', 'gallery', 'galeri', 'vitrin'].includes(listing?.package_type?.trim().toLowerCase())) && (
                        <div className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white text-sm font-bold px-4 py-2 rounded-xl shadow-lg border border-white/20 flex items-center gap-2">
                          <span>⭐ VİTRİN</span>
                        </div>
                      )}


                      {/* Premium Badge */}
                      {(listing?.package_type?.toLowerCase() === 'premium' || listing?.package_type?.toLowerCase() === 'z_premium') && (
                        <div className="bg-gradient-to-r from-red-600 via-red-500 to-rose-600 text-white text-sm font-bold px-4 py-2 rounded-xl shadow-[0_0_20px_rgba(239,68,68,0.5)] border border-white/20 flex items-center gap-2">
                          <span>👑 PREMIUM</span>
                        </div>
                      )}

                      {/* Multi-Bump Badge */}
                      {(listing?.package_type?.toLowerCase() === 'multi-bump' || listing?.package_type?.toLowerCase() === 'z_multi_bump') && (
                        <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white text-sm font-bold px-4 py-2 rounded-xl shadow-lg border border-white/20 flex items-center gap-2">
                          <span>⚡ GÜNLÜK YUKARI</span>
                        </div>
                      )}

                      {/* Öne Çıkan Badge */}
                      {listing?.is_highlighted && !listing?.is_top && !listing?.is_gallery && (
                        <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 text-sm font-bold px-4 py-2 rounded-xl shadow-lg flex flex-col items-center">
                          <span>✨ Öne Çıkan</span>

                        </div>
                      )}
                    </div>
                  </div>
                  {/* Gallery Thumbnails */}
                  {listing.images && listing.images.length > 1 && (
                    <div className="relative mt-3 group">
                      {/* Left Arrow */}
                      {listing.images.length > 5 && (
                        <button
                          onClick={(e) => { e.stopPropagation(); scrollThumbnails('left'); }}
                          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 flex items-center justify-center bg-white/90 dark:bg-neutral-800/90 text-gray-700 dark:text-gray-300 rounded-full shadow-md border border-gray-200 dark:border-white/10 opacity-0 group-hover:opacity-100 hover:bg-white dark:hover:bg-neutral-700 hover:scale-110 transition-all -ml-3"
                          aria-label="Previous thumbnails"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                        </button>
                      )}

                      <div 
                        ref={thumbnailScrollRef}
                        className="flex gap-2 overflow-x-auto pb-2 scrollbar-none scroll-smooth px-1"
                      >
                        {listing.images.map((img, index) => (
                          <button
                            key={index}
                            onClick={() => handleThumbnailClick(index)}
                            className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 ${activeImage === index ? 'border-red-500' : 'border-transparent hover:border-gray-200'}`}
                          >
                            <img
                              src={getOptimizedImageUrl(img, 160, 160, 'cover')}
                              alt={`${listing.title} thumbnail ${index + 1}`}
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                            {activeImage === index && (
                              <div className="absolute inset-0 bg-red-500/10" />
                            )}
                          </button>
                        ))}
                      </div>

                      {/* Right Arrow */}
                      {listing.images.length > 5 && (
                        <button
                          onClick={(e) => { e.stopPropagation(); scrollThumbnails('right'); }}
                          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 flex items-center justify-center bg-white/90 dark:bg-neutral-800/90 text-gray-700 dark:text-gray-300 rounded-full shadow-md border border-gray-200 dark:border-white/10 opacity-0 group-hover:opacity-100 hover:bg-white dark:hover:bg-neutral-700 hover:scale-110 transition-all -mr-3"
                          aria-label="Next thumbnails"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                        </button>
                      )}
                    </div>
                  )}
                </div>
                {/* Üst Araçlar - Mobil Paylaş ve Favori */}
                <div className="absolute top-6 right-6 z-30 flex items-center gap-1.5">
                  {/* Paylaş Butonu */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowShareModal(true);
                    }}
                    className="w-8 h-8 bg-white/90 dark:bg-neutral-800/90 backdrop-blur-sm rounded-full shadow hover:bg-white dark:hover:bg-neutral-700 hover:scale-110 transition-all duration-200 flex items-center justify-center text-gray-600 dark:text-neutral-300"
                    title="Paylaş"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-0.482-0.114-0.938-0.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                  </button>

                  {/* Favori Kalp Butonu */}
                  {!isOwnListing && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite && toggleFavorite(listing.id);
                      }}
                      className="w-8 h-8 bg-white/90 dark:bg-neutral-800/90 backdrop-blur-sm rounded-full shadow hover:bg-white dark:hover:bg-neutral-700 hover:scale-110 transition-all duration-200 flex items-center justify-center"
                      title={favorite ? 'Favorilerimden çıkar' : 'Favorilerime ekle'}
                    >
                      {favorite ? (
                        <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5 text-gray-400 group-hover:text-red-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      )}
                    </button>
                  )}
                </div>
              </div>

              <ImageLightbox
                isOpen={showLightbox}
                onClose={() => setShowLightbox(false)}
                imageSrc={listing.image}
                altText={listing.title}
                images={listing.images}
                currentIndex={activeImage}
                onNavigate={setActiveImage}
              />

              {/* Birleştirilmiş İlan Bilgileri Paneli */}
              <div className="bg-transparent sm:bg-white dark:sm:bg-neutral-900 rounded-none sm:rounded-lg shadow-none sm:shadow-lg px-4 sm:p-6 py-6 border border-transparent dark:sm:border-white/5">
                {/* Ürün Başlığı ve Bilgileri */}
                <div className="space-y-6">
                  {/* Başlık ve Fiyat - Üst Kısım - Back to top per user request */}
                  <div className="pb-6 border-b border-gray-100 dark:border-white/5">
                    {/* Fiyat - En Üstte */}
                    {listing.sub_category !== 'Ausbildung' && listing.sub_category !== 'Bau, Handwerk & Produktion' && listing.category !== 'Jobs' && (
                      <div className="mb-4">
                        <div className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-neutral-50 mb-1">
                          {listing.price_type === 'giveaway' || listing.price === 0
                            ? t.productDetail.giveaway
                            : typeof listing.price === 'number'
                              ? `${listing.price.toLocaleString('tr-TR')} TL${listing.price_type === 'negotiable' ? ' ' + t.productDetail.negotiable : ''}`
                              : listing.price?.toString().includes(' TL')
                                ? listing.price
                                : listing.price ? `${listing.price} TL${listing.price_type === 'negotiable' ? ' ' + t.productDetail.negotiable : ''}` : t.productDetail.negotiable}
                        </div>
                        {listing.stock && (
                          <div className="text-sm text-gray-500 dark:text-neutral-400">
                            {t.productDetail.stock.replace('{count}', listing.stock || 1)}
                          </div>
                        )}

                        {/* Favorite Count */}
                        {favoriteCount > 0 && (
                          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-neutral-400 mt-2">
                            <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                            </svg>
                            <span>{favoriteCount === 1 ? t.productDetail.personFavorited : t.productDetail.peopleFavorited.replace('{count}', favoriteCount)}</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Başlık */}
                    <div>
                      <h1 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-neutral-50 leading-tight">
                        {(listing?.offer_type === 'Aranıyor' || listing?.offer_type === 'Gesuche') && (
                          <span className="inline-block bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 px-2 py-0.5 rounded text-xs sm:text-sm font-bold mr-2 uppercase tracking-wider align-middle border border-blue-200 dark:border-blue-800/50 shadow-sm">
                            Aranıyor
                          </span>
                        )}
                        {listing.title}
                      </h1>

                      {/* Mobil için Hızlı Bilgi Çubuğu (Konum ve Tarih) */}
                      {isMobile && (
                        <div className="mt-3 flex justify-between items-center text-[13px] text-gray-600 dark:text-neutral-400 font-medium border-t border-gray-50 dark:border-white/5 pt-3 w-full">
                          <div className="flex items-center gap-1.5">
                            <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span>
                              {listing.district ? `${listing.district}, ` : ''}
                              {listing.city || t.common.notAvailable}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <svg className="w-4 h-4 text-gray-400 dark:text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>
                              {listing.created_at ? new Date(listing.created_at).toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' }) : 'N/A'}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* General Info Grid - Below Title/Price */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 text-sm pb-8 border-b border-gray-100 dark:border-white/5 mb-12">
                    <div className="hidden md:flex justify-between">
                      <span className="text-gray-500 dark:text-neutral-400">{t.productDetail.postedOn}</span>
                      <span className="font-medium text-gray-900 dark:text-neutral-50">
                        {listing.created_at ? new Date(listing.created_at).toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' }) : 'N/A'}
                      </span>
                    </div>
                    {listing.condition && (
                      <div className="flex justify-between">
                        <span className="text-gray-500 dark:text-neutral-400">{t.addListing.condition || 'Durum'}</span>
                        <span className="font-medium text-gray-900 dark:text-neutral-50">
                          {listing.condition === 'defekt' ? (t.addListing?.options?.defective || 'Arızalı') :
                            listing.condition === 'in_ordnung' ? (t.addListing?.options?.okay || 'İdare Eder') :
                              listing.condition === 'gut' ? (t.addListing?.options?.good || 'İyi') :
                                listing.condition === 'sehr_gut' ? (t.addListing?.options?.veryGood || 'Çok İyi') :
                                  listing.condition === 'neu' || listing.condition === 'Neu' ? (t.addListing?.options?.new || 'Yeni') :
                                    listing.condition === 'neu_mit_etikett' ? (t.addListing?.options?.newWithTags || 'Yeni (Etiketli)') :
                                      listing.condition === 'gebraucht' ? (t.addListing?.options?.used || 'İkinci El') :
                                        listing.condition}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-neutral-400">{t.productDetail.listingId}</span>
                      <span className="font-medium text-gray-900 dark:text-neutral-50">{generateListingNumber(listing)}</span>
                    </div>
                    <div className="hidden md:flex justify-between">
                      <span className="text-gray-500 dark:text-neutral-400">{t.productDetail.location}</span>
                      <div className="text-right">
                        <span className="font-medium text-gray-900 dark:text-neutral-50 block">
                          {listing.show_location === true && listing.address ? `${listing.address}, ` : ''}
                          {listing.district ? `${listing.district}, ` : ''}
                          {listing.city || ''}
                          {!listing.city && t.common.notAvailable}
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-neutral-400">{t.productDetail.views}</span>
                      <span className="font-medium text-gray-900 dark:text-neutral-50">{(listing.views || 0).toLocaleString('tr-TR')}</span>
                    </div>
                    {listing.versand_art && (
                      <div className="flex justify-between">
                        <span className="text-gray-500 dark:text-neutral-400">{t.addListing.shipping}</span>
                        <span className="font-medium text-gray-900 dark:text-neutral-50">
                          {listing.versand_art === 'Kargo Mümkün' || listing.versand_art === 'Versand möglich' ? t.addListing.options.shipping :
                            listing.versand_art === 'Sadece Elden Teslim' || listing.versand_art === 'Nur Abholung' ? t.addListing.options.noShipping :
                              listing.versand_art}
                        </span>
                      </div>
                    )}

                  </div>


                  {/* Quantity Selector - Only for New items */}
                  {(listing.condition === 'Neu' || listing.condition === 'Yeni') && (
                    <div className="flex items-center gap-4 p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/30 rounded-lg">
                      <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                      <span className="text-sm font-medium text-gray-700 dark:text-neutral-300">Adet:</span>
                      <div className="flex items-center border-2 border-gray-300 dark:border-white/20 rounded-full bg-white dark:bg-neutral-800 overflow-hidden">
                        <button
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          className="px-4 py-2 hover:bg-gray-50 dark:hover:bg-neutral-700 text-gray-700 dark:text-neutral-400 font-bold transition-colors"
                          type="button"
                        >−</button>
                        <div className="w-16 text-center font-bold text-gray-900 dark:text-neutral-50 border-x border-gray-300 dark:border-white/20 py-2">{quantity}</div>
                        <button
                          onClick={() => setQuantity(Math.min(currentStock, quantity + 1))}
                          className="px-4 py-2 hover:bg-gray-50 dark:hover:bg-neutral-700 text-gray-700 dark:text-neutral-400 font-bold transition-colors"
                          type="button"
                        >+</button>
                      </div>
                      <span className="text-sm text-gray-600 dark:text-neutral-400">
                        <span className="font-semibold text-gray-900 dark:text-neutral-50">{currentStock}</span> adet mevcut
                      </span>
                    </div>
                  )}

                  <div className="flex gap-3">
                    {listing.condition === 'Neu' && (
                      <button
                        type="button"
                        onClick={() => addToCart({ ...listing, quantity: quantity })}
                        className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-0.63.63-0.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        Sepete Ekle
                      </button>
                    )}
                  </div>
                </div>

                {/* Fahrzeugdetails & Ausstattung */}
                {((listing.kilometerstand !== undefined && listing.kilometerstand !== null) || (listing.kilometer !== undefined && listing.kilometer !== null) || listing.erstzulassung || listing.bj || listing.leistung || listing.power || listing.vehicle_type || listing.fahrzeugtyp || listing.hu ||
                  ['Autos', 'Motorräder & Motorroller', 'Wohnwagen & Wohnmobile', 'Nutzfahrzeuge & Anhänger', 'Weiteres Auto, Rad & Boot'].includes(listing.subCategory) ||
                  ['Autos', 'Motorräder & Motorroller', 'Wohnwagen & Wohnmobile', 'Nutzfahrzeuge & Anhänger', 'Weiteres Auto, Rad & Boot'].includes(listing.sub_category)) && (
                    <div className="mb-12">
                      <div className="pb-8 mb-8">
                        <div className="mb-8">
                          <h2 className="text-2xl font-bold text-gray-900 dark:text-neutral-50">
                            {t.productDetail.vehicleDetails}
                          </h2>
                        </div>

                        {/* Specs Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-5 text-sm mb-8">
                          {(listing.marke || listing.car_brand || listing.carBrand) && (
                            <div className="flex justify-between">
                              <span className="text-gray-600 dark:text-neutral-400 font-medium">{t.productDetail.manufacturer}</span>
                              <span className="font-bold text-gray-900 dark:text-neutral-50">{listing.marke || listing.car_brand || listing.carBrand}</span>
                            </div>
                          )}
                          {(listing.modell || listing.car_model || listing.carModel) && (
                            <div className="flex justify-between">
                              <span className="text-gray-600 dark:text-neutral-400 font-medium">{t.productDetail.model}</span>
                              <span className="font-bold text-gray-900 dark:text-neutral-50">{listing.modell || listing.car_model || listing.carModel}</span>
                            </div>
                          )}
                          {(listing.vehicle_type || listing.fahrzeugtyp || listing.fhz_type || listing.vehicleType) && (
                            <div className="flex justify-between">
                              <span className="text-gray-600 dark:text-neutral-400 font-medium">{t.productDetail.propertyType || t.productDetail.art}</span>
                              <span className="font-bold text-gray-900 dark:text-neutral-50">{translateVal(listing.vehicle_type || listing.fahrzeugtyp || listing.fhz_type || listing.vehicleType)}</span>
                            </div>
                          )}
                          {(listing.kilometerstand !== undefined && listing.kilometerstand !== null || listing.kilometer !== undefined && listing.kilometer !== null || listing.kilometerStand !== undefined && listing.kilometerStand !== null) && (
                            <div className="flex justify-between">
                              <span className="text-gray-600 dark:text-neutral-400 font-medium">{t.productDetail.mileage}</span>
                              <span className="font-bold text-gray-900 dark:text-neutral-50">{(listing.kilometerstand || listing.kilometer || listing.kilometerStand).toLocaleString('tr-TR')} km</span>
                            </div>
                          )}
                          {(listing.erstzulassung || listing.bj) && (
                            <div className="flex justify-between">
                              <span className="text-gray-600 dark:text-neutral-400 font-medium">{t.productDetail.firstRegistration}</span>
                              <span className="font-bold text-gray-900 dark:text-neutral-50">{listing.erstzulassung || listing.bj}</span>
                            </div>
                          )}
                          {(listing.kraftstoff || listing.fuel_type) && (
                            <div className="flex justify-between">
                              <span className="text-gray-600 dark:text-neutral-400 font-medium">{t.productDetail.fuelType}</span>
                              <span className="font-bold text-gray-900 dark:text-neutral-50">{translateVal(listing.kraftstoff || listing.fuel_type)}</span>
                            </div>
                          )}
                          {(listing.leistung || listing.power) && (
                            <div className="flex justify-between">
                              <span className="text-gray-600 dark:text-neutral-400 font-medium">{t.productDetail.power}</span>
                              <span className="font-bold text-gray-900 dark:text-neutral-50">{listing.leistung || listing.power} PS</span>
                            </div>
                          )}
                          {listing.hubraum && (
                            <div className="flex justify-between">
                              <span className="text-gray-600 dark:text-neutral-400 font-medium">{t.productDetail.displacement}</span>
                              <span className="font-bold text-gray-900 dark:text-neutral-50">{listing.hubraum} cm³</span>
                            </div>
                          )}
                          {listing.getriebe && (
                            <div className="flex justify-between">
                              <span className="text-gray-600 dark:text-neutral-400 font-medium">{t.productDetail.transmission}</span>
                              <span className="font-bold text-gray-900 dark:text-neutral-50">{translateVal(listing.getriebe)}</span>
                            </div>
                          )}
                          {listing.door_count && (
                            <div className="flex justify-between">
                              <span className="text-gray-600 dark:text-neutral-400 font-medium">{t.productDetail.doorCount}</span>
                              <span className="font-bold text-gray-900 dark:text-neutral-50">{listing.door_count}</span>
                            </div>
                          )}
                          {listing.hu && (
                            <div className="flex justify-between">
                              <span className="text-gray-500 dark:text-neutral-400 font-medium">{t.productDetail.huUntil}</span>
                              <span className="font-bold text-gray-900 dark:text-neutral-50">{listing.hu}</span>
                            </div>
                          )}
                          {(listing.schadstoffklasse || listing.emission_class) && (
                            <div className="flex justify-between">
                              <span className="text-gray-600 dark:text-neutral-400 font-medium">{t.productDetail.emissionClass}</span>
                              <span className="font-bold text-gray-900 dark:text-neutral-50">{translateVal(listing.schadstoffklasse || listing.emission_class)}</span>
                            </div>
                          )}
                          {listing.exterior_color && (
                            <div className="flex justify-between">
                              <span className="text-gray-600 dark:text-neutral-400 font-medium">{t.productDetail.exteriorColor}</span>
                              <span className="font-bold text-gray-900 dark:text-neutral-50">{translateVal(listing.exterior_color)}</span>
                            </div>
                          )}
                          {listing.interior_material && (
                            <div className="flex justify-between">
                              <span className="text-gray-600 dark:text-neutral-400 font-medium">{t.productDetail.interiorMaterial}</span>
                              <span className="font-bold text-gray-900 dark:text-neutral-50">{translateVal(listing.interior_material)}</span>
                            </div>
                          )}
                        </div>

                        {/* Status Tags */}
                        <div className="flex flex-wrap gap-8 mb-8">
                          {listing.unfallfrei && (
                            <span className="text-gray-900 dark:text-neutral-50 text-xs font-bold">
                              Kazasız
                            </span>
                          )}
                          {listing.scheckheftgepflegt && (
                            <span className="text-gray-900 dark:text-neutral-50 text-xs font-bold">
                              Bakımlı (Servis Bakımlı)
                            </span>
                          )}
                          {listing.nichtraucher_fahrzeug && (
                            <span className="text-gray-900 dark:text-neutral-50 text-xs font-bold">
                              Sigara İçilmemiş
                            </span>
                          )}
                        </div>

                        {/* Car Amenities */}
                        {listing.car_amenities && listing.car_amenities.length > 0 && (
                          <div className="pt-8 border-t border-gray-200 dark:border-white/5">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-neutral-50 mb-5">
                              {t.productDetail.amenities}
                            </h3>
                            <div className="grid grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-6">
                              {listing.car_amenities.map(amenity => (
                                <div key={amenity} className="flex items-center gap-2 text-[13px] text-gray-700 dark:text-neutral-300 font-medium">
                                  <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                  </svg>
                                  <span>{translateVal(amenity)}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}





                {/* Wohnzimmer Details */}
                {listing.wohnzimmer_art && (
                  <div className="mb-8">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-neutral-50 mb-4">
                      {t.productDetail.details}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 text-sm pb-8 mb-8">
                      <div className="flex justify-between">
                        <span className="text-gray-500 dark:text-neutral-400">{t.productDetail.art}</span>
                        <span className="font-semibold text-gray-900 dark:text-neutral-50">{listing.wohnzimmer_art}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Schlafzimmer, Küche, Heimwerken & Beleuchtung Details */}
                {(listing.schlafzimmer_art || listing.kueche_esszimmer_art || listing.heimwerken_art || listing.lamba_aydinlatma_art) && (
                  <div className="mb-8">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-neutral-50 mb-4">
                      {t.productDetail.details}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 text-sm pb-8 mb-8">
                      {listing.schlafzimmer_art && (
                        <div className="flex justify-between">
                          <span className="text-gray-500 dark:text-neutral-400">{t.productDetail.art}</span>
                          <span className="font-semibold text-gray-900 dark:text-neutral-50">{listing.schlafzimmer_art}</span>
                        </div>
                      )}
                      {listing.kueche_esszimmer_art && (
                        <div className="flex justify-between">
                          <span className="text-gray-500 dark:text-neutral-400">{t.productDetail.art}</span>
                          <span className="font-semibold text-gray-900 dark:text-neutral-50">{listing.kueche_esszimmer_art}</span>
                        </div>
                      )}
                      {listing.heimwerken_art && (
                        <div className="flex justify-between">
                          <span className="text-gray-500 dark:text-neutral-400">{t.productDetail.art}</span>
                          <span className="font-semibold text-gray-900 dark:text-neutral-50">{listing.heimwerken_art}</span>
                        </div>
                      )}
                      {listing.lamba_aydinlatma_art && (
                        <div className="flex justify-between">
                          <span className="text-gray-500 dark:text-neutral-400">{t.productDetail.art}</span>
                          <span className="font-semibold text-gray-900 dark:text-neutral-50">{listing.lamba_aydinlatma_art}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Fahrräder & Zubehör Details */}
                {(listing.bike_type || listing.art_type) && (
                  <div className="mb-8">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">
                      {t.productDetail.details}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 text-sm pb-8 mb-8">
                      {listing.art_type && (
                        <div className="flex justify-between">
                          <span className="text-gray-500">{t.productDetail.art}</span>
                          <span className="font-semibold text-gray-900">{listing.art_type}</span>
                        </div>
                      )}
                      {listing.bike_type && (
                        <div className="flex justify-between">
                          <span className="text-gray-500">{t.productDetail.art}</span>
                          <span className="font-semibold text-gray-900">{listing.bike_type}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Baby & Kinderkleidung / Kinderschuhe Details */}
                {(listing.baby_kinderkleidung_art || listing.baby_kinderkleidung_size || listing.baby_kinderkleidung_color || listing.baby_kinderkleidung_gender || listing.baby_kinderschuhe_art || listing.baby_kinderschuhe_size || listing.baby_kinderschuhe_color) && (
                  <div className="mb-8">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">
                      {t.productDetail.details}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 text-sm pb-8 mb-8">
                      {listing.baby_kinderkleidung_art && (
                        <div className="flex justify-between">
                          <span className="text-gray-500">{t.productDetail.art}</span>
                          <span className="font-semibold text-gray-900">{listing.baby_kinderkleidung_art}</span>
                        </div>
                      )}
                      {listing.baby_kinderkleidung_size && (
                        <div className="flex justify-between">
                          <span className="text-gray-500">{t.addListing.size}</span>
                          <span className="font-semibold text-gray-900">{listing.baby_kinderkleidung_size}</span>
                        </div>
                      )}
                      {listing.baby_kinderkleidung_color && (
                        <div className="flex justify-between">
                          <span className="text-gray-500">{t.addListing.color}</span>
                          <span className="font-semibold text-gray-900">{listing.baby_kinderkleidung_color}</span>
                        </div>
                      )}
                      {listing.baby_kinderkleidung_gender && (
                        <div className="flex justify-between">
                          <span className="text-gray-500">{t.addListing.gender}</span>
                          <span className="font-semibold text-gray-900">{listing.baby_kinderkleidung_gender}</span>
                        </div>
                      )}
                      {listing.baby_kinderschuhe_art && (
                        <div className="flex justify-between">
                          <span className="text-gray-500">{t.productDetail.art}</span>
                          <span className="font-semibold text-gray-900">{listing.baby_kinderschuhe_art}</span>
                        </div>
                      )}
                      {listing.baby_kinderschuhe_size && (
                        <div className="flex justify-between">
                          <span className="text-gray-500">{t.addListing.size}</span>
                          <span className="font-semibold text-gray-900">{listing.baby_kinderschuhe_size}</span>
                        </div>
                      )}
                      {listing.baby_kinderschuhe_color && (
                        <div className="flex justify-between">
                          <span className="text-gray-500">{t.addListing.color}</span>
                          <span className="font-semibold text-gray-900">{listing.baby_kinderschuhe_color}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Kinderwagen & Buggys Details */}
                {(listing.kinderwagen_buggys_color || listing.kinderwagen_buggys_art) && (
                  <div className="mb-8">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">
                      {t.productDetail.details}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 text-sm pb-8 mb-8">
                      {listing.kinderwagen_buggys_art && (
                        <div className="flex justify-between">
                          <span className="text-gray-500">{t.productDetail.art}</span>
                          <span className="font-semibold text-gray-900">{listing.kinderwagen_buggys_art}</span>
                        </div>
                      )}
                      {listing.kinderwagen_buggys_color && (
                        <div className="flex justify-between">
                          <span className="text-gray-500">{t.addListing.color}</span>
                          <span className="font-semibold text-gray-900">{listing.kinderwagen_buggys_color}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Mode & Beauty Details (Legacy for others) */}
                {(listing.damenschuhe_color || listing.damenschuhe_art || listing.damenschuhe_size || listing.damenschuhe_marke ||
                  listing.herrenbekleidung_color || listing.herrenbekleidung_art || listing.herrenbekleidung_size || listing.herrenbekleidung_marke ||
                  listing.herrenschuhe_color || listing.herrenschuhe_art || listing.herrenschuhe_size || listing.herrenschuhe_marke) && (
                    <div className="mb-8">
                      <h2 className="text-lg font-bold text-gray-900 mb-4">
                        {t.productDetail.details}
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 text-sm pb-8 mb-8">
                        {/* Damenschuhe */}
                        {listing.damenschuhe_art && (
                          <div className="flex justify-between">
                            <span className="text-gray-500">{t.productDetail.art}</span>
                            <span className="font-semibold text-gray-900">{listing.damenschuhe_art}</span>
                          </div>
                        )}
                        {listing.damenschuhe_marke && (
                          <div className="flex justify-between">
                            <span className="text-gray-500">{t.addListing.brand}</span>
                            <span className="font-semibold text-gray-900">{listing.damenschuhe_marke}</span>
                          </div>
                        )}
                        {listing.damenschuhe_size && (
                          <div className="flex justify-between">
                            <span className="text-gray-500">{t.addListing.size}</span>
                            <span className="font-semibold text-gray-900">{listing.damenschuhe_size}</span>
                          </div>
                        )}
                        {listing.damenschuhe_color && (
                          <div className="flex justify-between">
                            <span className="text-gray-500">{t.addListing.color}</span>
                            <span className="font-semibold text-gray-900">{listing.damenschuhe_color}</span>
                          </div>
                        )}

                        {/* Herrenbekleidung */}
                        {listing.herrenbekleidung_art && (
                          <div className="flex justify-between">
                            <span className="text-gray-500">{t.productDetail.art}</span>
                            <span className="font-semibold text-gray-900">{listing.herrenbekleidung_art}</span>
                          </div>
                        )}
                        {listing.herrenbekleidung_marke && (
                          <div className="flex justify-between">
                            <span className="text-gray-500">{t.addListing.brand}</span>
                            <span className="font-semibold text-gray-900">{listing.herrenbekleidung_marke}</span>
                          </div>
                        )}
                        {listing.herrenbekleidung_size && (
                          <div className="flex justify-between">
                            <span className="text-gray-500">{t.addListing.size}</span>
                            <span className="font-semibold text-gray-900">{listing.herrenbekleidung_size}</span>
                          </div>
                        )}
                        {listing.herrenbekleidung_color && (
                          <div className="flex justify-between">
                            <span className="text-gray-500">{t.addListing.color}</span>
                            <span className="font-semibold text-gray-900">{listing.herrenbekleidung_color}</span>
                          </div>
                        )}

                        {/* Herrenschuhe */}
                        {listing.herrenschuhe_art && (
                          <div className="flex justify-between">
                            <span className="text-gray-500">{t.productDetail.art}</span>
                            <span className="font-semibold text-gray-900">{listing.herrenschuhe_art}</span>
                          </div>
                        )}
                        {listing.herrenschuhe_marke && (
                          <div className="flex justify-between">
                            <span className="text-gray-500">{t.addListing.brand}</span>
                            <span className="font-semibold text-gray-900">{listing.herrenschuhe_marke}</span>
                          </div>
                        )}
                        {listing.herrenschuhe_size && (
                          <div className="flex justify-between">
                            <span className="text-gray-500">{t.addListing.size}</span>
                            <span className="font-semibold text-gray-900">{listing.herrenschuhe_size}</span>
                          </div>
                        )}
                        {listing.herrenschuhe_color && (
                          <div className="flex justify-between">
                            <span className="text-gray-500">{t.addListing.color}</span>
                            <span className="font-semibold text-gray-900">{listing.herrenschuhe_color}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                {/* Babyschalen & Kindersitze Details */}
                {listing.babyschalen_kindersitze_color && (
                  <div className="mb-8">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">
                      {t.productDetail.details}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 text-sm pb-8 mb-8">
                      <div className="flex justify-between">
                        <span className="text-gray-500">{t.addListing.color}</span>
                        <span className="font-semibold text-gray-900">{listing.babyschalen_kindersitze_color}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Kinderzimmermöbel Details */}
                {listing.kinderzimmermobel_art && (
                  <div className="mb-8">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">
                      {t.productDetail.details}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 text-sm pb-8 mb-8">
                      <div className="flex justify-between">
                        <span className="text-gray-500">{t.productDetail.art}</span>
                        <span className="font-semibold text-gray-900">{listing.kinderzimmermobel_art}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Spielzeug Details */}
                {listing.spielzeug_art && (
                  <div className="mb-8">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">
                      {t.productDetail.details}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 text-sm pb-8 mb-8">
                      <div className="flex justify-between">
                        <span className="text-gray-500">{t.productDetail.art}</span>
                        <span className="font-semibold text-gray-900">{listing.spielzeug_art}</span>
                      </div>
                    </div>
                  </div>
                )}

                {listing.fische_art && (
                  <div className="mb-8">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">
                      {t.productDetail.details}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 text-sm pb-8 mb-8">
                      <div className="flex justify-between">
                        <span className="text-gray-500">{t.productDetail.art}</span>
                        <span className="font-semibold text-gray-900">{listing.fische_art}</span>
                      </div>
                    </div>
                  </div>
                )}


                {listing.haustier_zubehoer_art && (
                  <div className="mb-8">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">
                      {t.productDetail.details}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 text-sm pb-8 mb-8">
                      <div className="flex justify-between">
                        <span className="text-gray-500">{t.productDetail.art}</span>
                        <span className="font-semibold text-gray-900">{listing.haustier_zubehoer_art}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Hunde Details */}
                {(listing.hunde_art || listing.hunde_alter || listing.hunde_geimpft || listing.hunde_erlaubnis) && (
                  <div className="mb-8">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">
                      {t.productDetail.details}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 text-sm pb-8 mb-8">
                      {listing.hunde_art && (
                        <div className="flex justify-between">
                          <span className="text-gray-500">{t.productDetail.art}</span>
                          <span className="font-semibold text-gray-900">{listing.hunde_art}</span>
                        </div>
                      )}
                      {listing.hunde_alter && (
                        <div className="flex justify-between">
                          <span className="text-gray-500">{t.productDetail.age}</span>
                          <span className="font-semibold text-gray-900">{listing.hunde_alter}</span>
                        </div>
                      )}
                      {listing.hunde_geimpft && (
                        <div className="flex justify-between">
                          <span className="text-gray-500">{t.productDetail.vaccinatedAndChipped}</span>
                          <span className="font-semibold text-gray-900">{listing.hunde_geimpft}</span>
                        </div>
                      )}
                      {listing.hunde_erlaubnis && (
                        <div className="flex justify-between">
                          <span className="text-gray-500">{t.productDetail.officialPermission}</span>
                          <span className="font-semibold text-gray-900">{listing.hunde_erlaubnis}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Katzen Details */}
                {(listing.katzen_art || listing.katzen_alter || listing.katzen_geimpft || listing.katzen_erlaubnis) && (
                  <div className="mb-8">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">
                      {t.productDetail.details}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 text-sm pb-8 mb-8">
                      {listing.katzen_art && (
                        <div className="flex justify-between">
                          <span className="text-gray-500">{t.productDetail.art}</span>
                          <span className="font-semibold text-gray-900">{listing.katzen_art}</span>
                        </div>
                      )}
                      {listing.katzen_alter && (
                        <div className="flex justify-between">
                          <span className="text-gray-500">{t.productDetail.age}</span>
                          <span className="font-semibold text-gray-900">{listing.katzen_alter}</span>
                        </div>
                      )}
                      {listing.katzen_geimpft && (
                        <div className="flex justify-between">
                          <span className="text-gray-500">{t.productDetail.vaccinatedAndChipped}</span>
                          <span className="font-semibold text-gray-900">{listing.katzen_geimpft}</span>
                        </div>
                      )}
                      {listing.katzen_erlaubnis && (
                        <div className="flex justify-between">
                          <span className="text-gray-500">{t.productDetail.officialPermission}</span>
                          <span className="font-semibold text-gray-900">{listing.katzen_erlaubnis}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Kleintiere Details */}
                {(listing.kleintiere_art) && (
                  <div className="mb-8">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">
                      {t.productDetail.details}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 text-sm pb-8 mb-8">
                      {listing.kleintiere_art && (
                        <div className="flex justify-between">
                          <span className="text-gray-500">{t.productDetail.art}</span>
                          <span className="font-semibold text-gray-900">{listing.kleintiere_art}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Nutztiere Details */}
                {(listing.nutztiere_art) && (
                  <div className="mb-8">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">
                      {t.productDetail.details}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 text-sm pb-8 mb-8">
                      {listing.nutztiere_art && (
                        <div className="flex justify-between">
                          <span className="text-gray-500">{t.productDetail.art}</span>
                          <span className="font-semibold text-gray-900">{listing.nutztiere_art}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Pferde Details */}
                {(listing.pferde_art) && (
                  <div className="mb-8">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-neutral-50 mb-4">
                      {t.productDetail.details}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 text-sm pb-8 mb-8">
                      {listing.pferde_art && (
                        <div className="flex justify-between">
                          <span className="text-gray-500 dark:text-neutral-400">{t.productDetail.art}</span>
                          <span className="font-semibold text-gray-900 dark:text-neutral-50">{listing.pferde_art}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Vermisste Tiere Details */}
                {(listing.vermisste_tiere_status) && (
                  <div className="mb-8">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-neutral-50 mb-4">
                      {t.productDetail.details}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 text-sm pb-8 mb-8">
                      {listing.vermisste_tiere_status && (
                        <div className="flex justify-between">
                          <span className="text-gray-500 dark:text-neutral-400">{t.productDetail.status}</span>
                          <span className="font-semibold text-gray-900 dark:text-neutral-50">{listing.vermisste_tiere_status}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Vögel Details */}
                {(listing.voegel_art) && (
                  <div className="mb-8">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-neutral-50 mb-4">
                      {t.productDetail.details}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 text-sm pb-8 mb-8">
                      {listing.voegel_art && (
                        <div className="flex justify-between">
                          <span className="text-gray-500 dark:text-neutral-400">{t.productDetail.art}</span>
                          <span className="font-semibold text-gray-900 dark:text-neutral-50">{listing.voegel_art}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Taschen & Accessoires Details */}
                {listing.taschen_accessoires_art && (
                  <div className="mb-8">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">
                      {t.productDetail.details}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 text-sm pb-8 mb-8">
                      <div className="flex justify-between">
                        <span className="text-gray-500">{t.productDetail.art}</span>
                        <span className="font-semibold text-gray-900">{listing.taschen_accessoires_art}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Uhren & Schmuck Details */}
                {listing.uhren_schmuck_art && (
                  <div className="mb-8">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">
                      {t.productDetail.details}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 text-sm pb-8 mb-8">
                      <div className="flex justify-between">
                        <span className="text-gray-500">{t.productDetail.art}</span>
                        <span className="font-semibold text-gray-900">{listing.uhren_schmuck_art}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Beauty & Gesundheit Details */}
                {listing.beauty_gesundheit_art && (
                  <div className="mb-8">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">
                      {t.productDetail.details}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 text-sm pb-8 mb-8">
                      <div className="flex justify-between">
                        <span className="text-gray-500">{t.productDetail.art}</span>
                        <span className="font-semibold text-gray-900">{listing.beauty_gesundheit_art}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Elektronik Details */}
                {(listing.audio_hifi_art || listing.handy_telefon_art || listing.foto_art ||
                  listing.haushaltsgeraete_art || listing.konsolen_art ||
                  listing.pc_zubehoer_software_art || listing.tablets_reader_art || listing.tv_video_art ||
                  listing.notebooks_art || listing.pcs_art || listing.videospiele_art ||
                  listing.weitere_elektronik_art || listing.dienstleistungen_elektronik_art) && (
                    <div className="mb-8">
                      <h2 className="text-lg font-bold text-gray-900 dark:text-neutral-50 mb-4">
                        {t.productDetail.details}
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 text-sm pb-8 mb-8">
                        {listing.audio_hifi_art && (
                          <div className="flex justify-between">
                            <span className="text-gray-500 dark:text-neutral-400">{t.productDetail.art}</span>
                            <span className="font-semibold text-gray-900 dark:text-neutral-50">{listing.audio_hifi_art}</span>
                          </div>
                        )}
                        {listing.handy_telefon_art && (
                          <div className="flex justify-between">
                            <span className="text-gray-500 dark:text-neutral-400">{t.productDetail.art}</span>
                            <span className="font-semibold text-gray-900 dark:text-neutral-50">{listing.handy_telefon_art}</span>
                          </div>
                        )}
                        {listing.foto_art && (
                          <div className="flex justify-between">
                            <span className="text-gray-500 dark:text-neutral-400">{t.productDetail.art}</span>
                            <span className="font-semibold text-gray-900 dark:text-neutral-50">{listing.foto_art}</span>
                          </div>
                        )}
                        {listing.haushaltsgeraete_art && (
                          <div className="flex justify-between">
                            <span className="text-gray-500 dark:text-neutral-400">{t.productDetail.art}</span>
                            <span className="font-semibold text-gray-900 dark:text-neutral-50">{listing.haushaltsgeraete_art}</span>
                          </div>
                        )}
                        {listing.konsolen_art && (
                          <div className="flex justify-between">
                            <span className="text-gray-500 dark:text-neutral-400">{t.productDetail.art}</span>
                            <span className="font-semibold text-gray-900 dark:text-neutral-50">{listing.konsolen_art}</span>
                          </div>
                        )}
                        {listing.pc_zubehoer_software_art && (
                          <div className="flex justify-between">
                            <span className="text-gray-500 dark:text-neutral-400">{t.productDetail.art}</span>
                            <span className="font-semibold text-gray-900 dark:text-neutral-50">{listing.pc_zubehoer_software_art}</span>
                          </div>
                        )}
                        {listing.tablets_reader_art && (
                          <div className="flex justify-between">
                            <span className="text-gray-500 dark:text-neutral-400">{t.productDetail.art}</span>
                            <span className="font-semibold text-gray-900 dark:text-neutral-50">{listing.tablets_reader_art}</span>
                          </div>
                        )}
                        {listing.tv_video_art && (
                          <div className="flex justify-between">
                            <span className="text-gray-500 dark:text-neutral-400">{t.productDetail.art}</span>
                            <span className="font-semibold text-gray-900 dark:text-neutral-50">{listing.tv_video_art}</span>
                          </div>
                        )}
                        {listing.notebooks_art && (
                          <div className="flex justify-between">
                            <span className="text-gray-500 dark:text-neutral-400">{t.productDetail.art}</span>
                            <span className="font-semibold text-gray-900 dark:text-neutral-50">{listing.notebooks_art}</span>
                          </div>
                        )}
                        {listing.pcs_art && (
                          <div className="flex justify-between">
                            <span className="text-gray-500 dark:text-neutral-400">{t.productDetail.art}</span>
                            <span className="font-semibold text-gray-900 dark:text-neutral-50">{listing.pcs_art}</span>
                          </div>
                        )}
                        {listing.videospiele_art && (
                          <div className="flex justify-between">
                            <span className="text-gray-500 dark:text-neutral-400">{t.productDetail.art}</span>
                            <span className="font-semibold text-gray-900 dark:text-neutral-50">{listing.videospiele_art}</span>
                          </div>
                        )}
                        {listing.weitere_elektronik_art && (
                          <div className="flex justify-between">
                            <span className="text-gray-500 dark:text-neutral-400">{t.productDetail.art}</span>
                            <span className="font-semibold text-gray-900 dark:text-neutral-50">{listing.weitere_elektronik_art}</span>
                          </div>
                        )}
                        {listing.dienstleistungen_elektronik_art && (
                          <div className="flex justify-between">
                            <span className="text-gray-500 dark:text-neutral-400">{t.productDetail.art}</span>
                            <span className="font-semibold text-gray-900 dark:text-neutral-50">{listing.dienstleistungen_elektronik_art}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                {/* Altenpflege Details */}

                {listing.altenpflege_art && (
                  <div className="mb-8">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">
                      {t.productDetail.details}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 text-sm pb-8 mb-8">
                      <div className="flex justify-between">
                        <span className="text-gray-500">{t.productDetail.art}</span>
                        <span className="font-semibold text-gray-900">{listing.altenpflege_art}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Sprachkurse Details */}
                {listing.sprachkurse_art && (
                  <div className="mb-8">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">
                      {t.productDetail.details}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 text-sm pb-8 mb-8">
                      <div className="flex justify-between">
                        <span className="text-gray-500">{t.productDetail.art}</span>
                        <span className="font-semibold text-gray-900">{listing.sprachkurse_art}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Kunst & Gestaltung Details */}
                {listing.kunst_gestaltung_art && (
                  <div className="mb-8">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">
                      {t.productDetail.details}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 text-sm pb-8 mb-8">
                      <div className="flex justify-between">
                        <span className="text-gray-500">{t.productDetail.art}</span>
                        <span className="font-semibold text-gray-900">{listing.kunst_gestaltung_art}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Weiteres Haus & Garten Details */}
                {listing.weiteres_haus_garten_art && (
                  <div className="mb-8">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">
                      {t.productDetail.details}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 text-sm pb-8 mb-8">
                      <div className="flex justify-between">
                        <span className="text-gray-500">{t.productDetail.art}</span>
                        <span className="font-semibold text-gray-900">{listing.weiteres_haus_garten_art}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Küche & Esszimmer Details */}
                {listing.kueche_esszimmer_art && (
                  <div className="mb-8">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">
                      {t.productDetail.details}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 text-sm pb-8 mb-8">
                      <div className="flex justify-between">
                        <span className="text-gray-500">{t.productDetail.art}</span>
                        <span className="font-semibold text-gray-900">{listing.kueche_esszimmer_art}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Heimwerken (Ev Tadilatı) Details */}
                {listing.heimwerken_art && (
                  <div className="mb-8">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">
                      {t.productDetail.details}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 text-sm pb-8 mb-8">
                      <div className="flex justify-between">
                        <span className="text-gray-500">{t.productDetail.art}</span>
                        <span className="font-semibold text-gray-900">{listing.heimwerken_art}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Gartenzubehör & Pflanzen Details */}
                {listing.gartenzubehoer_art && (
                  <div className="mb-8">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">
                      {t.productDetail.details}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 text-sm pb-8 mb-8">
                      <div className="flex justify-between">
                        <span className="text-gray-500">{t.productDetail.art}</span>
                        <span className="font-semibold text-gray-900">{listing.gartenzubehoer_art}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Modellbau Details */}
                {listing.modellbau_art && (
                  <div className="mb-8">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">
                      {t.productDetail.details}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 text-sm pb-8 mb-8">
                      <div className="flex justify-between">
                        <span className="text-gray-500">{t.productDetail.art}</span>
                        <span className="font-semibold text-gray-900">{listing.modellbau_art}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Handarbeit & Basteln Details */}
                {listing.handarbeit_art && (
                  <div className="mb-8">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">
                      {t.productDetail.details}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 text-sm pb-8 mb-8">
                      <div className="flex justify-between">
                        <span className="text-gray-500">{t.productDetail.art}</span>
                        <span className="font-semibold text-gray-900">{listing.handarbeit_art}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Damenbekleidung / Kadın Giyimi Details */}
                {(listing.damenbekleidung_art || listing.damenbekleidung_marke || listing.damenbekleidung_size || listing.damenbekleidung_color) && (
                  <div className="mb-8">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">
                      {t.productDetail.details}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 text-sm pb-8 mb-8">
                      {listing.damenbekleidung_art && (
                        <div className="flex justify-between">
                          <span className="text-gray-500">{t.productDetail.art}</span>
                          <span className="font-semibold text-gray-900">{listing.damenbekleidung_art}</span>
                        </div>
                      )}
                      {listing.damenbekleidung_marke && (
                        <div className="flex justify-between">
                          <span className="text-gray-500">Marka</span>
                          <span className="font-semibold text-gray-900">{listing.damenbekleidung_marke}</span>
                        </div>
                      )}
                      {listing.damenbekleidung_size && (
                        <div className="flex justify-between">
                          <span className="text-gray-500">Beden</span>
                          <span className="font-semibold text-gray-900">{listing.damenbekleidung_size}</span>
                        </div>
                      )}
                      {listing.damenbekleidung_color && (
                        <div className="flex justify-between">
                          <span className="text-gray-500">Renk</span>
                          <span className="font-semibold text-gray-900">{listing.damenbekleidung_color}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Immobilien Details Section */}
                {(listing.category === 'Emlak' || listing.living_space || listing.rooms || listing.auf_zeit_wg_art || listing.wohnungstyp || listing.haustyp || listing.objektart || listing.grundstuecksart || listing.garage_type) && (
                  <div className="mb-8">

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 text-sm mt-4 pb-8 mb-8">
                      {listing.angebotsart && (
                        <div className="flex justify-between">
                          <span className="text-gray-500 dark:text-neutral-400">{t.productDetail.offerType}</span>
                          <span className="font-semibold text-gray-900 dark:text-neutral-50">{translateVal(listing.angebotsart)}</span>
                        </div>
                      )}
                      {listing.auf_zeit_wg_art && (
                        <div className="flex justify-between">
                          <span className="text-gray-500 dark:text-neutral-400">{t.productDetail.offerType}</span>
                          <span className="font-semibold text-gray-900 dark:text-neutral-50">{translateVal(listing.auf_zeit_wg_art)}</span>
                        </div>
                      )}
                      {listing.wohnungstyp && (
                        <div className="flex justify-between">
                          <span className="text-gray-500 dark:text-neutral-400">{t.productDetail.propertyType}</span>
                          <span className="font-semibold text-gray-900 dark:text-neutral-50">{translateVal(listing.wohnungstyp)}</span>
                        </div>
                      )}
                      {listing.haustyp && (
                        <div className="flex justify-between">
                          <span className="text-gray-500 dark:text-neutral-400">{t.productDetail.propertyType}</span>
                          <span className="font-semibold text-gray-900 dark:text-neutral-50">{translateVal(listing.haustyp)}</span>
                        </div>
                      )}
                      {listing.living_space && (
                        <div className="flex justify-between">
                          <span className="text-gray-500 dark:text-neutral-400">{['Ticari Emlak', 'Konteyner', 'Arsa & Bahçe'].includes(listing.sub_category) ? t.productDetail.totalArea : t.productDetail.livingSpace}</span>
                          <span className="font-semibold text-gray-900 dark:text-neutral-50">{listing.living_space} m²</span>
                        </div>
                      )}
                      {listing.rooms && (
                        <div className="flex justify-between">
                          <span className="text-gray-500 dark:text-neutral-400">{t.productDetail.rooms}</span>
                          <span className="font-semibold text-gray-900 dark:text-neutral-50">{listing.rooms}</span>
                        </div>
                      )}
                      {listing.floor !== undefined && listing.floor !== null && (
                        <div className="flex justify-between">
                          <span className="text-gray-500 dark:text-neutral-400">{t.productDetail.floor}</span>
                          <span className="font-semibold text-gray-900 dark:text-neutral-50">{listing.floor}</span>
                        </div>
                      )}
                      {listing.roommates && (
                        <div className="flex justify-between">
                          <span className="text-gray-500 dark:text-neutral-400">{t.productDetail.roommates}</span>
                          <span className="font-semibold text-gray-900 dark:text-neutral-50">{listing.roommates}</span>
                        </div>
                      )}
                      {listing.construction_year && (
                        <div className="flex justify-between">
                          <span className="text-gray-500 dark:text-neutral-400">{t.productDetail.constructionYear}</span>
                          <span className="font-semibold text-gray-900 dark:text-neutral-50">{listing.construction_year}</span>
                        </div>
                      )}
                      {listing.available_from && (
                        <div className="flex justify-between">
                          <span className="text-gray-500 dark:text-neutral-400">{t.productDetail.availableFrom}</span>
                          <span className="font-semibold text-gray-900 dark:text-neutral-50">
                            {listing.available_from.length === 7
                              ? new Date(listing.available_from + '-01').toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' })
                              : new Date(listing.available_from).toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                          </span>
                        </div>
                      )}
                      {listing.warm_rent && (
                        <div className="flex justify-between">
                          <span className="text-gray-500 dark:text-neutral-400">{t.productDetail.warmRent}</span>
                          <span className="font-semibold text-gray-900 dark:text-neutral-50">{listing.warm_rent.toLocaleString('tr-TR')} TL</span>
                        </div>
                      )}
                      {listing.price_per_sqm && (
                        <div className="flex justify-between">
                          <span className="text-gray-500 dark:text-neutral-400">{t.productDetail.pricePerSqm}</span>
                          <span className="font-semibold text-gray-900 dark:text-neutral-50">{listing.price_per_sqm.toLocaleString('tr-TR')} TL/m²</span>
                        </div>
                      )}
                      {listing.plot_area && (
                        <div className="flex justify-between">
                          <span className="text-gray-500 dark:text-neutral-400">{t.productDetail.plotArea}</span>
                          <span className="font-semibold text-gray-900 dark:text-neutral-50">{listing.plot_area} m²</span>
                        </div>
                      )}
                      {listing.grundstuecksart && (
                        <div className="flex justify-between">
                          <span className="text-gray-500 dark:text-neutral-400">{t.productDetail.plotType}</span>
                          <span className="font-semibold text-gray-900 dark:text-neutral-50">{translateVal(listing.grundstuecksart)}</span>
                        </div>
                      )}
                      {listing.objektart && (
                        <div className="flex justify-between">
                          <span className="text-gray-500 dark:text-neutral-400">{t.productDetail.objectType}</span>
                          <span className="font-semibold text-gray-900 dark:text-neutral-50">{translateVal(listing.objektart)}</span>
                        </div>
                      )}
                      {listing.garage_type && (
                        <div className="flex justify-between">
                          <span className="text-gray-500 dark:text-neutral-400">{t.productDetail.garage}</span>
                          <span className="font-semibold text-gray-900 dark:text-neutral-50">{translateVal(listing.garage_type)}</span>
                        </div>
                      )}
                      {listing.rental_type && (
                        <div className="flex justify-between">
                          <span className="text-gray-500 dark:text-neutral-400">{t.productDetail.rentalType}</span>
                          <span className="font-semibold text-gray-900 dark:text-neutral-50">{translateVal(listing.rental_type)}</span>
                        </div>
                      )}
                      {listing.online_viewing && (
                        <div className="flex justify-between">
                          <span className="text-gray-500 dark:text-neutral-400">{t.productDetail.onlineViewing}</span>
                          <span className="font-semibold text-gray-900 dark:text-neutral-50">{translateVal(listing.online_viewing)}</span>
                        </div>
                      )}
                      {listing.commission && (
                        <div className="flex justify-between">
                          <span className="text-gray-500 dark:text-neutral-400">{t.productDetail.commission}</span>
                          <span className="font-semibold text-gray-900 dark:text-neutral-50">{translateVal(listing.commission)}</span>
                        </div>
                      )}
                      {listing.lage && (
                        <div className="flex justify-between">
                          <span className="text-gray-500 dark:text-neutral-400">{t.productDetail.location}</span>
                          <span className="font-semibold text-gray-900 dark:text-neutral-50">{translateVal(listing.lage)}</span>
                        </div>
                      )}
                    </div>

                    {/* Tags Section for Features - Refined Styling */}
                    <div className="mt-8 space-y-8">
                      {listing.amenities?.length > 0 && (
                        <div>
                          <h3 className="text-base font-bold text-gray-900 dark:text-neutral-50 mb-4 flex items-center gap-2">
                            {t.productDetail.amenities}
                          </h3>
                          <div className="flex flex-wrap gap-x-8 gap-y-3">
                            {listing.amenities.map((item, i) => (
                              <span key={i} className="text-sm font-bold text-gray-800 dark:text-neutral-200 flex items-center gap-2">
                                <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                                {translateVal(item)}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      {listing.general_features?.length > 0 && (
                        <div>
                          <h3 className="text-base font-bold text-gray-900 dark:text-neutral-50 mb-4 flex items-center gap-2">
                            {t.productDetail.features}
                          </h3>
                          <div className="flex flex-wrap gap-x-8 gap-y-3">
                            {listing.general_features.map((item, i) => (
                              <span key={i} className="text-sm font-bold text-gray-800 dark:text-neutral-200 flex items-center gap-2">
                                <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                                {translateVal(item)}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      {listing.apartment_features?.length > 0 && (
                        <div>
                          <h3 className="text-base font-bold text-gray-900 dark:text-neutral-50 mb-4 flex items-center gap-2">
                            {t.productDetail.apartmentFeatures}
                          </h3>
                          <div className="flex flex-wrap gap-x-8 gap-y-3">
                            {listing.apartment_features.map((item, i) => (
                              <span key={i} className="text-sm font-bold text-gray-800 dark:text-neutral-200 flex items-center gap-2">
                                <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                                {translateVal(item)}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      {listing.house_features?.length > 0 && (
                        <div>
                          <h3 className="text-base font-bold text-gray-900 dark:text-neutral-50 mb-4 flex items-center gap-2">
                            {t.productDetail.houseFeatures}
                          </h3>
                          <div className="flex flex-wrap gap-x-8 gap-y-3">
                            {listing.house_features.map((item, i) => (
                              <span key={i} className="text-sm font-bold text-gray-800 dark:text-neutral-200 flex items-center gap-2">
                                <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                                {translateVal(item)}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Reise & Eventservices Details */}
                {listing.reise_eventservices_art && (
                  <div className="mb-8">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">
                      {t.productDetail.details}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 text-sm pb-8 border-b-2 border-gray-300 mb-8">
                      <div className="flex justify-between">
                        <span className="text-gray-500">{t.productDetail.art}</span>
                        <span className="font-semibold text-gray-900">{listing.reise_eventservices_art}</span>
                      </div>
                    </div>
                  </div>
                )}


                {/* Ürün Açıklaması */}
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-neutral-50 mb-4">{t.productDetail.description}</h2>
                  <p className="text-sm text-gray-700 dark:text-neutral-300 whitespace-pre-line leading-relaxed">
                    {description}
                  </p>
                </div>

                {/* Konum Haritası */}
                {(listing.city || listing.address) && (
                  <div className="mt-8 border-t border-gray-200 dark:border-white/5 pt-8">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-neutral-50 mb-4 flex items-center gap-2">
                      <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {t.productDetail.location || 'Konum'}
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-neutral-400 mb-4">
                      {listing.address ? `${listing.address}, ` : ''}{listing.district ? `${listing.district}, ` : ''}{listing.city}
                    </p>
                    <LocationMap city={listing.city} district={listing.district} address={listing.address} />
                  </div>
                )}

                {/* Çizgi - Rechtliche Angaben Ayırıcı - Only for commercial sellers */}
                {sellerProfile?.seller_type === 'Kurumsal Kullanıcı' && (
                  <>
                    <div className="border-t border-gray-200 dark:border-white/5 my-6"></div>

                    {/* Rechtliche Angaben */}
                    <div>
                      <button
                        onClick={() => setShowLegal(!showLegal)}
                        className="flex items-center justify-between w-full text-lg font-semibold text-gray-900 dark:text-neutral-50 hover:text-red-500 dark:hover:text-red-400"
                      >
                        <span>{t.productDetail.legalInfo}</span>
                        <svg
                          className={`w-5 h-5 transition-transform ${showLegal ? 'rotate-180' : ''}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      {showLegal && (
                        <div className="mt-4 text-sm text-gray-600 dark:text-neutral-400 space-y-2 border-t border-gray-100 dark:border-white/5 pt-4">
                          <p>{t.productDetail.legalText}</p>
                          <p className="font-medium text-gray-900 dark:text-neutral-50">{seller.name}</p>
                          <p>Örnek Mahallesi 123</p>
                          <p>34000 İstanbul</p>
                        </div>
                      )}
                    </div>
                  </>
                )}

              </div>

              {/* Satıcının Diğer Ürünleri */}
              {(() => {
                // TODO: Fetch seller's other listings from Supabase
                const sellerOtherListings = [];

                if (sellerOtherListings.length === 0) return null;

                return (
                  <div className="bg-white dark:bg-neutral-900 border border-transparent dark:border-white/5 rounded-lg shadow-lg p-6">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-neutral-50 mb-4">
                      {seller.name}'in Diğer İlanları
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {sellerOtherListings.map((otherListing) => (
                        <div
                          key={otherListing.id}
                          onClick={() => navigate(getListingUrl(otherListing))}
                          className="bg-gray-50 dark:bg-neutral-800 rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-pointer group border border-gray-200 dark:border-white/5"
                        >
                          <div className="relative">
                            <img
                              src={otherListing.images && otherListing.images[0] ? otherListing.images[0] : (otherListing.image || 'https://via.placeholder.com/300x200?text=No+Image')}
                              alt={otherListing.title}
                              className="w-full h-32 object-cover"
                            />
                            {/* Vitrin Badge - Inclusive check */}
                            {(otherListing.is_gallery || ['galerie', 'gallery', 'galeri', 'vitrin'].includes(otherListing.package_type?.toLowerCase())) && (
                              <div className="absolute top-2 right-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-2 py-1 rounded text-xs font-bold z-10">
                                ⭐ VİTRİN
                              </div>
                            )}
                            {(otherListing.package_type?.toLowerCase() === 'premium' || otherListing.package_type?.toLowerCase() === 'z_premium') && (
                              <div className="absolute top-2 right-2 bg-gradient-to-r from-amber-400 to-amber-600 text-white px-2 py-1 rounded text-xs font-bold z-10">
                                PREMIUM
                              </div>
                            )}
                          </div>
                          <div className="p-3">
                            <h3 className="text-xs font-medium text-gray-800 dark:text-neutral-200 mb-1 line-clamp-2 group-hover:text-red-500 dark:group-hover:text-red-400 transition-colors">
                              {otherListing.title}
                            </h3>
                            <div className="text-sm font-semibold text-gray-900 dark:text-neutral-50 mb-1">
                              {otherListing.price}
                            </div>
                            {otherListing.shipping && (
                              <div className="text-xs text-gray-500 dark:text-neutral-400 mb-1">
                                {otherListing.shipping}
                              </div>
                            )}
                            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-neutral-400">
                              <span>{otherListing.location}</span>
                              {otherListing.created_at && (
                                <div className="flex items-center gap-1">
                                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                  <span>{new Date(otherListing.created_at).toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' })}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    {sellerListingsCount > sellerOtherListings.length && (
                      <Link
                        to={sellerPath}
                        state={{ sellerProfile }}
                        className="mt-4 text-red-500 hover:text-red-600 font-medium text-sm block"
                      >
                        {t.productDetail.allListings.replace('{count}', sellerListingsCount)} →
                      </Link>
                    )}
                  </div>
                );
              })()}
            </div>



            {/* Sağ Taraf - Satıcı Profili */}
            <div className="lg:col-span-1">
              <div className={`bg-white dark:bg-neutral-900 border border-transparent dark:border-white/5 rounded-lg shadow-lg p-6 sticky top-4 ${isMobile ? 'pb-24' : ''}`}>
                {/* Satıcı Profil Bilgileri */}
                <div className="flex flex-row items-start gap-4 mb-4 pb-4 border-b dark:border-white/5 text-left">
                  <div className="flex flex-col items-center gap-3 flex-shrink-0">
                    <div className="relative inline-block">
                      <Link to={sellerPath} state={{ sellerProfile }}>
                        <img
                          key={seller.store_logo || seller.avatar_url || 'default-avatar'}
                          src={seller.store_logo || seller.avatar_url || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(seller.username || seller.full_name || 'User') + '&background=ef4444&color=fff&size=200'}
                          alt={seller.username || seller.full_name}
                          className="w-24 h-24 rounded-full object-cover cursor-pointer hover:opacity-90 transition-opacity border-4 border-gray-100 dark:border-neutral-800 shadow-sm"
                        />
                      </Link>
                      {seller.is_pro && (
                        <div className="absolute top-0 right-0 transform translate-x-1/4 -translate-y-1/4 bg-red-600 text-white text-[10px] font-black px-2.5 py-1 rounded-full border-2 border-white dark:border-neutral-900 shadow-lg z-10">
                          PRO
                        </div>
                      )}
                    </div>
                    {/* Satıcıyı Takip Et Butonu - Moved under Logo on Mobile */}
                    <button
                      onClick={async () => {
                        setFollowLoading(true);
                        await toggleFollowSeller(listing.user_id);
                        setFollowLoading(false);
                      }}
                      disabled={followLoading}
                      className={`w-full py-1.5 px-3 rounded-lg text-[10px] font-bold transition-all border flex items-center justify-center gap-1.5 ${isSellerFollowed(listing.user_id) ? 'bg-green-50 dark:bg-green-900/10 border-green-500 text-green-700 dark:text-green-400' : 'bg-gray-50 dark:bg-neutral-800 border-gray-200 dark:border-white/5 text-gray-700 dark:text-neutral-300 hover:bg-gray-100 dark:hover:bg-neutral-700'
                        } ${followLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {followLoading ? (
                        <LoadingSpinner size="small" />
                      ) : (
                        <>
                          <svg className={`w-3.5 h-3.5 ${isSellerFollowed(listing.user_id) ? 'text-green-500' : 'text-blue-500'}`} fill={isSellerFollowed(listing.user_id) ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          {isSellerFollowed(listing.user_id) ? t.productDetail.followingSeller : t.productDetail.followSeller}
                        </>
                      )}
                    </button>
                  </div>

                  <div className="flex-1 min-w-0 pt-1">
                    <Link
                      to={sellerPath}
                      state={{ sellerProfile }}
                      className="font-bold text-lg sm:text-xl text-gray-900 dark:text-neutral-50 cursor-pointer hover:text-red-500 transition-colors mb-2 flex items-center gap-1.5 truncate"
                    >
                      <span className="truncate">{listing.contact_name || seller.username || seller.full_name || t.productDetail.unknownSeller}</span>
                      <VerifiedBadge isVerified={seller.is_verified} size="sm" />
                    </Link>

                    {/* City Location */}
                    {/* City Location */}
                    {(listing.city || listing.address) && (
                      <div className="flex items-center gap-1.5 mb-2 text-sm text-gray-600 dark:text-neutral-400">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="font-medium">{listing.city || ''}</span>
                      </div>
                    )}

                    {!isCommercial && (
                      <div className="text-xs uppercase tracking-wide text-red-500 font-black mb-2">{sellerTypeLabel}</div>
                    )}

                    {/* Last Seen Indicator */}
                    <div className="flex items-center gap-1.5 mb-2 text-sm">
                      <div className={`w-2 h-2 rounded-full ${seller.last_seen && (new Date() - new Date(seller.last_seen)) < 5 * 60 * 1000 ? 'bg-green-500 animate-pulse' : 'bg-gray-400 dark:bg-neutral-600'}`}></div>
                      <span className="font-bold text-gray-700 dark:text-neutral-300">
                        {formatLastSeen(seller.last_seen)}
                      </span>
                    </div>

                    <div className="text-xs text-gray-500 dark:text-neutral-400 font-bold lowercase mb-2">
                      {t.productDetail.memberSince} <span className="capitalize">{activeSinceDisplay}</span>
                    </div>

                    {/* Seller Rating */}
                    {sellerRating && (
                      <div className="mt-2 flex justify-start scale-110 origin-left">
                        <RatingDisplay
                          userRating={sellerRating}
                          showDetails={false}
                          size="small"
                          center={false}
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Mesaj Gönderme Butonu - Hidden on Mobile per previous request */}
                <button
                  type="button"
                  onClick={() => setShowMessageModal(true)}
                  className="w-full border border-gray-300 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-neutral-800 text-gray-700 dark:text-neutral-300 font-semibold py-3 px-4 rounded-lg transition-colors mb-3 hidden sm:flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h0.01M12 12h0.01M16 12h0.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-0.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  {t.productDetail.message}
                </button>

                {/* Telefon Butonu */}
                {!showPhone ? (
                  <button
                    type="button"
                    onClick={() => setShowPhone(true)}
                    className="w-full border border-gray-300 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-neutral-800 text-gray-700 dark:text-neutral-300 font-semibold py-3 px-4 rounded-lg transition-colors mb-3 hidden sm:flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-0.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-0.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    {t.productDetail.call}
                  </button>
                ) : (
                  <a
                    href={listing.show_phone_number === true ? (listing.contact_phone ? `tel:${listing.contact_phone.replace(/\s+/g, '')}` : (seller?.phone ? `tel:${seller.phone.replace(/\s+/g, '')}` : '#')) : '#'}
                    className="w-full border border-gray-300 dark:border-white/10 hover:bg-green-50 dark:hover:bg-green-900/10 hover:border-green-500 text-gray-700 dark:text-neutral-300 hover:text-green-700 dark:hover:text-green-400 font-semibold py-3 px-4 rounded-lg transition-colors mb-3 hidden sm:flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-0.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-0.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    {listing.show_phone_number === true ? (listing.contact_phone || seller?.phone || t.productDetail.noPhoneNumber) : t.productDetail.noPhoneNumber}
                  </a>
                )}

                {/* Satıcının Diğer İlanlarına Hızlı Erişim */}
                {sellerListingsCount > 0 && (
                  <div className="mb-4 p-3 bg-gray-50 dark:bg-white/5 rounded-lg border border-gray-100 dark:border-white/5">
                    <span className="text-gray-900 dark:text-neutral-50 block mb-1">
                      {t.productDetail.moreListingsFrom.replace('{name}', seller.username || seller.full_name || seller.name || t.productDetail.unknownSeller)}
                    </span>
                    <Link
                      to={sellerPath}
                      state={{ sellerProfile }}
                      className="text-sm text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 font-medium block"
                    >
                      {t.productDetail.allListings.replace('{count}', '')} →
                    </Link>
                  </div>
                )}

                {/* Warenkorb Section Removed as per request for Autos & Wohnwagen */}                {/* Teilen & Drucken - Hidden on mobile */}
                <div className="mt-4 space-y-3 pt-4 border-t border-gray-100 dark:border-white/5 no-print hidden sm:block">
                  <div className="pt-2">
                    <p className="text-xs font-bold text-gray-500 dark:text-neutral-400 uppercase tracking-wider mb-3 px-1">{t.productDetail.share}</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          const url = window.location.href;
                          window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
                        }}
                        className="flex-1 bg-[#1877F2] text-white py-2.5 rounded-lg flex items-center justify-center hover:opacity-90 transition-all shadow-sm"
                        title="Facebook"
                      >
                        <svg className="w-5 h-5 fill-currentColor" viewBox="0 0 24 24">
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-0.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => {
                          const url = window.location.href;
                          const text = `${listing.title} ilanını ExVitrin'de keşfedin!`;
                          window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`, '_blank');
                        }}
                        className="flex-1 bg-[#25D366] text-white py-2.5 rounded-lg flex items-center justify-center hover:opacity-90 transition-all shadow-sm"
                        title="WhatsApp"
                      >
                        <svg className="w-5 h-5 fill-currentColor" viewBox="0 0 24 24">
                          <path d="M17.472 14.382c-0.297-0.149-1.758-0.867-2.03-0.967-0.273-0.099-0.471-0.148-0.67.15-0.197.297-0.767.966-0.94 1.164-0.173.199-0.347.223-0.644.075-0.297-0.15-1.255-0.463-2.39-1.475-0.883-0.788-1.48-1.761-1.653-2.059-0.173-0.297-0.018-0.458.13-0.606.134-0.133.298-0.347.446-0.52.149-0.174.198-0.298.298-0.497.099-0.198.05-0.371-0.025-0.52-0.075-0.149-0.669-1.612-0.916-2.207-0.242-0.579-0.487-0.5-0.669-0.51-0.173-0.008-0.371-0.01-0.57-0.01-0.198 0-0.52.074-0.792.372-0.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-0.085 1.758-0.719 2.006-1.413.248-0.694.248-1.289.173-1.413-0.074-0.124-0.272-0.198-0.57-0.347m-5.421 7.403h-0.004a9.27 9.27 0 01-4.723-1.292l-0.339-0.202-3.51.92 1.017-3.65-0.213-0.339a9.204 9.204 0 01-1.513-5.07c0-5.116 4.158-9.273 9.274-9.273 2.479 0 4.808.966 6.557 2.715a9.192 9.192 0 012.711 6.56c0 5.117-4.158 9.275-9.276 9.275m8.211-17.487A11.026 11.026 0 0012.048 1.177c-6.115 0-11.09 4.974-11.09 11.088 0 2.112.553 4.135 1.611 5.922L.787 23l4.981-1.304c1.722.94 3.655 1.437 5.626 1.437h.005c6.114 0 11.089-4.975 11.089-11.088 0-2.937-1.144-5.698-3.235-7.791z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => {
                          const url = window.location.href;
                          const text = `${listing.title} ilanını ExVitrin'de keşfedin!`;
                          window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
                        }}
                        className="flex-1 bg-zinc-700 shadow-sm text-white py-2.5 rounded-lg flex items-center justify-center hover:bg-zinc-800 hover:scale-105 transition-all border border-zinc-600"
                        title="X"
                      >
                        <svg className="w-5 h-5 fill-currentColor" viewBox="0 0 1200 1227">
                          <path d="M714.163 519.284L1160.89 0H1055.03L667.137 450.887L357.328 0H0L468.492 681.821L0 1226.37H105.866L515.491 750.218L842.672 1226.37H1200L714.137 519.284H714.163ZM569.165 687.828L521.697 619.934L144.011 79.6944H306.615L611.412 515.685L658.88 583.579L1055.08 1150.3H892.476L569.165 687.854V687.828Z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(window.location.href).then(() => {
                            alert('Bağlantı panoya kopyalandı!');
                          });
                        }}
                        className="flex-1 bg-gray-100 dark:bg-neutral-800 text-gray-700 dark:text-neutral-300 py-2.5 rounded-lg flex items-center justify-center hover:bg-gray-200 dark:hover:bg-neutral-700 transition-all shadow-sm"
                        title="Bağlantıyı Kopyala"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setPrintHideContact(false);
                      setTimeout(() => window.print(), 100);
                    }}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 dark:border-white/10 rounded-lg hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors text-gray-700 dark:text-neutral-300"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 9V2h12v7M6 18H5a2 2 0 01-2-2v-5h18v5a2 2 0 01-2 2h-1m-12 0h12v4H6v-4z" />
                    </svg>
                    {t.productDetail.printFlyer}
                  </button>
                  <button
                    onClick={() => setShowReportModal(true)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 dark:border-white/10 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/10 hover:text-red-600 dark:hover:text-red-400 hover:border-red-200 dark:hover:border-red-800 transition-colors text-gray-700 dark:text-neutral-300"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h0.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-0.77-1.333-2.694-1.333-3.464 0L3.34 16c-0.77 1.333.192 3 1.732 3z" />
                    </svg>
                    {t.productDetail.report}
                  </button>
                </div>

                {/* Sicherheitstipps - Moved back into the panel per user request */}
                <div className="mt-6 pt-0 md:pt-6 border-t-0 md:border-t border-gray-100 dark:border-white/5">
                  <div className="flex items-start gap-2 mb-3">
                    <h3 className="font-semibold text-gray-900 dark:text-neutral-50">{t.productDetail.safetyTips}:</h3>
                  </div>
                  <ul className="space-y-2 text-sm text-gray-700 dark:text-neutral-300">
                    <li className="flex items-start gap-2">
                      <span className="text-yellow-600 dark:text-yellow-500 mt-0.5">•</span>
                      <span>{t.productDetail.safetyTip1}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-yellow-600 dark:text-yellow-500 mt-0.5">•</span>
                      <span>{t.productDetail.safetyTip2}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-yellow-600 dark:text-yellow-500 mt-0.5">•</span>
                      <span>{t.productDetail.safetyTip3}</span>
                    </li>
                  </ul>
                </div>
              </div>

            </div>
          </div>

          {/* Report Modal */}
          <ReportModal
            isOpen={showReportModal}
            onClose={() => setShowReportModal(false)}
            onSubmit={handleReportSubmit}
            reason={reportReason}
            setReason={setReportReason}
            description={reportDescription}
            setDescription={setReportDescription}
          />

          {/* Share Modal */}
          <ShareModal
            isOpen={showShareModal}
            onClose={() => setShowShareModal(false)}
            url={window.location.href}
            title={listing?.title}
          />

          {/* Seller's Recent Listings */}
          {sellerRecentListings.length > 0 && (
            <div className="mt-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-base md:text-xl font-bold text-gray-900 dark:text-neutral-50">
                  Bu Satıcının Diğer İlanları
                </h2>
                <Link
                  to={sellerPath}
                  state={{ sellerProfile }}
                  className="text-sm md:text-base text-red-600 hover:text-red-700 font-semibold transition-colors flex items-center gap-1"
                >
                  Tümünü Gör
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 md:gap-6">
                {sellerRecentListings.map(item => (
                  <ListingCard
                    key={item.id}
                    listing={item}
                    toggleFavorite={toggleFavorite}
                    isFavorite={isFavorite}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Category Related Listings */}
          {categoryListings.length > 0 && (
            <div className="mt-12 mb-12">
              <h2 className="text-base md:text-xl font-bold text-gray-900 dark:text-neutral-50 mb-6">
                {listing?.category} Kategorisindeki Benzer İlanlar
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 md:gap-6">
                {categoryListings.map(item => (
                  <ListingCard
                    key={item.id}
                    listing={item}
                    toggleFavorite={toggleFavorite}
                    isFavorite={isFavorite}
                  />
                ))}
              </div>
            </div>
          )}
          {/* Mobile Sticky Contact Buttons */}
          {isMobile && !isOwnListing && (
            <div className="fixed bottom-16 left-0 right-0 z-[100] bg-white/80 dark:bg-neutral-950/80 backdrop-blur-md border-t border-gray-200 dark:border-white/10 p-4 flex gap-3 pb-safe no-print">
              <button
                id="mobile-contact-message"
                onClick={() => setShowMessageModal(true)}
                className="flex-1 bg-red-600 text-white font-bold text-sm py-3.5 px-4 rounded-xl shadow-lg hover:bg-red-700 transition-all flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h0.01M12 12h0.01M16 12h0.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-0.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                {t.productDetail.message}
              </button>
              {(!showPhone) ? (
                <button
                  id="mobile-contact-phone-reveal"
                  onClick={() => setShowPhone(true)}
                  className="flex-1 bg-white border-2 border-green-600 text-green-700 font-bold text-sm py-3.5 px-4 rounded-xl shadow-md hover:bg-green-50 transition-all flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-0.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-0.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  {t.productDetail.call}
                </button>
              ) : (
                <a
                  id="mobile-contact-call"
                  href={listing.show_phone_number === true ? (listing.contact_phone ? `tel:${listing.contact_phone.replace(/\s+/g, '')}` : (seller?.phone ? `tel:${seller.phone.replace(/\s+/g, '')}` : '#')) : '#'}
                  className="flex-1 bg-green-600 text-white font-bold text-sm py-3.5 px-4 rounded-xl shadow-lg hover:bg-green-700 transition-all flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-0.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-0.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  {listing.show_phone_number === true ? (listing.contact_phone || seller?.phone || t.productDetail.noPhoneNumber) : t.productDetail.noPhoneNumber}
                </a>
              )}
            </div>
          )}
        </div>
      </div>

      <MessageModal
        isOpen={showMessageModal}
        onClose={() => setShowMessageModal(false)}
        onSubmit={handleModalSubmit}
        sellerName={seller?.username || seller?.name || seller?.full_name}
        listingTitle={listing?.title}
      />
    </>
  );
};

export default ProductDetail;
