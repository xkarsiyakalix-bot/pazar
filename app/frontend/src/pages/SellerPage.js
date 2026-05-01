import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
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
          setSeller({
            id: sellerId,
            name: profile.full_name || (listings.length > 0 ? listings[0].sellerName : t.cart.seller),
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

  if (!seller) return <div className="p-8">{t.sellerProfile.sellerNotFound}</div>;

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

  const activeSinceDisplay = seller.memberSince
    ? new Date(seller.memberSince).toLocaleDateString('tr-TR')
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
                        {count}
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

  const [seller, setSeller] = useState(location.state?.sellerProfile || null);
  const [sellerListings, setSellerListings] = useState([]);
  const [loading, setLoading] = useState(!location.state?.sellerProfile);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(t.sellerProfile.all);
  const [activeTab, setActiveTab] = useState('listings');
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [followLoading, setFollowLoading] = useState(false);
  const [ratings, setRatings] = useState([]);
  const [averageRating, setAverageRating] = useState({ average: 0, count: 0 });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const isOwnProfile = user && seller && user.id === seller.id;

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
  if (!seller) return <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black"><div className="text-neutral-400 font-bold">{t.sellerProfile.sellerNotFound}</div></div>;

  return (
    <div className="min-h-screen bg-[#F8F9FA] dark:bg-black transition-colors duration-300">
      <SellerSEO seller={seller} listingCount={sellerListings.length} averageRating={averageRating.average} />
      <div className="max-w-7xl mx-auto px-2 sm:px-4 py-8">
        <button
          onClick={() => navigate(-1)}
          className="mb-8 group flex items-center gap-2 text-neutral-600 dark:text-neutral-400 hover:text-red-500 dark:hover:text-red-400 transition-all duration-300 font-bold text-sm uppercase tracking-widest"
        >
          <div className="w-8 h-8 rounded-lg bg-white dark:bg-neutral-900 shadow-sm border border-neutral-100 dark:border-white/10 flex items-center justify-center group-hover:bg-red-50 dark:group-hover:bg-red-900/20 group-hover:border-red-100 dark:group-hover:border-red-900/30 transition-all">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </div>
          {t.productDetail.back}
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-8">
            <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-[0_2px_15px_rgb(0,0,0,0.03)] dark:shadow-none border border-neutral-200 dark:border-white/10 overflow-hidden group transition-all duration-300">
              {/* Profile Header Background */}
              <div className="h-32 bg-gradient-to-br from-neutral-50 to-neutral-200 dark:from-neutral-800 dark:to-neutral-950 relative">
                <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
                <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-white dark:from-neutral-900 to-transparent"></div>
              </div>

              <div className="px-8 pb-8 -mt-16 relative z-10 text-center">
                <div className="mb-6 relative inline-block">
                  <div className="absolute -inset-1 bg-gradient-to-tr from-red-500 to-rose-500 rounded-xl opacity-0 group-hover:opacity-20 transition-opacity blur-md"></div>
                  {(seller.store_logo || seller.avatar_url) ? (
                    <div className="relative">
                      <img
                        src={seller.store_logo || seller.avatar_url}
                        alt={seller.full_name}
                        className="w-32 h-32 rounded-xl object-cover border-4 border-white dark:border-neutral-800 mx-auto shadow-xl relative z-10 group-hover:scale-[1.02] transition-transform duration-500"
                      />
                      {seller.last_seen && (new Date() - new Date(seller.last_seen)) < 5 * 60 * 1000 && (
                        <div className="absolute bottom-1 right-1 w-5 h-5 bg-green-500 border-4 border-white dark:border-neutral-900 rounded-full z-20 shadow-sm"></div>
                      )}
                    </div>
                  ) : (
                    <div className="w-32 h-32 rounded-xl border-4 border-white dark:border-neutral-900 mx-auto shadow-xl relative z-10 bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-5xl font-black text-neutral-300">
                      {seller.full_name?.charAt(0) || '?'}
                    </div>
                  )}
                </div>

                <div className="mb-6">
                  <h2 className="text-3xl font-display font-black text-neutral-900 dark:text-neutral-50 tracking-tight leading-tight">
                    {seller.full_name || t.productDetail.unknownSeller}
                  </h2>
                  <div className="flex items-center justify-center gap-2 mt-3">
                    <span className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-[0.15em] ${(seller.sellerType || seller.seller_type) === 'Kurumsal Kullanıcı'
                      ? 'bg-blue-600 text-white'
                      : 'bg-neutral-900 dark:bg-neutral-800 text-white'
                      }`}>
                      {(seller.sellerType || seller.seller_type) === 'Kurumsal Kullanıcı' ? t.addListing.commercial : t.addListing.private}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-center gap-2 mb-8">
                  <div className="text-xs font-bold text-neutral-700 dark:text-neutral-300 uppercase tracking-wide">
                    {formatLastSeen(seller.last_seen)}
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-neutral-600 dark:text-neutral-400 font-bold uppercase tracking-widest">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    {t.sellerProfile.memberSince} {seller.created_at ? new Date(seller.created_at).getFullYear() : 'N/A'}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 mb-8">
                  <div className="bg-neutral-50 dark:bg-neutral-800/50 rounded-lg p-3 border border-neutral-100 dark:border-white/5 transition-all hover:bg-neutral-100 dark:hover:bg-neutral-800 group/stat">
                    <div className="text-xl font-black text-neutral-900 dark:text-neutral-100 mb-1">{sellerListings.length}</div>
                    <div className="text-[9px] text-neutral-600 dark:text-neutral-400 uppercase font-bold tracking-widest">{t.sellerProfile.listings}</div>
                  </div>
                  <div className="bg-neutral-50 dark:bg-neutral-800/50 rounded-lg p-3 border border-neutral-100 dark:border-white/5 transition-all hover:bg-neutral-100 dark:hover:bg-neutral-800 group/stat">
                    <div className="text-xl font-black text-neutral-900 dark:text-neutral-100 mb-1">{followersCount}</div>
                    <div className="text-[9px] text-neutral-600 dark:text-neutral-400 uppercase font-bold tracking-widest">{t.sellerProfile.followers}</div>
                  </div>
                </div>
                {!isOwnProfile && (
                  <div className="flex flex-col gap-3">
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
                      className={`w-full font-black py-4 px-6 rounded-xl shadow-lg transition-all duration-300 flex items-center justify-center gap-3 transform active:scale-[0.98] ${isSellerFollowed(seller.id)
                        ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                        : 'bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white shadow-red-200 dark:shadow-none'
                        } ${followLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {followLoading ? <LoadingSpinner size="small" /> : (
                        isSellerFollowed(seller.id) ? (
                          <><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg><span>{t.sellerProfile.followed}</span></>
                        ) : (
                          <><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg><span>{t.sellerProfile.follow}</span></>
                        )
                      )}
                    </button>
                    <button
                      onClick={() => setShowMessageModal(true)}
                      className="w-full bg-white dark:bg-neutral-900 border-2 border-neutral-100 dark:border-white/10 hover:border-neutral-200 dark:hover:border-white/20 text-neutral-900 dark:text-neutral-100 font-bold py-3.5 px-6 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2"
                    >
                      <svg className="w-5 h-5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h0.01M12 10h0.01M16 10h0.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
                      {t.sellerProfile.message}
                    </button>
                  </div>
                )}

                {/* Profile Share Section Inside Card */}
                <div className="mt-8 pt-8 border-t border-neutral-50 dark:border-white/5 flex flex-col items-center">
                  <p className="text-[10px] text-neutral-600 dark:text-neutral-400 font-black uppercase tracking-[0.2em] mb-4">{t.sellerProfile.shareProfile || 'Profili Paylaş'}</p>
                  <div className="flex justify-center gap-3">
                    {[
                      { icon: <svg className="w-5 h-5 fill-currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-0.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>, color: 'bg-[#1877F2]', action: 'facebook' },
                      { icon: <svg className="w-5 h-5 fill-currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-0.297-0.149-1.758-0.867-2.03-0.967-0.273-0.099-0.471-0.148-0.67.15-0.197.297-0.767.966-0.94 1.164-0.173.199-0.347.223-0.644.075-0.297-0.15-1.255-0.463-2.39-1.475-0.883-0.788-1.48-1.761-1.653-2.059-0.173-0.297-0.018-0.458.13-0.606.134-0.133.298-0.347.446-0.52.149-0.174.198-0.298.298-0.497.099-0.198.05-0.371-0.025-0.52-0.075-0.149-0.669-1.612-0.916-2.207-0.242-0.579-0.487-0.5-0.669-0.51-0.173-0.008-0.371-0.01-0.57-0.01-0.198 0-0.52.074-0.792.372-0.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-0.085 1.758-0.719 2.006-1.413.248-0.694.248-1.289.173-1.413-0.074-0.124-0.272-0.198-0.57-0.347m-5.421 7.403h-0.004a9.27 9.27 0 01-4.723-1.292l-0.339-0.202-3.51.92 1.017-3.65-0.213-0.339a9.204 9.204 0 01-1.513-5.07c0-5.116 4.158-9.273 9.274-9.273 2.479 0 4.808.966 6.557 2.715a9.192 9.192 0 012.711 6.56c0 5.117-4.158 9.275-9.276 9.275m8.211-17.487A11.026 11.026 0 0012.048 1.177c-6.115 0-11.09 4.974-11.09 11.088 0 2.112.553 4.135 1.611 5.922L.787 23l4.981-1.304c1.722.94 3.655 1.437 5.626 1.437h.005c6.114 0 11.089-4.975 11.089-11.088 0-2.937-1.144-5.698-3.235-7.791z" /></svg>, color: 'bg-[#25D366]', action: 'whatsapp' },
                      { icon: <svg className="w-5 h-5 fill-currentColor" viewBox="0 0 1200 1227"><path d="M714.163 519.284L1160.89 0H1055.03L667.137 450.887L357.328 0H0L468.492 681.821L0 1226.37H105.866L515.491 750.218L842.672 1226.37H1200L714.137 519.284H714.163ZM569.165 687.828L521.697 619.934L144.011 79.6944H306.615L611.412 515.685L658.88 583.579L1055.08 1150.3H892.476L569.165 687.854V687.828Z" /></svg>, color: 'bg-[#1DA1F2]', action: 'twitter' },
                      { icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg>, color: 'bg-neutral-500', action: 'copy' },
                    ].map((social, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          const url = window.location.href;
                          if (social.action === 'facebook') window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
                          if (social.action === 'whatsapp') window.open(`https://wa.me/?text=${encodeURIComponent(url)}`, '_blank');
                          if (social.action === 'twitter') window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}`, '_blank');
                          if (social.action === 'copy') {
                            navigator.clipboard.writeText(url).then(() => alert('Link kopyalandı!'));
                          }
                        }}
                        className={`w-9 h-9 ${social.color} text-white rounded-xl flex items-center justify-center hover:scale-110 transition-transform shadow-lg shadow-neutral-200 dark:shadow-none`}
                      >
                        {social.icon}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-[0_2px_15px_rgb(0,0,0,0.03)] dark:shadow-none border border-neutral-200 dark:border-white/10 p-6">
              <p className="text-[10px] text-neutral-600 dark:text-neutral-400 font-black uppercase tracking-[0.2em] mb-4">{t.sellerProfile.categories}</p>
              <nav className="space-y-1">
                <button
                  onClick={() => setSelectedCategory(t.sellerProfile.all)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 ${selectedCategory === t.sellerProfile.all
                    ? 'bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 font-black'
                    : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 font-bold'
                    }`}
                >
                  <span className="text-sm font-bold">{t.sellerProfile.all}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full ${selectedCategory === t.sellerProfile.all ? 'bg-red-200 dark:bg-red-900/30 text-red-700 dark:text-red-300' : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400'}`}>
                    {sellerListings.length}
                  </span>
                </button>
                {Object.entries(sellerCategories).map(([catName, count]) => (
                  <button
                    key={catName}
                    onClick={() => setSelectedCategory(catName)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 ${selectedCategory === catName
                      ? 'bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 font-black'
                      : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 font-bold'
                      }`}
                  >
                    <span className="text-sm font-bold truncate pr-2">{catName}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full flex-shrink-0 ${selectedCategory === catName ? 'bg-red-200 dark:bg-red-900/30 text-red-700 dark:text-red-300' : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400'}`}>
                      {count}
                    </span>
                  </button>
                ))}
              </nav>
            </div>


          </div>

          <div className="lg:col-span-8 flex flex-col gap-8">
            <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.02)] dark:shadow-none border border-neutral-200/60 dark:border-white/10 p-2 flex gap-2 overflow-x-auto no-scrollbar">
              {[
                { id: 'listings', label: t.sellerProfile.listings },
                { id: 'ratings', label: t.sellerProfile.reviews },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center py-4 px-6 rounded-lg font-black text-[10px] sm:text-xs uppercase tracking-[0.2em] transition-all duration-300 ${activeTab === tab.id
                    ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 shadow-lg shadow-neutral-200 dark:shadow-none'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-50 dark:hover:bg-neutral-800'
                    }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className={`${activeTab === 'listings' ? 'space-y-6' : 'bg-white dark:bg-neutral-900 rounded-xl shadow-[0_4px_25px_rgb(0,0,0,0.03)] dark:shadow-none border border-neutral-200 dark:border-white/10 p-4 sm:p-10'} min-h-[600px]`}>
              {activeTab === 'listings' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-neutral-200 dark:border-white/10 pb-4">
                    <h3 className="text-xl font-black text-neutral-900 dark:text-neutral-100 uppercase tracking-tight">
                      {selectedCategory === t.sellerProfile.all ? t.sellerProfile.activeListings : selectedCategory}
                    </h3>
                  </div>
                  <div className="flex flex-col gap-6">
                    {filteredListings.length > 0 ? (
                      filteredListings.map(listing => (
                        <div key={listing.id} className="transform hover:-translate-y-1 transition-transform duration-300">
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
                      <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="w-20 h-20 bg-neutral-50 dark:bg-neutral-800 rounded-full flex items-center justify-center text-neutral-300 dark:text-neutral-600 mb-4 text-4xl">📭</div>
                        <p className="text-neutral-600 dark:text-neutral-400 font-bold">{t.sellerProfile.listingsNotFound || 'Henüz ilan bulunmuyor.'}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'ratings' && (
                <div className="space-y-10">
                  <div className="bg-neutral-50/50 dark:bg-neutral-800/50 rounded-2xl p-8 flex flex-col md:flex-row items-center gap-12 border border-neutral-100 dark:border-white/5">
                    <div className="text-center">
                      <div className="text-7xl font-black text-neutral-900 dark:text-neutral-100 leading-none mb-2">
                        {averageRating.average}
                        <span className="text-2xl text-neutral-300 dark:text-neutral-600 font-normal ml-2">/ 5</span>
                      </div>
                      <div className="flex items-center justify-center gap-1 mb-4 text-2xl">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <span key={s} className={`${s <= Math.round(averageRating.average) ? 'text-yellow-400' : 'text-neutral-200 dark:text-neutral-700'}`}>★</span>
                        ))}
                      </div>
                      <div className="inline-block px-4 py-1 bg-white dark:bg-neutral-800 rounded-full text-[10px] font-black text-neutral-600 dark:text-neutral-400 uppercase tracking-widest border border-neutral-100 dark:border-white/5">
                        {averageRating.count} {t.sellerProfile.reviews}
                      </div>
                    </div>
                    <div className="flex-1 w-full max-w-sm space-y-3">
                      {[5, 4, 3, 2, 1].map((star) => {
                        const count = ratings.filter(r => r.rating === star).length;
                        const percentage = averageRating.count > 0 ? (count / averageRating.count) * 100 : 0;
                        return (
                          <div key={star} className="flex items-center gap-4 group">
                            <span className="text-xs font-black text-neutral-600 dark:text-neutral-400 w-12 tracking-tighter uppercase group-hover:text-neutral-900 dark:group-hover:text-neutral-100 transition-colors">{star} Yıldız</span>
                            <div className="flex-1 h-3 bg-white dark:bg-neutral-800 rounded-full overflow-hidden border border-neutral-100 dark:border-white/5 shadow-inner">
                              <div className="h-full bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full group-hover:from-red-500 group-hover:to-rose-500 transition-all duration-500" style={{ width: `${percentage}%` }} />
                            </div>
                            <span className="text-xs font-black text-neutral-400 dark:text-neutral-500 w-8 text-right group-hover:text-neutral-900 dark:group-hover:text-neutral-100 transition-colors">{count}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <div className="divide-y divide-neutral-50 dark:divide-white/5">
                    {ratings.length > 0 ? (
                      ratings.map((review) => (
                        <div key={review.id} className="py-8 first:pt-0 group">
                          <div className="flex gap-4">
                            <img
                              src={review.rater?.avatar_url || review.rater?.store_logo || `https://ui-avatars.com/api/?name=${encodeURIComponent(review.rater?.full_name || 'U')}&background=f3f4f6&color=4b5563&bold=true`}
                              alt={review.rater?.full_name}
                              className="w-14 h-14 rounded-2xl object-cover shadow-sm border border-neutral-100 dark:border-white/10 flex-shrink-0"
                            />
                            <div className="flex-1">
                              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                                <h5 className="font-black text-neutral-900 dark:text-neutral-100 tracking-tight">{review.rater?.full_name}</h5>
                                <span className="text-[10px] font-black text-neutral-500 dark:text-neutral-500 uppercase tracking-widest">{new Date(review.created_at).toLocaleDateString('tr-TR')}</span>
                              </div>
                              <div className="flex items-center gap-1 mb-3">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <span key={star} className={`text-sm ${star <= review.rating ? 'text-yellow-400' : 'text-neutral-200 dark:text-neutral-700'}`}>★</span>
                                ))}
                              </div>
                              {review.comment && <p className="text-neutral-700 dark:text-neutral-300 text-sm italic">"{review.comment}"</p>}
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-20 bg-neutral-50 dark:bg-neutral-800/50 rounded-[2rem] border-2 border-dashed border-neutral-100 dark:border-white/5">
                        <p className="text-neutral-600 dark:text-neutral-400 font-bold uppercase tracking-widest text-sm">{t.sellerProfile.noRatingsYet}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <MessageModal
        isOpen={showMessageModal}
        onClose={() => setShowMessageModal(false)}
        onSubmit={handleModalSubmit}
        sellerName={seller.full_name || t.sellerProfile.message}
        listingTitle={t.sellerProfile.inquiryToSeller}
      />
    </div >
  );
};

// Footer Component

export default SellerPage;
