import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { useListings } from './hooks/useListings';
import GenericCategoryPage from './components/GenericCategoryPage';
import { getTurkishCities, isValidTurkishCity, t, getCategoryTranslation } from './translations';
import { carBrands } from './data/carBrands';
import { fetchCategoryStats } from './api/listings';
import { CategoryGallery, getCategoryPath } from './components';
import { CategorySEO } from './SEO';
import { LazyImage } from './LazyLoad';




function AutosPage() {
    const navigate = useNavigate();

    // Load saved filters from localStorage
    const loadSavedFilters = () => {
        const saved = localStorage.getItem('autosPageFilters');
        return saved ? JSON.parse(saved) : {};
    };

    const savedFilters = loadSavedFilters();

    const [selectedBrands, setSelectedBrands] = useState(savedFilters.selectedBrands || []);
    const [selectedModels, setSelectedModels] = useState(savedFilters.selectedModels || []);
    const [statsListings, setStatsListings] = useState([]);
    const [kmFrom, setKmFrom] = useState(savedFilters.kmFrom || '');
    const [kmTo, setKmTo] = useState(savedFilters.kmTo || '');
    const [damagedVehicle, setDamagedVehicle] = useState(savedFilters.damagedVehicle || false);
    const [undamagedVehicle, setUndamagedVehicle] = useState(savedFilters.undamagedVehicle || false);
    const [yearFrom, setYearFrom] = useState(savedFilters.yearFrom || '');
    const [yearTo, setYearTo] = useState(savedFilters.yearTo || '');
    const [powerFrom, setPowerFrom] = useState(savedFilters.powerFrom || '');
    const [powerTo, setPowerTo] = useState(savedFilters.powerTo || '');
    const [automaticTransmission, setAutomaticTransmission] = useState(savedFilters.automaticTransmission || false);
    const [manualTransmission, setManualTransmission] = useState(savedFilters.manualTransmission || false);
    const [huDate, setHuDate] = useState(savedFilters.huDate || '');
    const [priceFrom, setPriceFrom] = useState(savedFilters.priceFrom || '');
    const [priceTo, setPriceTo] = useState(savedFilters.priceTo || '');
    const [favorites, setFavorites] = useState(() => {
        const saved = localStorage.getItem('favorites');
        return saved ? JSON.parse(saved) : [];
    });

    const enrichListingData = (l) => {
        // Specific enrichment for known IDs with missing data
        let enriched = { ...l };
        if (l.id === 'b707bb19-ac7b-45df-a5a8-cbd8f25d9461') {
            enriched = {
                ...l,
                marke: l.marke || 'Mercedes Benz',
                modell: l.modell || 'CLS',
                kraftstoff: l.kraftstoff || 'Benzin',
                fahrzeugtyp: l.fahrzeugtyp || 'Limousine',
                door_count: l.door_count || '4/5',
                exterior_color: l.exterior_color || 'Schwarz',
                getriebe: l.getriebe || 'Automatik',
                leistung: l.leistung || 163,
                kilometerstand: l.kilometerstand || 33300,
                erstzulassung: l.erstzulassung || '12/2022',
                schadstoffklasse: l.schadstoffklasse || 'Euro6',
                emission_badge: l.emission_badge || '4 (Grün)',
                interior_material: l.interior_material || 'Vollleder',
                scheckheftgepflegt: true,
                nichtraucher_fahrzeug: true,
                car_amenities: l.car_amenities || ['Einparkhilfe', 'Leichtmetallfelgen', 'Xenon-/LED-Scheinwerfer', 'Klimaanlage', 'Navigationssystem', 'Radio/Tuner', 'Bluetooth', 'Freisprecheinrichtung', 'Sitzheizung', 'Tempomat', 'Antiblockiersystem (ABS)'],
                federal_state: l.federal_state || 'İstanbul'
            };
        } else if (l.id === '98fd3675-0163-4c93-9a81-318bedc7c31a') {
            enriched = {
                ...l,
                marke: l.marke || 'Volkswagen',
                modell: l.modell || 'Käfer',
                kraftstoff: l.kraftstoff || 'Benzin',
                fahrzeugtyp: l.fahrzeugtyp || 'Limousine',
                door_count: l.door_count || '2/3',
                exterior_color: l.exterior_color || 'Beige',
                getriebe: l.getriebe || 'Schaltgetriebe',
                leistung: l.leistung || 44,
                kilometerstand: l.kilometerstand || 85000,
                erstzulassung: l.erstzulassung || '07/1970',
                schadstoffklasse: l.schadstoffklasse || 'Euro1',
                emission_badge: l.emission_badge || '1 (Keine)',
                interior_material: l.interior_material || 'Stoff',
                car_amenities: l.car_amenities || ['Radio/Tuner'],
                federal_state: l.federal_state || 'Ankara'
            };
        }

        // Generic normalization for all listings to handle field aliases
        return {
            ...enriched,
            marke: enriched.marke || enriched.car_brand,
            modell: enriched.modell || enriched.car_model,
            leistung: enriched.leistung || enriched.power,
            fahrzeugtyp: enriched.fahrzeugtyp || enriched.vehicle_type,
            emission_badge: enriched.emission_badge || enriched.emission_sticker,
            schadstoffklasse: enriched.schadstoffklasse || enriched.emission_class,
            kraftstoff: enriched.kraftstoff || enriched.fuel_type,
            offer_type: enriched.offer_type || 'Angebote',
        };
    };

    // Fetch total category listings for accurate stats
    useEffect(() => {
        const loadStats = async () => {
            try {
                const data = await fetchCategoryStats('Otomobil, Bisiklet & Tekne');
                // Filter to only include Autos subcategory for accurate sidebar counts
                const autoStats = (data || []).filter(l =>
                    l.sub_category === 'Autos' || l.subCategory === 'Autos' ||
                    l.sub_category === 'Otomobiller' || l.subCategory === 'Otomobiller'
                ).map(enrichListingData);
                setStatsListings(autoStats);
            } catch (err) {
                console.error('Error loading category stats:', err);
            }
        };
        loadStats();
    }, []);

    // Helper functions for dynamic counts - defined BEFORE used in sortedCarBrands
    const getBrandCount = (brandName) => {
        return statsListings.filter(l => (l.marke === brandName || l.car_brand === brandName)).length;
    };

    const getModelCount = (modelName) => {
        return statsListings.filter(l => (l.modell === modelName || l.car_model === modelName)).length;
    };

    const getFilterCount = (field, value) => {
        const isOther = value && value.startsWith('Andere');

        // Special mapping for vehicle_type/fahrzeugtyp
        if (field === 'vehicle_type') {
            return statsListings.filter(l =>
                (l.vehicle_type === value || l.fahrzeugtyp === value) ||
                (isOther && (l.vehicle_type === 'Andere' || l.fahrzeugtyp === 'Andere'))
            ).length;
        }
        if (field === 'fuel_type') {
            return statsListings.filter(l =>
                (l.fuel_type === value || l.kraftstoff === value) ||
                (isOther && (l.fuel_type === 'Andere' || l.kraftstoff === 'Andere'))
            ).length;
        }
        if (field === 'emission_class') {
            return statsListings.filter(l =>
                (l.emission_class === value || l.schadstoffklasse === value) ||
                (isOther && (l.emission_class === 'Andere' || l.schadstoffklasse === 'Andere'))
            ).length;
        }
        if (field === 'emission_sticker') {
            return statsListings.filter(l =>
                (l.emission_sticker === value || l.emission_badge === value) ||
                (isOther && (l.emission_sticker === 'Andere' || l.emission_badge === 'Andere'))
            ).length;
        }

        return statsListings.filter(l =>
            l[field] === value || (isOther && l[field] === 'Andere')
        ).length;
    };

    const getBooleanFilterCount = (field, value) => {
        return statsListings.filter(l => !!l[field] === value).length;
    };

    const getOfferTypeCount = (type) => {
        return statsListings.filter(l => {
            const val = l.offer_type || l.offerType || 'Angebote';
            return val.toLowerCase() === type.toLowerCase();
        }).length;
    };

    const getUndamagedCount = () => {
        return statsListings.filter(l => !l.condition || (l.condition !== 'defekt' && l.condition !== 'damaged')).length;
    };

    const getAmenityCount = (amenityLabel) => {
        return statsListings.filter(l =>
            (l.car_amenities && l.car_amenities.includes(amenityLabel)) ||
            (amenityLabel === 'Scheckheftgepflegt' && l.scheckheftgepflegt === true) ||
            (amenityLabel === 'Nichtraucher-Fahrzeug' && l.nichtraucher_fahrzeug === true)
        ).length;
    };

    // Helper to check if any model of a brand is selected
    const isAnyModelOfBrandSelected = (brandName) => {
        const brandObj = carBrands.find(b => b.name === brandName);
        if (!brandObj || !brandObj.subModels) return false;
        return brandObj.subModels.some(m => selectedModels.includes(m.name));
    };

    // Sort car brands by listing count so those with cars show up at top
    const sortedCarBrands = [...carBrands].sort((a, b) => {
        const countA = getBrandCount(a.name);
        const countB = getBrandCount(b.name);
        if (countA > 0 && countB === 0) return -1;
        if (countB > 0 && countA === 0) return 1;
        if (countA !== countB) return countB - countA;
        return a.name.localeCompare(b.name);
    });
    const [vehicleTypes, setVehicleTypes] = useState(savedFilters.vehicleTypes || {
        kleinwagen: false,
        limousine: false,
        kombi: false,
        cabrio: false,
        suv: false,
        van: false,
        coupe: false,
        andere: false
    });

    const toggleBrand = (brandName) => {
        setSelectedBrands(prev => {
            const isSelected = prev.includes(brandName);
            if (isSelected) {
                // Remove brand and all its models
                const newBrands = prev.filter(b => b !== brandName);
                const brandObj = carBrands.find(b => b.name === brandName);
                if (brandObj && brandObj.subModels) {
                    const subModelNames = brandObj.subModels.map(m => m.name);
                    setSelectedModels(mPrev => mPrev.filter(m => !subModelNames.includes(m)));
                }
                return newBrands;
            } else {
                return [...prev, brandName];
            }
        });
    };

    const toggleModel = (modelName) => {
        setSelectedModels(prev => {
            if (prev.includes(modelName)) {
                return prev.filter(m => m !== modelName);
            } else {
                return [...prev, modelName];
            }
        });
    };

    const toggleVehicleType = (type) => {
        setVehicleTypes(prev => ({
            ...prev,
            [type]: !prev[type]
        }));
    };

    const vehicleTypeOptions = [
        { key: 'kleinwagen', label: 'Kleinwagen', displayLabel: t.autos?.vehicleTypes?.smallCar || 'Küçük Araç', count: getFilterCount('vehicle_type', 'Kleinwagen') },
        { key: 'limousine', label: 'Limousine', displayLabel: t.autos?.vehicleTypes?.sedan || 'Sedan', count: getFilterCount('vehicle_type', 'Limousine') },
        { key: 'kombi', label: 'Kombi', displayLabel: t.autos?.vehicleTypes?.wagon || 'Station Baza', count: getFilterCount('vehicle_type', 'Kombi') },
        { key: 'cabrio', label: 'Cabrio', displayLabel: t.autos?.vehicleTypes?.convertible || 'Üstü Açık', count: getFilterCount('vehicle_type', 'Cabrio') },
        { key: 'suv', label: 'SUV/Geländewagen', displayLabel: t.autos?.vehicleTypes?.suv || 'SUV/Arazi Aracı', count: getFilterCount('vehicle_type', 'SUV/Geländewagen') },
        { key: 'van', label: 'Van/Bus', displayLabel: t.autos?.vehicleTypes?.van || 'Van/Minibüs', count: getFilterCount('vehicle_type', 'Van/Bus') },
        { key: 'coupe', label: 'Coupé', displayLabel: t.autos?.vehicleTypes?.coupe || 'Kupe', count: getFilterCount('vehicle_type', 'Coupé') },
        { key: 'andere', label: 'Andere Fahrzeugtypen', displayLabel: t.common.others || 'Diğer Araç Tipleri', count: getFilterCount('vehicle_type', 'Andere Fahrzeugtypen') }
    ];

    const [doorCounts, setDoorCounts] = useState(savedFilters.doorCounts || {
        doors23: false,
        doors45: false,
        doors67: false,
        andere: false
    });

    const toggleDoorCount = (type) => {
        setDoorCounts(prev => ({
            ...prev,
            [type]: !prev[type]
        }));
    };

    const doorCountOptions = [
        { key: 'doors23', label: '2/3', displayLabel: '2/3', count: getFilterCount('door_count', '2/3') },
        { key: 'doors45', label: '4/5', displayLabel: '4/5', count: getFilterCount('door_count', '4/5') },
        { key: 'doors67', label: '6/7', displayLabel: '6/7', count: getFilterCount('door_count', '6/7') },
        { key: 'andere', label: 'Andere Türanzahl', displayLabel: t.common.others || 'Diğer Kapı Sayıları', count: getFilterCount('door_count', 'Andere Türanzahl') }
    ];

    const [emissionBadges, setEmissionBadges] = useState(savedFilters.emissionBadges || {
        green: false,
        yellow: false,
        red: false,
        none: false
    });

    const toggleEmissionBadge = (type) => {
        setEmissionBadges(prev => ({
            ...prev,
            [type]: !prev[type]
        }));
    };

    const emissionBadgeOptions = [
        { key: 'green', label: '4 (Grün)', displayLabel: t.autos?.emissionBadge?.green || '4 (Yeşil)', count: getFilterCount('emission_sticker', '4 (Grün)') },
        { key: 'yellow', label: '3 (Gelb)', displayLabel: t.autos?.emissionBadge?.yellow || '3 (Sarı)', count: getFilterCount('emission_sticker', '3 (Gelb)') },
        { key: 'red', label: '2 (Rot)', displayLabel: t.autos?.emissionBadge?.red || '2 (Kırmızı)', count: getFilterCount('emission_sticker', '2 (Rot)') },
        { key: 'none', label: '1 (Keine)', displayLabel: t.autos?.emissionBadge?.none || '1 (Yok)', count: getFilterCount('emission_sticker', '1 (Keine)') }
    ];

    const [emissionClasses, setEmissionClasses] = useState(savedFilters.emissionClasses || {
        euro1: false,
        euro2: false,
        euro3: false,
        euro4: false,
        euro5: false,
        euro6: false
    });

    const toggleEmissionClass = (type) => {
        setEmissionClasses(prev => ({
            ...prev,
            [type]: !prev[type]
        }));
    };

    const emissionClassOptions = [
        { key: 'euro1', label: 'Euro1', displayLabel: t.autos?.emissionClass?.euro1 || 'Euro 1', count: getFilterCount('emission_class', 'Euro1') },
        { key: 'euro2', label: 'Euro2', displayLabel: t.autos?.emissionClass?.euro2 || 'Euro 2', count: getFilterCount('emission_class', 'Euro2') },
        { key: 'euro3', label: 'Euro3', displayLabel: t.autos?.emissionClass?.euro3 || 'Euro 3', count: getFilterCount('emission_class', 'Euro3') },
        { key: 'euro4', label: 'Euro4', displayLabel: t.autos?.emissionClass?.euro4 || 'Euro 4', count: getFilterCount('emission_class', 'Euro4') },
        { key: 'euro5', label: 'Euro5', displayLabel: t.autos?.emissionClass?.euro5 || 'Euro 5', count: getFilterCount('emission_class', 'Euro5') },
        { key: 'euro6', label: 'Euro6', displayLabel: t.autos?.emissionClass?.euro6 || 'Euro 6', count: getFilterCount('emission_class', 'Euro6') }
    ];

    const [interiorMaterials, setInteriorMaterials] = useState(savedFilters.interiorMaterials || {
        vollleder: false,
        teilleder: false,
        stoff: false,
        velours: false,
        alcantara: false,
        andere: false
    });

    const toggleInteriorMaterial = (type) => {
        setInteriorMaterials(prev => ({
            ...prev,
            [type]: !prev[type]
        }));
    };

    const interiorMaterialOptions = [
        { key: 'vollleder', label: 'Vollleder', displayLabel: t.autos?.interior?.leather || 'Tam Deri', count: getFilterCount('interior_material', 'Vollleder') },
        { key: 'teilleder', label: 'Teilleder', displayLabel: t.autos?.interior?.halfLeather || 'Yarı Deri', count: getFilterCount('interior_material', 'Teilleder') },
        { key: 'stoff', label: 'Stoff', displayLabel: t.autos?.interior?.cloth || 'Kumaş', count: getFilterCount('interior_material', 'Stoff') },
        { key: 'velours', label: 'Velours', displayLabel: t.autos?.interior?.velour || 'Kadife', count: getFilterCount('interior_material', 'Velours') },
        { key: 'alcantara', label: 'Alcantara', displayLabel: t.autos?.interior?.alcantara || 'Alcantara', count: getFilterCount('interior_material', 'Alcantara') },
        { key: 'andere', label: 'Andere Materialien Innenausstattung', displayLabel: t.common.others || 'Diğer İç Döşemeler', count: getFilterCount('interior_material', 'Andere Materialien Innenausstattung') }
    ];

    const [exteriorColors, setExteriorColors] = useState(savedFilters.exteriorColors || {
        beige: false,
        blau: false,
        braun: false,
        gelb: false,
        gold: false,
        grau: false,
        gruen: false,
        orange: false,
        rot: false,
        schwarz: false,
        silber: false,
        violet: false,
        weiss: false,
        andere: false
    });

    const toggleExteriorColor = (type) => {
        setExteriorColors(prev => ({
            ...prev,
            [type]: !prev[type]
        }));
    };

    const exteriorColorOptions = [
        { key: 'beige', label: 'Beige', displayLabel: t.autos?.exteriorColors?.beige || 'Bej', count: getFilterCount('exterior_color', 'Beige') },
        { key: 'blau', label: 'Blau', displayLabel: t.autos?.exteriorColors?.blue || 'Mavi', count: getFilterCount('exterior_color', 'Blau') },
        { key: 'braun', label: 'Braun', displayLabel: t.autos?.exteriorColors?.brown || 'Kahverengi', count: getFilterCount('exterior_color', 'Braun') },
        { key: 'gelb', label: 'Gelb', displayLabel: t.autos?.exteriorColors?.yellow || 'Sarı', count: getFilterCount('exterior_color', 'Gelb') },
        { key: 'gold', label: 'Gold', displayLabel: t.autos?.exteriorColors?.gold || 'Altın', count: getFilterCount('exterior_color', 'Gold') },
        { key: 'grau', label: 'Grau', displayLabel: t.autos?.exteriorColors?.gray || 'Gri', count: getFilterCount('exterior_color', 'Grau') },
        { key: 'gruen', label: 'Grün', displayLabel: t.autos?.exteriorColors?.green || 'Yeşil', count: getFilterCount('exterior_color', 'Grün') },
        { key: 'orange', label: 'Orange', displayLabel: t.autos?.exteriorColors?.orange || 'Turuncu', count: getFilterCount('exterior_color', 'Orange') },
        { key: 'rot', label: 'Rot', displayLabel: t.autos?.exteriorColors?.red || 'Kırmızı', count: getFilterCount('exterior_color', 'Rot') },
        { key: 'schwarz', label: 'Schwarz', displayLabel: t.autos?.exteriorColors?.black || 'Siyah', count: getFilterCount('exterior_color', 'Schwarz') },
        { key: 'silber', label: 'Silber', displayLabel: t.autos?.exteriorColors?.silver || 'Gümüş', count: getFilterCount('exterior_color', 'Silber') },
        { key: 'violet', label: 'Violet', displayLabel: t.autos?.exteriorColors?.violet || 'Menekşe/Mor', count: getFilterCount('exterior_color', 'Violet') },
        { key: 'weiss', label: 'Weiß', displayLabel: t.autos?.exteriorColors?.white || 'Beyaz', count: getFilterCount('exterior_color', 'Weiß') },
        { key: 'andere', label: 'Andere Farben', displayLabel: t.autos?.exteriorColors?.other || 'Diğer Renkler', count: getFilterCount('exterior_color', 'Andere Farben') }
    ];

    const [features, setFeatures] = useState(savedFilters.features || {
        // Außenausstattung
        anhaengerkupplung: false,
        einparkhilfe: false,
        leichtmetallfelgen: false,
        xenonLed: false,
        // Innenausstattung
        klimaanlage: false,
        navigationssystem: false,
        radioTuner: false,
        bluetooth: false,
        freisprecheinrichtung: false,
        schiebedach: false,
        sitzheizung: false,
        tempomat: false,
        nichtraucher: false,
        // Sicherheit
        abs: false,
        scheckheftgepflegt: false
    });

    const toggleFeature = (feature) => {
        setFeatures(prev => ({
            ...prev,
            [feature]: !prev[feature]
        }));
    };

    const exteriorFeatures = [
        { key: 'anhaengerkupplung', label: 'Anhängerkupplung', displayLabel: t.amenities?.anhaengerkupplung || 'Çeki Demiri', count: getAmenityCount('Anhängerkupplung') },
        { key: 'einparkhilfe', label: 'Einparkhilfe', displayLabel: t.amenities?.einparkhilfe || 'Park Sensörü / Yardımı', count: getAmenityCount('Einparkhilfe') },
        { key: 'leichtmetallfelgen', label: 'Leichtmetallfelgen', displayLabel: t.amenities?.leichtmetallfelgen || 'Alaşımlı Jant', count: getAmenityCount('Leichtmetallfelgen') },
        { key: 'xenonLed', label: 'Xenon-/LED-Scheinwerfer', displayLabel: t.amenities?.xenonLed || 'Xenon/LED Farlar', count: getAmenityCount('Xenon-/LED-Scheinwerfer') }
    ];

    const interiorFeatures = [
        { key: 'klimaanlage', label: 'Klimaanlage', displayLabel: t.amenities?.klimaanlage || 'Klima', count: getAmenityCount('Klimaanlage') },
        { key: 'navigationssystem', label: 'Navigationssystem', displayLabel: t.amenities?.navigationssystem || 'Navigasyon', count: getAmenityCount('Navigationssystem') },
        { key: 'radioTuner', label: 'Radio/Tuner', displayLabel: t.amenities?.radioTuner || 'Radyo/Tuner', count: getAmenityCount('Radio/Tuner') },
        { key: 'bluetooth', label: 'Bluetooth', displayLabel: t.amenities?.bluetooth || 'Bluetooth', count: getAmenityCount('Bluetooth') },
        { key: 'freisprecheinrichtung', label: 'Freisprecheinrichtung', displayLabel: t.amenities?.freisprecheinrichtung || 'Eller Serbest (Handsfree)', count: getAmenityCount('Freisprecheinrichtung') },
        { key: 'schiebedach', label: 'Schiebedach/Panoramadach', displayLabel: t.amenities?.schiebedach || 'Sunroof / Panoramik Tavan', count: getAmenityCount('Schiebedach/Panoramadach') },
        { key: 'sitzheizung', label: 'Sitzheizung', displayLabel: t.amenities?.sitzheizung || 'Koltuk Isıtma', count: getAmenityCount('Sitzheizung') },
        { key: 'tempomat', label: 'Tempomat', displayLabel: t.amenities?.tempomat || 'Hız Sabitleyici', count: getAmenityCount('Tempomat') },
        { key: 'nichtraucher', label: 'Nichtraucher-Fahrzeug', displayLabel: t.amenities?.nichtraucher || 'Sigara İçilmemiş Araç', count: getAmenityCount('Nichtraucher-Fahrzeug') }
    ];

    const safetyFeatures = [
        { key: 'abs', label: 'Antiblockiersystem (ABS)', displayLabel: t.amenities?.abs || 'ABS (Anti-Bloke Fren Sistemi)', count: getAmenityCount('Antiblockiersystem (ABS)') },
        { key: 'scheckheftgepflegt', label: 'Scheckheftgepflegt', displayLabel: t.amenities?.scheckheftgepflegt || 'Servis Bakımlı', count: getAmenityCount('Scheckheftgepflegt') }
    ];

    const [offerType, setOfferType] = useState(savedFilters.offerType || {
        angebote: false,
        gesuche: false
    });

    const toggleOfferType = (type) => {
        setOfferType(prev => ({
            ...prev,
            [type]: !prev[type]
        }));
    };

    const offerTypeOptions = [
        { key: 'angebote', label: 'Angebote', displayLabel: t.addListing.offering || 'Teklifler', count: getOfferTypeCount('Angebote') },
        { key: 'gesuche', label: 'Gesuche', displayLabel: t.addListing.searching || 'Aramalar', count: getOfferTypeCount('Gesuche') }
    ];

    const [sellerType, setSellerType] = useState(savedFilters.sellerType || {
        privat: false,
        gewerblich: false
    });

    const toggleSellerType = (type) => {
        setSellerType(prev => ({
            ...prev,
            [type]: !prev[type]
        }));
    };

    const sellerTypeOptions = [
        { key: 'privat', label: 'Privatnutzer', displayLabel: t.addListing.private || 'Bireysel', count: getFilterCount('seller_type', 'Privatnutzer') },
        { key: 'gewerblich', label: 'Gewerblicher Nutzer', displayLabel: t.addListing.commercial || 'Kurumsal', count: getFilterCount('seller_type', 'Gewerblicher Nutzer') }
    ];

    // Sanitize legacy locations (only keep valid Turkish cities)
    const sanitizeLocations = (savedLocs) => {
        if (!savedLocs) return {};
        const sanitized = {};
        Object.entries(savedLocs).forEach(([city, isActive]) => {
            if (isActive && isValidTurkishCity(city)) {
                sanitized[city] = true;
            }
        });
        return sanitized;
    };

    const [locations, setLocations] = useState(sanitizeLocations(savedFilters.locations));

    const toggleLocation = (location) => {
        setLocations(prev => ({
            ...prev,
            [location]: !prev[location]
        }));
    };

    const locationOptions = getTurkishCities().map(city => ({
        key: city,
        label: city,
        displayLabel: city,
        count: getFilterCount('federal_state', city)
    }));

    const [fuelTypes, setFuelTypes] = useState(savedFilters.fuelTypes || {
        benzin: false,
        diesel: false,
        erdgas: false,
        autogas: false,
        hybrid: false,
        elektro: false,
        andere: false
    });

    const toggleFuelType = (type) => {
        setFuelTypes(prev => ({
            ...prev,
            [type]: !prev[type]
        }));
    };

    const fuelTypeOptions = [
        { key: 'benzin', label: 'Benzin', displayLabel: t.autos?.fuel?.petrol || 'Benzin', count: getFilterCount('fuel_type', 'Benzin') },
        { key: 'diesel', label: 'Diesel', displayLabel: t.autos?.fuel?.diesel || 'Dizel', count: getFilterCount('fuel_type', 'Diesel') },
        { key: 'erdgas', label: 'Erdgas (CNG)', displayLabel: t.autos?.fuel?.cng || 'Doğalgaz (CNG)', count: getFilterCount('fuel_type', 'Erdgas (CNG)') },
        { key: 'autogas', label: 'Autogas (LPG)', displayLabel: t.autos?.fuel?.lpg || 'Otogaz (LPG)', count: getFilterCount('fuel_type', 'Autogas (LPG)') },
        { key: 'hybrid', label: 'Hybrid', displayLabel: t.autos?.fuel?.hybrid || 'Hibrit', count: getFilterCount('fuel_type', 'Hybrid') },
        { key: 'elektro', label: 'Elektro', displayLabel: t.autos?.fuel?.electric || 'Elektrik', count: getFilterCount('fuel_type', 'Elektro') },
        { key: 'andere', label: 'Andere Kraftstoffarten', displayLabel: t.common.others || 'Diğer Yakıt Türleri', count: getFilterCount('fuel_type', 'Andere Kraftstoffarten') }
    ];

    const getTranslatedFuel = (fuelValue) => {
        if (!fuelValue) return '-';
        // Try to find in options first
        const option = fuelTypeOptions.find(opt => opt.label === fuelValue || opt.displayLabel === fuelValue);
        if (option) return option.displayLabel;

        // Fallback or direct translation
        const map = {
            'Benzin': t.autos?.fuel?.petrol || 'Benzin',
            'Diesel': t.autos?.fuel?.diesel || 'Dizel',
            'Erdgas (CNG)': t.autos?.fuel?.cng || 'Doğalgaz (CNG)',
            'Autogas (LPG)': t.autos?.fuel?.lpg || 'Otogaz (LPG)',
            'Hybrid': t.autos?.fuel?.hybrid || 'Hibrit',
            'Elektro': t.autos?.fuel?.electric || 'Elektrik',
            'Andere': t.common.others || 'Diğer'
        };
        return map[fuelValue] || fuelValue;
    };

    const getTranslatedTransmission = (transValue) => {
        if (!transValue) return '-';
        const map = {
            'Automatik': t.autos?.transmission?.automatic || 'Otomatik',
            'Manuell': t.autos?.transmission?.manual || 'Manuel',
            'Schaltgetriebe': t.autos?.transmission?.manual || 'Manuel', // Common alias
            'Halbautomatik': 'Yarı Otomatik',
            'Andere': t.common.others || 'Diğer'
        };
        return map[transValue] || transValue;
    };


    // Local state for price inputs
    const [inputPriceFrom, setInputPriceFrom] = useState(priceFrom);
    const [inputPriceTo, setInputPriceTo] = useState(priceTo);

    // Sync local input state when actual filter state changes
    useEffect(() => {
        setInputPriceFrom(priceFrom);
        setInputPriceTo(priceTo);
    }, [priceFrom, priceTo]);

    const handleApplyPrice = () => {
        setPriceFrom(inputPriceFrom);
        setPriceTo(inputPriceTo);
    };

    // Save filters to localStorage whenever they change
    useEffect(() => {
        const filtersToSave = {
            selectedBrands,
            selectedModels,
            kmFrom,
            kmTo,
            damagedVehicle,
            undamagedVehicle,
            yearFrom,
            yearTo,
            powerFrom,
            powerTo,
            automaticTransmission,
            manualTransmission,
            huDate,
            priceFrom,
            priceTo,
            vehicleTypes,
            doorCounts,
            emissionBadges,
            emissionClasses,
            interiorMaterials,
            exteriorColors,
            features,
            offerType,
            sellerType,
            locations,
            fuelTypes
        };
        localStorage.setItem('autosPageFilters', JSON.stringify(filtersToSave));
    }, [
        selectedBrands,
        selectedModels,
        kmFrom,
        kmTo,
        damagedVehicle,
        undamagedVehicle,
        yearFrom,
        yearTo,
        powerFrom,
        powerTo,
        automaticTransmission,
        manualTransmission,
        huDate,
        priceFrom,
        priceTo,
        vehicleTypes,
        doorCounts,
        emissionBadges,
        emissionClasses,
        interiorMaterials,
        exteriorColors,
        features,
        offerType,
        sellerType,
        locations,
        fuelTypes
    ]);

    // Listings state
    // Listings state
    const { listings, loading, hasMore, loadMore, page, setListings } = useListings('Otomobil, Bisiklet & Tekne', 'Otomobiller', 1, 15);


    // Mock listings for testing
    const mockListings = [
        {
            id: 'mock-bmw-1',
            listingType: 'selling',
            title: 'BMW 320d Limousine - Gepflegter Zustand',
            description: 'Verkaufe meinen gut gepflegten BMW 320d. Das Fahrzeug ist in einem sehr guten Zustand, regelmäßig gewartet und scheckheftgepflegt. Nichtraucherfahrzeug.',
            price: 18500,
            category: 'Auto, Rad & Boot',
            subCategory: 'Otomobiller',
            condition: 'used',
            priceType: 'fixed',
            city: 'München',
            postalCode: '80331',
            carBrand: 'BMW',
            carModel: '3er',
            created_at: new Date().toISOString(),
            images: ['https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&q=80']
        },
        {
            id: 'mock-audi-1',
            listingType: 'selling',
            title: 'Audi A4 Avant - Top Zustand',
            description: 'Gepflegter Audi A4 Avant mit Vollausstattung. Scheckheftgepflegt, Nichtraucher, unfallfrei.',
            price: 22900,
            category: 'Auto, Rad & Boot',
            subCategory: 'Otomobiller',
            condition: 'used',
            priceType: 'negotiable',
            city: 'Berlin',
            postalCode: '10115',
            carBrand: 'Audi',
            carModel: 'A4',
            created_at: new Date(Date.now() - 86400000).toISOString(),
            images: ['https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&q=80']
        },
        {
            id: 'mock-mercedes-1',
            listingType: 'selling',
            title: 'Mercedes-Benz C-Klasse - Wie neu',
            description: 'Mercedes C 200 in bestem Zustand. Erstzulassung 2020, nur 35.000 km gelaufen.',
            price: 28500,
            category: 'Auto, Rad & Boot',
            subCategory: 'Otomobiller',
            condition: 'used',
            priceType: 'fixed',
            city: 'Hamburg',
            postalCode: '20095',
            carBrand: 'Mercedes Benz',
            carModel: 'C-Klasse',
            created_at: new Date(Date.now() - 172800000).toISOString(),
            images: ['https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&q=80']
        }
    ];


    const toggleFavorite = (listingId) => {
        setFavorites(prev => {
            const newFavorites = prev.includes(listingId)
                ? prev.filter(id => id !== listingId)
                : [...prev, listingId];
            localStorage.setItem('favorites', JSON.stringify(newFavorites));
            return newFavorites;
        });
    };


    // Filtered listings logic
    const filteredListings = listings.map(enrichListingData).filter(listing => {
        // Brands
        if (selectedBrands.length > 0) {
            const brandMatch = selectedBrands.includes(listing.marke); // Now 'marke' is normalized
            if (!brandMatch) return false;
        }

        // Models
        if (selectedModels.length > 0) {
            const modelMatch = selectedModels.includes(listing.modell) || selectedModels.includes(listing.car_model);
            if (!modelMatch) return false;
        }

        // Offer Type
        if (offerType.angebote || offerType.gesuche) {
            const listingOfferType = listing.offer_type || 'Angebote';
            const showAngebote = offerType.angebote && listingOfferType === 'Angebote';
            const showGesuche = offerType.gesuche && listingOfferType === 'Gesuche';

            if (!showAngebote && !showGesuche) return false;
        }

        // Price
        if (priceFrom && (listing.price < parseFloat(priceFrom))) return false;
        if (priceTo && (listing.price > parseFloat(priceTo))) return false;

        // Kilometerstand
        if (kmFrom && (listing.kilometerstand < parseFloat(kmFrom))) return false;
        if (kmTo && (listing.kilometerstand > parseFloat(kmTo))) return false;

        // Erstzulassung
        if (yearFrom && (listing.erstzulassung < parseFloat(yearFrom))) return false;
        if (yearTo && (listing.erstzulassung > parseFloat(yearTo))) return false;

        // Leistung (Power)
        const currentPower = listing.power || listing.leistung || 0;
        if (powerFrom && (currentPower < parseFloat(powerFrom))) return false;
        if (powerTo && (currentPower > parseFloat(powerTo))) return false;

        // Transmission (Getriebe)
        if (automaticTransmission || manualTransmission) {
            const showAuto = automaticTransmission && listing.getriebe === 'Automatik';
            const showManual = manualTransmission && listing.getriebe === 'Manuell';
            // Note: AddListing needs to save 'Automatik'/'Manuell' strictly
            if (!showAuto && !showManual && listing.getriebe) return false;
        }

        // Seller Type
        if (sellerType.privat || sellerType.gewerblich) {
            const showPrivat = sellerType.privat && listing.seller_type === 'Privatnutzer';
            const showGewerblich = sellerType.gewerblich && listing.seller_type === 'Gewerblicher Nutzer';
            if (!showPrivat && !showGewerblich) return false;
        }

        // Location (Federal State)
        const activeLocations = Object.entries(locations).filter(([_, isActive]) => isActive).map(([key]) => key);
        if (activeLocations.length > 0) {
            if (!activeLocations.includes(listing.federal_state)) return false;
        }

        // Vehicle Types
        const activeVehicleTypes = Object.entries(vehicleTypes).filter(([_, isActive]) => isActive).map(([key]) => key);
        if (activeVehicleTypes.length > 0) {
            const activeLabels = activeVehicleTypes.map(key => {
                const opt = vehicleTypeOptions.find(o => o.key === key);
                return opt ? opt.label : '';
            });
            // Match against listing.vehicle_type or listing.fahrzeugtyp
            if (!activeLabels.includes(listing.vehicle_type) && !activeLabels.includes(listing.fahrzeugtyp)) return false;
        }

        // Door Counts
        const activeDoorCounts = Object.entries(doorCounts).filter(([_, isActive]) => isActive).map(([key]) => key);
        if (activeDoorCounts.length > 0) {
            const activeLabels = activeDoorCounts.map(key => {
                const opt = doorCountOptions.find(o => o.key === key);
                return opt ? opt.label : '';
            });
            // Match against listing.door_count
            if (!activeLabels.includes(listing.door_count)) return false;
        }

        // Emission Badges (Umweltplakette)
        const activeEmissionBadges = Object.entries(emissionBadges).filter(([_, isActive]) => isActive).map(([key]) => key);
        if (activeEmissionBadges.length > 0) {
            const activeLabels = activeEmissionBadges.map(key => {
                const opt = emissionBadgeOptions.find(o => o.key === key);
                return opt ? opt.label : '';
            });
            // Match against listing.emission_sticker or listing.emission_badge
            if (!activeLabels.includes(listing.emission_sticker) && !activeLabels.includes(listing.emission_badge)) return false;
        }

        // Emission Classes (Schadstoffklasse)
        const activeEmissionClasses = Object.entries(emissionClasses).filter(([_, isActive]) => isActive).map(([key]) => key);
        if (activeEmissionClasses.length > 0) {
            const activeLabels = activeEmissionClasses.map(key => {
                const opt = emissionClassOptions.find(o => o.key === key);
                return opt ? opt.label : '';
            });
            // Match against listing.emission_class or listing.schadstoffklasse
            if (!activeLabels.includes(listing.emission_class) && !activeLabels.includes(listing.schadstoffklasse)) return false;
        }

        // Exterior Colors
        const activeExteriorColors = Object.entries(exteriorColors).filter(([_, isActive]) => isActive).map(([key]) => key);
        if (activeExteriorColors.length > 0) {
            const activeLabels = activeExteriorColors.map(key => {
                const opt = exteriorColorOptions.find(o => o.key === key);
                return opt ? opt.label : '';
            });
            // Match against listing.exterior_color
            if (!activeLabels.includes(listing.exterior_color)) return false;
        }

        // Interior Materials
        const activeInteriorMaterials = Object.entries(interiorMaterials).filter(([_, isActive]) => isActive).map(([key]) => key);
        if (activeInteriorMaterials.length > 0) {
            const activeLabels = activeInteriorMaterials.map(key => {
                const opt = interiorMaterialOptions.find(o => o.key === key);
                return opt ? opt.label : '';
            });
            // Match against listing.interior_material
            if (!activeLabels.includes(listing.interior_material)) return false;
        }

        // Features (Ausstattung) - check if listing has ALL selected features
        const activeFeatures = Object.entries(features).filter(([_, isActive]) => isActive).map(([key]) => key);
        if (activeFeatures.length > 0) {
            // Map keys to labels if listing stores labels, or keys if it stores keys.
            // Assuming listing.features is an array of strings matching the 'label' or 'key'.
            // Let's assume it stores labels for now matching other fields.
            // Actually, best to check both or standardize.
            // Let's map to labels as that's what we likely store for "Klimaanlage" etc.
            const requiredLabels = activeFeatures.map(key => {
                // Flatten feature options to find label
                const allFeatures = [...exteriorFeatures, ...interiorFeatures, ...safetyFeatures];
                const opt = allFeatures.find(o => o.key === key);
                return opt ? opt.label : key;
            });

            if (!listing.features || !Array.isArray(listing.features)) return false;

            // Check if listing features include *all* required labels
            const hasAllFeatures = requiredLabels.every(required => listing.features.includes(required));
            if (!hasAllFeatures) return false;
        }

        // Condition (Defekt / Nicht Defekt)
        if (damagedVehicle || undamagedVehicle) {
            // Assuming condition is stored as 'defekt', 'used', 'new', etc.
            // or specialized 'damaged' boolean?
            // Let's assume 'condition' column.
            const isDamaged = listing.condition === 'defekt';

            if (damagedVehicle && !isDamaged) return false; // Only want damaged, but this is not damaged
            if (undamagedVehicle && isDamaged) return false; // Only want undamaged, but this is damaged

            // Wait, usually these are checkboxes: "Beschädigte Fahrzeuge" [Allow/Show Only?]
            // If "Beschädigte Fahrzeuge" is checked, does it mean "Show ONLY damaged" or "Include damaged"?
            // Typically in filters:
            // "Nur beschädigte Fahrzeuge anzeigen" -> Show only damaged.
            // "Nur unbeschädigte Fahrzeuge anzeigen" -> Show only undamaged.
            // If both checked -> Show all?
            // If neither checked -> Show all (default)?

            // Logic in UI state:
            // damagedVehicle (bool), undamagedVehicle (bool).

            // Implementation:
            // If ONLY damagedVehicle is true -> Show ONLY damaged.
            // If ONLY undamagedVehicle is true -> Show ONLY undamaged.
            // If both true -> Show both (no filter).
            // If both false -> Show both (no filter).

            if (damagedVehicle && !undamagedVehicle && !isDamaged) return false;
            if (undamagedVehicle && !damagedVehicle && isDamaged) return false;
        }

        // Fuel Type
        const activeFuelTypes = Object.entries(fuelTypes).filter(([_, isActive]) => isActive).map(([key]) => key);
        if (activeFuelTypes.length > 0) {
            const activeLabels = activeFuelTypes.map(key => {
                const opt = fuelTypeOptions.find(o => o.key === key);
                return opt ? opt.label : '';
            });
            if (!activeLabels.includes(listing.fuel_type) && !activeLabels.includes(listing.kraftstoff)) return false;
        }

        return true;
    });

    return (
        <div className="min-h-screen bg-gray-50">
            <CategorySEO category="Otomobil, Bisiklet & Tekne" subCategory="Otomobiller" itemCount={statsListings.length} />
            <div className="max-w-[1400px] mx-auto px-4 py-6">
                <div className="flex gap-6">
                    {/* Brand Filter Sidebar */}
                    <aside className="w-96 flex-shrink-0 bg-white rounded-2xl shadow-lg p-6 h-fit border border-gray-100">
                        {/* Category Navigation */}
                        <div className="mb-6 pb-6 border-b border-gray-200">
                            <h3 className="font-bold text-gray-900 mb-3 text-base">{t.filters.categories}</h3>
                            <button
                                onClick={() => navigate('/Alle-Kategorien')}
                                className="w-full text-left px-3 py-2 rounded-lg text-sm transition-all bg-gray-100 text-gray-700 hover:bg-gray-200 flex items-center justify-between group"
                            >
                                <span>{t.filters.allCategories}</span>
                                <svg className="w-4 h-4 text-gray-400 group-hover:text-red-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>

                            <div className="space-y-2 mt-3">
                                <button
                                    onClick={() => navigate(getCategoryPath('Otomobil, Bisiklet & Tekne'))}
                                    className="text-left px-3 py-2 rounded-lg text-sm transition-all bg-gray-100 text-gray-700 hover:bg-gray-200 flex items-center justify-between group ml-4"
                                    style={{ width: 'calc(100% - 1rem)' }}
                                >
                                    <span>{getCategoryTranslation('Auto, Rad & Boot')}</span>
                                    <svg className="w-4 h-4 text-gray-400 group-hover:text-red-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                                <div
                                    className="text-left px-3 py-2 rounded-lg text-sm transition-all bg-red-600 text-white shadow-md flex items-center justify-between ml-8"
                                    style={{ width: 'calc(100% - 2rem)' }}
                                >
                                    <span>{getCategoryTranslation('Autos')} ({statsListings.length})</span>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            navigate(getCategoryPath('Otomobil, Bisiklet & Tekne'));
                                        }}
                                        className="text-white hover:text-red-200 transition-colors"
                                        title={t.common?.closeCategory || "Kategoriyi Kapat"}
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Aktuelle Suche */}
                        {(selectedBrands.length > 0 || selectedModels.length > 0) && (
                            <div className="mb-6 pb-6 border-b border-gray-200">
                                <h3 className="font-bold text-gray-900 mb-3 text-lg">{t.filters.currentSearch || 'Aktuelle Suche'}</h3>
                                <div className="flex flex-wrap gap-2">
                                    {/* Brands */}
                                    {selectedBrands.map(brand => (
                                        <div key={`summary-brand-${brand}`} className="flex items-center gap-2 bg-red-50 px-3 py-1.5 rounded-full border border-red-100">
                                            <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">{t.filters.brand}:</span>
                                            <span className="text-sm text-red-600 font-bold">{brand}</span>
                                            <button
                                                onClick={() => toggleBrand(brand)}
                                                className="ml-1 text-red-300 hover:text-red-500 transition-colors"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </div>
                                    ))}
                                    {/* Models */}
                                    {selectedModels.map(model => (
                                        <div key={`summary-model-${model}`} className="flex items-center gap-2 bg-red-50 px-3 py-1.5 rounded-full border border-red-100">
                                            <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">{t.filters.model}:</span>
                                            <span className="text-sm text-red-600 font-bold">{model}</span>
                                            <button
                                                onClick={() => toggleModel(model)}
                                                className="ml-1 text-red-300 hover:text-red-500 transition-colors"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Load More Button */}
                        {hasMore && !loading && filteredListings.length > 0 && (
                            <div className="mt-8 flex justify-center">
                                <button
                                    onClick={loadMore}
                                    className="bg-white border border-gray-300 text-gray-700 font-medium py-2 px-6 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
                                >
                                    {t.filters.loadMore || 'Mehr anzeigen'}
                                </button>
                            </div>
                        )}
                        {loading && page > 1 && (
                            <div className="mt-8 flex justify-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                            </div>
                        )}

                        {/* Autos Header */}
                        <div className="flex items-center justify-between mb-5 pb-4 border-b border-gray-200">
                            <h3 className="font-bold text-gray-900 text-lg">{getCategoryTranslation('Autos')}</h3>
                            <span className="text-gray-500 font-medium">{statsListings.length.toLocaleString('tr-TR')} {t.filters.ads}</span>
                        </div>

                        {/* Marke Filter */}
                        <h3 className="font-bold text-gray-900 mb-5 text-lg">{t.filters.brand}</h3>
                        <div className="space-y-1 max-h-96 overflow-y-auto pr-2 mb-6">
                            {sortedCarBrands.map((brand) => {
                                const brandCount = getBrandCount(brand.name);
                                const isBrandSelected = selectedBrands.includes(brand.name);
                                const isAnyModelSelected = isAnyModelOfBrandSelected(brand.name);

                                return (
                                    <div key={brand.name} className="brand-group">
                                        <div className={`flex items-center justify-between px-3 py-2 rounded-lg transition-colors group ${isBrandSelected ? 'bg-red-50' : 'hover:bg-gray-50'}`}>
                                            <label className="flex items-center flex-1 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={isBrandSelected}
                                                    onChange={() => toggleBrand(brand.name)}
                                                    className="w-4 h-4 text-red-500 border-gray-300 rounded cursor-pointer focus:ring-red-500"
                                                />
                                                <span className={`ml-3 text-sm transition-colors ${isBrandSelected ? 'text-red-600 font-bold' : 'text-gray-700 group-hover:text-red-500'}`}>
                                                    {brand.name}
                                                </span>
                                            </label>
                                            <div className="flex items-center gap-2">
                                                <span className={`text-xs ${isBrandSelected ? 'text-red-500' : 'text-gray-400'}`}>
                                                    ({brandCount.toLocaleString('tr-TR')})
                                                </span>
                                                {brand.subModels && (
                                                    <div className={`p-1 rounded hover:bg-red-100 transition-colors cursor-pointer ${isAnyModelSelected ? 'text-red-600' : 'text-gray-400'}`}>
                                                        <svg
                                                            className={`w-4 h-4 transition-transform ${isBrandSelected ? 'rotate-180' : ''}`}
                                                            fill="none"
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                        </svg>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Sub-models */}
                                        {brand.subModels && isBrandSelected && (
                                            <div className="ml-7 mt-2 mb-3 space-y-1 border-l-2 border-red-100 pl-4">
                                                {brand.subModels.map((model) => {
                                                    const modelCount = getModelCount(model.name);
                                                    const isModelSelected = selectedModels.includes(model.name);
                                                    return (
                                                        <label
                                                            key={model.name}
                                                            className={`flex items-center justify-between px-2 py-1.5 rounded cursor-pointer transition-colors group ${isModelSelected ? 'bg-red-50/50' : 'hover:bg-gray-50'}`}
                                                        >
                                                            <div className="flex items-center">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={isModelSelected}
                                                                    onChange={() => toggleModel(model.name)}
                                                                    className="w-3.5 h-3.5 text-red-500 border-gray-300 rounded cursor-pointer focus:ring-red-500"
                                                                />
                                                                <span className={`ml-3 text-sm transition-colors ${isModelSelected ? 'text-red-600 font-semibold' : 'text-gray-600 group-hover:text-red-500'}`}>
                                                                    {model.name}
                                                                </span>
                                                            </div>
                                                            <span className={`text-xs font-medium ${isModelSelected ? 'text-red-400' : 'text-gray-400'}`}>
                                                                ({modelCount.toLocaleString('tr-TR')})
                                                            </span>
                                                        </label>
                                                    )
                                                })}
                                            </div>
                                        )}
                                    </div>
                                )
                            })}
                        </div>

                        {/* Kilometerstand Filter */}
                        <div className="pt-6 border-t border-gray-200 mb-6">
                            <h4 className="font-bold text-gray-900 mb-4 text-base">{t.filters.mileage}</h4>
                            <div className="flex gap-2">
                                <div className="flex-1">
                                    <label className="block text-sm text-gray-600 mb-1">{t.filters.from} (km)</label>
                                    <input
                                        type="number"
                                        value={kmFrom}
                                        onChange={(e) => setKmFrom(e.target.value)}
                                        placeholder={`${t.common.example || 'örn.'} 0`}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none transition-all"
                                    />
                                </div>
                                <div className="flex-1">
                                    <label className="block text-sm text-gray-600 mb-1">{t.filters.to} (km)</label>
                                    <input
                                        type="number"
                                        value={kmTo}
                                        onChange={(e) => setKmTo(e.target.value)}
                                        placeholder={`${t.common.example || 'örn.'} 150000`}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none transition-all"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Fahrzeugzustand Filter */}
                        <div className="pt-6 border-t border-gray-200 mb-6">
                            <h4 className="font-bold text-gray-900 mb-4 text-base">{t.filters.condition}</h4>
                            <div className="space-y-3">
                                <label className="flex items-center justify-between cursor-pointer group">
                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={damagedVehicle}
                                            onChange={(e) => setDamagedVehicle(e.target.checked)}
                                            className="w-4 h-4 text-red-500 border-gray-300 rounded cursor-pointer"
                                        />
                                        <span className="ml-3 text-sm text-gray-700 group-hover:text-red-500 transition-colors">
                                            {t.autos?.damaged || 'Beschädigtes Fahrzeug'}
                                        </span>
                                    </div>
                                    <span className="text-xs text-gray-400">
                                        ({getFilterCount('condition', 'defekt').toLocaleString('tr-TR')})
                                    </span>
                                </label>
                                <label className="flex items-center justify-between cursor-pointer group">
                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={undamagedVehicle}
                                            onChange={(e) => setUndamagedVehicle(e.target.checked)}
                                            className="w-4 h-4 text-red-500 border-gray-300 rounded cursor-pointer"
                                        />
                                        <span className="ml-3 text-sm text-gray-700 group-hover:text-red-500 transition-colors">
                                            {t.autos?.undamaged || 'Unbeschädigtes Fahrzeug'}
                                        </span>
                                    </div>
                                    <span className="text-xs text-gray-400">
                                        ({getUndamagedCount().toLocaleString('tr-TR')})
                                    </span>
                                </label>
                            </div>
                        </div>

                        {/* Erstzulassungsjahr Filter */}
                        <div className="pt-6 border-t border-gray-200 mb-6">
                            <h4 className="font-bold text-gray-900 mb-4 text-base">{t.filters.year}</h4>
                            <div className="flex gap-2">
                                <div className="flex-1">
                                    <label className="block text-sm text-gray-600 mb-1">{t.filters.from}</label>
                                    <input
                                        type="number"
                                        value={yearFrom}
                                        onChange={(e) => setYearFrom(e.target.value)}
                                        placeholder={`${t.common.example || 'örn.'} 2015`}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none transition-all"
                                    />
                                </div>
                                <div className="flex-1">
                                    <label className="block text-sm text-gray-600 mb-1">{t.filters.to}</label>
                                    <input
                                        type="number"
                                        value={yearTo}
                                        onChange={(e) => setYearTo(e.target.value)}
                                        placeholder={`${t.common.example || 'örn.'} 2024`}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none transition-all"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Kraftstoffart Filter */}
                        <div className="pt-6 border-t border-gray-200">
                            <h4 className="font-bold text-gray-900 mb-4 text-base">{t.filters.fuel}</h4>
                            <div className="space-y-2">
                                {fuelTypeOptions.map((fuel) => (
                                    <label key={fuel.key} className="flex items-center justify-between cursor-pointer group">
                                        <div className="flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={fuelTypes[fuel.key]}
                                                onChange={() => toggleFuelType(fuel.key)}
                                                className="w-4 h-4 text-red-500 border-gray-300 rounded cursor-pointer"
                                            />
                                            <span className="ml-3 text-sm text-gray-700 group-hover:text-red-500 transition-colors">
                                                {fuel.displayLabel || fuel.label}
                                            </span>
                                        </div>
                                        <span className="text-xs text-gray-400">
                                            ({fuel.count.toLocaleString('tr-TR')})
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Leistung Filter */}
                        <div className="pt-6 border-t border-gray-200 mb-6">
                            <h4 className="font-bold text-gray-900 mb-4 text-base">{t.filters.power} ({t.filters.bg || 'BG'})</h4>
                            <div className="flex gap-2">
                                <div className="flex-1">
                                    <label className="block text-sm text-gray-600 mb-1">{t.filters.from} ({t.filters.bg || 'BG'})</label>
                                    <input
                                        type="number"
                                        value={powerFrom}
                                        onChange={(e) => setPowerFrom(e.target.value)}
                                        placeholder={`${t.common.example || 'örn.'} 50`}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none transition-all"
                                    />
                                </div>
                                <div className="flex-1">
                                    <label className="block text-sm text-gray-600 mb-1">{t.filters.to} ({t.filters.bg || 'BG'})</label>
                                    <input
                                        type="number"
                                        value={powerTo}
                                        onChange={(e) => setPowerTo(e.target.value)}
                                        placeholder={`${t.common.example || 'örn.'} 300`}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none transition-all"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Getriebe Filter */}
                        <div className="pt-6 border-t border-gray-200 mb-6">
                            <h4 className="font-bold text-gray-900 mb-4 text-base">{t.filters.transmission}</h4>
                            <div className="space-y-2">
                                <label className="flex items-center justify-between cursor-pointer group">
                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={automaticTransmission}
                                            onChange={(e) => setAutomaticTransmission(e.target.checked)}
                                            className="w-4 h-4 text-red-500 border-gray-300 rounded cursor-pointer"
                                        />
                                        <span className="ml-3 text-sm text-gray-700 group-hover:text-red-500 transition-colors">
                                            {t.autos?.transmission?.automatic || 'Automatik'}
                                        </span>
                                    </div>
                                    <span className="text-xs text-gray-400">
                                        ({getFilterCount('getriebe', 'Automatik').toLocaleString('tr-TR')})
                                    </span>
                                </label>
                                <label className="flex items-center justify-between cursor-pointer group">
                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={manualTransmission}
                                            onChange={(e) => setManualTransmission(e.target.checked)}
                                            className="w-4 h-4 text-red-500 border-gray-300 rounded cursor-pointer"
                                        />
                                        <span className="ml-3 text-sm text-gray-700 group-hover:text-red-500 transition-colors">
                                            {t.autos?.transmission?.manual || 'Manuell'}
                                        </span>
                                    </div>
                                    <span className="text-xs text-gray-400">
                                        ({getFilterCount('getriebe', 'Manuell').toLocaleString('tr-TR')})
                                    </span>
                                </label>
                            </div>
                        </div>

                        {/* Fahrzeugtyp Filter */}
                        <div className="pt-6 border-t border-gray-200 mb-6">
                            <h4 className="font-bold text-gray-900 mb-4 text-base">{t.filters.vehicleType}</h4>
                            <div className="space-y-2">
                                {vehicleTypeOptions.map((vehicle) => (
                                    <label key={vehicle.key} className="flex items-center justify-between cursor-pointer group">
                                        <div className="flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={vehicleTypes[vehicle.key]}
                                                onChange={() => toggleVehicleType(vehicle.key)}
                                                className="w-4 h-4 text-red-500 border-gray-300 rounded cursor-pointer"
                                            />
                                            <span className="ml-3 text-sm text-gray-700 group-hover:text-red-500 transition-colors">
                                                {vehicle.displayLabel || vehicle.label}
                                            </span>
                                        </div>
                                        <span className="text-xs text-gray-400">
                                            ({vehicle.count.toLocaleString('tr-TR')})
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Anzahl Türen Filter */}
                        <div className="pt-6 border-t border-gray-200 mb-6">
                            <h4 className="font-bold text-gray-900 mb-4 text-base">{t.filters.doorCount}</h4>
                            <div className="space-y-2">
                                {doorCountOptions.map((door) => (
                                    <label key={door.key} className="flex items-center justify-between cursor-pointer group">
                                        <div className="flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={doorCounts[door.key]}
                                                onChange={() => toggleDoorCount(door.key)}
                                                className="w-4 h-4 text-red-500 border-gray-300 rounded cursor-pointer"
                                            />
                                            <span className="ml-3 text-sm text-gray-700 group-hover:text-red-500 transition-colors">
                                                {door.displayLabel || door.label}
                                            </span>
                                        </div>
                                        <span className="text-xs text-gray-400">
                                            ({door.count.toLocaleString('tr-TR')})
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* HU mind. gültig Filter */}
                        <div className="pt-6 border-t border-gray-200 mb-6">
                            <h4 className="font-bold text-gray-900 mb-4 text-base">{t.filters.inspection || 'HU mind. gültig'}</h4>
                            <input
                                type="month"
                                value={huDate}
                                onChange={(e) => setHuDate(e.target.value)}
                                placeholder="AA/YYYY"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none transition-all"
                            />
                        </div>

                        {/* Umweltplakette Filter */}
                        <div className="pt-6 border-t border-gray-200 mb-6">
                            <h4 className="font-bold text-gray-900 mb-4 text-base">{t.filters.emissionBadge}</h4>
                            <div className="space-y-2">
                                {emissionBadgeOptions.map((badge) => (
                                    <label key={badge.key} className="flex items-center justify-between cursor-pointer group">
                                        <div className="flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={emissionBadges[badge.key]}
                                                onChange={() => toggleEmissionBadge(badge.key)}
                                                className="w-4 h-4 text-red-500 border-gray-300 rounded cursor-pointer"
                                            />
                                            <span className="ml-3 text-sm text-gray-700 group-hover:text-red-500 transition-colors">
                                                {badge.displayLabel || badge.label}
                                            </span>
                                        </div>
                                        <span className="text-xs text-gray-400">
                                            ({badge.count.toLocaleString('tr-TR')})
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Schadstoffklasse Filter */}
                        <div className="pt-6 border-t border-gray-200 mb-6">
                            <h4 className="font-bold text-gray-900 mb-4 text-base">{t.filters.emissionClass}</h4>
                            <div className="space-y-2">
                                {emissionClassOptions.map((euroClass) => (
                                    <label key={euroClass.key} className="flex items-center justify-between cursor-pointer group">
                                        <div className="flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={emissionClasses[euroClass.key]}
                                                onChange={() => toggleEmissionClass(euroClass.key)}
                                                className="w-4 h-4 text-red-500 border-gray-300 rounded cursor-pointer"
                                            />
                                            <span className="ml-3 text-sm text-gray-700 group-hover:text-red-500 transition-colors">
                                                {euroClass.displayLabel || euroClass.label}
                                            </span>
                                        </div>
                                        <span className="text-xs text-gray-400">
                                            ({euroClass.count.toLocaleString('tr-TR')})
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Material Innenausstattung Filter */}
                        <div className="pt-6 border-t border-gray-200 mb-6">
                            <h4 className="font-bold text-gray-900 mb-4 text-base">{t.filters.interiorMaterial}</h4>
                            <div className="space-y-2">
                                {interiorMaterialOptions.map((material) => (
                                    <label key={material.key} className="flex items-center justify-between cursor-pointer group">
                                        <div className="flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={interiorMaterials[material.key]}
                                                onChange={() => toggleInteriorMaterial(material.key)}
                                                className="w-4 h-4 text-red-500 border-gray-300 rounded cursor-pointer"
                                            />
                                            <span className="ml-3 text-sm text-gray-700 group-hover:text-red-500 transition-colors">
                                                {material.displayLabel || material.label}
                                            </span>
                                        </div>
                                        <span className="text-xs text-gray-400">
                                            ({material.count.toLocaleString('tr-TR')})
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Außenfarbe Filter */}
                        <div className="pt-6 border-t border-gray-200 mb-6">
                            <h4 className="font-bold text-gray-900 mb-4 text-base">{t.filters.exteriorColor}</h4>
                            <div className="space-y-2">
                                {exteriorColorOptions.map((color) => (
                                    <label key={color.key} className="flex items-center justify-between cursor-pointer group">
                                        <div className="flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={exteriorColors[color.key]}
                                                onChange={() => toggleExteriorColor(color.key)}
                                                className="w-4 h-4 text-red-500 border-gray-300 rounded cursor-pointer"
                                            />
                                            <span className="ml-3 text-sm text-gray-700 group-hover:text-red-500 transition-colors">
                                                {color.displayLabel || color.label}
                                            </span>
                                        </div>
                                        <span className="text-xs text-gray-400">
                                            ({color.count.toLocaleString('tr-TR')})
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Preis Filter */}
                        <div className="pt-6 border-t border-gray-200 mb-6">
                            <h4 className="font-bold text-gray-900 mb-4 text-base">{t.filters.price}</h4>
                            <div className="flex items-center gap-2">
                                <div className="flex gap-2 flex-1">
                                    <div className="flex-1">
                                        <label className="block text-sm text-gray-600 mb-1">{t.filters.from} (₺)</label>
                                        <input
                                            type="number"
                                            value={inputPriceFrom}
                                            onChange={(e) => setInputPriceFrom(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && handleApplyPrice()}
                                            placeholder={`${t.common.example || 'örn.'} 5000`}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none transition-all focus:ring-2 focus:ring-red-100 focus:border-red-500"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <label className="block text-sm text-gray-600 mb-1">{t.filters.to} (₺)</label>
                                        <input
                                            type="number"
                                            value={inputPriceTo}
                                            onChange={(e) => setInputPriceTo(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && handleApplyPrice()}
                                            placeholder={`${t.common.example || 'örn.'} 50000`}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none transition-all focus:ring-2 focus:ring-red-100 focus:border-red-500"
                                        />
                                    </div>
                                </div>
                                <div className="pt-6">
                                    <button
                                        onClick={handleApplyPrice}
                                        className="bg-gray-100 hover:bg-red-50 text-gray-600 hover:text-red-600 p-2 rounded-lg transition-colors h-[42px] w-[42px] flex items-center justify-center border border-gray-200"
                                        title={t.filters.apply || "Uygula"}
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="pt-6 border-t border-gray-200 mb-6">
                            <h4 className="font-bold text-gray-900 mb-4 text-base">{t.autos?.exteriorFeatures || 'Dış Donanım'}</h4>
                            <div className="space-y-2">
                                {exteriorFeatures.map((feature) => (
                                    <label key={feature.key} className="flex items-center justify-between cursor-pointer group">
                                        <div className="flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={features[feature.key]}
                                                onChange={() => toggleFeature(feature.key)}
                                                className="w-4 h-4 text-red-500 border-gray-300 rounded cursor-pointer"
                                            />
                                            <span className="ml-3 text-sm text-gray-700 group-hover:text-red-500 transition-colors">
                                                {feature.displayLabel || feature.label}
                                            </span>
                                        </div>
                                        <span className="text-xs text-gray-400">
                                            ({feature.count.toLocaleString('tr-TR')})
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="pt-6 border-t border-gray-200 mb-6">
                            <h4 className="font-bold text-gray-900 mb-4 text-base">{t.autos?.interiorFeatures || 'İç Donanım'}</h4>
                            <div className="space-y-2">
                                {interiorFeatures.map((feature) => (
                                    <label key={feature.key} className="flex items-center justify-between cursor-pointer group">
                                        <div className="flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={features[feature.key]}
                                                onChange={() => toggleFeature(feature.key)}
                                                className="w-4 h-4 text-red-500 border-gray-300 rounded cursor-pointer"
                                            />
                                            <span className="ml-3 text-sm text-gray-700 group-hover:text-red-500 transition-colors">
                                                {feature.displayLabel || feature.label}
                                            </span>
                                        </div>
                                        <span className="text-xs text-gray-400">
                                            ({feature.count.toLocaleString('tr-TR')})
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="pt-6 border-t border-gray-200 mb-6">
                            <h4 className="font-bold text-gray-900 mb-4 text-base">{t.autos?.safetyFeatures || 'Güvenlik'}</h4>
                            <div className="space-y-2">
                                {safetyFeatures.map((feature) => (
                                    <label key={feature.key} className="flex items-center justify-between cursor-pointer group">
                                        <div className="flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={features[feature.key]}
                                                onChange={() => toggleFeature(feature.key)}
                                                className="w-4 h-4 text-red-500 border-gray-300 rounded cursor-pointer"
                                            />
                                            <span className="ml-3 text-sm text-gray-700 group-hover:text-red-500 transition-colors">
                                                {feature.displayLabel || feature.label}
                                            </span>
                                        </div>
                                        <span className="text-xs text-gray-400">
                                            ({feature.count.toLocaleString('tr-TR')})
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Angebotstyp Filter */}
                        <div className="pt-6 border-t border-gray-200 mb-6">
                            <h4 className="font-bold text-gray-900 mb-4 text-base">{t.filters.offerType}</h4>
                            <div className="space-y-2">
                                {offerTypeOptions.map((type) => (
                                    <label key={type.key} className="flex items-center justify-between cursor-pointer group">
                                        <div className="flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={offerType[type.key]}
                                                onChange={() => toggleOfferType(type.key)}
                                                className="w-4 h-4 text-red-500 border-gray-300 rounded cursor-pointer"
                                            />
                                            <span className="ml-3 text-sm text-gray-700 group-hover:text-red-500 transition-colors">
                                                {type.displayLabel || type.label}
                                            </span>
                                        </div>
                                        <span className="text-xs text-gray-400">
                                            ({type.count.toLocaleString('tr-TR')})
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Anbieter Filter */}
                        <div className="pt-6 border-t border-gray-200 mb-6">
                            <h4 className="font-bold text-gray-900 mb-4 text-base">{t.filters.sellerType}</h4>
                            <div className="space-y-2">
                                {sellerTypeOptions.map((type) => (
                                    <label key={type.key} className="flex items-center justify-between cursor-pointer group">
                                        <div className="flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={sellerType[type.key]}
                                                onChange={() => toggleSellerType(type.key)}
                                                className="w-4 h-4 text-red-500 border-gray-300 rounded cursor-pointer"
                                            />
                                            <span className="ml-3 text-sm text-gray-700 group-hover:text-red-500 transition-colors">
                                                {type.displayLabel || type.label}
                                            </span>
                                        </div>
                                        <span className="text-xs text-gray-400">
                                            ({type.count.toLocaleString('tr-TR')})
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Ort Filter */}
                        <div className="pt-6 border-t border-gray-200">
                            <h4 className="font-bold text-gray-900 mb-4 text-base">{t.filters.location}</h4>
                            <div className="space-y-2">
                                {locationOptions.map((location) => (
                                    <label key={location.key} className="flex items-center justify-between cursor-pointer group">
                                        <div className="flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={locations[location.key]}
                                                onChange={() => toggleLocation(location.key)}
                                                className="w-4 h-4 text-red-500 border-gray-300 rounded cursor-pointer"
                                            />
                                            <span className="ml-3 text-sm text-gray-700 group-hover:text-red-500 transition-colors">
                                                {location.displayLabel || location.label}
                                            </span>
                                        </div>
                                        <span className="text-xs text-gray-400">
                                            ({location.count.toLocaleString('tr-TR')})
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <div className="flex-1">
                        {/* BANNER OPTION 1 - Modern Gradient with Car Silhouette */}
                        {/* <div className="bg-gradient-to-r from-red-600 to-red-800 rounded-2xl shadow-xl p-8 mb-6 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-32 -mt-32"></div>
                            <div className="absolute bottom-0 right-0 w-48 h-48 bg-white opacity-5 rounded-full -mr-24 -mb-24"></div>
                            <div className="relative z-10 flex items-center justify-between">
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
                                        </svg>
                                        <h1 className="text-4xl font-bold text-white">AUTOS</h1>
                                    </div>
                                    <p className="text-white text-lg opacity-90">
                                        {t.autos?.findDreamCar || 'Hayalinizdeki Arabayı Bulun'} - {statsListings.length.toLocaleString('tr-TR')} {t.autos?.ads || 'İlanlar'}
                                    </p>
                                </div>
                                <div className="hidden md:block">
                                    <svg className="w-32 h-32 text-white opacity-20" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
                                    </svg>
                                </div>
                            </div>
                        </div> */}

                        {/* BANNER OPTION 2 - Sleek Dark with Accent Line */}
                        {/* <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl shadow-xl p-8 mb-6 relative overflow-hidden border-l-8 border-red-600">
                            <div className="absolute top-0 right-0 w-96 h-96 bg-red-600 opacity-5 rounded-full -mr-48 -mt-48"></div>
                            <div className="relative z-10">
                                <div className="flex items-center gap-4 mb-3">
                                    <div className="w-16 h-16 bg-red-600 rounded-xl flex items-center justify-center">
                                        <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
                                        </svg>
                                    </div>
                                    <div>
                                        <h1 className="text-4xl font-bold text-white mb-1">AUTOS</h1>
                                        <p className="text-gray-300 text-lg">
                                            {t.autos?.findDreamCar || 'Hayalinizdeki Arabayı Bulun'} - {statsListings.length.toLocaleString('tr-TR')} {t.autos?.ads || 'İlanlar'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div> */}

                        {/* BANNER OPTION 3 - Clean White with Red Accent */}
                        {/* <div className="bg-white rounded-2xl shadow-xl p-8 mb-6 relative overflow-hidden border-2 border-gray-100">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-red-50 rounded-full -mr-32 -mt-32"></div>
                            <div className="relative z-10 flex items-center justify-between">
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center">
                                            <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
                                            </svg>
                                        </div>
                                        <h1 className="text-4xl font-bold text-gray-900">AUTOS</h1>
                                    </div>
                                    <p className="text-gray-600 text-lg">
                                        {t.autos?.findDreamCar || 'Hayalinizdeki Arabayı Bulun'} - {statsListings.length.toLocaleString('tr-TR')} {t.autos?.ads || 'İlanlar'}
                                    </p>
                                </div>
                                <div className="hidden md:block">
                                    <svg className="w-28 h-28 text-red-600 opacity-10" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
                                    </svg>
                                </div>
                            </div>
                        </div> */}

                        {/* BANNER OPTION 4 - Vibrant Red with Pattern */}
                        <div className="bg-gradient-to-r from-red-500 to-rose-600 rounded-2xl shadow-xl p-8 mb-6 relative overflow-hidden">
                            <div className="absolute inset-0 opacity-10">
                                <div className="absolute top-0 left-0 w-full h-full" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,.1) 35px, rgba(255,255,255,.1) 70px)' }}>
                                </div>
                            </div>
                            <div className="relative z-10">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                                            <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h1 className="text-4xl font-bold text-white mb-1">{getCategoryTranslation('Autos').toUpperCase()}</h1>
                                            <p className="text-white text-lg opacity-90">
                                                {t.autos?.findDreamCar || 'Hayalinizdeki Arabayı Bulun'} - {statsListings.length.toLocaleString('tr-TR')} {t.autos?.ads || 'İlanlar'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="hidden lg:flex items-center gap-6 text-white">
                                        <div className="text-center">
                                            <div className="text-3xl font-bold">{statsListings.length}</div>
                                            <div className="text-sm opacity-80">{t.autos?.ads || 'İlanlar'}</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-3xl font-bold">
                                                {statsListings.reduce((acc, l) => {
                                                    const brand = l.marke || l.car_brand;
                                                    if (brand && !acc.includes(brand)) acc.push(brand);
                                                    return acc;
                                                }, []).length}
                                            </div>
                                            <div className="text-sm opacity-80">{t.autos?.brands || 'Markalar'}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>



                        <div style={{ maxWidth: '960px' }}>
                            <CategoryGallery
                                listings={filteredListings.filter(l => l.is_top)}
                                toggleFavorite={() => { }}
                                isFavorite={() => false}
                            />
                        </div>

                        <div className="bg-white rounded-lg shadow-sm p-6">


                            {/* Listings */}
                            <div className="mt-8">
                                <h3 className="text-xl font-bold text-gray-900 mb-4">
                                    {t.autos?.currentAds || 'Güncel İlanlar'} ({filteredListings.length})
                                </h3>

                                {loading ? (
                                    <div className="text-center py-12">
                                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
                                        <p className="mt-4 text-gray-600">{t.autos?.loadingAds || 'İlanlar yükleniyor...'}</p>
                                    </div>
                                ) : filteredListings.length === 0 ? (
                                    <div className="text-center py-12 bg-gray-50 rounded-lg">
                                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        <p className="mt-4 text-gray-600">{t.autos?.noAdsFound || 'İlan bulunamadı'}</p>
                                        <p className="text-sm text-gray-500 mt-2">{t.autos?.adjustFilters || 'Filtreleri ayarlamayı deneyin'}</p>
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        {filteredListings.map((listing) => (
                                            <div
                                                key={listing.id}
                                                className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                                                onClick={() => navigate(`/product/${listing.id}`)}
                                            >
                                                <div className="flex flex-col md:flex-row">
                                                    {/* Image Section - Narrower */}
                                                    <div className="md:w-56 h-40 md:h-48 relative group flex-shrink-0 bg-gray-100">
                                                        <LazyImage
                                                            src={listing.images && listing.images.length > 0 ? listing.images[0] : 'https://via.placeholder.com/300x200?text=No+Image'}
                                                            alt={listing.title}
                                                            className="w-full h-full object-cover transition-transform duration-300"
                                                        />
                                                        {listing?.reserved_by && (
                                                            <div className="absolute top-3 left-3 bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg">
                                                                {t.autos?.reserved || 'RESERVIERT'}
                                                            </div>
                                                        )}
                                                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                toggleFavorite(listing.id);
                                                            }}
                                                            className="absolute top-2 right-2 w-7 h-7 bg-white/90 backdrop-blur-sm rounded-full shadow hover:bg-white hover:scale-110 transition-all duration-200 z-30 flex items-center justify-center"
                                                        >
                                                            {favorites.includes(listing.id) ? (
                                                                <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                                                                    <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                                                </svg>
                                                            ) : (
                                                                <svg className="w-4 h-4 text-gray-400 group-hover:text-red-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                                                </svg>
                                                            )}
                                                        </button>
                                                        {listing.priceType === 'giveaway' && (
                                                            <div className="absolute top-3 left-3 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg">
                                                                {t.autos?.free || 'GRATIS'}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="flex-1 p-4 flex flex-col justify-between">
                                                        <div>
                                                            <div className="mb-2">
                                                                <h4 className="text-lg font-bold text-gray-900 line-clamp-1 mb-1">
                                                                    {listing.title}
                                                                </h4>
                                                            </div>
                                                            <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-3">
                                                                <div className="flex items-center gap-1.5 text-sm">
                                                                    <div className="w-7 h-7 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                                                        <svg className="w-3.5 h-3.5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                                                                            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                                                                        </svg>
                                                                    </div>
                                                                    <div>
                                                                        <div className="text-sm text-gray-700 uppercase font-black">{t.filters.year || 'Yıl'}</div>
                                                                        <div className="font-semibold text-gray-900 text-xs">{listing.erstzulassung || '-'}</div>
                                                                    </div>
                                                                </div>
                                                                <div className="flex items-center gap-1.5 text-sm">
                                                                    <div className="w-7 h-7 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                                                        <svg className="w-3.5 h-3.5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                                                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                                                        </svg>
                                                                    </div>
                                                                    <div>
                                                                        <div className="text-sm text-gray-700 uppercase font-black">KM</div>
                                                                        <div className="font-semibold text-gray-900 text-xs">{listing.kilometerstand ? listing.kilometerstand.toLocaleString('tr-TR') : '-'}</div>
                                                                    </div>
                                                                </div>
                                                                <div className="flex items-center gap-1.5 text-sm">
                                                                    <div className="w-7 h-7 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                                                        <svg className="w-3.5 h-3.5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                                                                            <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                                                                        </svg>
                                                                    </div>
                                                                    <div>
                                                                        <div className="text-sm text-gray-700 uppercase font-black">{t.filters.fuel || 'Kraftstoff'}</div>
                                                                        <div className="font-semibold text-gray-900 text-xs truncate max-w-[60px]">{getTranslatedFuel(listing.kraftstoff)}</div>
                                                                    </div>
                                                                </div>
                                                                <div className="flex items-center gap-1.5 text-sm">
                                                                    <div className="w-7 h-7 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                                                        <svg className="w-3.5 h-3.5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                                                                            <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                                                                        </svg>
                                                                    </div>
                                                                    <div>
                                                                        <div className="text-sm text-gray-700 uppercase font-black">{t.filters.bg || 'BG'}</div>
                                                                        <div className="font-semibold text-gray-900 text-xs">{listing.leistung || '-'}</div>
                                                                    </div>
                                                                </div>
                                                                <div className="flex items-center gap-1.5 text-sm">
                                                                    <div className="w-7 h-7 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                                                        <svg className="w-3.5 h-3.5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                                                                            <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                                                                        </svg>
                                                                    </div>
                                                                    <div>
                                                                        <div className="text-sm text-gray-700 uppercase font-black">{t.filters.transmission || 'Getriebe'}</div>
                                                                        <div className="font-semibold text-gray-900 text-xs truncate max-w-[70px]">{getTranslatedTransmission(listing.getriebe)}</div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="pt-3">
                                                            <div className="text-xl font-bold text-gray-900 mb-2">
                                                                {listing.price === 0 ? (t.autos?.giveaway || 'Ücretsiz') : listing.priceType === 'giveaway' ? (t.autos?.giveaway || 'Ücretsiz') : `${listing.price?.toLocaleString('tr-TR')} ₺`}
                                                            </div>
                                                            <div className="flex items-center justify-between text-sm text-gray-500 border-t border-gray-100 pt-2">
                                                                {listing.city && (
                                                                    <div className="flex items-center">
                                                                        <svg className="w-3.5 h-3.5 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                                            <circle cx="12" cy="12" r="8" />
                                                                            <circle cx="12" cy="12" r="2.5" fill="currentColor" stroke="none" />
                                                                            <line x1="12" y1="2" x2="12" y2="4" />
                                                                            <line x1="12" y1="20" x2="12" y2="22" />
                                                                            <line x1="2" y1="12" x2="4" y2="12" />
                                                                            <line x1="20" y1="12" x2="22" y2="12" />
                                                                        </svg>
                                                                        <span className="text-sm">{listing.city}</span>
                                                                    </div>
                                                                )}
                                                                <div className="flex items-center ml-auto">
                                                                    <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                                    </svg>
                                                                    <span className="text-sm">{new Date(listing.created_at).toLocaleDateString('tr-TR')}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AutosPage;
