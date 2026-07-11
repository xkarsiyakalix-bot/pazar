// Modular Components (Standalone Files)
export { Header } from './Header';
export { Footer } from './Footer';
export { SearchSection } from './SearchSection';
export { CategorySidebar } from './CategorySidebar';
export { CategoryGallery } from './CategoryGallery';
export { WelcomeModal } from './WelcomeModal';
export { SpecialSellers } from './SpecialSellers';
export { AllCategories } from './AllCategories';
export { SellerProfile } from './SellerProfile';
export { ListingGrid } from './ListingGrid';
export { ListingCard } from './ListingCard';
export { HorizontalListingCard } from './HorizontalListingCard';
export { Gallery } from './Gallery';
export { GalleryInfoModal } from './GalleryInfoModal';
export { ListingCountdown } from './ListingCountdown';
export { LoadingSpinner } from './LoadingSpinner';
export { Breadcrumb } from './Breadcrumb';
export { BannerSlider } from './BannerSlider';
export { default as CookieConsent } from './CookieConsent';
export { PWAInstallBanner } from './PWAInstallBanner';
export { MessageModal } from './MessageModal';
export { RatingDisplay } from './RatingDisplay';
export { RatingsList } from './RatingsList';
export { PresenceTracker } from './PresenceTracker';
export { ImageLightbox } from './ImageLightbox';
export { ShareModal } from './ShareModal';
export { AnimalProtectionPage, RealEstateLegalPage, VehicleLegalPage } from './LegalPages';

// Utility Functions (Moved from components.js to utils)
export { getCategoryPath, getListingUrl } from '../utils/slug';
export { formatLastSeen, generateListingNumber } from '../utils/format';

// Direct page/component exports (NOT from components.legacy.js)
export { ProductDetail } from '../pages/ProductDetail';
export { SellerPage } from '../pages/SellerPage';
export { VisibilityPackagesModal } from './VisibilityPackagesModal';
export { LazyImage } from './LazyImage';
export { ReportModal } from './ReportModal';
export { normalizeSubcategoryName } from '../utils/slug';
