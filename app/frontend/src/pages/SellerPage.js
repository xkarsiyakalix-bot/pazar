import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { t } from '../translations';
import { LazyImage } from '../components/LazyImage';
import { formatLastSeen } from '../utils/formatUtils';
import MessageModal from '../components/MessageModal';
import LoadingSpinner from '../components/LoadingSpinner';
import { RatingDisplay } from '../components/RatingDisplay';
import { RatingsList } from '../components/RatingsList';
import { HorizontalListingCard } from '../components/HorizontalListingCard';
import { SellerSEO } from '../SEO';

export const SellerProfile = ({ toggleFavorite, isFavorite, toggleFollowSeller, isSellerFollowed }) => {
  const { sellerId } = useParams();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState(t.sellerProfile.all);

  const [seller, setSeller] = useState(null);
  const [sellerListings, setSellerListings] = useState([]);
  const [sellerRating, setSellerRating] = useState(null);
  const [sellerRatings, setSellerRatings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSellerData = async () => {
      try {
        setLoading(true);
        // Fetch listings
        const { fetchUserListings } = await import('../api/listings');
        const listings = await fetchUserListings(sellerId);
        setSellerListings(listings);

        // Fetch seller profile
        const { fetchUserProfile } = await import('../api/profile');
        const profile = await fetchUserProfile(sellerId);

        if (profile) {
          // If accessed with UUID but profile has a clean user_number, redirect
          if (profile.user_number && String(sellerId) !== String(profile.user_number)) {
            navigate(`/seller/${profile.user_number}`, { replace: true });
            return;
          }

          setSeller({
            id: sellerId,
            name: profile.username || profile.full_name || (listings.length > 0 ? listings[0].sellerName : t.cart.seller),
            rating: 4.5,
            totalSales: listings.length,
            memberSince: profile.created_at,
            profileImage: profile.store_logo || profile.avatar_url || (listings.length > 0 ? listings[0].sellerAvatar : null),
            seller_type: profile.seller_type,
            is_commercial: profile.is_commercial
          });
        } else if (listings.length > 0) {
          // Fallback to listing data if profile fetch fails
          setSeller({
            id: sellerId,
            name: listings[0].sellerName || t.cart.seller,
            rating: 4.5,
            totalSales: listings.length
          });
        }
      } catch (error) {
        console.error('Error loading seller data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadSellerData();
  }, [sellerId]);

  const [showMessageModal, setShowMessageModal] = useState(false);

  useEffect(() => {
    if (sellerId) {
      const loadRatings = async () => {
        try {
          const { getUserRating, getRatings } = await import('../api/ratings');
          const rating = await getUserRating(sellerId);
          setSellerRating(rating);

          const ratingsList = await getRatings(sellerId);
          setSellerRatings(ratingsList || []);
        } catch (error) {
          console.error('Error loading ratings:', error);
        }
      };
      loadRatings();
    }
  }, [sellerId]);

  const handleModalSubmit = async (message) => {
    try {
      const { sendMessage } = await import('../api/messages');
      await sendMessage(seller.id, message, null);
      alert(t.sellerProfile.messageSuccess);
      setShowMessageModal(false);
    } catch (error) {
      alert(t.sellerProfile.messageError);
    }
  };

  if (!seller) return <Navigate to="/" replace />;

  // Calculate categories and counts
  const categories = sellerListings.reduce((acc, listing) => {
    const cat = listing.category || t.common.others;
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, { [t.sellerProfile.all]: sellerListings.length });

  // Filter listings
  const filteredListings = selectedCategory === t.sellerProfile.all
    ? sellerListings
    : sellerListings.filter(l => (l.category || t.common.others) === selectedCategory);

  const activeSinceDisplay = (seller.memberSince || seller.created_at)
    ? new Date(seller.memberSince || seller.created_at).toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' })
    : (seller.activeSince || '-');

  // Determine seller type label
  const sellerTypeLabel = seller.seller_type === 'Kurumsal Kullanıcı' ? t.addListing.commercial : t.addListing.private;

  return (
    <div className="min-h-screen bg-gray-50">
      <SellerSEO seller={seller} listingCount={sellerListings.length} />
      <div className="max-w-7xl mx-auto px-4 py-6">
        <button
          onClick={() => navigate(-1)}
          className="mb-4 text-red-500 hover:text-red-600 flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          {t.productDetail.back}
        </button>

        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <img
              src={seller.profileImage}
              alt={seller.name}
              className="w-24 h-24 rounded-full object-cover border-4 border-gray-100"
            />
            <div className="text-center md:text-left flex-1">
              <h1 className="text-2xl font-bold text-gray-900">{seller.name}</h1>
              <div className={`text-sm uppercase tracking-wide font-semibold mt-1 flex items-center gap-2 ${seller.is_commercial ? 'text-blue-600' : 'text-gray-500'}`}>
                {seller.is_commercial && (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                )}
                {seller.is_commercial ? 'Kurumsal Mağaza' : sellerTypeLabel}
              </div>
              <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-3 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {t.productDetail.memberSince}: {activeSinceDisplay}
                </div>
                <div className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  {t.productDetail.listingsOnline.replace('{count}', sellerListings.length)}
                </div>
                {seller.rating > 0 && (
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-0.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                    {seller.rating} ({seller.totalRatings} {t.productDetail.ratings})
                  </div>
                )}
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => toggleFollowSeller(seller.id)}
                className={`px-6 py-2 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 font-medium ${isSellerFollowed(seller.id) ? 'bg-green-50 border border-green-500 text-green-700' : 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700'}`}
              >
                {isSellerFollowed(seller.id) ? t.sellerProfile.followed : t.sellerProfile.follow}
              </button>
              <button
                onClick={() => setShowMessageModal(true)}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                {t.sellerProfile.message}
              </button>
            </div>
          </div>
        </div>

        <MessageModal
          isOpen={showMessageModal}
          onClose={() => setShowMessageModal(false)}
          onSubmit={handleModalSubmit}
          sellerName={seller.name}
          listingTitle={t.sellerProfile.inquiryToSeller}
        />

        {/* Satıcı Değerlendirmeleri */}
        {sellerRating && sellerRating.count > 0 && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="mb-4">
              <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                <svg className="w-6 h-6 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-0.921 1.603-0.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-0.363 1.118l1.518 4.674c.3.922-0.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-0.783.57-1.838-0.197-1.538-1.118l1.518-4.674a1 1 0 00-0.363-1.118l-3.976-2.888c-0.784-0.57-0.38-1.81.588-1.81h4.914a1 1 0 00.951-0.69l1.519-4.674z" />
                </svg>
                Satıcı Değerlendirmeleri
              </h2>
              <div className="flex items-center gap-3 mb-4">
                <RatingDisplay
                  userRating={sellerRating}
                  showDetails={false}
                  size="medium"
                />
              </div>
            </div>
            <RatingsList ratings={sellerRatings} />
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-8">
          {/* Sidebar Categories */}
          <div className="sm:w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm p-4 sticky top-4">
              <h3 className="font-semibold text-gray-900 mb-4 pb-2 border-b">{t.sellerProfile.categories}</h3>
              <ul className="space-y-2">
                {Object.entries(categories).map(([category, count]) => (
                  <li key={category}>
                    <button
                      onClick={() => setSelectedCategory(category)}
                      className={`w-full flex items-center justify-between text-sm px-2 py-1.5 rounded-md transition-colors ${selectedCategory === category
                        ? 'bg-red-50 text-red-600 font-medium'
                        : 'text-gray-600 hover:bg-gray-50'
                        }`}
                    >
                      <span>{category}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${selectedCategory === category
                        ? 'bg-red-100 text-red-800'
                        : 'bg-gray-100 text-gray-500'
                        }`}>
                        ({count})
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Listings Grid */}
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {selectedCategory === t.sellerProfile.all ? t.sellerProfile.activeListings : selectedCategory} - {seller.name}
            </h2>
            <div className="flex flex-col gap-4">
              {filteredListings.map((listing) => (
                <HorizontalListingCard
                  key={listing.id}
                  listing={listing}
                  toggleFavorite={toggleFavorite}
                  isFavorite={isFavorite}
                  compact={true}
                />
              ))}
              {filteredListings.length === 0 && (
                <div className="text-center py-12 text-gray-500 bg-white rounded-lg border border-dashed border-gray-300">
                  {t.sellerProfile.sellerNotFound}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Satıcı Sayfası Bileşeni
export const SellerPage = ({ toggleFavorite, isFavorite, toggleFollowSeller, isSellerFollowed }) => {

  const { sellerId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const [seller, setSeller] = useState(location.state?.sellerProfile || location.state?.seller || null);
  const [sellerListings, setSellerListings] = useState([]);
  const [loading, setLoading] = useState(!(location.state?.sellerProfile || location.state?.seller));
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(t.sellerProfile.all);
  const [activeTab, setActiveTab] = useState('listings');
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [followLoading, setFollowLoading] = useState(false);
  const [ratings, setRatings] = useState([]);
  const [averageRating, setAverageRating] = useState({ average: 0, count: 0 });
  const [showPhone, setShowPhone] = useState(false);
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 768 : false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const isOwnProfile = user && seller && user.id === seller.id;
  const sellerPhone = seller?.phone || seller?.contact_phone || sellerListings.find(l => l.contact_phone)?.contact_phone || null;

  useEffect(() => {
    const loadSellerData = async () => {
      if (!sellerId) return;
      try {
        setLoading(true);
        const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(sellerId);
        let profile;
        const { fetchUserProfile, fetchUserProfileByNumber } = await import('../api/profile');
        if (isUUID) {
          profile = await fetchUserProfile(sellerId);
        } else {
          profile = await fetchUserProfileByNumber(sellerId);
        }

        if (!profile) throw new Error('Profile not found');
        setSeller(profile);

        const { fetchUserListings } = await import('../api/listings');
        const listings = await fetchUserListings(profile.id);
        setSellerListings(listings);

        const { getFollowersCount } = await import('../api/follows');
        const count = await getFollowersCount(profile.id);
        setFollowersCount(count);

        const { fetchUserRatings } = await import('../api/ratings');
        const ratingData = await fetchUserRatings(profile.id);
        setRatings(ratingData);

        if (ratingData.length > 0) {
          const avg = ratingData.reduce((acc, r) => acc + r.rating, 0) / ratingData.length;
          setAverageRating({ average: avg.toFixed(1), count: ratingData.length });
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadSellerData();
  }, [sellerId]);

  const handleModalSubmit = async (message) => {
    try {
      const { sendMessage } = await import('../api/messages');
      await sendMessage(seller.id, message, null);
      alert(t.sellerProfile.messageSuccess);
      setShowMessageModal(false);
    } catch (error) {
      alert(t.sellerProfile.messageError);
    }
  };



  const sellerCategories = sellerListings.reduce((acc, listing) => {
    const cat = listing.category;
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {});

  const filteredListings = selectedCategory === t.sellerProfile.all
    ? sellerListings
    : sellerListings.filter(l => l.category === selectedCategory);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black"><LoadingSpinner /></div>;
  if (!seller) return <Navigate to="/" replace />;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F8F9FA] via-gray-50/70 to-neutral-100/50 dark:from-black dark:via-neutral-950 dark:to-neutral-900 text-neutral-900 dark:text-neutral-100 transition-colors duration-300 pb-20 sm:pb-12">
      <SellerSEO seller={seller} listingCount={sellerListings.length} averageRating={averageRating.average} />
      
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-6 sm:py-8">
        {/* Üst Navigasyon / Geri Dön & Durum */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md border border-neutral-200/80 dark:border-white/10 text-neutral-600 dark:text-neutral-400 hover:text-red-600 dark:hover:text-red-400 font-bold text-xs uppercase tracking-wider shadow-sm hover:shadow active:scale-95 transition-all"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>{t.productDetail.back}</span>
          </button>

          <div className="flex items-center gap-2 text-xs font-semibold text-neutral-500 dark:text-neutral-400">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/70 dark:bg-neutral-900/70 backdrop-blur-sm border border-neutral-200/60 dark:border-white/10 shadow-xs">
              <span className={`w-2 h-2 rounded-full ${seller.last_seen && (new Date() - new Date(seller.last_seen)) < 5 * 60 * 1000 ? 'bg-green-500 animate-pulse' : 'bg-neutral-400'}`}></span>
              <span>{seller.last_seen && (new Date() - new Date(seller.last_seen)) < 5 * 60 * 1000 ? 'Çevrimiçi' : formatLastSeen(seller.last_seen)}</span>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* Sol Kolon - Profil Kartı ve Kategoriler */}
          <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-6">
            
            {/* 1. Satıcı Profil Kartı */}
            <div className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border border-neutral-200/80 dark:border-white/10 overflow-hidden group transition-all duration-300">
              {/* Profil Arka Plan Başlığı */}
              <div className="h-36 bg-gradient-to-r from-red-600 via-rose-600 to-neutral-900 dark:from-red-950 dark:via-neutral-900 dark:to-neutral-950 relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.2)_0%,transparent_60%)]"></div>
                <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
                <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-white/90 dark:from-neutral-900/90 to-transparent"></div>
              </div>

              <div className="px-6 pb-6 -mt-16 relative z-10 text-center">
                {/* Avatar */}
                <div className="mb-4 relative inline-block">
                  <div className="relative">
                    {(seller.store_logo || seller.avatar_url) ? (
                      <img
                        src={seller.store_logo || seller.avatar_url}
                        alt={seller.full_name}
                        className="w-28 h-28 rounded-2xl object-cover ring-4 ring-white dark:ring-neutral-900 mx-auto shadow-xl relative z-10 group-hover:scale-[1.02] transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-28 h-28 rounded-2xl ring-4 ring-white dark:ring-neutral-900 mx-auto shadow-xl relative z-10 bg-gradient-to-br from-red-50 to-rose-100 dark:from-neutral-800 dark:to-neutral-700 flex items-center justify-center text-4xl font-black text-red-500 dark:text-neutral-200">
                        {seller.full_name?.charAt(0) || '?'}
                      </div>
                    )}
                    {seller.last_seen && (new Date() - new Date(seller.last_seen)) < 5 * 60 * 1000 && (
                      <div className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 ring-2 ring-white dark:ring-neutral-900 rounded-full z-20 shadow-sm" title="Çevrimiçi"></div>
                    )}
                  </div>
                </div>

                {/* İsim ve Rozet */}
                <div className="mb-4">
                  <h2 className="text-2xl font-black text-neutral-900 dark:text-neutral-50 tracking-tight leading-snug">
                    {seller.full_name || t.productDetail.unknownSeller}
                  </h2>
                  <div className="flex items-center justify-center gap-2 mt-2">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider ${(seller.sellerType || seller.seller_type) === 'Kurumsal Kullanıcı'
                      ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200/80 dark:border-blue-800/40'
                      : 'bg-neutral-100 dark:bg-neutral-800/80 text-neutral-700 dark:text-neutral-300 border border-neutral-200/80 dark:border-white/10'
                      }`}>
                      {(seller.sellerType || seller.seller_type) === 'Kurumsal Kullanıcı' ? (
                        <>
                          <svg className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd" />
                          </svg>
                          <span>{t.addListing.commercial}</span>
                        </>
                      ) : (
                        <>
                          <svg className="w-3.5 h-3.5 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          <span>{t.addListing.private}</span>
                        </>
                      )}
                    </span>
                  </div>
                </div>

                {/* Üyelik Bilgisi */}
                <div className="flex items-center justify-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400 mb-5 font-medium">
                  <svg className="w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>{t.sellerProfile.memberSince}: {(seller.created_at || seller.memberSince) ? new Date(seller.created_at || seller.memberSince).toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' }) : 'N/A'}</span>
                </div>

                {/* 3'lü İstatistik Şeridi */}
                <div className="grid grid-cols-3 gap-2 mb-6">
                  <div className="bg-neutral-50/80 dark:bg-neutral-800/50 rounded-xl p-2.5 border border-neutral-100 dark:border-white/5 transition-all hover:bg-neutral-100/80 dark:hover:bg-neutral-800">
                    <div className="text-lg font-black text-neutral-900 dark:text-neutral-100 mb-0.5">{sellerListings.length}</div>
                    <div className="text-[10px] text-neutral-500 dark:text-neutral-400 font-bold uppercase tracking-wider">{t.sellerProfile.listings}</div>
                  </div>
                  <div className="bg-neutral-50/80 dark:bg-neutral-800/50 rounded-xl p-2.5 border border-neutral-100 dark:border-white/5 transition-all hover:bg-neutral-100/80 dark:hover:bg-neutral-800">
                    <div className="text-lg font-black text-neutral-900 dark:text-neutral-100 mb-0.5">{followersCount}</div>
                    <div className="text-[10px] text-neutral-500 dark:text-neutral-400 font-bold uppercase tracking-wider">{t.sellerProfile.followers}</div>
                  </div>
                  <div className="bg-neutral-50/80 dark:bg-neutral-800/50 rounded-xl p-2.5 border border-neutral-100 dark:border-white/5 transition-all hover:bg-neutral-100/80 dark:hover:bg-neutral-800">
                    <div className="text-lg font-black text-amber-500 flex items-center justify-center gap-1 mb-0.5">
                      <span>★</span>
                      <span>{averageRating.count > 0 ? averageRating.average : '-'}</span>
                    </div>
                    <div className="text-[10px] text-neutral-500 dark:text-neutral-400 font-bold uppercase tracking-wider">{averageRating.count} Yorum</div>
                  </div>
                </div>

                {/* Aksiyon Butonları (Şeffaf / Frosted Glass) */}
                {!isOwnProfile && (
                  <div className="flex flex-col gap-2.5">
                    {/* Takip Et / Takip Ediliyor */}
                    <button
                      onClick={async () => {
                        setFollowLoading(true);
                        await toggleFollowSeller(seller.id);
                        try {
                          const { getFollowersCount } = await import('../api/follows');
                          const newCount = await getFollowersCount(seller.id);
                          setFollowersCount(newCount);
                        } catch (error) {
                          console.error('Error refreshing follower count:', error);
                        }
                        setFollowLoading(false);
                      }}
                      disabled={followLoading}
                      className={`w-full h-12 font-bold text-sm px-4 rounded-xl border transition-all duration-200 flex items-center justify-center gap-2 active:scale-95 shadow-sm ${
                        isSellerFollowed(seller.id)
                          ? 'bg-green-50/90 dark:bg-green-950/40 backdrop-blur-sm border-green-200/80 dark:border-green-800/40 text-green-700 dark:text-green-400'
                          : 'bg-white/90 dark:bg-neutral-900/90 backdrop-blur-sm border-gray-200/80 dark:border-white/10 text-gray-800 dark:text-neutral-100 hover:bg-white dark:hover:bg-neutral-800'
                      } ${followLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {followLoading ? (
                        <LoadingSpinner size="small" />
                      ) : isSellerFollowed(seller.id) ? (
                        <>
                          <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                          </svg>
                          <span>{t.sellerProfile.followed}</span>
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                          </svg>
                          <span>{t.sellerProfile.follow}</span>
                        </>
                      )}
                    </button>

                    {/* Mesaj Gönder */}
                    <button
                      onClick={() => setShowMessageModal(true)}
                      className="w-full h-12 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-sm border border-gray-200/80 dark:border-white/10 text-gray-800 dark:text-neutral-100 hover:bg-white dark:hover:bg-neutral-800 font-bold text-sm px-4 rounded-xl shadow-sm active:scale-95 transition-all flex items-center justify-center gap-2"
                    >
                      <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h0.01M12 12h0.01M16 12h0.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-0.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      <span>{t.sellerProfile.message}</span>
                    </button>

                    {/* Ara (Telefon) */}
                    {sellerPhone && (
                      !showPhone ? (
                        <button
                          onClick={() => setShowPhone(true)}
                          className="w-full h-12 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-sm border border-gray-200/80 dark:border-white/10 text-gray-800 dark:text-neutral-100 hover:bg-white dark:hover:bg-neutral-800 font-bold text-sm px-4 rounded-xl shadow-sm active:scale-95 transition-all flex items-center justify-center gap-2"
                        >
                          <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-0.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-0.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                          <span>{t.productDetail.call || 'Ara'}</span>
                        </button>
                      ) : (
                        <a
                          href={`tel:${sellerPhone.replace(/\s+/g, '')}`}
                          className="w-full h-12 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-sm border border-green-500/40 dark:border-green-500/30 text-green-700 dark:text-green-400 font-bold text-sm px-4 rounded-xl shadow-sm active:scale-95 transition-all flex items-center justify-center gap-2"
                        >
                          <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-0.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-0.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                          <span className="truncate">{sellerPhone}</span>
                        </a>
                      )
                    )}
                  </div>
                )}

                {/* Profili Paylaş */}
                <div className="mt-6 pt-5 border-t border-neutral-100 dark:border-white/5 flex flex-col items-center">
                  <p className="text-[10px] text-neutral-400 dark:text-neutral-500 font-black uppercase tracking-[0.2em] mb-3">{t.sellerProfile.shareProfile || 'Profili Paylaş'}</p>
                  <div className="flex justify-center gap-2.5">
                    {[
                      { icon: <svg className="w-4 h-4 fill-currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>, color: 'bg-[#1877F2] hover:bg-[#166fe5]', action: 'facebook', label: 'Facebook' },
                      { icon: <svg className="w-4 h-4 fill-currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.27 9.27 0 01-4.723-1.292l-.339-.202-3.51.92 1.017-3.65-.213-.339a9.204 9.204 0 01-1.513-5.07c0-5.116 4.158-9.273 9.274-9.273 2.479 0 4.808.966 6.557 2.715a9.192 9.192 0 012.711 6.56c0 5.117-4.158 9.275-9.276 9.275m8.211-17.487A11.026 11.026 0 0012.048 0C5.404 0 0 5.404 0 12.048c0 2.225.61 4.307 1.67 6.09L0 24l6.025-1.58a12.02 12.02 0 005.997 1.527h.005c6.64 0 12.042-5.403 12.042-12.047 0-3.217-1.253-6.24-3.386-8.52z" /></svg>, color: 'bg-[#25D366] hover:bg-[#1dbd58]', action: 'whatsapp', label: 'WhatsApp' },
                      { icon: <svg className="w-4 h-4 fill-currentColor" viewBox="0 0 1200 1227"><path d="M714.163 519.284L1160.89 0H1055.03L667.137 450.887L357.328 0H0L468.492 681.821L0 1226.37H105.866L515.491 750.218L842.672 1226.37H1200L714.137 519.284H714.163ZM569.165 687.828L521.697 619.934L144.011 79.6944H306.615L611.412 515.685L658.88 583.579L1055.08 1150.3H892.476L569.165 687.854V687.828Z" /></svg>, color: 'bg-neutral-900 hover:bg-black dark:bg-neutral-700 dark:hover:bg-neutral-600', action: 'twitter', label: 'X' },
                      { icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg>, color: 'bg-neutral-500 hover:bg-neutral-600', action: 'copy', label: 'Kopyala' },
                    ].map((social, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          const url = window.location.href;
                          if (social.action === 'facebook') window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
                          if (social.action === 'whatsapp') window.open(`https://wa.me/?text=${encodeURIComponent(url)}`, '_blank');
                          if (social.action === 'twitter') window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}`, '_blank');
                          if (social.action === 'copy') {
                            navigator.clipboard.writeText(url).then(() => alert('Profil linki kopyalandı!'));
                          }
                        }}
                        title={social.label}
                        className={`w-9 h-9 ${social.color} text-white rounded-xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-sm`}
                      >
                        {social.icon}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Kategoriler Kartı (Tamamen Yenilendi) */}
            <div className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border border-neutral-200/80 dark:border-white/10 p-5">
              <div className="flex items-center justify-between pb-3.5 mb-3 border-b border-neutral-100 dark:border-white/5">
                <span className="text-xs font-black uppercase tracking-[0.15em] text-neutral-600 dark:text-neutral-300 flex items-center gap-2">
                  <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                  <span>{t.sellerProfile.categories}</span>
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400">
                  {Object.keys(sellerCategories).length + 1}
                </span>
              </div>

              <nav className="space-y-1.5">
                {/* Tümü Seçeneği */}
                <button
                  onClick={() => setSelectedCategory(t.sellerProfile.all)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all duration-200 ${
                    selectedCategory === t.sellerProfile.all
                      ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white font-bold shadow-md shadow-red-500/20'
                      : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100/80 dark:hover:bg-neutral-800/80 font-medium'
                  }`}
                >
                  <span className="text-xs sm:text-sm truncate">{t.sellerProfile.all}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    selectedCategory === t.sellerProfile.all
                      ? 'bg-white/20 text-white'
                      : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
                  }`}>
                    {sellerListings.length}
                  </span>
                </button>

                {/* Tekil Kategoriler */}
                {Object.entries(sellerCategories).map(([catName, count]) => (
                  <button
                    key={catName}
                    onClick={() => setSelectedCategory(catName)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all duration-200 ${
                      selectedCategory === catName
                        ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white font-bold shadow-md shadow-red-500/20'
                        : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100/80 dark:hover:bg-neutral-800/80 font-medium'
                    }`}
                  >
                    <span className="text-xs sm:text-sm truncate pr-2">{catName}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${
                      selectedCategory === catName
                        ? 'bg-white/20 text-white'
                        : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
                    }`}>
                      {count}
                    </span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Sağ Kolon - Sekmeler, İlanlar ve Değerlendirmeler */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            
            {/* Sekme Seçici (Glassmorphic Segmented Control) */}
            <div className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl rounded-2xl shadow-sm border border-neutral-200/80 dark:border-white/10 p-1.5 flex gap-2">
              <button
                onClick={() => setActiveTab('listings')}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-200 ${
                  activeTab === 'listings'
                    ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-md shadow-red-500/20'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100/60 dark:hover:bg-neutral-800/60'
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                <span>{t.sellerProfile.listings}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full ${activeTab === 'listings' ? 'bg-white/20 text-white' : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400'}`}>
                  {sellerListings.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('ratings')}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-200 ${
                  activeTab === 'ratings'
                    ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-md shadow-red-500/20'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100/60 dark:hover:bg-neutral-800/60'
                }`}
              >
                <span className="text-amber-400">★</span>
                <span>{t.sellerProfile.reviews}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full ${activeTab === 'ratings' ? 'bg-white/20 text-white' : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400'}`}>
                  {averageRating.count}
                </span>
              </button>
            </div>

            {/* Sekme 1: İlanlar */}
            {activeTab === 'listings' && (
              <div className="space-y-4">
                {/* İlan Başlığı ve Filtre Durumu */}
                <div className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl rounded-2xl p-4 sm:p-5 border border-neutral-200/80 dark:border-white/10 flex items-center justify-between shadow-xs">
                  <div className="flex items-center gap-2.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></span>
                    <h3 className="text-base sm:text-lg font-black text-neutral-900 dark:text-neutral-100">
                      {selectedCategory === t.sellerProfile.all ? 'Tüm Aktif İlanlar' : selectedCategory}
                    </h3>
                  </div>
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 border border-neutral-200/50 dark:border-white/5">
                    {filteredListings.length} İlan
                  </span>
                </div>

                {/* İlan Kartları Listesi */}
                <div className="flex flex-col gap-4">
                  {filteredListings.length > 0 ? (
                    filteredListings.map(listing => (
                      <div key={listing.id} className="transform hover:-translate-y-0.5 transition-transform duration-200">
                        <HorizontalListingCard
                          listing={listing}
                          toggleFavorite={toggleFavorite}
                          isFavorite={isFavorite}
                          isOwnListing={isOwnProfile}
                          compact={true}
                        />
                      </div>
                    ))
                  ) : (
                    <div className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl rounded-2xl border border-dashed border-neutral-200 dark:border-white/10 flex flex-col items-center justify-center py-16 px-4 text-center">
                      <div className="w-16 h-16 bg-red-50 dark:bg-red-950/40 rounded-full flex items-center justify-center text-red-500 mb-3 text-3xl">
                        🔍
                      </div>
                      <h4 className="text-base font-bold text-neutral-900 dark:text-neutral-100 mb-1">
                        Bu kategoride ilan bulunamadı
                      </h4>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-sm mb-4">
                        Diğer kategorileri seçerek satıcının mevcut ilanlarını inceleyebilirsiniz.
                      </p>
                      <button
                        onClick={() => setSelectedCategory(t.sellerProfile.all)}
                        className="px-4 py-2 rounded-xl bg-red-600 text-white font-bold text-xs hover:bg-red-700 transition-colors shadow-sm"
                      >
                        Tüm İlanları Göster
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Sekme 2: Değerlendirmeler (YENİ VE MODERN GÖRÜNÜM) */}
            {activeTab === 'ratings' && (
              <div className="space-y-6">
                
                {/* 1. Büyük Değerlendirme Özeti Kartı */}
                <div className="bg-gradient-to-br from-white/90 via-rose-50/20 to-amber-50/20 dark:from-neutral-900/90 dark:via-neutral-900/70 dark:to-neutral-950 backdrop-blur-xl rounded-2xl p-6 sm:p-8 border border-neutral-200/80 dark:border-white/10 shadow-sm">
                  <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
                    
                    {/* Sol: Büyük Skor */}
                    <div className="text-center md:text-left flex flex-col items-center md:items-start">
                      <div className="flex items-baseline gap-2 mb-2">
                        <span className="text-6xl sm:text-7xl font-black text-neutral-900 dark:text-neutral-50 tracking-tight leading-none">
                          {averageRating.average}
                        </span>
                        <span className="text-xl text-neutral-400 font-bold">/ 5.0</span>
                      </div>
                      
                      <div className="flex items-center gap-1 mb-3 text-2xl text-amber-400">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <span key={s} className={s <= Math.round(averageRating.average) ? 'text-amber-400' : 'text-neutral-200 dark:text-neutral-700'}>
                            ★
                          </span>
                        ))}
                      </div>

                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200/80 dark:border-amber-800/40 text-xs font-bold">
                        <svg className="w-3.5 h-3.5 text-amber-500 fill-current" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>Toplam {averageRating.count} Değerlendirme</span>
                      </div>
                    </div>

                    {/* Sağ: Yıldız İlerleme Çubukları */}
                    <div className="flex-1 w-full space-y-2.5">
                      {[5, 4, 3, 2, 1].map((star) => {
                        const count = ratings.filter(r => r.rating === star).length;
                        const percentage = averageRating.count > 0 ? Math.round((count / averageRating.count) * 100) : 0;
                        return (
                          <div key={star} className="flex items-center gap-3 text-xs">
                            <span className="font-bold text-neutral-600 dark:text-neutral-400 w-16 flex items-center gap-1">
                              <span>{star}</span>
                              <span className="text-amber-400">★</span>
                            </span>
                            <div className="flex-1 h-3 bg-neutral-200/70 dark:bg-neutral-800 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full transition-all duration-500"
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                            <span className="font-bold text-neutral-400 dark:text-neutral-500 w-12 text-right">
                              %{percentage}
                            </span>
                            <span className="text-[11px] text-neutral-400 dark:text-neutral-500 w-8 text-right font-medium">
                              ({count})
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* 2. Değerlendirme Kartları Listesi */}
                <div className="space-y-4">
                  {ratings.length > 0 ? (
                    ratings.map((review) => (
                      <div
                        key={review.id}
                        className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md rounded-2xl border border-neutral-200/80 dark:border-white/10 p-5 sm:p-6 shadow-xs hover:shadow-sm transition-all"
                      >
                        <div className="flex items-start justify-between gap-4 mb-3">
                          {/* Yorum Yapanın Bilgisi */}
                          <div className="flex items-center gap-3">
                            <img
                              src={review.rater?.avatar_url || review.rater?.store_logo || `https://ui-avatars.com/api/?name=${encodeURIComponent(review.rater?.full_name || 'Kullanici')}&background=fee2e2&color=dc2626&bold=true`}
                              alt={review.rater?.full_name}
                              className="w-11 h-11 rounded-xl object-cover ring-2 ring-neutral-100 dark:ring-neutral-800 shadow-xs"
                            />
                            <div>
                              <div className="flex items-center gap-2">
                                <h5 className="font-bold text-sm text-neutral-900 dark:text-neutral-100">
                                  {review.rater?.full_name || 'Ziyaretçi'}
                                </h5>
                                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-950/40 px-2 py-0.5 rounded-full border border-green-200/70 dark:border-green-800/40">
                                  <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                  </svg>
                                  <span>Doğrulanmış</span>
                                </span>
                              </div>
                              <span className="text-[11px] text-neutral-400">
                                {new Date(review.created_at).toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric' })}
                              </span>
                            </div>
                          </div>

                          {/* Yıldızlar */}
                          <div className="flex items-center gap-1 text-base text-amber-400">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <span key={star} className={star <= review.rating ? 'text-amber-400' : 'text-neutral-200 dark:text-neutral-700'}>
                                ★
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Yorum Metni */}
                        {review.comment ? (
                          <div className="bg-neutral-50/70 dark:bg-neutral-800/40 rounded-xl p-3.5 border border-neutral-100 dark:border-white/5 text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed italic">
                            "{review.comment}"
                          </div>
                        ) : (
                          <p className="text-xs text-neutral-400 italic">Yorum belirtilmedi, sadece puan verildi.</p>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl rounded-2xl border border-dashed border-neutral-200 dark:border-white/10 p-12 text-center">
                      <div className="w-16 h-16 bg-amber-50 dark:bg-amber-950/40 rounded-full flex items-center justify-center text-amber-500 mb-3 text-3xl mx-auto">
                        ★
                      </div>
                      <h4 className="text-base font-bold text-neutral-900 dark:text-neutral-100 mb-1">
                        Henüz Değerlendirme Bulunmuyor
                      </h4>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-sm mx-auto">
                        Bu satıcıdan alışveriş yaptıktan sonra ilk değerlendirmeyi yapan siz olabilirsiniz.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Sticky Contact & Follow Buttons */}
      {isMobile && !isOwnProfile && (
        <div className="fixed bottom-16 left-0 right-0 z-[100] bg-white/75 dark:bg-neutral-950/75 backdrop-blur-lg border-t border-gray-200/70 dark:border-white/10 p-3 flex items-center gap-2 pb-safe no-print">
          {/* Mobile Takip Et */}
          <button
            type="button"
            onClick={async () => {
              setFollowLoading(true);
              await toggleFollowSeller(seller.id);
              try {
                const { getFollowersCount } = await import('../api/follows');
                const newCount = await getFollowersCount(seller.id);
                setFollowersCount(newCount);
              } catch (error) {
                console.error('Error refreshing follower count:', error);
              }
              setFollowLoading(false);
            }}
            disabled={followLoading}
            className={`flex-1 h-12 rounded-xl border flex items-center justify-center gap-1.5 transition-all shadow-sm active:scale-95 font-bold text-sm ${
              isSellerFollowed(seller.id)
                ? 'bg-green-50/90 dark:bg-green-950/50 backdrop-blur-sm border-green-200 dark:border-green-900/50 text-green-700 dark:text-green-400'
                : 'bg-white/90 dark:bg-neutral-900/90 backdrop-blur-sm border-gray-200 dark:border-white/10 text-gray-800 dark:text-neutral-100'
            }`}
          >
            {isSellerFollowed(seller.id) ? (
              <>
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
                <span>{t.sellerProfile.followed}</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                </svg>
                <span>{t.sellerProfile.follow}</span>
              </>
            )}
          </button>

          {/* Mobile Mesaj Gönder */}
          <button
            type="button"
            onClick={() => setShowMessageModal(true)}
            className="flex-1 h-12 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-sm border border-gray-200 dark:border-white/10 text-gray-800 dark:text-neutral-100 hover:bg-white dark:hover:bg-neutral-800 font-bold text-sm px-3 rounded-xl shadow-sm active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h0.01M12 12h0.01M16 12h0.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-0.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <span>{t.sellerProfile.message}</span>
          </button>

          {/* Mobile Ara (varsa) */}
          {sellerPhone && (
            !showPhone ? (
              <button
                type="button"
                onClick={() => setShowPhone(true)}
                className="flex-1 h-12 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-sm border border-gray-200 dark:border-white/10 text-gray-800 dark:text-neutral-100 hover:bg-white dark:hover:bg-neutral-800 font-bold text-sm px-3 rounded-xl shadow-sm active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-0.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-0.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>{t.productDetail.call || 'Ara'}</span>
              </button>
            ) : (
              <a
                href={`tel:${sellerPhone.replace(/\s+/g, '')}`}
                className="flex-1 h-12 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-sm border border-green-500/40 dark:border-green-500/30 text-green-700 dark:text-green-400 font-bold text-sm px-3 rounded-xl shadow-sm active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-0.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-0.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span className="truncate">{sellerPhone}</span>
              </a>
            )
          )}
        </div>
      )}

      <MessageModal
        isOpen={showMessageModal}
        onClose={() => setShowMessageModal(false)}
        onSubmit={handleModalSubmit}
        sellerName={seller.full_name || t.sellerProfile.message}
        listingTitle={t.sellerProfile.inquiryToSeller}
      />
    </div>
  );
};

export default SellerPage;
