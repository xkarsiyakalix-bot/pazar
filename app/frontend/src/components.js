import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, useLocation, useSearchParams } from 'react-router-dom';
import { carBrands } from './data/carBrands';
import { turkeyCities } from './data/turkey_cities';
import { useAuth } from './contexts/AuthContext';
import { ReservationButton } from './ReservationButton';
import { ProductSEO } from './SEO';
import { getOptimizedImageUrl } from './utils/imageUtils';
import RatingDisplay from './components/RatingDisplay';
import RatingsList from './components/RatingsList';
import { t, getCategoryTranslation } from './translations';
import { FashionFields } from './components/AddListing/FashionFields';
import { RealEstateFields } from './components/AddListing/RealEstateFields';
import { VehicleFields } from './components/AddListing/VehicleFields';
import { ElectronicFields } from './components/AddListing/ElectronicFields';
import { HomeGardenFields } from './components/AddListing/HomeGardenFields';
import { JobFields } from './components/AddListing/JobFields';
import { HobbyFields } from './components/AddListing/HobbyFields';
import { EducationFields } from './components/AddListing/EducationFields';
import { ServiceFields } from './components/AddListing/ServiceFields';
import { FamilyFields } from './components/AddListing/FamilyFields';
import { PetFields } from './components/AddListing/PetFields';
import PromotionModal from './components/Account/PromotionModal';
import { useIsMobile } from './hooks/useIsMobile';
import { getRatings, getUserAverageRating } from './api/ratings';
import { Breadcrumb } from './components/Breadcrumb';
import { searchApi } from './api/search';
import LoadingSpinner from './components/LoadingSpinner';

export const LazyImage = ({ src, alt, className, imgClassName, ...props }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className={`relative overflow-hidden ${className}`} {...props}>
      {!isLoaded && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse z-0" />
      )}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onLoad={() => setIsLoaded(true)}
        onError={() => setIsLoaded(true)}
        className={`w-full h-full transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'} ${imgClassName || 'object-cover'} relative z-10`}
      />
    </div>
  );
};




// Helper function to format "Last Seen" status
export const formatLastSeen = (lastSeenDate) => {
  if (!lastSeenDate) return 'Az önce aktifti';

  const now = new Date();
  const lastSeen = new Date(lastSeenDate);
  const diffInMinutes = Math.floor((now - lastSeen) / (1000 * 60));

  if (diffInMinutes < 1) return 'Az önce aktifti';
  if (diffInMinutes < 60) return `${diffInMinutes} dakika önce aktifti`;

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} saat önce aktifti`;

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays === 1) return 'Dün aktifti';
  if (diffInDays < 7) return `${diffInDays} gün önce aktifti`;

  return lastSeen.toLocaleDateString('tr-TR');
};

// Mock data for categories
const categories = [
  { name: 'Tüm Kategoriler', count: 0 },
  {
    name: 'Otomobil, Bisiklet & Tekne',
    count: 0,
    subcategories: [
      { name: 'Otomobiller', count: 0 },
      { name: 'Oto Parça & Lastik', count: 0 },
      { name: 'Tekne & Tekne Malzemeleri', count: 0 },
      { name: 'Bisiklet & Aksesuarlar', count: 0 },
      { name: 'Motosiklet & Scooter', count: 0 },
      { name: 'Motosiklet Parça & Aksesuarlar', count: 0 },
      { name: 'Ticari Araçlar & Römorklar', count: 0 },
      { name: 'Tamir & Servis', count: 0 },
      { name: 'Karavan & Motokaravan', count: 0 },
      { name: 'Diğer Otomobil, Bisiklet & Tekne', count: 0 },
    ]
  },
  {
    name: 'Emlak',
    count: 0,
    subcategories: [
      { name: 'Geçici Konaklama & Paylaşımlı Ev', count: 0 },
      { name: 'Konteyner', count: 0 },
      { name: 'Satılık Daire', count: 0 },
      { name: 'Satılık Yazlık', count: 0 },
      { name: 'Tatil Evi & Yurt Dışı Emlak', count: 0 },
      { name: 'Garaj & Otopark', count: 0 },
      { name: 'Ticari Emlak', count: 0 },
      { name: 'Arsa & Bahçe', count: 0 },
      { name: 'Satılık Müstakil Ev', count: 0 },
      { name: 'Kiralık Müstakil Ev', count: 0 },
      { name: 'Kiralık Daire', count: 0 },
      { name: 'Yeni Projeler', count: 0 },
      { name: 'Taşımacılık & Nakliye', count: 0 },
      { name: 'Diğer Emlak', count: 0 },
    ]
  },
  {
    name: 'Ev & Bahçe',
    count: 0,
    subcategories: [
      { name: 'Banyo', count: 0 },
      { name: 'Ofis', count: 0 },
      { name: 'Dekorasyon', count: 0 },
      { name: 'Ev Hizmetleri', count: 0 },
      { name: 'Bahçe Malzemeleri & Bitkiler', count: 0 },
      { name: 'Ev Tekstili', count: 0 },
      { name: 'Ev Tadilatı', count: 0 },
      { name: 'Mutfak & Yemek Odası', count: 0 },
      { name: 'Lamba & Aydınlatma', count: 0 },
      { name: 'Yatak Odası', count: 0 },
      { name: 'Oturma Odası', count: 0 },
      { name: 'Diğer Ev & Bahçe', count: 0 },
    ]
  },
  {
    name: 'Moda & Güzellik',
    count: 0,
    subcategories: [
      { name: 'Güzellik & Sağlık', count: 0 },
      { name: 'Kadın Giyimi', count: 0 },
      { name: 'Kadın Ayakkabıları', count: 0 },
      { name: 'Erkek Giyimi', count: 0 },
      { name: 'Erkek Ayakkabıları', count: 0 },
      { name: 'Çanta & Aksesuarlar', count: 0 },
      { name: 'Saat & Takı', count: 0 },
      { name: 'Diğer Moda & Güzellik', count: 0 },
    ]
  },
  {
    name: 'Elektronik',
    count: 0,
    subcategories: [
      { name: 'Ses & Hifi', count: 0 },
      { name: 'Elektronik Hizmetler', count: 0 },
      { name: 'Fotoğraf & Kamera', count: 0 },
      { name: 'Cep Telefonu & Telefon', count: 0 },
      { name: 'Ev Aletleri', count: 0 },
      { name: 'Konsollar', count: 0 },
      { name: 'Dizüstü Bilgisayarlar', count: 0 },
      { name: 'Bilgisayarlar', count: 0 },
      { name: 'Bilgisayar Aksesuarları & Yazılım', count: 0 },
      { name: 'Tabletler & E-Okuyucular', count: 0 },
      { name: 'TV & Video', count: 0 },
      { name: 'Video Oyunları', count: 0 },
      { name: 'Diğer Elektronik', count: 0 },
    ]
  },
  {
    name: 'Evcil Hayvanlar',
    count: 0,
    subcategories: [
      { name: 'Balıklar', count: 0 },
      { name: 'Köpekler', count: 0 },
      { name: 'Kediler', count: 0 },
      { name: 'Küçük Hayvanlar', count: 0 },
      { name: 'Çiftlik Hayvanları', count: 0 },
      { name: 'Atlar', count: 0 },
      { name: 'Hayvan Bakımı & Eğitim', count: 0 },
      { name: 'Kayıp Hayvanlar', count: 0 },
      { name: 'Kuşlar', count: 0 },
      { name: 'Aksesuarlar', count: 0 },
    ]
  },
  {
    name: 'Aile, Çocuk & Bebek',
    count: 0,
    subcategories: [
      { name: 'Yaşlı Bakımı', count: 0 },
      { name: 'Bebek & Çocuk Giyimi', count: 0 },
      { name: 'Bebek & Çocuk Ayakkabıları', count: 0 },
      { name: 'Bebek Ekipmanları', count: 0 },
      { name: 'Bebek Koltuğu & Oto Koltukları', count: 0 },
      { name: 'Babysitter & Çocuk Bakımı', count: 0 },
      { name: 'Bebek Arabaları & Pusetler', count: 0 },
      { name: 'Bebek Odası Mobilyaları', count: 0 },
      { name: 'Oyuncaklar', count: 0 },
      { name: 'Diğer Aile, Çocuk & Bebek', count: 0 },
    ]
  },
  {
    name: 'İş İlanları',
    count: 0,
    subcategories: [
      { name: 'Mesleki Eğitim', count: 0 },
      { name: 'İnşaat, El Sanatları & Üretim', count: 0 },
      { name: 'Büro İşleri & Yönetim', count: 0 },
      { name: 'Gastronomi & Turizm', count: 0 },
      { name: 'Müşteri Hizmetleri & Çağrı Merkezi', count: 0 },
      { name: 'Ek İşler', count: 0 },
      { name: 'Staj', count: 0 },
      { name: 'Sosyal Sektör & Bakım', count: 0 },
      { name: 'Taşımacılık & Lojistik', count: 0 },
      { name: 'Satış & Pazarlama', count: 0 },
      { name: 'Diğer İş İlanları', count: 0 },
    ]
  },
  {
    name: 'Eğlence, Hobi & Mahalle',
    count: 0,
    subcategories: [
      { name: 'Ezoterizm & Spiritüalizm', count: 0 },
      { name: 'Yiyecek & İçecek', count: 0 },
      { name: 'Boş Zaman Aktiviteleri', count: 0 },
      { name: 'El Sanatları & Hobi', count: 0 },
      { name: 'Sanat & Antikalar', count: 0 },
      { name: 'Sanatçılar & Müzisyenler', count: 0 },
      { name: 'Model Yapımı', count: 0 },
      { name: 'Seyahat & Etkinlik Hizmetleri', count: 0 },
      { name: 'Koleksiyon', count: 0 },
      { name: 'Spor & Camping', count: 0 },
      { name: 'Bit Pazarı', count: 0 },
      { name: 'Kayıp & Buluntu', count: 0 },
      { name: 'Diğer Eğlence, Hobi & Mahalle', count: 0 },
    ]
  },
  {
    name: 'Müzik, Film & Kitap',
    count: 0,
    subcategories: [
      { name: 'Kitap & Dergi', count: 0 },
      { name: 'Kırtasiye', count: 0 },
      { name: 'Çizgi Romanlar', count: 0 },
      { name: 'Ders Kitapları, Okul & Eğitim', count: 0 },
      { name: 'Film & DVD', count: 0 },
      { name: "Müzik & CD'ler", count: 0 },
      { name: 'Müzik Enstrümanları', count: 0 },
      { name: 'Diğer Müzik, Film & Kitap', count: 0 },
    ]
  },
  {
    name: 'Biletler',
    count: 0,
    subcategories: [
      { name: 'Tren & Toplu Taşıma', count: 0 },
      { name: 'Komedi & Kabare', count: 0 },
      { name: 'Hediye Çekleri', count: 0 },
      { name: 'Çocuk Etkinlikleri', count: 0 },
      { name: 'Konserler', count: 0 },
      { name: 'Spor', count: 0 },
      { name: 'Tiyatro & Müzikal', count: 0 },
      { name: 'Diğer Biletler', count: 0 },
    ]
  },
  {
    name: 'Hizmetler',
    count: 0,
    subcategories: [
      { name: 'Yaşlı Bakımı', count: 0 },
      { name: 'Otomobil, Bisiklet & Tekne', count: 0 },
      { name: 'Babysitter & Çocuk Bakımı', count: 0 },
      { name: 'Elektronik', count: 0 },
      { name: 'Ev & Bahçe', count: 0 },
      { name: 'Sanatçılar & Müzisyenler', count: 0 },
      { name: 'Seyahat & Etkinlik', count: 0 },
      { name: 'Hayvan Bakımı & Eğitim', count: 0 },
      { name: 'Taşımacılık & Nakliye', count: 0 },
      { name: 'Diğer Hizmetler', count: 0 },
    ]
  },
  {
    name: 'Ücretsiz & Takas',
    count: 0,
    subcategories: [
      { name: 'Takas', count: 0 },
      { name: 'Kiralama', count: 0 },
      { name: 'Ücretsiz', count: 0 },
    ]
  },
  {
    name: 'Eğitim & Kurslar',
    count: 0,
    subcategories: [
      { name: 'Bilgisayar Kursları', count: 0 },
      { name: 'Ezoterizm & Spiritüalizm', count: 0 },
      { name: 'Yemek & Pastacılık', count: 0 },
      { name: 'Sanat & Tasarım', count: 0 },
      { name: 'Müzik & Şan', count: 0 },
      { name: 'Özel Ders', count: 0 },
      { name: 'Spor Kursları', count: 0 },
      { name: 'Dil Kursları', count: 0 },
      { name: 'Dans Kursları', count: 0 },
      { name: 'Sürekli Eğitim', count: 0 },
      { name: 'Diğer Eğitim & Kurslar', count: 0 },
    ]
  },
  {
    name: 'Komşu Yardımı',
    count: 3,
    subcategories: [
      { name: 'Komşu Yardımı', count: 3 },
    ]
  }

];

// Mock data for listings
// İlan numarası oluşturma fonksiyonu
export const generateListingNumber = (listing) => {
  // Use listing_number from database if available, otherwise fallback to ID-based number
  if (listing && listing.listing_number) {
    return listing.listing_number.toString();
  }
  // Fallback for old listings without listing_number
  return `${1000 + (parseInt(listing?.id?.substring(0, 8), 16) % 9000)}`;
};

export const mockListings = [];


// Local Job Mappings to ensure translation if import fails
const localJobMappings = {
  'Vollzeit': 'Tam Zamanlı',
  'Teilzeit': 'Yarı Zamanlı',
  'Minijob': 'Mini İş',
  'Praktikum': 'Staj',
  'Werkstudent': 'Çalışan Öğrenci',
  'Selbstständig': 'Serbest Çalışan',
  'Angebote': 'Satılık',
  'Gesuche': 'Aranıyor',
  'Privat': 'Bireysel',
  'Gewerblich': 'Kurumsal',
  'Bauhelfer/-in': 'İnşaat Yardımcısı',
  'Dachdecker/-in': 'Çatı Ustası',
  'Elektriker/-in': 'Elektrikçi',
  'Fliesenleger/-in': 'Fayansçı',
  'Maler/-in': 'Boyacı',
  'Maurer/-in': 'Duvarcı',
  'Produktionshelfer/-in': 'Üretim Yardımcısı',
  'Schlosser/-in': 'Çilingir',
  'Tischler/-in': 'Marangoz',
  'Buchhalter/-in': 'Muhasebeci',
  'Bürokaufmann/-frau': 'Ofis Elemanı',
  'Sachbearbeiter/-in': 'Dosya Sorumlusu',
  'Sekretär/-in': 'Sekreter',
  'Barkeeper/-in': 'Barmen/Barmaid',
  'Hotelfachmann/-frau': 'Otel Elemanı',
  'Kellner/-in': 'Garson',
  'Koch/Köchin': 'Aşçı',
  'Küchenhilfe': 'Mutfak Yardımcısı',
  'Servicekraft': 'Servis Elemanı',
  'Housekeeping': 'Kat Hizmetleri',
  'Weitere Berufe': 'Diğer Meslekler'
};

const jobMap = (val) => {
  if (!val) return val;
  return (t.jobMappings && t.jobMappings[val]) || localJobMappings[val] || val;
};

export const mockListings2 = [];

const galleryItems = [];


// Mock data for sellers
const mockSellers = {};


// Header Component
export const Header = ({ followedSellers = [], setSelectedCategory }) => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = React.useState(false);
  const [unreadCount, setUnreadCount] = React.useState(0);
  const [notificationCount, setNotificationCount] = React.useState(0);
  const [notifications, setNotifications] = React.useState([]);
  const [notificationDropdownOpen, setNotificationDropdownOpen] = React.useState(false);
  const [userProfile, setUserProfile] = React.useState(null);

  // Fetch user profile for display name
  React.useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        try {
          const { fetchUserProfile } = await import('./api/profile');
          const profile = await fetchUserProfile(user.id);
          setUserProfile(profile);
        } catch (error) {
          console.error('Error fetching user profile:', error);
        }
      }
    };

    fetchProfile();
  }, [user]);

  // Fetch unread message count
  React.useEffect(() => {
    const fetchUnreadCount = async () => {
      if (user) {
        try {
          const { getUnreadCount } = await import('./api/messages');
          const count = await getUnreadCount();
          setUnreadCount(count);
        } catch (error) {
          console.error('Error fetching unread count:', error);
        }
      }
    };

    if (user) {
      fetchUnreadCount();
      // Refresh every 30 seconds
      const interval = setInterval(fetchUnreadCount, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  // Fetch notifications
  React.useEffect(() => {
    const fetchNotifications = async () => {
      if (user) {
        try {
          const { getNotificationCount, getUnreadNotifications } = await import('./api/notifications');
          const count = await getNotificationCount();
          const notifs = await getUnreadNotifications();
          setNotificationCount(count);
          setNotifications(notifs);
        } catch (error) {
          console.error('Error fetching notifications:', error);
        }
      }
    };

    if (user) {
      fetchNotifications();
      // Refresh every 30 seconds
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <>
      <header className="glass fixed w-full top-0 z-50 border-b border-neutral-200/50 shadow-lg overflow-visible">
        <div className="max-w-[1400px] mx-auto px-4 h-16 sm:h-20 flex items-center justify-between gap-2 sm:gap-4 overflow-visible">
          {/* Mobile Menu Button - Hidden on mobile if bottom nav is present */}
          {!isMobile && (
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors"
              aria-label="Menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          )}

          <div
            onClick={() => {
              if (setSelectedCategory) setSelectedCategory(t.categories.all);
              navigate('/');
              setMobileMenuOpen(false);
            }}
            className="cursor-pointer flex-shrink-0 px-2 sm:px-4 py-2 rounded-xl flex items-center gap-2 group"
          >
            <img
              src="/logo_exvitrin_2026.png"
              alt="ExVitrin"
              className="h-10 sm:h-12 w-auto object-contain transition-transform group-hover:scale-110"
            />
            <span className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent tracking-tight">
              exvitrin
            </span>
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            {user ? (
              <>


                {/* Admin Panel Button - For User 1001, kerem_aydin@aol.com or any user with is_admin=true */}
                {(userProfile?.user_number === 1001 || user.email === 'kerem_aydin@aol.com' || userProfile?.is_admin) && (
                  <button
                    onClick={() => navigate('/admin')}
                    className="p-3 text-neutral-600 hover:text-pink-600 hover:bg-gradient-to-r hover:from-pink-50 hover:to-red-50 rounded-xl transition-all duration-300 relative focus:outline-none group"
                    title="Admin Panel"
                  >
                    <svg className="w-6 h-6 transform group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </button>
                )}
                <span className="text-neutral-700 font-semibold hidden sm:inline-block">
                  <span className="text-neutral-500">{t.common.hello},</span>{' '}
                  <span className="gradient-text">{userProfile?.full_name || user.email?.split('@')[0]}</span>
                </span>

                <button
                  onClick={handleLogout}
                  className="px-5 py-2.5 bg-white border-2 border-neutral-300 rounded-full text-neutral-700 hover:border-primary-500 hover:text-primary-600 transition-all duration-300 font-semibold shadow-sm hover:shadow-premium transform hover:-translate-y-0.5 focus:outline-none"
                >
                  {t.nav.logout}
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => navigate('/register')}
                  className="px-5 py-2.5 bg-white border-2 border-neutral-300 rounded-full text-neutral-700 hover:border-primary-500 hover:text-primary-600 transition-all duration-300 font-semibold shadow-sm hover:shadow-premium transform hover:-translate-y-0.5 focus:outline-none hidden sm:inline-block"
                >
                  {t.nav.register}
                </button>
                <span className="text-neutral-400 hidden sm:inline-block">{t.common.or}</span>
                <button
                  onClick={() => navigate('/login')}
                  className="px-6 py-2.5 bg-gradient-premium text-white rounded-full shadow-premium hover:shadow-premium-lg transform hover:-translate-y-0.5 transition-all duration-300 font-bold focus:outline-none relative overflow-hidden group"
                >
                  <span className="relative z-10">{t.nav.login}</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-primary-700 to-primary-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
              </>
            )}

            {/* Notifications Icon - Visible only on Desktop to keep mobile header clean */}
            {!isMobile && (
              <div className="relative">
                <button
                  onClick={() => setNotificationDropdownOpen(!notificationDropdownOpen)}
                  className="p-3 text-neutral-600 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all duration-300 relative focus:outline-none group"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  {notificationCount > 0 ? (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-pulse shadow-glow">
                      {notificationCount}
                    </span>
                  ) : (
                    <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-gradient-accent rounded-full animate-pulse shadow-glow"></span>
                  )}
                </button>

                {/* Notification Dropdown */}
                {notificationDropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setNotificationDropdownOpen(false)}
                    ></div>
                    <div className="absolute right-0 mt-2 w-96 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 max-h-96 overflow-y-auto">
                      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                        <h3 className="font-bold text-gray-900">Bildirimler</h3>
                        {notificationCount > 0 && (
                          <span className="text-xs text-gray-500">{notificationCount} yeni</span>
                        )}
                      </div>
                      {notifications.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">
                          <svg className="w-12 h-12 mx-auto mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                          </svg>
                          <p className="text-sm">Henüz bildirim yok</p>
                        </div>
                      ) : (
                        <div className="divide-y divide-gray-100">
                          {notifications.map((notification) => (
                            <div
                              key={notification.id}
                              onClick={async () => {
                                try {
                                  const { markNotificationAsRead } = await import('./api/notifications');
                                  await markNotificationAsRead(notification.id);
                                  setNotificationDropdownOpen(false);
                                  if (notification.listing_id) {
                                    navigate(`/product/${notification.listing_id}`);
                                  }
                                } catch (error) {
                                  console.error('Error handling notification click:', error);
                                }
                              }}
                              className="p-4 hover:bg-gray-50 cursor-pointer transition-colors flex items-start gap-3"
                            >
                              <div className="flex-shrink-0 mt-1 relative">
                                {notification.type === 'price_drop' ? (
                                  <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                    </svg>
                                  </div>
                                ) : notification.type === 'new_listing' ? (
                                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                  </div>
                                ) : (
                                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                    </svg>
                                  </div>
                                )}
                                {!notification.is_read && (
                                  <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-blue-500 rounded-full border-2 border-white shadow-glow"></div>
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-gray-900 truncate">
                                  {notification.title}
                                </p>
                                <p className="text-xs text-gray-600 mt-1">
                                  {notification.message}
                                </p>
                                <p className="text-xs text-gray-400 mt-1">
                                  {new Date(notification.created_at).toLocaleDateString('tr-TR', {
                                    day: 'numeric',
                                    month: 'short',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Mobile Icons */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={() => window.location.href = '/messages'}
              className="p-2 text-neutral-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all relative"
              title={t.nav.messages}
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
          </div>
        </div>

        {/* Mobile Menu Drawer */}
        {
          mobileMenuOpen && (
            <>
              {/* Overlay */}
              <div
                className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                onClick={() => setMobileMenuOpen(false)}
              ></div>

              {/* Drawer */}
              <div className="fixed top-0 left-0 h-full w-80 max-w-[85vw] bg-white shadow-2xl z-50 lg:hidden overflow-y-auto">
                <div className="p-6">
                  {/* Close Button */}
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="absolute top-4 right-4 p-2 text-neutral-600 hover:bg-neutral-100 rounded-lg"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>

                  {/* User Info */}
                  {currentUser ? (
                    <div className="mb-6 pb-6 border-b border-neutral-200">
                      <p className="text-sm text-neutral-500 mb-1">{t.common.hello},</p>
                      <p className="text-lg font-bold gradient-text">{currentUser.name}</p>
                    </div>
                  ) : (
                    <div className="mb-6 pb-6 border-b border-neutral-200 space-y-3">
                      <button
                        onClick={() => {
                          navigate('/login');
                          setMobileMenuOpen(false);
                        }}
                        className="w-full px-6 py-3 bg-gradient-premium text-white rounded-full shadow-premium font-bold"
                      >
                        {t.nav.login}
                      </button>
                      <button
                        onClick={() => {
                          navigate('/register');
                          setMobileMenuOpen(false);
                        }}
                        className="w-full px-6 py-3 bg-white border-2 border-neutral-300 rounded-full text-neutral-700 font-semibold"
                      >
                        {t.nav.register}
                      </button>
                    </div>
                  )}

                  {/* Menu Items */}
                  <nav className="space-y-2">
                    <button
                      onClick={() => {
                        navigate('/');
                        setMobileMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-3 text-neutral-700 hover:bg-neutral-100 rounded-lg font-medium flex items-center gap-3"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                      {t.nav.home}
                    </button>

                    <button
                      onClick={() => {
                        navigate('/Butun-Kategoriler');
                        setMobileMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-3 text-neutral-700 hover:bg-neutral-100 rounded-lg font-medium flex items-center gap-3"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                      </svg>
                      {t.categories.all}
                    </button>

                    <button
                      onClick={() => {
                        navigate('/packages');
                        setMobileMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-3 text-neutral-700 hover:bg-neutral-100 rounded-lg font-medium flex items-center gap-3"
                    >
                      <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                      </svg>
                      Abonelik Paketleri
                    </button>

                    <button
                      onClick={() => {
                        navigate('/messages');
                        setMobileMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-3 text-neutral-700 hover:bg-neutral-100 rounded-lg font-medium flex items-center gap-3"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      {t.nav.messages}
                    </button>

                    <button
                      onClick={() => {
                        navigate('/favorites');
                        setMobileMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-3 text-neutral-700 hover:bg-neutral-100 rounded-lg font-medium flex items-center gap-3"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      {t.nav.favorites}
                    </button>

                    {currentUser && (
                      <button
                        onClick={() => {
                          handleLogout();
                          setMobileMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg font-medium flex items-center gap-3 mt-4"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        {t.nav.logout}
                      </button>
                    )}
                  </nav>
                </div>
              </div>
            </>
          )
        }
      </header >
      <div className="h-16 sm:h-20"></div>
    </>
  );
};

// Checkout Component
export const Checkout = ({ cartItems, setCartItems }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    zip: '',
    email: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('paypal');

  const total = cartItems.reduce((sum, item) => {
    if (!item.price) return sum;
    const priceStr = String(item.price);
    // Almanca format: 1.800,50 ₺ → 1800.50
    // Önce ₺ ve boşlukları temizle, sonra binlik ayırıcı noktaları kaldır, virgülü noktaya çevir
    const cleanPrice = priceStr.replace('₺', '').replace(/\s/g, '').trim();
    const price = parseFloat(cleanPrice.replace(/\./g, '').replace(',', '.')) || 0;
    return sum + (price * (item.quantity || 1));
  }, 0);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Miktar güncelleme fonksiyonu
  const updateQuantity = (index, newQuantity) => {
    if (newQuantity < 1) return;
    const updatedCart = [...cartItems];
    updatedCart[index] = { ...updatedCart[index], quantity: newQuantity };
    setCartItems(updatedCart);
  };

  // Ürün silme fonksiyonu
  const removeItem = (index) => {
    const updatedCart = cartItems.filter((_, i) => i !== index);
    setCartItems(updatedCart);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Email bildirimi gönder
    const orderData = {
      orderId: `ORD-${Date.now()}`,
      email: formData.email,
      items: cartItems,
      total: `${total.toFixed(2).replace('.', ',')} ₺`,
      customerName: `${formData.firstName} ${formData.lastName}`,
      address: `${formData.address}, ${formData.zip} ${formData.city}`
    };

    // Email bildirimini simüle et
    console.log('📧 Sending order confirmation email...');
    console.log('Order Data:', orderData);

    // LocalStorage'dan email ayarlarını kontrol et
    const emailSettings = JSON.parse(localStorage.getItem('emailSettings') || '{"orderConfirmation":true}');
    if (emailSettings.orderConfirmation) {
      console.log('✅ Order confirmation email sent to:', orderData.email);
      console.log('📦 Order ID:', orderData.orderId);
      console.log('💰 Total:', orderData.total);
    }

    alert(`Siparişiniz için teşekkür ederiz!\n\nSipariş Numarası: ${orderData.orderId}\n\n${formData.email} adresine bir onay e-postası gönderildi.`);
    setCartItems([]);
    navigate('/');
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-[1400px] mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">{t.cart.empty}</h2>
        <p className="text-gray-600 mb-8">{t.cart.addItems}</p>
        <button
          onClick={() => navigate('/')}
          className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold py-3 px-8 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
        >
          {t.cart.continueShopping}
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">{t.checkout.title}</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column - Forms */}
        <div className="lg:col-span-2 space-y-8">
          {/* Shipping Address */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold mb-4">{t.checkout.deliveryAddress}</h2>
            <form id="checkout-form" onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t.addListing.firstName}</label>
                <input
                  type="text"
                  name="firstName"
                  required
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-400 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t.addListing.lastName}</label>
                <input
                  type="text"
                  name="lastName"
                  required
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-400 focus:border-transparent"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">{t.addListing.streetHouse}</label>
                <input
                  type="text"
                  name="address"
                  required
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-400 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t.checkout.postalCode}</label>
                <input
                  type="text"
                  name="zip"
                  required
                  value={formData.zip}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-400 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t.addListing.city}</label>
                <input
                  type="text"
                  name="city"
                  required
                  value={formData.city}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-400 focus:border-transparent"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">{t.addListing.emailAddress}</label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-400 focus:border-transparent"
                />
              </div>
            </form>
          </div>

          {/* Payment Method */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold mb-4">{t.checkout.paymentMethod}</h2>
            <div className="space-y-3">
              <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="payment"
                  value="paypal"
                  checked={paymentMethod === 'paypal'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-4 h-4 text-red-500 focus:ring-red-400"
                />
                <span className="ml-3 font-medium">PayPal</span>
              </label>
              <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="payment"
                  value="credit_card"
                  checked={paymentMethod === 'credit_card'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-4 h-4 text-red-500 focus:ring-red-400"
                />
                <span className="ml-3 font-medium">Kreditkarte</span>
              </label>
              <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="payment"
                  value="invoice"
                  checked={paymentMethod === 'invoice'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-4 h-4 text-red-500 focus:ring-red-400"
                />
                <span className="ml-3 font-medium">Rechnung</span>
              </label>
            </div>
          </div>
        </div>

        {/* Right Column - Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 sticky top-4">
            <h2 className="text-xl font-semibold mb-4">{t.checkout.orderSummary}</h2>
            <div className="space-y-6 mb-6">
              {(() => {
                // Ürünleri satıcıya göre grupla
                const groupedBySeller = cartItems.reduce((acc, item) => {
                  const sellerId = item.sellerId || 'unknown';
                  if (!acc[sellerId]) {
                    acc[sellerId] = [];
                  }
                  acc[sellerId].push(item);
                  return acc;
                }, {});

                return Object.entries(groupedBySeller).map(([sellerId, items]) => {
                  const seller = mockSellers[sellerId] || {
                    name: t.cart.unknownSeller,
                    initials: '?',
                    level: t.addListing.private,
                    rating: t.addListing.options.new,
                    profileImage: 'https://i.pravatar.cc/150'
                  };

                  return (
                    <div key={sellerId} className="border border-gray-200 rounded-lg p-4 hover:border-red-300 transition-colors">
                      {/* Satıcı Profili - Üstte ve Tıklanabilir */}
                      <div
                        onClick={() => navigate(`/seller/${seller?.user_number || sellerId}`)}
                        className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-3 mb-3 cursor-pointer hover:from-red-50 hover:to-orange-50 transition-all duration-200 group"
                      >
                        <div className="flex items-center gap-3">
                          {/* Satıcı Profil Resmi */}
                          <div className="relative flex-shrink-0">
                            {seller.profileImage ? (
                              <img
                                src={seller.profileImage}
                                alt={seller.name}
                                className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-md group-hover:border-red-300 transition-colors"
                              />
                            ) : (
                              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center text-white font-bold border-2 border-white shadow-md">
                                {seller.initials}
                              </div>
                            )}
                            {/* Online Status Badge */}
                            <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></div>
                          </div>

                          {/* Satıcı Detayları */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-bold text-gray-900 truncate group-hover:text-red-600 transition-colors">{seller.name}</p>
                              {seller.level === 'Gewerblich' && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                  <svg className="w-3 h-3 mr-0.5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                  </svg>
                                  Pro
                                </span>
                              )}
                            </div>

                            {/* Bewertung */}
                            <div className="flex items-center gap-2 mb-1">
                              <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                  <svg
                                    key={i}
                                    className={`w-3.5 h-3.5 ${i < (seller.rating === 'Sehr gut' ? 5 : seller.rating === 'Gut' ? 4 : 3) ? 'text-yellow-400' : 'text-gray-300'}`}
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                  </svg>
                                ))}
                              </div>
                              <span className="text-xs text-gray-600">({seller.totalRatings || 0})</span>
                            </div>

                            {/* Antwortzeit */}
                            <div className="flex items-center gap-1">
                              <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <span className="text-xs text-gray-600">Yanıt süresi: {seller.responseTime || 'birkaç saat'}</span>
                            </div>
                          </div>

                          {/* Profil anzeigen Icon */}
                          <div className="flex-shrink-0">
                            <svg className="w-5 h-5 text-gray-400 group-hover:text-red-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                        </div>
                      </div>

                      {/* Satıcının Ürünleri */}
                      <div className="space-y-3">
                        {items.map((item, itemIndex) => {
                          // Orijinal cart index'ini bul
                          const cartIndex = cartItems.findIndex(cartItem =>
                            cartItem.id === item.id && cartItem.sellerId === item.sellerId
                          );

                          return (
                            <div key={itemIndex} className="flex gap-3 text-sm bg-white rounded-lg p-3 border border-gray-100 hover:border-gray-200 transition-colors">
                              <img src={item.image} alt={item.title} className="w-16 h-16 object-cover rounded-lg flex-shrink-0" />
                              <div className="flex-1 min-w-0">
                                <p className="font-medium line-clamp-2 text-sm mb-2">{item.title}</p>

                                {/* Miktar Kontrolü */}
                                <div className="flex items-center gap-2">
                                  <span className="text-xs text-gray-500">{t.cart.quantity}:</span>
                                  <div className="flex items-center border border-gray-300 rounded-full bg-white overflow-hidden">
                                    <button
                                      onClick={() => updateQuantity(cartIndex, (item.quantity || 1) - 1)}
                                      className="px-2 py-1 hover:bg-gray-50 text-gray-600 transition-colors"
                                      type="button"
                                    >
                                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                                      </svg>
                                    </button>
                                    <div className="w-10 text-center font-medium text-gray-900 text-xs border-x border-gray-300 py-1">
                                      {item.quantity || 1}
                                    </div>
                                    <button
                                      onClick={() => updateQuantity(cartIndex, (item.quantity || 1) + 1)}
                                      className="px-2 py-1 hover:bg-gray-50 text-gray-600 transition-colors"
                                      type="button"
                                    >
                                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                      </svg>
                                    </button>
                                  </div>

                                  {/* Silme Butonu */}
                                  <button
                                    onClick={() => removeItem(cartIndex)}
                                    className="ml-auto p-1.5 hover:bg-red-50 text-gray-400 hover:text-red-600 rounded-lg transition-colors"
                                    title={t.cart.remove}
                                    type="button"
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                  </button>
                                </div>
                              </div>
                              <div className="font-semibold text-red-600 text-sm whitespace-nowrap flex-shrink-0">
                                {(() => {
                                  const priceStr = String(item.price);
                                  const cleanPrice = priceStr.replace('₺', '').replace(/\s/g, '').trim();
                                  const unitPrice = parseFloat(cleanPrice.replace(/\./g, '').replace(',', '.')) || 0;
                                  const totalPrice = unitPrice * (item.quantity || 1);
                                  return totalPrice.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' ₺';
                                })()}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Satıcı Toplam */}
                      <div className="mt-3 pt-3 border-t border-gray-200 flex justify-between items-center">
                        <span className="text-sm text-gray-600">
                          {t.checkout.subtotal} ({items.reduce((total, item) => total + (item.quantity || 1), 0)} {t.cart.item})
                        </span>
                        <span className="font-semibold text-gray-900">
                          {items.reduce((sum, item) => {
                            const priceStr = String(item.price);
                            // Almanca format: 1.800,50 ₺ → 1800.50
                            const cleanPrice = priceStr.replace('₺', '').replace(/\s/g, '').trim();
                            const price = parseFloat(cleanPrice.replace(/\./g, '').replace(',', '.')) || 0;
                            return sum + (price * (item.quantity || 1));
                          }, 0).toFixed(2).replace('.', ',')} ₺
                        </span>
                      </div>
                    </div>
                  );
                });
              })()}
            </div>

            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between text-gray-600">
                <span>{t.checkout.subtotal}</span>
                <span>{total.toFixed(2).replace('.', ',')} ₺</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>{t.checkout.shipping}</span>
                <span>{t.checkout.free}</span>
              </div>
              <div className="flex justify-between text-xl font-bold text-gray-900 pt-2 border-t">
                <span>{t.checkout.total}</span>
                <span>{total.toFixed(2).replace('.', ',')} ₺</span>
              </div>
            </div>

            <button
              type="submit"
              form="checkout-form"
              className="w-full mt-6 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold py-3 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
            >
              {t.checkout.buyNow}
            </button>

            <p className="text-xs text-gray-500 mt-4 text-center">
              {t.checkout.termsConsent}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
// Placeholder Components for Meins Dropdown
export const Messages = () => (
  <div className="max-w-[1400px] mx-auto px-4 py-12 text-center">
    <h2 className="text-2xl font-bold text-gray-900 mb-4">{t.nav.messages}</h2>
    <p className="text-gray-600">Mesajlarınız yakında burada görünecek.</p>
  </div>
);

export const MyListings = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = React.useState(null);
  const [listings, setListings] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [favoriteCounts, setFavoriteCounts] = React.useState({});
  const [selectedListing, setSelectedListing] = React.useState(null);
  const [isPromotionModalOpen, setIsPromotionModalOpen] = React.useState(false);

  // Check authentication and load user
  React.useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      // Redirect to login if not authenticated
      navigate('/login');
      return;
    }

    try {
      const user = JSON.parse(storedUser);
      setCurrentUser(user);

      // Fetch user's listings
      fetchUserListings(user.id);
    } catch (e) {
      localStorage.removeItem('user');
      navigate('/login');
    }
  }, [navigate]);

  const fetchUserListings = async (userId) => {
    try {
      // Use Supabase API
      const { fetchUserListings: fetchFromSupabase } = await import('./api/listings');
      const data = await fetchFromSupabase(userId);
      setListings(data);

      // Fetch favorite counts for each listing
      await fetchFavoriteCounts(data);

      setLoading(false);
    } catch (error) {
      console.error('Error fetching user listings:', error);
      setLoading(false);
    }
  };

  const fetchFavoriteCounts = async (listingsData) => {
    try {
      const { favoritesApi } = await import('./api/favorites');
      const counts = {};
      await Promise.all(
        listingsData.map(async (listing) => {
          const listingId = listing._id || listing.id;
          const count = await favoritesApi.getFavoriteCount(listingId);
          counts[listingId] = count;
        })
      );
      setFavoriteCounts(counts);
    } catch (error) {
      console.error('Error fetching favorite counts:', error);
    }
  };

  const handlePromote = (listing) => {
    setSelectedListing(listing);
    setIsPromotionModalOpen(true);
  };

  const handlePromotionConfirm = async (packageId) => {
    try {
      const { purchasePromotion } = await import('./api/promotions');
      const packageDetails = {
        gallery: { id: 'gallery', price: 59.90, duration: 30 },
        top: { id: 'top', price: 39.90, duration: 15 },
        highlight: { id: 'highlight', price: 19.90, duration: 30 },
        'multi-bump': { id: 'multi-bump', price: 29.90, duration: 7 },
        premium: { id: 'z_premium', price: 19.99, duration: 7 }
      }[packageId];

      await purchasePromotion(selectedListing.id, packageDetails, currentUser.id);

      // Refresh listings to show updated promotion status
      if (currentUser) {
        fetchUserListings(currentUser.id);
      }
    } catch (error) {
      console.error('Promotion failed:', error);
      throw error;
    }
  };

  if (loading) {
    return (
      <div className="max-w-[1400px] mx-auto px-4 py-12 text-center">
        <LoadingSpinner size="medium" className="mx-auto" />
        <p className="text-gray-600 mt-4">{t.myListingsPage.loading}</p>
      </div>
    );
  }

  if (listings.length === 0) {
    return (
      <div className="max-w-[1400px] mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">{t.myListingsPage.title}</h2>
        <p className="text-gray-600 mb-8">{t.myListingsPage.noListings}</p>
        <button
          onClick={() => navigate('/add-listing')}
          className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold py-3 px-8 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
        >
          {t.myListingsPage.createFirst}
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">{t.myListingsPage.title}</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {listings.map((listing) => (
          <div key={listing._id || listing.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
            {listing.image && (
              <img
                src={listing.image}
                alt={listing.title}
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-3">
              <h3 className="font-medium text-sm text-gray-900 line-clamp-2 mb-2 min-h-[40px]">
                {listing.title}
              </h3>
              <span className="text-base font-bold text-gray-900">
                {listing.price_type === 'giveaway' || listing.price === 0
                  ? t.addListing.options.givingAway
                  : typeof listing.price === 'number'
                    ? `${listing.price.toLocaleString('tr-TR')} ₺`
                    : listing.price?.toString().includes('₺')
                      ? listing.price
                      : `${listing.price} ₺`}
              </span>
              <p className="text-gray-500 text-sm mb-2">{listing.city || listing.location}</p>

              {/* Favorite Count */}
              <div className="flex items-center gap-1 text-sm text-gray-600 mb-3">
                <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">{favoriteCounts[listing._id || listing.id] || 0}</span>
                <span>Favoriler</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => navigate(`/product/${listing._id || listing.id}`)}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-2 rounded-lg transition-colors text-xs"
                >
                  {t.productDetail.details || 'Detaylar'}
                </button>
                <button
                  onClick={() => handlePromote(listing)}
                  className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium py-2 px-2 rounded-lg transition-colors text-xs shadow-sm"
                >
                  {t.promotions.title}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <PromotionModal
        isOpen={isPromotionModalOpen}
        onClose={() => setIsPromotionModalOpen(false)}
        listingTitle={selectedListing?.title}
        onConfirm={handlePromotionConfirm}
      />
    </div>
  );
};

export const Settings = () => {
  const [newsletter, setNewsletter] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [currentEmail, setCurrentEmail] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newEmailConfirm, setNewEmailConfirm] = useState('');
  const [password, setPassword] = useState('');
  const [isCommercial, setIsCommercial] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('+49********414');
  const [hasLucidId, setHasLucidId] = useState(null);
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [newPhoneNumber, setNewPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordConfirm, setNewPasswordConfirm] = useState('');
  const [showBillingModal, setShowBillingModal] = useState(false);
  const [billingData, setBillingData] = useState({
    firstName: '',
    lastName: '',
    street: '',
    houseNumber: '',
    zip: '',
    city: '',
    country: 'Deutschland'
  });

  // Store Management States
  const [storeName, setStoreName] = useState('');
  const [storeDescription, setStoreDescription] = useState('');
  const [storeLogo, setStoreLogo] = useState('');
  const [storeBanner, setStoreBanner] = useState('');
  const [isPro, setIsPro] = useState(false);

  useEffect(() => {
    const fetchProfileData = async () => {
      const storedUserString = localStorage.getItem('user');
      if (!storedUserString) return;

      try {
        const storedUser = JSON.parse(storedUserString);
        const { supabase: supabaseClient } = await import('./lib/supabase');

        // Fetch latest profile data to ensure is_pro is accurate
        const { data: profile, error } = await supabaseClient
          .from('profiles')
          .select('*')
          .eq('id', storedUser.id)
          .single();

        if (error) throw error;

        if (profile) {
          setStoreName(profile.store_name || '');
          setStoreDescription(profile.store_description || '');
          setStoreLogo(profile.store_logo || '');
          setStoreBanner(profile.store_banner || '');
          setIsPro(profile.is_pro || false);
          setIsCommercial(profile.is_pro || profile.is_commercial || false);

          // Update localStorage to stay in sync
          const updatedUser = { ...storedUser, ...profile };
          localStorage.setItem('user', JSON.stringify(updatedUser));
          if (typeof setCurrentUser === 'function') setCurrentUser(updatedUser);
        }
      } catch (e) {
        console.error('Error fetching profile data:', e);
      }
    };

    fetchProfileData();
  }, [currentUser?.id]);

  const handleStoreUpdate = async (e) => {
    e.preventDefault();
    try {
      const { supabase: supabaseClient } = await import('./lib/supabase');
      const storedUser = JSON.parse(localStorage.getItem('user'));

      const { error } = await supabaseClient
        .from('profiles')
        .update({
          store_name: storeName,
          store_description: storeDescription,
          store_logo: storeLogo,
          store_banner: storeBanner
        })
        .eq('id', storedUser.id);

      if (error) throw error;
      alert(t.addListing.updateSuccess);

      // Update local storage user
      const updatedUser = { ...storedUser, store_name: storeName, store_description: storeDescription, store_logo: storeLogo, store_banner: storeBanner };
      localStorage.setItem('user', JSON.stringify(updatedUser));
    } catch (error) {
      console.error('Store update failed:', error);
      alert(t.addListing.error);
    }
  };

  const handleEmailChange = (e) => {
    e.preventDefault();
    if (newEmail !== newEmailConfirm) {
      alert(t.settings.emailsNoMatch);
      return;
    }
    alert(t.settings.emailConfirmSent);
    setCurrentEmail('');
    setNewEmail('');
    setNewEmailConfirm('');
    setPassword('');
  };

  const handlePhoneChange = (e) => {
    e.preventDefault();
    if (!newPhoneNumber || !verificationCode) {
      alert(t.settings.fillAllFields);
      return;
    }
    alert(t.settings.phoneChangeSuccess);
    setPhoneNumber(newPhoneNumber);
    setShowPhoneModal(false);
    setNewPhoneNumber('');
    setVerificationCode('');
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    if (newPassword !== newPasswordConfirm) {
      alert(t.settings.passwordsNoMatch);
      return;
    }
    if (newPassword.length < 8) {
      alert(t.settings.passwordMinLength);
      return;
    }
    alert(t.settings.passwordChangeSuccess);
    setShowPasswordModal(false);
    setCurrentPassword('');
    setNewPassword('');
    setNewPasswordConfirm('');
  };

  const handleBillingChange = (e) => {
    e.preventDefault();
    alert(t.settings.billingUpdateSuccess);
    setShowBillingModal(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">{t.settings.title}</h1>

        <div className="space-y-6">
          {/* Newsletter Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">{t.settings.newsletterTitle}</h2>
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={newsletter}
                onChange={(e) => setNewsletter(e.target.checked)}
                className="mt-1 w-4 h-4 text-red-500 focus:ring-red-400 rounded"
              />
              <span className="text-sm text-gray-700">
                {t.settings.newsletterText}
              </span>
            </label>
          </div>

          {/* Email Change Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">{t.settings.changeEmail}</h2>
            <div className="mb-4 text-sm text-gray-600 space-y-2">
              <p>{t.settings.changeEmailInstructions}</p>
              <p>{t.settings.changeEmailSecurity}</p>
              <p>{t.settings.changeEmailConfirm}</p>
              <p className="text-red-600">{t.settings.helpAreaLink}</p>
            </div>

            <form onSubmit={handleEmailChange} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t.settings.registeredEmail}
                </label>
                <input
                  type="email"
                  value={currentEmail}
                  onChange={(e) => setCurrentEmail(e.target.value)}
                  placeholder="aktuelle@email.de"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-400 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t.settings.newEmail}
                </label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="neue@email.de"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-400 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t.settings.repeatNewEmail}
                </label>
                <input
                  type="email"
                  value={newEmailConfirm}
                  onChange={(e) => setNewEmailConfirm(e.target.value)}
                  placeholder="neue@email.de"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-400 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t.settings.enterPassword}
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-400 focus:border-transparent"
                />
              </div>

              <button
                type="submit"
                className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium py-2 px-6 rounded-lg shadow-md hover:shadow-lg transition-all"
              >
                {t.settings.saveNewEmail}
              </button>
            </form>
          </div>

          {/* Email Notifications Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">{t.settings.emailNotifications}</h2>
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={emailNotifications}
                onChange={(e) => setEmailNotifications(e.target.checked)}
                className="mt-1 w-4 h-4 text-red-500 focus:ring-red-400 rounded"
              />
              <span className="text-sm text-gray-700">
                {t.settings.emailNotificationsText}
              </span>
            </label>
          </div>

          {/* Password Change Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">{t.settings.changePassword}</h2>
            <p className="text-sm text-gray-600 mb-4">
              {t.settings.passwordChangeInstructions}
            </p>
            <button
              onClick={() => setShowPasswordModal(true)}
              className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium py-2 px-6 rounded-lg shadow-md hover:shadow-lg transition-all"
            >
              {t.settings.changePassword}
            </button>
          </div>

          {/* Billing Data Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">{t.settings.billingTitle}</h2>
            <label className="flex items-center gap-3 cursor-pointer mb-4">
              <input
                type="checkbox"
                checked={isCommercial}
                onChange={(e) => setIsCommercial(e.target.checked)}
                className="w-4 h-4 text-red-500 focus:ring-red-400 rounded"
              />
              <span className="text-sm font-medium text-gray-700">{t.settings.commercial}</span>
            </label>
            <button
              onClick={() => setShowBillingModal(true)}
              className="text-red-600 hover:text-red-700 font-medium text-sm"
            >
              Rechnungsadresse ändern
            </button>
          </div>

          {/* Mağaza Ayarları Section (Only for PRO users) */}
          {(isPro || isCommercial) && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">{t.store.title}</h2>
                <button
                  onClick={() => navigate(`/store/${currentUser.id}`)}
                  className="text-red-600 hover:text-red-700 font-medium text-sm flex items-center gap-1"
                >
                  {t.store.preview}
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleStoreUpdate} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t.store.name}</label>
                    <input
                      type="text"
                      value={storeName}
                      onChange={(e) => setStoreName(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t.store.logo} (URL)</label>
                    <input
                      type="text"
                      value={storeLogo}
                      onChange={(e) => setStoreLogo(e.target.value)}
                      placeholder="https://..."
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t.store.banner} (URL)</label>
                  <input
                    type="text"
                    value={storeBanner}
                    onChange={(e) => setStoreBanner(e.target.value)}
                    placeholder="https://..."
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t.store.description}</label>
                  <textarea
                    value={storeDescription}
                    onChange={(e) => setStoreDescription(e.target.value)}
                    rows={4}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-400"
                  />
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold py-3 px-8 rounded-lg shadow-md hover:shadow-lg transition-all"
                  >
                    {t.store.save}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Account Activity Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">{t.settings.activityOverview}</h2>
            <h3 className="font-semibold text-gray-900 mb-3">{t.settings.myAccount}</h3>
            <div className="space-y-2 text-sm text-gray-700">
              <p>{t.settings.currentAdsOnline.replace('{count}', sellerListings.length)}</p>
              <p>{t.settings.adsPostedLast30Days.replace('{count}', '0')}</p>
            </div>
          </div>

          {/* Phone Number Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">{t.settings.changePhoneNumber}</h2>
            <h1 className="text-xl font-bold text-gray-900 mb-2">{seller.full_name || t.cart.unknownSeller}</h1>
            <p className="text-sm text-gray-500 mb-1">
              Aktiv seit {seller.created_at
                ? new Date(seller.created_at).toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' })
                : 'Bilinmiyor'}
            </p>
            <p className="text-sm text-gray-500">
              {sellerListings.length} {sellerListings.length === 1 ? 'İlan' : 'İlanlar'}
            </p>
            <p className="text-sm text-gray-700 mb-4">
              {t.settings.verifyPhone} <span className="font-semibold">{phoneNumber}</span>
            </p>
            <button
              onClick={() => setShowPhoneModal(true)}
              className="text-red-600 hover:text-red-700 font-medium text-sm"
            >
              Telefonnummer ändern
            </button>
          </div>

          {/* LUCID ID Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">{t.settings.lucidTitle}</h2>

            {hasLucidId === null ? (
              <div>
                <p className="text-sm text-gray-700 mb-4">
                  {t.lucid.notEntered}
                </p>
                <p className="text-sm text-gray-600 mb-4">
                  {t.lucid.description}
                  {t.lucid.notObligated}
                </p>
                <a
                  href="#"
                  className="text-sm text-red-600 hover:text-red-700 font-medium mb-4 inline-block"
                >
                  Weitere Informationen zum Verpackungsgesetz (VerpackG)
                </a>
                <div className="mt-4">
                  <button
                    onClick={() => setHasLucidId(true)}
                    className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium py-2 px-6 rounded-lg shadow-md hover:shadow-lg transition-all"
                  >
                    {t.common.next}
                  </button>
                </div>
              </div>
            ) : hasLucidId ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t.settings.lucidTitle}
                </label>
                <input
                  type="text"
                  placeholder="DE12345678901234"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-400 focus:border-transparent mb-4"
                />
                <button className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium py-2 px-6 rounded-lg shadow-md hover:shadow-lg transition-all">
                  {t.common.save}
                </button>
              </div>
            ) : (
              <p className="text-sm text-gray-700">
                {t.lucid.statedNotObligated}
              </p>
            )}
          </div>
        </div>

        {/* Phone Change Modal */}
        {showPhoneModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-900">{t.settings.changePhoneNumber}</h3>
                <button
                  onClick={() => setShowPhoneModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handlePhoneChange} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t.settings.newPhoneNumber}
                  </label>
                  <input
                    type="tel"
                    value={newPhoneNumber}
                    onChange={(e) => setNewPhoneNumber(e.target.value)}
                    placeholder="+49 123 456789"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-400 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t.settings.verificationCode}
                  </label>
                  <input
                    type="text"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    placeholder={t.settings.verificationCodePlaceholder}
                    maxLength={6}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-400 focus:border-transparent"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {t.settings.smsNotice}
                  </p>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowPhoneModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                  >
                    {t.common.cancel}
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all"
                  >
                    {t.common.save}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Password Change Modal */}
        {showPasswordModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-900">{t.settings.changePassword}</h3>
                <button
                  onClick={() => setShowPasswordModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t.settings.currentPassword}
                  </label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-400 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t.settings.newPassword}
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-400 focus:border-transparent"
                    required
                    minLength={8}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {t.settings.passwordMinLength}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t.settings.confirmNewPassword}
                  </label>
                  <input
                    type="password"
                    value={newPasswordConfirm}
                    onChange={(e) => setNewPasswordConfirm(e.target.value)}
                    placeholder="••••••••"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-400 focus:border-transparent"
                    required
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowPasswordModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                  >
                    {t.common.cancel}
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all"
                  >
                    {t.common.save}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Billing Address Modal */}
        {showBillingModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-900">{t.settings.changeBillingAddress}</h3>
                <button
                  onClick={() => setShowBillingModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleBillingChange} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t.addListing.firstName}
                    </label>
                    <input
                      type="text"
                      value={billingData.firstName}
                      onChange={(e) => setBillingData({ ...billingData, firstName: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-400 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t.addListing.lastName}
                    </label>
                    <input
                      type="text"
                      value={billingData.lastName}
                      onChange={(e) => setBillingData({ ...billingData, lastName: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-400 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t.addListing.streetHouse}
                    </label>
                    <input
                      type="text"
                      value={billingData.street}
                      onChange={(e) => setBillingData({ ...billingData, street: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-400 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nr.
                    </label>
                    <input
                      type="text"
                      value={billingData.houseNumber}
                      onChange={(e) => setBillingData({ ...billingData, houseNumber: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-400 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t.checkout.postalCode}
                    </label>
                    <input
                      type="text"
                      value={billingData.zip}
                      onChange={(e) => setBillingData({ ...billingData, zip: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-400 focus:border-transparent"
                      required
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t.addListing.city}
                    </label>
                    <input
                      type="text"
                      value={billingData.city}
                      onChange={(e) => setBillingData({ ...billingData, city: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-400 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t.addListing.country || 'Ülke'}
                  </label>
                  <select
                    value={billingData.country}
                    onChange={(e) => setBillingData({ ...billingData, country: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-400 focus:border-transparent"
                  >
                    <option value="Deutschland">Almanya</option>
                    <option value="Österreich">Avusturya</option>
                    <option value="Schweiz">İsviçre</option>
                  </select>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowBillingModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                  >
                    Abbrechen
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all"
                  >
                    Speichern
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export const Favorites = ({ favorites, toggleFavorite, isFavorite, followedSellers = [] }) => {
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'listings');
  const [favoriteListings, setFavoriteListings] = useState([]);
  const [loadingFavorites, setLoadingFavorites] = useState(true);
  const [followedSellerList, setFollowedSellerList] = useState([]);
  const [loadingFollowed, setLoadingFollowed] = useState(false);

  // Load favorite listings from Supabase
  useEffect(() => {
    const loadFavorites = async () => {
      try {
        setLoadingFavorites(true);
        // Fetch all listings from Supabase
        const { fetchListings } = await import('./api/listings');
        const allListings = await fetchListings({});
        // Filter to only favorites
        const favListings = allListings.filter(listing => favorites.includes(listing.id));
        setFavoriteListings(favListings);
      } catch (error) {
        console.error('Error loading favorites:', error);
        setFavoriteListings([]);
      } finally {
        setLoadingFavorites(false);
      }
    };
    if (favorites.length > 0) {
      loadFavorites();
    } else {
      setFavoriteListings([]);
      setLoadingFavorites(false);
    }
  }, [favorites]);

  // Load followed sellers from Supabase
  useEffect(() => {
    const loadFollowedSellers = async () => {
      try {
        setLoadingFollowed(true);
        const { getFollowing } = await import('./api/follows');
        const following = await getFollowing();
        setFollowedSellerList(following);
      } catch (error) {
        console.error('Error loading followed sellers:', error);
        setFollowedSellerList([]);
      } finally {
        setLoadingFollowed(false);
      }
    };

    if (activeTab === 'users') {
      loadFollowedSellers();
    }
  }, [activeTab]);

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Favoriten</h1>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            onClick={() => setActiveTab('listings')}
            className={`pb-4 px-4 font-medium text-sm transition-colors relative ${activeTab === 'listings'
              ? 'text-red-600 border-b-2 border-red-600'
              : 'text-gray-500 hover:text-gray-700'
              }`}
          >
            {t.nav.myListings} ({favoriteListings.length})
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`pb-4 px-4 font-medium text-sm transition-colors relative ${activeTab === 'users'
              ? 'text-red-600 border-b-2 border-red-600'
              : 'text-gray-500 hover:text-gray-700'
              }`}
          >
            {t.nav.following} ({followedSellerList.length})
          </button>
        </div>

        {activeTab === 'listings' ? (
          favoriteListings.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {favoriteListings.map(listing => (
                <ListingCard
                  key={listing.id}
                  listing={listing}
                  toggleFavorite={toggleFavorite}
                  isFavorite={isFavorite}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm">
              <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Henüz favori yok</h3>
              <p className="text-gray-500">{t.favorites.empty}</p>
            </div>
          )
        ) : (
          /* Users Tab Content */
          loadingFollowed ? (
            <div className="text-center py-12">
              <LoadingSpinner size="medium" className="mb-4" />
              <p className="text-gray-600">Takip edilen kullanıcılar yükleniyor...</p>
            </div>
          ) : followedSellerList.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {followedSellerList.map(seller => (
                <div key={seller.id} className="bg-white rounded-lg shadow-sm p-6 flex items-center gap-4">
                  <Link to={`/seller/${seller.user_number}`} className="flex-shrink-0">
                    <img
                      src={seller.store_logo || seller.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(seller.full_name || 'User')}&background=ef4444&color=fff&size=200`}
                      alt={seller.full_name}
                      className="w-16 h-16 rounded-full object-cover border-2 border-gray-100 hover:border-blue-500 transition-colors cursor-pointer"
                    />
                  </Link>
                  <div className="flex-1">
                    <Link to={`/seller/${seller.user_number}`} className="hover:text-blue-600 transition-colors">
                      <h3 className="font-semibold text-gray-900">{seller.full_name || 'Unbekannter Nutzer'}</h3>
                    </Link>
                    <div className="text-xs text-gray-400 mt-1">@{seller.user_number}</div>
                  </div>
                  <Link
                    to={`/seller/${seller.user_number}`}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm font-medium transition-colors"
                  >
                    Profil
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm">
              <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Keine gefolgten Nutzer</h3>
              <p className="text-gray-500">Du folgst noch keinen Nutzern.</p>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export const SearchSection = ({ searchTerm, setSearchTerm, selectedCategory, setSelectedCategory, location, setLocation, cartItems = [], cartCount = 0, showCart, setShowCart, removeFromCart, updateCartQuantity, followedSellers = [], favorites = [] }) => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [showDistanceDropdown, setShowDistanceDropdown] = useState(false);
  const [selectedDistance, setSelectedDistance] = useState('50 km');
  const [showMeinsDropdown, setShowMeinsDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [userProfile, setUserProfile] = useState(null);
  const isMobile = useIsMobile();
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [recentSearches, setRecentSearches] = useState([]);
  const [showRecentSearches, setShowRecentSearches] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [suggestions, setSuggestions] = useState({ categories: [], listings: [] });
  const [isSearchingSuggestions, setIsSearchingSuggestions] = useState(false);
  const searchInputRef = React.useRef(null);
  const recentSearchesDropdownRef = React.useRef(null);

  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      alert('Tarayıcınız konum özelliğini desteklemiyor.');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10&addressdetails=1`,
            {
              headers: {
                'User-Agent': 'Kleinbazaar/1.0'
              }
            }
          );
          const data = await response.json();
          // Try to get city, town, or village
          const city = data.address.city || data.address.town || data.address.village || data.address.province || data.address.state || 'Bilinmeyen Konum';
          setLocation(city);
          setShowLocationDropdown(false);
        } catch (error) {
          console.error('Error reverse geocoding:', error);
          alert('Konumunuz belirlenirken bir hata oluştu.');
        } finally {
          setIsLocating(false);
        }
      },
      (error) => {
        console.error('Geolocation error:', error);
        alert('Konum izni verilmedi veya erişilemedi.');
        setIsLocating(false);
      },
      { timeout: 10000 }
    );
  };

  // Load recent searches from localStorage
  useEffect(() => {
    const savedSearches = localStorage.getItem('recentSearches');
    console.log('Loading recent searches:', savedSearches);
    if (savedSearches) {
      try {
        setRecentSearches(JSON.parse(savedSearches));
      } catch (e) {
        console.error('Error parsing recent searches:', e);
      }
    }
  }, []);

  const saveRecentSearch = (term) => {
    console.log('Saving recent search:', term);
    if (!term || !term.trim()) return;

    const newTerm = term.trim();

    // Read current from local storage to ensure we have latest
    let currentList = [];
    const currentSaved = localStorage.getItem('recentSearches');
    if (currentSaved) {
      try {
        currentList = JSON.parse(currentSaved);
      } catch (e) { }
    }

    const updatedSearches = [newTerm, ...currentList.filter(s => s !== newTerm)].slice(0, 3);

    console.log('Updated searches:', updatedSearches);
    setRecentSearches(updatedSearches);
    localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
  };

  // Suggestion fetching logic
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchTerm.trim().length < 2) {
        setSuggestions({ categories: [], listings: [] });
        return;
      }

      setIsSearchingSuggestions(true);
      try {
        const data = await searchApi.getSuggestions(searchTerm);
        setSuggestions(data);
      } catch (error) {
        console.error('Error in SearchSection suggestions:', error);
      } finally {
        setIsSearchingSuggestions(false);
      }
    };

    const debounceTimer = setTimeout(() => {
      fetchSuggestions();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  // Fetch user profile for display name
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (user) {
        try {
          const { fetchUserProfile: getProfile } = await import('./api/profile');
          const profile = await getProfile(user.id);
          setUserProfile(profile);
        } catch (error) {
          console.error('Error fetching user profile:', error);
        }
      }
    };

    fetchUserProfile();
  }, [user]);

  // Fetch unread message count
  React.useEffect(() => {
    const fetchUnreadCount = async () => {
      if (user) {
        try {
          const { getUnreadCount } = await import('./api/messages');
          const count = await getUnreadCount();
          setUnreadCount(count);
        } catch (error) {
          console.error('Error fetching unread count:', error);
        }
      }
    };

    if (user) {
      fetchUnreadCount();
      // Refresh every 30 seconds
      const interval = setInterval(fetchUnreadCount, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const categoryDropdownRef = React.useRef(null);
  const locationDropdownRef = React.useRef(null);
  const distanceDropdownRef = React.useRef(null);
  const meinsDropdownRef = React.useRef(null);
  const cartDropdownRef = React.useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target)) {
        setShowCategoryDropdown(false);
      }
      if (locationDropdownRef.current && !locationDropdownRef.current.contains(event.target)) {
        setShowLocationDropdown(false);
      }
      if (distanceDropdownRef.current && !distanceDropdownRef.current.contains(event.target)) {
        setShowDistanceDropdown(false);
      }
      if (meinsDropdownRef.current && !meinsDropdownRef.current.contains(event.target)) {
        setShowMeinsDropdown(false);
      }
      if (cartDropdownRef.current && !cartDropdownRef.current.contains(event.target)) {
        setShowCart(false);
      }
      if (recentSearchesDropdownRef.current && !recentSearchesDropdownRef.current.contains(event.target) && !searchInputRef.current.contains(event.target)) {
        // console.log('Click outside recent searches');
        setShowRecentSearches(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [categoryDropdownRef, locationDropdownRef, distanceDropdownRef, meinsDropdownRef, cartDropdownRef, recentSearchesDropdownRef, setShowCart]);

  // Get user's location on component mount
  useEffect(() => {
    if (navigator.geolocation && location === 'Türkiye') {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          // Use Nominatim (OpenStreetMap) reverse geocoding to get postal code
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
              {
                headers: {
                  'User-Agent': 'Kleinbazaar'
                }
              }
            );
            const data = await response.json();

            if (data.address) {
              const city = data.address.city || data.address.town || data.address.village || data.address.province || data.address.state;
              if (city) {
                setLocation(city);
              } else {
                setLocation(t.nav.myLocation);
              }
            } else {
              setLocation(t.nav.myLocation);
            }
          } catch (error) {
            console.log('Error fetching city name:', error);
            setLocation(t.nav.myLocation);
          }
        },
        (error) => {
          console.log('Location access denied or unavailable');
        }
      );
    }
  }, []);

  const locationObj = useLocation();
  const isFavoritesListingsActive = locationObj.pathname === '/favorites' && (locationObj.search.includes('tab=listings') || !locationObj.search.includes('tab='));
  const isFavoritesUsersActive = locationObj.pathname === '/favorites' && locationObj.search.includes('tab=users');

  // Clear search term, category and reset distance when navigating to home page
  // Clear search term, category and reset distance when navigating to home page
  // Also sync search term from URL when on search page
  useEffect(() => {
    if (locationObj.pathname === '/') {
      setSearchTerm('');
      setSelectedCategory('Tüm Kategoriler');
      setSelectedDistance('50 km');
    } else if (locationObj.pathname === '/search') {
      const params = new URLSearchParams(locationObj.search);
      const q = params.get('q');
      if (q) setSearchTerm(q);

      const cat = params.get('category');
      if (cat) setSelectedCategory(cat);

      const loc = params.get('location');
      if (loc) setLocation(loc);
    }
  }, [locationObj.pathname, locationObj.search, setSearchTerm, setSelectedCategory, setSelectedDistance, setLocation]);

  return (
    <section className="bg-gradient-to-r from-red-500 to-rose-600 py-4 sm:py-8 relative overflow-visible z-40">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-30"></div>
      <div className="max-w-[1400px] mx-auto px-4 relative z-20">
        <div className="flex flex-col gap-2 sm:gap-3 lg:flex-row lg:items-stretch">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (searchTerm.trim()) {
                saveRecentSearch(searchTerm);
                setShowRecentSearches(false);
                const params = new URLSearchParams();
                params.append('q', searchTerm.trim());
                if (selectedCategory && selectedCategory !== 'Tüm Kategoriler') params.append('category', selectedCategory);
                if (location && location !== 'Türkiye') params.append('location', location);
                if (selectedDistance) params.append('distance', selectedDistance);

                navigate(`/search?${params.toString()}`);
              }
            }}
            className="flex-1 flex items-center gap-1 sm:gap-2 bg-white rounded-xl sm:rounded-2xl p-2 sm:p-3 shadow-xl hover:shadow-2xl transition-shadow duration-300"
          >
            {/* Search Icon - Submit Button */}
            {!isMobile && (
              <button
                type="submit"
                className="p-1 sm:p-2 cursor-pointer hover:bg-gray-50 rounded-full transition-colors focus:outline-none"
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            )}

            {/* Search Input Container */}
            <div className="flex-1 relative">
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Ne arıyorsunuz?"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  if (!showRecentSearches) setShowRecentSearches(true);
                }}
                onFocus={() => {
                  console.log('Input focused, showing recent searches');
                  setShowRecentSearches(true);
                }}
                onClick={() => {
                  console.log('Input clicked, showing recent searches');
                  setShowRecentSearches(true);
                }}
                onKeyPress={(e) => {
                  // Enter is handled by form submit
                }}
                className="w-full px-1 sm:px-2 py-2 border-none outline-none text-gray-700 placeholder-gray-400 text-sm sm:text-base"
              />

              {/* Recent Searches & Suggestions Dropdown */}
              {showRecentSearches && (searchTerm.trim().length < 2 ? recentSearches.length > 0 : (suggestions.categories.length > 0 || suggestions.listings.length > 0)) && (
                <div
                  ref={recentSearchesDropdownRef}
                  className="absolute top-full left-0 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-[100] overflow-hidden"
                >
                  {/* Recent Searches - Only when search term is short */}
                  {searchTerm.trim().length < 2 && recentSearches.length > 0 && (
                    <>
                      <div className="px-3 py-2 text-xs font-semibold text-gray-500 bg-gray-50 border-b border-gray-100 uppercase tracking-wider">
                        Son aramalar
                      </div>
                      {recentSearches.map((term, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            setSearchTerm(term);
                            setShowRecentSearches(false);
                          }}
                          className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors"
                        >
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {term}
                        </button>
                      ))}
                    </>
                  )}

                  {/* Category Suggestions */}
                  {searchTerm.trim().length >= 2 && suggestions.categories.length > 0 && (
                    <>
                      <div className="px-3 py-2 text-xs font-semibold text-gray-500 bg-gray-50 border-b border-gray-100 uppercase tracking-wider">
                        Kategoriler
                      </div>
                      {suggestions.categories.map((cat, index) => (
                        <button
                          key={`cat-${index}`}
                          onClick={() => {
                            setSelectedCategory(cat);
                            setShowRecentSearches(false);
                            navigate(`/search?category=${encodeURIComponent(cat)}`);
                          }}
                          className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-red-50 hover:text-red-700 flex items-center gap-2 transition-colors"
                        >
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                          </svg>
                          <span className="font-medium">{cat}</span>
                          <span className="text-xs text-gray-400 ml-auto">Kategoride Ara</span>
                        </button>
                      ))}
                    </>
                  )}

                  {/* Listing Suggestions */}
                  {searchTerm.trim().length >= 2 && suggestions.listings.length > 0 && (
                    <>
                      <div className="px-3 py-2 text-xs font-semibold text-gray-500 bg-gray-50 border-b border-gray-100 border-t uppercase tracking-wider">
                        İlanlar
                      </div>
                      {suggestions.listings.map((listing) => (
                        <button
                          key={listing.id}
                          onClick={() => {
                            setShowRecentSearches(false);
                            navigate(`/product/${listing.id}`);
                          }}
                          className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors"
                        >
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
                          <div className="flex flex-col">
                            <span className="truncate max-w-[400px]">{listing.title}</span>
                            <span className="text-[10px] text-gray-400 uppercase">{listing.category}</span>
                          </div>
                        </button>
                      ))}
                    </>
                  )}

                  {isSearchingSuggestions && (
                    <div className="px-3 py-2 text-center">
                      <LoadingSpinner size="small" />
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Category Dropdown - Hidden on mobile, shown on tablet+ */}
            <div className="relative hidden md:block" ref={categoryDropdownRef}>
              <button
                type="button"
                onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                className="px-2 sm:px-3 py-2 border-l border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-1 focus:outline-none text-sm"
              >
                <span className="hidden lg:inline">{selectedCategory}</span>
                <span className="lg:hidden">Kategori</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {showCategoryDropdown && (
                <div className="absolute top-full right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 flex min-w-[600px] max-h-[500px] overflow-hidden">
                  {/* Main Categories */}
                  <div className="w-1/2 py-2 border-r border-gray-100 overflow-y-auto">
                    {categories.map((category) => (
                      <div
                        key={category.name}
                        onMouseEnter={() => setHoveredCategory(category)}
                        onClick={() => {
                          setSelectedCategory(category.name);
                          setShowCategoryDropdown(false);
                        }}
                        className={`w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors text-gray-700 cursor-pointer flex justify-between items-center ${hoveredCategory?.name === category.name ? 'bg-gray-50 text-red-500' : ''}`}
                      >
                        <span>{category.name}</span>
                        {category.subcategories && (
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Subcategories */}
                  {hoveredCategory && hoveredCategory.subcategories && (
                    <div className="w-1/2 py-2 bg-gray-50 rounded-r-lg overflow-y-auto">
                      <div className="px-4 py-2 font-semibold text-gray-900 border-b border-gray-200 mb-1">
                        {hoveredCategory.name}
                      </div>
                      {hoveredCategory.subcategories.map((sub) => (
                        <button
                          key={sub.name}
                          onClick={() => {
                            setSelectedCategory(sub.name);
                            setShowCategoryDropdown(false);
                          }}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-md focus:outline-none"
                        >
                          {sub.name}
                          {sub.count > 0 && <span className="text-xs text-gray-400 ml-1">({sub.count})</span>}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Location Input */}
            <div className="relative hidden sm:flex items-center border-l border-gray-200 group" ref={locationDropdownRef}>
              <div className="pl-3 text-gray-400 group-focus-within:text-red-500 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Şehir veya konum"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                onFocus={() => setShowLocationDropdown(true)}
                className="w-32 md:w-40 px-2 py-2 text-sm text-gray-700 focus:outline-none placeholder-gray-400 bg-transparent"
              />
              <button
                type="button"
                onClick={handleDetectLocation}
                disabled={isLocating}
                className={`p-1 mr-1 rounded-md transition-all ${isLocating ? 'animate-pulse text-red-500' : 'text-gray-400 hover:text-red-500 hover:bg-gray-100'}`}
                title="Konumumu Bul"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="8" />
                  <circle cx="12" cy="12" r="2.5" fill="currentColor" stroke="none" />
                  <line x1="12" y1="2" x2="12" y2="5" />
                  <line x1="12" y1="19" x2="12" y2="22" />
                  <line x1="2" y1="12" x2="5" y2="12" />
                  <line x1="19" y1="12" x2="22" y2="12" />
                </svg>
              </button>

              {showLocationDropdown && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[180px]">
                  <div className="px-3 py-2 text-[10px] font-bold text-gray-400 border-b border-gray-50 uppercase tracking-wider">
                    Popüler Şehirler
                  </div>
                  {['Türkiye', 'İstanbul', 'Ankara', 'İzmir', 'Bursa', 'Antalya'].map((loc) => (
                    <button
                      key={loc}
                      onClick={() => {
                        setLocation(loc);
                        setShowLocationDropdown(false);
                      }}
                      className="w-full px-4 py-2 text-left hover:bg-red-50 hover:text-red-700 transition-colors text-gray-700 focus:outline-none text-sm"
                    >
                      {loc}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Distance Filter */}
            <div className="relative" ref={distanceDropdownRef}>
              <button
                type="button"
                onClick={() => setShowDistanceDropdown(!showDistanceDropdown)}
                className="px-3 py-2 border-l border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-1 focus:outline-none"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
                {selectedDistance}
              </button>
              {showDistanceDropdown && (
                <div className="absolute top-full right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[180px]">
                  {['20 km', '50 km', '100 km', '200 km', '500 km', 'Tüm Türkiye'].map((distance) => (
                    <button
                      key={distance}
                      onClick={() => {
                        setSelectedDistance(distance);
                        setShowDistanceDropdown(false);
                      }}
                      className="w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors text-gray-700 focus:outline-none"
                    >
                      {distance}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Search Button */}
            <button
              onClick={() => {
                const params = new URLSearchParams();
                if (searchTerm) params.append('q', searchTerm);
                if (selectedCategory && selectedCategory !== 'Tüm Kategoriler') params.append('category', selectedCategory);
                if (location && location !== 'Türkiye') params.append('location', location);
                if (selectedDistance) params.append('distance', selectedDistance);
                if (selectedDistance) params.append('distance', selectedDistance);

                console.log('Submitting form with data:', Object.fromEntries(params));
                // Navigate to search results
                navigate(`/search?${params.toString()}`);
              }}
              className="px-6 py-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 font-medium focus:outline-none"
            >
              Ara
            </button>
          </form>

          {/* Anzeige aufgeben Button */}
          <button
            onClick={() => navigate('/add-listing')}
            className="flex flex-col items-center justify-center text-white transition-all duration-300 font-semibold px-4 py-2 rounded-xl hover:bg-white/10 transform hover:-translate-y-0.5 group"
          >
            <svg className="w-8 h-8 mb-0.5 transform group-hover:scale-110 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <circle cx="12" cy="12" r="10" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v8m-4-4h8" />
            </svg>
            <span className="text-sm">İlan Ver</span>
          </button>

          {/* Meins Dropdown */}
          <div className="relative z-[10000]" ref={meinsDropdownRef}>
            <button
              onClick={() => setShowMeinsDropdown(!showMeinsDropdown)}
              className="flex flex-col items-center justify-center text-white hover:text-red-50 transition-all duration-300 font-medium px-3 py-2 relative rounded-xl hover:bg-white/10 transform hover:-translate-y-0.5 group"
            >
              <svg className="w-8 h-8 mb-0.5 transform group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <circle cx="12" cy="12" r="10" />
                <circle cx="12" cy="9" r="3" />
                <path d="M6.168 18.849A4 4 0 0 1 10 16h4a4 4 0 0 1 3.834 2.855" strokeLinecap="round" />
              </svg>
              <span className="text-sm">Hesabım</span>
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {showMeinsDropdown && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 py-2">
                <div className="border-b border-gray-100 pb-2">
                  <div className="px-4 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wider">HESABIM</div>

                  <button onClick={() => { navigate('/profile'); setShowMeinsDropdown(false); }} className="block w-full text-left px-4 py-2.5 text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors flex items-center gap-3">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    {t.nav.myProfile}
                  </button>
                  <button onClick={() => { navigate('/messages'); setShowMeinsDropdown(false); }} className="block w-full text-left px-4 py-2.5 text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors flex items-center gap-3">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <span className="flex-1">{t.nav.messages}</span>
                    {unreadCount > 0 && (
                      <span className="bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                        {unreadCount}
                      </span>
                    )}
                  </button>
                  <button onClick={() => { navigate('/my-listings'); setShowMeinsDropdown(false); }} className="block w-full text-left px-4 py-2.5 text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors flex items-center gap-3">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    {t.nav.myListings}
                  </button>
                  <button onClick={() => { navigate('/settings'); setShowMeinsDropdown(false); }} className="block w-full text-left px-4 py-2.5 text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors flex items-center gap-3">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {t.nav.settings}
                  </button>

                  {/* Unternehmensseite PRO */}
                  <button
                    onClick={() => { navigate('/packages'); setShowMeinsDropdown(false); }}
                    className="block w-full text-left px-3 py-2.5 mx-2 my-2 rounded-lg bg-gradient-premium text-white font-semibold transition-all hover:shadow-premium-lg transform hover:-translate-y-0.5 flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    {t.nav.proPage}
                  </button>
                </div>
                <div className="border-t border-gray-100 py-2">
                  <div className="px-4 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wider">{t.nav.favorites.toUpperCase()}</div>

                  <button
                    onClick={() => { navigate('/favorites'); setShowMeinsDropdown(false); }}
                    className={`block w-full text-left px-4 py-2.5 flex justify-between items-center transition-colors ${isFavoritesListingsActive
                      ? 'bg-primary-50 text-primary-600 font-medium'
                      : 'text-gray-700 hover:bg-primary-50 hover:text-primary-600'
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      {t.nav.favorites}
                    </div>
                    {favorites.length > 0 && (
                      <span className="badge-premium">
                        {favorites.length}
                      </span>
                    )}
                  </button>

                  <button
                    onClick={() => { navigate('/following'); setShowMeinsDropdown(false); }}
                    className={`block w-full text-left px-4 py-2.5 flex justify-between items-center transition-colors ${isFavoritesUsersActive
                      ? 'bg-primary-50 text-primary-600 font-medium'
                      : 'text-gray-700 hover:bg-primary-50 hover:text-primary-600'
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                      {t.nav.following}
                    </div>
                    {followedSellers.length > 0 && (
                      <span className="badge-premium">
                        {followedSellers.length}
                      </span>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </section >
  );
};

// Normalize subcategory names from database to display names
export const normalizeSubcategoryName = (subcategoryName) => {
  const normalizationMap = {
    'Spor Etkinlikleri': 'Spor',
    'Çocuk Etkinlikleri': 'Çocuk',
    // Add more mappings as needed
  };

  return normalizationMap[subcategoryName] || subcategoryName;
};

// Category Sidebar Component
export const getCategoryPath = (categoryName, subcategoryName = null) => {
  const mainMappings = {
    'Tüm Kategoriler': 'Butun-Kategoriler',
    'Otomobil, Bisiklet & Tekne': 'Otomobil-Bisiklet-Tekne',
    'Otomobil, Bisiklet & Tekne Servisi': 'Otomobil-Bisiklet-Tekne',
    'Emlak': 'Emlak',
    'Ev & Bahçe': 'Ev-Bahce',
    'Moda & Güzellik': 'Moda-Guzellik',
    'Elektronik': 'Elektronik',
    'Evcil Hayvanlar': 'Evcil-Hayvanlar',
    'Aile, Çocuk & Bebek': 'Aile-Cocuk-Bebek',
    'İş İlanları': 'Is-Ilanlari',
    'Eğlence, Hobi & Mahalle': 'Eglence-Hobi-Mahalle',
    'Müzik, Film & Kitap': 'Muzik-Film-Kitap',
    'Biletler': 'Biletler',
    'Hizmetler': 'Hizmetler',
    'Ücretsiz & Takas': 'Ucretsiz-Takas',
    'Eğitim & Kurslar': 'Egitim-Kurslar',
    'Dersler & Kurslar': 'Egitim-Kurslar',
    'Komşu Yardımı': 'Komsu-Yardimi'
  };

  const subMappings = {
    // Auto, Rad & Boot
    'Otomobiller': 'Otomobiller',
    'Bisiklet & Aksesuarlar': 'Bisiklet-Aksesuarlar',
    'Bisiklet & Aksesuarları': 'Bisiklet-Aksesuarlar',
    'Oto Parça & Lastik': 'Oto-Parca-Lastik',
    'Tekne & Tekne Malzemeleri': 'Tekne-Tekne-Malzemeleri',
    'Motosiklet & Scooter': 'Motosiklet-Scooter',
    'Motosiklet Parça & Aksesuarlar': 'Motosiklet-Parca-Aksesuarlar',
    'Ticari Araçlar & Römorklar': 'Ticari-Araclar-Romorklar',
    'Tamir & Servis': 'Tamir-Servis',
    'Karavan & Motokaravan': 'Karavan-Motokaravan',
    'Diğer Otomobil, Bisiklet & Tekne': 'Diger-Otomobil-Bisiklet-Tekne',

    // Immobilien
    'Geçici Konaklama & Paylaşımlı Ev': 'Gecici-Konaklama-Paylasimli-Ev',
    'Geçici Konaklama & Paylaşımlı Oda': 'Gecici-Konaklama-Paylasimli-Ev',
    'Konteyner': 'Konteyner',
    'Satılık Daireler': 'Satilik-Daireler',
    'Satılık Daire': 'Satilik-Daireler',
    'Satılık Yazlık': 'Satilik-Yazlik',
    'Tatil Evi & Yurt Dışı Emlak': 'Tatil-Evi-Yurt-Disi-Emlak',
    'Tatil ve Yurt Dışı Emlak': 'Tatil-Evi-Yurt-Disi-Emlak',
    'Garaj & Otopark': 'Garaj-Otopark',
    'Garaj & Park Yeri': 'Garaj-Otopark',
    'Ticari Emlak': 'Ticari-Emlak',
    'Arsa & Bahçe': 'Arsa-Bahce',
    'Satılık Evler': 'Satilik-Evler',
    'Satılık Müstakil Ev': 'Satilik-Evler',
    'Kiralık Evler': 'Kiralik-Evler',
    'Kiralık Müstakil Ev': 'Kiralik-Evler',
    'Kiralık Daireler': 'Kiralik-Daireler',
    'Kiralık Daire': 'Kiralik-Daireler',
    'Yeni Projeler': 'Yeni-Projeler',
    'Taşımacılık & Nakliye': 'Tasimacilik-Nakliye',
    'Diğer Emlak': 'Diger-Emlak',

    // Haus & Garten
    'Banyo': 'Banyo',
    'Ofis': 'Ofis',
    'Dekorasyon': 'Dekorasyon',
    'Ev Hizmetleri': 'Ev-Hizmetleri',
    'Bahçe Malzemeleri & Bitkiler': 'Bahce-Malzemeleri-Bitkiler',
    'Ev Tekstili': 'Ev-Tekstili',
    'Ev Tadilatı': 'Ev-Tadilati',
    'Yapı Market & Tadilat': 'Ev-Tadilati',
    'Mutfak & Yemek Odası': 'Mutfak-Yemek-Odasi',
    'Lamba & Aydınlatma': 'Lamba-Aydinlatma',
    'Aydınlatma': 'Lamba-Aydinlatma', // Alias for breadcrumb fix
    'Yatak Odası': 'Yatak-Odasi',
    'Oturma Odası': 'Oturma-Odasi',
    'Diğer Ev & Bahçe': 'Diger-Ev-Bahce',

    // Moda & Güzellik
    'Güzellik & Sağlık': 'Guzellik-Saglik',
    'Kadın Giyimi': 'Kadin-Giyimi',
    'Kadın Ayakkabıları': 'Kadin-Ayakkabilari',
    'Erkek Giyimi': 'Erkek-Giyimi',
    'Erkek Ayakkabıları': 'Erkek-Ayakkabilari',
    'Çanta & Aksesuarlar': 'Canta-Aksesuarlar',
    'Saat & Takı': 'Saat-Taki',
    'Diğer Moda & Güzellik': 'Diger-Moda-Guzellik',

    // Elektronik
    'Ses & Hifi': 'Ses-Hifi',
    'Elektronik Servisler': 'Elektronik-Hizmetler',
    'Elektronik Hizmetler': 'Elektronik-Hizmetler',
    'Fotoğraf & Kamera': 'Fotograf-Kamera',
    'Cep Telefonu & Aksesuar': 'Cep-Telefonu-Telefon',
    'Cep Telefonu & Telefon': 'Cep-Telefonu-Telefon',
    'Beyaz Eşya & Ev Aletleri': 'Ev-Aletleri',
    'Ev Aletleri': 'Ev-Aletleri',
    'Oyun Konsolları': 'Konsollar',
    'Konsollar': 'Konsollar',
    'Dizüstü Bilgisayar': 'Dizustu-Bilgisayarlar',
    'Dizüstü Bilgisayarlar': 'Dizustu-Bilgisayarlar',
    'Masaüstü Bilgisayar': 'Bilgisayarlar',
    'Bilgisayarlar': 'Bilgisayarlar',
    'Bilgisayar Aksesuar & Yazılım': 'Bilgisayar-Aksesuarlari-Yazilim',
    'Bilgisayar Aksesuarları & Yazılım': 'Bilgisayar-Aksesuarlari-Yazilim',
    'Tablet & E-Okuyucu': 'Tabletler-E-Okuyucular',
    'Tabletler & E-Okuyucular': 'Tabletler-E-Okuyucular',
    'TV & Video': 'TV-Video',
    'Video Oyunları': 'Video-Oyunlari',
    'Diğer Elektronik': 'Diger-Elektronik',

    // Evcil Hayvanlar
    'Balıklar': 'Baliklar',
    'Köpekler': 'Kopekler',
    'Kediler': 'Kedi',
    'Küçük Hayvanlar': 'Kucuk-Hayvanlar',
    'Çiftlik Hayvanları': 'Ciftlik-Hayvanlari',
    'Atlar': 'Atlar',
    'Hayvan Bakımı & Eğitimi': 'Hayvan-Bakimi-Egitimi',
    'Hayvan Bakımı & Eğitim': 'Hayvan-Bakimi-Egitimi',
    'Kayıp Hayvanlar': 'Kayip-Hayvanlar',
    'Kuşlar': 'Kuslar',
    'Aksesuarlar': 'Aksesuarlar',

    // Aile, Çocuk & Bebek
    'Yaşlı Bakımı': 'Yasli-Bakimi',
    'Bebek & Çocuk Giyimi': 'Bebek-Cocuk-Giyimi',
    'Bebek & Çocuk Ayakkabıları': 'Bebek-Cocuk-Ayakkabilari',
    'Bebek Ekipmanları': 'Bebek-Ekipmanlari',
    'Oto Koltukları': 'Oto-Koltuklari',
    'Bebek Koltuğu & Oto Koltukları': 'Oto-Koltuklari',
    'Babysitter & Çocuk Bakımı': 'Babysitter-Cocuk-Bakimi',
    'Bebek Arabaları & Pusetler': 'Bebek-Arabalari-Pusetler',
    'Çocuk Odası Mobilyaları': 'Cocuk-Odasi-Mobilyalari',
    'Bebek Odası Mobilyaları': 'Cocuk-Odasi-Mobilyalari',
    'Oyuncaklar': 'Oyuncaklar',
    'Oyuncak': 'Oyuncaklar',
    'Diğer Aile, Çocuk & Bebek': 'Diger-Aile-Cocuk-Bebek',

    // İş İlanları
    'Mesleki Eğitim': 'Mesleki-Egitim',
    'Eğitim / Meslek Eğitimi': 'Mesleki-Egitim',  // Variant name
    'İnşaat, Zanaat & Üretim': 'Insaat-Sanat-Uretim',
    'İnşaat, El Sanatları & Üretim': 'Insaat-Sanat-Uretim', // Fix for broken link
    'Büro İşleri & Yönetim': 'Buroarbeit-Yonetim',
    'Büroarbeit & Yönetim': 'Buroarbeit-Yonetim',
    'Ofis İşleri & Yönetim': 'Buroarbeit-Yonetim',
    'Gastronomi & Turizm': 'Gastronomi-Turizm',
    'Müşteri Hizmetleri & Çağrı Merkezi': 'Musteri-Hizmetleri-Cagri-Merkezi',
    'Yarı Zamanlı & Ek İşler': 'Ek-Isler',
    'Mini & Ek İşler': 'Ek-Isler',
    'Ek İşler': 'Ek-Isler',
    'Staj': 'Staj',
    'Sosyal Sektör & Bakım': 'Sosyal-Sektor-Bakim',
    'Nakliye, Lojistik & Trafik': 'Tasimacilik-Lojistik',
    'Taşımacılık & Lojistik': 'Tasimacilik-Lojistik',
    'Satış, Satın Alma & Pazarlama': 'Satis-Pazarlama',
    'Satış & Pazarlama': 'Satis-Pazarlama',
    'Diğer İş İlanları': 'Diger-Is-Ilanlari',

    // Eğlence, Hobi & Mahalle
    'Ezoterizm & Spiritüalizm': 'Ezoterizm-Spiritualizm',
    'Yiyecek & İçecek': 'Yiyecek-Icecek',
    'Boş Zaman Aktiviteleri': 'Bos-Zaman-Aktiviteleri',
    'El Sanatları & Hobi': 'El-Sanatlari-Hobi',
    'Sanat & Antikalar': 'Sanat-Antikalar',
    'Sanatçılar & Müzisyenler': 'Sanatcilar-Muzisyenler',
    'Model Yapımı': 'Model-Yapimi',
    'Seyahat & Etkinlik Hizmetleri': 'Seyahat-Etkinlik-Hizmetleri',
    'Koleksiyon': 'Koleksiyon',
    'Spor & Kamp': 'Spor-Kamp',
    'Bit Pazarı': 'Bit-Pazari',
    'Kayıp & Buluntu': 'Kayip-Buluntu',
    'Diğer Eğlence, Hobi & Mahalle': 'Diger-Eglence-Hobi-Mahalle',

    // Müzik, Film & Kitap
    'Kitap & Dergi': 'Kitap-Dergi',
    'Kırtasiye': 'Kirtasiye',
    'Çizgi Romanlar': 'Cizgi-Romanlar',
    'Ders Kitapları, Okul & Eğitim': 'Ders-Kitaplari-Okul-Egitim',
    'Film & DVD': 'Film-DVD',
    'Müzik & CD\'ler': 'Muzik-CDler',
    'Müzik Enstrümanları': 'Muzik-Enstrumanlari',
    'Diğer Müzik, Film & Kitap': 'Diger-Muzik-Film-Kitap',

    // Biletler
    'Tren & Toplu Taşıma': 'Tren-Toplu-Tasima',
    'Komedi & Kabare': 'Komedi-Kabare',
    'Hediye Kartları': 'Hediye-Kartlari',
    'Hediye Çekleri': 'Hediye-Kartlari',
    'Çocuk': 'Cocuk',
    'Çocuk Etkinlikleri': 'Cocuk',  // DB variant
    'Konserler': 'Konserler',
    'Spor': 'Spor',
    'Spor Etkinlikleri': 'Spor',  // DB variant
    'Tiyatro & Müzikal': 'Tiyatro-Muzikal',
    'Diğer Biletler': 'Diger-Biletler',

    // Hizmetler
    'Otomobil, Bisiklet & Tekne Servisi': 'Otomobil-Bisiklet-Tekne-Servisi',
    'Oto, Bisiklet & Tekne Servisi': 'Otomobil-Bisiklet-Tekne-Servisi',  // Legacy name
    'Otomobil, Bisiklet & Tekne': 'Otomobil-Bisiklet-Tekne-Servisi',  // Short form
    'Yaşlı Bakımı': 'Yasli-Bakimi',
    'Bebek Bakıcısı & Kreş': 'Babysitter-Cocuk-Bakimi',
    'Babysitter & Çocuk Bakımı': 'Babysitter-Cocuk-Bakimi',
    'Babysitter/-in & Kinderbetreuung': 'Babysitter-Cocuk-Bakimi',  // German
    'Elektronik': 'Elektronik',
    'Elektronik Servisler': 'Elektronik-Hizmetler',  // Legacy/variant name
    'Ev & Bahçe': 'Ev-Bahce',
    'Ev & Bahçe Hizmetleri': 'Ev-Hizmetleri',  // Services subcategory under Ev & Bahçe
    'Ev Hizmetleri': 'Ev-Hizmetleri',  // Another variant
    'Sanatçılar & Müzisyenler': 'Sanatcilar-Muzisyenler',
    'Sanatçı & Müzisyen': 'Sanatcilar-Muzisyenler',  // Singular form
    'Seyahat & Etkinlik': 'Seyahat-Etkinlik',
    'Hayvan Bakımı & Eğitimi': 'Hayvan-Bakimi-Egitimi',
    'Evcil Hayvan Bakımı & Eğitim': 'Hayvan-Bakimi-Egitimi',
    'Taşımacılık & Nakliye': 'Tasimacilik-Nakliye',
    'Nakliye & Taşıma': 'Tasimacilik-Nakliye',
    'Diğer Hizmetler': 'Diger-Hizmetler',

    // Ücretsiz & Takas
    'Takas': 'Takas',
    'Ödünç Verme': 'Kiralama',
    'Kiralama': 'Kiralama',
    'Ücretsiz': 'Ucretsiz',
    'Ücretsiz Verilecekler': 'Ucretsiz',  // Legacy name compatibility

    // Eğitim & Kurslar
    'Bilgisayar Kursları': 'Bilgisayar-Kurslari',
    'Ezoterizm & Spiritüalizm': 'Ezoterizm-Spiritualizm',
    'Yemek & Pastacılık': 'Yemek-Pastacilik-Kurslari',
    'Yemek & Pastacılık Kursları': 'Yemek-Pastacilik-Kurslari',
    'Sanat & Tasarım': 'Sanat-Tasarim-Kurslari',
    'Sanat & Tasarım Kursları': 'Sanat-Tasarim-Kurslari',
    'Müzik & Şan': 'Muzik-San-Dersleri',
    'Müzik & Şan Dersleri': 'Muzik-San-Dersleri',
    'Özel Ders': 'Ozel-Ders',
    'Spor Kursları': 'Spor-Kurslari',
    'Dil Kursları': 'Dil-Kurslari',
    'Dans Kursları': 'Dans-Kurslari',
    'Sürekli Eğitim': 'Surekli-Egitim',
    'Diğer Dersler & Kurslar': 'Diger-Dersler-Kurslar',
    'Diğer Eğitim & Kurslar': 'Diger-Dersler-Kurslar',

    // Komşu Yardımı
    'Komşu Yardımı': 'Komsu-Yardimi',
    'Komşu Yardımı': 'Komsu-Yardimi'
  };

  const catSlug = mainMappings[categoryName] || categoryName;
  if (!subcategoryName) return `/${catSlug}`;

  const subSlug = subMappings[subcategoryName] || subcategoryName.replace(/\s+/g, '-');
  return `/${catSlug}/${subSlug}`;
};

// CategorySidebar Component
export const CategorySidebar = ({ selectedCategory, setSelectedCategory }) => {
  const [expandedCategories, setExpandedCategories] = useState([]);
  const [categoriesWithCounts, setCategoriesWithCounts] = useState(categories);
  const navigate = useNavigate();

  // Fetch real category counts from Supabase
  useEffect(() => {
    const fetchCategoryCounts = async () => {
      try {
        const { fetchCategoryCounts: fetchCounts } = await import('./api/listings');
        const allListings = await fetchCounts();

        // Count listings by category and subcategory
        const counts = {};

        allListings.forEach(listing => {
          let cat = listing.category;
          const subCat = listing.sub_category;

          // Normalize category name
          if (cat === 'Musik, Film & Bücher' || cat === 'Musik, Filme & Bücher') {
            cat = 'Müzik, Film & Kitap';
          }
          if (cat === 'Immobilien') {
            cat = 'Emlak';
          }

          // Count main category
          counts[cat] = (counts[cat] || 0) + 1;

          // Count subcategory
          if (subCat) {
            const key = `${cat}:${subCat}`;
            counts[key] = (counts[key] || 0) + 1;
          }
        });

        // Update categories with real counts
        const updatedCategories = categories.map(category => {
          if (category.name === 'Tüm Kategoriler') {
            return { ...category, count: allListings.length };
          }

          const mainCount = counts[category.name] || 0;
          const updatedSubcategories = category.subcategories?.map(sub => ({
            ...sub,
            count: counts[`${category.name}:${sub.name}`] || 0
          }));

          return {
            ...category,
            count: mainCount,
            subcategories: updatedSubcategories || category.subcategories
          };
        });

        setCategoriesWithCounts(updatedCategories);
        console.log('Updated category counts from Supabase:', counts);

        // Debug: Show Aile, Çocuk & Bebek subcategory keys
        const familyKeys = Object.keys(counts).filter(k => k.startsWith('Aile, Çocuk & Bebek:'));
        console.log('Family subcategory keys:', familyKeys);
        console.log('Looking for: Aile, Çocuk & Bebek:Bebek Koltuğu & Oto Koltukları');
        console.log('Looking for: Aile, Çocuk & Bebek:Bebek Odası Mobilyaları');
      } catch (error) {
        console.error('Error fetching category counts:', error);
      }
    };

    fetchCategoryCounts();
  }, []);


  const toggleCategory = (categoryName) => {
    setExpandedCategories(prev =>
      prev.includes(categoryName)
        ? prev.filter(c => c !== categoryName)
        : [...prev, categoryName]
    );
  };

  return (
    <aside className="w-96 flex-shrink-0 bg-white rounded-2xl shadow-lg p-6 h-fit border border-gray-100">
      <h3 className="font-bold text-gray-900 mb-5 text-lg">Kategoriler</h3>

      <div className="space-y-1.5">
        {categoriesWithCounts.map((category) => (
          <div key={category.name}>
            <button
              onClick={() => {
                if (category.subcategories) {
                  toggleCategory(category.name);
                } else {
                  const url = getCategoryPath(category.name);
                  navigate(url);
                  setSelectedCategory(category.name);
                }
              }}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 text-left ${selectedCategory === category.name
                ? 'bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-md'
                : 'hover:bg-gray-50 text-gray-700 hover:shadow-sm'
                }`}
            >
              <span className="font-semibold text-sm flex-grow">{category.name}</span>
              <div className="flex items-center gap-2">
                {category.count > 0 && (
                  <span className={`text-xs px-2 py-0.5 rounded-full ${selectedCategory === category.name ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'}`}>
                    {category.count.toLocaleString('tr-TR')}
                  </span>
                )}
                {category.subcategories && (
                  <div className={`p-1 rounded-lg transition-colors ${selectedCategory === category.name ? 'hover:bg-white/10' : 'hover:bg-gray-200'}`}>
                    <svg
                      className={`w-4 h-4 transition-transform duration-200 ${expandedCategories.includes(category.name) ? 'rotate-180' : ''} ${selectedCategory === category.name ? 'text-white' : 'text-gray-400'}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                )}
              </div>
            </button>

            {/* Subcategories */}
            {category.subcategories && expandedCategories.includes(category.name) && (
              <div className="ml-4 mt-1 space-y-1 border-l-2 border-gray-100 pl-2">
                {/* Main Category Link inside subcategories */}
                <button
                  onClick={() => {
                    navigate(getCategoryPath(category.name));
                    setSelectedCategory(category.name);
                  }}
                  className="w-full flex items-center px-4 py-2 rounded-lg text-left text-xs font-black text-red-600 hover:bg-red-50 transition-all border border-transparent hover:border-red-100"
                >
                  <svg className="w-3.5 h-3.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                  Tüm {category.name}
                </button>
                {category.subcategories.map((sub) => (
                  <button
                    key={sub.name}
                    onClick={() => {
                      const path = getCategoryPath(category.name, sub.name);
                      if (path) {
                        navigate(path);
                        setSelectedCategory(sub.name);
                      } else {
                        setSelectedCategory(sub.name);
                      }
                    }}
                    className={`w-full flex items-center justify-between px-3 py-1.5 rounded-md transition-colors text-left text-sm ${selectedCategory === sub.name
                      ? 'bg-red-50 text-red-600 font-medium'
                      : 'text-gray-600 hover:bg-gray-50'
                      }`}
                  >
                    <span>{sub.name}</span>
                    <span className="text-xs text-gray-400">({(sub.count || 0).toLocaleString('tr-TR')})</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </aside>
  );
};

// Listing Card Component
export const ListingCard = ({ listing, toggleFavorite, isFavorite, isOwnListing = false, hidePrice = false }) => {
  // Debug log for pricing
  if (listing.price_type === 'negotiable' || listing.title.includes('VB_TEST')) {
    console.log(`[ListingCard] ${listing.title}: Price=${listing.price} (${typeof listing.price}), Type=${listing.price_type}`);
  }

  // const { isReserved, isSold, isTop, isNew, isHighlight, isUrgenty } = getListingBadges(listing); // This line was not in the original snippet, but was in the instruction. I'll add it.
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
    ? "w-full h-32 object-contain p-4 group-hover:scale-105 transition-transform duration-500"
    : "w-full h-32 object-cover group-hover:scale-105 transition-transform duration-500";

  // Determine card styles based on promotion Type
  let cardClasses = "listing-card rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer group relative hover:-translate-y-1 bg-white ";

  const pkgType = listing?.package_type?.toLowerCase();

  if (listing?.is_gallery || ['galerie', 'gallery', 'galeri', 'vitrin'].includes(pkgType)) {
    cardClasses += "border-[3px] border-purple-500 ring-4 ring-purple-100 shadow-[0_0_20px_rgba(147,51,234,0.3)] bg-purple-50/20 scale-[1.01] ";
  } else if (pkgType === 'premium' || pkgType === 'z_premium' || (listing.is_top && !pkgType)) {
    cardClasses += "border-2 border-amber-400 ring-4 ring-amber-50/50 bg-amber-50/10 ";
  } else if (pkgType === 'multi-bump' || pkgType === 'z_multi_bump' || listing.is_multi_bump) {
    cardClasses += "border-2 border-orange-400 ring-4 ring-orange-50/50 bg-orange-50/10 ";
  } else if (listing.is_highlighted || pkgType === 'highlight' || pkgType === 'budget') {
    cardClasses += "border-2 border-yellow-500 bg-yellow-50/5 shadow-yellow-100 ";
  }

  return (
    <div className={cardClasses} onClick={() => navigate(`/product/${listing.id}`)}>
      <div className="relative overflow-hidden rounded-t-xl bg-gray-100 h-32" style={{ isolation: 'isolate', transform: 'translateZ(0)' }}>
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
        {/* TOP Badge removed per user request */}
        {/* Package Badge */}
        {listing?.package_type &&
          listing.package_type.toLowerCase() !== 'basic' &&
          listing.package_type.toLowerCase() !== 'top' &&
          listing.package_type.toLowerCase() !== 'basic' &&
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
        {/* Vitrin Badge - Even more inclusive check */}
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
        {/* Favorite Button - Only show for other users' listings */}
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
          {listing.date && (
            <div className="text-xs text-gray-700 mt-1 text-right absolute bottom-2 right-2">
              {listing.date}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Listing Grid Component
export const ListingGrid = ({ isLatest = false, selectedCategory = 'Tüm Kategoriler', searchTerm = '', toggleFavorite, isFavorite }) => {
  const [apiListings, setApiListings] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  // Fetch latest listings from backend when isLatest is true
  useEffect(() => {
    if (isLatest) {
      const fetchLatestListings = async () => {
        try {
          setLoading(true);
          // Import fetchListings from api/listings
          const { fetchListings } = await import('./api/listings');
          // Fetch latest 30 listings sorted strictly by created_at desc (ignoring top priority for Son İlanlar)
          const data = await fetchListings({ sort_by_newest: true }, { count: false });

          // Take only first 30 listings (already sorted by created_at desc)
          const latestListings = data.slice(0, 30);

          console.log('Fetched latest listings from Supabase:', latestListings);
          setApiListings(latestListings);
        } catch (error) {
          console.error('Error fetching latest listings:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchLatestListings();
    }
  }, [isLatest]);

  // Use only API listings (no mock data)
  const allListings = isLatest && apiListings.length > 0
    ? apiListings.map(listing => ({
      ...listing,
      // Ensure image field is properly formatted
      image: Array.isArray(listing.images) && listing.images.length > 0
        ? listing.images[0]
        : listing.image || '/placeholder-image.jpg',
      // price handling will be done in ListingCard
      price: listing.price,
      price_type: listing.price_type
    }))
    : [];

  const filtered = allListings.filter(l => {
    const matchesCategory = selectedCategory === 'Tüm Kategoriler' || l.category === selectedCategory;
    const matchesSearch = !searchTerm ||
      (l.title && l.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (l.description && l.description.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  // Trust the API's sorting, but interleave Gallery items every 15 items
  const displayListings = (() => {
    const totalListings = isLatest ? filtered.slice(0, 50) : filtered.slice(0, 10);

    // Separate gallery items
    const galleryItems = totalListings.filter(l => l.is_gallery);
    const regularItems = totalListings.filter(l => !l.is_gallery);

    const interleaved = [];
    let galleryIndex = 0;

    for (let i = 0; i < regularItems.length; i++) {
      // Every 15 items (at index 0, 15, 30...), insert a gallery item if available
      if (i % 15 === 0 && galleryIndex < galleryItems.length) {
        interleaved.push(galleryItems[galleryIndex]);
        galleryIndex++;
      }
      interleaved.push(regularItems[i]);
    }

    // Append remaining gallery items if any
    while (galleryIndex < galleryItems.length) {
      interleaved.push(galleryItems[galleryIndex]);
      galleryIndex++;
    }

    return interleaved;
  })();

  if (loading && isLatest) {
    // Check if skeletons are enabled
    const { SKELETON_CONFIG } = require('./config/skeletonConfig');

    if (SKELETON_CONFIG.enabled) {
      // Use modern skeleton component
      const { ListingGridSkeleton } = require('./components/skeletons/ListingCardSkeleton');
      return <ListingGridSkeleton count={10} />;
    } else {
      // Use old spinner/placeholder
      return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="animate-pulse bg-white rounded-xl shadow-md h-64 overflow-hidden border border-gray-100">
              <div className="bg-gray-200 h-32 w-full"></div>
              <div className="p-3 space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-6 bg-gray-200 rounded w-1/3"></div>
              </div>
            </div>
          ))}
        </div>
      );
    }
  }

  if (displayListings.length === 0) {
    if (selectedCategory !== 'Tüm Kategoriler' && !isLatest && filtered.length === 0) {
      return (
        <div className="text-center py-12 text-gray-500 bg-white rounded-lg border border-dashed border-gray-300">
          "{selectedCategory}" kategorisinde ilan bulunamadı.
        </div>
      );
    }
    return null;
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-4">
      {displayListings.map((listing) => (
        <ListingCard
          key={listing.id}
          listing={listing}
          toggleFavorite={toggleFavorite}
          isFavorite={isFavorite}
          isOwnListing={user && listing.user_id === user.id}
        />
      ))}
    </div>
  );
};

// Gallery Component
export const Gallery = ({ toggleFavorite, isFavorite, priceRange = 'all', filterLocation = 'Tüm Şehirler', sortBy = 'relevance' }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [galleryItems, setGalleryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const itemsPerView = 5;
  const [showInfoModal, setShowInfoModal] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const fetchTopListings = async () => {
      try {
        setLoading(true);
        const { fetchListings } = await import('./api/listings');
        const { clearCache } = await import('./utils/cache');

        // Force clear cache once to fix stale data issues
        clearCache();

        // Fetch top listings, skip count for speed
        const data = await fetchListings({}, { count: false });
        // Include both Gallery and Top listings in the showcase (Exclude Multi-Bump and Premium from Gallery)
        // Only include actual Vitrin (gallery) listings in the showcase
        let topListings = data.filter(listing =>
          listing.is_gallery || ['galerie', 'gallery', 'galeri', 'vitrin'].includes(listing.package_type?.toLowerCase())
        );

        // Fiyat filtresi
        if (priceRange !== 'all') {
          topListings = topListings.filter(listing => {
            const price = parseFloat(listing.price) || 0;

            switch (priceRange) {
              case 'free':
                return price === 0;
              case 'under50':
                return price < 50;
              case 'under100':
                return price < 100;
              case '100-500':
                return price >= 100 && price <= 500;
              case '500-1000':
                return price >= 500 && price <= 1000;
              case '1000-5000':
                return price >= 1000 && price <= 5000;
              case 'over5000':
                return price > 5000;
              default:
                return true;
            }
          });
        }

        // Konum filtresi
        if (filterLocation && filterLocation !== 'Tüm Şehirler') {
          topListings = topListings.filter(listing =>
            listing.city && listing.city.includes(filterLocation)
          );
        }

        // Sıralama
        switch (sortBy) {
          case 'price-asc':
            topListings.sort((a, b) => {
              const priceA = parseFloat(a.price) || 0;
              const priceB = parseFloat(b.price) || 0;
              return priceA - priceB;
            });
            break;
          case 'price-desc':
            topListings.sort((a, b) => {
              const priceA = parseFloat(a.price) || 0;
              const priceB = parseFloat(b.price) || 0;
              return priceB - priceA;
            });
            break;
          case 'newest':
            topListings.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
            break;
          case 'oldest':
            topListings.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
            break;
          case 'relevance':
          default:
            // Shuffle for relevance
            topListings = [...topListings].sort(() => 0.5 - Math.random());
            break;
        }

        // If no top listings found, show random listings instead
        // if (topListings.length === 0) {
        //   topListings = [...data].sort(() => 0.5 - Math.random());
        // }

        setGalleryItems(topListings.slice(0, 10));
      } catch (error) {
        console.error('Error fetching top listings:', error);
        setGalleryItems([]);
      } finally {
        setLoading(false);
      }
    };
    fetchTopListings();
  }, [priceRange, filterLocation, sortBy]);

  const maxIndex = Math.max(0, galleryItems.length - itemsPerView);

  const nextSlide = () => {
    setCurrentIndex(prev => Math.min(prev + 1, maxIndex));
  };

  const prevSlide = () => {
    setCurrentIndex(prev => Math.max(prev - 1, 0));
  };

  // if (galleryItems.length === 0) return null;

  return (
    <section className="mt-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Vitrin</h2>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowInfoModal(true)}
            className="text-sm text-red-600 hover:text-red-700 font-medium hover:underline transition-colors"
          >
            İlanınızı burada yayınlayın
          </button>
          <div className="flex gap-2">
            <button
              onClick={prevSlide}
              disabled={currentIndex === 0}
              className="p-2.5 rounded-full bg-white border-2 border-gray-200 hover:border-red-500 hover:bg-red-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md focus:outline-none"
              aria-label="Previous items"
            >
              <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={nextSlide}
              disabled={currentIndex >= maxIndex}
              className="p-2.5 rounded-full bg-white border-2 border-gray-200 hover:border-red-500 hover:bg-red-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md focus:outline-none"
              aria-label="Next items"
            >
              <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className="relative overflow-hidden">
        {loading ? (
          // Check if skeletons are enabled
          (() => {
            const { SKELETON_CONFIG } = require('./config/skeletonConfig');
            if (SKELETON_CONFIG.enabled) {
              const GallerySkeleton = require('./components/skeletons/GallerySkeleton').default;
              return <GallerySkeleton />;
            } else {
              // Old loading placeholder
              return (
                <div className="flex gap-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="w-64 flex-shrink-0 animate-pulse">
                      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                        <div className="h-48 bg-gray-200"></div>
                        <div className="p-3 space-y-2">
                          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              );
            }
          })()
        ) : galleryItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 bg-white rounded-lg border-2 border-dashed border-gray-200">
            <p className="text-gray-500 font-medium">Henüz vitrin ilanı bulunmamaktadır.</p>
            <p className="text-sm text-gray-400 mt-1">İlanınızı öne çıkarmak için "İlanınızı burada yayınlayın"a tıklayın.</p>
          </div>
        ) : (
          <div
            className="flex transition-transform duration-300 ease-in-out gap-3"
            style={{ transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)` }}
          >
            {galleryItems.map((item) => (
              <div key={item.id} className="gallery-item w-[calc(20%-9.6px)] flex-shrink-0">
                <ListingCard
                  listing={item}
                  toggleFavorite={toggleFavorite}
                  isFavorite={isFavorite}
                  isOwnListing={user && item.user_id === user.id}
                />
              </div>
            ))}
          </div>
        )}
      </div>
      <GalleryInfoModal
        isOpen={showInfoModal}
        onClose={() => setShowInfoModal(false)}
      />
    </section>
  );
};

// Gallery Info Modal
const GalleryInfoModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={(e) => { e.stopPropagation(); onClose(); }}>
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="relative h-48 bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
          <div className="text-center text-white z-10 p-6">
            <h2 className="text-3xl font-bold mb-2">{t.topAds.modal.title}</h2>
            <p className="text-blue-100 text-lg">{t.topAds.modal.subtitle}</p>
          </div>
          <button onClick={onClose} className="absolute top-4 right-4 text-white/80 hover:text-white bg-black/20 hover:bg-black/40 rounded-full p-2 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-8">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-1">{t.topAds.modal.queriesTitle}</h3>
              <p className="text-gray-600">{t.topAds.modal.queriesDesc}</p>
            </div>
          </div>

          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-1">{t.topAds.modal.rotationTitle}</h3>
              <p className="text-gray-600">{t.topAds.modal.rotationDesc}</p>
            </div>
          </div>

          <div className="flex items-start gap-4 mb-8">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-1">{t.topAds.modal.premiumTitle}</h3>
              <p className="text-gray-600">{t.topAds.modal.premiumDesc}</p>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8 flex gap-3">
            <span className="text-2xl">💡</span>
            <p className="text-sm text-yellow-800">
              <span className="font-bold">{t.topAds.modal.tip}</span> {t.topAds.modal.tipDesc}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <a href="#" className="text-blue-600 hover:text-blue-800 font-medium text-sm hover:underline">
              {t.topAds.modal.moreInfo}
            </a>
            <button
              onClick={() => navigate('/profile?tab=listings')}
              className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg font-bold hover:shadow-lg transform hover:-translate-y-0.5 transition-all"
            >
              {t.topAds.modal.selectListing}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Category-specific Gallery Component
export const CategoryGallery = ({ category, subCategory, listings, toggleFavorite = () => { }, isFavorite = () => false, hidePrice = false }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [galleryItems, setGalleryItems] = useState([]);
  const [itemsPerView, setItemsPerView] = useState(5);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const { user } = useAuth();

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

  useEffect(() => {
    const fetchCategoryTopListings = async () => {
      try {
        // If listings prop is provided, use it directly
        if (listings) {
          const shuffled = [...listings].sort(() => 0.5 - Math.random());
          setGalleryItems(shuffled.slice(0, 10));
          return;
        }

        // Otherwise, fetch from Supabase
        const { fetchListings } = await import('./api/listings');
        let filters = { is_top: true };

        if (category) {
          filters.category = category;
        }

        if (subCategory) {
          filters.subCategory = subCategory;
        }

        const topListings = await fetchListings(filters);

        // Filter out premium, multi-bump and other basic types manually after fetch to be extra safe
        const filteredTop = topListings.filter(l =>
          l.package_type?.toLowerCase() !== 'premium' &&
          l.package_type?.toLowerCase() !== 'z_premium' &&
          l.package_type?.toLowerCase() !== 'multi-bump' &&
          l.package_type?.toLowerCase() !== 'z_multi_bump' &&
          l.package_type?.toLowerCase() !== 'basic' &&
          l.package_type?.toLowerCase() !== 'verlängerung' &&
          l.package_type?.toLowerCase() !== 'extension'
        );

        const shuffled = [...filteredTop].sort(() => 0.5 - Math.random());

        // If no top listings found, show random listings from category/subcategory
        if (shuffled.length === 0) {
          // Fetch all listings for fallback
          const allListings = await fetchListings(category || subCategory ? { category, subCategory } : {});
          const randomFallback = [...allListings].sort(() => 0.5 - Math.random());
          setGalleryItems(randomFallback.slice(0, 10));
        } else {
          setGalleryItems(shuffled.slice(0, 10));
        }
      } catch (error) {
        console.error('Error fetching category top listings:', error);
        setGalleryItems([]);
      }
    };
    fetchCategoryTopListings();
  }, [category, subCategory, listings]);

  const maxIndex = Math.max(0, galleryItems.length - itemsPerView);

  const nextSlide = () => {
    setCurrentIndex(prev => Math.min(prev + 1, maxIndex));
  };

  const prevSlide = () => {
    setCurrentIndex(prev => Math.max(prev - 1, 0));
  };

  return (
    <section className="mb-4 sm:mb-6 overflow-hidden">
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900">{t.topAds.title}</h2>
        <div className="flex items-center gap-2 sm:gap-4">
          <button
            onClick={() => setShowInfoModal(true)}
            className="text-xs sm:text-sm text-red-600 hover:text-red-700 font-medium hover:underline transition-colors"
          >
            {t.topAds.placeAd}
          </button>
          {galleryItems.length > 0 && (
            <div className="flex gap-1 sm:gap-2">
              <button
                onClick={prevSlide}
                disabled={currentIndex === 0}
                className="p-1.5 sm:p-2.5 rounded-full bg-white border-2 border-gray-200 hover:border-red-500 hover:bg-red-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md focus:outline-none"
                aria-label="Previous items"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={nextSlide}
                disabled={currentIndex >= maxIndex}
                className="p-1.5 sm:p-2.5 rounded-full bg-white border-2 border-gray-200 hover:border-red-500 hover:bg-red-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md focus:outline-none"
                aria-label="Next items"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="relative overflow-hidden">
        {galleryItems.length === 0 ? (
          <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg sm:rounded-xl p-8 sm:p-12 text-center">
            <svg className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-3 sm:mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <p className="text-sm sm:text-base text-gray-500 font-medium">{t.topAds.noAds}</p>
            <p className="text-xs sm:text-sm text-gray-400 mt-1 sm:mt-2">{t.topAds.checkBackLater}</p>
          </div>
        ) : (
          <div
            className="flex transition-transform duration-300 ease-in-out gap-2 sm:gap-3"
            style={{ transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)` }}
          >
            {galleryItems.map((item) => (
              <div
                key={item.id}
                className="gallery-item flex-shrink-0"
                style={{ width: `calc(${100 / itemsPerView}% - ${(itemsPerView - 1) * (itemsPerView === 2 ? 8 : 12) / itemsPerView}px)` }}
              >
                <ListingCard
                  listing={item}
                  toggleFavorite={toggleFavorite}
                  isFavorite={isFavorite}
                  isOwnListing={user && item.user_id === user.id}
                  hidePrice={hidePrice}
                />
              </div>
            ))}
          </div>
        )}
      </div>
      <GalleryInfoModal
        isOpen={showInfoModal}
        onClose={() => setShowInfoModal(false)}
      />
    </section>
  );
};

// Welcome Modal Component
export const WelcomeModal = ({ onClose }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md mx-4 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 className="text-xl font-semibold mb-4">{t.welcome.title}</h2>
        <p className="text-gray-600 mb-4">
          {t.welcome.subtitle}
        </p>

        <ul className="space-y-2 mb-6">
          <li className="flex items-center gap-2 text-sm text-gray-700">
            <div className="w-5 h-5 bg-red-400 rounded-full flex items-center justify-center">
              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
              </svg>
            </div>
            {t.welcome.feature3}
          </li>
          <li className="flex items-center gap-2 text-sm text-gray-700">
            <div className="w-5 h-5 bg-red-400 rounded-full flex items-center justify-center">
              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
              </svg>
            </div>
            {t.welcome.feature1}
          </li>
          <li className="flex items-center gap-2 text-sm text-gray-700">
            <div className="w-5 h-5 bg-red-400 rounded-full flex items-center justify-center">
              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
              </svg>
            </div>
            {t.welcome.feature2}
          </li>
        </ul>

        <div className="flex gap-3">
          <button
            onClick={() => { navigate('/register'); onClose(); }}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            {t.nav.register}
          </button>
          <button
            onClick={() => { navigate('/login'); onClose(); }}
            className="flex-1 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 font-medium"
          >
            {t.nav.login}
          </button>
        </div>
      </div>
    </div>
  );
};

// Helper function to get German state from postal code
// Mesaj Gönderme Modalı
export const MessageModal = ({ isOpen, onClose, onSubmit, sellerName, listingTitle }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  // Auto-fill name and phone from user profile
  React.useEffect(() => {
    const loadUserProfile = async () => {
      if (user && isOpen) {
        try {
          const { fetchUserProfile } = await import('./api/profile');
          const profile = await fetchUserProfile(user.id);
          if (profile) {
            setName(profile.full_name || '');
            setPhone(profile.phone || '');
          }
        } catch (error) {
          console.error('Error loading user profile:', error);
        }
      }
    };

    loadUserProfile();
  }, [user, isOpen]);

  if (!isOpen) return null;


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert(t.sellerProfile.loginToMessage);
      return;
    }

    try {
      setLoading(true);
      const { sendMessage } = await import('./api/messages');
      // We need receiverId. Assuming onSubmit was handling it, but now we do it here.
      // Ideally MessageModal should receive receiverId prop.
      // For now, let's keep onSubmit for backward compatibility but enhance it or replace logic if possible.
      // Wait, the previous implementation just called onSubmit({ name, phone, message }).
      // The parent component (ProductDetail or SellerProfile) handles the actual sending logic?
      // Let's check where MessageModal is used.

      // Actually, looking at usages, MessageModal passes data to parent.
      // To make it "real", we should either:
      // 1. Update all parents to call API.
      // 2. Update MessageModal to take receiverId and listingId and call API directly.

      // Option 2 is better for encapsulation.
      // I need to update the component signature to accept receiverId and listingId.

      await onSubmit({ name, phone, message }); // Keep existing behavior for now to avoid breaking parents immediately

      setName('');
      setPhone('');
      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      alert(t.sellerProfile.messageError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={onClose}></div>
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                  {t.sellerProfile.message} - {sellerName}
                </h3>
                {listingTitle && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Konu: {listingTitle}
                    </p>
                  </div>
                )}
                <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                  <div>
                    <label htmlFor="modal-name" className="block text-sm font-medium text-gray-700">{t.addListing.name}</label>
                    <input
                      type="text"
                      id="modal-name"
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <div>
                    <label htmlFor="modal-phone" className="block text-sm font-medium text-gray-700">{t.addListing.phoneNumber}</label>
                    <input
                      type="tel"
                      id="modal-phone"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                  <div>
                    <label htmlFor="modal-message" className="block text-sm font-medium text-gray-700">{t.sellerProfile.message}</label>
                    <textarea
                      id="modal-message"
                      required
                      rows={4}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                    />
                  </div>
                  <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                    <button
                      type="submit"
                      className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-base font-medium text-white hover:from-red-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                    >
                      {t.productDetail.send}
                    </button>
                    <button
                      type="button"
                      className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
                      onClick={onClose}
                    >
                      {t.common.cancel}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const getStateFromZip = (zip) => {
  if (!zip || zip.length < 1) return '';
  const firstTwoDigits = parseInt(zip.substring(0, 2));

  if (isNaN(firstTwoDigits)) return '';

  // Turkish City Mapping (Plate numbers 01-81)
  // 5-digit postal codes usually start with the plate number in Turkey
  if (zip.length === 5 && firstTwoDigits >= 1 && firstTwoDigits <= 81) {
    const turkishCities = [
      'Adana', 'Adıyaman', 'Afyonkarahisar', 'Ağrı', 'Amasya', 'Ankara', 'Antalya', 'Artvin',
      'Aydın', 'Balıkesir', 'Bilecik', 'Bingöl', 'Bitlis', 'Bolu', 'Burdur', 'Bursa', 'Çanakkale',
      'Çankırı', 'Çorum', 'Denizli', 'Diyarbakır', 'Edirne', 'Elazığ', 'Erzincan', 'Erzurum',
      'Eskişehir', 'Gaziantep', 'Giresun', 'Gümüşhane', 'Hakkari', 'Hatay', 'Isparta', 'Mersin',
      'İstanbul', 'İzmir', 'Kars', 'Kastamonu', 'Kayseri', 'Kırklareli', 'Kırşehir', 'Kocaeli',
      'Konya', 'Kütahya', 'Malatya', 'Manisa', 'Kahramanmaraş', 'Mardin', 'Muğla', 'Muş',
      'Nevşehir', 'Niğde', 'Ordu', 'Rize', 'Sakarya', 'Samsun', 'Siirt', 'Sinop', 'Sivas',
      'Tekirdağ', 'Tokat', 'Trabzon', 'Tunceli', 'Şanlıurfa', 'Uşak', 'Van', 'Yozgat', 'Zonguldak',
      'Aksaray', 'Bayburt', 'Karaman', 'Kırıkkale', 'Batman', 'Şırnak', 'Bartın', 'Ardahan',
      'Iğdır', 'Yalova', 'Karabük', 'Kilis', 'Osmaniye', 'Düzce'
    ];
    return turkishCities[firstTwoDigits - 1] || '';
  }

  // Precise mapping based on German postal code ranges
  // Returns single Bundesland name matching our filter values
  if (firstTwoDigits >= 1 && firstTwoDigits <= 1) return 'Brandenburg';
  if (firstTwoDigits >= 2 && firstTwoDigits <= 3) return 'Sachsen';
  if (firstTwoDigits >= 4 && firstTwoDigits <= 9) return 'Sachsen-Anhalt';
  if (firstTwoDigits >= 10 && firstTwoDigits <= 14) return 'Berlin';
  if (firstTwoDigits >= 15 && firstTwoDigits <= 19) return 'Brandenburg';
  if (firstTwoDigits >= 20 && firstTwoDigits <= 21) return 'Hamburg';
  if (firstTwoDigits >= 22 && firstTwoDigits <= 25) return 'Schleswig-Holstein';
  if (firstTwoDigits >= 26 && firstTwoDigits <= 27) return 'Bremen';
  if (firstTwoDigits >= 28 && firstTwoDigits <= 29) return 'Niedersachsen';
  if (firstTwoDigits >= 30 && firstTwoDigits <= 34) return 'Niedersachsen';
  if (firstTwoDigits >= 35 && firstTwoDigits <= 36) return 'Hessen';
  if (firstTwoDigits === 37) return 'Niedersachsen';
  if (firstTwoDigits === 38) return 'Sachsen-Anhalt';
  if (firstTwoDigits === 39) return 'Sachsen-Anhalt';
  if (firstTwoDigits >= 40 && firstTwoDigits <= 48) return 'Nordrhein-Westfalen';
  if (firstTwoDigits === 49) return 'Niedersachsen';
  if (firstTwoDigits >= 50 && firstTwoDigits <= 53) return 'Nordrhein-Westfalen';
  if (firstTwoDigits >= 54 && firstTwoDigits <= 56) return 'Rheinland-Pfalz';
  if (firstTwoDigits >= 57 && firstTwoDigits <= 59) return 'Nordrhein-Westfalen';
  if (firstTwoDigits >= 60 && firstTwoDigits <= 65) return 'Hessen';
  if (firstTwoDigits === 66) return 'Saarland';
  if (firstTwoDigits === 67) return 'Rheinland-Pfalz';
  if (firstTwoDigits >= 68 && firstTwoDigits <= 69) return 'Baden-Württemberg';
  if (firstTwoDigits >= 70 && firstTwoDigits <= 79) return 'Baden-Württemberg';
  if (firstTwoDigits >= 80 && firstTwoDigits <= 89) return 'Bayern';
  if (firstTwoDigits >= 90 && firstTwoDigits <= 96) return 'Bayern';
  if (firstTwoDigits === 97) return 'Thüringen';
  if (firstTwoDigits >= 98 && firstTwoDigits <= 99) return 'Thüringen';

  return '';
};

// Special Sellers Component - Unternehmensseiten
export const SpecialSellers = ({ toggleFollowSeller, isSellerFollowed }) => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(5);

  // Filter only commercial sellers (Gewerblicher Nutzer)
  const companies = Object.entries(mockSellers)
    .map(([id, seller]) => ({ ...seller, id }))
    .filter(seller => seller.sellerType === 'Gewerblicher Nutzer');

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
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Türkiye'deki Kurumsal Sayfalar</h2>
        <div className="flex items-center gap-2 sm:gap-4">
          <a
            href="/Unternehmensseiten"
            className="text-xs sm:text-sm text-red-600 hover:text-red-700 font-medium hover:underline transition-colors"
          >
            {t.common.all || 'Hepsini göster'}
          </a>
          <div className="flex gap-1 sm:gap-2">
            <button
              onClick={prevSlide}
              disabled={currentIndex === 0}
              className="p-1.5 sm:p-2 rounded-full border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              aria-label="Previous companies"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={nextSlide}
              disabled={currentIndex >= maxIndex}
              className="p-1.5 sm:p-2 rounded-full border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              aria-label="Next companies"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className="relative overflow-hidden">
        <div
          className="flex transition-transform duration-300 ease-in-out gap-2 sm:gap-4"
          style={{ transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)` }}
        >
          {companies.map((company) => (
            <div
              key={company.id}
              className="w-[calc(20%-16px)] flex-shrink-0 bg-white rounded-xl shadow-sm hover:shadow-lg transition-all cursor-pointer group border border-gray-100 overflow-hidden"
              onClick={() => navigate(`/seller/${company.user_number}`)}
            >
              {/* Company Image - Same as listing card */}
              <div className="relative w-full h-40 bg-gray-100">
                <img
                  src={company.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(company.name)}&background=0D8ABC&color=fff&size=400`}
                  alt={company.name}
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Company Info - Same padding as listing card */}
              <div className="p-3">
                {/* Company Name */}
                <h3 className="font-semibold text-sm text-gray-900 mb-1 line-clamp-2 group-hover:text-blue-600 transition-colors">
                  {company.name}
                </h3>

                {/* Business Type/Category */}
                {company.businessType && (
                  <p className="text-xs text-gray-500 mb-2 font-medium">
                    {company.businessType}
                  </p>
                )}

                {/* Location */}
                <div className="flex items-center gap-1 text-gray-500 text-xs mb-2">
                  <svg className="w-3.5 h-3.5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="8" />
                    <circle cx="12" cy="12" r="2.5" fill="currentColor" stroke="none" />
                    <line x1="12" y1="2" x2="12" y2="4" />
                    <line x1="12" y1="20" x2="12" y2="22" />
                    <line x1="2" y1="12" x2="4" y2="12" />
                    <line x1="20" y1="12" x2="22" y2="12" />
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

                {/* Stats */}
                <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                  <div className="flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span>{company.totalListings || 0} İlanlar</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-500">★</span>
                    <span className="font-medium text-gray-700">{company.rating}</span>
                  </div>
                </div>

                {/* Action Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/seller/${company.user_number}`);
                  }}
                  className="w-full py-2 px-3 rounded-lg font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors text-xs"
                >
                  Zur Unternehmensseite
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Add Listing Page Component
export const AddListing = () => {
  // Debug logging
  const [debugLog, setDebugLog] = React.useState(null);
  const logDebug = (msg, val) => console.log(msg, val);
  const { user } = useAuth(); // Get current user
  const navigate = useNavigate(); // Get navigate function
  const [searchParams] = useSearchParams(); // Get URL parameters
  const editId = searchParams.get('edit'); // Get edit ID from URL
  const [isEditMode, setIsEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [limitState, setLimitState] = useState({ canAdd: true, limit: 20, currentCount: 0, remaining: 20 });
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [payingExtra, setPayingExtra] = useState(false);

  // Check listing limit on mount
  useEffect(() => {
    const checkLimit = async () => {
      if (!user || editId) return; // Don't check limit if user not logged in or editing

      try {
        const { checkUserListingLimit } = await import('./api/listings');
        const status = await checkUserListingLimit(user.id);
        setLimitState(status);
        if (!status.canAdd) {
          // setShowLimitModal(true); // Defer to handleSubmit as per user request
        }
      } catch (error) {
        console.error('Error in limit check:', error);
      }
    };
    checkLimit();
  }, [user, editId]);

  const handlePayExtra = async () => {
    setPayingExtra(true);
    try {
      // Mock payment delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      const { fetchUserProfile, updateUserProfile } = await import('./api/profile');
      const profile = await fetchUserProfile(user.id);

      await updateUserProfile(user.id, {
        extra_paid_listings: (profile.extra_paid_listings || 0) + 1
      });

      setLimitState(prev => ({
        ...prev,
        canAdd: true,
        limit: prev.limit + 1,
        remaining: 1
      }));
      setShowLimitModal(false);
    } catch (error) {
      console.error('Error paying for extra listing:', error);
      alert('Ödeme işlemi sırasında bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setPayingExtra(false);
    }
  };

  // Categories from Supabase
  const [categories, setCategories] = useState([]);
  const [availableSubcategories, setAvailableSubcategories] = useState([]);


  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [subCategory, setSubCategory] = useState('');
  const isJobCategory = category === 'İş İlanları' || subCategory === 'Eğitim / Meslek Eğitimi';
  const hideConditionAndShipping = category === 'Emlak' || category === 'Eğitim & Kurslar' || isJobCategory || subCategory === 'Bebek Bakıcısı & Kreş' || subCategory === 'Balıklar' || subCategory === 'Köpekler' || subCategory === 'Kediler' || subCategory === 'Küçük Hayvanlar' || subCategory === 'Çiftlik Hayvanları' || subCategory === 'Atlar' || subCategory === 'Hayvan Bakımı & Eğitim' || subCategory === 'Kayıp Hayvanlar' || subCategory === 'Kuşlar' || subCategory === 'Konteyner' || subCategory === 'Tamir & Servis' || subCategory === 'Ticari Araçlar & Römorklar' || subCategory === 'Tekne & Tekne Malzemeleri';
  const [condition, setCondition] = useState(''); // Default to empty string for granular selection
  const [price, setPrice] = useState('');
  const [priceType, setPriceType] = useState('fixed');
  const [description, setDescription] = useState('');
  const [imageFiles, setImageFiles] = useState([]);

  const [city, setCity] = useState(localStorage.getItem('savedCity') || '');
  const [district, setDistrict] = useState(localStorage.getItem('savedDistrict') || '');
  const [region, setRegion] = useState(localStorage.getItem('savedRegion') || '');
  const [address, setAddress] = useState(localStorage.getItem('savedAddress') || '');
  const [offerType, setOfferType] = useState('Angebote'); // 'Angebote' or 'Gesuche'
  const [contactName, setContactName] = useState(''); // Will be auto-filled from profile
  const [phoneNumber, setPhoneNumber] = useState(''); // Will be auto-filled from profile
  const [showPhoneNumber, setShowPhoneNumber] = useState(false);
  const [showLocation, setShowLocation] = useState(
    localStorage.getItem('savedShowLocation') !== null
      ? localStorage.getItem('savedShowLocation') === 'true'
      : false
  );

  // Debug logging hook
  useEffect(() => {
    console.log('[DEBUG] AddListing State:', { category, subCategory });
  }, [category, subCategory]);
  // Don't show location by default, seller must choose
  const [legalInfo, setLegalInfo] = useState(''); // Will be auto-filled for commercial sellers
  // const [federalState, setFederalState] = useState(''); // Removed dependency on postal code

  const [sellerType, setSellerType] = useState(''); // Store seller type from profile

  // Auto-specific states
  const [selectedCarBrand, setSelectedCarBrand] = useState('');
  const [selectedCarModel, setSelectedCarModel] = useState('');
  const [selectedFahrzeugtyp, setSelectedFahrzeugtyp] = useState('');
  const [selectedDoorCount, setSelectedDoorCount] = useState('');
  const [selectedExteriorColor, setSelectedExteriorColor] = useState('');
  const [selectedInteriorMaterial, setSelectedInteriorMaterial] = useState('');
  const [selectedEmissionBadge, setSelectedEmissionBadge] = useState('');
  const [selectedSchadstoffklasse, setSelectedSchadstoffklasse] = useState('');
  const [selectedHU, setSelectedHU] = useState('');
  const [isUnfallfrei, setIsUnfallfrei] = useState(false);
  const [isScheckheftgepflegt, setIsScheckheftgepflegt] = useState(false);
  const [isNichtraucher, setIsNichtraucher] = useState(false);
  const [selectedCarAmenities, setSelectedCarAmenities] = useState([]);
  const [erstzulassungMonat, setErstzulassungMonat] = useState('');

  // Bike-specific states
  const [selectedBikeType, setSelectedBikeType] = useState('');
  const [selectedBikeArt, setSelectedBikeArt] = useState('');

  // Autoteile-specific state
  const [selectedAutoteileArt, setSelectedAutoteileArt] = useState('');
  const [selectedAutoteileAngebotstyp, setSelectedAutoteileAngebotstyp] = useState('');
  const [selectedVersand, setSelectedVersand] = useState('');

  // Boote-specific state
  const [selectedBooteArt, setSelectedBooteArt] = useState('');

  // Dekoration-specific state
  const [selectedDekorationArt, setSelectedDekorationArt] = useState('');

  // Motorrad-specific state
  const [selectedMotorradArt, setSelectedMotorradArt] = useState('');

  // Motorradteile-specific state
  const [selectedMotorradteileArt, setSelectedMotorradteileArt] = useState('');

  // Nutzfahrzeuge-specific state
  const [selectedNutzfahrzeugeArt, setSelectedNutzfahrzeugeArt] = useState('');

  // Wohnwagen-specific state
  const [selectedWohnwagenArt, setSelectedWohnwagenArt] = useState('');

  // Wohnzimmer-specific state
  const [selectedWohnzimmerArt, setSelectedWohnzimmerArt] = useState('');

  // Schlafzimmer-specific state
  const [selectedSchlafzimmerArt, setSelectedSchlafzimmerArt] = useState('');

  // Küche & Esszimmer-specific state
  const [selectedKuecheEsszimmerArt, setSelectedKuecheEsszimmerArt] = useState('');

  // Kadın Giyimi (Damenbekleidung) specific states
  const [selectedDamenbekleidungArt, setSelectedDamenbekleidungArt] = useState('');
  const [selectedDamenbekleidungMarke, setSelectedDamenbekleidungMarke] = useState('');
  const [selectedDamenbekleidungSize, setSelectedDamenbekleidungSize] = useState('');
  const [selectedDamenbekleidungColor, setSelectedDamenbekleidungColor] = useState('');

  // Gartenzubehör & Pflanzen-specific state
  const [selectedGartenzubehoerArt, setSelectedGartenzubehoerArt] = useState('');

  // Lamba & Aydınlatma-specific state
  const [selectedLambaAydinlatmaArt, setSelectedLambaAydinlatmaArt] = useState('');

  // Dienstleistungen > Haus & Garten-specific state
  const [selectedDienstleistungenHausGartenArt, setSelectedDienstleistungenHausGartenArt] = useState('');

  // Bücher & Zeitschriften-specific state
  const [selectedBuecherZeitschriftenArt, setSelectedBuecherZeitschriftenArt] = useState('');

  // Sammeln-specific state
  const [selectedSammelnArt, setSelectedSammelnArt] = useState('');

  // Elektronik > Audio & Hifi-specific state
  const [selectedElektronikAudioHifiArt, setSelectedElektronikAudioHifiArt] = useState('');

  // Modellbau-specific state
  const [selectedModellbauArt, setSelectedModellbauArt] = useState('');

  // Jobs-specific state
  const [workingTime, setWorkingTime] = useState('');
  const [hourlyWage, setHourlyWage] = useState('');
  const [jobType, setJobType] = useState('');

  // Handarbeit, Basteln & Kunsthandwerk-specific state
  const [selectedHandarbeitArt, setSelectedHandarbeitArt] = useState('');

  // Künstler/-in & Musiker/-in-specific state
  const [selectedKuenstlerMusikerArt, setSelectedKuenstlerMusikerArt] = useState('');

  // Reise & Eventservices-specific state
  const [selectedReiseEventservicesArt, setSelectedReiseEventservicesArt] = useState('');

  // Tierbetreuung & Training-specific state
  const [selectedTierbetreuungTrainingArt, setSelectedTierbetreuungTrainingArt] = useState('');

  // Baby & Kinderkleidung-specific state
  const [babyKinderkleidungArt, setBabyKinderkleidungArt] = useState('');
  const [babyKinderkleidungSize, setBabyKinderkleidungSize] = useState('');
  const [babyKinderkleidungGender, setBabyKinderkleidungGender] = useState('');
  const [babyKinderkleidungColor, setBabyKinderkleidungColor] = useState('');
  const [babyKinderschuheArt, setBabyKinderschuheArt] = useState('');
  const [babyKinderschuheSize, setBabyKinderschuheSize] = useState('');
  const [babyKinderschuheColor, setBabyKinderschuheColor] = useState('');
  const [babyschalenKindersitzeColor, setBabyschalenKindersitzeColor] = useState(''); // Bebek Arabaları
  const [kinderwagenBuggysArt, setKinderwagenBuggysArt] = useState('');
  const [kinderwagenBuggysColor, setKinderwagenBuggysColor] = useState('');

  // Herrenschuhe
  const [selectedHerrenschuheArt, setSelectedHerrenschuheArt] = useState('');
  const [selectedHerrenschuheMarke, setSelectedHerrenschuheMarke] = useState('');
  const [selectedHerrenschuheSize, setSelectedHerrenschuheSize] = useState('');
  const [selectedHerrenschuheColor, setSelectedHerrenschuheColor] = useState('');

  // Babyschalen & Kindersitze
  const [damenbekleidungColor, setDamenbekleidungColor] = useState('');
  const [damenbekleidungMarke, setDamenbekleidungMarke] = useState('');
  const [damenbekleidungSize, setDamenbekleidungSize] = useState('');
  const [damenbekleidungArt, setDamenbekleidungArt] = useState('');
  const [damenschuheColor, setDamenschuheColor] = useState('');
  const [damenschuheMarke, setDamenschuheMarke] = useState('');
  const [damenschuheSize, setDamenschuheSize] = useState('');
  const [damenschuheArt, setDamenschuheArt] = useState('');
  const [herrenbekleidungColor, setHerrenbekleidungColor] = useState('');
  const [herrenbekleidungMarke, setHerrenbekleidungMarke] = useState('');
  const [herrenbekleidungSize, setHerrenbekleidungSize] = useState('');
  const [herrenbekleidungArt, setHerrenbekleidungArt] = useState('');

  const [selectedKinderzimmermobelArt, setSelectedKinderzimmermobelArt] = useState('');
  const [selectedSpielzeugArt, setSelectedSpielzeugArt] = useState('');
  const [selectedFischeArt, setSelectedFischeArt] = useState('');
  const [selectedHundeArt, setSelectedHundeArt] = useState('');
  const [selectedHundeAlter, setSelectedHundeAlter] = useState('');
  const [selectedHundeGeimpft, setSelectedHundeGeimpft] = useState('');
  const [selectedHundeErlaubnis, setSelectedHundeErlaubnis] = useState('');
  const [selectedKatzenArt, setSelectedKatzenArt] = useState('');
  const [selectedKatzenAlter, setSelectedKatzenAlter] = useState('');
  const [selectedKatzenGeimpft, setSelectedKatzenGeimpft] = useState('');
  const [selectedKatzenErlaubnis, setSelectedKatzenErlaubnis] = useState('');
  const [selectedKleintiereArt, setSelectedKleintiereArt] = useState('');
  const [selectedNutztiereArt, setSelectedNutztiereArt] = useState('');
  const [selectedPferdeArt, setSelectedPferdeArt] = useState('');
  const [selectedVermisstetiereStatus, setSelectedVermisstetiereStatus] = useState('');
  const [selectedHaustierZubehoerArt, setSelectedHaustierZubehoerArt] = useState('');
  const [selectedVoegelArt, setSelectedVoegelArt] = useState('');
  const [selectedBeautyGesundheitArt, setSelectedBeautyGesundheitArt] = useState('');

  // Bau, Handwerk & Produktion-specific state
  const [selectedBauHandwerkProduktionArt, setSelectedBauHandwerkProduktionArt] = useState('');

  const [selectedBueroArbeitVerwaltungArt, setSelectedBueroArbeitVerwaltungArt] = useState('');


  const [selectedGastronomieTourismusArt, setSelectedGastronomieTourismusArt] = useState('');
  const [selectedSozialerSektorPflegeArt, setSelectedSozialerSektorPflegeArt] = useState('');
  const [selectedTransportLogistikVerkehrArt, setSelectedTransportLogistikVerkehrArt] = useState('');
  const [selectedVertriebEinkaufVerkaufArt, setSelectedVertriebEinkaufVerkaufArt] = useState('');
  const [selectedWeitereJobsArt, setSelectedWeitereJobsArt] = useState('');
  const [selectedAudioHifiArt, setSelectedAudioHifiArt] = useState('');
  const [selectedHandyTelefonArt, setSelectedHandyTelefonArt] = useState('');
  const [selectedFotoArt, setSelectedFotoArt] = useState('');
  const [selectedHaushaltsgeraeteArt, setSelectedHaushaltsgeraeteArt] = useState('');
  const [selectedKonsolenArt, setSelectedKonsolenArt] = useState('');
  const [selectedPCZubehoerSoftwareArt, setSelectedPCZubehoerSoftwareArt] = useState('');
  const [selectedTabletsReaderArt, setSelectedTabletsReaderArt] = useState('');
  const [selectedTVVideoArt, setSelectedTVVideoArt] = useState('');
  const [selectedNotebooksArt, setSelectedNotebooksArt] = useState('');
  const [selectedPCsArt, setSelectedPCsArt] = useState('');
  const [selectedVideospieleArt, setSelectedVideospieleArt] = useState('');
  const [selectedWeitereElektronikArt, setSelectedWeitereElektronikArt] = useState('');
  const [selectedDienstleistungenElektronikArt, setSelectedDienstleistungenElektronikArt] = useState('');

  const [selectedTaschenAccessoiresArt, setSelectedTaschenAccessoiresArt] = useState('');
  const [selectedUhrenSchmuckArt, setSelectedUhrenSchmuckArt] = useState('');
  const [selectedAltenpflegeArt, setSelectedAltenpflegeArt] = useState('');
  const [selectedSprachkurseArt, setSelectedSprachkurseArt] = useState('');
  const [selectedKunstGestaltungArt, setSelectedKunstGestaltungArt] = useState('');
  const [selectedWeiteresHausGartenArt, setSelectedWeiteresHausGartenArt] = useState('');

  // Auf Zeit & WG states
  const [selectedAufZeitWGArt, setSelectedAufZeitWGArt] = useState('');
  const [selectedRentalType, setSelectedRentalType] = useState('');
  const [selectedOnlineViewing, setSelectedOnlineViewing] = useState('');
  const [livingSpace, setLivingSpace] = useState('');
  const [rooms, setRooms] = useState('');
  const [roommates, setRoommates] = useState('');
  const [availableFrom, setAvailableFrom] = useState('');
  const [warmRent, setWarmRent] = useState('');
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [selectedGeneralFeatures, setSelectedGeneralFeatures] = useState([]);

  // New Immobilien States
  const [selectedWohnungstyp, setSelectedWohnungstyp] = useState('');
  const [selectedHaustyp, setSelectedHaustyp] = useState('');
  const [selectedGrundstuecksart, setSelectedGrundstuecksart] = useState('');
  const [selectedObjektart, setSelectedObjektart] = useState('');
  const [selectedGarageType, setSelectedGarageType] = useState('');
  const [floor, setFloor] = useState('');
  const [constructionYear, setConstructionYear] = useState('');
  const [plotArea, setPlotArea] = useState('');
  const [selectedCommission, setSelectedCommission] = useState('');
  const [selectedLage, setSelectedLage] = useState('');
  const [pricePerSqm, setPricePerSqm] = useState('');
  const [selectedApartmentFeatures, setSelectedApartmentFeatures] = useState([]);
  const [selectedHouseFeatures, setSelectedHouseFeatures] = useState([]);
  const [selectedAngebotsart, setSelectedAngebotsart] = useState('');
  const [selectedTauschangebot, setSelectedTauschangebot] = useState('');

  // Common Vehicle States (Motorrad, Auto, etc.)
  const [marke, setMarke] = useState('');
  const [selectedSportCampingArt, setSelectedSportCampingArt] = useState('');
  const [kilometerstand, setKilometerstand] = useState('');
  const [erstzulassung, setErstzulassung] = useState('');
  const [hubraum, setHubraum] = useState('');
  const [getriebe, setGetriebe] = useState('');
  const [leistung, setLeistung] = useState('');
  const [kraftstoff, setKraftstoff] = useState('');

  // Load categories from Supabase
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const { fetchCategories } = await import('./api/categories');
        const data = await fetchCategories();
        console.log('Categories loaded for AddListing:', data);

        // Patch Haus & Garten subcategories if missing
        const hausGartenSubcategories = [
          { name: 'Badezimmer' },
          { name: 'Büro' },
          { name: 'Dekoration' },
          { name: 'Dienstleistungen Haus & Garten' },
          { name: 'Gartenzubehör & Pflanzen' },
          { name: 'Heimtextilien' },
          { name: 'Heimwerken' },
          { name: 'Küche & Esszimmer' },
          { name: 'Lampen & Licht' },
          { name: 'Schlafzimmer' },
          { name: 'Wohnzimmer' },
          { name: 'Weiteres Haus & Garten' },
        ];

        const updatedData = data ? data.map(cat => {
          if (cat.name === 'Ev & Bahçe' || cat.name === 'Haus & Garten') {
            const subs = [
              'Badezimmer', 'Büro', 'Dekoration', 'Dienstleistungen Haus & Garten',
              'Gartenzubehör & Pflanzen', 'Heimtextilien', 'Heimwerken', 'Küche & Esszimmer',
              'Lampen & Licht', 'Schlafzimmer', 'Wohnzimmer', 'Weiteres Haus & Garten'
            ];
            return {
              ...cat,
              name: getCategoryTranslation('Haus & Garten'),
              subcategories: subs.map(s => ({ name: getCategoryTranslation(s) })).sort((a, b) => a.name.localeCompare(b.name))
            };
          }

          if (cat.name === 'Ücretsiz & Takas' || cat.name === 'Zu verschenken & Tauschen') {
            const subs = ['Tauschen', 'Verleihen', 'Verschenken'];
            return {
              ...cat,
              name: getCategoryTranslation('Zu verschenken & Tauschen'),
              subcategories: subs.map(s => ({ name: getCategoryTranslation(s) })).sort((a, b) => a.name.localeCompare(b.name))
            };
          }

          if (cat.name === 'Hizmetler' || cat.name === 'Dienstleistungen') {
            const subs = [
              'Altenpflege', 'Auto, Rad & Boot', 'Babysitter/-in & Kinderbetreuung',
              'Dienstleistungen Elektronik', 'Dienstleistungen Haus & Garten',
              'Künstler/-in & Musiker/-in', 'Reise & Eventservices',
              'Tierbetreuung & Training', 'Umzug & Transport', 'Weitere Dienstleistungen'
            ];
            return {
              ...cat,
              name: getCategoryTranslation('Dienstleistungen'),
              subcategories: subs.map(s => ({ name: getCategoryTranslation(s) })).sort((a, b) => a.name.localeCompare(b.name))
            };
          }

          if (cat.name === 'Elektronik') {
            const subs = [
              'Audio & Hifi', 'Dienstleistungen Elektronik', 'Foto', 'Handy & Telefon',
              'Haushaltsgeräte', 'Konsolen', 'Notebooks', 'PCs', 'PC-Zubehör & Software',
              'Tablets & Reader', 'TV & Video', 'Videospiele', 'Weitere Elektronik'
            ];
            return {
              ...cat,
              name: getCategoryTranslation('Elektronik'),
              subcategories: subs.map(s => ({ name: getCategoryTranslation(s) })).sort((a, b) => a.name.localeCompare(b.name))
            };
          }

          if (cat.name === 'Müzik, Film & Kitap' || cat.name === 'Musik, Filme & Bücher') {
            const subs = [
              'Bücher & Zeitschriften', 'Büro & Schreibwaren', 'Comics',
              'Fachbücher, Schule & Studium', 'Film & DVD', 'Musik & CDs',
              'Musikinstrumente', 'Weitere Musik, Filme & Bücher'
            ];
            return {
              ...cat,
              name: getCategoryTranslation('Musik, Filme & Bücher'),
              subcategories: subs.map(s => ({ name: getCategoryTranslation(s) })).sort((a, b) => a.name.localeCompare(b.name))
            };
          }

          if (cat.name === 'İş İlanları' || cat.name === 'Jobs') {
            const subs = [
              'Ausbildung', 'Bau, Handwerk & Produktion', 'Büroarbeit & Verwaltung',
              'Gastronomie & Tourismus', 'Kundenservice & Call Center',
              'Mini- & Nebenjobs', 'Praktika', 'Sozialer Sektor & Pflege',
              'Transport, Lojistik & Verkehr', 'Vertrieb, Einkauf & Verkauf', 'Weitere Jobs'
            ];
            return {
              ...cat,
              name: getCategoryTranslation('Jobs'),
              subcategories: subs.map(s => ({ name: getCategoryTranslation(s) })).sort((a, b) => a.name.localeCompare(b.name))
            };
          }

          if (cat.name === 'Eğlence, Hobi & Mahalle' || cat.name === 'Freizeit, Hobby & Nachbarschaft') {
            const subs = [
              'Esoterik & Spirituelles', 'Essen & Trinken', 'Freizeitaktivitäten',
              'Handarbeit, Basteln & Kunsthandwerk', 'Kunst & Antiquitäten',
              'Künstler/-in & Musiker/-in', 'Modellbau', 'Reise & Eventservices',
              'Sammeln', 'Sport & Camping', 'Trödel', 'Verloren & Gefunden',
              'Weiteres Freizeit, Hobby & Nachbarschaft'
            ];
            return {
              ...cat,
              name: getCategoryTranslation('Freizeit, Hobby & Nachbarschaft'),
              subcategories: subs.map(s => ({ name: getCategoryTranslation(s) })).sort((a, b) => a.name.localeCompare(b.name))
            };
          }

          if (cat.name === 'Emlak' || cat.name === 'Immobilien') {
            const subs = [
              'Auf Zeit & WG', 'Container', 'Eigentumswohnungen', 'Ferien- & Auslandsimmobilien',
              'Garagen & Stellplätze', 'Gewerbeimmobilien', 'Grundstücke & Gärten',
              'Häuser zum Kauf', 'Häuser zur Miete', 'Mietwohnungen', 'Neubauprojekte',
              'Umzug & Transport', 'Weitere Immobilien', 'Satılık Yazlık'
            ];
            return {
              ...cat,
              name: getCategoryTranslation('Immobilien'),
              subcategories: subs.map(s => ({ name: getCategoryTranslation(s) })).sort((a, b) => a.name.localeCompare(b.name))
            };
          }

          if (cat.name === 'Aile, Çocuk & Bebek' || cat.name === 'Familie, Kind & Baby') {
            const subs = [
              'Altenpflege', 'Baby- & Kinderkleidung', 'Baby- & Kinderschuhe',
              'Baby-Ausstattung', 'Babyschalen & Kindersitze', 'Babysitter/-in & Kinderbetreuung',
              'Kinderwagen & Buggys', 'Kinderzimmermöbel', 'Spielzeug',
              'Weiteres Familie, Kind & Baby'
            ];
            return {
              ...cat,
              name: getCategoryTranslation('Familie, Kind & Baby'),
              subcategories: subs.map(s => ({ name: getCategoryTranslation(s) })).sort((a, b) => a.name.localeCompare(b.name))
            };
          }

          if (cat.name === 'Evcil Hayvanlar' || cat.name === 'Haustiere') {
            const subs = [
              'Fische', 'Hunde', 'Katzen', 'Kleintiere', 'Nutztiere', 'Pferde',
              'Tierbetreuung & Training', 'Vermisste Tiere', 'Vögel', 'Zubehör'
            ];
            return {
              ...cat,
              name: getCategoryTranslation('Haustiere'),
              subcategories: subs.map(s => ({ name: getCategoryTranslation(s) })).sort((a, b) => a.name.localeCompare(b.name))
            };
          }

          if (cat.name === 'Moda & Güzellik' || cat.name === 'Mode & Beauty') {
            const subs = [
              'Beauty & Gesundheit', 'Damenbekleidung', 'Damenschuhe', 'Herrenbekleidung',
              'Herrenschuhe', 'Taschen & Accessoires', 'Uhren & Schmuck', 'Weiteres Mode & Beauty'
            ];
            return {
              ...cat,
              name: getCategoryTranslation('Mode & Beauty'),
              subcategories: subs.map(s => ({ name: getCategoryTranslation(s) })).sort((a, b) => a.name.localeCompare(b.name))
            };
          }

          if (cat.name === 'Otomobil, Bisiklet & Tekne' || cat.name === 'Auto, Rad & Boot') {
            const subs = [
              'Autos', 'Autoteile & Reifen', 'Boote & Bootszubehör', 'Fahrräder & Zubehör',
              'Motorräder & Motorroller', 'Motorradteile & Zubehör', 'Nutzfahrzeuge & Anhänger',
              'Reparaturen & Dienstleistungen', 'Wohnwagen & Wohnmobile', 'Weiteres Auto, Rad & Boot'
            ];
            return {
              ...cat,
              name: getCategoryTranslation('Auto, Rad & Boot'),
              subcategories: subs.map(s => ({ name: getCategoryTranslation(s) })).sort((a, b) => a.name.localeCompare(b.name))
            };
          }

          return cat;
        }) : [];

        // Ensure manual categories exist in the list
        if (!updatedData.find(cat => cat.name === getCategoryTranslation('Nachbarschaftshilfe'))) {
          updatedData.push({
            id: 'nh-manual',
            name: getCategoryTranslation('Nachbarschaftshilfe'),
            subcategories: [{ name: getCategoryTranslation('Nachbarschaftshilfe') }]
          });
        }

        if (!updatedData.find(cat => cat.name === getCategoryTranslation('Unterricht & Kurse'))) {
          const subs = [
            'Computerkurse', 'Kochen & Backen', 'Kunst & Gestaltung', 'Musik & Gesang',
            'Nachhilfe', 'Sportkurse', 'Sprachkurse', 'Tanzkurse', 'Weiterbildung', 'Weitere Unterricht & Kurse'
          ];
          updatedData.push({
            id: 'uk-manual',
            name: getCategoryTranslation('Unterricht & Kurse'),
            subcategories: subs.map(s => ({ name: getCategoryTranslation(s) })).sort((a, b) => a.name.localeCompare(b.name))
          });
        }

        if (!updatedData.find(cat => cat.name === getCategoryTranslation('Eintrittskarten & Tickets'))) {
          const subs = [
            'Bahn & ÖPNV', 'Comedy & Kabarett', 'Gutscheine', 'Kinder', 'Konzerte',
            'Sport', 'Theater & Musical', 'Weitere Eintrittskarten & Tickets'
          ];
          updatedData.push({
            id: 'et-manual',
            name: getCategoryTranslation('Eintrittskarten & Tickets'),
            subcategories: subs.map(s => ({ name: getCategoryTranslation(s) })).sort((a, b) => a.name.localeCompare(b.name))
          });
        }

        setCategories(updatedData);
      } catch (error) {
        console.error('Error loading categories:', error);
      }
    };

    loadCategories();
  }, []);

  // Check for account type and load profile data - Mandatory before listing
  useEffect(() => {
    const checkAccountType = async () => {
      if (!user) return;
      try {
        const { fetchUserProfile } = await import('./api/profile');
        const profile = await fetchUserProfile(user.id);

        // If seller_type is missing, redirect to settings
        if (!profile?.seller_type) {
          alert(t.addListing.selectAccountType);
          navigate('/settings');
          return;
        }

        // Auto-fill form fields with user's profile data
        if (profile.full_name) {
          setContactName(profile.full_name);
        }
        if (profile.phone) {
          setPhoneNumber(profile.phone);
        }
        if (profile.city && !city) {
          setCity(profile.city);
        }
        // Postal code removed from UI requirements
        /* if (profile.postal_code && !postalCode) {
          setPostalCode(profile.postal_code);
        } */
        if (profile.street && !address) {
          setAddress(profile.street);
        }

        // Auto-fill legal info from profile if available
        if (profile.legal_info) {
          setLegalInfo(profile.legal_info);
        }

        // Set seller type
        if (profile.seller_type) {
          setSellerType(profile.seller_type);
        }
      } catch (error) {
        console.error('Error checking account type:', error);
      }
    };

    checkAccountType();
  }, [user, navigate]);

  // Update subcategories when category changes
  useEffect(() => {
    if (category && categories.length > 0) {
      const selectedCat = categories.find(cat => cat.name === category);
      if (selectedCat) {
        setAvailableSubcategories(selectedCat.subcategories || []);
      } else {
        setAvailableSubcategories([]);
      }
    } else {
      setAvailableSubcategories([]);
    }
  }, [category, categories]);

  // Load listing data if in edit mode
  useEffect(() => {
    const loadListingForEdit = async () => {
      if (!editId) return;

      setLoading(true);
      setIsEditMode(true);

      try {
        const { supabase } = await import('./lib/supabase');
        const { data, error } = await supabase
          .from('listings')
          .select('*')
          .eq('id', editId)
          .single();

        if (error) throw error;

        if (data) {
          console.log('📝 Loaded listing data for edit:', data);
          console.log('Versand field:', data.versand_art, data.versand, data.shipping);

          // Populate form fields with existing data
          setTitle(data.title || '');
          setCategory(data.category || '');
          setSubCategory(data.sub_category || '');
          setCondition(data.condition || 'used');
          setPrice(data.price_type === 'giveaway' ? t.addListing.options.givingAway : (data.price?.toString() || ''));
          setPriceType(data.price_type || 'fixed');
          setDescription(data.description || '');
          // Postal code fallback or ignore
          setCity(data.city || '');
          setDistrict(data.district || '');
          setRegion(data.region || '');
          setAddress(data.address || '');

          // Use specific contact fields if they exist in the listing
          if (data.contact_name) setContactName(data.contact_name);
          if (data.contact_phone) setPhoneNumber(data.contact_phone);

          // Default visibility to true for legacy listings (where they are null)
          setShowPhoneNumber(data.show_phone_number !== false);
          setShowLocation(data.show_location !== false);

          // Load category-specific fields
          if (data.car_brand) setSelectedCarBrand(data.car_brand);
          if (data.car_model) setSelectedCarModel(data.car_model);
          if (data.bike_type) setSelectedBikeType(data.bike_type);
          if (data.bike_art) setSelectedBikeArt(data.bike_art);
          if (data.autoteile_art) setSelectedAutoteileArt(data.autoteile_art);
          if (data.autoteile_angebotstyp) setSelectedAutoteileAngebotstyp(data.autoteile_angebotstyp);
          // Load versand_art only if it exists (no default value to prevent accidental overwrites)
          if (data.versand_art) setSelectedVersand(data.versand_art);
          if (data.boote_art) setSelectedBooteArt(data.boote_art);
          if (data.motorrad_art) setSelectedMotorradArt(data.motorrad_art);
          if (data.motorradteile_art) setSelectedMotorradteileArt(data.motorradteile_art);
          if (data.nutzfahrzeuge_art) setSelectedNutzfahrzeugeArt(data.nutzfahrzeuge_art);
          if (data.wohnwagen_art) setSelectedWohnwagenArt(data.wohnwagen_art);
          if (data.gartenzubehoer_art) setSelectedGartenzubehoerArt(data.gartenzubehoer_art);
          if (data.gartenzubehoer_art) setSelectedGartenzubehoerArt(data.gartenzubehoer_art);
          if (data.dienstleistungen_haus_garten_art) setSelectedDienstleistungenHausGartenArt(data.dienstleistungen_haus_garten_art);
          if (data.dekoration_art) setSelectedDekorationArt(data.dekoration_art);
          if (data.buecher_zeitschriften_art) setSelectedBuecherZeitschriftenArt(data.buecher_zeitschriften_art);
          if (data.sammeln_art) setSelectedSammelnArt(data.sammeln_art);
          if (data.sport_camping_art) setSelectedSportCampingArt(data.sport_camping_art);
          if (data.modellbau_art) setSelectedModellbauArt(data.modellbau_art);
          if (data.handarbeit_art) setSelectedHandarbeitArt(data.handarbeit_art);
          if (data.kuenstler_musiker_art) setSelectedKuenstlerMusikerArt(data.kuenstler_musiker_art);
          if (data.reise_eventservices_art) setSelectedReiseEventservicesArt(data.reise_eventservices_art);
          if (data.tierbetreuung_training_art) setSelectedTierbetreuungTrainingArt(data.tierbetreuung_training_art);
          if (data.bau_handwerk_produktion_art) setSelectedBauHandwerkProduktionArt(data.bau_handwerk_produktion_art);
          if (data.buero_arbeit_verwaltung_art) setSelectedBueroArbeitVerwaltungArt(data.buero_arbeit_verwaltung_art);
          if (data.gastronomie_tourismus_art) setSelectedGastronomieTourismusArt(data.gastronomie_tourismus_art);
          if (data.sozialer_sektor_pflege_art) setSelectedSozialerSektorPflegeArt(data.sozialer_sektor_pflege_art);
          if (data.transport_logistik_verkehr_art) setSelectedTransportLogistikVerkehrArt(data.transport_logistik_verkehr_art);
          if (data.vertrieb_einkauf_verkauf_art) setSelectedVertriebEinkaufVerkaufArt(data.vertrieb_einkauf_verkauf_art);
          if (data.weitere_jobs_art) setSelectedWeitereJobsArt(data.weitere_jobs_art);
          if (data.taschen_accessoires_art) setSelectedTaschenAccessoiresArt(data.taschen_accessoires_art);
          if (data.uhren_schmuck_art) setSelectedUhrenSchmuckArt(data.uhren_schmuck_art);
          if (data.altenpflege_art) setSelectedAltenpflegeArt(data.altenpflege_art);
          if (data.sprachkurse_art) setSelectedSprachkurseArt(data.sprachkurse_art);
          if (data.kunst_gestaltung_art) setSelectedKunstGestaltungArt(data.kunst_gestaltung_art);
          if (data.weiteres_haus_garten_art) setSelectedWeiteresHausGartenArt(data.weiteres_haus_garten_art);
          if (data.beauty_gesundheit_art) setSelectedBeautyGesundheitArt(data.beauty_gesundheit_art);
          if (data.audio_hifi_art) setSelectedAudioHifiArt(data.audio_hifi_art);
          if (data.handy_telefon_art) setSelectedHandyTelefonArt(data.handy_telefon_art);
          if (data.foto_art) setSelectedFotoArt(data.foto_art);
          if (data.haushaltsgeraete_art) setSelectedHaushaltsgeraeteArt(data.haushaltsgeraete_art);
          if (data.konsolen_art) setSelectedKonsolenArt(data.konsolen_art);
          if (data.pc_zubehoer_software_art) setSelectedPCZubehoerSoftwareArt(data.pc_zubehoer_software_art);
          if (data.tablets_reader_art) setSelectedTabletsReaderArt(data.tablets_reader_art);
          if (data.tv_video_art) setSelectedTVVideoArt(data.tv_video_art);
          if (data.notebooks_art) setSelectedNotebooksArt(data.notebooks_art);
          if (data.pcs_art) setSelectedPCsArt(data.pcs_art);
          if (data.videospiele_art) setSelectedVideospieleArt(data.videospiele_art);
          if (data.weitere_elektronik_art) setSelectedWeitereElektronikArt(data.weitere_elektronik_art);
          if (data.dienstleistungen_elektronik_art) setSelectedDienstleistungenElektronikArt(data.dienstleistungen_elektronik_art);


          // Load Baby & Kinderkleidung fields
          if (data.baby_kinderkleidung_art) setBabyKinderkleidungArt(data.baby_kinderkleidung_art);
          if (data.baby_kinderkleidung_size) setBabyKinderkleidungSize(data.baby_kinderkleidung_size);
          if (data.baby_kinderkleidung_gender) setBabyKinderkleidungGender(data.baby_kinderkleidung_gender);
          if (data.baby_kinderkleidung_color) setBabyKinderkleidungColor(data.baby_kinderkleidung_color);
          if (data.baby_kinderschuhe_art) setBabyKinderschuheArt(data.baby_kinderschuhe_art);
          if (data.baby_kinderschuhe_size) setBabyKinderschuheSize(data.baby_kinderschuhe_size);

          // Load Damenbekleidung fields
          if (data.damenbekleidung_art) setDamenbekleidungArt(data.damenbekleidung_art);
          if (data.damenbekleidung_size) setDamenbekleidungSize(data.damenbekleidung_size);
          if (data.damenbekleidung_color) setDamenbekleidungColor(data.damenbekleidung_color);
          if (data.damenbekleidung_marke) setDamenbekleidungMarke(data.damenbekleidung_marke);

          // Load Damenschuhe fields
          if (data.damenschuhe_art) setDamenschuheArt(data.damenschuhe_art);
          if (data.damenschuhe_size) setDamenschuheSize(data.damenschuhe_size);
          if (data.damenschuhe_color) setDamenschuheColor(data.damenschuhe_color);
          if (data.damenschuhe_marke) setDamenschuheMarke(data.damenschuhe_marke);

          // Load Herrenbekleidung fields
          if (data.herrenbekleidung_art) setHerrenbekleidungArt(data.herrenbekleidung_art);
          if (data.herrenbekleidung_size) setHerrenbekleidungSize(data.herrenbekleidung_size);
          if (data.herrenbekleidung_color) setHerrenbekleidungColor(data.herrenbekleidung_color);
          if (data.herrenbekleidung_marke) setHerrenbekleidungMarke(data.herrenbekleidung_marke);

          // Load Herrenschuhe fields
          // Load Herrenschuhe fields
          if (data.herrenschuhe_art) setSelectedHerrenschuheArt(data.herrenschuhe_art);
          if (data.herrenschuhe_size) setSelectedHerrenschuheSize(data.herrenschuhe_size);
          if (data.herrenschuhe_color) setSelectedHerrenschuheColor(data.herrenschuhe_color);
          if (data.herrenschuhe_marke) setSelectedHerrenschuheMarke(data.herrenschuhe_marke);

          // Load Jobs fields
          if (data.working_time) setWorkingTime(data.working_time);
          if (data.hourly_wage) setHourlyWage(data.hourly_wage);
          if (data.job_type) setJobType(data.job_type);

          // Load common vehicle fields
          if (data.marke) setMarke(data.marke);
          if (data.kilometerstand) setKilometerstand(data.kilometerstand);
          if (data.erstzulassung) setErstzulassung(data.erstzulassung);
          if (data.hubraum) setHubraum(data.hubraum);
          if (data.getriebe) setGetriebe(data.getriebe);
          if (data.leistung) setLeistung(data.leistung);
          if (data.kraftstoff) setKraftstoff(data.kraftstoff);

          // Load Immobilien & Auf Zeit & WG fields
          if (data.auf_zeit_wg_art) setSelectedAufZeitWGArt(data.auf_zeit_wg_art);
          if (data.rental_type) setSelectedRentalType(data.rental_type);
          if (data.living_space) setLivingSpace(data.living_space.toString());
          if (data.rooms) setRooms(data.rooms.toString());
          if (data.roommates) setRoommates(data.roommates.toString());
          if (data.available_from) setAvailableFrom(data.available_from);
          if (data.online_viewing) setSelectedOnlineViewing(data.online_viewing);
          if (data.warm_rent) setWarmRent(data.warm_rent.toString());
          if (data.amenities) setSelectedAmenities(Array.isArray(data.amenities) ? data.amenities : []);
          if (data.general_features) setSelectedGeneralFeatures(Array.isArray(data.general_features) ? data.general_features : []);
          if (data.wohnungstyp) setSelectedWohnungstyp(data.wohnungstyp);
          if (data.haustyp) setSelectedHaustyp(data.haustyp);
          if (data.grundstuecksart) setSelectedGrundstuecksart(data.grundstuecksart);
          if (data.objektart) setSelectedObjektart(data.objektart);
          if (data.garage_type) setSelectedGarageType(data.garage_type);
          if (data.floor) setFloor(data.floor.toString());
          if (data.construction_year) setConstructionYear(data.construction_year.toString());
          if (data.plot_area) setPlotArea(data.plot_area.toString());
          if (data.commission) setSelectedCommission(data.commission);
          if (data.lage) setSelectedLage(data.lage);
          if (data.price_per_sqm) setPricePerSqm(data.price_per_sqm.toString());
          if (data.apartment_features) setSelectedApartmentFeatures(Array.isArray(data.apartment_features) ? data.apartment_features : []);
          if (data.house_features) setSelectedHouseFeatures(Array.isArray(data.house_features) ? data.house_features : []);
          if (data.angebotsart) setSelectedAngebotsart(data.angebotsart);
          if (data.tauschangebot) setSelectedTauschangebot(data.tauschangebot);

          // Load images if available
          if (data.images && data.images.length > 0) {
            setImageFiles(data.images);
          }
        }
      } catch (error) {
        console.error('Error loading listing:', error);
        alert(t.addListing.errorLoading);
      } finally {
        setLoading(false);
      }
    };

    loadListingForEdit();
  }, [editId]);

  // Removed postal code change handler and federalState logic since postalCode is removed


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      alert(t.addListing.pleaseLogin);
      navigate('/login');
      return;
    }

    if (!limitState.canAdd && !isEditMode) {
      setShowLimitModal(true);
      return;
    }

    localStorage.setItem('savedCity', city);
    localStorage.setItem('savedDistrict', district);
    localStorage.setItem('savedRegion', region);
    localStorage.setItem('savedAddress', address);
    localStorage.setItem('savedShowLocation', showLocation.toString());

    try {
      setLoading(true);

      // Upload new files and preserve order
      const newFiles = imageFiles.filter(img => typeof img !== 'string');
      let uploadedUrls = [];

      if (newFiles.length > 0) {
        const { uploadListingImages } = await import('./api/images');
        uploadedUrls = await uploadListingImages(user.id, newFiles);
      }

      let uploadedIdx = 0;
      const imageUrls = imageFiles.map(file => {
        if (typeof file === 'string') return file;
        return uploadedUrls[uploadedIdx++];
      });

      const unformatPrice = (val) => {
        if (!val) return '';
        return val.toString().replace(/\./g, '').replace(',', '.');
      };

      const cleanedPrice = unformatPrice(price);
      const listingData = {
        user_id: user.id,
        title: title.trim(),
        description: description.trim(),
        price: priceType === 'giveaway' ? 0 : (priceType === 'negotiable' && !price ? null : (parseFloat(cleanedPrice) || 0)),
        price_type: priceType,
        category: category.trim(),
        sub_category: subCategory ? subCategory.trim() : null,
        condition: hideConditionAndShipping ? null : condition,
        city: city.trim(),
        district: district ? district.trim() : null,
        address: address ? address.trim() : null,
        region: region ? region.trim() : null,
        federal_state: city.trim(),
        show_location: showLocation,
        show_phone_number: showPhoneNumber,
        contact_name: contactName ? contactName.trim() : null,
        contact_phone: phoneNumber ? phoneNumber.trim() : null,
        images: imageUrls,
        status: 'active',
        versand_art: hideConditionAndShipping ? null : (selectedVersand || null),
        car_brand: selectedCarBrand || null,
        car_model: selectedCarModel || null,
        bike_type: selectedBikeType || null,
        bike_art: selectedBikeArt || null,
        autoteile_art: selectedAutoteileArt || null,
        autoteile_angebotstyp: selectedAutoteileAngebotstyp || null,
        offer_type: offerType || null,
        boote_art: selectedBooteArt || null,
        motorrad_art: selectedMotorradArt || null,
        motorradteile_art: selectedMotorradteileArt || null,
        nutzfahrzeuge_art: selectedNutzfahrzeugeArt || null,
        wohnwagen_art: selectedWohnwagenArt || null,
        wohnzimmer_art: selectedWohnzimmerArt || null,
        schlafzimmer_art: selectedSchlafzimmerArt || null,
        kueche_esszimmer_art: selectedKuecheEsszimmerArt || null,
        gartenzubehoer_art: selectedGartenzubehoerArt || null,
        lamba_aydinlatma_art: selectedLambaAydinlatmaArt || null,
        dekoration_art: selectedDekorationArt || null,
        dienstleistungen_haus_garten_art: selectedDienstleistungenHausGartenArt || null,
        buecher_zeitschriften_art: selectedBuecherZeitschriftenArt || null,
        sammeln_art: selectedSammelnArt || null,
        audio_hifi_art: selectedAudioHifiArt || selectedElektronikAudioHifiArt || null,
        sport_camping_art: selectedSportCampingArt || null,
        modellbau_art: selectedModellbauArt || null,
        handarbeit_art: selectedHandarbeitArt || null,
        kuenstler_musiker_art: selectedKuenstlerMusikerArt || null,
        reise_eventservices_art: selectedReiseEventservicesArt || null,
        tierbetreuung_training_art: selectedTierbetreuungTrainingArt || null,
        bau_handwerk_produktion_art: selectedBauHandwerkProduktionArt || null,
        buero_arbeit_verwaltung_art: selectedBueroArbeitVerwaltungArt || null,
        gastronomie_tourismus_art: selectedGastronomieTourismusArt || null,
        sozialer_sektor_pflege_art: selectedSozialerSektorPflegeArt || null,
        transport_logistik_verkehr_art: selectedTransportLogistikVerkehrArt || null,
        vertrieb_einkauf_verkauf_art: selectedVertriebEinkaufVerkaufArt || null,
        weitere_jobs_art: selectedWeitereJobsArt || null,
        altenpflege_art: selectedAltenpflegeArt || null,
        sprachkurse_art: selectedSprachkurseArt || null,
        kunst_gestaltung_art: selectedKunstGestaltungArt || null,
        weiteres_haus_garten_art: selectedWeiteresHausGartenArt || null,
        baby_kinderkleidung_art: babyKinderkleidungArt || null,
        baby_kinderkleidung_size: babyKinderkleidungSize || null,
        baby_kinderkleidung_gender: babyKinderkleidungGender || null,
        baby_kinderkleidung_color: babyKinderkleidungColor || null,
        baby_kinderschuhe_art: babyKinderschuheArt || null,
        baby_kinderschuhe_size: babyKinderschuheSize || null,
        baby_kinderschuhe_color: babyKinderschuheColor || null,
        babyschalen_kindersitze_color: babyschalenKindersitzeColor || null,
        kinderwagen_buggys_color: kinderwagenBuggysColor || null,
        kinderwagen_buggys_art: kinderwagenBuggysArt || null,
        damenbekleidung_art: selectedDamenbekleidungArt || null,
        damenbekleidung_size: selectedDamenbekleidungSize || null,
        damenbekleidung_color: selectedDamenbekleidungColor || null,
        damenbekleidung_marke: selectedDamenbekleidungMarke || null,
        damenschuhe_art: damenschuheArt || null,
        damenschuhe_size: damenschuheSize || null,
        damenschuhe_color: damenschuheColor || null,
        damenschuhe_marke: damenschuheMarke || null,
        herrenbekleidung_art: herrenbekleidungArt || null,
        herrenbekleidung_size: herrenbekleidungSize || null,
        herrenbekleidung_color: herrenbekleidungColor || null,
        herrenbekleidung_marke: herrenbekleidungMarke || null,
        herrenschuhe_art: selectedHerrenschuheArt || null,
        herrenschuhe_size: selectedHerrenschuheSize || null,
        herrenschuhe_color: selectedHerrenschuheColor || null,
        herrenschuhe_marke: selectedHerrenschuheMarke || null,
        kinderzimmermobel_art: selectedKinderzimmermobelArt || null,
        spielzeug_art: selectedSpielzeugArt || null,
        fische_art: selectedFischeArt || null,
        hunde_art: selectedHundeArt || null,
        hunde_alter: selectedHundeAlter || null,
        hunde_geimpft: selectedHundeGeimpft || null,
        hunde_erlaubnis: selectedHundeErlaubnis || null,
        katzen_art: selectedKatzenArt || null,
        katzen_alter: selectedKatzenAlter || null,
        katzen_geimpft: selectedKatzenGeimpft || null,
        katzen_erlaubnis: selectedKatzenErlaubnis || null,
        kleintiere_art: selectedKleintiereArt || null,
        nutztiere_art: selectedNutztiereArt || null,
        pferde_art: selectedPferdeArt || null,
        haustier_zubehoer_art: selectedHaustierZubehoerArt || null,
        voegel_art: selectedVoegelArt || null,
        taschen_accessoires_art: selectedTaschenAccessoiresArt || null,
        uhren_schmuck_art: selectedUhrenSchmuckArt || null,
        beauty_gesundheit_art: selectedBeautyGesundheitArt || null,
        handy_telefon_art: selectedHandyTelefonArt || null,
        foto_art: selectedFotoArt || null,
        haushaltsgeraete_art: selectedHaushaltsgeraeteArt || null,
        konsolen_art: selectedKonsolenArt || null,
        pc_zubehoer_software_art: selectedPCZubehoerSoftwareArt || null,
        tablets_reader_art: selectedTabletsReaderArt || null,
        tv_video_art: selectedTVVideoArt || null,
        notebooks_art: selectedNotebooksArt || null,
        pcs_art: selectedPCsArt || null,
        videospiele_art: selectedVideospieleArt || null,
        weitere_elektronik_art: selectedWeitereElektronikArt || null,
        dienstleistungen_elektronik_art: selectedDienstleistungenElektronikArt || null,
        auf_zeit_wg_art: selectedAufZeitWGArt || null,
        rental_type: selectedRentalType || null,
        living_space: livingSpace ? parseFloat(livingSpace) : null,
        rooms: rooms ? parseFloat(rooms) : null,
        roommates: roommates ? parseInt(roommates) : null,
        available_from: availableFrom || null,
        online_viewing: selectedOnlineViewing || null,
        warm_rent: warmRent ? parseFloat(warmRent) : null,
        amenities: selectedAmenities.length > 0 ? selectedAmenities : null,
        general_features: selectedGeneralFeatures.length > 0 ? selectedGeneralFeatures : null,
        wohnungstyp: selectedWohnungstyp || null,
        haustyp: selectedHaustyp || null,
        grundstuecksart: selectedGrundstuecksart || null,
        objektart: selectedObjektart || null,
        garage_type: selectedGarageType || null,
        floor: floor ? parseInt(floor) : null,
        construction_year: constructionYear ? parseInt(constructionYear) : null,
        plot_area: plotArea ? parseFloat(plotArea) : null,
        commission: selectedCommission || null,
        lage: selectedLage || null,
        price_per_sqm: pricePerSqm ? parseFloat(pricePerSqm) : null,
        apartment_features: selectedApartmentFeatures.length > 0 ? selectedApartmentFeatures : null,
        house_features: selectedHouseFeatures.length > 0 ? selectedHouseFeatures : null,
        angebotsart: selectedAngebotsart || null,
        tauschangebot: selectedTauschangebot || null,
        working_time: workingTime || null,
        hourly_wage: hourlyWage ? parseFloat(hourlyWage) : null,
        job_type: jobType || null,
        marke: selectedCarBrand || marke || null,
        modell: selectedCarModel || null,
        kilometerstand: kilometerstand ? parseInt(kilometerstand.toString().replace(/\D/g, '')) : null,
        erstzulassung: erstzulassung ? parseInt(erstzulassung) : null,
        hubraum: hubraum ? parseInt(hubraum.toString().replace(/\D/g, '')) : null,
        getriebe: getriebe || null,
        leistung: leistung ? parseInt(leistung.toString().replace(/\D/g, '')) : null,
        power: leistung ? parseInt(leistung.toString().replace(/\D/g, '')) : null,
        kraftstoff: kraftstoff || null,
        fuel_type: kraftstoff || null,
        fahrzeugtyp: selectedFahrzeugtyp || null,
        vehicle_type: selectedFahrzeugtyp || null,
        door_count: selectedDoorCount || null,
        exterior_color: selectedExteriorColor || null,
        interior_material: selectedInteriorMaterial || null,
        emission_badge: selectedEmissionBadge || null,
        emission_sticker: selectedEmissionBadge || null,
        schadstoffklasse: selectedSchadstoffklasse || null,
        emission_class: selectedSchadstoffklasse || null,
        hu: selectedHU || null,
        unfallfrei: isUnfallfrei,
        scheckheftgepflegt: isScheckheftgepflegt,
        nichtraucher_fahrzeug: isNichtraucher,
        car_amenities: selectedCarAmenities.length > 0 ? selectedCarAmenities : null,
        seller_type: sellerType || null
      };

      if (isEditMode && editId) {
        const { supabase } = await import('./lib/supabase');
        const { error } = await supabase.from('listings').update(listingData).eq('id', editId);
        if (error) throw error;
        alert(t.addListing.updateSuccess);
      } else {
        const { createListing } = await import('./api/listings');
        await createListing(listingData);
        alert(t.addListing.success);
      }

      navigate('/profile?tab=listings');
    } catch (error) {
      console.error('Error submitting listing:', error);
      alert(t.addListing.errorSaving + (error.message ? ': ' + error.message : ''));
    } finally {
      setLoading(false);
    }
  };

  const handleImageSelect = (event) => {
    const newFiles = Array.from(event.target.files || []);
    const currentTotal = imageFiles.length;
    const availableSlots = 20 - currentTotal;

    if (newFiles.length > availableSlots) {
      alert(t.addListing.imageLimitAlert.replace('{available}', availableSlots.toString()));
    }

    // Add new files at the END (keep first image first)
    const filesToAdd = newFiles.slice(0, availableSlots);
    setImageFiles([...imageFiles, ...filesToAdd]);

    // Reset input so same file can be selected again if needed
    event.target.value = '';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-2xl font-semibold mb-6">{isEditMode ? t.addListing.editTitle : t.addListing.title}</h1>
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm text-gray-600 mb-1">{t.addListing.offerType}</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-gray-700 cursor-pointer">
                  <input
                    type="radio"
                    name="offerType"
                    value="Angebote"
                    checked={offerType === 'Angebote'}
                    onChange={() => setOfferType('Angebote')}
                    className="text-red-600 focus:ring-red-500"
                  />
                  {t.addListing.offering}
                </label>
                <label className="flex items-center gap-2 text-gray-700 cursor-pointer">
                  <input
                    type="radio"
                    name="offerType"
                    value="Gesuche"
                    checked={offerType === 'Gesuche'}
                    onChange={() => setOfferType('Gesuche')}
                    className="text-red-600 focus:ring-red-500"
                  />
                  {t.addListing.searching}
                </label>
              </div>
            </div>


            <div>
              <label className="block text-sm text-gray-600 mb-1">{t.addListing.listingTitle}</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-300"
                placeholder={t.addListing.listingTitlePlaceholder}
              />
            </div>
            <div className="grid gap-4 lg:grid-cols-2">
              <div>
                <label className="block text-sm text-gray-600 mb-1">{t.addListing.category}</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-300 bg-white text-gray-700"
                >
                  <option value="">{t.addListing.selectCategory}</option>
                  {categories.map((cat) => (
                    <option key={cat.name} value={cat.name}>{getCategoryTranslation(cat.name)}</option>
                  ))}
                </select>
              </div>

              {/* Sub-Category Selection */}
              {category && categories.find(c => c.name === category)?.subcategories && (
                <div>
                  <label className="block text-sm text-gray-600 mb-1">{t.addListing.subcategory}</label>
                  <select
                    value={subCategory}
                    onChange={(e) => {
                      const newSubCategory = e.target.value;
                      setSubCategory(newSubCategory);

                      // Auto-set Art for specific real estate subcategories
                      if (newSubCategory === 'Satılık Müstakil Ev') {
                        setSelectedAngebotsart('Kaufen');
                      } else if (newSubCategory === 'Kiralık Müstakil Ev') {
                        setSelectedAngebotsart('Mieten');
                      } else if (newSubCategory === 'Kiralık Daire') {
                        setSelectedAngebotsart('Mieten');
                      } else if (newSubCategory === 'Satılık Daire') {
                        setSelectedAngebotsart('Kaufen');
                      } else if (newSubCategory === 'Satılık Yazlık') {
                        setSelectedAngebotsart('Kaufen');
                      }

                      setSelectedAutoteileArt(''); // Reset Art when subcategory changes
                      setSelectedKuecheEsszimmerArt('');
                      setSelectedGartenzubehoerArt('');
                      setSelectedKuecheEsszimmerArt('');
                      setSelectedKuecheEsszimmerArt('');
                      setSelectedGartenzubehoerArt('');
                      setSelectedGartenzubehoerArt('');
                      setSelectedSammelnArt('');
                      setSelectedModellbauArt('');
                      setSelectedHandarbeitArt('');
                      setSelectedKuenstlerMusikerArt('');
                      setSelectedReiseEventservicesArt('');
                      setSelectedReiseEventservicesArt('');
                      setSelectedTierbetreuungTrainingArt('');
                      setSelectedBauHandwerkProduktionArt('');
                      setSelectedSportCampingArt('');
                      setSelectedDekorationArt('');
                      setSelectedDienstleistungenHausGartenArt('');
                      setSelectedBuecherZeitschriftenArt('');
                      setDamenbekleidungArt('');
                      setDamenbekleidungSize('');
                      setDamenbekleidungColor('');
                      setDamenbekleidungMarke('');
                      setDamenschuheArt('');
                      setDamenschuheSize('');
                      setDamenschuheColor('');
                      setDamenschuheMarke('');
                      setHerrenbekleidungArt('');
                      setHerrenbekleidungSize('');
                      setHerrenbekleidungColor('');
                      setHerrenbekleidungMarke('');
                      setSelectedHerrenschuheArt('');
                      setSelectedHerrenschuheSize('');
                      setSelectedHerrenschuheColor('');
                      setSelectedHerrenschuheMarke('');
                      setSelectedBueroArbeitVerwaltungArt('');
                      setSelectedGastronomieTourismusArt('');
                      setSelectedTransportLogistikVerkehrArt('');
                      setSelectedVertriebEinkaufVerkaufArt('');
                      setSelectedTransportLogistikVerkehrArt('');
                      setSelectedVertriebEinkaufVerkaufArt('');
                      setSelectedWeitereJobsArt('');
                      setSelectedTaschenAccessoiresArt('');
                      setSelectedUhrenSchmuckArt('');
                      setSelectedAltenpflegeArt('');
                      setSelectedSprachkurseArt('');
                      setSelectedKunstGestaltungArt('');
                      setSelectedWeiteresHausGartenArt('');
                      setSelectedBeautyGesundheitArt('');
                      setSelectedAudioHifiArt('');
                      setSelectedHandyTelefonArt('');
                      setSelectedFotoArt('');
                      setSelectedHaushaltsgeraeteArt('');
                      setSelectedKonsolenArt('');
                      setSelectedPCZubehoerSoftwareArt('');
                      setSelectedTabletsReaderArt('');
                      setSelectedTVVideoArt('');

                      setBabyKinderkleidungArt('');
                      setBabyKinderkleidungSize('');
                      setBabyKinderkleidungGender('');
                      setBabyKinderkleidungColor('');
                      setBabyKinderschuheArt('');
                      setBabyKinderschuheSize('');
                      setSelectedAngebotsart('');
                    }}
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-300 bg-white text-gray-700"
                  >
                    <option value="">{t.addListing.selectSubcategory}</option>
                    {categories.find(c => c.name === category).subcategories.map((sub) => (
                      <option key={sub.name} value={sub.name}>{getCategoryTranslation(sub.name)}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Bike fields removed - moved to VehicleFields */}




            {/* Family, Child & Baby Specific Fields */}
            {category === 'Aile, Çocuk & Bebek' && (
              <FamilyFields
                subCategory={subCategory}
                t={t}
                babyKinderkleidungArt={babyKinderkleidungArt}
                setBabyKinderkleidungArt={setBabyKinderkleidungArt}
                babyKinderkleidungSize={babyKinderkleidungSize}
                setBabyKinderkleidungSize={setBabyKinderkleidungSize}
                babyKinderkleidungGender={babyKinderkleidungGender}
                setBabyKinderkleidungGender={setBabyKinderkleidungGender}
                babyKinderkleidungColor={babyKinderkleidungColor}
                setBabyKinderkleidungColor={setBabyKinderkleidungColor}
                babyKinderschuheArt={babyKinderschuheArt}
                setBabyKinderschuheArt={setBabyKinderschuheArt}
                babyKinderschuheSize={babyKinderschuheSize}
                setBabyKinderschuheSize={setBabyKinderschuheSize}
                babyKinderschuheColor={babyKinderschuheColor}
                setBabyKinderschuheColor={setBabyKinderschuheColor}
                kinderwagenBuggysArt={kinderwagenBuggysArt}
                setKinderwagenBuggysArt={setKinderwagenBuggysArt}
                kinderwagenBuggysColor={kinderwagenBuggysColor}
                setKinderwagenBuggysColor={setKinderwagenBuggysColor}
                babyschalenKindersitzeColor={babyschalenKindersitzeColor}
                setBabyschalenKindersitzeColor={setBabyschalenKindersitzeColor}
                selectedKinderzimmermobelArt={selectedKinderzimmermobelArt}
                setSelectedKinderzimmermobelArt={setSelectedKinderzimmermobelArt}
                selectedSpielzeugArt={selectedSpielzeugArt}
                setSelectedSpielzeugArt={setSelectedSpielzeugArt}
              />
            )}

            {/* Pet Specific Fields */}
            {category === 'Evcil Hayvanlar' && (
              <PetFields
                subCategory={subCategory}
                t={t}
                selectedFischeArt={selectedFischeArt}
                setSelectedFischeArt={setSelectedFischeArt}
                selectedHundeArt={selectedHundeArt}
                setSelectedHundeArt={setSelectedHundeArt}
                selectedHundeAlter={selectedHundeAlter}
                setSelectedHundeAlter={setSelectedHundeAlter}
                selectedHundeGeimpft={selectedHundeGeimpft}
                setSelectedHundeGeimpft={setSelectedHundeGeimpft}
                selectedHundeErlaubnis={selectedHundeErlaubnis}
                setSelectedHundeErlaubnis={setSelectedHundeErlaubnis}
                selectedKatzenArt={selectedKatzenArt}
                setSelectedKatzenArt={setSelectedKatzenArt}
                selectedKatzenAlter={selectedKatzenAlter}
                setSelectedKatzenAlter={setSelectedKatzenAlter}
                selectedKatzenGeimpft={selectedKatzenGeimpft}
                setSelectedKatzenGeimpft={setSelectedKatzenGeimpft}
                selectedKatzenErlaubnis={selectedKatzenErlaubnis}
                setSelectedKatzenErlaubnis={setSelectedKatzenErlaubnis}
                selectedKleintiereArt={selectedKleintiereArt}
                setSelectedKleintiereArt={setSelectedKleintiereArt}
                selectedNutztiereArt={selectedNutztiereArt}
                setSelectedNutztiereArt={setSelectedNutztiereArt}
                selectedPferdeArt={selectedPferdeArt}
                setSelectedPferdeArt={setSelectedPferdeArt}
                selectedVermisstetiereStatus={selectedVermisstetiereStatus}
                setSelectedVermisstetiereStatus={setSelectedVermisstetiereStatus}
                selectedVoegelArt={selectedVoegelArt}
                setSelectedVoegelArt={setSelectedVoegelArt}
                selectedHaustierZubehoerArt={selectedHaustierZubehoerArt}
                setSelectedHaustierZubehoerArt={setSelectedHaustierZubehoerArt}
              />
            )}

            <FashionFields
              category={category}
              subCategory={subCategory}
              t={t}
              selectedBeautyGesundheitArt={selectedBeautyGesundheitArt}
              setSelectedBeautyGesundheitArt={setSelectedBeautyGesundheitArt}
              selectedDamenbekleidungArt={selectedDamenbekleidungArt}
              setSelectedDamenbekleidungArt={setSelectedDamenbekleidungArt}
              selectedDamenbekleidungMarke={selectedDamenbekleidungMarke}
              setSelectedDamenbekleidungMarke={setSelectedDamenbekleidungMarke}
              selectedDamenbekleidungSize={selectedDamenbekleidungSize}
              setSelectedDamenbekleidungSize={setSelectedDamenbekleidungSize}
              selectedDamenbekleidungColor={selectedDamenbekleidungColor}
              setSelectedDamenbekleidungColor={setSelectedDamenbekleidungColor}
              damenschuheArt={damenschuheArt}
              setDamenschuheArt={setDamenschuheArt}
              damenschuheMarke={damenschuheMarke}
              setDamenschuheMarke={setDamenschuheMarke}
              damenschuheSize={damenschuheSize}
              setDamenschuheSize={setDamenschuheSize}
              damenschuheColor={damenschuheColor}
              setDamenschuheColor={setDamenschuheColor}
              herrenbekleidungArt={herrenbekleidungArt}
              setHerrenbekleidungArt={setHerrenbekleidungArt}
              herrenbekleidungMarke={herrenbekleidungMarke}
              setHerrenbekleidungMarke={setHerrenbekleidungMarke}
              herrenbekleidungSize={herrenbekleidungSize}
              setHerrenbekleidungSize={setHerrenbekleidungSize}
              herrenbekleidungColor={herrenbekleidungColor}
              setHerrenbekleidungColor={setHerrenbekleidungColor}
              damenbekleidungArt={damenbekleidungArt}
              setDamenbekleidungArt={setDamenbekleidungArt}
              damenbekleidungMarke={damenbekleidungMarke}
              setDamenbekleidungMarke={setDamenbekleidungMarke}
              damenbekleidungSize={damenbekleidungSize}
              setDamenbekleidungSize={setDamenbekleidungSize}
              damenbekleidungColor={damenbekleidungColor}
              setDamenbekleidungColor={setDamenbekleidungColor}
              selectedHerrenschuheArt={selectedHerrenschuheArt}
              setSelectedHerrenschuheArt={setSelectedHerrenschuheArt}
              selectedHerrenschuheMarke={selectedHerrenschuheMarke}
              setSelectedHerrenschuheMarke={setSelectedHerrenschuheMarke}
              selectedHerrenschuheSize={selectedHerrenschuheSize}
              setSelectedHerrenschuheSize={setSelectedHerrenschuheSize}
              selectedHerrenschuheColor={selectedHerrenschuheColor}
              setSelectedHerrenschuheColor={setSelectedHerrenschuheColor}
              selectedTaschenAccessoiresArt={selectedTaschenAccessoiresArt}
              setSelectedTaschenAccessoiresArt={setSelectedTaschenAccessoiresArt}
              selectedUhrenSchmuckArt={selectedUhrenSchmuckArt}
              setSelectedUhrenSchmuckArt={setSelectedUhrenSchmuckArt}
            />






            {/* Elektronik Specific Fields */}
            {category === 'Elektronik' && (
              <ElectronicFields
                subCategory={subCategory}
                t={t}
                selectedElektronikAudioHifiArt={selectedElektronikAudioHifiArt}
                setSelectedElektronikAudioHifiArt={setSelectedElektronikAudioHifiArt}
                selectedHandyTelefonArt={selectedHandyTelefonArt}
                setSelectedHandyTelefonArt={setSelectedHandyTelefonArt}
                selectedFotoArt={selectedFotoArt}
                setSelectedFotoArt={setSelectedFotoArt}
                selectedHaushaltsgeraeteArt={selectedHaushaltsgeraeteArt}
                setSelectedHaushaltsgeraeteArt={setSelectedHaushaltsgeraeteArt}
                selectedKonsolenArt={selectedKonsolenArt}
                setSelectedKonsolenArt={setSelectedKonsolenArt}
                selectedPCZubehoerSoftwareArt={selectedPCZubehoerSoftwareArt}
                setSelectedPCZubehoerSoftwareArt={setSelectedPCZubehoerSoftwareArt}
                selectedTabletsReaderArt={selectedTabletsReaderArt}
                setSelectedTabletsReaderArt={setSelectedTabletsReaderArt}
                selectedTVVideoArt={selectedTVVideoArt}
                setSelectedTVVideoArt={setSelectedTVVideoArt}
                selectedNotebooksArt={selectedNotebooksArt}
                setSelectedNotebooksArt={setSelectedNotebooksArt}
                selectedPCsArt={selectedPCsArt}
                setSelectedPCsArt={setSelectedPCsArt}
                selectedVideospieleArt={selectedVideospieleArt}
                setSelectedVideospieleArt={setSelectedVideospieleArt}
                selectedDienstleistungenElektronikArt={selectedDienstleistungenElektronikArt}
                setSelectedDienstleistungenElektronikArt={setSelectedDienstleistungenElektronikArt}
              />
            )}

            {category === 'Emlak' && (
              <RealEstateFields
                subCategory={subCategory}
                t={t}
                selectedObjektart={selectedObjektart}
                setSelectedObjektart={setSelectedObjektart}
                selectedGrundstuecksart={selectedGrundstuecksart}
                setSelectedGrundstuecksart={setSelectedGrundstuecksart}
                selectedWohnungstyp={selectedWohnungstyp}
                setSelectedWohnungstyp={setSelectedWohnungstyp}
                selectedHaustyp={selectedHaustyp}
                setSelectedHaustyp={setSelectedHaustyp}
                selectedAngebotsart={selectedAngebotsart}
                setSelectedAngebotsart={setSelectedAngebotsart}
                livingSpace={livingSpace}
                setLivingSpace={setLivingSpace}
                rooms={rooms}
                setRooms={setRooms}
                floor={floor}
                setFloor={setFloor}
                availableFrom={availableFrom}
                setAvailableFrom={setAvailableFrom}
                selectedOnlineViewing={selectedOnlineViewing}
                setSelectedOnlineViewing={setSelectedOnlineViewing}
                plotArea={plotArea}
                setPlotArea={setPlotArea}
                pricePerSqm={pricePerSqm}
                setPricePerSqm={setPricePerSqm}
                warmRent={warmRent}
                setWarmRent={setWarmRent}
                roommates={roommates}
                setRoommates={setRoommates}
                constructionYear={constructionYear}
                setConstructionYear={setConstructionYear}
                selectedTauschangebot={selectedTauschangebot}
                setSelectedTauschangebot={setSelectedTauschangebot}
                selectedCommission={selectedCommission}
                setSelectedCommission={setSelectedCommission}
                selectedGarageType={selectedGarageType}
                setSelectedGarageType={setSelectedGarageType}
                selectedAufZeitWGArt={selectedAufZeitWGArt}
                setSelectedAufZeitWGArt={setSelectedAufZeitWGArt}
                selectedRentalType={selectedRentalType}
                setSelectedRentalType={setSelectedRentalType}
                selectedLage={selectedLage}
                setSelectedLage={setSelectedLage}
                selectedAmenities={selectedAmenities}
                setSelectedAmenities={setSelectedAmenities}
                selectedGeneralFeatures={selectedGeneralFeatures}
                setSelectedGeneralFeatures={setSelectedGeneralFeatures}
              />
            )}









            {/* Job Specific Fields */}
            {isJobCategory && (
              <JobFields
                category={category}
                subCategory={subCategory}
                t={t}
                jobType={jobType}
                setJobType={setJobType}
                workingTime={workingTime}
                setWorkingTime={setWorkingTime}
                hourlyWage={hourlyWage}
                setHourlyWage={setHourlyWage}
                selectedSozialerSektorPflegeArt={selectedSozialerSektorPflegeArt}
                setSelectedSozialerSektorPflegeArt={setSelectedSozialerSektorPflegeArt}
                selectedBauHandwerkProduktionArt={selectedBauHandwerkProduktionArt}
                setSelectedBauHandwerkProduktionArt={setSelectedBauHandwerkProduktionArt}
                selectedBueroArbeitVerwaltungArt={selectedBueroArbeitVerwaltungArt}
                setSelectedBueroArbeitVerwaltungArt={setSelectedBueroArbeitVerwaltungArt}
                selectedGastronomieTourismusArt={selectedGastronomieTourismusArt}
                setSelectedGastronomieTourismusArt={setSelectedGastronomieTourismusArt}
                selectedTransportLogistikVerkehrArt={selectedTransportLogistikVerkehrArt}
                setSelectedTransportLogistikVerkehrArt={setSelectedTransportLogistikVerkehrArt}
                selectedVertriebEinkaufVerkaufArt={selectedVertriebEinkaufVerkaufArt}
                setSelectedVertriebEinkaufVerkaufArt={setSelectedVertriebEinkaufVerkaufArt}
                selectedWeitereJobsArt={selectedWeitereJobsArt}
                setSelectedWeitereJobsArt={setSelectedWeitereJobsArt}
              />
            )}



            {/* Art Selection for Ev & Bahçe */}
            {(category === 'Ev & Bahçe' || category === 'Hizmetler') && (
              <HomeGardenFields
                subCategory={subCategory}
                category={category}
                t={t}
                selectedSchlafzimmerArt={selectedSchlafzimmerArt}
                setSelectedSchlafzimmerArt={setSelectedSchlafzimmerArt}
                selectedKuecheEsszimmerArt={selectedKuecheEsszimmerArt}
                setSelectedKuecheEsszimmerArt={setSelectedKuecheEsszimmerArt}
                selectedGartenzubehoerArt={selectedGartenzubehoerArt}
                setSelectedGartenzubehoerArt={setSelectedGartenzubehoerArt}
                selectedLambaAydinlatmaArt={selectedLambaAydinlatmaArt}
                setSelectedLambaAydinlatmaArt={setSelectedLambaAydinlatmaArt}
                selectedDekorationArt={selectedDekorationArt}
                setSelectedDekorationArt={setSelectedDekorationArt}
                selectedWohnzimmerArt={selectedWohnzimmerArt}
                setSelectedWohnzimmerArt={setSelectedWohnzimmerArt}
                selectedDienstleistungenHausGartenArt={selectedDienstleistungenHausGartenArt}
                setSelectedDienstleistungenHausGartenArt={setSelectedDienstleistungenHausGartenArt}
              />
            )}

            {/* Hobby & Entertainment Specific Fields */}
            {(category === 'Eğlence, Hobi & Mahalle' || (category && category.includes('Müzik, Film & Kitap'))) && (
              <HobbyFields
                subCategory={subCategory}
                category={category}
                t={t}
                selectedSammelnArt={selectedSammelnArt}
                setSelectedSammelnArt={setSelectedSammelnArt}
                selectedSportCampingArt={selectedSportCampingArt}
                setSelectedSportCampingArt={setSelectedSportCampingArt}
                selectedModellbauArt={selectedModellbauArt}
                setSelectedModellbauArt={setSelectedModellbauArt}
                selectedHandarbeitArt={selectedHandarbeitArt}
                setSelectedHandarbeitArt={setSelectedHandarbeitArt}
                selectedKuenstlerMusikerArt={selectedKuenstlerMusikerArt}
                setSelectedKuenstlerMusikerArt={setSelectedKuenstlerMusikerArt}
                selectedReiseEventservicesArt={selectedReiseEventservicesArt}
                setSelectedReiseEventservicesArt={setSelectedReiseEventservicesArt}
                selectedBuecherZeitschriftenArt={selectedBuecherZeitschriftenArt}
                setSelectedBuecherZeitschriftenArt={setSelectedBuecherZeitschriftenArt}
              />
            )}

            {/* Service & Pet Specific Fields */}
            {(category === 'Hizmetler' || category === 'Evcil Hayvan' || subCategory === 'Yaşlı Bakımı') && (
              <ServiceFields
                subCategory={subCategory}
                category={category}
                t={t}
                selectedTierbetreuungTrainingArt={selectedTierbetreuungTrainingArt}
                setSelectedTierbetreuungTrainingArt={setSelectedTierbetreuungTrainingArt}
                selectedAltenpflegeArt={selectedAltenpflegeArt}
                setSelectedAltenpflegeArt={setSelectedAltenpflegeArt}
              />
            )}

            {/* Added extra newline for safety during removal of previous code */}

            {/* Education & Lessons Specific Fields */}
            {category === 'Ders Verenler' && (
              <EducationFields
                subCategory={subCategory}
                t={t}
                selectedSprachkurseArt={selectedSprachkurseArt}
                setSelectedSprachkurseArt={setSelectedSprachkurseArt}
                selectedKunstGestaltungArt={selectedKunstGestaltungArt}
                setSelectedKunstGestaltungArt={setSelectedKunstGestaltungArt}
              />
            )}


            {/* Art Selection for Weiteres Haus & Garten */}



            {/* Vehicle-specific fields */}
            {(category === 'Otomobil, Bisiklet & Tekne' || subCategory.startsWith('Bisiklet')) && (
              <VehicleFields
                category={category}
                subCategory={subCategory}
                t={t}
                // Bike
                selectedBikeArt={selectedBikeArt}
                setSelectedBikeArt={setSelectedBikeArt}
                selectedBikeType={selectedBikeType}
                setSelectedBikeType={setSelectedBikeType}
                // Auto/Moto/Van Shared
                marke={marke}
                setMarke={setMarke}
                getriebe={getriebe}
                setGetriebe={setGetriebe}
                kilometerstand={kilometerstand}
                setKilometerstand={setKilometerstand}
                erstzulassung={erstzulassung}
                setErstzulassung={setErstzulassung}
                leistung={leistung}
                setLeistung={setLeistung}
                // Auto Specific
                selectedCarBrand={selectedCarBrand}
                setSelectedCarBrand={setSelectedCarBrand}
                selectedCarModel={selectedCarModel}
                setSelectedCarModel={setSelectedCarModel}
                erstzulassungMonat={erstzulassungMonat}
                setErstzulassungMonat={setErstzulassungMonat}
                kraftstoff={kraftstoff}
                setKraftstoff={setKraftstoff}
                selectedFahrzeugtyp={selectedFahrzeugtyp}
                setSelectedFahrzeugtyp={setSelectedFahrzeugtyp}
                selectedDoorCount={selectedDoorCount}
                setSelectedDoorCount={setSelectedDoorCount}
                selectedExteriorColor={selectedExteriorColor}
                setSelectedExteriorColor={setSelectedExteriorColor}
                selectedInteriorMaterial={selectedInteriorMaterial}
                setSelectedInteriorMaterial={setSelectedInteriorMaterial}
                selectedEmissionBadge={selectedEmissionBadge}
                setSelectedEmissionBadge={setSelectedEmissionBadge}
                selectedSchadstoffklasse={selectedSchadstoffklasse}
                setSelectedSchadstoffklasse={setSelectedSchadstoffklasse}
                selectedHU={selectedHU}
                setSelectedHU={setSelectedHU}
                isUnfallfrei={isUnfallfrei}
                setIsUnfallfrei={setIsUnfallfrei}
                isScheckheftgepflegt={isScheckheftgepflegt}
                setIsScheckheftgepflegt={setIsScheckheftgepflegt}
                isNichtraucher={isNichtraucher}
                setIsNichtraucher={setIsNichtraucher}
                selectedCarAmenities={selectedCarAmenities}
                setSelectedCarAmenities={setSelectedCarAmenities}
                // Moto specific
                selectedMotorradArt={selectedMotorradArt}
                setSelectedMotorradArt={setSelectedMotorradArt}
                hubraum={hubraum}
                setHubraum={setHubraum}
                // Boat specific
                selectedBooteArt={selectedBooteArt}
                setSelectedBooteArt={setSelectedBooteArt}
                // Parts specific
                selectedAutoteileArt={selectedAutoteileArt}
                setSelectedAutoteileArt={setSelectedAutoteileArt}
                selectedMotorradteileArt={selectedMotorradteileArt}
                setSelectedMotorradteileArt={setSelectedMotorradteileArt}
                // Commercial specific
                selectedNutzfahrzeugeArt={selectedNutzfahrzeugeArt}
                setSelectedNutzfahrzeugeArt={setSelectedNutzfahrzeugeArt}
                // Caravan specific
                selectedWohnwagenArt={selectedWohnwagenArt}
                setSelectedWohnwagenArt={setSelectedWohnwagenArt}
              />
            )}

            {/* Condition and Shipping Selection */}
            {!hideConditionAndShipping && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">{t.addListing.condition}</label>
                  <select
                    value={condition}
                    onChange={(e) => setCondition(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-300 bg-white text-gray-700"
                  >
                    <option value="">{t.productDetail.pleaseChoose}</option>
                    <option value="defekt">{t.addListing.options.defective}</option>
                    <option value="in_ordnung">{t.addListing.options.okay}</option>
                    <option value="gut">{t.addListing.options.good}</option>
                    <option value="sehr_gut">{t.addListing.options.veryGood}</option>
                    <option value="neu">{t.addListing.options.new}</option>
                    <option value="neu_mit_etikett">{t.addListing.options.newWithTags}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-1">{t.addListing.shipping}</label>
                  <select
                    value={selectedVersand}
                    onChange={(e) => setSelectedVersand(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-300 bg-white text-gray-700"
                  >
                    <option value="">{t.productDetail.pleaseChoose}</option>
                    <option value="Versand möglich">{t.addListing.options.shipping}</option>
                    <option value="Nur Abholung">{t.addListing.options.noShipping}</option>
                  </select>
                </div>
              </div>
            )}
            {(category !== 'İş İlanları' && subCategory !== 'Eğitim / Meslek Eğitimi') && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">
                    {category === 'Emlak' && ['Kiralık Daire', 'Kiralık Müstakil Ev', 'Ticari Emlak'].includes(subCategory) ? t.addListing.rentFee :
                      category === 'Emlak' && subCategory === 'Geçici Konaklama & Paylaşımlı Oda' ? t.addListing.rent :
                        t.addListing.price}
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={price}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (priceType === 'giveaway') return;

                        // Only allow numbers and format with dots
                        const numeric = val.replace(/\D/g, '');
                        const formatted = numeric.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
                        setPrice(formatted);
                      }}
                      required={priceType !== 'giveaway' && priceType !== 'negotiable'}
                      disabled={priceType === 'giveaway'}
                      className={`flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-300 ${priceType === 'giveaway' ? 'bg-gray-100 text-gray-400' : ''}`}
                      placeholder={priceType === 'giveaway' ? '' : (priceType === 'negotiable' ? t.addListing.optionalPricePlaceholder : t.addListing.pricePlaceholder)}
                    />
                    <span className="text-gray-600 font-medium">₺</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">{t.addListing.priceType}</label>
                  <select
                    value={priceType}
                    onChange={(e) => {
                      const newType = e.target.value;
                      setPriceType(newType);
                      if (newType === 'giveaway') {
                        setPrice(t.addListing.options.givingAway);
                      } else if (price === t.addListing.options.givingAway) {
                        setPrice('');
                      }
                    }}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-300 bg-white text-gray-700"
                  >
                    <option value="fixed">{t.addListing.options.fixedPrice}</option>
                    <option value="negotiable">{t.addListing.options.negotiable}</option>
                    <option value="giveaway">{t.addListing.options.givingAway}</option>
                  </select>
                </div>
              </div>
            )}
            <div>
              <label className="block text-sm text-gray-600 mb-1">{t.productDetail.description}</label>
              <textarea
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-300"
                placeholder={t.addListing.descriptionPlaceholder}
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-2">{t.addListing.images} (max. 20)</label>
              <div className="relative">
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageSelect}
                  className="hidden"
                />
                <label
                  htmlFor="image-upload"
                  className="w-full border-2 border-dashed border-gray-300 rounded-2xl px-6 py-10 flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-red-400 hover:bg-red-50/30 transition-all duration-200 group"
                >
                  <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                    <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="text-center">
                    <span className="text-lg font-bold text-gray-900 block">{t.addListing.selectImages}</span>
                    <span className="text-sm text-gray-500">{t.addListing.dragAndDrop}</span>
                  </div>
                  <span className="text-xs text-gray-400">{t.addListing.maxImages}</span>
                </label>
              </div>
              {imageFiles.length > 0 && (
                <div className="mt-3 space-y-2">
                  <p className="text-xs text-gray-500">🖱️ {t.addListing.imageDragDropHint}</p>
                  <ul className="space-y-2">
                    {imageFiles.map((file, index) => {
                      // Create preview URL for the image
                      const previewUrl = typeof file === 'string'
                        ? file // Already a URL
                        : URL.createObjectURL(file); // Create temporary URL for File object

                      return (
                        <li
                          key={index}
                          draggable
                          onDragStart={(e) => {
                            e.dataTransfer.effectAllowed = 'move';
                            e.dataTransfer.setData('text/plain', index.toString());
                            e.currentTarget.style.opacity = '0.5';
                          }}
                          onDragEnd={(e) => {
                            e.currentTarget.style.opacity = '1';
                          }}
                          onDragOver={(e) => {
                            e.preventDefault();
                            e.dataTransfer.dropEffect = 'move';
                            e.currentTarget.style.borderColor = '#ef4444';
                            e.currentTarget.style.backgroundColor = '#fef2f2';
                          }}
                          onDragLeave={(e) => {
                            e.currentTarget.style.borderColor = '';
                            e.currentTarget.style.backgroundColor = '';
                          }}
                          onDrop={(e) => {
                            e.preventDefault();
                            e.currentTarget.style.borderColor = '';
                            e.currentTarget.style.backgroundColor = '';

                            const draggedIndex = parseInt(e.dataTransfer.getData('text/plain'));
                            const targetIndex = index;

                            if (draggedIndex !== targetIndex) {
                              const newFiles = [...imageFiles];
                              const [draggedItem] = newFiles.splice(draggedIndex, 1);
                              newFiles.splice(targetIndex, 0, draggedItem);
                              setImageFiles(newFiles);
                            }
                          }}
                          className="flex items-center gap-3 bg-gray-50 px-3 py-2 rounded border border-gray-200 hover:border-gray-300 transition-all cursor-move"
                        >
                          {/* Drag handle icon */}
                          <div className="text-gray-400 cursor-grab active:cursor-grabbing">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M7 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 2zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 14zm6-8a2 2 0 1 0-.001-4.001A2 2 0 0 0 13 6zm0 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 14z"></path>
                            </svg>
                          </div>

                          {/* Thumbnail preview */}
                          <img
                            src={previewUrl}
                            alt={t.addListing.imageAlt.replace('{index}', (index + 1).toString())}
                            className="w-16 h-16 object-cover rounded border border-gray-300 pointer-events-none"
                          />

                          {/* Reorder buttons */}
                          <div className="flex flex-col gap-0.5">
                            <button
                              type="button"
                              onClick={() => {
                                if (index === 0) return;
                                const newFiles = [...imageFiles];
                                [newFiles[index - 1], newFiles[index]] = [newFiles[index], newFiles[index - 1]];
                                setImageFiles(newFiles);
                              }}
                              disabled={index === 0}
                              className={`p-1 rounded ${index === 0 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:text-red-500 hover:bg-gray-200'}`}
                              title={t.addListing.moveUp}
                            >
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                              </svg>
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                if (index === imageFiles.length - 1) return;
                                const newFiles = [...imageFiles];
                                [newFiles[index], newFiles[index + 1]] = [newFiles[index + 1], newFiles[index]];
                                setImageFiles(newFiles);
                              }}
                              disabled={index === imageFiles.length - 1}
                              className={`p-1 rounded ${index === imageFiles.length - 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:text-red-500 hover:bg-gray-200'}`}
                              title={t.addListing.moveDown}
                            >
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                              </svg>
                            </button>
                          </div>

                          {/* Image info */}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {typeof file === 'string'
                                ? `${t.addListing.imageLabel} ${index + 1}`
                                : file.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {index === 0 ? `⭐ ${t.addListing.mainImage}` : t.addListing.position.replace('{pos}', (index + 1).toString())}
                            </p>
                          </div>

                          {/* Remove button */}
                          <button
                            type="button"
                            onClick={() => {
                              const updated = imageFiles.filter((_, i) => i !== index);
                              setImageFiles(updated);
                            }}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded transition-colors"
                            title={t.addListing.remove}
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </div>

            <hr className="my-6" />

            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">{t.addListing.locationTitle}</h2>
              <div className="space-y-4">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2 p-2 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                  <input
                    type="checkbox"
                    checked={showLocation}
                    onChange={(e) => setShowLocation(e.target.checked)}
                    className="text-red-400 focus:ring-red-300 rounded w-4 h-4"
                  />
                  {t.addListing.showLocation}
                </label>

                <div className="animate-in fade-in duration-300 space-y-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">{t.addListing.address}</label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-300"
                      placeholder={t.addListing.addressPlaceholder}
                    />
                  </div>
                </div>

                <div className="grid gap-4 grid-cols-2">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">{t.addListing.district}</label>
                    <input
                      type="text"
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      required
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-300"
                      placeholder={t.addListing.districtPlaceholder}
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">{t.addListing.city}</label>
                    <select
                      value={city}
                      onChange={(e) => {
                        const selectedCity = e.target.value;
                        setCity(selectedCity);
                        // Auto-set region based on selected city
                        const cityData = turkeyCities.find(c => c.city === selectedCity);
                        if (cityData) {
                          setRegion(cityData.region);
                        }
                      }}
                      required
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-300 bg-white"
                    >
                      <option value="">{t.addListing.select}</option>
                      {turkeyCities.map((c) => (
                        <option key={c.city} value={c.city}>{c.city}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="animate-in fade-in duration-300">
                  <label className="block text-sm text-gray-600 mb-1">{t.addListing.region}</label>
                  <input
                    type="text"
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-300 bg-white"
                    placeholder={t.addListing.autoFill}
                  />
                </div>
              </div>

            </div>

            {/* Deine Angaben Section */}
            <div className="pt-6 border-t border-gray-200">
              <h2 className="text-xl font-semibold mb-4">{t.addListing.yourInfo}</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">{t.addListing.name}</label>
                  <input
                    type="text"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-300 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">{t.addListing.phoneNumber}</label>
                  <div className="flex flex-col gap-2">
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-300 bg-white"
                    />
                    <label className="flex items-center gap-2 text-sm text-gray-700">
                      <input
                        type="checkbox"
                        checked={showPhoneNumber}
                        onChange={(e) => setShowPhoneNumber(e.target.checked)}
                        className="text-red-400 focus:ring-red-300 rounded"
                      />
                      {t.addListing.showPhoneNumber}
                    </label>
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">{t.addListing.legalInfo}</label>
                  <textarea
                    value={legalInfo}
                    onChange={(e) => setLegalInfo(e.target.value)}
                    rows={4}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-300 bg-gray-50"
                    placeholder={t.addListing.legalInfoPlaceholder}
                  />
                </div>
              </div>
            </div>


            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setListingType('buying');
                  setTitle('');
                  setCategory('');
                  setPrice('');
                  setPriceType('fixed');
                  setDescription('');
                  setImageFiles([]);
                  setCity('');
                  setDistrict('');
                  setRegion('');
                  setAddress('');
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                {t.addListing.reset}
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 font-semibold"
              >
                {t.addListing.saveListing}
              </button>
            </div>
          </form>
        </div>
      </div >
      {showLimitModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-[2rem] w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="relative p-8 text-center">
              <button
                onClick={() => navigate('/')}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-2"
              >
                ✕
              </button>
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl text-red-600">🚀</span>
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-2">{t.addListing.limitReached.title}</h3>
              <p className="text-gray-500 font-medium mb-8 px-4">
                {t.addListing.limitReached.description.replace('{limit}', limitState.limit)}
              </p>

              <div className="space-y-3">
                <button
                  onClick={() => navigate('/packages')}
                  className="w-full py-4 bg-gray-900 text-white rounded-2xl font-black hover:bg-black transition-all shadow-lg"
                >
                  {t.addListing.limitReached.viewPackages}
                </button>
                <button
                  onClick={handlePayExtra}
                  disabled={payingExtra}
                  className="w-full py-4 border-2 border-red-600 text-red-600 rounded-2xl font-black hover:bg-red-50 transition-all flex items-center justify-center gap-2"
                >
                  {payingExtra ? (
                    <LoadingSpinner size="small" />
                  ) : (
                    <span>{t.addListing.limitReached.paySingle}</span>
                  )}
                </button>
                <button
                  onClick={() => navigate('/')}
                  className="w-full py-4 text-gray-400 font-bold hover:text-gray-600 transition-colors"
                >
                  {t.addListing.limitReached.cancel}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div >
  );
};

// Image Lightbox Component
const ImageLightbox = ({ isOpen, onClose, imageSrc, altText, images, currentIndex, onNavigate }) => {
  if (!isOpen) return null;

  const hasMultipleImages = images && images.length > 1;
  const currentImageIndex = currentIndex !== undefined ? currentIndex : 0;
  const currentImage = images && images[currentImageIndex] ? images[currentImageIndex] : imageSrc;

  const handlePrevious = (e) => {
    e.stopPropagation();
    if (onNavigate && hasMultipleImages) {
      const newIndex = currentImageIndex > 0 ? currentImageIndex - 1 : images.length - 1;
      onNavigate(newIndex);
    }
  };

  const handleNext = (e) => {
    e.stopPropagation();
    if (onNavigate && hasMultipleImages) {
      const newIndex = currentImageIndex < images.length - 1 ? currentImageIndex + 1 : 0;
      onNavigate(newIndex);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black bg-opacity-95 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white hover:text-gray-300 focus:outline-none z-10 bg-black/50 rounded-full p-2 hover:bg-black/70 transition-all"
      >
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Previous Button */}
      {hasMultipleImages && (
        <button
          onClick={handlePrevious}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 focus:outline-none z-10 bg-black/50 rounded-full p-3 hover:bg-black/70 transition-all hover:scale-110"
        >
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}

      {/* Image */}
      <div className="relative max-w-7xl max-h-screen flex flex-col items-center">
        <img
          src={currentImage}
          alt={altText}
          className="max-w-full max-h-[85vh] object-contain cursor-default"
          onClick={(e) => e.stopPropagation()}
        />

        {/* Image Counter */}
        {hasMultipleImages && (
          <div className="mt-4 text-white text-sm bg-black/50 px-4 py-2 rounded-full">
            {currentImageIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Next Button */}
      {hasMultipleImages && (
        <button
          onClick={handleNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 focus:outline-none z-10 bg-black/50 rounded-full p-3 hover:bg-black/70 transition-all hover:scale-110"
        >
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}
    </div>
  );
};

// Visibility Packages Modal
const VisibilityPackagesModal = ({ isOpen, onClose, listing }) => {
  const [selectedPromotions, setSelectedPromotions] = useState([]);
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!isOpen) return null;

  const promotionPackages = [
    { id: 'bump', name: 'Yukarı Çıkar', price: '4,99', duration: 1, effect: 'Yeni dikkat çekin! İlanınız yeni bir ilan gibi görünecek.' },
    { id: 'highlight', name: 'Öne Çıkan', price: '9,99', duration: 7, effect: '2 kata kadar daha fazla görünürlük! İlanınız renkli olarak vurgulanacak.' },
    { id: 'multi-bump', name: 'Tekrarlı Yukarı Çıkarma', price: '16,99', duration: 7, effect: '5 kata kadar daha fazla görünürlük! Bir hafta boyunca ilanınız her gün yukarı çıkarılacak.' },
    { id: 'z_premium', name: 'Premium', price: '19,99', duration: 7, effect: '10 kata kadar daha fazla görünürlük! İlanınız listenin en başında yer alacak!' },
    { id: 'galerie', name: 'Vitrin', price: '59,99', duration: 10, effect: '15 kata kadar daha fazla görünürlük! İlanınız ana sayfada da görünecek!' },
  ];

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

  const handlePromotionPurchase = async () => {
    const packagesToPurchase = selectedPromotions.map(id => promotionPackages.find(p => p.id === id));

    if (packagesToPurchase.length === 0) return;

    const totalStr = calculateTotal();
    const names = packagesToPurchase.map(p => p.name).join(', ');

    if (window.confirm(`${names} toplam ${totalStr}₺ karşılığında satın alınsın mı?\n\nÜcret hesabınızdan düşülecektir.`)) {
      try {
        const { purchasePromotion } = await import('./api/promotions');

        // Process each promotion
        for (const p of packagesToPurchase) {
          await purchasePromotion(listing.id, {
            id: p.id,
            price: parseFloat(p.price.replace(',', '.')),
            duration: p.duration
          }, user.id);
        }

        alert(`Teşekkürler! Seçilen paketler aktif edildi.`);
        setSelectedPromotions([]);
        onClose();
        window.location.reload();
      } catch (error) {
        console.error('Error purchasing promotions:', error);
        alert('Promosyon satın alınırken hata oluştu');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md" onClick={onClose}>
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl overflow-hidden max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-6 text-white flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-black flex items-center gap-2">
              <span className="bg-red-500 text-white p-1.5 rounded-lg">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </span>
              Görünürlüğü Maksimuma Çıkar
            </h2>
            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-1">Görünürlüğü artırılan ilan: <span className="text-white">{listing.title}</span></p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="bg-white rounded-2xl border-2 border-gray-100 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 border-b-2 border-gray-100">
                  <tr className="text-[10px] font-black uppercase tracking-widest text-gray-500">
                    <th className="px-6 py-4 w-16">Seç</th>
                    <th className="px-6 py-4">İlanı Öne Çıkan</th>
                    <th className="px-6 py-4">Etki</th>
                    <th className="px-6 py-4">Süre</th>
                    <th className="px-6 py-4 text-right w-32">Fiyat</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                  {promotionPackages.map((pkg, idx) => (
                    <tr
                      key={pkg.id}
                      onClick={() => togglePromotionSelection(pkg.id)}
                      className={`hover:bg-red-50/40 transition-all cursor-pointer group ${idx % 2 !== 0 ? 'bg-gray-50/30' : ''} ${selectedPromotions.includes(pkg.id) ? 'bg-red-50' : ''}`}
                    >
                      <td className="px-6 py-5">
                        <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-300 ${selectedPromotions.includes(pkg.id) ? 'bg-red-500 border-red-500 scale-110 shadow-lg shadow-red-200' : 'border-gray-200 bg-white group-hover:border-red-300'}`}>
                          {selectedPromotions.includes(pkg.id) && (
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3.5} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="font-black text-gray-900 group-hover:text-red-600 transition-colors uppercase tracking-tight">{pkg.name}</div>
                      </td>
                      <td className="px-6 py-5">
                        <p className="text-gray-500 font-medium leading-relaxed">{pkg.effect}</p>
                      </td>
                      <td className="px-6 py-5">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-600">
                          {pkg.duration === 1 ? 'bir kez' : `${pkg.duration} Gün`}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-right font-black text-red-600 text-lg tabular-nums">
                        {pkg.price} ₺
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer / Cart Summary */}
        <div className={`p-6 bg-white border-t-2 border-gray-100 transition-all duration-500 ${selectedPromotions.length > 0 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-70 grayscale pointer-events-none'}`}>
          <div className="bg-gray-900 rounded-2xl p-6 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl">
            <div className="flex items-center gap-6">
              <div className={`bg-red-500 text-white p-3 rounded-xl ${selectedPromotions.length > 0 ? 'animate-bounce shadow-lg shadow-red-500/50' : ''}`}>
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div className="text-center sm:text-left">
                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-red-500 mb-1">Seçiminiz: {selectedPromotions.length} Paket</div>
                <div className="text-3xl font-black tracking-tight tabular-nums">Toplam: {calculateTotal()} ₺</div>
              </div>
            </div>
            <button
              onClick={handlePromotionPurchase}
              disabled={selectedPromotions.length === 0}
              className="w-full sm:w-auto px-12 py-5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-black text-xl shadow-xl shadow-red-500/30 hover:shadow-red-500/50 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 group"
            >
              Şimdi Satın Al
              <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>
          <div className="mt-4 text-center">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center justify-center gap-2">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              Güvenli Ödeme • Fiyatlara KDV dahildir
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Horizontal Listing Card Component
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
          const { supabase } = await import('./lib/supabase');

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
          const { supabase } = await import('./lib/supabase');

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
        const { supabase } = await import('./lib/supabase');

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
    if (window.confirm(t.productDetail.ownerDashboard.extendConfirm.replace('{price}', '3,49₺'))) {
      try {
        const { purchasePromotion } = await import('./api/promotions');

        // New Logic: Update expiry_date directly by 90 days
        // If currently expired, set to now + 90 days
        // If active, add 90 days to current expiry_date
        const now = new Date();
        const currentExpiry = listing.expiry_date ? new Date(listing.expiry_date) : new Date(new Date(listing.created_at).getTime() + 90 * 24 * 60 * 60 * 1000);

        let newExpiryDate;

        if (currentExpiry < now) {
          // Already expired, start fresh 90 days from now
          newExpiryDate = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000);
        } else {
          // Still active, extend current expiry by 90 days
          newExpiryDate = new Date(currentExpiry.getTime() + 90 * 24 * 60 * 60 * 1000);
        }

        // Use purchasePromotion to record the transaction and update the listing
        await purchasePromotion(listing.id, {
          id: 'verlängerung',
          price: 3.49,
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

  return (
    <>
      <div
        className={`${(listing?.is_gallery || ['galerie', 'gallery', 'galeri', 'vitrin'].includes(listing?.package_type?.toLowerCase())) ? 'bg-purple-50/30 border-purple-400 border-[2px] shadow-[0_0_15px_rgba(147,51,234,0.2)] scale-[1.005]' : 'bg-white'} border ${(listing?.is_gallery || ['galerie', 'gallery', 'galeri', 'vitrin'].includes(listing?.package_type?.toLowerCase())) ? 'border-purple-200' : 'border-gray-200'} rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer`}
        onClick={() => navigate(`/product/${listing.id}`)}
      >
        <div className="flex flex-col md:flex-row">
          {/* Image Section - Compact Size */}
          <div className="md:w-60 h-44 md:h-48 relative group flex-shrink-0 bg-gray-100">
            <img
              src={Array.isArray(listing?.images) && listing.images.length > 0
                ? listing.images[0]
                : listing?.image || 'https://via.placeholder.com/300x200?text=No+Image'}
              alt={listing?.title}
              className="w-full h-full object-cover transition-transform duration-300"
              loading="lazy"
            />
            {/* RESERVIERT Badge - always on top */}
            {isReserved && (
              <div className="absolute top-1 left-1 bg-yellow-500 text-white px-1.5 py-0.5 rounded text-[9px] font-bold shadow flex items-center gap-1 z-20">
                <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                REZERVE EDİLDİ
              </div>
            )}
            {/* Package Badge */}
            {listing?.package_type &&
              listing.package_type.toLowerCase() !== 'basic' &&
              listing.package_type.toLowerCase() !== 'top' &&
              listing.package_type.toLowerCase() !== 'galerie' && // Vitrin is handled separately
              listing.package_type.toLowerCase() !== 'gallery' &&
              listing.package_type.toLowerCase() !== 'galeri' &&
              listing.package_type.toLowerCase() !== 'vitrin' &&
              listing.package_type.toLowerCase() !== 'verlängerung' &&
              listing.package_type.toLowerCase() !== 'extension' && (
                <div className={`absolute ${isReserved ? 'top-8' : 'top-1'} left-1 px-1.5 py-0.5 rounded-md text-[9px] font-bold shadow-md border border-white/20 z-10 uppercase tracking-wider ${listing.package_type.toLowerCase() === 'premium' || listing.package_type.toLowerCase() === 'z_premium' ? 'bg-gradient-to-r from-red-600 via-red-500 to-rose-600 text-white animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.3)]' :
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

            {/* Vitrin/Gallery Badge - Inclusive check */}
            {(listing?.is_gallery || ['galerie', 'gallery', 'galeri', 'vitrin'].includes(listing?.package_type?.trim().toLowerCase())) && (
              <div className={`absolute ${isReserved ? (listing.package_type && !['basic', 'top', 'galerie', 'gallery', 'galeri', 'vitrin', 'verlängerung', 'extension'].includes(listing.package_type.toLowerCase()) ? 'top-14' : 'top-8') : (listing.package_type && !['basic', 'top', 'galerie', 'gallery', 'galeri', 'vitrin', 'verlängerung', 'extension'].includes(listing.package_type.toLowerCase()) ? 'top-8' : 'top-1')} left-1 bg-gradient-to-r from-purple-500 to-indigo-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-md border border-white/20 z-10 flex items-center gap-1`}>
                <span>⭐ VİTRİN</span>
              </div>
            )}

            {/* Highlighted Fallback */}
            {listing?.is_highlighted && !listing?.is_top && !listing?.package_type && (
              <div className={`absolute ${isReserved ? 'top-8' : 'top-1'} left-1 bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 px-1.5 py-0.5 rounded text-[9px] font-bold shadow-md z-10`}>
                ✨ Öne Çıkarılan
              </div>
            )}
            {/* ABGELAUFEN Badge - for owner only */}
            {isOwnListing && listing?.created_at && (new Date() > new Date(new Date(listing.created_at).getTime() + 30 * 24 * 60 * 60 * 1000)) && (
              <div className="absolute top-2 right-12 bg-red-600 text-white px-2 py-1 rounded text-[10px] font-bold shadow z-20 animate-pulse">
                ⏰ SÜRESİ DOLDU
              </div>
            )}
            {/* Favorite Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (toggleFavorite) toggleFavorite(listing.id);
              }}
              className="absolute top-2 right-2 w-7 h-7 bg-white/90 backdrop-blur-sm rounded-full shadow hover:bg-white hover:scale-110 transition-all duration-200 z-30 flex items-center justify-center"
              aria-label={favorite ? 'Favorilerden çıkar' : 'Favorilere ekle'}
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
          </div>

          <div className="flex-1 p-3 flex flex-col justify-between h-44 md:h-48">
            <div>
              <h4 className="text-base font-bold text-gray-900 mb-0.5 line-clamp-1 group-hover:text-red-600 transition-colors">
                {listing?.title}
              </h4>
              <p className="text-sm text-gray-600 mb-1 line-clamp-1">
                {listing?.description || 'Açıklama mevcut değil'}
              </p>
            </div>

            <div>
              {/* Dynamic Features Box */}
              {renderCustomFields ? renderCustomFields(listing) : (() => {
                const attrs = [];
                // Technical Attributes
                if (listing.rooms) attrs.push(`${listing.rooms} Oda`);
                if (listing.living_space) attrs.push(`${listing.living_space} m²`);
                if (listing.erstzulassung) attrs.push(listing.erstzulassung);
                if (listing.kilometerstand) attrs.push(`${listing.kilometerstand.toLocaleString('tr-TR')} km`);

                // Fallback Attributes for common categories
                if (listing.zustand && listing.zustand !== 'all') attrs.push(listing.zustand);
                if (listing.brand) attrs.push(listing.brand);
                if (listing.size) attrs.push(listing.size);

                // Damenbekleidung specific attributes
                if (listing.damenbekleidung_marke && !attrs.includes(listing.damenbekleidung_marke)) attrs.push(listing.damenbekleidung_marke);
                if (listing.damenbekleidung_size && !attrs.includes(listing.damenbekleidung_size)) attrs.push(listing.damenbekleidung_size);
                if (listing.damenbekleidung_color) attrs.push(listing.damenbekleidung_color);

                // Bike specific attributes
                if (listing.bike_type) attrs.push(listing.bike_type);

                const artField = listing.audio_hifi_art || listing.dienstleistungen_elektronik_art || listing.foto_art || listing.handy_telefon_art || listing.haushaltsgeraete_art || listing.konsolen_art || listing.notebooks_art || listing.pc_zubehoer_software_art || listing.pcs_art || listing.tablets_reader_art || listing.tv_video_art || listing.videospiele_art || listing.art_type || listing.autoteile_art || listing.boote_art || listing.motorrad_art || listing.wohnwagen_art || listing.beauty_gesundheit_art || listing.damenbekleidung_art || listing.gartenzubehoer_art || listing.kueche_esszimmer_art || listing.heimwerken_art || listing.schlafzimmer_art || listing.bike_art;
                if (artField && !attrs.includes(artField)) attrs.push(artField);

                // Only show sub_category as fallback if no art field exists and it's not a service subcategory
                const serviceSubcategories = ['Ses & Hifi', 'Elektronik Hizmetler', 'Elektronik Servisler', 'Dienstleistungen Elektronik', 'Fotoğraf & Kamera', 'Cep Telefonu & Telefon', 'Cep Telefonu & Aksesuar', 'Ev Aletleri', 'Beyaz Eşya & Ev Aletleri', 'Oyun Konsolları', 'Konsollar', 'Dizüstü Bilgisayar', 'Dizüstü Bilgisayarlar', 'Bilgisayar Aksesuar & Yazılım', 'Bilgisayar Aksesuarları & Yazılım', 'Bilgisayarlar', 'Masaüstü Bilgisayar', 'Tablet & E-Okuyucu', 'Tabletler & E-Okuyucular', 'TV & Video', 'Video Oyunları', 'Güzellik & Sağlık', 'Kişisel Bakım & Sağlık', 'Kadın Giyimi', 'Kadın Giyim'];
                if (attrs.length === 0 && listing.sub_category && !serviceSubcategories.includes(listing.sub_category)) attrs.push(listing.sub_category);



                if (attrs.length === 0) return null;

                return (
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {attrs.slice(0, 4).map((attr, idx) => (
                      <span key={idx} className="px-2 py-0.5 bg-gray-100 text-gray-500 text-[10px] font-bold rounded-md border border-gray-200 uppercase tracking-tighter">
                        {attr}
                      </span>
                    ))}
                  </div>
                );
              })()}
            </div>

            <div className="text-base font-bold text-gray-900 mb-1">
              {!hidePrice && listing?.category !== 'Jobs' && listing?.category !== 'İş İlanları' && (
                listing?.price_type === 'giveaway' || listing?.price === 0
                  ? 'Ücretsiz'
                  : listing?.price
                    ? `${listing.price.toLocaleString('tr-TR')} ₺${listing.price_type === 'negotiable' ? ' ' + t.addListing.options.negotiable : ''}`
                    : t.addListing.options.negotiable
              )}
            </div>

            <div className="flex items-center text-sm text-gray-700 gap-3 pt-1.5 border-t border-gray-200 mt-1">
              {isOwnListing ? (
                // Own listings: Show stats
                <div className="flex items-center gap-3 ml-auto text-xs text-gray-400">
                  {listing?.created_at && (
                    <span className="flex items-center gap-1">
                      {new Date(listing.created_at).toLocaleDateString('tr-TR')}
                    </span>
                  )}
                  <span>{listing?.views || 0} İzlenme</span>
                </div>
              ) : (
                // Other's listings: Show location and date
                <>
                  {listing?.city && (
                    <div className="flex items-center">
                      <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {listing.district ? `${listing.district}, ${listing.city}` : listing.city}
                    </div>
                  )}
                  <div className="flex items-center ml-auto">
                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {new Date(listing.created_at).toLocaleDateString('tr-TR')}
                  </div>
                </>
              )}
            </div>

            {/* Action Buttons - Only show for own listings */}
            {isOwnListing && (
              <div className="flex flex-wrap gap-1.5 px-3 pb-3">
                <button
                  onClick={handleEdit}
                  className="px-2 py-1 text-[11px] font-bold text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                >
                  Düzenle
                </button>
                <button
                  onClick={handleExtend}
                  className="px-2 py-1 text-[11px] font-bold text-green-600 bg-white border border-gray-300 rounded hover:bg-green-50 transition-colors"
                >
                  Uzat
                </button>
                <button
                  onClick={handleReserve}
                  className="px-2 py-1 text-[11px] font-bold text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                >
                  {isReserved ? 'Rezervasyonu Kaldır' : 'Rezerve Et'}
                </button>
                <button
                  onClick={handleDelete}
                  className="px-2 py-1 text-[11px] font-bold text-red-600 bg-white border border-gray-300 rounded hover:bg-red-50 transition-colors"
                >
                  Sil
                </button>
                <button
                  onClick={handleBump}
                  className="px-2 py-1 text-[11px] font-bold text-blue-600 bg-white border border-gray-300 rounded hover:bg-blue-50 transition-colors"
                >
                  Yukarı Çıkar
                </button>
              </div>
            )}
          </div>
        </div>
      </div>



      {/* Visibility Packages Modal */}
      <VisibilityPackagesModal
        isOpen={showVisibilityModal}
        onClose={() => setShowVisibilityModal(false)}
        listing={listing}
      />
    </>
  );
};




// Listing Countdown Component
export const ListingCountdown = ({ expiryDate, onExpire }) => {
  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const expiry = new Date(expiryDate);
      const difference = expiry - now;

      if (difference <= 0) {
        if (onExpire) onExpire();
        return {
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0
        };
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      };
    };

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    // Initial calculation
    setTimeLeft(calculateTimeLeft());

    return () => clearInterval(timer);
  }, [expiryDate, onExpire]);

  if (!timeLeft) return null;

  const isLastDay = timeLeft.days === 0;

  // If more than 24 hours remaining, show the date instead of countdown
  if (!isLastDay) {
    const expiryDateObj = new Date(expiryDate);
    const day = String(expiryDateObj.getDate()).padStart(2, '0');
    const month = expiryDateObj.toLocaleString('tr-TR', { month: 'long' });
    const year = expiryDateObj.getFullYear();

    return (
      <div className="flex flex-col items-center">
        <div className="text-lg sm:text-xl font-black text-white">
          {day} {month} {year}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <div className={`text-lg sm:text-xl font-black tabular-nums transition-colors duration-300 ${isLastDay ? 'text-red-500 animate-pulse' : 'text-white'}`}>
        {String(timeLeft.hours).padStart(2, '0')}:
        {String(timeLeft.minutes).padStart(2, '0')}:
        {String(timeLeft.seconds).padStart(2, '0')}
      </div>
    </div>
  );
};


/* Translations for Amenities and Features */
const amenityTranslations = {
  // Condition values
  'defekt': 'Arızalı',
  'in_ordnung': 'İdare Eder',
  'in ordnung': 'İdare Eder',
  'gut': 'İyi',
  'sehr_gut': 'Çok İyi',
  'sehr gut': 'Çok İyi',
  'neu': 'Yeni',
  'neu_mit_etikett': 'Etiketli Yeni',
  'neu mit etikett': 'Etiketli Yeni',
  // Residential Amenities
  'Möbliert/Teilmöbliert': 'Mobilyalı/Kısmen Mobilyalı',
  'Balkon': 'Balkon',
  'Terrasse': 'Teras',
  'Einbauküche': 'Ankastre Mutfak',
  'Badewanne': 'Küvet',
  'Gäste-WC': 'Misafir Tuvaleti',
  'Stufenloser Zugang': 'Engelsiz Erişim',
  'Fußbodenheizung': 'Yerden Isıtma',
  'WLAN': 'Wi-Fi',
  'Kühlschrank': 'Buzdolabı',
  'Waschmaschine': 'Çamaşır Makinesi',
  'Spülmaschine': 'Bulaşık Makinesi',
  'TV': 'Televizyon',
  // Commercial Amenities
  'Starkstrom': 'Yüksek Akım',
  'Klimaanlage': 'Klima',
  'DV-Verkabelung': 'DV Kablolama',
  'Parkplätze vorhanden': 'Otopark Mevcut',
  'Küche': 'Mutfak',
  // General Features
  'Altbau': 'Eski Yapı',
  'Neubau': 'Yeni Yapı',
  'Aufzug': 'Asansör',
  'Keller': 'Bodrum',
  'Dachboden': 'Çatı Katı',
  'Garage/Stellplatz': 'Garaj/Park Yeri',
  'Garten/-mitnutzung': 'Bahçe/Ortak Bahçe',
  'Haustiere erlaubt': 'Evcil Hayvan İzni',
  'WG-geeignet': 'Paylaşımlı Eve Uygun',
  'Denkmalobjekt': 'Tarihi Eser/Anıt',
  'Aktuell vermietet': 'Halen Kirada',
  // Other values
  'Garage': 'Garaj',
  'Außenstellplatz': 'Açık Otopark',
  'Möglich': 'Mümkün',
  'Nicht möglich': 'Mümkün Değil',
  'Provisionsfrei': 'Komisyonsuz',
  'Mit Provision': 'Komisyonlu',
  'Inland': 'Yurt İçi',
  'Ausland': 'Yurt Dışı',
  'befristet': 'Süreli',
  'unbefristet': 'Süresiz',
  'Gesamte Unterkunft': 'Tüm Konut',
  'Privatzimmer': 'Özel Oda',
  'Gemeinsames Zimmer': 'Paylaşımlı Oda',
  'Einfamilienhaus': 'Müstakil Ev',
  'Mehrfamilienhaus': 'Apartman',
  'Reihenhaus': 'Sıra Ev',
  'Reihenmittelhaus': 'Sıra Ev (Orta)',
  'Reiheneckhaus': 'Sıra Ev (Köşe)',
  'Doppelhaushälfte': 'İkiz Ev',
  'Bungalow': 'Bungalov',
  'Bauernhaus': 'Çiftlik Evi',
  'Villa': 'Villa',
  'Schloss': 'Şato',
  // Apartment Types
  'Etagenwohnung': 'Ara Kat Daire',
  'Erdgeschosswohnung': 'Giriş Kat Daire',
  'Dachgeschosswohnung': 'Çatı Katı Daire',
  'Maisonette': 'Maisonette',
  'Penthouse': 'Penthouse',
  'Loft': 'Loft',
  'Souterrain': 'Bodrum Kat Daire',
  'Hochparterre': 'Yüksek Giriş',
  'Terrassenwohnung': 'Teraslı Daire',
  'Sonstige': 'Diğer',
  // Vehicle Types
  'Kleinwagen': 'Küçük Araç',
  'Limousine': 'Sedan',
  'Kombi': 'Station Wagon',
  'Cabrio/Roadster': 'Cabrio',
  'Cabrio': 'Cabrio',
  'Sportwagen/Coupé': 'Spor Araba/Kupe',
  'Coupé': 'Kupe',
  'SUV/Geländewagen': 'SUV/Arazi Aracı',
  'SUV': 'SUV',
  'Geländewagen': 'Arazi Aracı',
  'Van/Kleinbus': 'Minivan/Panelvan',
  'Van': 'Minivan',
  'Kleinbus': 'Minibüs',
  'Andere': 'Diğer',
  // Car Colors
  'Blau': 'Mavi',
  'Schwarz': 'Siyah',
  'Weiß': 'Beyaz',
  'Silber': 'Gümüş',
  'Grau': 'Gri',
  'Rot': 'Kırmızı',
  'Grün': 'Yeşil',
  'Gelb': 'Sarı',
  'Orange': 'Turuncu',
  'Braun': 'Kahverengi',
  'Beige': 'Bej',
  'Gold': 'Altın',
  'Violett': 'Mor',
  'Helleres Beigegrau': 'Açık Bej Gri',
  'Kosmosschwarz Metallic': 'Kozmos Siyah Metalik',
  // Car Interiors
  'Stoff': 'Kumaş',
  'Teilleder': 'Yarı Deri',
  'Vollleder': 'Tam Deri',
  'Alcantara': 'Alcantara',
  'Velours': 'Kadife',
  // Car Amenities
  'Anhängerkupplung': 'Römork Demiri',
  'Leichtmetallfelgen': 'Alaşım Jant',
  'Radio/Tuner': 'Radyo',
  'Tempomat': 'Hız Sabitleyici',
  'Freisprecheinrichtung': 'Araç Telefonu / Hands-Free',
  'Antiblockiersystem (ABS)': 'ABS',
  'Klimaanlage': 'Klima',
  'Navigationssystem': 'Navigasyon',
  'Schiebedach': 'Sunroof',
  'Sitzheizung': 'Koltuk Isıtma',
  'Bluetooth': 'Bluetooth',
  'Bordcomputer': 'Yol Bilgisayarı',
  'Elektr. Fensterheber': 'Elektrikli Camlar',
  'Elektr. Seitenspiegel': 'Elektrikli Aynalar',
  'Elektr. Sitzeinstellung': 'Elektrikli Koltuk Ayarı',
  'Head-Up Display': 'Head-Up Display',
  'Isofix': 'Isofix',
  'Kurvenlicht': 'Viraj Aydınlatma',
  'Lichtsensor': 'Far Sensörü',
  'Multifunktionslenkrad': 'Çok Fonksiyonlu Direksiyon',
  'Nebelscheinwerfer': 'Sis Farları',
  'Nichtraucher-Fahrzeug': 'Sigara İçilmemiş',
  'Panorama-Dach': 'Panoramik Cam Tavan',
  'Regensensor': 'Yağmur Sensörü',
  'Scheckheftgepflegt': 'Bakımlı (Servis Bakımlı)',
  'Servolenkung': 'Hidrolik Direksiyon',
  'Sitzbelüftung': 'Koltuk Soğutma',
  'Skisack': 'Kayak Torbası',
  'Sommerreifen': 'Yaz Lastikleri',
  'Soundsystem': 'Ses Sistemi',
  'Sportfahrwerk': 'Spor Süspansiyon',
  'Sportpaket': 'Spor Paket',
  'Sportsitze': 'Spor Koltuklar',
  'Sprachsteuerung': 'Sesli Kontrol',
  'Spurhalteassistent': 'Şerit Takip Asistanı',
  'Standheizung': 'Webasto / Park Isıtıcı',
  'Start/Stopp-Automatik': 'Start/Stop',
  'Tagfahrlicht': 'Gündüz Farları',
  'Tempomat': 'Hız Sabitleyici',
  'Totwinkel-Assistent': 'Kör Nokta Asistanı',
  'Touchscreen': 'Dokunmatik Ekran',
  'Traktionskontrolle': 'Çekiş Kontrolü',
  'Tuner/Radio': 'Radyo',
  'TV': 'TV',
  'USB': 'USB',
  'Verkehrszeichenerkennung': 'Trafik İşareti Tanıma',
  'Volldigitales Kombiinstrument': 'Hayalet Gösterge',
  'Winterpaket': 'Kış Paketi',
  'Winterreifen': 'Kış Lastikleri',
  'Xenonscheinwerfer': 'Xenon Farlar',
  'Zentralverriegelung': 'Merkezi Kilit',
  'H-Zulassung': 'Klasik Araç (H Plaka)',
  'Originalzustand': 'Orijinal Durum',
  'Radio': 'Radyo',
  'AMG-Line': 'AMG Paket',
  'Night-Paket': 'Gece Paketi',
  'LED High Performance': 'Yüksek Performans LED',
  'Park-Assistent': 'Park Asistanı',
  'MBUX Multimediasystem': 'MBUX Multimedya'
};

const translateVal = (val) => amenityTranslations[val] || val;

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
    <div className="hidden print:block print-flyer bg-white text-gray-900 font-sans relative overflow-visible box-border border-0 p-8 max-w-[21cm] mx-auto">
      {/* Header with Title and Price - Compact */}
      <div className="flex justify-between items-start border-b-4 border-red-600 pb-4 mb-6">
        <div className="flex-1 pr-4">
          <h1 className="text-2xl font-black uppercase tracking-tight leading-tight mb-1">
            {listing.title}
          </h1>
          <div className="text-[12px] text-gray-500 font-bold uppercase tracking-widest">
            No: {listing.listing_number || (listing.id && listing.id.slice(0, 8)) || '---'} | {new Date().toLocaleDateString('tr-TR')}
          </div>
        </div>
        <div className="bg-red-600 text-white px-6 py-4 rounded-xl text-center shadow-lg flex-shrink-0 min-w-[150px]">
          <div className="text-[12px] font-bold uppercase tracking-widest leading-none mb-2 opacity-90">Fiyat</div>
          <div className="text-5xl font-black tabular-nums leading-none">
            {listing.category !== 'Jobs' && listing.category !== 'İş İlanları' && (
              listing.price_type === 'giveaway' || listing.price === 0
                ? 'Ücretsiz'
                : `${listing.price || '---'}₺`
            )}
          </div>
          {listing.price_type === 'negotiable' && <div className="text-[10px] font-black uppercase mt-1">{t.addListing.options.negotiable}</div>}
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
                  {t.common.contact}
                </h3>
                <div className="space-y-2.5">
                  <div>
                    <div className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">{t.productDetail.seller}</div>
                    <div className="text-sm font-black truncate">{listing.contact_name || sellerProfile?.full_name || listing.sellerName || t.common.privateSeller}</div>
                  </div>

                  {!hideContact && (
                    <div>
                      <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{t.common.phone}</div>
                      <div className="text-lg font-black text-red-600">
                        {listing.show_phone_number === true ? (listing.contact_phone || sellerProfile?.phone || t.common.notSpecified) : t.common.notSpecified}
                      </div>
                    </div>
                  )}

                  <div>
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{t.common.location}</div>
                    <div className="text-[11px] font-bold leading-tight">
                      <div className="text-gray-900 line-clamp-1">{listing.show_location === true && listing.address ? listing.address : ''}</div>
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
              {t.productDetail.description}
            </h2>

            {/* 5199 Animal Law Disclaimer for Pets category */}
            {(listing.category === 'haustiere' || listing.category === 'Evcil Hayvanlar') && (
              <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg">
                <div className="flex gap-3">
                  <svg className="w-5 h-5 text-red-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <p className="text-xs text-red-800 leading-relaxed font-medium">
                    {t.footer.animalLawDisclaimer}
                  </p>
                </div>
              </div>
            )}

            {/* Real Estate Disclaimer */}
            {(listing.category === 'immobilien' || listing.category === 'Emlak') && (
              <div className="mb-4 p-4 bg-blue-50 border-l-4 border-blue-500 rounded-r-lg">
                <div className="flex gap-3">
                  <svg className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  <p className="text-xs text-blue-800 leading-relaxed font-medium">
                    {t.footer.realEstateDisclaimer}
                  </p>
                </div>
              </div>
            )}

            {/* Vehicle Disclaimer */}
            {(listing.category === 'auto, rad & boot' || listing.category === 'Otomobil, Bisiklet & Tekne') && (
              <div className="mb-4 p-4 bg-orange-50 border-l-4 border-orange-500 rounded-r-lg">
                <div className="flex gap-3">
                  <svg className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <p className="text-xs text-orange-800 leading-relaxed font-medium">
                    {t.footer.vehicleDisclaimer}
                  </p>
                </div>
              </div>
            )}

            <div className="text-[13px] text-gray-700 whitespace-pre-wrap leading-relaxed">
              {listing.description}
            </div>
          </div>

          {/* Technical Details Grid */}
          <div className="mb-6">
            <h2 className="text-lg font-black uppercase tracking-tight border-b border-gray-100 pb-1 mb-3">
              {t.productDetail.details}
            </h2>
            <div className="grid grid-cols-2 gap-x-12 gap-y-1">
              {/* Common Fields */}
              {renderDetailRow(t.productDetail.condition, translateVal(listing.condition))}
              {renderDetailRow(t.addListing.brand, listing.marke || listing.car_brand || listing.brand || listing.carBrand)}
              {renderDetailRow(t.productDetail.model, listing.modell || listing.car_model || listing.carModel)}

              {/* Car Specific */}
              {renderDetailRow(t.productDetail.mileage, (listing.kilometerstand || listing.kilometer || listing.kilometerStand) ? `${(listing.kilometerstand || listing.kilometer || listing.kilometerStand).toLocaleString('tr-TR')} km` : null)}
              {renderDetailRow(t.productDetail.firstRegistration, listing.erstzulassung || listing.bj)}
              {renderDetailRow(t.productDetail.fuelType, listing.kraftstoff || listing.fuel_type)}
              {renderDetailRow(t.productDetail.power, (listing.leistung || listing.power) ? `${listing.leistung || listing.power} PS` : null)}
              {renderDetailRow(t.productDetail.transmission, listing.getriebe)}
              {renderDetailRow(t.productDetail.exteriorColor, translateVal(listing.exterior_color))}
              {renderDetailRow(t.productDetail.interiorMaterial, translateVal(listing.interior_material))}
              {renderDetailRow(t.productDetail.huUntil, listing.hu)}

              {/* Real Estate Specific */}
              {renderDetailRow(t.productDetail.propertyType, translateVal(listing.wohnungstyp || listing.haustyp || listing.objektart))}
              {renderDetailRow(t.productDetail.livingSpace, listing.living_space ? `${listing.living_space} m²` : null)}
              {renderDetailRow(t.productDetail.rooms, listing.rooms)}
              {renderDetailRow(t.productDetail.floor, listing.floor)}
              {renderDetailRow(t.productDetail.constructionYear, listing.construction_year)}
              {renderDetailRow(t.productDetail.plotArea, listing.plot_area ? `${listing.plot_area} m²` : null)}
              {renderDetailRow(t.productDetail.availableFrom, listing.available_from)}

              {/* Pet Specific */}
              {renderDetailRow(t.productDetail.art, listing.katzen_art || listing.dog_art || listing.pet_art || listing.art)}
              {renderDetailRow(t.productDetail.age, listing.katzen_alter || listing.pet_age || listing.alter)}
              {renderDetailRow(t.productDetail.vaccinatedAndChipped, listing.katzen_geimpft || listing.vaccinated)}
              {renderDetailRow(t.productDetail.officialPermission, listing.katzen_erlaubnis || listing.permission)}

              {/* Clothes Specific */}
              {renderDetailRow(t.addListing.size, listing.size || listing.baby_kinderkleidung_size || listing.baby_kinderschuhe_size || listing.damenbekleidung_size)}
              {renderDetailRow(t.addListing.color, listing.color || listing.baby_kinderkleidung_color || listing.baby_kinderschuhe_color || listing.damenbekleidung_color)}

              {/* Item Art (General) */}
              {renderDetailRow(t.productDetail.art, listing.audio_hifi_art || listing.dienstleistungen_elektronik_art || listing.foto_art || listing.handy_telefon_art || listing.haushaltsgeraete_art || listing.konsolen_art || listing.notebooks_art || listing.pc_zubehoer_software_art || listing.pcs_art || listing.tablets_reader_art || listing.tv_video_art || listing.videospiele_art || listing.art_type || listing.autoteile_art || listing.boote_art || listing.motorrad_art || listing.wohnwagen_art || listing.beauty_gesundheit_art || listing.damenbekleidung_art || listing.gartenzubehoer_art || listing.kueche_esszimmer_art || listing.heimwerken_art || listing.schlafzimmer_art || listing.bike_art || listing.wohnzimmer_art)}
            </div>
          </div>

          {/* Amenities & Features */}
          {(listing.car_amenities?.length > 0 || listing.amenities?.length > 0 || listing.general_features?.length > 0) && (
            <div className="mb-6">
              <h2 className="text-lg font-black uppercase tracking-tight border-b border-gray-100 pb-1 mb-3">
                {t.productDetail.amenities} & {t.productDetail.features}
              </h2>
              <div className="flex flex-wrap gap-x-6 gap-y-2">
                {[...(listing.car_amenities || []), ...(listing.amenities || []), ...(listing.general_features || [])].map((item, i) => (
                  <div key={i} className="flex items-center gap-1.5 text-[11px] font-bold text-gray-700">
                    <svg className="w-3.5 h-3.5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                    {translateVal(item)}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Internal Branding */}
          <div className="border-t border-gray-100 pt-3 flex justify-between items-center text-gray-300 font-bold uppercase tracking-widest text-[8px] w-full mt-4">
            <div className="flex items-center gap-1">
              <span className="text-red-600 text-[10px] font-black">ExVitrin</span>
              <span>{t.common.onlineMarketplace}</span>
            </div>
            <div>www.exvitrin.com</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const ProductDetail = ({ addToCart, toggleFavorite, isFavorite, toggleFollowSeller, isSellerFollowed }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [printHideContact, setPrintHideContact] = useState(false);


  // ALL HOOKS MUST BE CALLED BEFORE ANY CONDITIONAL RETURNS
  // State for listing data
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for seller profile
  const [sellerProfile, setSellerProfile] = useState(null);
  const [sellerLoading, setSellerLoading] = useState(true);

  const [activeImage, setActiveImage] = useState(0);
  const [showPhone, setShowPhone] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [currentStock, setCurrentStock] = useState(1); // Initialize with a default, will be updated by useEffect
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
  const [reservation, setReservation] = useState(null);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [sellerRecentListings, setSellerRecentListings] = useState([]);
  const [categoryListings, setCategoryListings] = useState([]);
  const [sellerRating, setSellerRating] = useState(null);
  const [sellerRatings, setSellerRatings] = useState([]);
  const [selectedPromotions, setSelectedPromotions] = useState([]);
  const { user } = useAuth();
  const isMobile = useIsMobile();

  const promotionPackages = [
    { id: 'bump', name: 'Yukarı Çıkar', price: '4,99', duration: 1, effect: 'Yeni dikkat çekin! İlanınız yeni bir ilan gibi görünecek.' },
    { id: 'highlight', name: 'Öne Çıkan', price: '9,99', duration: 7, effect: '2 kata kadar daha fazla görünürlük! İlanınız renkli olarak vurgulanacak.' },
    { id: 'multi-bump', name: 'Tekrarlı Yukarı Çıkarma', price: '16,99', duration: 7, effect: '5 kata kadar daha fazla görünürlük! Bir hafta boyunca ilanınız her gün yukarı çıkarılacak.' },
    { id: 'z_premium', name: 'Premium', price: '19,99', duration: 7, effect: '10 kata kadar daha fazla görünürlük! İlanınız listenin en başında yer alacak!' },
    { id: 'galerie', name: 'Vitrin', price: '59,99', duration: 10, effect: '15 kata kadar daha fazla görünürlük! İlanınız ana sayfada da görünecek!' },
  ];

  // Fetch listing from Supabase
  const isOwnListing = user && listing && user.id === listing.user_id;

  useEffect(() => {
    const loadListing = async () => {
      try {
        setLoading(true);
        const { fetchListingById } = await import('./api/listings');
        const data = await fetchListingById(id);
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
          data.fahrzeugtyp = 'Limousine';
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
          data.versand_art = "Nur Abholung";
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
          data.fahrzeugtyp = 'Limousine';
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
          data.versand_art = "Versand möglich";
        }

        // Check for expiry (Use expiry_date or default to 90 days)
        if (data && (data.expiry_date || data.created_at)) {
          const expiryDate = data.expiry_date
            ? new Date(data.expiry_date)
            : new Date(new Date(data.created_at).getTime() + 90 * 24 * 60 * 60 * 1000);

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
            const { fetchUserProfile } = await import('./api/profile');
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

    if (id) {
      loadListing();
    }
  }, [id]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  // Auto-fill contact form with user profile data
  useEffect(() => {
    const loadUserProfile = async () => {
      if (user) {
        try {
          const { fetchUserProfile } = await import('./api/profile');
          const profile = await fetchUserProfile(user.id);
          if (profile) {
            setContactName(profile.full_name || '');
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
        localStorage.setItem('viewedListings', JSON.stringify(viewedListings));
      }

      // Track viewed categories
      const viewedCategories = JSON.parse(localStorage.getItem('viewedCategories') || '[]');
      if (!viewedCategories.includes(listing.category)) {
        viewedCategories.push(listing.category);
        localStorage.setItem('viewedCategories', JSON.stringify(viewedCategories));
      }
      if (listing.sub_category && !viewedCategories.includes(listing.sub_category)) {
        viewedCategories.push(listing.sub_category);
        localStorage.setItem('viewedCategories', JSON.stringify(viewedCategories));
      }
    }
  }, [listing]);

  // Load seller rating
  useEffect(() => {
    if (listing?.user_id) {
      const loadSellerRating = async () => {
        try {
          const { getUserRating, getRatings } = await import('./api/ratings');
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
          const { supabase } = await import('./lib/supabase');
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
          const { fetchListings } = await import('./api/listings');

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
        const { favoritesApi } = await import('./api/favorites');
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
    if (listing && listing.id) {
      const incrementView = async () => {
        try {
          const { incrementListingView } = await import('./api/views');
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="medium" className="mb-4" />
          <p className="text-gray-600">İlan yükleniyor...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error || !listing) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">İlan bulunamadı</h2>
          <p className="text-gray-600 mb-4">{error || 'Bu ilan mevcut değil.'}</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            {t.common.backToHome}
          </button>
        </div>
      </div>
    );
  }

  // Use seller profile from Supabase or fallback to default
  // Use seller profile from Supabase or fallback to listing data if joined, otherwise default
  const seller = sellerProfile || {
    id: listing?.user_id,
    full_name: listing?.profiles?.full_name || t.productDetail.unknownSeller,
    avatar_url: listing?.profiles?.avatar_url || null,
    store_logo: listing?.profiles?.store_logo || null,
    created_at: listing?.profiles?.created_at || new Date().toISOString(),
    is_pro: listing?.profiles?.is_pro,
    is_commercial: listing?.profiles?.is_commercial,
    subscription_tier: listing?.profiles?.subscription_tier,
    user_number: listing?.profiles?.user_number,
    last_seen: listing?.profiles?.last_seen,
    seller_type: listing?.profiles?.seller_type
  };

  // Calculate actual seller listing count
  // TODO: Fetch actual count from Supabase when needed
  const sellerListingsCount = 0;

  // NOW conditional returns AFTER all hooks
  if (!listing) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">İlan bulunamadı</h2>
          <p className="text-gray-600 mb-6">Aradığınız ilan maalesef artık mevcut değil.</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 transition-colors"
          >
            Ana Sayfa'ya Dön
          </button>
        </div>
      </div>
    );
  }

  const sellerId = listing.sellerId;

  const handleModalSubmit = async (data) => {
    try {
      const { sendMessage } = await import('./api/messages');
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
  const isCommercial = seller.is_pro || seller.is_commercial || seller.seller_type === 'Gewerblicher Nutzer' || (seller && seller.seller_type === 'commercial') || sellerProfile?.seller_type === 'Gewerblicher Nutzer';
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
      const { sendMessage } = await import('./api/messages');
      await sendMessage({
        sender_id: user.id,
        receiver_id: listing.user_id,
        listing_id: listing.id,
        message: contactMessage,
        sender_name: contactName,
        sender_phone: contactPhone
      });

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
        const { sendMessage } = await import('./api/messages');
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
      const { reportListing } = await import('./api/reports');
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
        alert('İlan silinirken hata oluştu');
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
        const { supabase } = await import('./lib/supabase');
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
    // Note: Price updated to 3.99 for 90 days
    if (window.confirm(t.productDetail.ownerDashboard.extendConfirm.replace('{price}', '3,49₺'))) {
      try {
        const { purchasePromotion } = await import('./api/promotions');

        // New Logic: Update expiry_date directly by 90 days
        // If currently expired, set to now + 90 days
        // If active, add 90 days to current expiry_date
        const now = new Date();
        const currentExpiry = listing.expiry_date ? new Date(listing.expiry_date) : new Date(new Date(listing.created_at).getTime() + 90 * 24 * 60 * 60 * 1000);

        let newExpiryDate;

        if (currentExpiry < now) {
          // Already expired, start fresh 90 days from now
          newExpiryDate = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000);
        } else {
          // Still active, extend current expiry by 90 days
          newExpiryDate = new Date(currentExpiry.getTime() + 90 * 24 * 60 * 60 * 1000);
        }

        // Use purchasePromotion to record the transaction and update the listing
        await purchasePromotion(listing.id, {
          id: 'verlängerung',
          price: 3.49, // Adjusted price for longer duration
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
        const { supabase } = await import('./lib/supabase');
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

    if (window.confirm(`${names} toplam ${totalStr}₺ karşılığında satın alınsın mı?\n\nÜcret hesabınızdan düşülecektir.`)) {
      try {
        const { purchasePromotion } = await import('./api/promotions');

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

          /* The Flyer - Full Content Multi-page 지원 */
          .print-flyer {
            display: block !important;
            visibility: visible !important;
            position: relative !important;
            width: 100% !important;
            height: auto !important;
            margin: 0 !important;
            padding: 15mm !important;
            background: white !important;
            box-sizing: border-box !important;
          }

          #root, .App {
            height: auto !important;
            min-height: 0 !important;
          }
        }
      `}</style>

      <div className={`min-h-screen bg-gray-50 no-print ${isMobile ? 'pb-32' : ''}`}>
        {listing && <ProductSEO product={listing} />}
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
              className="text-gray-700 hover:text-red-500 font-medium transition-colors whitespace-nowrap"
            >
              {listing.category}
            </button>
            {listing.sub_category && (
              <>
                <span className="text-gray-400">›</span>
                <button
                  onClick={() => navigate(getCategoryPath(listing.category, listing.sub_category))}
                  className="text-gray-700 hover:text-red-500 font-medium transition-colors whitespace-nowrap truncate max-w-[150px] sm:max-w-none"
                >
                  {normalizeSubcategoryName(listing.sub_category)}
                </button>
              </>
            )}
          </div>

          {/* Owner Dashboard Overlay */}
          {isOwnListing && (
            <div className="mb-6 bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-red-500/20 no-print">
              <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-4 sm:p-6 text-white">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="space-y-1">
                    <h2 className="text-xl sm:text-2xl font-black flex items-center gap-2">
                      <span className="bg-red-500 text-white p-1.5 rounded-lg">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </span>
                      {t.productDetail.ownerDashboard.title}
                    </h2>
                    <p className="text-gray-400 text-xs font-medium uppercase tracking-wider">{t.productDetail.ownerDashboard.subtitle}</p>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 sm:gap-8">
                    <div className="text-center group cursor-help">
                      <div className="text-2xl sm:text-3xl font-black text-white group-hover:text-red-400 transition-colors">{(listing.views || 0).toLocaleString('tr-TR')}</div>
                      <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{t.productDetail.ownerDashboard.visits}</div>
                    </div>
                    <div className="w-px h-10 bg-gray-700 hidden sm:block" />
                    <div className="text-center group cursor-help">
                      <div className="text-2xl sm:text-3xl font-black text-white group-hover:text-red-400 transition-colors">{(favoriteCount || 0).toLocaleString('tr-TR')}</div>
                      <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{t.productDetail.ownerDashboard.wishlist}</div>
                    </div>
                    <div className="w-px h-10 bg-gray-700 hidden sm:block" />
                    {listing.promotion_expiry && new Date(listing.promotion_expiry) > new Date() && (
                      <div className="text-center">
                        <ListingCountdown
                          expiryDate={new Date(listing.promotion_expiry)}
                          onExpire={() => {
                            // Optional: refresh or handle expiry
                          }}
                        />
                        <div className="text-[10px] font-bold text-yellow-400 uppercase tracking-widest">{t.productDetail.ownerDashboard.activePromotion}</div>
                      </div>
                    )}
                    {listing.promotion_expiry && new Date(listing.promotion_expiry) > new Date() && (
                      <div className="w-px h-10 bg-gray-700 hidden sm:block" />
                    )}
                    <div className="text-center">
                      <ListingCountdown
                        expiryDate={listing.expiry_date ? new Date(listing.expiry_date) : new Date(new Date(listing.created_at).getTime() + 90 * 24 * 60 * 60 * 1000)}
                        onExpire={() => {
                          // Optional: refresh or handle expiry
                        }}
                      />
                      <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{t.productDetail.ownerDashboard.adExpiry}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-3 sm:p-4 bg-gray-50/50">
                <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-6 gap-2 mb-6">
                  <button
                    onClick={handleEditDetail}
                    className="flex flex-col items-center justify-center p-3 bg-white rounded-xl border border-gray-200 hover:border-red-500 hover:shadow-lg transition-all group"
                  >
                    <svg className="w-5 h-5 text-gray-400 group-hover:text-red-500 mb-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    <span className="text-[10px] sm:text-xs font-bold text-gray-700">{t.productDetail.ownerDashboard.edit}</span>
                  </button>

                  <button
                    onClick={handleReserveDetail}
                    className={`flex flex-col items-center justify-center p-3 bg-white rounded-xl border ${listing.reserved_by ? 'border-orange-500 bg-orange-50' : 'border-gray-200'} hover:border-blue-500 hover:shadow-lg transition-all group`}
                  >
                    <svg className={`w-5 h-5 ${listing.reserved_by ? 'text-orange-500' : 'text-gray-400'} group-hover:text-blue-500 mb-1.5`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-[10px] sm:text-xs font-bold text-gray-700 text-center">{listing.reserved_by ? t.productDetail.ownerDashboard.unreserve : t.productDetail.ownerDashboard.reserve}</span>
                  </button>

                  <button
                    onClick={handleExtendDetail}
                    className="flex flex-col items-center justify-center p-3 bg-white rounded-xl border border-gray-200 hover:border-green-500 hover:shadow-lg transition-all group relative"
                  >
                    <svg className="w-5 h-5 text-gray-400 group-hover:text-green-500 mb-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    <span className="text-[10px] sm:text-xs font-bold text-gray-700 text-center leading-none">{t.productDetail.ownerDashboard.extend}<br /><span className="text-[9px] text-green-600 font-black">(3,49₺)</span></span>
                  </button>

                  <button
                    onClick={handleDeleteDetail}
                    className="flex flex-col items-center justify-center p-3 bg-white rounded-xl border border-gray-200 hover:border-red-600 hover:shadow-lg transition-all group"
                  >
                    <svg className="w-5 h-5 text-gray-400 group-hover:text-red-600 mb-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    <span className="text-[10px] sm:text-xs font-bold text-gray-700">{t.productDetail.ownerDashboard.delete}</span>
                  </button>

                  <button
                    onClick={() => {
                      setPrintHideContact(true);
                      setTimeout(() => window.print(), 100);
                    }}
                    className="flex flex-col items-center justify-center p-3 bg-white rounded-xl border border-gray-200 hover:border-purple-500 hover:shadow-lg transition-all group"
                  >
                    <svg className="w-5 h-5 text-gray-400 group-hover:text-purple-500 mb-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                    </svg>
                    <span className="text-[10px] sm:text-xs font-bold text-gray-700 text-center leading-none">{t.productDetail.ownerDashboard.printFlyer.split(' ').slice(0, 1).join(' ')}<br /><span className="text-[9px]">{t.productDetail.ownerDashboard.printFlyer.split(' ').slice(1).join(' ')}</span></span>
                  </button>

                  <button
                    onClick={() => navigate('/my-invoices')}
                    className="flex flex-col items-center justify-center p-3 bg-white rounded-xl border border-gray-200 hover:border-red-500 hover:shadow-lg transition-all group"
                  >
                    <svg className="w-5 h-5 text-gray-400 group-hover:text-red-500 mb-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span className="text-[10px] sm:text-xs font-bold text-gray-700">{t.productDetail.ownerDashboard.invoices}</span>
                  </button>

                </div>

                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="bg-gray-100">
                        <tr className="text-[10px] font-black uppercase tracking-widest text-gray-500">
                          <th className="px-6 py-4 w-10">Select</th>
                          <th className="px-6 py-4">{t.productDetail.ownerDashboard.highlightTitle}</th>
                          <th className="px-6 py-4">{t.productDetail.ownerDashboard.effect}</th>
                          <th className="px-6 py-4">{t.productDetail.ownerDashboard.duration}</th>
                          <th className="px-6 py-4 text-right w-32">{t.productDetail.ownerDashboard.price}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 text-sm">
                        {promotionPackages.map((pkg, idx) => (
                          <tr
                            key={pkg.id}
                            onClick={() => togglePromotionSelection(pkg.id)}
                            className={`hover:bg-red-50/30 transition-colors group cursor-pointer ${idx % 2 !== 0 ? 'bg-red-50/10' : ''} ${selectedPromotions.includes(pkg.id) ? 'bg-red-50' : ''}`}
                          >
                            <td className="px-6 py-4">
                              <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${selectedPromotions.includes(pkg.id) ? 'bg-red-500 border-red-500' : 'border-gray-300 bg-white'}`}>
                                {selectedPromotions.includes(pkg.id) && (
                                  <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                  </svg>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4 font-black text-gray-900 group-hover:text-red-500">{pkg.name}</td>
                            <td className="px-6 py-4 text-gray-500 font-medium">{pkg.effect}</td>
                            <td className="px-6 py-4 font-bold text-gray-600">{pkg.duration === 1 ? t.productDetail.ownerDashboard.once : `${pkg.duration} ${t.productDetail.ownerDashboard.days}`}</td>
                            <td className="px-6 py-4 text-right font-black text-red-600">{pkg.price} ₺</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Promotion Cart Summary */}
                  {selectedPromotions.length > 0 && (
                    <div className="p-6 bg-gray-900 text-white border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div className="flex items-center gap-6">
                        <div className="bg-red-500 text-white p-2 rounded-lg animate-bounce">
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                        </div>
                        <div>
                          <div className="text-[10px] font-black uppercase tracking-widest text-gray-400">Seçilen Paketler: {selectedPromotions.length}</div>
                          <div className="text-2xl font-black">{t.productDetail.ownerDashboard.totalPrice}: {calculateTotal()} ₺</div>
                        </div>
                      </div>
                      <button
                        onClick={() => handlePromotionPurchase()}
                        className="w-full sm:w-auto px-10 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-black text-lg shadow-xl shadow-red-600/20 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
                      >
                        {t.productDetail.ownerDashboard.buyNow}
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </button>
                    </div>
                  )}

                  <div className="bg-gray-50 px-6 py-3 text-[10px] font-bold text-gray-400 text-right uppercase tracking-[0.2em]">
                    {t.productDetail.ownerDashboard.vatIncluded}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 printable-content">
            {/* Sol Taraf - Ürün Açıklaması */}
            <div className="lg:col-span-2 space-y-4 sm:space-y-6">
              {/* Ürün Resmi */}
              <div className="bg-white rounded-lg shadow-lg overflow-hidden relative hover:shadow-xl transition-shadow duration-300 z-0">
                {/* Inner panel for main image */}
                {/* Inner panel for main image */}
                <div className="bg-white rounded-lg overflow-hidden shadow-inner p-3">
                  <div className="relative w-full h-[525px] bg-gray-50 flex items-center justify-center rounded-lg overflow-hidden border border-gray-100">
                    <img
                      src={(listing.images && listing.images[activeImage]) || listing.image}
                      alt={listing.title}
                      className="w-full h-full object-cover z-10"
                      onClick={() => setShowLightbox(true)}
                    />
                    {listing.images && listing.images.length > 0 && (
                      <div className="absolute bottom-3 right-3 bg-black/60 text-white px-3 py-1 rounded-full text-xs font-medium z-20 backdrop-blur-sm">
                        {t.productDetail.imageCount.replace('{current}', activeImage + 1).replace('{total}', listing.images.length)}
                      </div>
                    )}


                    {/* Navigation Arrows */}
                    {listing.images && listing.images.length > 1 && (
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
                    <div className="mt-3 flex gap-2 overflow-x-auto pb-2 scrollbar-none scroll-smooth">
                      {listing.images.map((img, index) => (
                        <button
                          key={index}
                          onClick={() => setActiveImage(index)}
                          className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 ${activeImage === index ? 'border-red-500' : 'border-transparent hover:border-gray-200'
                            }`}
                        >
                          <img
                            src={img}
                            alt={`${listing.title} thumbnail ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                          {activeImage === index && (
                            <div className="absolute inset-0 bg-red-500/10" />
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                {/* Favori Kalp Butonu */}
                {!isOwnListing && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite && toggleFavorite(listing.id);
                    }}
                    className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full shadow hover:bg-white hover:scale-110 transition-all duration-200 z-30 flex items-center justify-center"
                    title={favorite ? 'Aus Merkliste entfernen' : 'Zur Merkliste hinzufügen'}
                  >
                    {favorite ? (
                      <svg className="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    ) : (
                      <svg className="w-6 h-6 text-gray-400 group-hover:text-red-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    )}
                  </button>
                )}
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
              <div className="bg-white rounded-lg shadow-lg p-6">
                {/* Ürün Başlığı ve Bilgileri */}
                <div className="space-y-6">
                  {/* Başlık ve Fiyat - Üst Kısım - Back to top per user request */}
                  <div className="pb-6 border-b border-gray-100">
                    {/* Fiyat - En Üstte */}
                    {listing.sub_category !== 'Ausbildung' && listing.sub_category !== 'Bau, Handwerk & Produktion' && listing.category !== 'Jobs' && (
                      <div className="mb-4">
                        <div className="text-2xl font-bold text-gray-900 mb-1">
                          {listing.price_type === 'giveaway' || listing.price === 0
                            ? t.productDetail.giveaway
                            : typeof listing.price === 'number'
                              ? `${listing.price.toLocaleString('tr-TR')} ₺${listing.price_type === 'negotiable' ? ' ' + t.productDetail.negotiable : ''}`
                              : listing.price?.toString().includes('₺')
                                ? listing.price
                                : listing.price ? `${listing.price} ₺${listing.price_type === 'negotiable' ? ' ' + t.productDetail.negotiable : ''}` : t.productDetail.negotiable}
                        </div>
                        {listing.stock && (
                          <div className="text-sm text-gray-500">
                            {t.productDetail.stock.replace('{count}', listing.stock || 1)}
                          </div>
                        )}

                        {/* Favorite Count */}
                        {favoriteCount > 0 && (
                          <div className="flex items-center gap-2 text-sm text-gray-600 mt-2">
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
                      <h1 className="text-lg font-bold text-gray-900 leading-tight">
                        {listing.title}
                      </h1>
                    </div>
                  </div>

                  {/* General Info Grid - Below Title/Price */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 text-sm pb-8 border-b border-gray-100 mb-12">
                    <div className="flex justify-between">
                      <span className="text-gray-500">{t.productDetail.postedOn}</span>
                      <span className="font-semibold text-gray-900">
                        {listing.created_at ? new Date(listing.created_at).toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' }) : 'N/A'}
                      </span>
                    </div>
                    {listing.condition && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">{t.addListing.condition || 'Durum'}</span>
                        <span className="font-semibold text-gray-900">
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
                      <span className="text-gray-500">{t.productDetail.listingId}</span>
                      <span className="font-semibold text-gray-900">{generateListingNumber(listing)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">{t.productDetail.location}</span>
                      <div className="text-right">
                        <span className="font-semibold text-gray-900 block">
                          {listing.show_location === true && listing.address ? `${listing.address}, ` : ''}
                          {listing.district ? `${listing.district}, ` : ''}
                          {listing.city || ''}
                          {!listing.city && t.common.notAvailable}
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">{t.productDetail.views}</span>
                      <span className="font-semibold text-gray-900">{(listing.views || 0).toLocaleString('tr-TR')}</span>
                    </div>
                    {listing.versand_art && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">{t.addListing.shipping}</span>
                        <span className="font-semibold text-gray-900">
                          {listing.versand_art === 'Versand möglich' ? t.addListing.options.shipping :
                            listing.versand_art === 'Nur Abholung' ? t.addListing.options.noShipping :
                              listing.versand_art}
                        </span>
                      </div>
                    )}

                  </div>


                  {/* Quantity Selector - Only for New items */}
                  {listing.condition === 'Neu' && (
                    <div className="flex items-center gap-4 p-4 bg-blue-50 border border-blue-100 rounded-lg">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                      <span className="text-sm font-medium text-gray-700">Menge:</span>
                      <div className="flex items-center border-2 border-gray-300 rounded-full bg-white overflow-hidden">
                        <button
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          className="px-4 py-2 hover:bg-gray-50 text-gray-700 font-bold transition-colors"
                          type="button"
                        >−</button>
                        <div className="w-16 text-center font-bold text-gray-900 border-x border-gray-300 py-2">{quantity}</div>
                        <button
                          onClick={() => setQuantity(Math.min(currentStock, quantity + 1))}
                          className="px-4 py-2 hover:bg-gray-50 text-gray-700 font-bold transition-colors"
                          type="button"
                        >+</button>
                      </div>
                      <span className="text-sm text-gray-600">
                        <span className="font-semibold text-gray-900">{currentStock}</span> adet mevcut
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
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
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
                          <h2 className="text-2xl font-bold text-gray-900">
                            {t.productDetail.vehicleDetails}
                          </h2>
                        </div>

                        {/* Specs Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-5 text-sm mb-8">
                          {(listing.marke || listing.car_brand || listing.carBrand) && (
                            <div className="flex justify-between">
                              <span className="text-gray-600 font-medium">{t.productDetail.manufacturer}</span>
                              <span className="font-bold text-gray-900">{listing.marke || listing.car_brand || listing.carBrand}</span>
                            </div>
                          )}
                          {(listing.modell || listing.car_model || listing.carModel) && (
                            <div className="flex justify-between">
                              <span className="text-gray-600 font-medium">{t.productDetail.model}</span>
                              <span className="font-bold text-gray-900">{listing.modell || listing.car_model || listing.carModel}</span>
                            </div>
                          )}
                          {(listing.vehicle_type || listing.fahrzeugtyp || listing.fhz_type || listing.vehicleType) && (
                            <div className="flex justify-between">
                              <span className="text-gray-600 font-medium">{t.productDetail.propertyType || t.productDetail.art}</span>
                              <span className="font-bold text-gray-900">{translateVal(listing.vehicle_type || listing.fahrzeugtyp || listing.fhz_type || listing.vehicleType)}</span>
                            </div>
                          )}
                          {(listing.kilometerstand !== undefined && listing.kilometerstand !== null || listing.kilometer !== undefined && listing.kilometer !== null || listing.kilometerStand !== undefined && listing.kilometerStand !== null) && (
                            <div className="flex justify-between">
                              <span className="text-gray-600 font-medium">{t.productDetail.mileage}</span>
                              <span className="font-bold text-gray-900">{(listing.kilometerstand || listing.kilometer || listing.kilometerStand).toLocaleString('tr-TR')} km</span>
                            </div>
                          )}
                          {(listing.erstzulassung || listing.bj) && (
                            <div className="flex justify-between">
                              <span className="text-gray-600 font-medium">{t.productDetail.firstRegistration}</span>
                              <span className="font-bold text-gray-900">{listing.erstzulassung || listing.bj}</span>
                            </div>
                          )}
                          {(listing.kraftstoff || listing.fuel_type) && (
                            <div className="flex justify-between">
                              <span className="text-gray-600 font-medium">{t.productDetail.fuelType}</span>
                              <span className="font-bold text-gray-900">{listing.kraftstoff || listing.fuel_type}</span>
                            </div>
                          )}
                          {(listing.leistung || listing.power) && (
                            <div className="flex justify-between">
                              <span className="text-gray-600 font-medium">{t.productDetail.power}</span>
                              <span className="font-bold text-gray-900">{listing.leistung || listing.power} PS</span>
                            </div>
                          )}
                          {listing.hubraum && (
                            <div className="flex justify-between">
                              <span className="text-gray-600 font-medium">{t.productDetail.displacement}</span>
                              <span className="font-bold text-gray-900">{listing.hubraum} cm³</span>
                            </div>
                          )}
                          {listing.getriebe && (
                            <div className="flex justify-between">
                              <span className="text-gray-600 font-medium">{t.productDetail.transmission}</span>
                              <span className="font-bold text-gray-900">{listing.getriebe}</span>
                            </div>
                          )}
                          {listing.door_count && (
                            <div className="flex justify-between">
                              <span className="text-gray-600 font-medium">{t.productDetail.doorCount}</span>
                              <span className="font-bold text-gray-900">{listing.door_count}</span>
                            </div>
                          )}
                          {listing.hu && (
                            <div className="flex justify-between">
                              <span className="text-gray-500 font-medium">{t.productDetail.huUntil}</span>
                              <span className="font-bold text-gray-900">{listing.hu}</span>
                            </div>
                          )}
                          {(listing.emission_badge || listing.emission_sticker) && (
                            <div className="flex justify-between">
                              <span className="text-gray-600 font-medium">{t.productDetail.emissionBadge}</span>
                              <span className="font-bold text-gray-900">{listing.emission_badge || listing.emission_sticker}</span>
                            </div>
                          )}
                          {(listing.schadstoffklasse || listing.emission_class) && (
                            <div className="flex justify-between">
                              <span className="text-gray-600 font-medium">{t.productDetail.emissionClass}</span>
                              <span className="font-bold text-gray-900">{translateVal(listing.schadstoffklasse || listing.emission_class)}</span>
                            </div>
                          )}
                          {listing.exterior_color && (
                            <div className="flex justify-between">
                              <span className="text-gray-600 font-medium">{t.productDetail.exteriorColor}</span>
                              <span className="font-bold text-gray-900">{translateVal(listing.exterior_color)}</span>
                            </div>
                          )}
                          {listing.interior_material && (
                            <div className="flex justify-between">
                              <span className="text-gray-600 font-medium">{t.productDetail.interiorMaterial}</span>
                              <span className="font-bold text-gray-900">{translateVal(listing.interior_material)}</span>
                            </div>
                          )}
                        </div>

                        {/* Status Tags */}
                        <div className="flex flex-wrap gap-8 mb-8">
                          {listing.unfallfrei && (
                            <span className="text-gray-900 text-xs font-bold">
                              Kazasız
                            </span>
                          )}
                          {listing.scheckheftgepflegt && (
                            <span className="text-gray-900 text-xs font-bold">
                              Bakımlı (Servis Bakımlı)
                            </span>
                          )}
                          {listing.nichtraucher_fahrzeug && (
                            <span className="text-gray-900 text-xs font-bold">
                              Sigara İçilmemiş
                            </span>
                          )}
                        </div>

                        {/* Car Amenities */}
                        {listing.car_amenities && listing.car_amenities.length > 0 && (
                          <div className="pt-8 border-t border-gray-200">
                            <h3 className="text-lg font-bold text-gray-900 mb-5">
                              {t.productDetail.amenities}
                            </h3>
                            <div className="grid grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-6">
                              {listing.car_amenities.map(amenity => (
                                <div key={amenity} className="flex items-center gap-2 text-[13px] text-gray-700 font-medium">
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
                    <h2 className="text-lg font-bold text-gray-900 mb-4">
                      {t.productDetail.details}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 text-sm pb-8 mb-8">
                      <div className="flex justify-between">
                        <span className="text-gray-500">{t.productDetail.art}</span>
                        <span className="font-semibold text-gray-900">{listing.wohnzimmer_art}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Schlafzimmer, Küche, Heimwerken & Beleuchtung Details */}
                {(listing.schlafzimmer_art || listing.kueche_esszimmer_art || listing.heimwerken_art || listing.lamba_aydinlatma_art) && (
                  <div className="mb-8">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">
                      {t.productDetail.details}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 text-sm pb-8 mb-8">
                      {listing.schlafzimmer_art && (
                        <div className="flex justify-between">
                          <span className="text-gray-500">{t.productDetail.art}</span>
                          <span className="font-semibold text-gray-900">{listing.schlafzimmer_art}</span>
                        </div>
                      )}
                      {listing.kueche_esszimmer_art && (
                        <div className="flex justify-between">
                          <span className="text-gray-500">{t.productDetail.art}</span>
                          <span className="font-semibold text-gray-900">{listing.kueche_esszimmer_art}</span>
                        </div>
                      )}
                      {listing.heimwerken_art && (
                        <div className="flex justify-between">
                          <span className="text-gray-500">{t.productDetail.art}</span>
                          <span className="font-semibold text-gray-900">{listing.heimwerken_art}</span>
                        </div>
                      )}
                      {listing.lamba_aydinlatma_art && (
                        <div className="flex justify-between">
                          <span className="text-gray-500">{t.productDetail.art}</span>
                          <span className="font-semibold text-gray-900">{listing.lamba_aydinlatma_art}</span>
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
                    <h2 className="text-lg font-bold text-gray-900 mb-4">
                      {t.productDetail.details}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 text-sm pb-8 mb-8">
                      {listing.pferde_art && (
                        <div className="flex justify-between">
                          <span className="text-gray-500">{t.productDetail.art}</span>
                          <span className="font-semibold text-gray-900">{listing.pferde_art}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Vermisste Tiere Details */}
                {(listing.vermisste_tiere_status) && (
                  <div className="mb-8">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">
                      {t.productDetail.details}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 text-sm pb-8 mb-8">
                      {listing.vermisste_tiere_status && (
                        <div className="flex justify-between">
                          <span className="text-gray-500">{t.productDetail.status}</span>
                          <span className="font-semibold text-gray-900">{listing.vermisste_tiere_status}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Vögel Details */}
                {(listing.voegel_art) && (
                  <div className="mb-8">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">
                      {t.productDetail.details}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 text-sm pb-8 mb-8">
                      {listing.voegel_art && (
                        <div className="flex justify-between">
                          <span className="text-gray-500">{t.productDetail.art}</span>
                          <span className="font-semibold text-gray-900">{listing.voegel_art}</span>
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
                      <h2 className="text-lg font-bold text-gray-900 mb-4">
                        {t.productDetail.details}
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 text-sm pb-8 mb-8">
                        {listing.audio_hifi_art && (
                          <div className="flex justify-between">
                            <span className="text-gray-500">{t.productDetail.art}</span>
                            <span className="font-semibold text-gray-900">{listing.audio_hifi_art}</span>
                          </div>
                        )}
                        {listing.handy_telefon_art && (
                          <div className="flex justify-between">
                            <span className="text-gray-500">{t.productDetail.art}</span>
                            <span className="font-semibold text-gray-900">{listing.handy_telefon_art}</span>
                          </div>
                        )}
                        {listing.foto_art && (
                          <div className="flex justify-between">
                            <span className="text-gray-500">{t.productDetail.art}</span>
                            <span className="font-semibold text-gray-900">{listing.foto_art}</span>
                          </div>
                        )}
                        {listing.haushaltsgeraete_art && (
                          <div className="flex justify-between">
                            <span className="text-gray-500">{t.productDetail.art}</span>
                            <span className="font-semibold text-gray-900">{listing.haushaltsgeraete_art}</span>
                          </div>
                        )}
                        {listing.konsolen_art && (
                          <div className="flex justify-between">
                            <span className="text-gray-500">{t.productDetail.art}</span>
                            <span className="font-semibold text-gray-900">{listing.konsolen_art}</span>
                          </div>
                        )}
                        {listing.pc_zubehoer_software_art && (
                          <div className="flex justify-between">
                            <span className="text-gray-500">{t.productDetail.art}</span>
                            <span className="font-semibold text-gray-900">{listing.pc_zubehoer_software_art}</span>
                          </div>
                        )}
                        {listing.tablets_reader_art && (
                          <div className="flex justify-between">
                            <span className="text-gray-500">{t.productDetail.art}</span>
                            <span className="font-semibold text-gray-900">{listing.tablets_reader_art}</span>
                          </div>
                        )}
                        {listing.tv_video_art && (
                          <div className="flex justify-between">
                            <span className="text-gray-500">{t.productDetail.art}</span>
                            <span className="font-semibold text-gray-900">{listing.tv_video_art}</span>
                          </div>
                        )}
                        {listing.notebooks_art && (
                          <div className="flex justify-between">
                            <span className="text-gray-500">{t.productDetail.art}</span>
                            <span className="font-semibold text-gray-900">{listing.notebooks_art}</span>
                          </div>
                        )}
                        {listing.pcs_art && (
                          <div className="flex justify-between">
                            <span className="text-gray-500">{t.productDetail.art}</span>
                            <span className="font-semibold text-gray-900">{listing.pcs_art}</span>
                          </div>
                        )}
                        {listing.videospiele_art && (
                          <div className="flex justify-between">
                            <span className="text-gray-500">{t.productDetail.art}</span>
                            <span className="font-semibold text-gray-900">{listing.videospiele_art}</span>
                          </div>
                        )}
                        {listing.weitere_elektronik_art && (
                          <div className="flex justify-between">
                            <span className="text-gray-500">{t.productDetail.art}</span>
                            <span className="font-semibold text-gray-900">{listing.weitere_elektronik_art}</span>
                          </div>
                        )}
                        {listing.dienstleistungen_elektronik_art && (
                          <div className="flex justify-between">
                            <span className="text-gray-500">{t.productDetail.art}</span>
                            <span className="font-semibold text-gray-900">{listing.dienstleistungen_elektronik_art}</span>
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
                          <span className="text-gray-500">{t.productDetail.offerType}</span>
                          <span className="font-semibold text-gray-900">{translateVal(listing.angebotsart)}</span>
                        </div>
                      )}
                      {listing.auf_zeit_wg_art && (
                        <div className="flex justify-between">
                          <span className="text-gray-500">{t.productDetail.offerType}</span>
                          <span className="font-semibold text-gray-900">{translateVal(listing.auf_zeit_wg_art)}</span>
                        </div>
                      )}
                      {listing.wohnungstyp && (
                        <div className="flex justify-between">
                          <span className="text-gray-500">{t.productDetail.propertyType}</span>
                          <span className="font-semibold text-gray-900">{translateVal(listing.wohnungstyp)}</span>
                        </div>
                      )}
                      {listing.haustyp && (
                        <div className="flex justify-between">
                          <span className="text-gray-500">{t.productDetail.propertyType}</span>
                          <span className="font-semibold text-gray-900">{translateVal(listing.haustyp)}</span>
                        </div>
                      )}
                      {listing.living_space && (
                        <div className="flex justify-between">
                          <span className="text-gray-500">{['Ticari Emlak', 'Konteyner', 'Arsa & Bahçe'].includes(listing.sub_category) ? t.productDetail.totalArea : t.productDetail.livingSpace}</span>
                          <span className="font-semibold text-gray-900">{listing.living_space} m²</span>
                        </div>
                      )}
                      {listing.rooms && (
                        <div className="flex justify-between">
                          <span className="text-gray-500">{t.productDetail.rooms}</span>
                          <span className="font-semibold text-gray-900">{listing.rooms}</span>
                        </div>
                      )}
                      {listing.floor !== undefined && listing.floor !== null && (
                        <div className="flex justify-between">
                          <span className="text-gray-500">{t.productDetail.floor}</span>
                          <span className="font-semibold text-gray-900">{listing.floor}</span>
                        </div>
                      )}
                      {listing.roommates && (
                        <div className="flex justify-between">
                          <span className="text-gray-500">{t.productDetail.roommates}</span>
                          <span className="font-semibold text-gray-900">{listing.roommates}</span>
                        </div>
                      )}
                      {listing.construction_year && (
                        <div className="flex justify-between">
                          <span className="text-gray-500">{t.productDetail.constructionYear}</span>
                          <span className="font-semibold text-gray-900">{listing.construction_year}</span>
                        </div>
                      )}
                      {listing.available_from && (
                        <div className="flex justify-between">
                          <span className="text-gray-500">{t.productDetail.availableFrom}</span>
                          <span className="font-semibold text-gray-900">
                            {listing.available_from.length === 7
                              ? new Date(listing.available_from + '-01').toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' })
                              : new Date(listing.available_from).toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                          </span>
                        </div>
                      )}
                      {listing.warm_rent && (
                        <div className="flex justify-between">
                          <span className="text-gray-500">{t.productDetail.warmRent}</span>
                          <span className="font-semibold text-gray-900">{listing.warm_rent.toLocaleString('tr-TR')} ₺</span>
                        </div>
                      )}
                      {listing.price_per_sqm && (
                        <div className="flex justify-between">
                          <span className="text-gray-500">{t.productDetail.pricePerSqm}</span>
                          <span className="font-semibold text-gray-900">{listing.price_per_sqm.toLocaleString('tr-TR')} ₺/m²</span>
                        </div>
                      )}
                      {listing.plot_area && (
                        <div className="flex justify-between">
                          <span className="text-gray-500">{t.productDetail.plotArea}</span>
                          <span className="font-semibold text-gray-900">{listing.plot_area} m²</span>
                        </div>
                      )}
                      {listing.grundstuecksart && (
                        <div className="flex justify-between">
                          <span className="text-gray-500">{t.productDetail.plotType}</span>
                          <span className="font-semibold text-gray-900">{translateVal(listing.grundstuecksart)}</span>
                        </div>
                      )}
                      {listing.objektart && (
                        <div className="flex justify-between">
                          <span className="text-gray-500">{t.productDetail.objectType}</span>
                          <span className="font-semibold text-gray-900">{translateVal(listing.objektart)}</span>
                        </div>
                      )}
                      {listing.garage_type && (
                        <div className="flex justify-between">
                          <span className="text-gray-500">{t.productDetail.garage}</span>
                          <span className="font-semibold text-gray-900">{translateVal(listing.garage_type)}</span>
                        </div>
                      )}
                      {listing.rental_type && (
                        <div className="flex justify-between">
                          <span className="text-gray-500">{t.productDetail.rentalType}</span>
                          <span className="font-semibold text-gray-900">{translateVal(listing.rental_type)}</span>
                        </div>
                      )}
                      {listing.online_viewing && (
                        <div className="flex justify-between">
                          <span className="text-gray-500">{t.productDetail.onlineViewing}</span>
                          <span className="font-semibold text-gray-900">{translateVal(listing.online_viewing)}</span>
                        </div>
                      )}
                      {listing.commission && (
                        <div className="flex justify-between">
                          <span className="text-gray-500">{t.productDetail.commission}</span>
                          <span className="font-semibold text-gray-900">{translateVal(listing.commission)}</span>
                        </div>
                      )}
                      {listing.lage && (
                        <div className="flex justify-between">
                          <span className="text-gray-500">{t.productDetail.location}</span>
                          <span className="font-semibold text-gray-900">{translateVal(listing.lage)}</span>
                        </div>
                      )}
                    </div>

                    {/* Tags Section for Features - Refined Styling */}
                    <div className="mt-8 space-y-8">
                      {listing.amenities?.length > 0 && (
                        <div>
                          <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                            {t.productDetail.amenities}
                          </h3>
                          <div className="flex flex-wrap gap-x-8 gap-y-3">
                            {listing.amenities.map((item, i) => (
                              <span key={i} className="text-sm font-bold text-gray-800 flex items-center gap-2">
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
                          <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                            {t.productDetail.features}
                          </h3>
                          <div className="flex flex-wrap gap-x-8 gap-y-3">
                            {listing.general_features.map((item, i) => (
                              <span key={i} className="text-sm font-bold text-gray-800 flex items-center gap-2">
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
                          <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                            {t.productDetail.apartmentFeatures}
                          </h3>
                          <div className="flex flex-wrap gap-x-8 gap-y-3">
                            {listing.apartment_features.map((item, i) => (
                              <span key={i} className="text-sm font-bold text-gray-800 flex items-center gap-2">
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
                          <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                            {t.productDetail.houseFeatures}
                          </h3>
                          <div className="flex flex-wrap gap-x-8 gap-y-3">
                            {listing.house_features.map((item, i) => (
                              <span key={i} className="text-sm font-bold text-gray-800 flex items-center gap-2">
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

                {/* Çizgi - Beschreibung Ayırıcı */}
                <div className="border-t border-gray-200 my-6"></div>

                {/* Ürün Açıklaması */}
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-4">{t.productDetail.description}</h2>
                  <p className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">
                    {description}
                  </p>
                </div>

                {/* Çizgi - Rechtliche Angaben Ayırıcı - Only for commercial sellers */}
                {sellerProfile?.seller_type === 'Gewerblicher Nutzer' && (
                  <>
                    <div className="border-t border-gray-200 my-6"></div>

                    {/* Rechtliche Angaben */}
                    <div>
                      <button
                        onClick={() => setShowLegal(!showLegal)}
                        className="flex items-center justify-between w-full text-lg font-semibold text-gray-900 hover:text-red-500"
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
                        <div className="mt-4 text-sm text-gray-600 space-y-2 border-t border-gray-100 pt-4">
                          <p>{t.productDetail.legalText}</p>
                          <p className="font-medium">{seller.name}</p>
                          <p>Örnek Mahallesi 123</p>
                          <p>34000 İstanbul</p>
                        </div>
                      )}
                    </div>
                  </>
                )}

                {/* Çizgi - Nachricht Ayırıcı */}
                <div className="border-t border-gray-200 my-6"></div>

                {/* İlan Mesaj Paneli */}
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">{t.productDetail.messageToSeller}</h2>
                  <form onSubmit={handleSendMessage} className="space-y-4">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1" htmlFor="contactName">
                        {t.addListing.name}
                      </label>
                      <input
                        type="text"
                        id="contactName"
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        placeholder={t.addListing.name}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-300"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1" htmlFor="contactPhone">
                        {t.addListing.phoneNumber}
                      </label>
                      <input
                        type="tel"
                        id="contactPhone"
                        value={contactPhone}
                        onChange={(e) => setContactPhone(e.target.value)}
                        placeholder="+49 ..."
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-300"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1" htmlFor="contactMessage">
                        {t.addListing.description}
                      </label>
                      <textarea
                        id="contactMessage"
                        value={contactMessage}
                        onChange={(e) => setContactMessage(e.target.value)}
                        placeholder={t.productDetail.writeMessage}
                        rows={4}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-300"
                        required
                      />
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <button
                        type="submit"
                        className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
                      >
                        {t.productDetail.send}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setContactName('');
                          setContactPhone('');
                          setContactMessage('');
                        }}
                        className="flex-1 border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold py-2 px-4 rounded-lg transition-colors"
                      >
                        {t.addListing.reset}
                      </button>
                    </div>
                  </form>
                </div>
              </div>

              {/* Satıcının Diğer Ürünleri */}
              {(() => {
                // TODO: Fetch seller's other listings from Supabase
                const sellerOtherListings = [];

                if (sellerOtherListings.length === 0) return null;

                return (
                  <div className="bg-white rounded-lg shadow-lg p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                      {seller.name}'in Diğer İlanları
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {sellerOtherListings.map((otherListing) => (
                        <div
                          key={otherListing.id}
                          onClick={() => navigate(`/product/${otherListing.id}`)}
                          className="bg-gray-50 rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-pointer group border border-gray-200"
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
                            <h3 className="text-xs font-medium text-gray-800 mb-1 line-clamp-2 group-hover:text-red-500 transition-colors">
                              {otherListing.title}
                            </h3>
                            <div className="text-sm font-semibold text-gray-900 mb-1">
                              {otherListing.price}
                            </div>
                            {otherListing.shipping && (
                              <div className="text-xs text-gray-500 mb-1">
                                {otherListing.shipping}
                              </div>
                            )}
                            <div className="flex items-center justify-between text-xs text-gray-500">
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
                      <button
                        onClick={() => navigate(`/seller/${seller?.user_number}`)}
                        className="mt-4 text-red-500 hover:text-red-600 font-medium text-sm"
                      >
                        {t.productDetail.allListings.replace('{count}', sellerListingsCount)} →
                      </button>
                    )}
                  </div>
                );
              })()}
            </div>



            {/* Sağ Taraf - Satıcı Profili */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-lg p-6 sticky top-4">
                {/* Satıcı Profil Bilgileri */}
                <div className="flex flex-col items-center gap-4 mb-4 pb-4 border-b text-center">
                  <img
                    key={seller.store_logo || seller.avatar_url || 'default-avatar'}
                    src={seller.store_logo || seller.avatar_url || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(seller.full_name || 'User') + '&background=ef4444&color=fff&size=200'}
                    alt={seller.full_name}
                    className="w-24 h-24 rounded-full object-cover cursor-pointer hover:opacity-90 transition-opacity border-4 border-gray-100"
                    onClick={() => {
                      if (seller.is_pro || seller.is_commercial || (seller.subscription_tier && seller.subscription_tier !== 'free')) {
                        navigate(`/store/${seller.id}`);
                      } else {
                        navigate(`/seller/${seller.user_number || sellerProfile?.user_number}`);
                      }
                    }}
                  />
                  <div className="flex-1 w-full">
                    <div
                      className="font-semibold text-xl text-gray-900 cursor-pointer hover:text-red-500 transition-colors mb-2"
                      onClick={() => {
                        if (seller.is_pro || seller.is_commercial || (seller.subscription_tier && seller.subscription_tier !== 'free')) {
                          navigate(`/store/${seller.id}`);
                        } else {
                          navigate(`/seller/${seller.user_number || sellerProfile?.user_number}`);
                        }
                      }}
                    >
                      {listing.contact_name || seller.full_name || t.productDetail.unknownSeller}
                    </div>

                    {/* Enhanced Seller Badges */}
                    <div className="flex flex-wrap justify-center gap-2 mb-4">
                      {seller.is_pro && (
                        <div className="bg-red-600 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-lg border-2 border-white hover:bg-red-700 transition-colors flex items-center gap-1">
                          <span>⭐ PRO MAĞAZA</span>
                        </div>
                      )}
                      {(seller.is_commercial || sellerProfile?.seller_type === 'Gewerblicher Nutzer' || (seller && seller.seller_type === 'commercial')) && (
                        <div className="bg-blue-600 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-lg border-2 border-white hover:bg-blue-700 transition-colors flex items-center gap-1">
                          <span>🏢 KURUMSAL SATICI</span>
                        </div>
                      )}
                    </div>

                    {(seller.is_pro || seller.is_commercial || sellerProfile?.seller_type === 'Gewerblicher Nutzer' || (seller && seller.seller_type === 'commercial')) && (
                      <a
                        href={`/store/${seller.id}`}
                        className="w-full mb-3 py-2 bg-gradient-to-r from-gray-900 to-gray-800 text-white text-xs font-bold rounded-lg hover:from-black hover:to-gray-900 transition-all shadow-sm flex items-center justify-center gap-2"
                      >
                        🏪 MAĞAZAYI ZİYARET ET
                      </a>
                    )}

                    {/* City Location */}
                    {(listing.city || listing.address) && (
                      <div className="flex items-center justify-center gap-1.5 mb-2">
                        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="text-sm text-gray-600">
                          {listing.city || ''}
                        </span>
                      </div>
                    )}

                    {!isCommercial && (
                      <div className="text-xs uppercase tracking-wide text-red-500 font-semibold mb-2">{sellerTypeLabel}</div>
                    )}

                    {/* Last Seen Indicator */}
                    <div className="flex items-center justify-center gap-1.5 mb-2">
                      <div className={`w-2 h-2 rounded-full ${seller.last_seen && (new Date() - new Date(seller.last_seen)) < 5 * 60 * 1000 ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
                      <span className="text-sm font-medium text-gray-700">
                        {formatLastSeen(seller.last_seen)}
                      </span>
                    </div>

                    <div className="text-xs text-gray-500 font-medium">{t.productDetail.memberSince} {activeSinceDisplay}</div>

                    {/* Seller Rating */}
                    {sellerRating && (
                      <div className="mt-3">
                        <RatingDisplay
                          userRating={sellerRating}
                          showDetails={false}
                          size="small"
                          center={true}
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Satıcıyı Takip Et Butonu */}
                <button
                  onClick={async () => {
                    setFollowLoading(true);
                    await toggleFollowSeller(listing.user_id);
                    setFollowLoading(false);
                  }}
                  disabled={followLoading}
                  className={`w-full border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold py-3 px-4 rounded-lg transition-colors mb-3 flex items-center justify-center gap-2 ${isSellerFollowed(listing.user_id) ? 'bg-green-50 border-green-500 text-green-700' : ''
                    } ${followLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {followLoading ? (
                    <>
                      <LoadingSpinner size="small" />
                      {t.productDetail.loading}
                    </>
                  ) : (
                    <>
                      <svg className={`w-5 h-5 ${isSellerFollowed(listing.user_id) ? 'text-green-500' : 'text-blue-500'}`} fill={isSellerFollowed(listing.user_id) ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      {isSellerFollowed(listing.user_id) ? t.productDetail.followingSeller : t.productDetail.followSeller}
                    </>
                  )}
                </button>


                {/* Mesaj Gönderme Butonu */}
                <button
                  type="button"
                  onClick={() => setShowMessageModal(true)}
                  className="w-full border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold py-3 px-4 rounded-lg transition-colors mb-3 flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  {t.productDetail.send}
                </button>

                {/* Telefon Butonu */}
                {!showPhone ? (
                  <button
                    type="button"
                    onClick={() => setShowPhone(true)}
                    className="w-full border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold py-3 px-4 rounded-lg transition-colors mb-3 flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    {t.productDetail.call}
                  </button>
                ) : (
                  <a
                    href={listing.show_phone_number === true ? (listing.contact_phone ? `tel:${listing.contact_phone.replace(/\s+/g, '')}` : (seller?.phone ? `tel:${seller.phone.replace(/\s+/g, '')}` : '#')) : '#'}
                    className="w-full border border-gray-300 hover:bg-green-50 hover:border-green-500 text-gray-700 hover:text-green-700 font-semibold py-3 px-4 rounded-lg transition-colors mb-3 flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    {listing.show_phone_number === true ? (listing.contact_phone || seller?.phone || t.productDetail.noPhoneNumber) : t.productDetail.noPhoneNumber}
                  </a>
                )}

                {/* Satıcının Diğer İlanlarına Hızlı Erişim */}
                {sellerListingsCount > 0 && (
                  <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-100">
                    {t.productDetail.moreListingsFrom.replace('{name}', seller.name)}
                    <button
                      onClick={() => navigate(`/seller/${listing.sellerId}`)}
                      className="text-sm text-red-500 hover:text-red-600 font-medium"
                    >
                      {t.productDetail.allListings.replace('{count}', '')} →
                    </button>
                  </div>
                )}

                {/* Warenkorb Section Removed as per request for Autos & Wohnwagen */}
                <MessageModal
                  isOpen={showMessageModal}
                  onClose={() => setShowMessageModal(false)}
                  onSubmit={handleModalSubmit}
                  sellerName={seller.name}
                  listingTitle={listing.title}
                />

                {/* Teilen & Drucken */}
                <div className="mt-4 space-y-3 pt-4 border-t border-gray-100 no-print">
                  <div className="pt-2">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 px-1">{t.productDetail.share}</p>
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
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
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
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.27 9.27 0 01-4.723-1.292l-.339-.202-3.51.92 1.017-3.65-.213-.339a9.204 9.204 0 01-1.513-5.07c0-5.116 4.158-9.273 9.274-9.273 2.479 0 4.808.966 6.557 2.715a9.192 9.192 0 012.711 6.56c0 5.117-4.158 9.275-9.276 9.275m8.211-17.487A11.026 11.026 0 0012.048 1.177c-6.115 0-11.09 4.974-11.09 11.088 0 2.112.553 4.135 1.611 5.922L.787 23l4.981-1.304c1.722.94 3.655 1.437 5.626 1.437h.005c6.114 0 11.089-4.975 11.089-11.088 0-2.937-1.144-5.698-3.235-7.791z" />
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
                        className="flex-1 bg-gray-100 text-gray-700 py-2.5 rounded-lg flex items-center justify-center hover:bg-gray-200 transition-all shadow-sm"
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
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-700"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 9V2h12v7M6 18H5a2 2 0 01-2-2v-5h18v5a2 2 0 01-2 2h-1m-12 0h12v4H6v-4z" />
                    </svg>
                    {t.productDetail.printFlyer}
                  </button>

                  <button
                    onClick={() => setShowReportModal(true)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors text-gray-700"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    {t.productDetail.report}
                  </button>
                </div>

                {/* Sicherheitstipps */}
                <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                  <div className="flex items-start gap-2 mb-3">
                    <span className="text-xl">💡</span>
                    <h3 className="font-semibold text-gray-900">{t.productDetail.safetyTips}:</h3>
                  </div>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-start gap-2">
                      <span className="text-yellow-600 mt-0.5">•</span>
                      <span>{t.productDetail.safetyTip1}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-yellow-600 mt-0.5">•</span>
                      <span>{t.productDetail.safetyTip2}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-yellow-600 mt-0.5">•</span>
                      <span>{t.productDetail.safetyTip3}</span>
                    </li>
                  </ul>
                </div>
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

        {/* Seller's Recent Listings */}
        {sellerRecentListings.length > 0 && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Bu Satıcının Diğer İlanları
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
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
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              {listing?.category} Kategorisindeki Benzer İlanlar
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:gap-6">
              {categoryListings.map(item => (
                <HorizontalListingCard
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
          <div className="fixed bottom-0 left-0 right-0 z-[100] bg-white/80 backdrop-blur-md border-t border-gray-200 p-4 flex gap-3 pb-safe no-print">
            <button
              id="mobile-contact-message"
              onClick={() => setShowMessageModal(true)}
              className="flex-1 bg-red-600 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg hover:bg-red-700 transition-all flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              {t.productDetail.send}
            </button>
            {(!showPhone) ? (
              <button
                id="mobile-contact-phone-reveal"
                onClick={() => setShowPhone(true)}
                className="flex-1 bg-white border-2 border-green-600 text-green-700 font-bold py-3.5 px-4 rounded-xl shadow-md hover:bg-green-50 transition-all flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                {t.productDetail.call}
              </button>
            ) : (
              <a
                id="mobile-contact-call"
                href={listing.show_phone_number === true ? (listing.contact_phone ? `tel:${listing.contact_phone.replace(/\s+/g, '')}` : (seller?.phone ? `tel:${seller.phone.replace(/\s+/g, '')}` : '#')) : '#'}
                className="flex-1 bg-green-600 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg hover:bg-green-700 transition-all flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                {listing.show_phone_number === true ? (listing.contact_phone || seller?.phone || t.productDetail.noPhoneNumber) : t.productDetail.noPhoneNumber}
              </a>
            )}
          </div>
        )}
      </div>
    </>
  );
};

// All Categories Component
export const AllCategories = ({ setSelectedCategory }) => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoading(true);
        const { fetchCategoriesWithCounts } = await import('./api/categories');
        const data = await fetchCategoriesWithCounts();
        setCategories(data);
      } catch (error) {
        console.error('Error loading categories:', error);
      } finally {
        setLoading(false);
      }
    };
    loadCategories();
  }, []);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="medium" className="mb-4" />
          <p className="text-gray-600">Kategoriler yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-6">
          <button
            onClick={() => navigate('/')}
            className="text-red-500 hover:text-red-600 flex items-center gap-2 mb-4"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            {t.common.backToHome}
          </button>
          <h1 className="text-3xl font-bold text-gray-900">{t.filters.allCategories}</h1>
        </div>

        <CategoryGallery
          toggleFavorite={() => { }}
          isFavorite={() => false}
        />

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.filter(c => c.name !== 'Tüm Kategoriler').map((category) => (
              <div key={category.name} className="space-y-3">
                <h2
                  onClick={() => navigate(getCategoryPath(category.name))}
                  className="text-xl font-semibold text-gray-900 flex items-center justify-between border-b border-gray-100 pb-2 cursor-pointer hover:text-red-500 transition-colors"
                >
                  <span className="flex-1">{getCategoryTranslation(category.name)}</span>
                  <span className="text-sm font-normal text-gray-500">({category.count})</span>
                </h2>
                <ul className="space-y-2">
                  {category.subcategories?.map((sub) => (
                    <li key={sub.name}>
                      <button
                        onClick={() => navigate(getCategoryPath(category.name, sub.name))}
                        className="text-gray-600 hover:text-red-500 hover:underline text-sm flex items-center justify-between w-full text-left"
                      >
                        <span>{getCategoryTranslation(sub.name)}</span>
                        <span className="text-gray-400 text-xs">({sub.count})</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Seller Profile Component
export const SellerProfile = () => {
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
        const { fetchUserListings } = await import('./api/listings');
        const listings = await fetchUserListings(sellerId);
        setSellerListings(listings);

        // Fetch seller profile
        const { fetchUserProfile } = await import('./api/profile');
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

  // Load seller ratings
  useEffect(() => {
    if (sellerId) {
      const loadRatings = async () => {
        try {
          const { getUserRating, getRatings } = await import('./api/ratings');
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
  const sellerTypeLabel = seller.seller_type === 'Gewerblicher Nutzer' ? t.addListing.commercial : t.addListing.private;

  return (
    <div className="min-h-screen bg-gray-50">
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
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
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
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
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

// Horizontal Listing Card Component


// Satıcı Sayfası Bileşeni
export const SellerPage = ({ toggleFavorite, isFavorite, toggleFollowSeller, isSellerFollowed }) => {

  const { sellerId } = useParams();
  const navigate = useNavigate();

  // IMPORTANT: All hooks must be called at the top, before any conditional returns
  const { user } = useAuth(); // Get current user for isOwnProfile check

  // State for seller data
  const [seller, setSeller] = useState(null);
  const [sellerListings, setSellerListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(t.sellerProfile.all);
  const [activeTab, setActiveTab] = useState('listings'); // Tab state for own profile
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [followLoading, setFollowLoading] = useState(false);
  const [ratings, setRatings] = useState([]);
  const [averageRating, setAverageRating] = useState({ average: 0, count: 0 });
  const [isRatingLoading, setIsRatingLoading] = useState(false);

  // Initialize states
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Check if current user is viewing their own profile
  // IMPORTANT: This must be defined BEFORE any conditional returns
  // Compare user.id with seller.id (both are UUIDs)
  const isOwnProfile = user && seller && user.id === seller.id;

  // Fetch seller profile and listings from Supabase
  useEffect(() => {
    const loadSellerData = async () => {
      if (!sellerId) return;

      try {
        setLoading(true);
        setError(null); // Clear previous errors
        console.log('=== LOADING SELLER DATA ===');
        console.log('Seller ID/Number:', sellerId);

        // Check if sellerId is a UUID (format: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx)
        const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(sellerId);

        let profile;
        if (isUUID) {
          // Fetch by UUID
          console.log('Fetching profile by UUID');
          const { fetchUserProfile } = await import('./api/profile');
          profile = await fetchUserProfile(sellerId);
        } else {
          // Fetch by user_number
          console.log('Fetching profile by user_number');
          const { fetchUserProfileByNumber } = await import('./api/profile');
          profile = await fetchUserProfileByNumber(sellerId);
        }

        console.log('Fetched seller profile:', profile);

        if (!profile) {
          throw new Error('Profile not found');
        }
        setSeller(profile); // Set seller state

        // Fetch seller's listings using the UUID from the fetched profile
        console.log('Fetching listings for seller ID:', profile.id); // Use profile.id
        const { fetchUserListings } = await import('./api/listings');
        const userListings = await fetchUserListings(profile.id); // Use profile.id
        console.log('Fetched seller listings:', userListings);
        setSellerListings(userListings || []); // Set sellerListings state
      } catch (error) {
        console.error('Error loading seller data:', error);
        console.error('Error details:', error.message, error.stack);
        setSeller(null);
        setSellerListings([]);
        setError(t.sellerProfile.sellerNotFound);
      } finally {
        setLoading(false);
      }
    };

    loadSellerData();
  }, [sellerId]);

  // Fetch ratings and average rating
  useEffect(() => {
    const fetchRatings = async () => {
      // We need the seller's UUID, which might not be immediate if we fetched by user_number
      // But loadSellerData should set it in 'seller'
      if (!seller?.id) return;

      setIsRatingLoading(true);
      try {
        const [ratingsData, avgData] = await Promise.all([
          getRatings(seller.id),
          getUserAverageRating(seller.id)
        ]);
        setRatings(ratingsData);
        setAverageRating(avgData);
      } catch (error) {
        console.error('Error fetching ratings:', error);
      } finally {
        setIsRatingLoading(false);
      }
    };

    fetchRatings();
  }, [seller?.id]);

  // Load follower/following counts
  useEffect(() => {
    const loadFollowCounts = async () => {
      if (!seller?.id) return;

      try {
        const { getFollowersCount, getFollowingCount } = await import('./api/follows');
        const [followers, following] = await Promise.all([
          getFollowersCount(seller.id),
          getFollowingCount(seller.id)
        ]);
        setFollowersCount(followers);
        setFollowingCount(following);
      } catch (error) {
        console.error('Error loading follow counts:', error);
      }
    };

    loadFollowCounts();
  }, [seller?.id]);

  // Scroll to top when page loads
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [sellerId]);

  const handleModalSubmit = async (data) => {
    try {
      const { sendMessage } = await import('./api/messages');
      // Send message to seller without listing ID (general inquiry)
      await sendMessage(seller.id, data.message, null);
      alert(t.sellerProfile.messageSuccess);
      setShowMessageModal(false);
    } catch (error) {
      console.error('Error sending message:', error);
      alert(t.sellerProfile.messageError);
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="medium" className="mb-4" />
          <p className="text-gray-600">{t.sellerProfile.loadingSeller}</p>
        </div>
      </div>
    );
  }

  // Show error if seller not found
  if (!seller) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{t.sellerProfile.sellerNotFound}</h2>
          <p className="text-gray-600 mb-4">{t.sellerProfile.sellerDoesNotExist}</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            {t.sellerProfile.backToHome}
          </button>
        </div>
      </div>
    );
  }

  // Satıcının ilanlarını filtrele
  // const sellerListings = mockListings.filter(l => String(l.sellerId) === sellerId); // This line is now handled by state

  // Satıcının ilanlarına göre kategorileri belirle
  const sellerCategories = sellerListings.reduce((acc, listing) => {
    const cat = listing.category;
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {});

  // Filter listings by selected category
  const filteredListings = selectedCategory === t.sellerProfile.all
    ? sellerListings
    : sellerListings.filter(l => l.category === selectedCategory);

  if (!seller) {
    return <div className="p-8 text-center">{t.sellerProfile.sellerNotFound}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 text-red-500 hover:text-red-600 flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          {t.productDetail.back}
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar - Seller Info & Categories */}
          <div className="lg:col-span-1 space-y-6">
            {/* Seller Profile Card */}
            <div className="bg-white rounded-lg shadow-sm p-6 text-center">
              {/* Profile Picture - Centered at top */}
              <div className="mb-4">
                <img
                  src={seller.store_logo || seller.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(seller.full_name || 'User')}&background=ef4444&color=fff&size=200`}
                  alt={seller.full_name}
                  className="w-24 h-24 rounded-full object-cover border-4 border-gray-100 mx-auto shadow-md"
                />
              </div>

              {/* Seller Name */}
              <div className="mb-3">
                <h2 className="text-2xl font-bold text-gray-900">{seller.full_name || t.productDetail.unknownSeller}</h2>
              </div>

              {/* User Type Badge */}
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${(seller.sellerType || seller.seller_type) === 'Gewerblicher Nutzer'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-gray-100 text-gray-800'
                  }`}>
                  {(seller.sellerType || seller.seller_type) === 'Gewerblicher Nutzer' ? t.addListing.commercial : t.addListing.private}
                </span>
              </div>

              {/* Member Status & Since */}
              <div className="flex flex-col items-center gap-1 mb-4">
                <div className="flex items-center gap-1.5">
                  <div className={`w-2 h-2 rounded-full ${seller.last_seen && (new Date() - new Date(seller.last_seen)) < 5 * 60 * 1000 ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
                  <span className="text-sm font-bold text-gray-700">
                    {formatLastSeen(seller.last_seen)}
                  </span>
                </div>
                <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">{t.sellerProfile.memberSince} {seller.created_at ? new Date(seller.created_at).getFullYear() : 'N/A'}</p>
              </div>

              <div className="bg-gray-50 rounded-xl p-4 mb-6 border border-gray-100">
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-center">
                    <div className="text-lg font-extrabold text-gray-900">{sellerListings.length}</div>
                    <div className="text-[10px] text-gray-400 uppercase font-bold tracking-tighter">{t.sellerProfile.listings}</div>
                  </div>
                  <div className="text-center border-l border-gray-200">
                    <div className="text-lg font-extrabold text-gray-900">{followersCount}</div>
                    <div className="text-[10px] text-gray-400 uppercase font-bold tracking-tighter">{t.sellerProfile.followers}</div>
                  </div>
                </div>
              </div>

              {/* Action Buttons - Only show for other users' profiles */}
              {!isOwnProfile && (
                <div className="space-y-3">
                  <button
                    onClick={async () => {
                      setFollowLoading(true);
                      await toggleFollowSeller(seller.id);
                      // Refresh follower count after follow/unfollow
                      try {
                        const { getFollowersCount } = await import('./api/follows');
                        const newCount = await getFollowersCount(seller.id);
                        setFollowersCount(newCount);
                      } catch (error) {
                        console.error('Error refreshing follower count:', error);
                      }
                      setFollowLoading(false);
                    }}
                    disabled={followLoading}
                    className={`w-full font-bold py-3 px-4 rounded-xl shadow-lg transition-all duration-300 flex items-center justify-center gap-2 transform active:scale-95 ${isSellerFollowed(seller.id)
                      ? 'bg-white text-gray-700 border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      : 'bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white shadow-red-200'
                      } ${followLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {followLoading ? (
                      <>
                        <LoadingSpinner size="small" />
                        <span>{t.sellerProfile.loading}</span>
                      </>
                    ) : (
                      <>
                        {isSellerFollowed(seller.id) ? (
                          <>
                            <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                            </svg>
                            <span>{t.sellerProfile.followed}</span>
                          </>
                        ) : (
                          <>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                            </svg>
                            <span>{t.sellerProfile.follow}</span>
                          </>
                        )}
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => setShowMessageModal(true)}
                    className="w-full border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold py-2 px-4 rounded-lg transition-colors"
                  >
                    {t.sellerProfile.message}
                  </button>
                </div>
              )}

              <div className="mt-6 pt-6 border-t border-gray-100">
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-3 text-center">Profili Paylaş</p>
                <div className="flex justify-center gap-3">
                  <button
                    onClick={() => {
                      const url = window.location.href;
                      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
                    }}
                    className="w-10 h-10 bg-[#1877F2] text-white rounded-xl flex items-center justify-center hover:opacity-90 hover:scale-110 transition-all shadow-md"
                    title="Facebook"
                  >
                    <svg className="w-5 h-5 fill-currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => {
                      const url = window.location.href;
                      const text = `${seller.full_name} profilini ExVitrin'de keşfedin!`;
                      window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`, '_blank');
                    }}
                    className="w-10 h-10 bg-[#25D366] text-white rounded-xl flex items-center justify-center hover:opacity-90 hover:scale-110 transition-all shadow-md"
                    title="WhatsApp"
                  >
                    <svg className="w-5 h-5 fill-currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.27 9.27 0 01-4.723-1.292l-.339-.202-3.51.92 1.017-3.65-.213-.339a9.204 9.204 0 01-1.513-5.07c0-5.116 4.158-9.273 9.274-9.273 2.479 0 4.808.966 6.557 2.715a9.192 9.192 0 012.711 6.56c0 5.117-4.158 9.275-9.276 9.275m8.211-17.487A11.026 11.026 0 0012.048 1.177c-6.115 0-11.09 4.974-11.09 11.088 0 2.112.553 4.135 1.611 5.922L.787 23l4.981-1.304c1.722.94 3.655 1.437 5.626 1.437h.005c6.114 0 11.089-4.975 11.089-11.088 0-2.937-1.144-5.698-3.235-7.791z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => {
                      const url = window.location.href;
                      const text = `${seller.full_name} profilini ExVitrin'de keşfedin!`;
                      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
                    }}
                    className="w-10 h-10 bg-zinc-700 text-white rounded-xl flex items-center justify-center hover:bg-zinc-800 hover:scale-110 transition-all shadow-md border border-zinc-600"
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
                    className="w-10 h-10 bg-gray-100 text-gray-700 rounded-xl flex items-center justify-center hover:bg-gray-200 hover:scale-110 transition-all shadow-md"
                    title="Bağlantıyı Kopyala"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="bg-white rounded-lg shadow-sm p-4 sticky top-6">
              <h3 className="font-semibold text-gray-900 mb-4 pb-2 border-b">
                {isOwnProfile ? t.sellerProfile.myProfile : t.sellerProfile.stats}
              </h3>
              <nav className="space-y-1">
                {[
                  { id: 'listings', name: t.sellerProfile.listings },
                  { id: 'ratings', name: t.sellerProfile.reviews }
                ].concat(isOwnProfile ? [
                  { id: 'favorites', name: t.nav.favorites },
                  { id: 'messages', name: t.nav.messages },
                  { id: 'following', name: t.sellerProfile.following },
                  { id: 'settings', name: t.nav.settings }
                ] : []).map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${activeTab === tab.id
                      ? 'bg-red-50 text-red-600 font-semibold'
                      : 'text-gray-700 hover:bg-gray-50'
                      }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-sm">{tab.name}</span>
                      {tab.id === 'ratings' && averageRating.count > 0 && (
                        <span className="bg-gray-100 px-2 py-0.5 rounded-full text-[10px] text-gray-500">
                          {averageRating.count}
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </nav>
            </div>

            {/* Categories - Only show when not in own profile or when viewing listings */}
            {(!isOwnProfile || activeTab === 'listings') && (
              <div className="bg-white rounded-lg shadow-sm p-4 sticky top-6">
                <h3 className="font-semibold text-gray-900 mb-4 pb-2 border-b">{t.sellerProfile.categories}</h3>
                <ul className="space-y-2">
                  <li
                    onClick={() => setSelectedCategory(t.sellerProfile.all)}
                    className={`flex justify-between items-center font-medium cursor-pointer transition-colors ${selectedCategory === t.sellerProfile.all ? 'text-red-500' : 'text-gray-600 hover:text-red-500'}`}
                  >
                    <span>{t.sellerProfile.all}</span>
                    <span className="bg-gray-100 px-2 py-0.5 rounded-full text-xs text-gray-600">{sellerListings.length}</span>
                  </li>
                  {Object.entries(sellerCategories).map(([catName, count]) => (
                    <li
                      key={catName}
                      onClick={() => setSelectedCategory(catName)}
                      className={`flex justify-between items-center cursor-pointer transition-colors ${selectedCategory === catName ? 'text-red-500 font-medium' : 'text-gray-600 hover:text-red-500'}`}
                    >
                      <span>{catName}</span>
                      <span className="bg-gray-100 px-2 py-0.5 rounded-full text-xs text-gray-600">{count}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Right Side - Tab Content */}
          <div className="lg:col-span-3">
            {/* Listings Tab */}
            {activeTab === 'listings' && (
              <div>
                {/* Seller Info Panel */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6 font-sans">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest border-b border-gray-50 pb-2">{t.sellerProfile.contact}</h2>
                      <div className="space-y-3">
                        {seller.phone && (
                          <div className="flex items-center gap-3 group">
                            <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center text-red-500 group-hover:bg-red-500 group-hover:text-white transition-all shadow-sm">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                              </svg>
                            </div>
                            <span className="text-sm font-semibold text-gray-700">{seller.phone}</span>
                          </div>
                        )}
                        {seller.address && (
                          <div className="flex items-center gap-3 group">
                            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-all shadow-sm">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                            </div>
                            <span className="text-sm font-semibold text-gray-700">
                              {seller.street ? `${seller.street}, ` : ''}{seller.city}
                            </span>
                          </div>
                        )}
                        {seller.website && (
                          <div className="flex items-center gap-3 group">
                            <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center text-purple-500 group-hover:bg-purple-500 group-hover:text-white transition-all shadow-sm">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                              </svg>
                            </div>
                            <a href={`http://${seller.website}`} target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-gray-700 hover:text-red-600 transition-colors">
                              {seller.website}
                            </a>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest border-b border-gray-50 pb-2">{t.sellerProfile.stats}</h2>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex flex-col items-center justify-center shadow-inner group hover:bg-white hover:border-red-100 transition-all duration-300">
                          <div className="text-2xl font-black text-gray-900 group-hover:text-red-600 transition-colors">{followingCount}</div>
                          <div className="text-[10px] text-gray-400 uppercase font-black tracking-tighter">{t.sellerProfile.following}</div>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex flex-col items-center justify-center shadow-inner group hover:bg-white hover:border-red-100 transition-all duration-300">
                          <div className="text-2xl font-black text-gray-900 group-hover:text-red-600 transition-colors">{sellerListings.filter(l => l.status === 'active').length}</div>
                          <div className="text-[10px] text-gray-400 uppercase font-black tracking-tighter">{t.sellerProfile.activeListings}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">{t.sellerProfile.activeListings}</h2>
                  <div className="grid grid-cols-1 gap-4">
                    {filteredListings.map(listing => (
                      <HorizontalListingCard
                        key={listing.id}
                        listing={listing}
                        toggleFavorite={toggleFavorite}
                        isFavorite={isFavorite}
                        isOwnListing={isOwnProfile}
                        compact={true}
                      />
                    ))}
                  </div>
                  {filteredListings.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                      {t.sellerProfile.all} {t.sellerProfile.listings.toLowerCase()} bulunamadı.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Ratings Tab */}
            {activeTab === 'ratings' && (
              <div className="space-y-6">
                {/* Rating Summary Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                  <div className="flex flex-col md:flex-row items-center gap-12">
                    <div className="text-center">
                      <div className="text-6xl font-black text-gray-900 mb-2">
                        {averageRating.average}
                        <span className="text-2xl text-gray-400 font-normal ml-1">/ 5</span>
                      </div>
                      <div className="flex items-center justify-center gap-1 mb-3 text-2xl">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span
                            key={star}
                            className={`${star <= Math.round(averageRating.average) ? 'text-yellow-400' : 'text-gray-200'} drop-shadow-sm`}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                      <div className="text-sm font-bold text-gray-500 uppercase tracking-widest bg-gray-50 px-4 py-1.5 rounded-full inline-block">
                        {averageRating.count} {t.sellerProfile.reviews}
                      </div>
                    </div>

                    <div className="flex-1 w-full space-y-3">
                      {[5, 4, 3, 2, 1].map((star) => {
                        const count = ratings.filter(r => r.rating === star).length;
                        const percentage = averageRating.count > 0 ? (count / averageRating.count) * 100 : 0;
                        return (
                          <div key={star} className="flex items-center gap-4 group">
                            <span className="text-sm font-bold text-gray-600 w-16 whitespace-nowrap group-hover:text-red-600 transition-colors uppercase tracking-tighter">
                              {star} {t.sellerProfile.listings.includes('İlan') ? 'Yıldız' : 'Stars'}
                            </span>
                            <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden shadow-inner">
                              <div
                                className="h-full bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full shadow-sm group-hover:from-red-500 group-hover:to-red-600 transition-all duration-500"
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                            <span className="text-sm font-black text-gray-400 w-8 text-right group-hover:text-gray-900 transition-colors">
                              {count}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Reviews List */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="px-8 py-5 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                    <h3 className="text-lg font-bold text-gray-900 uppercase tracking-wider">{t.sellerProfile.reviews}</h3>
                  </div>
                  <div className="divide-y divide-gray-50">
                    {ratings.length > 0 ? (
                      ratings.map((review) => (
                        <div key={review.id} className="p-8 hover:bg-gray-50/50 transition-all duration-300">
                          <div className="flex items-start gap-4">
                            <img
                              src={review.rater?.avatar_url || review.rater?.store_logo || `https://ui-avatars.com/api/?name=${encodeURIComponent(review.rater?.full_name || 'U')}&background=f3f4f6&color=4b5563&bold=true`}
                              alt={review.rater?.full_name}
                              className="w-12 h-12 rounded-xl object-cover shadow-sm border-2 border-white ring-1 ring-gray-100"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                                <h4 className="font-bold text-gray-900 truncate">{review.rater?.full_name}</h4>
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                                  {new Date(review.created_at).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
                                </span>
                              </div>
                              <div className="flex items-center gap-1 mb-3">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <span
                                    key={star}
                                    className={`text-sm ${star <= review.rating ? 'text-yellow-400' : 'text-gray-200'}`}
                                  >
                                    ★
                                  </span>
                                ))}
                              </div>
                              {review.comment && (
                                <p className="text-gray-600 leading-relaxed text-sm italic font-medium">
                                  "{review.comment}"
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-20 px-8">
                        <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-300 mx-auto mb-4">
                          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.382-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                          </svg>
                        </div>
                        <p className="text-gray-400 font-bold uppercase tracking-widest text-sm">{t.sellerProfile.noRatingsYet}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div >

          <MessageModal
            isOpen={showMessageModal}
            onClose={() => setShowMessageModal(false)}
            onSubmit={handleModalSubmit}
            sellerName={seller.full_name || t.sellerProfile.message}
            listingTitle={t.sellerProfile.inquiryToSeller}
          />
        </div >
      </div >
    </div >
  );
};

// Footer Component
export const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-12 pb-8 mt-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mb-8">
          {/* ExVitrin */}
          <div>
            <h3 className="text-white font-semibold mb-4">ExVitrin</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="/hakkimizda" className="hover:text-white transition-colors">{t.footer.aboutUs}</a></li>
              <li><a href="/mobile-apps" className="hover:text-white transition-colors">{t.footer.mobileApps}</a></li>
              <li><a href="/hayvan-haklari-ve-yasal-uyari" className="hover:text-white transition-colors">{t.footer.animalLawLink}</a></li>
              <li><a href="/emlak-ilanlari-yasal-uyari" className="hover:text-white transition-colors">{t.footer.realEstateLawLink}</a></li>
              <li><a href="/vasita-ilanlari-yasal-uyari" className="hover:text-white transition-colors">{t.footer.vehicleLawLink}</a></li>
              <li><a href="/iletisim" className="text-red-400 hover:text-red-300 font-semibold transition-colors mt-2 inline-block">📞 {t.contact.title}</a></li>
            </ul>
          </div>


          {/* Für Unternehmen */}
          <div>
            <h3 className="text-white font-semibold mb-4">{t.footer.forCompanies}</h3>
            <ul className="space-y-2 text-sm">

              <li><a href="/packages" className="hover:text-white transition-colors">{t.footer.proPackages}</a></li>
              <li><a href="#" className="hover:text-white transition-colors">{t.footer.advertising}</a></li>
            </ul>
          </div>



          {/* Allgemein + Logo + Social Media */}
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <img src="/logo_exvitrin_2026.png" alt="ExVitrin" className="h-12 w-auto" />
              <span className="text-3xl font-extrabold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent tracking-tight">
                exvitrin
              </span>
            </div>

            {/* Social Media Icons */}
            <div className="flex gap-4">
              {/* Facebook */}
              <a href="https://facebook.com/exvitrin" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors" title="Facebook">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              {/* Instagram */}
              <a href="https://instagram.com/exvitrin" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors" title="Instagram">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              {/* YouTube */}
              <a href="https://youtube.com/@exvitrin" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors" title="YouTube">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
              {/* TikTok */}
              <a href="https://www.tiktok.com/@exvitrin" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors" title="TikTok">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
                </svg>
              </a>
              {/* Pinterest */}
              <a href="https://pinterest.com/exvitrin" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors" title="Pinterest">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.39 18.592.026 11.985.026L12.017 0z" />
                </svg>
              </a>
              {/* Threads */}
              <a href="https://threads.net/@exvitrin" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors" title="Threads">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.04.569c-1.104-3.96-3.898-5.984-8.304-6.015-2.91.022-5.11.936-6.54 2.717C4.307 6.504 3.616 8.914 3.589 12c.027 3.086.718 5.496 2.057 7.164 1.43 1.783 3.631 2.698 6.54 2.717 2.623-.02 4.358-.631 5.8-2.045 1.647-1.613 1.618-3.593 1.09-4.798-.31-.71-.873-1.3-1.634-1.75-.192 1.352-.622 2.446-1.284 3.272-.886 1.102-2.14 1.704-3.73 1.704-1.8 0-3.19-.65-4.14-1.93C6.87 14.79 6.3 12.96 6.3 10.77c0-2.19.57-4.02 1.69-5.44.95-1.28 2.34-1.93 4.14-1.93 1.8 0 3.19.65 4.14 1.93.95 1.28 1.42 3.11 1.42 5.44 0 .94-.06 1.76-.18 2.46.49.28.88.61 1.17.99.58.76.87 1.71.87 2.84 0 1.27-.38 2.37-1.14 3.29-1.76 2.12-4.29 3.19-7.54 3.19zm.014-2.717c1.08 0 1.898-.31 2.438-.93.54-.62.81-1.54.81-2.76 0-.81-.15-1.54-.45-2.19-.3-.65-.75-1.17-1.35-1.56-.6-.39-1.35-.59-2.25-.59-1.08 0-1.898.31-2.438.93-.54.62-.81 1.54-.81 2.76 0 1.22.27 2.14.81 2.76.54.62 1.358.93 2.438.93z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-500 space-y-4">
        <p>{t.footer.copyright}</p>
      </div>
    </footer>
  );
};

// Report Modal Component
export const ReportModal = ({ isOpen, onClose, onSubmit, reason, setReason, description, setDescription }) => {
  if (!isOpen) return null;

  const reportReasons = [
    { value: 'spam', label: 'Spam oder Betrug' },
    { value: 'inappropriate', label: 'Unangemessener Inhalt' },
    { value: 'duplicate', label: 'Doppelte Anzeige' },
    { value: 'wrong_category', label: 'Falsche Kategorie' },
    { value: 'sold', label: 'Bereits verkauft' },
    { value: 'other', label: 'Sonstiges' }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">{t.productDetail.reportTitle}</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t.productDetail.reportReasonTitle}
              </label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                required
              >
                <option value="">{t.productDetail.pleaseChoose}</option>
                {Object.entries(t.productDetail.reportReasons).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t.productDetail.reportDescriptionLabel}
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                placeholder={t.productDetail.reportDescriptionPlaceholder}
              />
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-sm text-gray-700">
                <strong>{t.addListing.details}:</strong> {t.productDetail.reportNotice}
              </p>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-700 font-medium"
            >
              {t.productDetail.reportCancel}
            </button>
            <button
              onClick={onSubmit}
              className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors font-medium"
            >
              {t.productDetail.reportSubmit}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Export ReservationButton
export { ReservationButton };
// Export BannerSlider
export { default as BannerSlider } from './components/BannerSlider';

// Animal Protection & Legal Disclaimer Page
export const AnimalProtectionPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 shadow-sm">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Header Section */}
        <div className="bg-red-600 px-8 py-10 text-white text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-6">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight mb-4">
            {t.footer.animalLawLink}
          </h1>
          <p className="text-red-100 font-medium max-w-2xl mx-auto">
            5199 Sayılı Hayvanları Koruma Kanunu ve Yasal Yükümlülükler Hakkında Bilgilendirme
          </p>
        </div>

        {/* Content Section */}
        <div className="p-8 md:p-12 space-y-8">
          <section className="bg-gray-50 rounded-2xl p-6 border-l-4 border-red-500">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-red-500 rounded-full"></span>
              Yasal Uyarı Metni
            </h2>
            <p className="text-gray-700 leading-relaxed text-lg italic">
              "{t.footer.animalLawDisclaimer}"
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
              Kapsam ve Sorumluluk
            </h2>
            <div className="prose prose-red text-gray-600 space-y-4">
              <p>
                ExVitrin platformu, kullanıcıların çeşitli kategorilerde ilanlar paylaşabildiği dijital bir pazaryeridir.
                Evcil hayvan kategorisinde paylaşılan ilanlar için aşağıdaki hususların bilinmesi yasal bir gerekliliktir:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Yer Sağlayıcı Konumu:</strong> ExVitrin, 5651 sayılı İnternet Ortamında Yapılan Yayınların Düzenlenmesi ve Bu Yayınlar Yoluyla İşlenen Suçlarla Mücadele Edilmesi Hakkında Kanun uyarınca "Yer Sağlayıcı" sıfatıyla hizmet vermektedir. Platform, içeriği kontrol etme sorumluluğuna sahip değildir.</li>
                <li><strong>Satış Tarafı Değildir:</strong> İşlemler sadece alıcı ve satıcı arasında gerçekleşir. ExVitrin bu işlemlerde aracı, komisyoncu veya garantör değildir.</li>
                <li><strong>Hayvan Sağlığı ve Refahı:</strong> İlan edilen canlıların sağlık durumu, aşılama kayıtları ve yaşam koşulları tamamen ilanı veren kullanıcının beyanı ve sorumluluğundadır.</li>
                <li><strong>Mevzuata Uyum:</strong> İlan sahiplerinin 5199 sayılı kanunda belirtilen tüm usul ve esaslara uyması zorunludur. Yasaklı ırkların satışı veya kanuna aykırı her türlü faaliyet yasaktır.</li>
              </ul>
            </div>
          </section>

          <section className="bg-blue-50 rounded-2xl p-6 text-sm text-blue-800 flex gap-4">
            <svg className="w-6 h-6 shrink-0 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p>
              Herhangi bir yasa dışı durum veya kanun aykırılık tespit ettiğiniz ilanları platformumuzun "İlanı Bildir" özelliğini kullanarak tarafımıza iletebilirsiniz. Gereken durumlarda yetkili mercilerle iş birliği yapılmaktadır.
            </p>
          </section>
        </div>

        {/* Footer Section */}
        <div className="bg-gray-100 p-8 text-center text-sm text-gray-500 border-t border-gray-200">
          <p>© 2025 ExVitrin - Hayvan Hakları ve Toplumsal Sorumluluk Politikası</p>
        </div>
      </div>
    </div>
  );
};

// Real Estate Legal Disclaimer Page
export const RealEstateLegalPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 shadow-sm">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Header Section */}
        <div className="bg-blue-600 px-8 py-10 text-white text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-6">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </div>
          <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight mb-4">
            {t.footer.realEstateLawLink}
          </h1>
          <p className="text-blue-100 font-medium max-w-2xl mx-auto">
            Emlak Alım-Satım ve Kiralama İşlemlerinde Yasal Yükümlülükler
          </p>
        </div>

        {/* Content Section */}
        <div className="p-8 md:p-12 space-y-8">
          <section className="bg-gray-50 rounded-2xl p-6 border-l-4 border-blue-500">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              Yasal Uyarı Metni
            </h2>
            <p className="text-gray-700 leading-relaxed text-lg italic">
              "{t.footer.realEstateDisclaimer}"
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
              Önemli Bilgiler
            </h2>
            <div className="prose prose-blue text-gray-600 space-y-4">
              <p>
                Emlak ilanları yayınlayan ve bu ilanlardan faydalanan kullanıcılarımızın dikkat etmesi gereken önemli hususlar:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Tapu Kontrolü:</strong> Gayrimenkul alım-satımında mutlaka tapu kaydını ve malik bilgilerini kontrol ediniz. Sahte tapu veya yetkisiz satış girişimlerine karşı dikkatli olunuz.</li>
                <li><strong>Emlak Danışmanı Yetkilendirmesi:</strong> İlan sahibinin yetkili bir emlak danışmanı olup olmadığını, varsa yetki belgesi numarasını sorgulayınız.</li>
                <li><strong>Ön Ödeme Riski:</strong> Görüşme yapmadan veya gayrimenkulü yerinde görmeden kesinlikle ön ödeme yapmayınız.</li>
                <li><strong>Sözleşme İncelemesi:</strong> Kira veya satış sözleşmelerini imzalamadan önce hukuki danışmanlık alınız.</li>
                <li><strong>Platform Sorumluluğu:</strong> ExVitrin sadece ilan yayınlama platformudur. Taraflar arasındaki anlaşmazlıklar, sözleşme ihlalleri veya hukuki sorunlardan sorumlu değildir.</li>
              </ul>
            </div>
          </section>

          <section className="bg-amber-50 rounded-2xl p-6 text-sm text-amber-800 flex gap-4">
            <svg className="w-6 h-6 shrink-0 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p>
              Şüpheli veya dolandırıcılık amacı taşıdığını düşündüğünüz emlak ilanlarını "İlanı Bildir" özelliğini kullanarak tarafımıza bildirebilirsiniz.
            </p>
          </section>
        </div>

        {/* Footer Section */}
        <div className="bg-gray-100 p-8 text-center text-sm text-gray-500 border-t border-gray-200">
          <p>© 2025 ExVitrin - Emlak İlanları Yasal Uyarı ve Kullanıcı Bilgilendirmesi</p>
        </div>
      </div>
    </div>
  );
};

// Vehicle Legal Disclaimer Page
export const VehicleLegalPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 shadow-sm">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Header Section */}
        <div className="bg-orange-600 px-8 py-10 text-white text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-6">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight mb-4">
            {t.footer.vehicleLawLink}
          </h1>
          <p className="text-orange-100 font-medium max-w-2xl mx-auto">
            Araç Alım-Satımında Yasal Yükümlülükler ve Tüketici Hakları
          </p>
        </div>

        {/* Content Section */}
        <div className="p-8 md:p-12 space-y-8">
          <section className="bg-gray-50 rounded-2xl p-6 border-l-4 border-orange-500">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
              Yasal Uyarı Metni
            </h2>
            <p className="text-gray-700 leading-relaxed text-lg italic">
              "{t.footer.vehicleDisclaimer}"
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
              Araç Alımında Dikkat Edilmesi Gerekenler
            </h2>
            <div className="prose prose-orange text-gray-600 space-y-4">
              <p>
                İkinci el araç alım-satımında kullanıcılarımızın güvenliği için aşağıdaki hususlara dikkat edilmelidir:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Tramer Kaydı:</strong> Aracın kaza geçmişini, hasar kayıtlarını ve sigorta bilgilerini mutlaka Tramer sisteminden sorgulayınız.</li>
                <li><strong>Ekspertiz Raporu:</strong> Bağımsız bir ekspertiz firmasından araç değerlendirme raporu alınız.</li>
                <li><strong>Ruhsat ve Belge Kontrolü:</strong> Aracın ruhsatı, trafik sigortası ve muayene belgelerinin güncel ve geçerli olduğundan emin olunuz.</li>
                <li><strong>Kilometre Doğrulaması:</strong> Kilometre saatinin değiştirilip değiştirilmediğini servis kayıtları ve muayene raporlarıyla teyit ediniz.</li>
                <li><strong>Ticari Satıcılardan Alım:</strong> Ticari satıcılardan alımlarda 6 ay garanti hakkınız bulunmaktadır. Tüketici Kanunu kapsamındaki haklarınızı biliniz.</li>
                <li><strong>Bireysel Satıcılardan Alım:</strong> Bireysel satıcılardan alımlarda satıcının kimlik bilgilerini ve araç üzerindeki yetkisini kontrol ediniz.</li>
              </ul>
            </div>
          </section>

          <section className="bg-red-50 rounded-2xl p-6 text-sm text-red-800 flex gap-4">
            <svg className="w-6 h-6 shrink-0 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p>
              Yanıltıcı bilgi içeren, sahte belge veya kilometre tahrifi yapılmış araç ilanlarını "İlanı Bildir" özelliğini kullanarak bildirmenizi rica ederiz.
            </p>
          </section>
        </div>

        {/* Footer Section */}
        <div className="bg-gray-100 p-8 text-center text-sm text-gray-500 border-t border-gray-200">
          <p>© 2025 ExVitrin - Vasıta İlanları Yasal Uyarı ve Tüketici Bilgilendirmesi</p>
        </div>
      </div>
    </div>
  );
};
