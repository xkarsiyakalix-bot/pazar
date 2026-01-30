import React, { useState, useEffect } from 'react';
import LoadingSpinner from './components/LoadingSpinner';


import './App.css';
import { t } from './translations';
import SEO from './SEO';
import { supabase } from './lib/supabase';
import { favoritesApi } from './api/favorites';
import { getFollowing, followUser, unfollowUser } from './api/follows';

// Critical components - static import for immediate availability
import { Header } from './components/Header';
import PresenceTracker from './components/PresenceTracker';
import { Footer } from './components/Footer';
import { SearchSection } from './components/SearchSection';
import { ListingGrid } from './components/ListingGrid';
import { CategorySidebar } from './components/CategorySidebar';
import { Gallery } from './components/Gallery';
import BannerSlider from './components/BannerSlider';

// Non-critical components - lazy load
const CategoryGallery = React.lazy(() => import('./components.js').then(m => ({ default: m.CategoryGallery })));
const WelcomeModal = React.lazy(() => import('./components.js').then(m => ({ default: m.WelcomeModal })));
const ProductDetail = React.lazy(() => import('./components.js').then(m => ({ default: m.ProductDetail })));
const AddListing = React.lazy(() => import('./components.js').then(m => ({ default: m.AddListing })));
const SellerProfile = React.lazy(() => import('./components.js').then(m => ({ default: m.SellerProfile })));
const AllCategories = React.lazy(() => import('./components.js').then(m => ({ default: m.AllCategories })));
const Checkout = React.lazy(() => import('./components.js').then(m => ({ default: m.Checkout })));
const SellerPage = React.lazy(() => import('./components.js').then(m => ({ default: m.SellerPage })));
const SpecialSellers = React.lazy(() => import('./components.js').then(m => ({ default: m.SpecialSellers })));
const AnimalProtectionPage = React.lazy(() => import('./components.js').then(m => ({ default: m.AnimalProtectionPage })));
const RealEstateLegalPage = React.lazy(() => import('./components.js').then(m => ({ default: m.RealEstateLegalPage })));
const VehicleLegalPage = React.lazy(() => import('./components.js').then(m => ({ default: m.VehicleLegalPage })));

// Components from individual files
const ReservationButton = React.lazy(() => import('./ReservationButton'));
const StorePage = React.lazy(() => import('./components/Store/StorePage'));
const SmartRoute = React.lazy(() => import('./SmartRoute'));
// Lazy load page components
const Register = React.lazy(() => import('./Register'));
const AlleKategorienPage = React.lazy(() => import('./AlleKategorienPage'));
const Login = React.lazy(() => import('./Login'));
const ForgotPassword = React.lazy(() => import('./ForgotPassword'));
const ResetPassword = React.lazy(() => import('./ResetPassword'));
const SubscriptionPackages = React.lazy(() => import('./SubscriptionPackages'));

const AutosPage = React.lazy(() => import('./AutosPage'));
const AutoRadBootPage = React.lazy(() => import('./AutoRadBootPage'));
const BikesPage = React.lazy(() => import('./BikesPage'));
const AutoteilePage = React.lazy(() => import('./AutoteilePage'));
const BootePage = React.lazy(() => import('./BootePage'));
const MotorradPage = React.lazy(() => import('./MotorradPage'));
const MotorradteilePage = React.lazy(() => import('./MotorradteilePage'));
const NutzfahrzeugePage = React.lazy(() => import('./NutzfahrzeugePage'));
const ReparaturenPage = React.lazy(() => import('./ReparaturenPage'));
const WohnwagenPage = React.lazy(() => import('./WohnwagenPage'));
const WeiteresAutoRadBootPage = React.lazy(() => import('./WeiteresAutoRadBootPage'));
const AufZeitWGPage = React.lazy(() => import('./AufZeitWGPage'));
const ContainerPage = React.lazy(() => import('./ContainerPage'));
const EigentumswohnungenPage = React.lazy(() => import('./EigentumswohnungenPage'));
const SatilikYazlikPage = React.lazy(() => import('./SatilikYazlikPage'));
const FerienAuslandsimmobilienPage = React.lazy(() => import('./FerienAuslandsimmobilienPage'));
const GaragenStellplaetzePage = React.lazy(() => import('./GaragenStellplaetzePage'));
const GewerbeimmobilienPage = React.lazy(() => import('./GewerbeimmobilienPage'));
const GrundstueckeGaertenPage = React.lazy(() => import('./GrundstueckeGaertenPage'));
const HaeuserZumKaufPage = React.lazy(() => import('./HaeuserZumKaufPage'));
const HaeuserZurMietePage = React.lazy(() => import('./HaeuserZurMietePage'));
const MietwohnungenPage = React.lazy(() => import('./MietwohnungenPage'));
const NeubauprojektePage = React.lazy(() => import('./NeubauprojektePage'));
const UmzugTransportPage = React.lazy(() => import('./UmzugTransportPage'));
const WeitereImmobilienPage = React.lazy(() => import('./WeitereImmobilienPage'));
const BadezimmerPage = React.lazy(() => import('./BadezimmerPage'));
const BueroPage = React.lazy(() => import('./BueroPage'));
const DekorationPage = React.lazy(() => import('./DekorationPage'));
const DienstleistungenHausGartenPage = React.lazy(() => import('./DienstleistungenHausGartenPage'));
const GartenzubehoerPflanzenPage = React.lazy(() => import('./GartenzubehoerPflanzenPage'));
const HeimtextilienPage = React.lazy(() => import('./HeimtextilienPage'));
const HeimwerkenPage = React.lazy(() => import('./HeimwerkenPage'));
const KuecheEsszimmerPage = React.lazy(() => import('./KuecheEsszimmerPage'));
const LampenLichtPage = React.lazy(() => import('./LampenLichtPage'));
const SchlafzimmerPage = React.lazy(() => import('./SchlafzimmerPage'));
const WohnzimmerPage = React.lazy(() => import('./WohnzimmerPage'));
const WeiteresHausGartenPage = React.lazy(() => import('./WeiteresHausGartenPage'));
const BeautyGesundheitPage = React.lazy(() => import('./BeautyGesundheitPage'));
const DamenbekleidungPage = React.lazy(() => import('./DamenbekleidungPage'));
const DamenschuhePage = React.lazy(() => import('./DamenschuhePage'));
const HerrenbekleidungPage = React.lazy(() => import('./HerrenbekleidungPage'));
const HerrenschuhePage = React.lazy(() => import('./HerrenschuhePage'));
const ModeBeautyPage = React.lazy(() => import('./ModeBeautyPage'));
const ImmobilienPage = React.lazy(() => import('./ImmobilienPage'));
const ElektronikPage = React.lazy(() => import('./ElektronikPage'));
const HausGartenPage = React.lazy(() => import('./HausGartenPage'));
const HaustierePage = React.lazy(() => import('./HaustierePage'));
const TaschenAccessoiresPage = React.lazy(() => import('./TaschenAccessoiresPage'));
const UhrenSchmuckPage = React.lazy(() => import('./UhrenSchmuckPage'));
const WeiteresModeBeautyPage = React.lazy(() => import('./WeiteresModeBeautyPage'));
const AudioHifiPage = React.lazy(() => import('./AudioHifiPage'));
const DienstleistungenElektronikPage = React.lazy(() => import('./DienstleistungenElektronikPage'));
const FotoPage = React.lazy(() => import('./FotoPage'));
const HandyTelefonPage = React.lazy(() => import('./HandyTelefonPage'));
const HaushaltsgeraetePage = React.lazy(() => import('./HaushaltsgeraetePage'));
const KonsolenPage = React.lazy(() => import('./KonsolenPage'));
const NotebooksPage = React.lazy(() => import('./NotebooksPage'));
const PCsPage = React.lazy(() => import('./PCsPage'));
const PCZubehoerSoftwarePage = React.lazy(() => import('./PCZubehoerSoftwarePage'));
const TabletsReaderPage = React.lazy(() => import('./TabletsReaderPage'));
const TVVideoPage = React.lazy(() => import('./TVVideoPage'));
const VideospielePage = React.lazy(() => import('./VideospielePage'));
const WeitereElektronikPage = React.lazy(() => import('./WeitereElektronikPage'));
const ElektronikDienstleistungenPage = React.lazy(() => import('./ElektronikDienstleistungenPage'));
const FischePage = React.lazy(() => import('./FischePage'));
const HundePage = React.lazy(() => import('./HundePage'));
const KatzenPage = React.lazy(() => import('./KatzenPage'));
const KleintierePage = React.lazy(() => import('./KleintierePage'));
const NutztierePage = React.lazy(() => import('./NutztierePage'));
const PferdePage = React.lazy(() => import('./PferdePage'));
const TierbetreuungTrainingPage = React.lazy(() => import('./TierbetreuungTrainingPage'));
const VermissTierePage = React.lazy(() => import('./VermissTierePage'));
const VoegelPage = React.lazy(() => import('./VoegelPage'));
const MyListingsPage = React.lazy(() => import('./MyListingsPage'));
const SettingsPage = React.lazy(() => import('./SettingsPage'));
const PaymentPage = React.lazy(() => import('./PaymentPage'));
const FavoritesPage = React.lazy(() => import('./FavoritesPage'));
const ProfileOverviewPage = React.lazy(() => import('./ProfileOverviewPage'));
const FollowingPage = React.lazy(() => import('./FollowingPage'));
const FollowersPage = React.lazy(() => import('./FollowersPage'));
const UserInvoicesPage = React.lazy(() => import('./UserInvoicesPage'));
const AdminSalesReport = React.lazy(() => import('./admin/AdminSalesReport'));
const AdminAdmins = React.lazy(() => import('./admin/AdminAdmins'));
const UserDetailsModal = React.lazy(() => import('./admin/UserDetailsModal'));
const TierzubehoerPage = React.lazy(() => import('./TierzubehoerPage'));
const BabyKinderkleidungPage = React.lazy(() => import('./BabyKinderkleidungPage'));
const BabyKinderschuhePage = React.lazy(() => import('./BabyKinderschuhePage'));
const BabyAusstattungPage = React.lazy(() => import('./BabyAusstattungPage'));
const BabyschalenKindersitzePage = React.lazy(() => import('./BabyschalenKindersitzePage'));
const BabysitterKinderbetreuungPage = React.lazy(() => import('./BabysitterKinderbetreuungPage'));
const KinderwagenBuggysPage = React.lazy(() => import('./KinderwagenBuggysPage'));
const KinderzimmermobelPage = React.lazy(() => import('./KinderzimmermobelPage'));
const SpielzeugPage = React.lazy(() => import('./SpielzeugPage'));
const FamilieKindBabyPage = React.lazy(() => import('./FamilieKindBabyPage'));
const WeiteresFamilieKindBabyPage = React.lazy(() => import('./WeiteresFamilieKindBabyPage'));
const JobsPage = React.lazy(() => import('./JobsPage'));
const AusbildungPage = React.lazy(() => import('./AusbildungPage'));
const BauHandwerkProduktionPage = React.lazy(() => import('./BauHandwerkProduktionPage'));
const BueroarbeitVerwaltungPage = React.lazy(() => import('./BueroarbeitVerwaltungPage'));
const GastronomieTourismusPage = React.lazy(() => import('./GastronomieTourismusPage'));
const KundenserviceCallCenterPage = React.lazy(() => import('./KundenserviceCallCenterPage'));
const MiniNebenjobsPage = React.lazy(() => import('./MiniNebenjobsPage'));
const PraktikaPage = React.lazy(() => import('./PraktikaPage'));
const SozialerSektorPflegePage = React.lazy(() => import('./SozialerSektorPflegePage'));
const TransportLogistikVerkehrPage = React.lazy(() => import('./TransportLogistikVerkehrPage'));
const VertriebEinkaufVerkaufPage = React.lazy(() => import('./VertriebEinkaufVerkaufPage'));
const WeitereJobsPage = React.lazy(() => import('./WeitereJobsPage'));
const FreizeitHobbyNachbarschaftPage = React.lazy(() => import('./FreizeitHobbyNachbarschaftPage'));
const EsoterikSpirituellesPage = React.lazy(() => import('./EsoterikSpirituellesPage'));
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
const EsoterikSpirituellesFreizeitPage = React.lazy(() => import('./EsoterikSpirituellesFreizeitPage'));
const MusikFilmeBuecherPage = React.lazy(() => import('./MusikFilmeBuecherPage'));
const WeitereMusikFilmeBuecherPage = React.lazy(() => import('./WeitereMusikFilmeBuecherPage'));
const MusikCDsPage = React.lazy(() => import('./MusikCDsPage'));
const FilmDVDPage = React.lazy(() => import('./FilmDVDPage'));
const MusikinstrumentePage = React.lazy(() => import('./MusikinstrumentePage'));
const BuecherZeitschriftenPage = React.lazy(() => import('./BuecherZeitschriftenPage'));
const ComicsPage = React.lazy(() => import('./ComicsPage'));
const FachbuecherSchuleStudiumPage = React.lazy(() => import('./FachbuecherSchuleStudiumPage'));
const BueroSchreibwarenPage = React.lazy(() => import('./BueroSchreibwarenPage'));
const EintrittskartenTicketsPage = React.lazy(() => import('./EintrittskartenTicketsPage'));
const BahnOEPNVPage = React.lazy(() => import('./BahnOEPNVPage'));
const ComedyKabarettPage = React.lazy(() => import('./ComedyKabarettPage'));
const GutscheinePage = React.lazy(() => import('./GutscheinePage'));
const KinderTicketsPage = React.lazy(() => import('./KinderTicketsPage'));
const KonzertePage = React.lazy(() => import('./KonzertePage'));
const SportTicketsPage = React.lazy(() => import('./SportTicketsPage'));
const TheaterMusicalPage = React.lazy(() => import('./TheaterMusicalPage'));
const WeitereEintrittskartenTicketsPage = React.lazy(() => import('./WeitereEintrittskartenTicketsPage'));
const DienstleistungenPage = React.lazy(() => import('./DienstleistungenPage'));
const AltenpflegePage = React.lazy(() => import('./AltenpflegePage'));
const DienstleistungenAltenpflegePage = React.lazy(() => import('./DienstleistungenAltenpflegePage'));
const DienstleistungenAutoRadBootPage = React.lazy(() => import('./DienstleistungenAutoRadBootPage'));
const DienstleistungenBabysitterPage = React.lazy(() => import('./DienstleistungenBabysitterPage'));
const DienstleistungenKuenstlerMusikerPage = React.lazy(() => import('./DienstleistungenKuenstlerMusikerPage'));
const DienstleistungenReiseEventPage = React.lazy(() => import('./DienstleistungenReiseEventPage'));
const DienstleistungenTierbetreuungPage = React.lazy(() => import('./DienstleistungenTierbetreuungPage'));
const DienstleistungenUmzugTransportPage = React.lazy(() => import('./DienstleistungenUmzugTransportPage'));
const DienstleistungenWeiterePage = React.lazy(() => import('./DienstleistungenWeiterePage'));
const VerschenkenTauschenPage = React.lazy(() => import('./VerschenkenTauschenPage'));
const TauschenPage = React.lazy(() => import('./TauschenPage'));
const VerleihenPage = React.lazy(() => import('./VerleihenPage'));
const VerschenkenPage = React.lazy(() => import('./VerschenkenPage'));
const UnterrichtKursePage = React.lazy(() => import('./UnterrichtKursePage'));

const ComputerkursePage = React.lazy(() => import('./ComputerkursePage'));
const UnterrichtEsoterikPage = React.lazy(() => import('./UnterrichtEsoterikPage'));
const KochenBackenPage = React.lazy(() => import('./KochenBackenPage'));
const KunstGestaltungPage = React.lazy(() => import('./KunstGestaltungPage'));
const MusikGesangPage = React.lazy(() => import('./MusikGesangPage'));
const NachhilfePage = React.lazy(() => import('./NachhilfePage'));
const SportkursePage = React.lazy(() => import('./SportkursePage'));
const SprachkursePage = React.lazy(() => import('./SprachkursePage'));
const TanzkursePage = React.lazy(() => import('./TanzkursePage'));
const WeiterbildungPage = React.lazy(() => import('./WeiterbildungPage'));
const WeitereUnterrichtKursePage = React.lazy(() => import('./WeitereUnterrichtKursePage'));
const NachbarschaftshilfeMainPage = React.lazy(() => import('./NachbarschaftshilfeMainPage'));
const NachbarschaftshilfePage = React.lazy(() => import('./NachbarschaftshilfePage'));
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
const AdminRoute = React.lazy(() => import('./admin/AdminRoute'));
import { useIsMobile } from './hooks/useIsMobile';
import { useAuth } from './contexts/AuthContext';
const MobileBottomNavigation = React.lazy(() => import('./components/MobileBottomNavigation'));
const ScrollToTopButton = React.lazy(() => import('./components/ScrollToTopButton'));

import { Routes, Route, useLocation, useNavigationType } from 'react-router-dom';

// ScrollToTop component to scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();
  const navigationType = useNavigationType();

  React.useEffect(() => {
    // Only scroll to top if navigation is NOT 'POP' (which is back/forward button navigation)
    // This allows the browser's default scroll restoration to work when going back.
    if (navigationType !== 'POP') {
      window.scrollTo(0, 0);
    }
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

  // Filtreleme state'leri
  const [priceRange, setPriceRange] = useState('all');
  const [filterLocation, setFilterLocation] = useState('Tüm Şehirler');
  const [sortBy, setSortBy] = useState('relevance');

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
        if (window.confirm(t.checkout.singleSellerError)) {
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
        if (window.confirm(t.favorites.pleaseLogin)) {
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
      alert(t.favorites.error);
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
        alert(t.follows.pleaseLogin);
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
      alert(t.follows.error);
    } finally {
      setFollowLoading(false);
    }
  };

  const isSellerFollowed = (sellerId) => followedSellers.includes(sellerId);


  return (
    <>
      <ScrollToTop />
      <CategorySync setSelectedCategory={setSelectedCategory} />
      <div className="App min-h-screen bg-gray-50">
        <PresenceTracker />
        <React.Suspense fallback={
          <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <LoadingSpinner size="large" />
              <p className="text-gray-600 mt-4">Yükleniyor...</p>
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
            <Route path="/hayvan-haklari-ve-yasal-uyari" element={<AnimalProtectionPage />} />
            <Route path="/emlak-ilanlari-yasal-uyari" element={<RealEstateLegalPage />} />
            <Route path="/vasita-ilanlari-yasal-uyari" element={<VehicleLegalPage />} />
            <Route path="/store/:sellerId" element={<StorePage />} />
            <Route path="/s/:sellerId" element={<StorePage />} />
            <Route path="/add-listing" element={<AddListing />} />
            <Route path="/hakkimizda" element={<UberUnsPage />} />
            <Route path="/karriere" element={<KarrierePage />} />
            <Route path="/presse" element={<PressePage />} />
            <Route path="/exvitrin-magazin" element={<MagazinPage />} />
            <Route path="/engagement" element={<EngagementPage />} />
            <Route path="/mobile-apps" element={<MobileAppsPage />} />
            <Route path="/unternehmensseite-pro" element={<ProPage />} />
            <Route path="/iletisim" element={<ContactPage />} />
            <Route path="/search" element={<SearchResultsPage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/notifications" element={<NotificationSettingsPage />} />
            <Route path="/Butun-Kategoriler" element={<AlleKategorienPage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Otomobil-Bisiklet-Tekne" element={<AutoRadBootPage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Otomobil-Bisiklet-Tekne/Otomobiller" element={<AutosPage />} />
            <Route path="/Otomobil-Bisiklet-Tekne/Bisiklet-Aksesuarlar" element={<BikesPage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Otomobil-Bisiklet-Tekne/Oto-Parca-Lastik" element={<AutoteilePage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Otomobil-Bisiklet-Tekne/Tekne-Tekne-Malzemeleri" element={<BootePage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Otomobil-Bisiklet-Tekne/Motosiklet-Scooter" element={<MotorradPage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Otomobil-Bisiklet-Tekne/Motosiklet-Parca-Aksesuarlar" element={<MotorradteilePage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Otomobil-Bisiklet-Tekne/Ticari-Araclar-Romorklar" element={<NutzfahrzeugePage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Otomobil-Bisiklet-Tekne/Tamir-Servis" element={<ReparaturenPage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Otomobil-Bisiklet-Tekne/Karavan-Motokaravan" element={<WohnwagenPage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Otomobil-Bisiklet-Tekne/Diger-Otomobil-Bisiklet-Tekne" element={<WeiteresAutoRadBootPage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Emlak" element={<ImmobilienPage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Emlak/Gecici-Konaklama-Paylasimli-Ev" element={<AufZeitWGPage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Emlak/Konteyner" element={<ContainerPage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Emlak/Satilik-Daireler" element={<EigentumswohnungenPage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Emlak/Satilik-Yazlik" element={<SatilikYazlikPage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Emlak/Tatil-Evi-Yurt-Disi-Emlak" element={<FerienAuslandsimmobilienPage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Emlak/Garaj-Otopark" element={<GaragenStellplaetzePage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Emlak/Ticari-Emlak" element={<GewerbeimmobilienPage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Emlak/Arsa-Bahce" element={<GrundstueckeGaertenPage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Emlak/Satilik-Evler" element={<HaeuserZumKaufPage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Emlak/Kiralik-Evler" element={<HaeuserZurMietePage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Emlak/Kiralik-Daireler" element={<MietwohnungenPage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Emlak/Yeni-Projeler" element={<NeubauprojektePage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Emlak/Tasimacilik-Nakliye" element={<UmzugTransportPage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Emlak/Diger-Emlak" element={<WeitereImmobilienPage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Ev-Bahce" element={<HausGartenPage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Ev-Bahce/Banyo" element={<BadezimmerPage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Ev-Bahce/Ofis" element={<BueroPage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Ev-Bahce/Dekorasyon" element={<DekorationPage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Ev-Bahce/Ev-Hizmetleri" element={<DienstleistungenHausGartenPage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Ev-Bahce/Bahce-Malzemeleri-Bitkiler" element={<GartenzubehoerPflanzenPage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Ev-Bahce/Ev-Tekstili" element={<HeimtextilienPage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Ev-Bahce/Ev-Tadilati" element={<HeimwerkenPage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Ev-Bahce/Mutfak-Yemek-Odasi" element={<KuecheEsszimmerPage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Ev-Bahce/Lamba-Aydinlatma" element={<LampenLichtPage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Ev-Bahce/Yatak-Odasi" element={<SchlafzimmerPage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Ev-Bahce/Oturma-Odasi" element={<WohnzimmerPage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Ev-Bahce/Diger-Ev-Bahce" element={<WeiteresHausGartenPage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Moda-Guzellik" element={<ModeBeautyPage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Moda-Guzellik/Guzellik-Saglik" element={<BeautyGesundheitPage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Moda-Guzellik/Kadin-Giyimi" element={<DamenbekleidungPage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Moda-Guzellik/Kadin-Ayakkabilari" element={<DamenschuhePage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Moda-Guzellik/Erkek-Giyimi" element={<HerrenbekleidungPage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Moda-Guzellik/Erkek-Ayakkabilari" element={<HerrenschuhePage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Moda-Guzellik/Canta-Aksesuarlar" element={<TaschenAccessoiresPage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Moda-Guzellik/Saat-Taki" element={<UhrenSchmuckPage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Moda-Guzellik/Diger-Moda-Guzellik" element={<WeiteresModeBeautyPage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Elektronik" element={<ElektronikPage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Elektronik/Ses-Hifi" element={<AudioHifiPage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Elektronik/Elektronik-Hizmetler" element={<ElektronikDienstleistungenPage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Elektronik/Fotograf-Kamera" element={<FotoPage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Elektronik/Cep-Telefonu-Telefon" element={<HandyTelefonPage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Elektronik/Ev-Aletleri" element={<HaushaltsgeraetePage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Elektronik/Konsollar" element={<KonsolenPage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Elektronik/Dizustu-Bilgisayarlar" element={<NotebooksPage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Elektronik/Bilgisayarlar" element={<PCsPage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Elektronik/Bilgisayar-Aksesuarlari-Yazilim" element={<PCZubehoerSoftwarePage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Elektronik/Tabletler-E-Okuyucular" element={<TabletsReaderPage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Elektronik/TV-Video" element={<TVVideoPage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Elektronik/Video-Oyunlari" element={<VideospielePage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Elektronik/Diger-Elektronik" element={<WeitereElektronikPage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Evcil-Hayvanlar" element={<HaustierePage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Evcil-Hayvanlar/Baliklar" element={<FischePage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Evcil-Hayvanlar/Kopekler" element={<HundePage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Evcil-Hayvanlar/Kedi" element={<KatzenPage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Evcil-Hayvanlar/Kucuk-Hayvanlar" element={<KleintierePage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Evcil-Hayvanlar/Ciftlik-Hayvanlari" element={<NutztierePage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Evcil-Hayvanlar/Atlar" element={<PferdePage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Evcil-Hayvanlar/Hayvan-Bakimi-Egitimi" element={<TierbetreuungTrainingPage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Evcil-Hayvanlar/Kayip-Hayvanlar" element={<VermissTierePage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Evcil-Hayvanlar/Kuslar" element={<VoegelPage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Aile-Cocuk-Bebek" element={<FamilieKindBabyPage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Evcil-Hayvanlar/Aksesuarlar" element={<TierzubehoerPage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />

            <Route path="/Aile-Cocuk-Bebek/Bebek-Cocuk-Giyimi" element={<BabyKinderkleidungPage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Aile-Cocuk-Bebek/Bebek-Cocuk-Ayakkabilari" element={<BabyKinderschuhePage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Aile-Cocuk-Bebek/Bebek-Ekipmanlari" element={
              <React.Suspense fallback={<div>Yükleniyor...</div>}>
                <BabyAusstattungPage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />
              </React.Suspense>
            } />
            <Route path="/Aile-Cocuk-Bebek/Oto-Koltuklari" element={<BabyschalenKindersitzePage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Aile-Cocuk-Bebek/Babysitter-Cocuk-Bakimi" element={<BabysitterKinderbetreuungPage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Aile-Cocuk-Bebek/Yasli-Bakimi" element={<AltenpflegePage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Aile-Cocuk-Bebek/Bebek-Arabalari-Pusetler" element={<KinderwagenBuggysPage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Aile-Cocuk-Bebek/Cocuk-Odasi-Mobilyalari" element={<KinderzimmermobelPage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Aile-Cocuk-Bebek/Oyuncaklar" element={<SpielzeugPage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Aile-Cocuk-Bebek/Diger-Aile-Cocuk-Bebek" element={<WeiteresFamilieKindBabyPage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Is-Ilanlari" element={<JobsPage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Is-Ilanlari/Mesleki-Egitim" element={<AusbildungPage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Is-Ilanlari/Insaat-Sanat-Uretim" element={<BauHandwerkProduktionPage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Is-Ilanlari/Buroarbeit-Yonetim" element={<BueroarbeitVerwaltungPage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Is-Ilanlari/Gastronomi-Turizm" element={<GastronomieTourismusPage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Is-Ilanlari/Musteri-Hizmetleri-Cagri-Merkezi" element={<KundenserviceCallCenterPage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Is-Ilanlari/Ek-Isler" element={<MiniNebenjobsPage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Is-Ilanlari/Staj" element={<PraktikaPage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Is-Ilanlari/Sosyal-Sektor-Bakim" element={<SozialerSektorPflegePage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Is-Ilanlari/Tasimacilik-Lojistik" element={<TransportLogistikVerkehrPage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Is-Ilanlari/Satis-Pazarlama" element={<VertriebEinkaufVerkaufPage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Is-Ilanlari/Diger-Is-Ilanlari" element={<WeitereJobsPage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Eglence-Hobi-Mahalle" element={<FreizeitHobbyNachbarschaftPage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
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
            <Route path="/Muzik-Film-Kitap" element={<MusikFilmeBuecherPage />} />
            <Route path="/Muzik-Film-Kitap/Kitap-Dergi" element={<BuecherZeitschriftenPage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Muzik-Film-Kitap/Kirtasiye" element={<BueroSchreibwarenPage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Muzik-Film-Kitap/Cizgi-Romanlar" element={<ComicsPage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Muzik-Film-Kitap/Ders-Kitaplari-Okul-Egitim" element={<FachbuecherSchuleStudiumPage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Muzik-Film-Kitap/Film-DVD" element={<FilmDVDPage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Muzik-Film-Kitap/Muzik-CDler" element={<MusikCDsPage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Muzik-Film-Kitap/Muzik-Enstrumanlari" element={<MusikinstrumentePage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Muzik-Film-Kitap/Diger-Muzik-Film-Kitap" element={<WeitereMusikFilmeBuecherPage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Biletler" element={<EintrittskartenTicketsPage />} />
            <Route path="/Biletler/Tren-Toplu-Tasima" element={<BahnOEPNVPage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Biletler/Komedi-Kabare" element={<ComedyKabarettPage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Biletler/Hediye-Kartlari" element={<GutscheinePage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Biletler/Cocuk" element={<KinderTicketsPage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Biletler/Konserler" element={<KonzertePage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Biletler/Spor" element={<SportTicketsPage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Biletler/Tiyatro-Muzikal" element={<TheaterMusicalPage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Biletler/Diger-Biletler" element={<WeitereEintrittskartenTicketsPage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Hizmetler" element={<DienstleistungenPage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Hizmetler/Yasli-Bakimi" element={<DienstleistungenAltenpflegePage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Hizmetler/Otomobil-Bisiklet-Tekne-Servisi" element={<DienstleistungenAutoRadBootPage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Hizmetler/Babysitter-Cocuk-Bakimi" element={<DienstleistungenBabysitterPage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Hizmetler/Elektronik" element={<DienstleistungenElektronikPage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Hizmetler/Ev-Bahce" element={<DienstleistungenHausGartenPage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Hizmetler/Sanatcilar-Muzisyenler" element={<DienstleistungenKuenstlerMusikerPage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Hizmetler/Seyahat-Etkinlik" element={<DienstleistungenReiseEventPage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Hizmetler/Hayvan-Bakimi-Egitimi" element={<DienstleistungenTierbetreuungPage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Hizmetler/Tasimacilik-Nakliye" element={<DienstleistungenUmzugTransportPage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Hizmetler/Diger-Hizmetler" element={<DienstleistungenWeiterePage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Ucretsiz-Takas" element={<VerschenkenTauschenPage />} />
            <Route path="/Ucretsiz-Takas/Takas" element={<TauschenPage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Ucretsiz-Takas/Kiralama" element={<VerleihenPage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Ucretsiz-Takas/Ucretsiz" element={<VerschenkenPage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Egitim-Kurslar" element={<UnterrichtKursePage />} />
            <Route path="/Egitim-Kurslar/Bilgisayar-Kurslari" element={<ComputerkursePage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Egitim-Kurslar/Ezoterizm-Spiritualizm" element={<EsoterikSpirituellesPage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Egitim-Kurslar/Yemek-Pastacilik-Kurslari" element={<KochenBackenPage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Egitim-Kurslar/Sanat-Tasarim-Kurslari" element={<KunstGestaltungPage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Egitim-Kurslar/Muzik-San-Dersleri" element={<MusikGesangPage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Egitim-Kurslar/Ozel-Ders" element={<NachhilfePage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Egitim-Kurslar/Spor-Kurslari" element={<SportkursePage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Egitim-Kurslar/Dil-Kurslari" element={<SprachkursePage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Egitim-Kurslar/Dans-Kurslari" element={<TanzkursePage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Egitim-Kurslar/Surekli-Egitim" element={<WeiterbildungPage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Egitim-Kurslar/Diger-Dersler-Kurslar" element={<WeitereUnterrichtKursePage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
            <Route path="/Komsu-Yardimi" element={<NachbarschaftshilfeMainPage toggleFavorite={toggleFavorite} isFavorite={isFavorite} />} />
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
                <Route path="settings" element={<AdminSettings />} />
              </Route>
            </Route>

            {/* 404 Catch-all Route - Must be last */}
            {/* Smart Catch-all Route: Checks for store slug first, then 404 */}
            <Route path="*" element={<SmartRoute />} />
          </Routes>
          <Footer />
          {isMobile && <MobileBottomNavigation />}
          <ScrollToTopButton />
        </React.Suspense>
      </div>
    </>
  );
}

export default App;