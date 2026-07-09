import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { t } from '../translations';
import { useAuth } from '../contexts/AuthContext';
import MessageModal from './MessageModal';
import HorizontalListingCard from './HorizontalListingCard';
import RatingDisplay from './RatingDisplay';
import RatingsList from './RatingsList';

export const SellerProfile = ({ toggleFavorite, isFavorite, toggleFollowSeller, isSellerFollowed }) => {
  const { sellerId } = useParams();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState(t.sellerProfile?.all || 'Tümü');

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
            name: profile.username || profile.full_name || (listings.length > 0 ? listings[0].sellerName : t.cart?.seller || 'Satıcı'),
            rating: 4.5,
            totalSales: listings.length,
            memberSince: profile.created_at,
            profileImage: profile.store_logo || profile.avatar_url || (listings.length > 0 ? listings[0].sellerAvatar : null),
            seller_type: profile.seller_type,
            is_commercial: profile.is_commercial,
            user_number: profile.user_number
          });
        } else if (listings.length > 0) {
          // Fallback to listing data if profile fetch fails
          setSeller({
            id: sellerId,
            name: listings[0].sellerName || t.cart?.seller || 'Satıcı',
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
      alert(t.sellerProfile?.messageSuccess || 'Mesaj gönderildi');
      setShowMessageModal(false);
    } catch (error) {
      alert(t.sellerProfile?.messageError || 'Hata oluştu');
    }
  };

  if (loading) return <div className="p-8 text-center">{t.common?.loading || 'Yükleniyor...'}</div>;
  if (!seller) return <div className="p-8 text-center">{t.sellerProfile?.sellerNotFound || 'Satıcı bulunamadı'}</div>;

  // Calculate categories and counts
  const categoriesMap = sellerListings.reduce((acc, listing) => {
    const cat = listing.category || t.common?.others || 'Diğer';
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, { [t.sellerProfile?.all || 'Tümü']: sellerListings.length });

  // Filter listings
  const filteredListings = selectedCategory === (t.sellerProfile?.all || 'Tümü')
    ? sellerListings
    : sellerListings.filter(l => (l.category || t.common?.others || 'Diğer') === selectedCategory);

  const activeSinceDisplay = seller.memberSince
    ? new Date(seller.memberSince).toLocaleDateString('tr-TR')
    : (seller.activeSince || '-');

  // Determine seller type label
  const sellerTypeLabel = seller.seller_type === 'Kurumsal Kullanıcı' ? t.addListing?.commercial || 'Kurumsal' : t.addListing?.private || 'Bireysel';

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-neutral-950">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <button
          onClick={() => navigate(-1)}
          className="mb-8 text-red-500 hover:text-red-600 flex items-center gap-2 group transition-all"
        >
          <div className="w-8 h-8 rounded-full bg-red-50 dark:bg-red-500/10 flex items-center justify-center group-hover:bg-red-100 dark:group-hover:bg-red-500/20 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </div>
          <span className="font-semibold">{t.productDetail?.back || 'Geri'}</span>
        </button>

        <div className="bg-white dark:bg-neutral-900 rounded-3xl shadow-xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-white/5 p-8 mb-8 overflow-hidden relative">
          {/* Header background decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
          
          <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
            <div className="relative">
              <img
                src={seller.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(seller.name)}&background=random`}
                alt={seller.name}
                className="w-32 h-32 rounded-3xl object-cover border-4 border-white dark:border-neutral-800 shadow-lg"
              />
              {seller.is_commercial && (
                <div className="absolute -bottom-2 -right-2 bg-blue-500 text-white p-1.5 rounded-xl shadow-lg border-2 border-white dark:border-neutral-800">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.64.304 1.25.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                  </svg>
                </div>
              )}
            </div>
            
            <div className="text-center md:text-left flex-1">
              <h1 className="text-3xl font-extrabold text-gray-900 dark:text-neutral-50 mb-2">{seller.name}</h1>
              <div className="flex flex-wrap justify-center md:justify-start items-center gap-3 mb-4 text-sm">
                <span className={`px-3 py-1 rounded-full font-bold tracking-wider text-[10px] uppercase ${seller.is_commercial ? 'bg-blue-50 text-blue-600 dark:bg-blue-500/10' : 'bg-gray-100 text-gray-600 dark:bg-white/5 dark:text-neutral-400'}`}>
                   {seller.is_commercial ? 'Kurumsal Mağaza' : sellerTypeLabel}
                </span>
                <div className="flex items-center gap-1.5 text-gray-500 dark:text-neutral-400 font-medium">
                   <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                   </svg>
                   {t.productDetail?.memberSince || 'Üyelik'}: {activeSinceDisplay}
                </div>
              </div>
              
              <div className="flex flex-wrap justify-center md:justify-start gap-6 pt-4 border-t border-gray-50 dark:border-white/5">
                <div className="text-center md:text-left">
                  <div className="text-xl font-bold text-gray-900 dark:text-neutral-50">{sellerListings.length}</div>
                  <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{t.filters?.listings || 'İlanlar'}</div>
                </div>
                {seller.rating > 0 && (
                  <div className="text-center md:text-left border-l border-gray-100 dark:border-white/5 pl-6">
                    <div className="flex items-center gap-1 text-xl font-bold text-gray-900 dark:text-neutral-50">
                      {seller.rating}
                      <svg className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-0.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                      </svg>
                    </div>
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{seller.totalRatings || 0} {t.productDetail?.ratings || 'Değerlendirme'}</div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              <button
                onClick={() => toggleFollowSeller(seller.id)}
                className={`flex-1 sm:flex-none px-8 py-4 rounded-2xl font-bold transition-all transform hover:-translate-y-1 active:scale-95 ${isSellerFollowed(seller.id) ? 'bg-green-50 dark:bg-green-500/10 border-2 border-green-500 text-green-700 dark:text-green-500' : 'bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/30'}`}
              >
                {isSellerFollowed(seller.id) ? t.sellerProfile?.followed || 'Takip Ediliyor' : t.sellerProfile?.follow || 'Takip Et'}
              </button>
              <button
                onClick={() => setShowMessageModal(true)}
                className="flex-1 sm:flex-none px-8 py-4 bg-white dark:bg-neutral-800 border-2 border-gray-100 dark:border-white/10 text-gray-700 dark:text-neutral-300 rounded-2xl hover:bg-gray-50 dark:hover:bg-neutral-700 transition-all font-bold shadow-sm"
              >
                {t.sellerProfile?.message || 'Mesaj Gönder'}
              </button>
            </div>
          </div>
        </div>

        <MessageModal
          isOpen={showMessageModal}
          onClose={() => setShowMessageModal(false)}
          onSubmit={handleModalSubmit}
          sellerName={seller.name}
          listingTitle={t.sellerProfile?.inquiryToSeller || 'Satıcıya Soru Sor'}
        />

        {/* Satıcı Değerlendirmeleri Section */}
        {sellerRating && sellerRating.count > 0 && (
          <div className="bg-white dark:bg-neutral-900 rounded-3xl border border-gray-100 dark:border-white/5 p-8 mb-8">
            <h2 className="text-xl font-bold text-gray-900 dark:text-neutral-50 mb-6 flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-yellow-50 dark:bg-yellow-500/10 flex items-center justify-center text-yellow-500">
                 <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                   <path d="M9.049 2.927c.3-0.921 1.603-0.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-0.363 1.118l1.518 4.674c.3.922-0.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-0.783.57-1.838-0.197-1.538-1.118l1.518-4.674a1 1 0 00-0.363-1.118l-3.976-2.888c-0.784-0.57-0.38-1.81.588-1.81h4.914a1 1 0 00.951-0.69l1.519-4.674z" />
                 </svg>
              </div>
              Satıcı Değerlendirmeleri
            </h2>
            <div className="mb-8">
                <RatingDisplay
                  userRating={sellerRating}
                  showDetails={true}
                  size="medium"
                />
            </div>
            <RatingsList ratings={sellerRatings} />
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Categories */}
          <div className="lg:w-72 flex-shrink-0">
            <div className="bg-white dark:bg-neutral-900 rounded-3xl border border-gray-100 dark:border-white/5 p-6 sticky top-8 shadow-sm">
              <h3 className="font-extrabold text-gray-900 dark:text-neutral-100 mb-6 text-lg tracking-tight">{t.sellerProfile?.categories || 'Kategoriler'}</h3>
              <ul className="space-y-2">
                {Object.entries(categoriesMap).map(([category, count]) => (
                  <li key={category}>
                    <button
                      onClick={() => setSelectedCategory(category)}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl transition-all duration-300 group ${selectedCategory === category
                        ? 'bg-red-500 text-white shadow-lg shadow-red-500/20 font-bold'
                        : 'text-gray-600 dark:text-neutral-400 hover:bg-gray-50 dark:hover:bg-white/5'
                        }`}
                    >
                      <span className="text-sm">{category}</span>
                      <span className={`text-[10px] font-bold px-2 py-1 rounded-lg ${selectedCategory === category
                        ? 'bg-white/20'
                        : 'bg-gray-100 dark:bg-white/10 group-hover:bg-red-100 dark:group-hover:bg-red-500/20 transition-colors'
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
            <div className="flex items-center justify-between mb-8">
               <h2 className="text-2xl font-extrabold text-gray-900 dark:text-neutral-50 tracking-tight">
                 {selectedCategory === (t.sellerProfile?.all || 'Tümü') ? t.sellerProfile?.activeListings || 'Aktif İlanlar' : selectedCategory}
               </h2>
               <div className="text-sm font-bold text-gray-400 uppercase tracking-widest bg-gray-50 dark:bg-white/5 px-4 py-2 rounded-xl">
                 {filteredListings.length} {t.filters?.results || 'Sonuç'}
               </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {filteredListings.map((listing) => (
                <HorizontalListingCard
                  key={listing.id}
                  listing={listing}
                  toggleFavorite={toggleFavorite}
                  isFavorite={isFavorite}
                  compact={false}
                />
              ))}
              {filteredListings.length === 0 && (
                <div className="text-center py-24 bg-white dark:bg-neutral-900 rounded-3xl border-2 border-dashed border-gray-100 dark:border-white/5">
                  <div className="w-20 h-20 bg-gray-50 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                     <svg className="w-10 h-10 text-gray-300 dark:text-neutral-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                     </svg>
                  </div>
                  <p className="text-gray-500 dark:text-neutral-400 font-medium">{t.sellerProfile?.sellerNotFound || 'İlan bulunamadı'}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerProfile;
