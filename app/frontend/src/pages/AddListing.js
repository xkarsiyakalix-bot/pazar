import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams, useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { t, getCategoryTranslation } from '../translations';
import { turkeyCities } from '../data/turkey_cities';
import LoadingSpinner from '../components/LoadingSpinner';
import { FashionFields } from '../components/AddListing/FashionFields';
import { RealEstateFields } from '../components/AddListing/RealEstateFields';
import { VehicleFields } from '../components/AddListing/VehicleFields';
import { ElectronicFields } from '../components/AddListing/ElectronicFields';
import { HomeGardenFields } from '../components/AddListing/HomeGardenFields';
import { JobFields } from '../components/AddListing/JobFields';
import { HobbyFields } from '../components/AddListing/HobbyFields';
import { EducationFields } from '../components/AddListing/EducationFields';
import { ServiceFields } from '../components/AddListing/ServiceFields';
import { FamilyFields } from '../components/AddListing/FamilyFields';
import { PetFields } from '../components/AddListing/PetFields';
import { useIsMobile } from '../hooks/useIsMobile';
import { compressImage } from '../utils/imageUtils';

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
        const { checkUserListingLimit } = await import('../api/listings');
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

      const { fetchUserProfile, updateUserProfile } = await import('../api/profile');
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
  const hideConditionAndShipping = category === 'Emlak' || category === 'Eğitim & Kurslar' || isJobCategory || subCategory === 'Bebek Bakıcısı & Kreş' || subCategory === 'Balıklar' || subCategory === 'Köpekler' || subCategory === 'Kediler' || subCategory === 'Küçük Hayvanlar' || subCategory === 'Çiftlik Hayvanları' || subCategory === 'Atlar' || subCategory === 'Hayvan Bakımı & Eğitim' || subCategory === 'Kayıp Hayvanlar' || subCategory === 'Kuşlar' || subCategory === 'Konteyner' || subCategory === 'Tamir & Servis' || subCategory === 'Ticari Araçlar & Römorklar' || subCategory === 'Tekne & Tekne Malzemeleri' || subCategory === 'Otomobiller' || subCategory === 'Karavan & Motokaravan';
  const [condition, setCondition] = useState(''); // Default to empty string for granular selection
  const [price, setPrice] = useState('');
  const [priceType, setPriceType] = useState('fixed');
  const [description, setDescription] = useState('');
  const [isGeneratingDescription, setIsGeneratingDescription] = useState(false);
  const [imageFiles, setImageFiles] = useState([]);

  const handleGenerateDescription = async () => {
    if (!title) {
      alert("Lütfen önce ilan başlığını (Title) doldurun.");
      return;
    }
    
    setIsGeneratingDescription(true);
    try {
      const response = await fetch('/api/generate-description', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          category,
          subcategory: subCategory
        })
      });
      
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
        const data = await response.json();
        if (response.ok && data.description) {
          setDescription(data.description);
        } else {
          alert("Hata: " + (data.error || "Açıklama oluşturulamadı."));
        }
      } else {
        // This usually happens on localhost if Netlify CLI is not used
        const text = await response.text();
        console.error("Received non-JSON response:", text.substring(0, 100));
        alert("Bağlantı hatası: Sunucu JSON yerine HTML döndürdü. Eğer bilgisayarınızda (localhost) test ediyorsanız, bu özellik sadece canlı sitede (Netlify) veya 'netlify dev' komutu ile çalışır.");
      }
    } catch (error) {
      console.error("AI Error:", error);
      alert("Sistemsel bir hata oluştu: " + error.message);
    } finally {
      setIsGeneratingDescription(false);
    }
  };

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
  const [selectedVehicleType, setSelectedVehicleType] = useState('');
  const [selectedDoorCount, setSelectedDoorCount] = useState('');
  const [selectedExteriorColor, setSelectedExteriorColor] = useState('');
  const [selectedInteriorMaterial, setSelectedInteriorMaterial] = useState('');
  const [selectedEmissionBadge, setSelectedEmissionBadge] = useState('');
  const [selectedEmissionClass, setSelectedEmissionClass] = useState('');
  const [selectedInspection, setSelectedInspection] = useState('');
  const [isAccidentFree, setIsAccidentFree] = useState(false);
  const [isFullServiceHistory, setIsFullServiceHistory] = useState(false);
  const [isNonSmoking, setIsNonSmoking] = useState(false);
  const [selectedCarAmenities, setSelectedCarAmenities] = useState([]);
  const [firstRegistrationMonth, setFirstRegistrationMonth] = useState('');

  // Bike-specific states
  const [selectedBikeType, setSelectedBikeType] = useState('');
  const [selectedBikeArt, setSelectedBikeArt] = useState('');

  // Autoteile-specific state
  const [selectedAutoteileArt, setSelectedAutoteileArt] = useState('');
  const [selectedAutoteileAngebotstyp, setSelectedAutoteileAngebotstyp] = useState('');
  const [selectedShipping, setSelectedShipping] = useState('');

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

  // Fashion specific states (Unified)
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
  const [selectedConstructionType, setSelectedConstructionType] = useState('');

  const [selectedOfficeType, setSelectedOfficeType] = useState('');


  const [selectedGastronomyType, setSelectedGastronomyType] = useState('');
  const [selectedSocialCareType, setSelectedSocialCareType] = useState('');
  const [selectedTransportType, setSelectedTransportType] = useState('');
  const [selectedSalesType, setSelectedSalesType] = useState('');
  const [selectedOtherJobsType, setSelectedOtherJobsType] = useState('');
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
  const [brand, setBrand] = useState('');
  const [selectedSportCampingArt, setSelectedSportCampingArt] = useState('');
  const [mileage, setMileage] = useState('');
  const [firstRegistration, setFirstRegistration] = useState('');
  const [displacement, setDisplacement] = useState('');
  const [transmission, setTransmission] = useState('');
  const [power, setPower] = useState('');
  const [fuel, setFuel] = useState('');

  // Load categories from Supabase
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const { fetchCategories } = await import('../api/categories');
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
        const { fetchUserProfile } = await import('../api/profile');
        const profile = await fetchUserProfile(user.id);

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

        // Set seller type - default to 'Privatnutzer' if not set
        if (profile.seller_type) {
          setSellerType(profile.seller_type);
        } else {
          setSellerType('Privatnutzer'); // Default to individual user
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
        const { supabase } = await import('../lib/supabase');
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
          if (data.versand_art) setSelectedShipping(data.versand_art);
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
          if (data.bau_handwerk_produktion_art) setSelectedConstructionType(data.bau_handwerk_produktion_art);
          if (data.buero_arbeit_verwaltung_art) setSelectedOfficeType(data.buero_arbeit_verwaltung_art);
          if (data.gastronomie_tourismus_art) setSelectedGastronomyType(data.gastronomie_tourismus_art);
          if (data.sozialer_sektor_pflege_art) setSelectedSocialCareType(data.sozialer_sektor_pflege_art);
          if (data.transport_logistik_verkehr_art) setSelectedTransportType(data.transport_logistik_verkehr_art);
          if (data.vertrieb_einkauf_verkauf_art) setSelectedSalesType(data.vertrieb_einkauf_verkauf_art);
          if (data.weitere_jobs_art) setSelectedOtherJobsType(data.weitere_jobs_art);
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
          if (data.marke) setBrand(data.marke);
          if (data.kilometerstand) setMileage(data.kilometerstand);
          if (data.erstzulassung) setFirstRegistration(data.erstzulassung);
          if (data.hubraum) setDisplacement(data.hubraum);
          if (data.getriebe) setTransmission(data.getriebe);
          if (data.leistung) setPower(data.leistung);
          if (data.kraftstoff) setFuel(data.kraftstoff);

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
        // Compress images before upload to optimize performance
        // This converts to WebP and resizes if too large
        const compressedFiles = await Promise.all(
          newFiles.map(file => compressImage(file))
        );

        const { uploadListingImages } = await import('../api/storage');
        uploadedUrls = await uploadListingImages(compressedFiles, user.id);
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
        versand_art: hideConditionAndShipping ? null : (selectedShipping || null),
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
        bau_handwerk_produktion_art: selectedConstructionType || null,
        buero_arbeit_verwaltung_art: selectedOfficeType || null,
        gastronomie_tourismus_art: selectedGastronomyType || null,
        sozialer_sektor_pflege_art: selectedSocialCareType || null,
        transport_logistik_verkehr_art: selectedTransportType || null,
        vertrieb_einkauf_verkauf_art: selectedSalesType || null,
        weitere_jobs_art: selectedOtherJobsType || null,
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
        damenbekleidung_art: damenbekleidungArt || null,
        damenbekleidung_size: damenbekleidungSize || null,
        damenbekleidung_color: damenbekleidungColor || null,
        damenbekleidung_marke: damenbekleidungMarke || null,
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
        marke: selectedCarBrand || brand || null,
        modell: selectedCarModel || null,
        kilometerstand: mileage ? parseInt(mileage.toString().replace(/\D/g, '')) : null,
        erstzulassung: firstRegistration ? parseInt(firstRegistration) : null,
        hubraum: displacement ? parseInt(displacement.toString().replace(/\D/g, '')) : null,
        getriebe: transmission || null,
        leistung: power ? parseInt(power.toString().replace(/\D/g, '')) : null,
        power: power ? parseInt(power.toString().replace(/\D/g, '')) : null,
        kraftstoff: fuel || null,
        fuel_type: fuel || null,
        fahrzeugtyp: selectedVehicleType || null,
        vehicle_type: selectedVehicleType || null,
        door_count: selectedDoorCount || null,
        exterior_color: selectedExteriorColor || null,
        interior_material: selectedInteriorMaterial || null,
        emission_badge: selectedEmissionBadge || null,
        emission_sticker: selectedEmissionBadge || null,
        schadstoffklasse: selectedEmissionClass || null,
        emission_class: selectedEmissionClass || null,
        hu: selectedInspection || null,
        unfallfrei: isAccidentFree,
        scheckheftgepflegt: isFullServiceHistory,
        nichtraucher_fahrzeug: isNonSmoking,
        car_amenities: selectedCarAmenities.length > 0 ? selectedCarAmenities : null,
        seller_type: sellerType || null
      };

      if (isEditMode && editId) {
        const { supabase } = await import('../lib/supabase');
        const { error } = await supabase.from('listings').update(listingData).eq('id', editId);
        if (error) throw error;
        alert(t.addListing.updateSuccess);
      } else {
        const { createListing } = await import('../api/listings');
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
    <div className="min-h-screen bg-gray-50 dark:bg-black transition-colors duration-300">
      <div className="max-w-3xl mx-auto px-0 sm:px-4 py-0 sm:py-10">
        <div className="bg-white dark:bg-neutral-900 rounded-none sm:rounded-2xl shadow-premium p-4 sm:p-8 border-x-0 sm:border border-neutral-200 dark:border-white/10 min-h-screen sm:min-h-0">
          <h1 className="text-3xl font-extrabold text-neutral-900 dark:text-neutral-50 mb-8 tracking-tight">
            {isEditMode ? t.addListing.editTitle : t.addListing.title}
          </h1>

          {/* Listing Limit Status Card */}

          <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-semibold text-neutral-600 dark:text-neutral-400 mb-2 uppercase tracking-wider">{t.addListing.offerType}</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-neutral-700 dark:text-neutral-300 cursor-pointer font-medium hover:text-red-500 dark:hover:text-red-400 transition-colors">
                  <input
                    type="radio"
                    name="offerType"
                    value="Angebote"
                    checked={offerType === 'Angebote'}
                    onChange={() => setOfferType('Angebote')}
                    className="w-5 h-5 text-red-600 focus:ring-red-500 dark:bg-neutral-800 dark:border-neutral-700"
                  />
                  {t.addListing.offering}
                </label>
                <label className="flex items-center gap-2 text-neutral-700 dark:text-neutral-300 cursor-pointer font-medium hover:text-red-500 dark:hover:text-red-400 transition-colors">
                  <input
                    type="radio"
                    name="offerType"
                    value="Gesuche"
                    checked={offerType === 'Gesuche'}
                    onChange={() => setOfferType('Gesuche')}
                    className="w-5 h-5 text-red-600 focus:ring-red-500 dark:bg-neutral-800 dark:border-neutral-700"
                  />
                  {t.addListing.searching}
                </label>
              </div>
            </div>


            <div>
              <label className="block text-sm font-semibold text-neutral-600 dark:text-neutral-400 mb-2 uppercase tracking-wider">{t.addListing.listingTitle}</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xl px-4 py-3 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
                placeholder={t.addListing.listingTitlePlaceholder}
              />
            </div>
            <div className="grid gap-4 lg:grid-cols-2">
              <div>
                <label className="block text-sm font-semibold text-neutral-600 dark:text-neutral-400 mb-2 uppercase tracking-wider">{t.addListing.category}</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                  className="w-full bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xl px-4 py-3 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all appearance-none"
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
                  <label className="block text-sm font-semibold text-neutral-600 dark:text-neutral-400 mb-2 uppercase tracking-wider">{t.addListing.subcategory}</label>
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
                      setSelectedSammelnArt('');
                      setSelectedModellbauArt('');
                      setSelectedHandarbeitArt('');
                      setSelectedKuenstlerMusikerArt('');
                      setSelectedReiseEventservicesArt('');
                      setSelectedTierbetreuungTrainingArt('');
                      setSelectedConstructionType('');
                      setSelectedSocialCareType('');
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
                      setSelectedOfficeType('');
                      setSelectedGastronomyType('');
                      setSelectedTransportType('');
                      setSelectedSalesType('');
                      setSelectedOtherJobsType('');
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
                    className="w-full bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xl px-4 py-3 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all appearance-none"
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

            {/* Fashion Specific Fields */}
            {(category === 'Moda & Güzellik' || category === 'Mode & Beauty') && (
              <FashionFields
                category={category}
                subCategory={subCategory}
                t={t}
                damenbekleidungArt={damenbekleidungArt}
                setDamenbekleidungArt={setDamenbekleidungArt}
                damenbekleidungMarke={damenbekleidungMarke}
                setDamenbekleidungMarke={setDamenbekleidungMarke}
                damenbekleidungSize={damenbekleidungSize}
                setDamenbekleidungSize={setDamenbekleidungSize}
                damenbekleidungColor={damenbekleidungColor}
                setDamenbekleidungColor={setDamenbekleidungColor}
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
                selectedBeautyGesundheitArt={selectedBeautyGesundheitArt}
                setSelectedBeautyGesundheitArt={setSelectedBeautyGesundheitArt}
              />
            )}








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
                selectedSocialCareType={selectedSocialCareType}
                setSelectedSocialCareType={setSelectedSocialCareType}
                selectedConstructionType={selectedConstructionType}
                setSelectedConstructionType={setSelectedConstructionType}
                selectedOfficeType={selectedOfficeType}
                setSelectedOfficeType={setSelectedOfficeType}
                selectedGastronomyType={selectedGastronomyType}
                setSelectedGastronomyType={setSelectedGastronomyType}
                selectedTransportType={selectedTransportType}
                setSelectedTransportType={setSelectedTransportType}
                selectedSalesType={selectedSalesType}
                setSelectedSalesType={setSelectedSalesType}
                selectedOtherJobsType={selectedOtherJobsType}
                setSelectedOtherJobsType={setSelectedOtherJobsType}
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
                brand={brand}
                setBrand={setBrand}
                transmission={transmission}
                setTransmission={setTransmission}
                mileage={mileage}
                setMileage={setMileage}
                firstRegistration={firstRegistration}
                setFirstRegistration={setFirstRegistration}
                power={power}
                setPower={setPower}
                // Auto Specific
                selectedCarBrand={selectedCarBrand}
                setSelectedCarBrand={setSelectedCarBrand}
                selectedCarModel={selectedCarModel}
                setSelectedCarModel={setSelectedCarModel}
                firstRegistrationMonth={firstRegistrationMonth}
                setFirstRegistrationMonth={setFirstRegistrationMonth}
                fuel={fuel}
                setFuel={setFuel}
                selectedVehicleType={selectedVehicleType}
                setSelectedVehicleType={setSelectedVehicleType}
                selectedDoorCount={selectedDoorCount}
                setSelectedDoorCount={setSelectedDoorCount}
                selectedExteriorColor={selectedExteriorColor}
                setSelectedExteriorColor={setSelectedExteriorColor}
                selectedInteriorMaterial={selectedInteriorMaterial}
                setSelectedInteriorMaterial={setSelectedInteriorMaterial}
                selectedEmissionBadge={selectedEmissionBadge}
                setSelectedEmissionBadge={setSelectedEmissionBadge}
                selectedEmissionClass={selectedEmissionClass}
                setSelectedEmissionClass={setSelectedEmissionClass}
                selectedInspection={selectedInspection}
                setSelectedInspection={setSelectedInspection}
                isAccidentFree={isAccidentFree}
                setIsAccidentFree={setIsAccidentFree}
                isFullServiceHistory={isFullServiceHistory}
                setIsFullServiceHistory={setIsFullServiceHistory}
                isNonSmoking={isNonSmoking}
                setIsNonSmoking={setIsNonSmoking}
                selectedCarAmenities={selectedCarAmenities}
                setSelectedCarAmenities={setSelectedCarAmenities}
                // Moto specific
                selectedMotorradArt={selectedMotorradArt}
                setSelectedMotorradArt={setSelectedMotorradArt}
                displacement={displacement}
                setDisplacement={setDisplacement}
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
                  <label className="block text-sm font-semibold text-neutral-600 dark:text-neutral-400 mb-2 uppercase tracking-wider">{t.addListing.condition}</label>
                  <select
                    value={condition}
                    onChange={(e) => setCondition(e.target.value)}
                    className="w-full bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xl px-4 py-3 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all appearance-none"
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
                  <label className="block text-sm font-semibold text-neutral-600 dark:text-neutral-400 mb-2 uppercase tracking-wider">{t.addListing.shipping}</label>
                  <select
                    value={selectedShipping}
                    onChange={(e) => setSelectedShipping(e.target.value)}
                    className="w-full bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xl px-4 py-3 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all appearance-none"
                  >
                    <option value="">{t.productDetail.pleaseChoose}</option>
                    <option value="Kargo Mümkün">{t.addListing.options.shipping}</option>
                    <option value="Sadece Elden Teslim">{t.addListing.options.noShipping}</option>
                  </select>
                </div>
              </div>
            )}
            {(category !== 'İş İlanları' && subCategory !== 'Eğitim / Meslek Eğitimi') && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-neutral-600 dark:text-neutral-400 mb-2 uppercase tracking-wider">
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
                      className={`flex-1 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xl px-4 py-3 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all ${priceType === 'giveaway' ? 'opacity-50 cursor-not-allowed' : ''}`}
                      placeholder={priceType === 'giveaway' ? '' : (priceType === 'negotiable' ? t.addListing.optionalPricePlaceholder : t.addListing.pricePlaceholder)}
                    />
                    <span className="text-neutral-600 dark:text-neutral-400 font-bold">TL</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-neutral-600 dark:text-neutral-400 mb-2 uppercase tracking-wider">{t.addListing.priceType}</label>
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
                    className="w-full bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xl px-4 py-3 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all appearance-none"
                  >
                    <option value="fixed">{t.addListing.options.fixedPrice}</option>
                    <option value="negotiable">{t.addListing.options.negotiable}</option>
                    <option value="giveaway">{t.addListing.options.givingAway}</option>
                  </select>
                </div>
              </div>
            )}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">{t.productDetail.description}</label>
                <button
                  type="button"
                  onClick={handleGenerateDescription}
                  disabled={isGeneratingDescription}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-purple-500 to-blue-500 text-white text-xs font-bold rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
                >
                  {isGeneratingDescription ? (
                    <>
                      <svg className="animate-spin h-3.5 w-3.5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                      Oluşturuluyor...
                    </>
                  ) : (
                    <>
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                      AI ile Yazdır
                    </>
                  )}
                </button>
              </div>
              <textarea
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                className="w-full bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xl px-4 py-3 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
                placeholder={t.addListing.descriptionPlaceholder}
              />
            </div>
            <div className="order-first md:order-none">
              <label className="block text-sm font-semibold text-neutral-600 dark:text-neutral-400 mb-2 uppercase tracking-wider">{t.addListing.images} (max. 20)</label>
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
                  className="w-full border-2 border-dashed border-neutral-300 dark:border-white/10 rounded-2xl px-6 py-12 flex flex-col items-center justify-center gap-4 cursor-pointer hover:border-red-500 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-all duration-300 group"
                >
                  <div className="w-20 h-20 bg-red-50 dark:bg-red-900/10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h0.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="text-center">
                    <span className="text-xl font-extrabold text-neutral-900 dark:text-neutral-50 block mb-1">{t.addListing.selectImages}</span>
                    <span className="text-sm text-neutral-500 dark:text-neutral-400">{t.addListing.dragAndDrop}</span>
                  </div>
                  <span className="px-3 py-1 bg-neutral-100 dark:bg-neutral-800 rounded-full text-xs font-bold text-neutral-500 dark:text-neutral-400">{t.addListing.maxImages}</span>
                </label>
              </div>
              {imageFiles.length > 0 && (
                <div className="mt-6 space-y-4">
                  <p className="text-xs font-bold text-neutral-500 dark:text-neutral-400 flex items-center gap-2">
                    <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                    {t.addListing.imageDragDropHint}
                  </p>
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
                            e.currentTarget.classList.add('border-red-500', 'bg-red-50', 'dark:bg-red-900/20');
                          }}
                          onDragLeave={(e) => {
                            e.currentTarget.classList.remove('border-red-500', 'bg-red-50', 'dark:bg-red-900/20');
                          }}
                          onDrop={(e) => {
                            e.preventDefault();
                            e.currentTarget.classList.remove('border-red-500', 'bg-red-50', 'dark:bg-red-900/20');

                            const draggedIndex = parseInt(e.dataTransfer.getData('text/plain'));
                            const targetIndex = index;

                            if (draggedIndex !== targetIndex) {
                              const newFiles = [...imageFiles];
                              const [draggedItem] = newFiles.splice(draggedIndex, 1);
                              newFiles.splice(targetIndex, 0, draggedItem);
                              setImageFiles(newFiles);
                            }
                          }}
                          className="flex items-center gap-4 bg-white dark:bg-neutral-800/50 p-3 rounded-2xl border border-neutral-200 dark:border-white/5 hover:border-red-500/50 transition-all group cursor-move shadow-sm"
                        >
                          {/* Drag handle icon */}
                          <div className="text-neutral-300 dark:text-neutral-600 group-hover:text-red-500 transition-colors">
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M7 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 2zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 14zm6-8a2 2 0 1 0-0.001-4.001A2 2 0 0 0 13 6zm0 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 14z"></path>
                            </svg>
                          </div>

                          {/* Thumbnail preview */}
                          <img
                            src={previewUrl}
                            alt={t.addListing.imageAlt.replace('{index}', (index + 1).toString())}
                            className="w-20 h-20 object-cover rounded-xl border border-neutral-200 dark:border-white/10 shadow-sm"
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
                              className={`p-1.5 rounded-lg transition-all ${index === 0 ? 'text-neutral-200 dark:text-neutral-800 cursor-not-allowed' : 'text-neutral-500 dark:text-neutral-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20'}`}
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
                              className={`p-1.5 rounded-lg transition-all ${index === imageFiles.length - 1 ? 'text-neutral-200 dark:text-neutral-800 cursor-not-allowed' : 'text-neutral-500 dark:text-neutral-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20'}`}
                              title={t.addListing.moveDown}
                            >
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                              </svg>
                            </button>
                          </div>

                          {/* Image info */}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-neutral-900 dark:text-neutral-100 truncate mb-0.5">
                              {typeof file === 'string'
                                ? `${t.addListing.imageLabel} ${index + 1}`
                                : file.name}
                            </p>
                            <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
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
                            className="text-red-500 hover:text-white hover:bg-red-500 p-2.5 rounded-xl transition-all shadow-sm active:scale-90"
                            title={t.addListing.remove}
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-0.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </div>

            <div className="my-10 border-t border-neutral-100 dark:border-white/5" />

            <div>
              <h2 className="text-xl font-extrabold text-neutral-900 dark:text-neutral-50 mb-6">
                {t.addListing.locationTitle}
              </h2>
              <div className="space-y-6">
                <label className="flex items-center gap-3 text-sm font-bold text-neutral-700 dark:text-neutral-300 mb-2 p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-2xl cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all border border-transparent hover:border-red-500/20">
                  <input
                    type="checkbox"
                    checked={showLocation}
                    onChange={(e) => setShowLocation(e.target.checked)}
                    className="w-5 h-5 text-red-500 focus:ring-red-500/20 rounded-lg dark:bg-neutral-900 dark:border-neutral-700 transition-all"
                  />
                  {t.addListing.showLocation}
                </label>

                <div className="animate-in fade-in duration-300 space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-neutral-600 dark:text-neutral-400 mb-2 uppercase tracking-wider">{t.addListing.address}</label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xl px-4 py-3 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
                      placeholder={t.addListing.addressPlaceholder}
                    />
                  </div>
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-semibold text-neutral-600 dark:text-neutral-400 mb-2 uppercase tracking-wider">{t.addListing.district}</label>
                    <input
                      type="text"
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      required
                      className="w-full bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xl px-4 py-3 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
                      placeholder={t.addListing.districtPlaceholder}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-neutral-600 dark:text-neutral-400 mb-2 uppercase tracking-wider">{t.addListing.city}</label>
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
                      className="w-full bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xl px-4 py-3 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all appearance-none"
                    >
                      <option value="">{t.addListing.select}</option>
                      {turkeyCities.map((c) => (
                        <option key={c.city} value={c.city}>{c.city}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="animate-in fade-in duration-300">
                  <label className="block text-sm font-semibold text-neutral-600 dark:text-neutral-400 mb-2 uppercase tracking-wider">{t.addListing.region}</label>
                  <input
                    type="text"
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    className="w-full bg-neutral-50 dark:bg-neutral-800/30 border border-neutral-200 dark:border-neutral-700 rounded-xl px-4 py-3 text-neutral-900 dark:text-neutral-100 focus:outline-none cursor-not-allowed"
                    placeholder={t.addListing.autoFill}
                  />
                </div>
              </div>
            </div>

            <div className="my-10 border-t border-neutral-100 dark:border-white/5" />

            <div>
              <h2 className="text-xl font-extrabold text-neutral-900 dark:text-neutral-50 mb-6">
                {t.addListing.yourInfo}
              </h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-neutral-600 dark:text-neutral-400 mb-2 uppercase tracking-wider">{t.addListing.name}</label>
                  <input
                    type="text"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    required
                    className="w-full bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xl px-4 py-3 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-neutral-600 dark:text-neutral-400 mb-2 uppercase tracking-wider">{t.addListing.phoneNumber}</label>
                  <div className="space-y-4">
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="w-full bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xl px-4 py-3 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
                    />
                    <label className="flex items-center gap-3 text-sm font-bold text-neutral-700 dark:text-neutral-300 p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-2xl cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all border border-transparent hover:border-red-500/20">
                      <input
                        type="checkbox"
                        checked={showPhoneNumber}
                        onChange={(e) => setShowPhoneNumber(e.target.checked)}
                        className="w-5 h-5 text-red-500 focus:ring-red-500/20 rounded-lg dark:bg-neutral-900 dark:border-neutral-700 transition-all"
                      />
                      {t.addListing.showPhoneNumber}
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-10 pt-8 border-t border-neutral-100 dark:border-white/5 flex flex-col sm:flex-row justify-end gap-4">
              <button
                type="button"
                onClick={() => {
                  setOfferType('Angebote');
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
                className="px-8 py-4 bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 rounded-2xl font-bold hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-all active:scale-95"
              >
                {t.addListing.reset}
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-10 py-4 bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-2xl font-bold shadow-xl shadow-red-500/20 hover:shadow-red-500/40 hover:-translate-y-1 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-3"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    {t.addListing.saving}
                  </>
                ) : (
                  <>
                    {isEditMode ? t.addListing.updateLink : "İlanı Oluştur"}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
      {showLimitModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-neutral-900 rounded-[2rem] w-full max-w-lg overflow-hidden shadow-2xl border border-neutral-200 dark:border-white/10">
            <div className="relative p-8 text-center">
              <button
                onClick={() => navigate('/')}
                className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 p-2 transition-colors"
              >
                ✕
              </button>
              <div className="w-20 h-20 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl">🚀</span>
              </div>
              <h3 className="text-2xl font-black text-neutral-900 dark:text-neutral-50 mb-2">{t.addListing.limitReached.title}</h3>
              <p className="text-neutral-500 dark:text-neutral-400 font-medium mb-8 px-4">
                {t.addListing.limitReached.description
                  .replace('{limit}', limitState.limit)
                  .replace('{resetDate}', limitState.nextResetDate ? new Date(limitState.nextResetDate).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' }) : 'yakında')}
              </p>

              <div className="space-y-3">
                <button
                  onClick={() => navigate('/packages')}
                  className="w-full py-4 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-2xl font-black hover:scale-105 transition-all shadow-lg active:scale-95"
                >
                  {t.addListing.limitReached.viewPackages}
                </button>
                <button
                  onClick={handlePayExtra}
                  disabled={payingExtra}
                  className="w-full py-4 border-2 border-red-600 text-red-600 rounded-2xl font-black hover:bg-red-50 dark:hover:bg-red-900/10 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
                >
                  {payingExtra ? (
                    <div className="flex items-center gap-2">
                      <LoadingSpinner size="small" />
                      <span>{t.addListing.saving}</span>
                    </div>
                  ) : (
                    <span>{t.addListing.limitReached.paySingle}</span>
                  )}
                </button>
                <button
                  onClick={() => navigate('/')}
                  className="w-full py-4 text-neutral-400 font-bold hover:text-neutral-600 dark:hover:text-neutral-200 transition-colors"
                >
                  {t.addListing.limitReached.cancel}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
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
          className="hidden md:block absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 focus:outline-none z-10 bg-black/50 rounded-full p-3 hover:bg-black/70 transition-all hover:scale-110"
        >
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}

      {/* Image - Swipeable Container */}
      <div
        className="relative w-full h-[85vh] flex overflow-x-auto snap-x snap-mandatory scrollbar-none"
        onClick={(e) => e.stopPropagation()}
        onScroll={(e) => {
          const scrollLeft = e.target.scrollLeft;
          const width = e.target.clientWidth;
          const newIndex = Math.round(scrollLeft / width);
          if (newIndex !== currentImageIndex && onNavigate) {
            onNavigate(newIndex);
          }
        }}
        ref={(el) => {
          if (el && el.scrollLeft !== currentImageIndex * el.clientWidth) {
            el.scrollLeft = currentImageIndex * el.clientWidth;
          }
        }}
      >
        {(images && images.length > 0 ? images : [imageSrc]).map((img, idx) => (
          <div key={idx} className="w-full h-full flex-shrink-0 flex items-center justify-center snap-center">
            <img
              src={img}
              alt={`${altText} ${idx + 1}`}
              className="max-w-full max-h-full object-contain cursor-default"
            />
          </div>
        ))}
      </div>

      {/* Image Counter */}
      {hasMultipleImages && (
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white text-sm bg-black/50 px-4 py-2 rounded-full z-10">
          {currentImageIndex + 1} / {images.length}
        </div>
      )}

      {/* Next Button */}
      {hasMultipleImages && (
        <button
          onClick={handleNext}
          className="hidden md:block absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 focus:outline-none z-10 bg-black/50 rounded-full p-3 hover:bg-black/70 transition-all hover:scale-110"
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
    { id: 'bump', name: 'Yukarı Çıkar', price: '9,99', duration: 1, durationLabel: 'bir kerelik', effect: 'Yeni dikkat çekin! İlanınız yeni bir ilan gibi görünecek.' },
    { id: 'highlight', name: 'Öne Çıkan', price: '79,99', duration: 7, durationLabel: '7 Gün', effect: '2 kata kadar daha fazla görünürlük! İlanınız renkli olarak vurgulanacak.' },
    { id: 'multi-bump', name: 'Tekrarlı Yukarı Çıkarma', price: '99,99', duration: 7, durationLabel: '7 Gün', effect: '5 kata kadar daha fazla görünürlük! Bir hafta boyunca ilanınız her gün yukarı çıkarılacak.' },
    { id: 'z_premium', name: 'Premium', price: '129,99', duration: 7, durationLabel: '7 Gün', effect: '10 kata kadar daha fazla görünürlük! İlanınız listenin en başında yer alacak!' },
    { id: 'galerie', name: 'Vitrin', price: '199,99', duration: 10, durationLabel: '10 Gün', effect: '15 kata kadar daha fazla görünürlük! İlanınız ana sayfada da görünecek!' },
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md transition-all duration-300" onClick={onClose}>
      <div className="bg-white dark:bg-neutral-900 rounded-3xl shadow-2xl w-full max-w-5xl overflow-hidden max-h-[90vh] flex flex-col border border-transparent dark:border-white/5 transition-colors duration-300" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-4 sm:p-6 text-white flex justify-between items-center">
          <div>
            <h2 className="text-lg sm:text-2xl font-black flex items-center gap-2">
              <span className="bg-red-500 text-white p-1 sm:p-1.5 rounded-lg">
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </span>
              Görünürlüğü Artır
            </h2>
            <p className="text-gray-400 text-[10px] sm:text-xs font-bold uppercase tracking-widest mt-0.5 sm:mt-1">İlan: <span className="text-white">{listing.title}</span></p>
          </div>
          <button onClick={onClose} className="p-1 sm:p-2 hover:bg-white/10 rounded-full transition-colors">
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-3 sm:p-6 bg-gray-50/50 dark:bg-neutral-950/50 transition-colors duration-300">
          <div className="bg-white dark:bg-neutral-900 rounded-2xl border-2 border-gray-100 dark:border-white/5 overflow-hidden shadow-sm transition-colors duration-300">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 dark:bg-neutral-950/50 border-b-2 border-gray-100 dark:border-white/5 transition-colors duration-300">
                  <tr className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-neutral-400">
                    <th className="px-3 sm:px-6 py-3 sm:py-4 w-12 sm:w-16">Seç</th>
                    <th className="px-2 sm:px-4 py-3 sm:py-4">Paket Detayı</th>
                    <th className="px-3 sm:px-6 py-3 sm:py-4">Süre</th>
                    <th className="px-3 sm:px-6 py-3 sm:py-4 text-right w-24 sm:w-32">Fiyat</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-white/5 text-xs sm:text-sm transition-colors duration-300">
                  {promotionPackages.map((pkg, idx) => (
                    <tr
                      key={pkg.id}
                      onClick={() => togglePromotionSelection(pkg.id)}
                      className={`hover:bg-red-50/40 dark:hover:bg-red-900/10 transition-all cursor-pointer group ${idx % 2 !== 0 ? 'bg-gray-50/30 dark:bg-neutral-950/20' : ''} ${selectedPromotions.includes(pkg.id) ? 'bg-red-50 dark:bg-red-900/20' : ''}`}
                    >
                      <td className="px-3 sm:px-6 py-3 sm:py-5">
                        <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-300 ${selectedPromotions.includes(pkg.id) ? 'bg-red-500 border-red-500 scale-110 shadow-lg shadow-red-200' : 'border-gray-200 dark:border-white/10 bg-white dark:bg-neutral-800 group-hover:border-red-300'}`}>
                          {selectedPromotions.includes(pkg.id) && (
                            <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3.5} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                      </td>
                      <td className="px-2 sm:px-4 py-3 sm:py-5">
                        <div className="font-bold sm:font-black text-gray-900 dark:text-neutral-50 group-hover:text-red-600 transition-colors uppercase tracking-tight">{pkg.name}</div>
                        <div className="text-[10px] sm:text-xs text-gray-500 dark:text-neutral-400 mt-0.5 leading-tight italic font-medium transition-colors">{pkg.effect}</div>
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-5">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-gray-100 dark:bg-neutral-800 text-gray-600 dark:text-neutral-400 transition-colors">
                          {pkg.durationLabel || (pkg.duration === 1 ? '1x' : `${pkg.duration}G`)}
                        </span>
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-5 text-right font-black text-red-600 text-sm sm:text-xl tabular-nums">
                        {pkg.price} TL
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer / Cart Summary */}
        <div className={`p-4 sm:p-6 bg-white dark:bg-neutral-900 border-t-2 border-gray-100 dark:border-white/5 transition-all duration-500 ${selectedPromotions.length > 0 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-70 grayscale pointer-events-none'}`}>
          <div className="bg-gray-900 rounded-2xl p-4 sm:p-6 text-white flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6 shadow-2xl">
            <div className="flex items-center gap-4 sm:gap-6">
              <div className={`bg-red-500 text-white p-2 sm:p-3 rounded-xl ${selectedPromotions.length > 0 ? 'animate-bounce shadow-lg shadow-red-500/50' : ''}`}>
                <svg className="w-5 h-5 sm:w-7 sm:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-0.63.63-0.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div className="text-center sm:text-left">
                <div className="text-[8px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-red-500 mb-0.5 sm:mb-1">{selectedPromotions.length} Paket Seçildi</div>
                <div className="text-xl sm:text-3xl font-black tracking-tight tabular-nums">Toplam: {calculateTotal()} TL</div>
              </div>
            </div>
            <button
              onClick={handlePromotionPurchase}
              disabled={selectedPromotions.length === 0}
              className="w-full sm:w-auto px-8 sm:px-12 py-3 sm:py-5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-bold sm:font-black text-base sm:text-xl shadow-xl shadow-red-500/30 hover:shadow-red-500/50 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 sm:gap-3 group"
            >
              Şimdi Satın Al
              <svg className="w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>
          <div className="mt-4 text-center">
            <p className="text-[10px] font-bold text-gray-400 dark:text-neutral-500 uppercase tracking-widest flex items-center justify-center gap-2 transition-colors">
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

export default AddListing;
