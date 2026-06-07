import React, { useState, useEffect } from 'react';
import LoadingSpinner from './components/LoadingSpinner';
import { trackVisit } from './api/analytics';
import pwaManager from './utils/pwaManager';
import CookieConsent from './components/CookieConsent';
import DemoWarningModal from './components/DemoWarningModal';


import './App.css';
// Removed heavy translations import from main bundle
import SEO from './SEO';
import { supabase } from './lib/supabase';
import { favoritesApi } from './api/favorites';
import { getFollowing, followUser, unfollowUser } from './api/follows';


// Critical components - static import from barrel
import {
  Header,
  Footer,
  PresenceTracker,
  PWAInstallBanner,
  SearchSection,
  ListingGrid,
  CategorySidebar,
  Gallery,
  BannerSlider
} from './components';

// Non-critical components - lazy load
const CategoryGallery = React.lazy(() => import('./components/CategoryGallery'));
const WelcomeModal = React.lazy(() => import('./components/WelcomeModal'));
const ProductDetail = React.lazy(() => import('./pages/ProductDetail'));
const AddListing = React.lazy(() => import('./pages/AddListing'));
const SellerProfile = React.lazy(() => import('./components/SellerProfile'));
const AllCategories = React.lazy(() => import('./components/AllCategories'));
const Checkout = React.lazy(() => import('./pages/Checkout'));
const SellerPage = React.lazy(() => import('./pages/SellerPage'));
const SpecialSellers = React.lazy(() => import('./components/SpecialSellers'));
const AnimalProtectionPage = React.lazy(() => import('./components/LegalPages').then(m => ({ default: m.AnimalProtectionPage })));
const RealEstateLegalPage = React.lazy(() => import('./components/LegalPages').then(m => ({ default: m.RealEstateLegalPage })));
const VehicleLegalPage = React.lazy(() => import('./components/LegalPages').then(m => ({ default: m.VehicleLegalPage })));
const LegalNoticesPage = React.lazy(() => import('./LegalNoticesPage'));
const CookiesPolicyPage = React.lazy(() => import('./CookiesPolicyPage'));

// Components from individual files
const ReservationButton = React.lazy(() => import('./ReservationButton'));
const StorePage = React.lazy(() => import('./components/Store/StorePage'));
const SmartRoute = React.lazy(() => import('./SmartRoute'));
const DynamicCategoryPage = React.lazy(() => import('./pages/DynamicCategoryPage'));
const MobileCategoryGrid = React.lazy(() => import('./components/MobileCategoryGrid'));

// Lazy load page components
const Register = React.lazy(() => import('./Register'));
const AlleKategorienPage = React.lazy(() => import('./AlleKategorienPage'));
const Login = React.lazy(() => import('./Login'));
const ForgotPassword = React.lazy(() => import('./ForgotPassword'));
const ResetPassword = React.lazy(() => import('./ResetPassword'));
const SubscriptionPackages = React.lazy(() => import('./SubscriptionPackages'));

const ModeBeautyPage = React.lazy(() => import('./ModeBeautyPage'));
const DamenbekleidungPage = React.lazy(() => import('./DamenbekleidungPage'));
const HerrenbekleidungPage = React.lazy(() => import('./HerrenbekleidungPage'));
const DamenschuhePage = React.lazy(() => import('./DamenschuhePage'));
const HerrenschuhePage = React.lazy(() => import('./HerrenschuhePage'));
const TaschenAccessoiresPage = React.lazy(() => import('./TaschenAccessoiresPage'));
const UhrenSchmuckPage = React.lazy(() => import('./UhrenSchmuckPage'));
const WeiteresModeBeautyPage = React.lazy(() => import('./WeiteresModeBeautyPage'));
const ImmobilienPage = React.lazy(() => import('./ImmobilienPage'));
const ElektronikPage = React.lazy(() => import('./ElektronikPage'));
const FotoPage = React.lazy(() => import('./FotoPage'));
const NotebooksPage = React.lazy(() => import('./NotebooksPage'));
const HandyTelefonPage = React.lazy(() => import('./HandyTelefonPage'));
const HaushaltsgeraetePage = React.lazy(() => import('./HaushaltsgeraetePage'));
const KonsolenPage = React.lazy(() => import('./KonsolenPage'));
const PCsPage = React.lazy(() => import('./PCsPage'));
const PCZubehoerSoftwarePage = React.lazy(() => import('./PCZubehoerSoftwarePage'));
const TabletsReaderPage = React.lazy(() => import('./TabletsReaderPage'));
const TVVideoPage = React.lazy(() => import('./TVVideoPage'));
const VideospielePage = React.lazy(() => import('./VideospielePage'));
const WeitereElektronikPage = React.lazy(() => import('./WeitereElektronikPage'));
const ElektronikDienstleistungenPage = React.lazy(() => import('./ElektronikDienstleistungenPage'));
const MietwohnungenPage = React.lazy(() => import('./MietwohnungenPage'));
const EigentumswohnungenPage = React.lazy(() => import('./EigentumswohnungenPage'));
const HaeuserZumKaufPage = React.lazy(() => import('./HaeuserZumKaufPage'));
const HaeuserZurMietePage = React.lazy(() => import('./HaeuserZurMietePage'));
const FerienAuslandsimmobilienPage = React.lazy(() => import('./FerienAuslandsimmobilienPage'));
const GaragenStellplaetzePage = React.lazy(() => import('./GaragenStellplaetzePage'));
const GewerbeimmobilienPage = React.lazy(() => import('./GewerbeimmobilienPage'));
const GrundstueckeGaertenPage = React.lazy(() => import('./GrundstueckeGaertenPage'));
const SatilikYazlikPage = React.lazy(() => import('./SatilikYazlikPage'));
const NeubauprojektePage = React.lazy(() => import('./NeubauprojektePage'));
const UmzugTransportPage = React.lazy(() => import('./UmzugTransportPage'));
const WeitereImmobilienPage = React.lazy(() => import('./WeitereImmobilienPage'));
const WohnzimmerPage = React.lazy(() => import('./WohnzimmerPage'));
const SchlafzimmerPage = React.lazy(() => import('./SchlafzimmerPage'));
const KuecheEsszimmerPage = React.lazy(() => import('./KuecheEsszimmerPage'));
const LampenLichtPage = React.lazy(() => import('./LampenLichtPage'));
const GartenzubehoerPflanzenPage = React.lazy(() => import('./GartenzubehoerPflanzenPage'));
const HeimtextilienPage = React.lazy(() => import('./HeimtextilienPage'));
const HeimwerkenPage = React.lazy(() => import('./HeimwerkenPage'));
const DekorationPage = React.lazy(() => import('./DekorationPage'));
const BueroPage = React.lazy(() => import('./BueroPage'));
const HausGartenPage = React.lazy(() => import('./HausGartenPage'));
const WeiteresHausGartenPage = React.lazy(() => import('./WeiteresHausGartenPage'));
const FischePage = React.lazy(() => import('./FischePage'));
const HundePage = React.lazy(() => import('./HundePage'));
const KatzenPage = React.lazy(() => import('./KatzenPage'));
const KleintierePage = React.lazy(() => import('./KleintierePage'));
const NutztierePage = React.lazy(() => import('./NutztierePage'));
const PferdePage = React.lazy(() => import('./PferdePage'));
const TierbetreuungTrainingPage = React.lazy(() => import('./TierbetreuungTrainingPage'));
const VermissTierePage = React.lazy(() => import('./VermissTierePage'));
const VoegelPage = React.lazy(() => import('./VoegelPage'));
const TierzubehoerPage = React.lazy(() => import('./TierzubehoerPage'));
const SpielzeugPage = React.lazy(() => import('./SpielzeugPage'));
const KinderwagenBuggysPage = React.lazy(() => import('./KinderwagenBuggysPage'));
const KinderzimmermobelPage = React.lazy(() => import('./KinderzimmermobelPage'));
const AltenpflegePage = React.lazy(() => import('./AltenpflegePage'));
const BabyAusstattungPage = React.lazy(() => import('./BabyAusstattungPage'));
const BabyKinderkleidungPage = React.lazy(() => import('./BabyKinderkleidungPage'));
const BabyKinderschuhePage = React.lazy(() => import('./BabyKinderschuhePage'));
const BabyschalenKindersitzePage = React.lazy(() => import('./BabyschalenKindersitzePage'));
const BabysitterKinderbetreuungPage = React.lazy(() => import('./BabysitterKinderbetreuungPage'));
const WeiteresFamilieKindBabyPage = React.lazy(() => import('./WeiteresFamilieKindBabyPage'));
const GastronomieTourismusPage = React.lazy(() => import('./GastronomieTourismusPage'));
const KundenserviceCallCenterPage = React.lazy(() => import('./KundenserviceCallCenterPage'));
const MiniNebenjobsPage = React.lazy(() => import('./MiniNebenjobsPage'));
const SozialerSektorPflegePage = React.lazy(() => import('./SozialerSektorPflegePage'));
const TransportLogistikVerkehrPage = React.lazy(() => import('./TransportLogistikVerkehrPage'));
const SalesPurchasingMarketingPage = React.lazy(() => import('./SalesPurchasingMarketingPage'));
const PraktikaPage = React.lazy(() => import('./PraktikaPage'));
const WeitereJobsPage = React.lazy(() => import('./WeitereJobsPage'));
const BueroarbeitVerwaltungPage = React.lazy(() => import('./BueroarbeitVerwaltungPage'));
const EsoterikSpirituellesFreizeitPage = React.lazy(() => import('./EsoterikSpirituellesFreizeitPage'));
const EssenTrinkenPage = React.lazy(() => import('./EssenTrinkenPage'));
const FreizeitaktivitaetenPage = React.lazy(() => import('./FreizeitaktivitaetenPage'));
const HandarbeitBastelnKunsthandwerkPage = React.lazy(() => import('./HandarbeitBastelnKunsthandwerkPage'));
const KunstAntiquitaetenPage = React.lazy(() => import('./KunstAntiquitaetenPage'));
const KuenstlerMusikerPage = React.lazy(() => import('./KuenstlerMusikerPage'));
const ModellbauPage = React.lazy(() => import('./ModellbauPage'));
const ReiseEventservicesPage = React.lazy(() => import('./ReiseEventservicesPage'));
const SammelnPage = React.lazy(() => import('./SammelnPage'));
const SportCampingPage = React.lazy(() => import('./SportCampingPage'));
const TroedelPage = React.lazy(() => import('./TroedelPage'));
const VerlorenGefundenPage = React.lazy(() => import('./VerlorenGefundenPage'));
const WeiteresFreizeitHobbyNachbarschaftPage = React.lazy(() => import('./WeiteresFreizeitHobbyNachbarschaftPage'));
const MusikCDsPage = React.lazy(() => import('./MusikCDsPage'));
const MusikinstrumentePage = React.lazy(() => import('./MusikinstrumentePage'));
const FilmDVDPage = React.lazy(() => import('./FilmDVDPage'));
const FachbuecherSchuleStudiumPage = React.lazy(() => import('./FachbuecherSchuleStudiumPage'));
const WeitereMusikFilmeBuecherPage = React.lazy(() => import('./WeitereMusikFilmeBuecherPage'));
const KonzertePage = React.lazy(() => import('./KonzertePage'));
const SportTicketsPage = React.lazy(() => import('./SportTicketsPage'));
const TheaterMusicalPage = React.lazy(() => import('./TheaterMusicalPage'));
const GutscheinePage = React.lazy(() => import('./GutscheinePage'));
const KinderTicketsPage = React.lazy(() => import('./KinderTicketsPage'));
const WeitereEintrittskartenTicketsPage = React.lazy(() => import('./WeitereEintrittskartenTicketsPage'));
const DienstleistungenKuenstlerMusikerPage = React.lazy(() => import('./DienstleistungenKuenstlerMusikerPage'));
const DienstleistungenUmzugTransportPage = React.lazy(() => import('./DienstleistungenUmzugTransportPage'));
const DienstleistungenWeiterePage = React.lazy(() => import('./DienstleistungenWeiterePage'));
const TauschenPage = React.lazy(() => import('./TauschenPage'));
const VerleihenPage = React.lazy(() => import('./VerleihenPage'));
const VerschenkenPage = React.lazy(() => import('./VerschenkenPage'));
const TanzkursePage = React.lazy(() => import('./TanzkursePage'));
const SportkursePage = React.lazy(() => import('./SportkursePage'));
const MusikGesangPage = React.lazy(() => import('./MusikGesangPage'));
const SprachkursePage = React.lazy(() => import('./SprachkursePage'));
const NachhilfePage = React.lazy(() => import('./NachhilfePage'));
const KochenBackenPage = React.lazy(() => import('./KochenBackenPage'));
const KunstGestaltungPage = React.lazy(() => import('./KunstGestaltungPage'));
const WeiterbildungPage = React.lazy(() => import('./WeiterbildungPage'));
const WeitereUnterrichtKursePage = React.lazy(() => import('./WeitereUnterrichtKursePage'));
const EsoterikSpirituellesPage = React.lazy(() => import('./EsoterikSpirituellesPage'));
const MotorradPage = React.lazy(() => import('./MotorradPage'));
const MotorradteilePage = React.lazy(() => import('./MotorradteilePage'));
const NutzfahrzeugePage = React.lazy(() => import('./NutzfahrzeugePage'));
const WohnwagenPage = React.lazy(() => import('./WohnwagenPage'));
const ReparaturenPage = React.lazy(() => import('./ReparaturenPage'));
const WeiteresAutoRadBootPage = React.lazy(() => import('./WeiteresAutoRadBootPage'));
const MyListingsPage = React.lazy(() => import('./MyListingsPage'));
const SettingsPage = React.lazy(() => import('./SettingsPage'));
const PaymentPage = React.lazy(() => import('./PaymentPage'));
const FavoritesPage = React.lazy(() => import('./FavoritesPage'));
const PrivacyPolicyPage = React.lazy(() => import('./pages/PrivacyPolicyPage'));
const ProfileOverviewPage = React.lazy(() => import('./ProfileOverviewPage'));
const FollowingPage = React.lazy(() => import('./FollowingPage'));
const FollowersPage = React.lazy(() => import('./FollowersPage'));
const UserInvoicesPage = React.lazy(() => import('./UserInvoicesPage'));
const AdminSalesReport = React.lazy(() => import('./admin/AdminSalesReport'));
const AdminAdmins = React.lazy(() => import('./admin/AdminAdmins'));
const UserDetailsModal = React.lazy(() => import('./admin/UserDetailsModal'));
const JobsPage = React.lazy(() => import('./JobsPage'));
const SmartRecommendations = React.lazy(() => import('./SmartRecommendations').then(module => ({ default: module.SmartRecommendations })));
const Unternehmensseiten = React.lazy(() => import('./Unternehmensseiten'));
const BMWListingDetail = React.lazy(() => import('./BMWListingDetail'));
const UberUnsPage = React.lazy(() => import('./UberUnsPage'));
const KarrierePage = React.lazy(() => import('./KarrierePage'));
const PressePage = React.lazy(() => import('./PressePage'));
const MagazinPage = React.lazy(() => import('./MagazinPage'));
const EngagementPage = React.lazy(() => import('./EngagementPage'));
const MobileAppsPage = React.lazy(() => import('./MobileAppsPage'));
const MessagesPage = React.lazy(() => import('./MessagesPage'));
const ProPage = React.lazy(() => import('./ProPage'));
const ContactPage = React.lazy(() => import('./ContactPage'));
const NachbarschaftshilfePage = React.lazy(() => import('./NachbarschaftshilfePage'));
const AutosPage = React.lazy(() => import('./AutosPage'));
const AutoteilePage = React.lazy(() => import('./AutoteilePage'));
const BootePage = React.lazy(() => import('./BootePage'));
const BikesPage = React.lazy(() => import('./BikesPage'));
const AutoRadBootPage = React.lazy(() => import('./AutoRadBootPage'));
const HaustierePage = React.lazy(() => import('./HaustierePage'));
const FamilieKindBabyPage = React.lazy(() => import('./FamilieKindBabyPage'));
const FreizeitHobbyNachbarschaftPage = React.lazy(() => import('./FreizeitHobbyNachbarschaftPage'));
const MusikFilmeBuecherPage = React.lazy(() => import('./MusikFilmeBuecherPage'));
const EintrittskartenTicketsPage = React.lazy(() => import('./EintrittskartenTicketsPage'));
const DienstleistungenPage = React.lazy(() => import('./DienstleistungenPage'));
const VerschenkenTauschenPage = React.lazy(() => import('./VerschenkenTauschenPage'));
const UnterrichtKursePage = React.lazy(() => import('./UnterrichtKursePage'));
const NachbarschaftshilfeMainPage = React.lazy(() => import('./NachbarschaftshilfeMainPage'));

const SearchResultsPage = React.lazy(() => import('./SearchResultsPage'));
const FilterSidebar = React.lazy(() => import('./FilterSidebar'));
const NotificationSettingsPage = React.lazy(() => import('./NotificationSettingsPage'));
const NotFoundPage = React.lazy(() => import('./NotFoundPage'));

const AdminLayout = React.lazy(() => import('./admin/AdminLayout'));
const AdminDashboard = React.lazy(() => import('./admin/AdminDashboard'));
const AdminListings = React.lazy(() => import('./admin/AdminListings'));
const AdminUsers = React.lazy(() => import('./admin/AdminUsers'));
const AdminReports = React.lazy(() => import('./admin/AdminReports'));
const AdminPromotions = React.lazy(() => import('./admin/AdminPromotions'));
const AdminCommercialSellers = React.lazy(() => import('./admin/AdminCommercialSellers'));
const AdminSettings = React.lazy(() => import('./admin/AdminSettings'));
const AdminCategories = React.lazy(() => import('./admin/AdminCategories'));
const AdminRoute = React.lazy(() => import('./admin/AdminRoute'));
const AdminStats = React.lazy(() => import('./admin/AdminStats'));
import { useIsMobile } from './hooks/useIsMobile';
import { useAuth } from './contexts/AuthContext';
const MobileBottomNavigation = React.lazy(() => import('./components/MobileBottomNavigation'));
const ScrollToTopButton = React.lazy(() => import('./components/ScrollToTopButton'));

import { Routes, Route, useLocation, useNavigationType } from 'react-router-dom';

// ScrollToTop component to scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();
  const navigationType = useNavigationType();

  const isFirstMount = React.useRef(true);

  React.useEffect(() => {
    // Only scroll to top if navigation is NOT 'POP' (which is back/forward button navigation)
    // AND it's not the initial load of the application.
    // This allows the browser's default scroll restoration to work when reloading or coming back.
    if (!isFirstMount.current && navigationType !== 'POP') {
      window.scrollTo(0, 0);
    }

    // Track the visit
    trackVisit(pathname);

    isFirstMount.current = false;
  }, [pathname, navigationType]);

  return null;
}

// Component to sync URL path with selected category
function CategorySync({ setSelectedCategory }) {
  const { pathname } = useLocation();

  React.useEffect(() => {
    // Extensive mapping of URL slugs to category names
    // Priorities: specific subcategories first, then main categories

    // Main paths checking
    let newCategory = 'Tüm Kategoriler';

    // Subcategory Mappings (Longest/Specific paths first)
    const subCategoryMappings = [
      // Auto, Rad & Boot
      { path: '/Otomobil-Bisiklet-Tekne/Oto-Parca-Lastik', name: 'Oto Parça & Lastik' },
      { path: '/Otomobil-Bisiklet-Tekne/Tekne-Tekne-Malzemeleri', name: 'Tekne & Tekne Malzemeleri' },
      { path: '/Otomobil-Bisiklet-Tekne/Bisiklet-Aksesuarlar', name: 'Bisiklet & Aksesuarlar' },
      { path: '/Otomobil-Bisiklet-Tekne/Motosiklet-Scooter', name: 'Motosiklet & Scooter' },
      { path: '/Otomobil-Bisiklet-Tekne/Motosiklet-Parca-Aksesuarlar', name: 'Motosiklet Parça & Aksesuarlar' },
      { path: '/Otomobil-Bisiklet-Tekne/Ticari-Araclar-Romorklar', name: 'Ticari Araçlar & Römorklar' },
      { path: '/Otomobil-Bisiklet-Tekne/Tamir-Servis', name: 'Tamir & Servis' },
      { path: '/Otomobil-Bisiklet-Tekne/Karavan-Motokaravan', name: 'Karavan & Motokaravan' },
      { path: '/Otomobil-Bisiklet-Tekne/Diger-Otomobil-Bisiklet-Tekne', name: 'Diğer Otomobil, Bisiklet & Tekne' },
      { path: '/Otomobil-Bisiklet-Tekne/Otomobiller', name: 'Otomobiller' },

      // Immobilien
      { path: '/Emlak/Gecici-Konaklama-Paylasimli-Ev', name: 'Geçici Konaklama & Paylaşımlı Ev' },
      { path: '/Emlak/Tatil-Evi-Yurt-Disi-Emlak', name: 'Tatil Evi & Yurt Dışı Emlak' },
      { path: '/Emlak/Garaj-Otopark', name: 'Garaj & Otopark' },
      { path: '/Emlak/Arsa-Bahce', name: 'Arsa & Bahçe' },
      { path: '/Emlak/Satilik-Evler', name: 'Satılık Evler' },
      { path: '/Emlak/Kiralik-Evler', name: 'Kiralık Evler' },
      { path: '/Emlak/Tasimacilik-Nakliye', name: 'Taşımacılık & Nakliye' },
      { path: '/Emlak/Diger-Emlak', name: 'Diğer Emlak' },
      { path: '/Emlak/Konteyner', name: 'Konteyner' },
      { path: '/Emlak/Satilik-Daireler', name: 'Satılık Daireler' },
      { path: '/Emlak/Ticari-Emlak', name: 'Ticari Emlak' },
      { path: '/Emlak/Kiralik-Daireler', name: 'Kiralık Daireler' },
      { path: '/Emlak/Yeni-Projeler', name: 'Yeni Projeler' },

      // Haus & Garten
      { path: '/Ev-Bahce/Ev-Hizmetleri', name: 'Ev Hizmetleri' },
      { path: '/Ev-Bahce/Bahce-Malzemeleri-Bitkiler', name: 'Bahçe Malzemeleri & Bitkiler' },
      { path: '/Ev-Bahce/Mutfak-Yemek-Odasi', name: 'Mutfak & Yemek Odası' },
      { path: '/Ev-Bahce/Lamba-Aydinlatma', name: 'Lamba & Aydınlatma' },
      { path: '/Ev-Bahce/Diger-Ev-Bahce', name: 'Diğer Ev & Bahçe' },
      { path: '/Ev-Bahce/Banyo', name: 'Banyo' },
      { path: '/Ev-Bahce/Ofis', name: 'Ofis' },
      { path: '/Ev-Bahce/Dekorasyon', name: 'Dekorasyon' },
      { path: '/Ev-Bahce/Ev-Tekstili', name: 'Ev Tekstili' },
      { path: '/Ev-Bahce/Ev-Tadilati', name: 'Ev Tadilatı' },
      { path: '/Ev-Bahce/Yatak-Odasi', name: 'Yatak Odası' },
      { path: '/Ev-Bahce/Oturma-Odasi', name: 'Oturma Odası' },

      // Moda & Güzellik
      { path: '/Moda-Guzellik/Guzellik-Saglik', name: 'Güzellik & Sağlık' },
      { path: '/Moda-Guzellik/Canta-Aksesuarlar', name: 'Çanta & Aksesuarlar' },
      { path: '/Moda-Guzellik/Saat-Taki', name: 'Saat & Takı' },
      { path: '/Moda-Guzellik/Diger-Moda-Guzellik', name: 'Diğer Moda & Güzellik' },
      { path: '/Moda-Guzellik/Kadin-Giyimi', name: 'Kadın Giyimi' },
      { path: '/Moda-Guzellik/Kadin-Ayakkabilari', name: 'Kadın Ayakkabıları' },
      { path: '/Moda-Guzellik/Erkek-Giyimi', name: 'Erkek Giyimi' },
      { path: '/Moda-Guzellik/Erkek-Ayakkabilari', name: 'Erkek Ayakkabıları' },

      // Elektronik
      { path: '/Elektronik/Ses-Hifi', name: 'Ses & Hifi' },
      { path: '/Elektronik/Elektronik-Hizmetler', name: 'Elektronik Hizmetler' },
      { path: '/Elektronik/Cep-Telefonu-Telefon', name: 'Cep Telefonu & Telefon' },
      { path: '/Elektronik/Bilgisayar-Aksesuarlari-Yazilim', name: 'Bilgisayar Aksesuarları & Yazılım' },
      { path: '/Elektronik/Tabletler-E-Okuyucular', name: 'Tabletler & E-Okuyucular' },
      { path: '/Elektronik/TV-Video', name: 'TV & Video' },
      { path: '/Elektronik/Diger-Elektronik', name: 'Diğer Elektronik' },
      { path: '/Elektronik/Ev-Aletleri', name: 'Ev Aletleri' },
      { path: '/Elektronik/Fotograf-Kamera', name: 'Fotoğraf & Kamera' },
      { path: '/Elektronik/Konsollar', name: 'Konsollar' },
      { path: '/Elektronik/Dizustu-Bilgisayarlar', name: 'Dizüstü Bilgisayarlar' },
      { path: '/Elektronik/Bilgisayarlar', name: 'Bilgisayarlar' },
      { path: '/Elektronik/Video-Oyunlari', name: 'Video Oyunları' },

      // Haustiere
      { path: '/Evcil-Hayvanlar/Hayvan-Bakimi-Egitimi', name: 'Hayvan Bakımı & Eğitimi' },
      { path: '/Evcil-Hayvanlar/Kayip-Hayvanlar', name: 'Kayıp Hayvanlar' },
      { path: '/Evcil-Hayvanlar/Aksesuarlar', name: 'Aksesuarlar' },
      { path: '/Evcil-Hayvanlar/Baliklar', name: 'Balıklar' },
      { path: '/Evcil-Hayvanlar/Kopekler', name: 'Köpekler' },
      { path: '/Evcil-Hayvanlar/Kedi', name: 'Kediler' },
      { path: '/Evcil-Hayvanlar/Kucuk-Hayvanlar', name: 'Küçük Hayvanlar' },
      { path: '/Evcil-Hayvanlar/Ciftlik-Hayvanlari', name: 'Çiftlik Hayvanları' },
      { path: '/Evcil-Hayvanlar/Atlar', name: 'Atlar' },
      { path: '/Evcil-Hayvanlar/Kuslar', name: 'Kuşlar' },

      // Familie, Kind & Baby
      { path: '/Aile-Cocuk-Bebek/Bebek-Cocuk-Giyimi', name: 'Bebek & Çocuk Giyimi' },
      { path: '/Aile-Cocuk-Bebek/Bebek-Cocuk-Ayakkabilari', name: 'Bebek & Çocuk Ayakkabıları' },
      { path: '/Aile-Cocuk-Bebek/Bebek-Ekipmanlari', name: 'Bebek Ekipmanları' },
      { path: '/Aile-Cocuk-Bebek/Oto-Koltuklari', name: 'Oto Koltukları' },
      { path: '/Aile-Cocuk-Bebek/Babysitter-Cocuk-Bakimi', name: 'Babysitter & Çocuk Bakımı' },
      { path: '/Aile-Cocuk-Bebek/Bebek-Arabalari-Pusetler', name: 'Bebek Arabaları & Pusetler' },
      { path: '/Aile-Cocuk-Bebek/Diger-Aile-Cocuk-Bebek', name: 'Diğer Aile, Çocuk & Bebek' },
      { path: '/Aile-Cocuk-Bebek/Yasli-Bakimi', name: 'Yaşlı Bakımı' },
      { path: '/Aile-Cocuk-Bebek/Cocuk-Odasi-Mobilyalari', name: 'Bebek Odası Mobilyaları' },
      { path: '/Aile-Cocuk-Bebek/Oyuncaklar', name: 'Oyuncaklar' },

      // Jobs
      { path: '/Is-Ilanlari/Insaat-Sanat-Uretim', name: 'İnşaat, Sanat & Üretim' },
      { path: '/Is-Ilanlari/Buroarbeit-Yonetim', name: 'Ofis İşleri & Yönetim' },
      { path: '/Is-Ilanlari/Gastronomi-Turizm', name: 'Gastronomi & Turizm' },
      { path: '/Is-Ilanlari/Musteri-Hizmetleri-Cagri-Merkezi', name: 'Müşteri Hizmetleri & Çağrı Merkezi' },
      { path: '/Is-Ilanlari/Ek-Isler', name: 'Mini & Ek İşler' },
      { path: '/Is-Ilanlari/Sosyal-Sektor-Bakim', name: 'Sosyal Sektör & Bakım' },
      { path: '/Is-Ilanlari/Tasimacilik-Lojistik', name: 'Nakliye, Lojistik & Trafik' },
      { path: '/Is-Ilanlari/Satis-Pazarlama', name: 'Satış, Satın Alma & Pazarlama' },
      { path: '/Is-Ilanlari/Diger-Is-Ilanlari', name: 'Diğer İş İlanları' },
      { path: '/Is-Ilanlari/Mesleki-Egitim', name: 'Mesleki Eğitim' },
      { path: '/Is-Ilanlari/Staj', name: 'Stajlar' },

      // Freizeit, Hobby & Nachbarschaft
      { path: '/Eglence-Hobi-Mahalle/Ezoterizm-Spiritualizm', name: 'Ezoterizm & Spiritüalizm' },
      { path: '/Eglence-Hobi-Mahalle/Yiyecek-Icecek', name: 'Yiyecek & İçecek' },
      { path: '/Eglence-Hobi-Mahalle/El-Sanatlari-Hobi', name: 'El Sanatları & Hobi' },
      { path: '/Eglence-Hobi-Mahalle/Sanat-Antikalar', name: 'Sanat & Antikalar' },
      { path: '/Eglence-Hobi-Mahalle/Sanatcilar-Muzisyenler', name: 'Sanatçılar & Müzisyenler' },
      { path: '/Eglence-Hobi-Mahalle/Seyahat-Etkinlik-Hizmetleri', name: 'Seyahat & Etkinlik Hizmetleri' },
      { path: '/Eglence-Hobi-Mahalle/Spor-Kamp', name: 'Spor & Kamp' },
      { path: '/Eglence-Hobi-Mahalle/Kayip-Buluntu', name: 'Kayıp & Buluntu' },
      { path: '/Eglence-Hobi-Mahalle/Diger-Eglence-Hobi-Mahalle', name: 'Diğer Eğlence, Hobi & Mahalle' },
      { path: '/Eglence-Hobi-Mahalle/Bos-Zaman-Aktiviteleri', name: 'Boş Zaman Aktiviteleri' },
      { path: '/Eglence-Hobi-Mahalle/Model-Yapimi', name: 'Model Yapımı' },
      { path: '/Eglence-Hobi-Mahalle/Koleksiyon', name: 'Koleksiyon' },
      { path: '/Eglence-Hobi-Mahalle/Bit-Pazari', name: 'Bit Pazarı' },

      // Musik, Filme & Bücher
      { path: '/Muzik-Film-Kitap/Kitap-Dergi', name: 'Kitap & Dergi' },
      { path: '/Muzik-Film-Kitap/Kirtasiye', name: 'Kırtasiye' },
      { path: '/Muzik-Film-Kitap/Ders-Kitaplari-Okul-Egitim', name: 'Ders Kitapları, Okul & Eğitim' },
      { path: '/Muzik-Film-Kitap/Film-DVD', name: 'Film & DVD' },
      { path: '/Muzik-Film-Kitap/Muzik-CDler', name: 'Müzik & CD\'ler' },
      { path: '/Muzik-Film-Kitap/Diger-Muzik-Film-Kitap', name: 'Diğer Müzik, Film & Kitap' },
      { path: '/Muzik-Film-Kitap/Cizgi-Romanlar', name: 'Çizgi Romanlar' },
      { path: '/Muzik-Film-Kitap/Muzik-Enstrumanlari', name: 'Müzik Enstrümanları' },

      // Eintrittskarten & Tickets
      { path: '/Biletler/Tren-Toplu-Tasima', name: 'Tren & Toplu Taşıma' },
      { path: '/Biletler/Komedi-Kabare', name: 'Komedi & Kabare' },
      { path: '/Biletler/Tiyatro-Muzikal', name: 'Tiyatro & Müzikal' },
      { path: '/Biletler/Diger-Biletler', name: 'Diğer Biletler' },
      { path: '/Biletler/Hediye-Kartlari', name: 'Hediye Çekleri' },
      { path: '/Biletler/Cocuk', name: 'Çocuk Etkinlikleri' },
      { path: '/Biletler/Konserler', name: 'Konserler' },
      { path: '/Biletler/Spor', name: 'Spor' },

      // Dienstleistungen
      { path: '/Hizmetler/Otomobil-Bisiklet-Tekne-Servisi', name: 'Otomobil, Bisiklet & Tekne' },
      { path: '/Hizmetler/Babysitter-Cocuk-Bakimi', name: 'Babysitter & Çocuk Bakımı' },
      { path: '/Hizmetler/Ev-Bahce', name: 'Ev & Bahçe' },
      { path: '/Hizmetler/Sanatcilar-Muzisyenler', name: 'Sanatçılar & Müzisyenler' },
      { path: '/Hizmetler/Seyahat-Etkinlik', name: 'Seyahat & Etkinlik' },
      { path: '/Hizmetler/Hayvan-Bakimi-Egitimi', name: 'Hayvan Bakımı & Eğitimi' },
      { path: '/Hizmetler/Tasimacilik-Nakliye', name: 'Taşımacılık & Nakliye' },
      { path: '/Hizmetler/Diger-Hizmetler', name: 'Diğer Hizmetler' },
      { path: '/Hizmetler/Yasli-Bakimi', name: 'Yaşlı Bakımı' },
      { path: '/Hizmetler/Elektronik', name: 'Elektronik' },

      // Verschenken & Tauschen
      { path: '/Ucretsiz-Takas/Takas', name: 'Takas' },
      { path: '/Ucretsiz-Takas/Kiralama', name: 'Kiralama' },
      { path: '/Ucretsiz-Takas/Ucretsiz', name: 'Ücretsiz' },

      // Unterricht & Kurse
      { path: '/Egitim-Kurslar/Ezoterizm-Spiritualizm', name: 'Ezoterizm & Spiritüalizm' },
      { path: '/Egitim-Kurslar/Yemek-Pastacilik-Kurslari', name: 'Yemek & Pastacılık' },
      { path: '/Egitim-Kurslar/Sanat-Tasarim-Kurslari', name: 'Sanat & Tasarım' },
      { path: '/Egitim-Kurslar/Muzik-San-Dersleri', name: 'Müzik & Şan' },
      { path: '/Egitim-Kurslar/Diger-Dersler-Kurslar', name: 'Diğer Eğitim & Kurslar' },
      { path: '/Egitim-Kurslar/Bilgisayar-Kurslari', name: 'Bilgisayar Kursları' },
      { path: '/Egitim-Kurslar/Ozel-Ders', name: 'Özel Ders' },
      { path: '/Egitim-Kurslar/Spor-Kurslari', name: 'Spor Kursları' },
      { path: '/Egitim-Kurslar/Dil-Kurslari', name: 'Dil Kursları' },
      { path: '/Egitim-Kurslar/Dans-Kurslari', name: 'Dans Kursları' },
      { path: '/Egitim-Kurslar/Surekli-Egitim', name: 'Sürekli Eğitim' },

      // Nachbarschaftshilfe
      { path: '/Komsu-Yardimi/Komsu-Yardimi', name: 'Komşu Yardımı' },
    ];

    // Main Category Mappings
    const mainCategoryMappings = [
      { path: '/Otomobil-Bisiklet-Tekne', name: 'Otomobil, Bisiklet & Tekne' },
      { path: '/Emlak', name: 'Emlak' },
      { path: '/Ev-Bahce', name: 'Ev & Bahçe' },
      { path: '/Moda-Guzellik', name: 'Moda & Güzellik' },
      { path: '/Elektronik', name: 'Elektronik' },
      { path: '/Evcil-Hayvanlar', name: 'Evcil Hayvanlar' },
      { path: '/Aile-Cocuk-Bebek', name: 'Aile, Çocuk & Bebek' },
      { path: '/Is-Ilanlari', name: 'İş İlanları' },
      { path: '/Eglence-Hobi-Mahalle', name: 'Eğlence, Hobi & Mahalle' },
      { path: '/Muzik-Film-Kitap', name: 'Müzik, Film & Kitap' },
      { path: '/Biletler', name: 'Biletler' },
      { path: '/Hizmetler', name: 'Hizmetler' },
      { path: '/Ucretsiz-Takas', name: 'Ücretsiz & Takas' },
      { path: '/Egitim-Kurslar', name: 'Eğitim & Kurslar' },
      { path: '/Komsu-Yardimi', name: 'Komşu Yardımı' },
    ];

    // Check Subcategories first
    const matchedSub = subCategoryMappings.find(m => pathname.includes(m.path));
    if (matchedSub) {
      newCategory = matchedSub.name;
    } else {
      // Check Main Categories
      const matchedMain = mainCategoryMappings.find(m => pathname.includes(m.path));
      if (matchedMain) {
        newCategory = matchedMain.name;
      }
    }

    setSelectedCategory(newCategory);
  }, [pathname, setSelectedCategory]);

  return null;
}

function App() {
  const [selectedCategory, setSelectedCategory] = useState('Tüm Kategoriler');
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('Türkiye');
  const [cartItems, setCartItems] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const isMobile = useIsMobile();
  const { user } = useAuth(); // Get authenticated user

  // PWA States
  const [showInstallBanner, setShowInstallBanner] = useState(false);
  const [isPWAInstalled, setIsPWAInstalled] = useState(false);

  // Filtreleme state'leri
  const [priceRange, setPriceRange] = useState('all');
  const [filterLocation, setFilterLocation] = useState('Tüm Şehirler');
  const [sortBy, setSortBy] = useState('relevance');

  // ── Brand color (Admin Settings → Arama Sütunu Rengi) ──────────────────
  // Reads from Supabase on mount, applies as --brand-color CSS variable, and saves to localStorage
  useEffect(() => {
    const fetchAndApplySettings = async () => {
      try {
        const { supabase } = await import('./lib/supabase');
        const { data, error } = await supabase
            .from('site_settings')
            .select('*')
            .eq('id', 1)
            .single();

        if (data && !error) {
            const merged = {
                siteName: data.site_name || 'ExVitrin',
                siteDescription: data.site_description || "Türkiye'nin en büyük ilan pazaryeri.",
                contactEmail: data.contact_email || 'kerem_aydin@aol.com',
                contactPhone: data.contact_phone || '+90 212 123 45 67',
                maintenanceMode: data.maintenance_mode || false,
                allowRegistration: data.allow_registration !== false,
                searchBgColor: data.search_bg_color || ''
            };
            
            // Save to localStorage for components like AddListing to pick up instantly
            localStorage.setItem('site_settings', JSON.stringify(merged));
            
            // Apply CSS Variables
            if (merged.searchBgColor) {
              document.documentElement.style.setProperty('--brand-color', merged.searchBgColor);
              document.documentElement.style.setProperty('--brand-color-dark', merged.searchBgColor);
            } else {
              document.documentElement.style.removeProperty('--brand-color');
              document.documentElement.style.removeProperty('--brand-color-dark');
            }
            
            // Dispatch event for components that listen to settings change
            window.dispatchEvent(new CustomEvent('site_settings_updated'));
        }
      } catch (err) {
        console.error('Error fetching site settings on app load:', err);
      }
    };

    fetchAndApplySettings();

    // Listen for changes (e.g. if updated from Admin panel in the same browser)
    const applyBrandColor = () => {
      try {
        const saved = localStorage.getItem('site_settings');
        if (saved) {
          const { searchBgColor } = JSON.parse(saved);
          if (searchBgColor) {
            document.documentElement.style.setProperty('--brand-color', searchBgColor);
            document.documentElement.style.setProperty('--brand-color-dark', searchBgColor);
          } else {
            document.documentElement.style.removeProperty('--brand-color');
            document.documentElement.style.removeProperty('--brand-color-dark');
          }
        }
      } catch (e) { /* ignore */ }
    };

    window.addEventListener('site_settings_updated', applyBrandColor);
    window.addEventListener('storage', applyBrandColor);
    return () => {
      window.removeEventListener('site_settings_updated', applyBrandColor);
      window.removeEventListener('storage', applyBrandColor);
    };
  }, []);

  // Initialize PWA
  useEffect(() => {
    const initPWA = async () => {
      // Register service worker
      const registered = await pwaManager.init();

      if (registered) {
        console.log('✅ PWA initialized');

        // Check if already installed
        setIsPWAInstalled(pwaManager.isInstalled());

        // Listen for install prompt
        pwaManager.listenForInstallPrompt();

        // Listen for PWA events
        window.addEventListener('pwa-install-available', () => {
          setShowInstallBanner(true);
        });

        window.addEventListener('pwa-install-completed', () => {
          setShowInstallBanner(false);
          setIsPWAInstalled(true);
        });
      }
    };

    initPWA();


  }, []);

  // Setup push notifications when user logs in
  useEffect(() => {
    if (user) {
      // Subscribe to push notifications
      const setupNotifications = async () => {
        const hasPermission = await pwaManager.requestNotificationPermission();
        if (hasPermission) {
          await pwaManager.subscribeToPushNotifications(user.id);

          // Register periodic sync for new messages
          await pwaManager.registerPeriodicSync('check-new-messages', 15 * 60 * 1000); // Every 15 minutes
        }
      };

      setupNotifications();
    }
  }, [user]);

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setCurrentUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem('user');
      }
    }
  }, []);

  const addToCart = (item) => {
    setCartItems(prev => {
      if (prev.length > 0 && prev[0].sellerId !== item.sellerId) {
        if (window.confirm("Sepette sadece tek bir satıcının ürünleri olabilir. Devam ederseniz mevcut sepetiniz temizlenecektir. Onaylıyor musunuz?")) {
          return [item];
        }
        return prev;
      }
      return [...prev, item];
    });
    setShowCart(true);
  };

  const removeFromCart = (index) => {
    setCartItems(prev => prev.filter((_, i) => i !== index));
  };

  const updateCartQuantity = (index, newQuantity) => {
    if (newQuantity < 1) return;
    setCartItems(prev => prev.map((item, i) =>
      i === index ? { ...item, quantity: newQuantity } : item
    ));
  };

  const [favorites, setFavorites] = useState([]);

  // Load favorites from Supabase on mount
  useEffect(() => {
    const loadFavorites = async () => {
      try {
        if (user) {
          // Migrate localStorage favorites to Supabase (one-time)
          const localFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');
          if (localFavorites.length > 0) {
            console.log('Migrating', localFavorites.length, 'favorites from localStorage to Supabase...');

            for (const listingId of localFavorites) {
              try {
                await favoritesApi.addFavorite(listingId, user.id);
              } catch (error) {
                console.error('Error migrating favorite:', listingId, error);
              }
            }

            // Clear localStorage after migration
            localStorage.removeItem('favorites');
            console.log('Migration complete!');
          }

          // Load favorites from Supabase
          const favoritesData = await favoritesApi.getFavorites(user.id);
          // Extract listing IDs
          const favoriteIds = favoritesData.map(fav => fav.listing_id);
          setFavorites(favoriteIds);
        }
      } catch (error) {
        console.error('Error loading favorites:', error);
      }
    };

    loadFavorites();
  }, [user]); // Re-run when user changes

  const toggleFavorite = async (listingId) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        // Show alert and redirect to login
        if (window.confirm("Favorilere eklemek için lütfen giriş yapın. Giriş sayfasına yönlendirilsin mi?")) {
          window.location.href = '/login';
        }
        return;
      }

      const isFav = favorites.includes(listingId);

      if (isFav) {
        // Remove from favorites
        await favoritesApi.removeFavorite(listingId, user.id);
        setFavorites(prev => prev.filter(id => id !== listingId));
      } else {
        // Add to favorites
        await favoritesApi.addFavorite(listingId, user.id);
        setFavorites(prev => [...prev, listingId]);
      }

      // Dispatch custom event for same-window updates
      window.dispatchEvent(new Event('favoritesUpdated'));
    } catch (error) {
      console.error('Error toggling favorite:', error);
      alert("Favori işlemi sırasında bir hata oluştu.");
    }
  };

  const isFavorite = (listingId) => favorites.includes(listingId);

  const [followedSellers, setFollowedSellers] = useState([]);
  const [followLoading, setFollowLoading] = useState(false);

  // Load followed sellers from Supabase on mount
  useEffect(() => {
    const loadFollowedSellers = async () => {
      try {
        const following = await getFollowing();
        // Extract user IDs from the followed users
        const followerIds = following.map(user => user.id);
        setFollowedSellers(followerIds);
      } catch (error) {
        console.error('Error loading followed sellers:', error);
        // If not authenticated, just set empty array
        setFollowedSellers([]);
      }
    };

    loadFollowedSellers();
  }, [user]); // Re-run when user changes

  const toggleFollowSeller = async (sellerId) => {
    try {
      // Check if user is authenticated
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        alert("Satıcıyı takip etmek için lütfen önce giriş yapın.");
        return;
      }

      setFollowLoading(true);
      const isCurrentlyFollowing = followedSellers.includes(sellerId);

      if (isCurrentlyFollowing) {
        // Unfollow
        await unfollowUser(sellerId);
        setFollowedSellers(prev => prev.filter(id => id !== sellerId));
      } else {
        // Follow
        await followUser(sellerId);
        setFollowedSellers(prev => [...prev, sellerId]);
      }
    } catch (error) {
      console.error('Error toggling follow:', error);
      alert("Takip işlemi sırasında bir hata oluştu.");
    } finally {
      setFollowLoading(false);
    }
  };

  const isSellerFollowed = (sellerId) => followedSellers.includes(sellerId);
  const smartRouteProps = { addToCart, toggleFavorite, isFavorite, toggleFollowSeller, isSellerFollowed };


  return (
    <>
      <ScrollToTop />
      <CategorySync setSelectedCategory={setSelectedCategory} />
      <div className="App min-h-screen bg-gray-50 dark:!bg-neutral-950 text-gray-900 dark:text-neutral-100 transition-colors duration-300">
        <PresenceTracker />
        <React.Suspense fallback={
          <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:!bg-neutral-950">
            <div className="text-center">
              <LoadingSpinner size="large" />
            </div>
          </div>
        }>
          {/* Welcome Modal */}
          {showWelcomeModal && (
            <WelcomeModal onClose={() => setShowWelcomeModal(false)} />
          )}

          {/* Header */}
          <Header cartCount={cartItems.length} />

          {/* Search Section */}
          <SearchSection
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            location={location}
            setLocation={setLocation}
            cartItems={cartItems}
            cartCount={cartItems.reduce((acc, item) => acc + (item.quantity || 1), 0)}
            showCart={showCart}
            setShowCart={setShowCart}
            removeFromCart={removeFromCart}
            updateCartQuantity={updateCartQuantity}
            followedSellers={followedSellers}
            favorites={favorites}
          />

          <Routes>
            <Route path="/" element={
              <>
                <SEO />
                <main className="max-w-[1400px] mx-auto px-3 sm:px-4 py-4 sm:py-6 flex gap-4 sm:gap-6">
                  {/* Sidebar - Hidden on mobile */}
                  <div className="hidden lg:block">
                    <CategorySidebar
                      selectedCategory={selectedCategory}
                      setSelectedCategory={setSelectedCategory}
                    />
                  </div>

                  {/* Main Content Area - Responsive width */}
                  <div className="w-full lg:w-[960px] flex-shrink-0">
                    {/* Banner - Responsive height */}
                    {/* Banner Slider */}
                    <BannerSlider />

                    {/* Mobile Category Icon Grid - only on mobile */}
                    <React.Suspense fallback={null}>
                      <MobileCategoryGrid setSelectedCategory={setSelectedCategory} />
                    </React.Suspense>

                    {/* Gallery Section */}
                    <Gallery toggleFavorite={toggleFavorite} isFavorite={isFavorite} />

                    {/* Latest Listings */}
                    <section className="mt-6 sm:mt-8">
                      <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg sm:text-xl font-semibold">Son İlanlar</h2>
                        <a
                          href="/add-listing"
                          className="text-xs sm:text-sm text-red-600 hover:text-red-700 font-medium hover:underline transition-colors"
                        >
                          İlan Ver
                        </a>
                      </div>
                      <ListingGrid
                        isLatest={true}
                        selectedCategory={selectedCategory}
                        toggleFavorite={toggleFavorite}
                        isFavorite={isFavorite}
                      />
                    </section>

                    {/* Special Sellers Section */}
                    <SpecialSellers
                      toggleFollowSeller={toggleFollowSeller}
                      isSellerFollowed={isSellerFollowed}
                    />

                    {/* Smart Recommendations - Personalized Listings */}
                    <div className="mt-8 sm:mt-12">
                      <h2 className="text-lg sm:text-xl font-semibold mb-4">Önerilen İlanlar</h2>
                      <SmartRecommendations
                        toggleFavorite={toggleFavorite}
                        isFavorite={isFavorite}
                      />
                    </div>

                    {/* Gallery Section */}

                  </div>
                </main>
              </>
            } />
            <Route path="/product/:id" element={
              <ProductDetail
                addToCart={addToCart}
                toggleFavorite={toggleFavorite}
                isFavorite={isFavorite}
                toggleFollowSeller={toggleFollowSeller}
                isSellerFollowed={isSellerFollowed}
              />
            } />
            <Route path="/seller/:sellerId" element={
              <SellerPage
                toggleFavorite={toggleFavorite}
                isFavorite={isFavorite}
                toggleFollowSeller={toggleFollowSeller}
                isSellerFollowed={isSellerFollowed}
              />
            } />
            <Route path="/yasal-uyarilar" element={<LegalNoticesPage />} />
            <Route path="/cerez-politikasi" element={<CookiesPolicyPage />} />
            <Route path="/hayvan-haklari-ve-yasal-uyari" element={<AnimalProtectionPage />} />
            <Route path="/emlak-ilanlari-yasal-uyari" element={<RealEstateLegalPage />} />
            <Route path="/vasita-ilanlari-yasal-uyari" element={<VehicleLegalPage />} />
            <Route path="/store/:sellerId" element={<StorePage />} />
            <Route path="/s/:sellerId" element={<StorePage />} />
            <Route path="/add-listing" element={<AddListing />} />
            <Route path="/hakkimizda" element={<UberUnsPage />} />
            <Route path="/gizlilik-politikasi" element={<PrivacyPolicyPage />} />
            <Route path="/karriere" element={<KarrierePage />} />
            <Route path="/presse" element={<PressePage />} />
            <Route path="/exvitrin-magazin" element={<MagazinPage />} />
            <Route path="/engagement" element={<EngagementPage />} />
            <Route path="/mobile-apps" element={<MobileAppsPage />} />
            <Route path="/unternehmensseite-pro" element={<ProPage />} />
            <Route path="/iletisim" element={<ContactPage />} />
            <Route path="/search" element={<SearchResultsPage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            {/* Dynamic Routing - Handled by SmartRoute for categories, listings, and stores */}
            {/* === MODA & GÜZELLİK === */}
            <Route path="/Moda-Guzellik/Kadin-Giyimi" element={<DamenbekleidungPage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Moda-Guzellik/Erkek-Giyimi" element={<HerrenbekleidungPage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Moda-Guzellik/Kadin-Ayakkabilari" element={<DamenschuhePage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Moda-Guzellik/Erkek-Ayakkabilari" element={<HerrenschuhePage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Moda-Guzellik/Canta-Aksesuarlar" element={<TaschenAccessoiresPage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Moda-Guzellik/Saat-Taki" element={<UhrenSchmuckPage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Moda-Guzellik/Diger-Moda-Guzellik" element={<WeiteresModeBeautyPage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            {/* === ELEKTRONİK === */}
            <Route path="/Elektronik/Fotograf-Kamera" element={<FotoPage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Elektronik/Dizustu-Bilgisayarlar" element={<NotebooksPage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Elektronik/Cep-Telefonu-Telefon" element={<HandyTelefonPage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Elektronik/Ev-Aletleri" element={<HaushaltsgeraetePage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Elektronik/Konsollar" element={<KonsolenPage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Elektronik/Bilgisayarlar" element={<PCsPage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Elektronik/Bilgisayar-Aksesuarlari-Yazilim" element={<PCZubehoerSoftwarePage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Elektronik/Tabletler-E-Okuyucular" element={<TabletsReaderPage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Elektronik/TV-Video" element={<TVVideoPage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Elektronik/Video-Oyunlari" element={<VideospielePage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Elektronik/Diger-Elektronik" element={<WeitereElektronikPage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Elektronik/Elektronik-Hizmetler" element={<ElektronikDienstleistungenPage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            {/* === EMLAK === */}
            <Route path="/Emlak/Kiralik-Daireler" element={<MietwohnungenPage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Emlak/Satilik-Daireler" element={<EigentumswohnungenPage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Emlak/Satilik-Evler" element={<HaeuserZumKaufPage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Emlak/Kiralik-Evler" element={<HaeuserZurMietePage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Emlak/Tatil-Evi-Yurt-Disi-Emlak" element={<FerienAuslandsimmobilienPage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Emlak/Garaj-Otopark" element={<GaragenStellplaetzePage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Emlak/Ticari-Emlak" element={<GewerbeimmobilienPage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Emlak/Arsa-Bahce" element={<GrundstueckeGaertenPage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Emlak/Satilik-Yazlik" element={<SatilikYazlikPage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Emlak/Yeni-Projeler" element={<NeubauprojektePage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Emlak/Tasimacilik-Nakliye" element={<UmzugTransportPage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Emlak/Diger-Emlak" element={<WeitereImmobilienPage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            {/* === EV & BAHÇE === */}
            <Route path="/Ev-Bahce/Oturma-Odasi" element={<WohnzimmerPage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Ev-Bahce/Yatak-Odasi" element={<SchlafzimmerPage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Ev-Bahce/Mutfak-Yemek-Odasi" element={<KuecheEsszimmerPage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Ev-Bahce/Lamba-Aydinlatma" element={<LampenLichtPage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Ev-Bahce/Bahce-Malzemeleri-Bitkiler" element={<GartenzubehoerPflanzenPage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Ev-Bahce/Ev-Tekstili" element={<HeimtextilienPage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Ev-Bahce/Ev-Tadilati" element={<HeimwerkenPage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Ev-Bahce/Dekorasyon" element={<DekorationPage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Ev-Bahce/Ofis" element={<BueroPage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Ev-Bahce/Diger-Ev-Bahce" element={<WeiteresHausGartenPage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            {/* === EVCİL HAYVANLAR === */}
            <Route path="/Evcil-Hayvanlar/Baliklar" element={<FischePage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Evcil-Hayvanlar/Kopekler" element={<HundePage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Evcil-Hayvanlar/Kedi" element={<KatzenPage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Evcil-Hayvanlar/Kucuk-Hayvanlar" element={<KleintierePage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Evcil-Hayvanlar/Ciftlik-Hayvanlari" element={<NutztierePage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Evcil-Hayvanlar/Atlar" element={<PferdePage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Evcil-Hayvanlar/Hayvan-Bakimi-Egitimi" element={<TierbetreuungTrainingPage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Evcil-Hayvanlar/Kayip-Hayvanlar" element={<VermissTierePage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Evcil-Hayvanlar/Kuslar" element={<VoegelPage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Evcil-Hayvanlar/Aksesuarlar" element={<TierzubehoerPage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            {/* === AİLE, ÇOCUK & BEBEK === */}
            <Route path="/Aile-Cocuk-Bebek/Yasli-Bakimi" element={<AltenpflegePage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Aile-Cocuk-Bebek/Bebek-Cocuk-Giyimi" element={<BabyKinderkleidungPage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Aile-Cocuk-Bebek/Bebek-Cocuk-Ayakkabilari" element={<BabyKinderschuhePage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Aile-Cocuk-Bebek/Bebek-Ekipmanlari" element={<BabyAusstattungPage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Aile-Cocuk-Bebek/Oto-Koltuklari" element={<BabyschalenKindersitzePage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Aile-Cocuk-Bebek/Babysitter-Cocuk-Bakimi" element={<BabysitterKinderbetreuungPage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Aile-Cocuk-Bebek/Oyuncaklar" element={<SpielzeugPage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Aile-Cocuk-Bebek/Bebek-Arabalari-Pusetler" element={<KinderwagenBuggysPage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Aile-Cocuk-Bebek/Cocuk-Odasi-Mobilyalari" element={<KinderzimmermobelPage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Aile-Cocuk-Bebek/Diger-Aile-Cocuk-Bebek" element={<WeiteresFamilieKindBabyPage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            {/* === İŞ İLANLARI === */}
            <Route path="/Is-Ilanlari/Gastronomi-Turizm" element={<GastronomieTourismusPage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Is-Ilanlari/Musteri-Hizmetleri-Cagri-Merkezi" element={<KundenserviceCallCenterPage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Is-Ilanlari/Ek-Isler" element={<MiniNebenjobsPage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Is-Ilanlari/Sosyal-Sektor-Bakim" element={<SozialerSektorPflegePage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Is-Ilanlari/Tasimacilik-Lojistik" element={<TransportLogistikVerkehrPage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Is-Ilanlari/Satis-Pazarlama" element={<SalesPurchasingMarketingPage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Is-Ilanlari/Staj" element={<PraktikaPage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Is-Ilanlari/Diger-Is-Ilanlari" element={<WeitereJobsPage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Is-Ilanlari/Buroarbeit-Yonetim" element={<BueroarbeitVerwaltungPage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            {/* === EĞLENCE, HOBİ & MAHALLE === */}
            <Route path="/Eglence-Hobi-Mahalle/Ezoterizm-Spiritualizm" element={<EsoterikSpirituellesFreizeitPage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Eglence-Hobi-Mahalle/Yiyecek-Icecek" element={<EssenTrinkenPage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Eglence-Hobi-Mahalle/Bos-Zaman-Aktiviteleri" element={<FreizeitaktivitaetenPage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Eglence-Hobi-Mahalle/El-Sanatlari-Hobi" element={<HandarbeitBastelnKunsthandwerkPage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Eglence-Hobi-Mahalle/Sanat-Antikalar" element={<KunstAntiquitaetenPage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Eglence-Hobi-Mahalle/Sanatcilar-Muzisyenler" element={<KuenstlerMusikerPage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Eglence-Hobi-Mahalle/Model-Yapimi" element={<ModellbauPage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Eglence-Hobi-Mahalle/Seyahat-Etkinlik-Hizmetleri" element={<ReiseEventservicesPage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Eglence-Hobi-Mahalle/Koleksiyon" element={<SammelnPage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Eglence-Hobi-Mahalle/Spor-Kamp" element={<SportCampingPage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Eglence-Hobi-Mahalle/Bit-Pazari" element={<TroedelPage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Eglence-Hobi-Mahalle/Kayip-Buluntu" element={<VerlorenGefundenPage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Eglence-Hobi-Mahalle/Diger-Eglence-Hobi-Mahalle" element={<WeiteresFreizeitHobbyNachbarschaftPage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            {/* === MÜZİK, FİLM & KİTAP === */}
            <Route path="/Muzik-Film-Kitap/Muzik-CDler" element={<MusikCDsPage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Muzik-Film-Kitap/Muzik-Enstrumanlari" element={<MusikinstrumentePage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Muzik-Film-Kitap/Film-DVD" element={<FilmDVDPage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Muzik-Film-Kitap/Ders-Kitaplari-Okul-Egitim" element={<FachbuecherSchuleStudiumPage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Muzik-Film-Kitap/Diger-Muzik-Film-Kitap" element={<WeitereMusikFilmeBuecherPage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            {/* === BİLETLER === */}
            <Route path="/Biletler/Konserler" element={<KonzertePage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Biletler/Spor" element={<SportTicketsPage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Biletler/Tiyatro-Muzikal" element={<TheaterMusicalPage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Biletler/Hediye-Kartlari" element={<GutscheinePage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Biletler/Cocuk" element={<KinderTicketsPage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Biletler/Diger-Biletler" element={<WeitereEintrittskartenTicketsPage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            {/* === HİZMETLER === */}
            <Route path="/Hizmetler/Sanatcilar-Muzisyenler" element={<DienstleistungenKuenstlerMusikerPage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Hizmetler/Tasimacilik-Nakliye" element={<DienstleistungenUmzugTransportPage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Hizmetler/Diger-Hizmetler" element={<DienstleistungenWeiterePage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            {/* === ÜCRETSİZ & TAKAS === */}
            <Route path="/Ucretsiz-Takas/Takas" element={<TauschenPage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Ucretsiz-Takas/Kiralama" element={<VerleihenPage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Ucretsiz-Takas/Ucretsiz" element={<VerschenkenPage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            {/* === EĞİTİM & KURSLAR === */}
            <Route path="/Egitim-Kurslar/Dans-Kurslari" element={<TanzkursePage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Egitim-Kurslar/Spor-Kurslari" element={<SportkursePage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Egitim-Kurslar/Muzik-San-Dersleri" element={<MusikGesangPage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Egitim-Kurslar/Dil-Kurslari" element={<SprachkursePage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Egitim-Kurslar/Ozel-Ders" element={<NachhilfePage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Egitim-Kurslar/Yemek-Pastacilik-Kurslari" element={<KochenBackenPage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Egitim-Kurslar/Sanat-Tasarim-Kurslari" element={<KunstGestaltungPage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Egitim-Kurslar/Surekli-Egitim" element={<WeiterbildungPage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Egitim-Kurslar/Diger-Dersler-Kurslar" element={<WeitereUnterrichtKursePage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Egitim-Kurslar/Ezoterizm-Spiritualizm" element={<EsoterikSpirituellesPage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Otomobil-Bisiklet-Tekne/Otomobiller" element={<AutosPage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Otomobil-Bisiklet-Tekne/Oto-Parca-Lastik" element={<AutoteilePage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Otomobil-Bisiklet-Tekne/Tekne-Tekne-Malzemeleri" element={<BootePage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Otomobil-Bisiklet-Tekne/Bisiklet-Aksesuarlar" element={<BikesPage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Otomobil-Bisiklet-Tekne/Motosiklet-Scooter" element={<MotorradPage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Otomobil-Bisiklet-Tekne/Motosiklet-Parca-Aksesuarlar" element={<MotorradteilePage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Otomobil-Bisiklet-Tekne/Ticari-Araclar-Romorklar" element={<NutzfahrzeugePage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Otomobil-Bisiklet-Tekne/Karavan-Motokaravan" element={<WohnwagenPage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Otomobil-Bisiklet-Tekne/Tamir-Servis" element={<ReparaturenPage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Otomobil-Bisiklet-Tekne/Diger-Otomobil-Bisiklet-Tekne" element={<WeiteresAutoRadBootPage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />

            {/* === MAIN CATEGORIES === */}
            <Route path="/Butun-Kategoriler" element={<AlleKategorienPage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Otomobil-Bisiklet-Tekne" element={<AutoRadBootPage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Emlak" element={<ImmobilienPage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Ev-Bahce" element={<HausGartenPage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Moda-Guzellik" element={<ModeBeautyPage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Elektronik" element={<ElektronikPage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Evcil-Hayvanlar" element={<HaustierePage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Aile-Cocuk-Bebek" element={<FamilieKindBabyPage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Is-Ilanlari" element={<JobsPage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Eglence-Hobi-Mahalle" element={<FreizeitHobbyNachbarschaftPage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Muzik-Film-Kitap" element={<MusikFilmeBuecherPage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Biletler" element={<EintrittskartenTicketsPage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Hizmetler" element={<DienstleistungenPage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Ucretsiz-Takas" element={<VerschenkenTauschenPage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Egitim-Kurslar" element={<UnterrichtKursePage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Komsu-Yardimi" element={<NachbarschaftshilfeMainPage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/:slug" element={<SmartRoute {...smartRouteProps} />} />
            <Route path="/:slug/:subSlug" element={<SmartRoute {...smartRouteProps} />} />
            <Route path="/Komsu-Yardimi/Komsu-Yardimi" element={<NachbarschaftshilfePage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Unternehmensseiten" element={<Unternehmensseiten />} />
            <Route path="/listing/bmw-320d-sample" element={<BMWListingDetail />} />
            <Route path="/packages" element={<SubscriptionPackages />} />
            <Route path="/payment" element={<PaymentPage />} />
            <Route path="/categories" element={<AllCategories setSelectedCategory={setSelectedCategory} />} />
            <Route path="/checkout" element={<Checkout cartItems={cartItems} setCartItems={setCartItems} />} />
            <Route path="/messages" element={<MessagesPage />} />
            <Route path="/my-listings" element={<MyListingsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/favorites" element={<FavoritesPage />} />
            <Route path="/following" element={<FollowingPage />} />
            <Route path="/followers" element={<FollowersPage />} />
            <Route path="/my-invoices" element={<UserInvoicesPage />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/profile" element={<ProfileOverviewPage />} />

            {/* Admin Routes - Protected */}
            <Route element={<AdminRoute />}>
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="promotions" element={<AdminPromotions />} />
                <Route path="listings" element={<AdminListings />} />
                <Route path="users" element={<AdminUsers />} />
                <Route path="admins" element={<AdminAdmins />} />
                <Route path="commercial" element={<AdminCommercialSellers />} />
                <Route path="reports" element={<AdminReports />} />
                <Route path="sales-reports" element={<AdminSalesReport />} />
                <Route path="stats" element={<AdminStats />} />
                <Route path="settings" element={<AdminSettings />} />
                <Route path="categories" element={<AdminCategories />} />
              </Route>
            </Route>

            {/* 404 Catch-all Route - Must be last */}
            {/* Smart Catch-all Route: Checks for listing slug or store slug first, then 404 */}
            <Route path="*" element={<SmartRoute {...smartRouteProps} />} />
          </Routes>
          <Footer />
          {isMobile && <MobileBottomNavigation />}

          <CookieConsent />
          <DemoWarningModal />
          {showInstallBanner && !isPWAInstalled && (
            <PWAInstallBanner onClose={() => setShowInstallBanner(false)} />
          )}
          <ScrollToTopButton />
        </React.Suspense>
      </div>
    </>
  );
}

export default App;