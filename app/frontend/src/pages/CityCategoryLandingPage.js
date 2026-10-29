import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { SEO } from '../SEO';
import { Breadcrumb, HorizontalListingCard, ListingCard } from '../components';
import LoadingSpinner from '../components/LoadingSpinner';
import { 
  TURKISH_CITIES,
  slugToCity, 
  cityToSlug, 
  slugToCategory, 
  categoryToSlug, 
  getCityCategorySEO, 
  getCityVariants,
  resolveCityAndDistrict,
  TOP_SEO_CITIES, 
  TOP_SEO_CATEGORIES 
} from '../utils/cityUtils';

import { turkeyDistricts } from '../data/turkey_districts';
import { turkeyRegions } from '../data/turkey_regions';
import { categories as allCategories } from '../data/categories';
import { getTurkishCities, getCategoryTranslation } from '../translations';

// Türkiye plaka kodları eşleştirmesi (01 - 81)
const PLATE_CODES = {
  'Adana': '01', 'Adıyaman': '02', 'Afyonkarahisar': '03', 'Ağrı': '04', 'Amasya': '05',
  'Ankara': '06', 'Antalya': '07', 'Artvin': '08', 'Aydın': '09', 'Balıkesir': '10',
  'Bilecik': '11', 'Bingöl': '12', 'Bitlis': '13', 'Bolu': '14', 'Burdur': '15',
  'Bursa': '16', 'Çanakkale': '17', 'Çankırı': '18', 'Çorum': '19', 'Denizli': '20',
  'Diyarbakır': '21', 'Edirne': '22', 'Elazığ': '23', 'Erzincan': '24', 'Erzurum': '25',
  'Eskişehir': '26', 'Gaziantep': '27', 'Giresun': '28', 'Gümüşhane': '29', 'Hakkari': '30',
  'Hatay': '31', 'Isparta': '32', 'Mersin': '33', 'İstanbul': '34', 'İzmir': '35',
  'Kars': '36', 'Kastamonu': '37', 'Kayseri': '38', 'Kırklareli': '39', 'Kırşehir': '40',
  'Kocaeli': '41', 'Konya': '42', 'Kütahya': '43', 'Malatya': '44', 'Manisa': '45',
  'Kahramanmaraş': '46', 'Mardin': '47', 'Muğla': '48', 'Muş': '49', 'Nevşehir': '50',
  'Niğde': '51', 'Ordu': '52', 'Rize': '53', 'Sakarya': '54', 'Samsun': '55',
  'Siirt': '56', 'Sinop': '57', 'Sivas': '58', 'Tekirdağ': '59', 'Tokat': '60',
  'Trabzon': '61', 'Tunceli': '62', 'Şanlıurfa': '63', 'Uşak': '64', 'Van': '65',
  'Yozgat': '66', 'Zonguldak': '67', 'Aksaray': '68', 'Bayburt': '69', 'Karaman': '70',
  'Kırıkkale': '71', 'Batman': '72', 'Şırnak': '73', 'Bartın': '74', 'Ardahan': '75',
  'Iğdır': '76', 'Yalova': '77', 'Karabük': '78', 'Kilis': '79', 'Osmaniye': '80',
  'Düzce': '81'
};

export const CityCategoryLandingPage = ({ toggleFavorite, isFavorite }) => {
  const { citySlug, categorySlug, subCategorySlug } = useParams();
  const navigate = useNavigate();

  // Resolve city and optional district from citySlug (e.g., 'izmir-karsiyaka', 'izmir-bornova', 'istanbul-kadikoy')
  // Automatically fixes typos and spelling errors to official Turkish names
  const { city: parsedCity, district: parsedDistrict, canonicalSlug } = useMemo(() => {
    return resolveCityAndDistrict(citySlug);
  }, [citySlug]);

  // If user entered a non-canonical or misspelled URL (e.g. /sehir/izmir-karşıyaka or /sehir/izmir-karsiyakaa),
  // smoothly normalize the browser URL to the canonical format
  useEffect(() => {
    if (canonicalSlug && citySlug && citySlug.toLowerCase() !== canonicalSlug.toLowerCase()) {
      const target = `/sehir/${canonicalSlug}${categorySlug ? `/${categorySlug}` : ''}${subCategorySlug ? `/${subCategorySlug}` : ''}`;
      navigate(target, { replace: true });
    }
  }, [canonicalSlug, citySlug, categorySlug, subCategorySlug, navigate]);

  const city = parsedCity;
  const category = useMemo(() => slugToCategory(categorySlug), [categorySlug]);
  const subCategory = subCategorySlug ? decodeURIComponent(subCategorySlug).replace(/-/g, ' ') : null;

  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('newest');
  const [minPriceInput, setMinPriceInput] = useState('');
  const [maxPriceInput, setMaxPriceInput] = useState('');
  const [appliedMinPrice, setAppliedMinPrice] = useState('');
  const [appliedMaxPrice, setAppliedMaxPrice] = useState('');
  const [condition, setCondition] = useState('all');
  const [selectedDistrict, setSelectedDistrict] = useState(parsedDistrict || '');
  const [availableDistricts, setAvailableDistricts] = useState([]);
  const [categoryCounts, setCategoryCounts] = useState({});
  const [districtCounts, setDistrictCounts] = useState({});
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState('horizontal'); // 'horizontal' or 'grid'

  // Debounced auto-apply for price inputs
  useEffect(() => {
    const timer = setTimeout(() => {
      setAppliedMinPrice(minPriceInput);
      setAppliedMaxPrice(maxPriceInput);
    }, 500);
    return () => clearTimeout(timer);
  }, [minPriceInput, maxPriceInput]);

  const handleApplyPrice = () => {
    setAppliedMinPrice(minPriceInput);
    setAppliedMaxPrice(maxPriceInput);
  };

  const handleClearPrice = () => {
    setMinPriceInput('');
    setMaxPriceInput('');
    setAppliedMinPrice('');
    setAppliedMaxPrice('');
  };

  // Sync selectedDistrict when URL changes
  useEffect(() => {
    setSelectedDistrict(parsedDistrict || '');
  }, [parsedDistrict]);

  const seoData = useMemo(() => {
    return getCityCategorySEO(city || citySlug, category, subCategory, selectedDistrict || parsedDistrict);
  }, [city, citySlug, category, subCategory, selectedDistrict, parsedDistrict]);

  // Fetch category & district counts for this city (and district if selected)
  useEffect(() => {
    const fetchCountsAndDistricts = async () => {
      const activeCity = city || citySlug;
      if (!activeCity) return;
      try {
        // Use simplified OR filter: just ilike on city column with a few key variants
        // This avoids Supabase OR filter complexity issues with many variants
        const canonicalCityName = city || slugToCity(citySlug) || citySlug;
        let query = supabase.from('listings').select('category, district').eq('status', 'active');

        // Build a simple but effective OR filter covering Turkish İ variants
        const cityLower = canonicalCityName.toLowerCase();
        const cityUpper = canonicalCityName.toUpperCase();
        // Handle Turkish İ/i specifically
        const cityTurkish = canonicalCityName; // e.g. "İzmir"
        const cityAscii = canonicalCityName
          .replace(/İ/g, 'I').replace(/ı/g, 'i')
          .replace(/Ğ/g, 'G').replace(/ğ/g, 'g')
          .replace(/Ş/g, 'S').replace(/ş/g, 's')
          .replace(/Ö/g, 'O').replace(/ö/g, 'o')
          .replace(/Ü/g, 'U').replace(/ü/g, 'u')
          .replace(/Ç/g, 'C').replace(/ç/g, 'c');
        
        const filterVariants = [...new Set([cityTurkish, cityLower, cityUpper, cityAscii, cityAscii.toLowerCase()])];
        const orParts = filterVariants.flatMap(v => [`city.ilike.%${v}%`, `federal_state.ilike.%${v}%`]);
        query = query.or(orParts.join(','));

        const { data, error } = await query;
        if (error) throw error;

        const targetDist = (selectedDistrict || parsedDistrict || '').toLowerCase().trim();

        // Build district deduplication map: slug → canonical Turkish name
        const distSlugMap = {}; // slug → best (Turkish) name
        // First add official districts
        (turkeyDistricts[activeCity] || []).forEach(d => {
          const slug = cityToSlug(d);
          distSlugMap[slug] = d;
        });
        // Then add from data (prefer Turkish chars: keep whichever has more special chars)
        (data || []).forEach(item => {
          if (item.district && item.district.trim()) {
            const d = item.district.trim();
            const slug = cityToSlug(d);
            if (!distSlugMap[slug]) {
              distSlugMap[slug] = d;
            } else {
              // Keep the one with more Turkish characters (more specific)
              const current = distSlugMap[slug];
              const currentTurkishCount = (current.match(/[İıĞğŞşÖöÜüÇç]/g) || []).length;
              const newTurkishCount = (d.match(/[İıĞğŞşÖöÜüÇç]/g) || []).length;
              if (newTurkishCount > currentTurkishCount) distSlugMap[slug] = d;
            }
          }
        });

        // Build district count map (grouped by slug)
        const distCountMap = {}; // slug → count
        (data || []).forEach(item => {
          if (item.district && item.district.trim()) {
            const slug = cityToSlug(item.district.trim());
            distCountMap[slug] = (distCountMap[slug] || 0) + 1;
          }
        });

        // Convert to district name → count
        const namedDistCounts = {};
        Object.entries(distCountMap).forEach(([slug, count]) => {
          const name = distSlugMap[slug] || slug;
          namedDistCounts[name] = (namedDistCounts[name] || 0) + count;
        });
        setDistrictCounts(namedDistCounts);

        const rawDistList = Object.values(distSlugMap).sort((a, b) => a.localeCompare(b, 'tr-TR'));
        setAvailableDistricts(rawDistList);

        // If parsedDistrict or selectedDistrict is an ASCII slug (e.g. "Sehitlik"),
        // resolve it to the exact Turkish district name (e.g. "Şehitlik") from availableDistricts
        let resolvedDist = selectedDistrict || parsedDistrict || '';
        if (targetDist) {
          const exactMatch = rawDistList.find(d => {
            const dSlug = cityToSlug(d);
            return dSlug === targetDist || dSlug === cityToSlug(targetDist);
          });
          if (exactMatch) {
            resolvedDist = exactMatch;
            if (exactMatch !== selectedDistrict) {
              setSelectedDistrict(exactMatch);
            }
          }
        }

        // Recalculate category counts with resolved district or targetDist
        const finalCounts = {};
        const activeDistFilter = (resolvedDist || '').toLowerCase().trim();
        (data || []).forEach(item => {
          if (item.category) {
            if (!activeDistFilter) {
              finalCounts[item.category] = (finalCounts[item.category] || 0) + 1;
            } else {
              const itemDist = (item.district || '').toLowerCase().trim();
              const itemDistSlug = cityToSlug(item.district || '');
              const activeSlug = cityToSlug(activeDistFilter);
              if (
                itemDist.includes(activeDistFilter) ||
                activeDistFilter.includes(itemDist) ||
                itemDistSlug === activeSlug
              ) {
                finalCounts[item.category] = (finalCounts[item.category] || 0) + 1;
              }
            }
          }
        });
        setCategoryCounts(finalCounts);
      } catch (err) {
        console.error('Error fetching city counts & districts:', err);
      }
    };
    fetchCountsAndDistricts();
  }, [city, citySlug, selectedDistrict, parsedDistrict]);

  useEffect(() => {
    let isMounted = true;
    const fetchListings = async () => {
      setLoading(true);
      try {
        let query = supabase
          .from('listings')
          .select('*')
          .eq('status', 'active');

        // Filter by city with Turkish character variants (simplified for Supabase OR filter compatibility)
        const activeCity = city || citySlug;
        if (activeCity) {
          const canonicalCityName = city || slugToCity(citySlug) || citySlug;
          const cityAscii = canonicalCityName
            .replace(/İ/g, 'I').replace(/ı/g, 'i')
            .replace(/Ğ/g, 'G').replace(/ğ/g, 'g')
            .replace(/Ş/g, 'S').replace(/ş/g, 's')
            .replace(/Ö/g, 'O').replace(/ö/g, 'o')
            .replace(/Ü/g, 'U').replace(/ü/g, 'u')
            .replace(/Ç/g, 'C').replace(/ç/g, 'c');
          const filterVariants = [...new Set([canonicalCityName, canonicalCityName.toLowerCase(), canonicalCityName.toUpperCase(), cityAscii, cityAscii.toLowerCase()])];
          const orParts = filterVariants.flatMap(v => [`city.ilike.%${v}%`, `federal_state.ilike.%${v}%`]);
          query = query.or(orParts.join(','));
        }

        // Filter by category
        if (category) {
          query = query.eq('category', category);
        }

        // Filter by subcategory
        if (subCategory) {
          query = query.ilike('sub_category', `%${subCategory}%`);
        }

        // Filter by district (handling both Turkish characters and ASCII variants like Karşıyaka / Karsiyaka)
        if (selectedDistrict) {
          const distVariants = getCityVariants(selectedDistrict);
          if (distVariants.length > 0) {
            const distOrFilter = distVariants.map(v => `district.ilike.%${v}%`).join(',');
            query = query.or(distOrFilter);
          } else {
            query = query.ilike('district', `%${selectedDistrict}%`);
          }
        }

        // Filter by price range
        if (appliedMinPrice && !isNaN(Number(appliedMinPrice)) && Number(appliedMinPrice) > 0) {
          query = query.gte('price', Number(appliedMinPrice));
        }
        if (appliedMaxPrice && !isNaN(Number(appliedMaxPrice)) && Number(appliedMaxPrice) > 0) {
          query = query.lte('price', Number(appliedMaxPrice));
        }

        // Filter by condition
        if (condition && condition !== 'all') {
          query = query.eq('condition', condition);
        }

        // Apply sorting
        if (sortBy === 'price_asc' || sortBy === 'price-asc') {
          query = query.order('price', { ascending: true, nullsFirst: false });
        } else if (sortBy === 'price_desc' || sortBy === 'price-desc') {
          query = query.order('price', { ascending: false, nullsLast: true });
        } else {
          query = query.order('created_at', { ascending: false });
        }

        query = query.limit(200);

        const { data, error } = await query;
        if (error) throw error;

        if (isMounted) {
          setListings(data || []);
        }
      } catch (err) {
        console.error('Error fetching city/category listings:', err);
        if (isMounted) setListings([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchListings();
    return () => {
      isMounted = false;
    };
  }, [city, category, subCategory, sortBy, appliedMinPrice, appliedMaxPrice, condition, selectedDistrict]);

  // Resolve Plate Code and Geographic Region
  const plateCode = useMemo(() => {
    return PLATE_CODES[city] || '';
  }, [city]);

  const regionName = useMemo(() => {
    if (!city) return '';
    const reg = turkeyRegions.find(r => r.cities && r.cities.includes(city));
    return reg ? reg.name : '';
  }, [city]);

  // Build Breadcrumbs with both { label, path } and { name, url } for full compatibility
  const effectiveSlug = canonicalSlug || citySlug;
  const breadcrumbs = useMemo(() => {
    const list = [
      { label: 'Ana Sayfa', path: '/', name: 'Ana Sayfa', url: '/' },
      { label: 'Şehirler', path: '/sehirler', name: 'Şehirler', url: '/sehirler' },
      { label: city || citySlug, path: `/sehir/${cityToSlug(city || citySlug)}`, name: city || citySlug, url: `/sehir/${cityToSlug(city || citySlug)}` }
    ];

    if (parsedDistrict) {
      list.push({
        label: parsedDistrict,
        path: `/sehir/${effectiveSlug}`,
        name: parsedDistrict,
        url: `/sehir/${effectiveSlug}`
      });
    }
    if (category) {
      list.push({
        label: category,
        path: `/sehir/${effectiveSlug}/${categorySlug}`,
        name: category,
        url: `/sehir/${effectiveSlug}/${categorySlug}`
      });
    }
    if (subCategory) {
      list.push({
        label: subCategory,
        path: `/sehir/${effectiveSlug}/${categorySlug}/${subCategorySlug}`,
        name: subCategory,
        url: `/sehir/${effectiveSlug}/${categorySlug}/${subCategorySlug}`
      });
    }
    return list;
  }, [city, citySlug, effectiveSlug, parsedDistrict, category, categorySlug, subCategory, subCategorySlug]);

  const currentPath = `/sehir/${effectiveSlug}${categorySlug ? `/${categorySlug}` : ''}${subCategorySlug ? `/${subCategorySlug}` : ''}`;

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 transition-colors pb-16">
      <SEO
        title={seoData.title}
        description={seoData.description}
        url={currentPath}
        canonical={currentPath}
        breadcrumbs={breadcrumbs}
      />

      {/* Top Breadcrumb Bar */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 pt-5 pb-2">
        <Breadcrumb items={breadcrumbs} />
      </div>

      {/* Editorial Hero Header */}
      <header className="max-w-[1400px] mx-auto px-4 sm:px-6 pt-2 pb-6 sm:pb-8 border-b border-neutral-100 dark:border-neutral-800">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="max-w-3xl">
            {/* Meta Tags: Plate, Region, District, Category */}
            <div className="flex flex-wrap items-center gap-2 mb-3">
              {plateCode && (
                <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 font-bold text-xs tracking-tight shadow-xs">
                  {plateCode}
                </span>
              )}
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-100 dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 text-xs font-medium border border-neutral-200/60 dark:border-neutral-800">
                <span className="w-1.5 h-1.5 rounded-full bg-red-600"></span>
                {parsedDistrict ? `${city} • ${parsedDistrict}` : city}
              </span>
              {regionName && (
                <span className="px-2.5 py-1 rounded-full bg-neutral-50 dark:bg-neutral-900/60 text-neutral-500 dark:text-neutral-400 text-xs font-normal border border-neutral-200/50 dark:border-neutral-800">
                  {regionName}
                </span>
              )}
              {category && (
                <span className="px-2.5 py-1 rounded-full bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 text-xs font-medium border border-red-200/50 dark:border-red-900/40">
                  {category}
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-neutral-950 dark:text-white leading-tight">
              {seoData.heading}
            </h1>
            <p className="mt-2 text-sm sm:text-base text-neutral-500 dark:text-neutral-400 max-w-2xl leading-relaxed font-normal">
              {seoData.subheading}
            </p>
          </div>

          {/* Action Button & Quick Metrics */}
          <div className="flex flex-wrap items-center gap-4 shrink-0 pt-2 lg:pt-0">
            <div className="hidden sm:flex items-center gap-5 pr-4 border-r border-neutral-200 dark:border-neutral-800">
              <div>
                <p className="text-xl sm:text-2xl font-semibold text-neutral-950 dark:text-white leading-none">
                  {loading ? '—' : listings.length}
                </p>
                <p className="text-[11px] text-neutral-400 dark:text-neutral-500 uppercase tracking-wider font-medium mt-1">
                  Aktif İlan
                </p>
              </div>
              {availableDistricts.length > 0 && (
                <div>
                  <p className="text-xl sm:text-2xl font-semibold text-neutral-950 dark:text-white leading-none">
                    {availableDistricts.length}
                  </p>
                  <p className="text-[11px] text-neutral-400 dark:text-neutral-500 uppercase tracking-wider font-medium mt-1">
                    İlçe
                  </p>
                </div>
              )}
            </div>

            <Link
              to="/add-listing"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-neutral-950 hover:bg-neutral-800 text-white dark:bg-white dark:hover:bg-neutral-100 dark:text-neutral-950 text-xs font-semibold tracking-wide transition-all shadow-xs"
            >
              <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
              </svg>
              <span>{city ? `${city}'de İlan Ver` : 'Ücretsiz İlan Ver'}</span>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 pt-5">
        {/* Horizontal Category Navigation */}
        <div className="mb-6 pb-2">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-[11px] font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">
              {city} Kategorileri
            </span>
            {categorySlug && (
              <Link
                to={`/sehir/${citySlug}`}
                className="text-xs font-medium text-red-600 hover:text-red-700 transition-colors"
              >
                Filtreyi Kaldır
              </Link>
            )}
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar">
            <Link
              to={`/sehir/${citySlug}`}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                !categorySlug
                  ? 'bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 shadow-xs'
                  : 'bg-neutral-50 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 border border-neutral-200/70 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700'
              }`}
            >
              Tüm İlanlar
            </Link>
            {TOP_SEO_CATEGORIES.map((cat) => {
              const active = categorySlug === cat.slug;
              return (
                <Link
                  key={cat.slug}
                  to={`/sehir/${citySlug}/${cat.slug}`}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
                    active
                      ? 'bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 shadow-xs'
                      : 'bg-neutral-50 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 border border-neutral-200/70 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700'
                  }`}
                >
                  <span>{cat.name}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Toolbar: Counter, Mobile Filter Toggle & View Mode */}
        <div className="flex items-center justify-between gap-3 mb-6 pb-3 border-b border-neutral-100 dark:border-neutral-800">
          <div className="flex items-center gap-3">
            {/* Mobile Filter Toggle Button */}
            <button
              onClick={() => setShowFilters(true)}
              className="xl:hidden flex items-center gap-2 px-3.5 py-1.5 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl text-xs font-semibold text-neutral-800 dark:text-neutral-200 shadow-xs"
            >
              <svg className="w-3.5 h-3.5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              <span>Filtreler</span>
              {(appliedMinPrice || appliedMaxPrice || condition !== 'all' || selectedDistrict) && (
                <span className="w-1.5 h-1.5 rounded-full bg-red-600"></span>
              )}
            </button>

            <div className="text-xs text-neutral-500 dark:text-neutral-400">
              {loading ? (
                'İlanlar listeleniyor...'
              ) : (
                <span>
                  <strong className="text-neutral-900 dark:text-white font-semibold">{listings.length}</strong> ilan listeleniyor
                  {selectedDistrict && <span className="ml-1 text-neutral-400">({selectedDistrict} içi)</span>}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5">
              <span className="hidden sm:inline text-xs text-neutral-400 dark:text-neutral-500">Sırala:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-xs font-medium bg-neutral-50 dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-lg px-2.5 py-1.5 text-neutral-800 dark:text-neutral-200 focus:outline-none focus:ring-1 focus:ring-neutral-400"
              >
                <option value="newest">En Yeni İlanlar</option>
                <option value="price_asc">Fiyat: Düşükten Yükseğe</option>
                <option value="price_desc">Fiyat: Yüksekten Düşüğe</option>
              </select>
            </div>

            {/* View Mode Toggle */}
            <div className="hidden sm:flex items-center border border-neutral-200/80 dark:border-neutral-800 rounded-lg overflow-hidden bg-neutral-50 dark:bg-neutral-900 p-0.5">
              <button
                type="button"
                onClick={() => setViewMode('horizontal')}
                className={`p-1.5 rounded-md transition-all ${viewMode === 'horizontal' ? 'bg-white dark:bg-neutral-800 text-neutral-950 dark:text-white shadow-xs font-medium' : 'text-neutral-400 hover:text-neutral-600'}`}
                title="Liste Görünümü"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white dark:bg-neutral-800 text-neutral-950 dark:text-white shadow-xs font-medium' : 'text-neutral-400 hover:text-neutral-600'}`}
                title="Izgara Görünümü"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Layout: Sidebar + Listings */}
        <div className="flex flex-col xl:flex-row gap-8 items-start">
          {/* Sidebar Filters */}
          <aside
            className={`
              fixed inset-0 z-[1002] xl:relative xl:inset-auto xl:z-0 xl:w-[280px] xl:min-w-[280px] xl:block
              ${showFilters ? 'block' : 'hidden xl:block'}
            `}
          >
            {/* Backdrop for mobile */}
            <div
              className="fixed inset-0 bg-black/50 backdrop-blur-xs xl:hidden"
              onClick={() => setShowFilters(false)}
            />

            <div
              className={`
                relative w-[85vw] sm:w-[340px] xl:w-full h-full xl:h-auto bg-white dark:bg-neutral-900 xl:rounded-2xl shadow-xl xl:shadow-xs p-5
                overflow-y-auto sticky top-0 xl:top-6 border border-neutral-200/80 dark:border-neutral-800
                ${showFilters ? 'animate-in slide-in-from-left duration-250' : ''}
              `}
            >
              {/* Mobile Header */}
              <div className="flex items-center justify-between xl:hidden mb-5 pb-3 border-b dark:border-neutral-800">
                <h3 className="font-semibold text-neutral-900 dark:text-white text-base">Filtreler</h3>
                <button
                  onClick={() => setShowFilters(false)}
                  className="p-1.5 text-neutral-400 hover:text-neutral-700 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Header on Desktop */}
              <div className="hidden xl:flex items-center justify-between mb-4">
                <h3 className="font-semibold text-neutral-950 dark:text-white text-sm">Filtreler</h3>
                {(appliedMinPrice || appliedMaxPrice || condition !== 'all' || selectedDistrict || categorySlug) && (
                  <button
                    onClick={() => {
                      handleClearPrice();
                      setCondition('all');
                      setSelectedDistrict('');
                      if (categorySlug) {
                        navigate(`/sehir/${citySlug}`);
                      }
                    }}
                    className="text-xs text-red-600 hover:text-red-700 font-medium cursor-pointer"
                  >
                    Temizle
                  </button>
                )}
              </div>

              {/* Categories */}
              <div className="mb-5 pb-5 border-b border-neutral-100 dark:border-neutral-800">
                <label className="block text-[11px] font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider mb-2">
                  Kategoriler
                </label>
                <div className="space-y-0.5">
                  <Link
                    to={`/sehir/${citySlug}`}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition-colors flex items-center justify-between ${
                      !categorySlug
                        ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-950 dark:text-white font-semibold'
                        : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800/60'
                    }`}
                  >
                    <span>Tüm Kategoriler</span>
                  </Link>
                  {allCategories
                    .filter((c) => c.name !== 'Tüm Kategoriler')
                    .map((cat) => {
                      const cSlug = categoryToSlug(cat.name);
                      const isSelected = categorySlug === cSlug;
                      const count = categoryCounts[cat.name] || 0;
                      return (
                        <div key={cat.name}>
                          <Link
                            to={`/sehir/${citySlug}/${cSlug}`}
                            className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition-colors flex items-center justify-between group ${
                              isSelected
                                ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-950 dark:text-white font-semibold'
                                : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800/60'
                            }`}
                          >
                            <span className="truncate">{getCategoryTranslation(cat.name)}</span>
                            {count > 0 && (
                              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-neutral-200 dark:bg-neutral-700 text-neutral-900 dark:text-white' : 'text-neutral-400'}`}>
                                {count}
                              </span>
                            )}
                          </Link>

                          {/* Subcategories if category selected */}
                          {isSelected && cat.subcategories && cat.subcategories.length > 0 && (
                            <div className="ml-3 pl-2 border-l border-neutral-200 dark:border-neutral-800 my-1 space-y-0.5">
                              {cat.subcategories.map((subItem) => {
                                const subName = typeof subItem === 'string' ? subItem : (subItem?.name || '');
                                if (!subName) return null;
                                const sSlug = encodeURIComponent(subName.replace(/\s+/g, '-').toLowerCase());
                                const isSubSelected = subCategorySlug === sSlug;
                                return (
                                  <Link
                                    key={subName}
                                    to={`/sehir/${citySlug}/${cSlug}/${sSlug}`}
                                    className={`block px-2 py-1 rounded text-[11px] transition-colors ${
                                      isSubSelected
                                        ? 'bg-neutral-100 dark:bg-neutral-800 text-red-600 dark:text-red-400 font-semibold'
                                        : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                                    }`}
                                  >
                                    {getCategoryTranslation(subName)}
                                  </Link>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                </div>
              </div>

              {/* District Filter (İlçe) */}
              {availableDistricts.length > 0 && (
                <div className="mb-5 pb-5 border-b border-neutral-100 dark:border-neutral-800">
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-[11px] font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">
                      İlçe ({availableDistricts.length})
                    </label>
                    {selectedDistrict && (
                      <button
                        onClick={() => {
                          setSelectedDistrict('');
                          const baseCitySlug = cityToSlug(city || citySlug);
                          navigate(categorySlug ? `/sehir/${baseCitySlug}/${categorySlug}` : `/sehir/${baseCitySlug}`);
                        }}
                        className="text-[11px] text-red-600 hover:text-red-700 font-medium cursor-pointer"
                      >
                        Tümü
                      </button>
                    )}
                  </div>
                  <div className="space-y-0.5 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
                    <label className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800/50 cursor-pointer text-xs">
                      <input
                        type="radio"
                        name="district"
                        checked={!selectedDistrict}
                        onChange={() => {
                          setSelectedDistrict('');
                          const baseCitySlug = cityToSlug(city || citySlug);
                          navigate(categorySlug ? `/sehir/${baseCitySlug}/${categorySlug}` : `/sehir/${baseCitySlug}`);
                        }}
                        className="text-neutral-950 dark:text-white focus:ring-0"
                      />
                      <span className={!selectedDistrict ? 'font-semibold text-neutral-950 dark:text-white' : 'text-neutral-600 dark:text-neutral-400'}>
                        Tüm İlçeler
                      </span>
                    </label>
                    {availableDistricts.map((dist) => {
                      const isDistChecked = (selectedDistrict || '').toLowerCase() === dist.toLowerCase();
                      const distSlug = cityToSlug(dist);
                      const baseCitySlug = cityToSlug(city || citySlug);
                      const targetDistUrl = `/sehir/${baseCitySlug}-${distSlug}${categorySlug ? `/${categorySlug}` : ''}`;
                      const distCount = districtCounts[dist] || 0;

                      return (
                        <label key={dist} className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800/50 cursor-pointer text-xs">
                          <input
                            type="radio"
                            name="district"
                            checked={isDistChecked}
                            onChange={() => {
                              setSelectedDistrict(dist);
                              navigate(targetDistUrl);
                            }}
                            className="text-neutral-950 dark:text-white focus:ring-0"
                          />
                          <span className={isDistChecked ? 'font-semibold text-neutral-950 dark:text-white flex-1' : 'text-neutral-600 dark:text-neutral-400 flex-1'}>
                            {dist}
                          </span>
                          {distCount > 0 && (
                            <span className="text-[10px] text-neutral-400 dark:text-neutral-500 ml-auto">{distCount}</span>
                          )}
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Price Range Filter */}
              <div className="mb-5 pb-5 border-b border-neutral-100 dark:border-neutral-800">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-[11px] font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">
                    Fiyat Aralığı (TL)
                  </label>
                  {(minPriceInput || maxPriceInput) && (
                    <button
                      type="button"
                      onClick={handleClearPrice}
                      className="text-[11px] text-red-600 hover:text-red-700 font-medium cursor-pointer"
                    >
                      Temizle
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <input
                      type="number"
                      min="0"
                      placeholder="Min TL"
                      value={minPriceInput}
                      onChange={(e) => setMinPriceInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleApplyPrice()}
                      className="w-full bg-neutral-50 dark:bg-neutral-800 border border-neutral-200/80 dark:border-neutral-700 rounded-lg px-2.5 py-1.5 text-xs text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-neutral-400"
                    />
                  </div>
                  <div>
                    <input
                      type="number"
                      min="0"
                      placeholder="Max TL"
                      value={maxPriceInput}
                      onChange={(e) => setMaxPriceInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleApplyPrice()}
                      className="w-full bg-neutral-50 dark:bg-neutral-800 border border-neutral-200/80 dark:border-neutral-700 rounded-lg px-2.5 py-1.5 text-xs text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-neutral-400"
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleApplyPrice}
                  className="mt-2 w-full py-1.5 px-3 bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 rounded-lg text-xs font-medium hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors cursor-pointer"
                >
                  Uygula
                </button>
              </div>

              {/* Condition Filter (Durum) */}
              <div className="mb-5">
                <label className="block text-[11px] font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider mb-2">
                  Ürün Durumu
                </label>
                <div className="space-y-1 text-xs">
                  {[
                    { val: 'all', label: 'Tümü' },
                    { val: 'Yeni', label: 'Sıfır / Yeni' },
                    { val: 'Yeni gibi', label: 'Yeni Gibi' },
                    { val: 'Çok iyi', label: 'Çok İyi' },
                    { val: 'İyi', label: 'İyi Durumda' },
                    { val: 'Kullanılmış', label: 'Kullanılmış' }
                  ].map((cond) => (
                    <label key={cond.val} className="flex items-center gap-2 px-1 py-1 rounded cursor-pointer hover:text-neutral-950 dark:hover:text-white">
                      <input
                        type="radio"
                        name="condition"
                        checked={condition === cond.val}
                        onChange={() => setCondition(cond.val)}
                        className="text-neutral-950 dark:text-white focus:ring-0"
                      />
                      <span className={condition === cond.val ? 'font-semibold text-neutral-950 dark:text-white' : 'text-neutral-600 dark:text-neutral-400'}>
                        {cond.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Reset Filters */}
              <button
                type="button"
                onClick={() => {
                  handleClearPrice();
                  setCondition('all');
                  setSelectedDistrict('');
                  if (categorySlug) {
                    navigate(`/sehir/${citySlug}`);
                  }
                  setShowFilters(false);
                }}
                className="w-full py-2 px-3 rounded-lg border border-neutral-200 dark:border-neutral-700 text-xs font-medium text-neutral-600 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
              >
                Filtreleri Sıfırla
              </button>
            </div>
          </aside>

          {/* Listings List / Grid (Flex-1) */}
          <div className="flex-1 w-full min-w-0">
            {loading ? (
              <div className="py-20 flex flex-col items-center justify-center">
                <LoadingSpinner size="large" />
                <p className="mt-3 text-xs text-neutral-400">{city} ilanları taranıyor...</p>
              </div>
            ) : listings.length > 0 ? (
              viewMode === 'horizontal' ? (
                <div className="space-y-3">
                  {listings.map((listing) => (
                    <HorizontalListingCard
                      key={listing.id}
                      listing={listing}
                      toggleFavorite={toggleFavorite}
                      isFavorite={isFavorite ? isFavorite(listing.id) : false}
                    />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {listings.map((listing) => (
                    <ListingCard
                      key={listing.id}
                      listing={listing}
                      toggleFavorite={toggleFavorite}
                      isFavorite={isFavorite ? isFavorite(listing.id) : false}
                    />
                  ))}
                </div>
              )
            ) : (
              /* Refined Empty State */
              <div className="bg-white dark:bg-neutral-900 rounded-2xl p-8 sm:p-12 text-center border border-neutral-200/80 dark:border-neutral-800 shadow-xs">
                <div className="w-12 h-12 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-neutral-950 dark:text-white">
                  {selectedDistrict ? `${city} ${selectedDistrict}` : city} {category ? `ve ${category}` : ''} Kategorisinde Henüz İlan Yok
                </h3>
                <p className="text-neutral-500 dark:text-neutral-400 text-xs sm:text-sm max-w-md mx-auto mt-1.5 mb-6 leading-relaxed">
                  {selectedDistrict
                    ? `${selectedDistrict} ilçesinde bu filtreye uygun ilan bulunamadı. Dilerseniz tüm ${city} ilanlarına göz atabilir veya ilk ilanı siz verebilirsiniz.`
                    : `${city} genelinde bu kriterde henüz ilan bulunmuyor. İlk ilanı siz vererek potansiyel alıcılara hemen ulaşın.`}
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <Link
                    to="/add-listing"
                    className="bg-neutral-950 hover:bg-neutral-800 text-white dark:bg-white dark:hover:bg-neutral-100 dark:text-neutral-950 font-semibold px-5 py-2.5 rounded-xl transition-colors text-xs"
                  >
                    + İlk İlanı Sen Ver
                  </Link>
                  {selectedDistrict && (
                    <Link
                      to={categorySlug ? `/sehir/${cityToSlug(city)}/${categorySlug}` : `/sehir/${cityToSlug(city)}`}
                      className="bg-neutral-50 dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 font-medium px-4 py-2.5 rounded-xl text-xs border border-neutral-200/80 dark:border-neutral-700"
                    >
                      Tüm {city} İlanlarına Bak
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      handleClearPrice();
                      setCondition('all');
                      setSelectedDistrict('');
                      const baseCitySlug = cityToSlug(city || citySlug);
                      navigate(categorySlug ? `/sehir/${baseCitySlug}/${categorySlug}` : `/sehir/${baseCitySlug}`);
                    }}
                    className="text-xs text-neutral-500 hover:text-neutral-800 dark:hover:text-white px-3 py-2 cursor-pointer"
                  >
                    Filtreleri Temizle
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Editorial SEO Information & Guide Section */}
        <div className="mt-12 bg-white dark:bg-neutral-900 rounded-2xl p-6 sm:p-8 border border-neutral-200/80 dark:border-neutral-800">
          <div className="max-w-2xl">
            <span className="text-[11px] font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider block mb-1">
              Rehber
            </span>
            <h2 className="text-lg sm:text-xl font-semibold text-neutral-950 dark:text-white mb-2">
              {city} {category || 'İkinci El & Sıfır'} İlan Vitrini
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
              {seoData.introText}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 mt-6 border-t border-neutral-100 dark:border-neutral-800">
            <div className="space-y-1">
              <h4 className="font-semibold text-neutral-900 dark:text-white text-xs flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-red-600"></span>
                Ücretsiz İlan Verme
              </h4>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed font-normal">
                {city} ve çevre ilçelerdeki alıcılara komisyonsuz, hızlı ve güvenli şekilde ulaşın.
              </p>
            </div>
            <div className="space-y-1">
              <h4 className="font-semibold text-neutral-900 dark:text-white text-xs flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-red-600"></span>
                Yerel İletişim
              </h4>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed font-normal">
                Uygulama içi güvenli sohbet ile satıcılarla doğrudan iletişime geçin, yerinde teslim alın.
              </p>
            </div>
            <div className="space-y-1">
              <h4 className="font-semibold text-neutral-900 dark:text-white text-xs flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-red-600"></span>
                Yüksek Görünürlük
              </h4>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed font-normal">
                İlanlarınız hem Google arama motorlarında hem de sosyal vitrinlerde optimize edilmiş olarak listelenir.
              </p>
            </div>
          </div>
        </div>

        {/* City Districts Internal Links */}
        {city && (turkeyDistricts[city] || []).length > 0 && (
          <div className="mt-8 bg-white dark:bg-neutral-900 rounded-2xl p-6 border border-neutral-200/80 dark:border-neutral-800">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-semibold text-neutral-950 dark:text-white uppercase tracking-wider">
                {city} İlçeleri ({turkeyDistricts[city].length} İlçe)
              </h3>
              <span className="text-[11px] text-neutral-400">
                Doğrudan İlçe Vitrinine Git
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {(turkeyDistricts[city] || []).map((dist) => {
                const isCurrent = (selectedDistrict || parsedDistrict || '').toLowerCase() === dist.toLowerCase();
                const distSlug = cityToSlug(dist);
                const baseCitySlug = cityToSlug(city);
                const targetUrl = `/sehir/${baseCitySlug}-${distSlug}${categorySlug ? `/${categorySlug}` : ''}`;
                return (
                  <Link
                    key={dist}
                    to={targetUrl}
                    className={`text-xs px-2.5 py-1 rounded-lg border transition-all ${
                      isCurrent
                        ? 'bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 border-neutral-950 dark:border-white font-semibold'
                        : 'bg-neutral-50 dark:bg-neutral-800/40 text-neutral-600 dark:text-neutral-300 border-neutral-200/60 dark:border-neutral-800 hover:border-neutral-400'
                    }`}
                  >
                    {dist}
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Other Major Cities */}
        <div className="mt-8 bg-neutral-50 dark:bg-neutral-900/40 rounded-2xl p-6 border border-neutral-200/60 dark:border-neutral-800">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-semibold text-neutral-800 dark:text-neutral-300 uppercase tracking-wider">
              Diğer Şehirlerdeki İlanlar
            </h3>
            <Link to="/sehirler" className="text-xs font-medium text-red-600 hover:text-red-700">
              Tüm 81 İli Gör ›
            </Link>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {TOP_SEO_CITIES.map((c) => {
              const slug = cityToSlug(c);
              const isCurrent = slug === citySlug;
              const targetUrl = categorySlug ? `/sehir/${slug}/${categorySlug}` : `/sehir/${slug}`;
              return (
                <Link
                  key={slug}
                  to={targetUrl}
                  className={`text-xs px-2.5 py-1 rounded-lg border transition-colors ${
                    isCurrent
                      ? 'bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 border-neutral-950 font-semibold'
                      : 'bg-white dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 border-neutral-200/60 dark:border-neutral-700 hover:border-neutral-400'
                  }`}
                >
                  {c}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CityCategoryLandingPage;
