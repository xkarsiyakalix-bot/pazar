import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { SEO } from '../SEO';
import { Breadcrumb, HorizontalListingCard, ListingCard } from '../components';
import LoadingSpinner from '../components/LoadingSpinner';
import { turkeyRegions, findRegionBySlug } from '../data/turkey_regions';
import { slugToCategory, cityToSlug, TOP_SEO_CATEGORIES } from '../utils/cityUtils';
import { categories as allCategories } from '../data/categories';
import { getCategoryTranslation } from '../translations';

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

export const RegionLandingPage = ({ toggleFavorite, isFavorite }) => {
  const { regionSlug, categorySlug } = useParams();
  const navigate = useNavigate();

  const region = useMemo(() => {
    return findRegionBySlug(regionSlug);
  }, [regionSlug]);

  const category = useMemo(() => slugToCategory(categorySlug), [categorySlug]);

  // Normalize URL if user accessed misspelled or alternate slug (e.g. /egebölgesi -> /bolge/ege-bolgesi)
  useEffect(() => {
    if (region && regionSlug && regionSlug.toLowerCase() !== region.slug) {
      const target = `/bolge/${region.slug}${categorySlug ? `/${categorySlug}` : ''}`;
      navigate(target, { replace: true });
    }
  }, [region, regionSlug, categorySlug, navigate]);

  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCity, setSelectedCity] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [minPriceInput, setMinPriceInput] = useState('');
  const [maxPriceInput, setMaxPriceInput] = useState('');
  const [appliedMinPrice, setAppliedMinPrice] = useState('');
  const [appliedMaxPrice, setAppliedMaxPrice] = useState('');
  const [condition, setCondition] = useState('all');
  const [categoryCounts, setCategoryCounts] = useState({});
  const [cityCounts, setCityCounts] = useState({});
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState('horizontal');

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

  // Breadcrumbs
  const breadcrumbs = useMemo(() => {
    const list = [
      { label: 'Ana Sayfa', path: '/', name: 'Ana Sayfa', url: '/' },
      { label: 'Bölgeler', path: '/sehirler', name: 'Bölgeler', url: '/sehirler' },
      { 
        label: region ? region.name : (regionSlug || 'Bölge'), 
        path: region ? `/bolge/${region.slug}` : `/bolge/${regionSlug}`,
        name: region ? region.name : (regionSlug || 'Bölge'), 
        url: region ? `/bolge/${region.slug}` : `/bolge/${regionSlug}` 
      }
    ];
    if (category && region) {
      list.push({
        label: category,
        path: `/bolge/${region.slug}/${categorySlug}`,
        name: category,
        url: `/bolge/${region.slug}/${categorySlug}`
      });
    }
    return list;
  }, [region, regionSlug, category, categorySlug]);

  // Fetch counts
  useEffect(() => {
    if (!region) return;
    const fetchCounts = async () => {
      try {
        const cityFilter = region.cities.map(c => `city.ilike.%${c}%`).join(',');
        const orFilter = `region.ilike.%${region.shortName}%,region.ilike.%${region.name}%,${cityFilter}`;
        const { data, error } = await supabase
          .from('listings')
          .select('city, category')
          .eq('status', 'active')
          .or(orFilter);

        if (error) throw error;

        const cCounts = {};
        const catCounts = {};

        (data || []).forEach(item => {
          if (item.city) {
            // Match with region's cities
            const matchCity = region.cities.find(c => item.city.toLowerCase().includes(c.toLowerCase()));
            if (matchCity) {
              cCounts[matchCity] = (cCounts[matchCity] || 0) + 1;
            }
          }
          if (item.category) {
            if (!selectedCity) {
              catCounts[item.category] = (catCounts[item.category] || 0) + 1;
            } else if (item.city && item.city.toLowerCase().includes(selectedCity.toLowerCase())) {
              catCounts[item.category] = (catCounts[item.category] || 0) + 1;
            }
          }
        });

        setCityCounts(cCounts);
        setCategoryCounts(catCounts);
      } catch (err) {
        console.error('Error fetching region counts:', err);
      }
    };
    fetchCounts();
  }, [region, selectedCity]);

  // Fetch listings
  useEffect(() => {
    let isMounted = true;
    const fetchListings = async () => {
      if (!region) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        let query = supabase.from('listings').select('*').eq('status', 'active');

        if (selectedCity) {
          query = query.ilike('city', `%${selectedCity}%`);
        } else {
          const cityFilter = region.cities.map(c => `city.ilike.%${c}%`).join(',');
          const orFilter = `region.ilike.%${region.shortName}%,region.ilike.%${region.name}%,${cityFilter}`;
          query = query.or(orFilter);
        }

        if (category) {
          query = query.eq('category', category);
        }

        if (appliedMinPrice && !isNaN(Number(appliedMinPrice)) && Number(appliedMinPrice) > 0) {
          query = query.gte('price', Number(appliedMinPrice));
        }
        if (appliedMaxPrice && !isNaN(Number(appliedMaxPrice)) && Number(appliedMaxPrice) > 0) {
          query = query.lte('price', Number(appliedMaxPrice));
        }

        if (condition && condition !== 'all') {
          query = query.eq('condition', condition);
        }

        if (sortBy === 'price_asc' || sortBy === 'price-asc') {
          query = query.order('price', { ascending: true, nullsFirst: false });
        } else if (sortBy === 'price_desc' || sortBy === 'price-desc') {
          query = query.order('price', { ascending: false, nullsLast: true });
        } else {
          query = query.order('created_at', { ascending: false });
        }

        query = query.limit(60);

        const { data, error } = await query;
        if (error) throw error;

        if (isMounted) {
          setListings(data || []);
        }
      } catch (err) {
        console.error('Error fetching region listings:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchListings();
    return () => { isMounted = false; };
  }, [region, selectedCity, category, sortBy, appliedMinPrice, appliedMaxPrice, condition]);

  if (!region) {
    return (
      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 py-16 px-4 text-center">
        <h1 className="text-2xl font-bold text-neutral-800 dark:text-neutral-100 mb-4">
          Bölge Bulunamadı
        </h1>
        <p className="text-neutral-600 dark:text-neutral-400 mb-6">
          Aradığınız bölge sayfası mevcut değil. Türkiye genelindeki illere göz atabilirsiniz.
        </p>
        <Link
          to="/sehirler"
          className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-2.5 rounded-xl transition-all"
        >
          Tüm Şehirlere Git
        </Link>
      </div>
    );
  }

  const effectivePath = `/bolge/${region.slug}${categorySlug ? `/${categorySlug}` : ''}`;
  const seoTitle = category 
    ? `${region.name} ${category} İlanları - Satılık & Kiralık | ExVitrin`
    : `${region.name} İkinci El ve Sıfır İlanlar | ExVitrin`;
  const seoDesc = category
    ? `${region.name} ${category.toLowerCase()} ilanları ExVitrin'de! ${region.cities.slice(0, 5).join(', ')} ve tüm ${region.shortName} illerinden satılık ve kiralık ${category.toLowerCase()} fırsatları.`
    : `${region.name} satılık ve kiralık ilanları ExVitrin'de! ${region.cities.slice(0, 5).join(', ')} ve tüm bölge illerinden ikinci el eşya, araba, emlak fırsatları.`;

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 transition-colors pb-16">
      <SEO
        title={seoTitle}
        description={seoDesc}
        url={effectivePath}
        canonical={effectivePath}
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
            {/* Meta Badges */}
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-100 dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 text-xs font-medium border border-neutral-200/60 dark:border-neutral-800">
                <span className="w-1.5 h-1.5 rounded-full bg-red-600"></span>
                {region.name}
              </span>
              <span className="px-2.5 py-1 rounded-full bg-neutral-50 dark:bg-neutral-900/60 text-neutral-500 dark:text-neutral-400 text-xs font-normal border border-neutral-200/50 dark:border-neutral-800">
                Türkiye Coğrafi Bölgesi
              </span>
              {selectedCity && (
                <span className="px-2.5 py-1 rounded-full bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 text-xs font-medium">
                  {selectedCity} Filtrelendi
                </span>
              )}
              {category && (
                <span className="px-2.5 py-1 rounded-full bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 text-xs font-medium border border-red-200/50 dark:border-red-900/40">
                  {category}
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-neutral-950 dark:text-white leading-tight">
              {region.name} {category || ''} İlanları
            </h1>
            <p className="mt-2 text-sm sm:text-base text-neutral-500 dark:text-neutral-400 max-w-2xl leading-relaxed font-normal">
              {region.description}
            </p>
          </div>

          {/* Quick Metrics & Action Button */}
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
              <div>
                <p className="text-xl sm:text-2xl font-semibold text-neutral-950 dark:text-white leading-none">
                  {region.cities.length}
                </p>
                <p className="text-[11px] text-neutral-400 dark:text-neutral-500 uppercase tracking-wider font-medium mt-1">
                  Bölge İli
                </p>
              </div>
            </div>

            <Link
              to="/add-listing"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-neutral-950 hover:bg-neutral-800 text-white dark:bg-white dark:hover:bg-neutral-100 dark:text-neutral-950 text-xs font-semibold tracking-wide transition-all shadow-xs"
            >
              <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
              </svg>
              <span>{region.shortName}'de İlan Ver</span>
            </Link>
          </div>
        </div>

        {/* Quick Region Cities Filter Bar */}
        <div className="mt-5 pt-4 border-t border-neutral-100 dark:border-neutral-800/80">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar">
            <span className="text-[11px] font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider mr-1 shrink-0">
              İl Seç:
            </span>
            <button
              onClick={() => setSelectedCity('')}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                !selectedCity
                  ? 'bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 shadow-xs font-semibold'
                  : 'bg-neutral-50 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 border border-neutral-200/70 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700'
              }`}
            >
              Tüm Bölge ({region.cities.length})
            </button>
            {region.cities.map((c) => {
              const isChecked = selectedCity === c;
              const count = cityCounts[c] || 0;
              const pCode = PLATE_CODES[c] || '';
              return (
                <button
                  key={c}
                  onClick={() => setSelectedCity(isChecked ? '' : c)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                    isChecked
                      ? 'bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 shadow-xs font-semibold'
                      : 'bg-neutral-50 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 border border-neutral-200/70 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700'
                  }`}
                >
                  {pCode && <span className="opacity-50 text-[10px] font-mono">{pCode}</span>}
                  <span>{c}</span>
                  {count > 0 && (
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isChecked ? 'bg-neutral-800 text-white dark:bg-neutral-200 dark:text-neutral-900' : 'bg-neutral-200/60 dark:bg-neutral-800 text-neutral-500'}`}>
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 pt-5">
        {/* Horizontal Category Navigation */}
        <div className="mb-6 pb-2">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-[11px] font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">
              {region.shortName} Kategorileri
            </span>
            {categorySlug && (
              <Link
                to={`/bolge/${region.slug}`}
                className="text-xs font-medium text-red-600 hover:text-red-700 transition-colors"
              >
                Kategori Filtresini Kaldır
              </Link>
            )}
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar">
            <Link
              to={`/bolge/${region.slug}`}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                !categorySlug
                  ? 'bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 shadow-xs'
                  : 'bg-neutral-50 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 border border-neutral-200/70 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700'
              }`}
            >
              Tüm Kategoriler
            </Link>
            {TOP_SEO_CATEGORIES.map((cat) => {
              const isCatActive = categorySlug === cat.slug;
              const count = categoryCounts[cat.name] || 0;
              return (
                <Link
                  key={cat.slug}
                  to={`/bolge/${region.slug}/${cat.slug}`}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
                    isCatActive
                      ? 'bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 shadow-xs'
                      : 'bg-neutral-50 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 border border-neutral-200/70 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700'
                  }`}
                >
                  <span>{cat.name}</span>
                  {count > 0 && (
                    <span className="text-[10px] opacity-60">({count})</span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Toolbar: Counter, Mobile Filter Toggle & View Mode */}
        <div className="flex items-center justify-between gap-3 mb-6 pb-3 border-b border-neutral-100 dark:border-neutral-800">
          <div className="flex items-center gap-3">
            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden flex items-center gap-2 px-3.5 py-1.5 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl text-xs font-semibold text-neutral-800 dark:text-neutral-200 shadow-xs"
            >
              <svg className="w-3.5 h-3.5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              <span>Filtreler</span>
              {(appliedMinPrice || appliedMaxPrice || condition !== 'all' || selectedCity) && (
                <span className="w-1.5 h-1.5 rounded-full bg-red-600"></span>
              )}
            </button>

            <div className="text-xs text-neutral-500 dark:text-neutral-400">
              {loading ? (
                'İlanlar listeleniyor...'
              ) : (
                <span>
                  <strong className="text-neutral-900 dark:text-white font-semibold">{listings.length}</strong> ilan bulundu
                  {selectedCity && <span className="ml-1 text-neutral-400">({selectedCity} seçili)</span>}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Sort Selector */}
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
                onClick={() => setViewMode('horizontal')}
                className={`p-1.5 rounded-md transition-all ${
                  viewMode === 'horizontal'
                    ? 'bg-white dark:bg-neutral-800 text-neutral-950 dark:text-white shadow-xs font-medium'
                    : 'text-neutral-400 hover:text-neutral-600'
                }`}
                title="Liste Görünümü"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-md transition-all ${
                  viewMode === 'grid'
                    ? 'bg-white dark:bg-neutral-800 text-neutral-950 dark:text-white shadow-xs font-medium'
                    : 'text-neutral-400 hover:text-neutral-600'
                }`}
                title="Kutu Görünümü"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Layout: Sidebar + Listings */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Sidebar Filters */}
          <aside
            className={`
              fixed inset-0 z-[1002] lg:relative lg:inset-auto lg:z-0 lg:w-[280px] lg:min-w-[280px] lg:block
              ${showFilters ? 'block' : 'hidden lg:block'}
            `}
          >
            {/* Backdrop for mobile */}
            <div
              className="fixed inset-0 bg-black/50 backdrop-blur-xs lg:hidden"
              onClick={() => setShowFilters(false)}
            />

            <div
              className={`
                relative w-[85vw] sm:w-[340px] lg:w-full h-full lg:h-auto bg-white dark:bg-neutral-900 lg:rounded-2xl shadow-xl lg:shadow-xs p-5
                overflow-y-auto sticky top-0 lg:top-6 border border-neutral-200/80 dark:border-neutral-800
                ${showFilters ? 'animate-in slide-in-from-left duration-250' : ''}
              `}
            >
              {/* Mobile Header */}
              <div className="flex items-center justify-between lg:hidden mb-5 pb-3 border-b dark:border-neutral-800">
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
              <div className="hidden lg:flex items-center justify-between mb-4">
                <h3 className="font-semibold text-neutral-950 dark:text-white text-sm">Filtreler</h3>
                {(appliedMinPrice || appliedMaxPrice || condition !== 'all' || selectedCity || categorySlug) && (
                  <button
                    onClick={() => {
                      handleClearPrice();
                      setCondition('all');
                      setSelectedCity('');
                      if (categorySlug) {
                        navigate(`/bolge/${region.slug}`);
                      }
                    }}
                    className="text-xs text-red-600 hover:text-red-700 font-medium cursor-pointer"
                  >
                    Temizle
                  </button>
                )}
              </div>

              {/* Category Filter in Sidebar */}
              <div className="mb-5 pb-5 border-b border-neutral-100 dark:border-neutral-800">
                <label className="block text-[11px] font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider mb-2">
                  Kategoriler
                </label>
                <div className="space-y-0.5">
                  <Link
                    to={`/bolge/${region.slug}`}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition-colors flex items-center justify-between ${
                      !categorySlug
                        ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-950 dark:text-white font-semibold'
                        : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800/60'
                    }`}
                  >
                    <span>Tüm Kategoriler</span>
                  </Link>
                  {TOP_SEO_CATEGORIES.map((cat) => {
                    const isCatActive = categorySlug === cat.slug;
                    const count = categoryCounts[cat.name] || 0;
                    return (
                      <Link
                        key={cat.slug}
                        to={`/bolge/${region.slug}/${cat.slug}`}
                        className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition-colors flex items-center justify-between group ${
                          isCatActive
                            ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-950 dark:text-white font-semibold'
                            : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800/60'
                        }`}
                      >
                        <span className="truncate">{cat.name}</span>
                        {count > 0 && (
                          <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isCatActive ? 'bg-neutral-200 dark:bg-neutral-700 text-neutral-900 dark:text-white' : 'text-neutral-400'}`}>
                            {count}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* City Selection */}
              <div className="mb-5 pb-5 border-b border-neutral-100 dark:border-neutral-800">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-[11px] font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">
                    Bölge İlleri ({region.cities.length})
                  </label>
                  {selectedCity && (
                    <button
                      onClick={() => setSelectedCity('')}
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
                      name="regionCity"
                      checked={!selectedCity}
                      onChange={() => setSelectedCity('')}
                      className="text-neutral-950 dark:text-white focus:ring-0"
                    />
                    <span className={!selectedCity ? 'font-semibold text-neutral-950 dark:text-white' : 'text-neutral-600 dark:text-neutral-400'}>
                      Tüm {region.shortName} İlleri
                    </span>
                  </label>
                  {region.cities.map((c) => {
                    const isChecked = selectedCity === c;
                    const count = cityCounts[c] || 0;
                    const pCode = PLATE_CODES[c] || '';
                    return (
                      <label key={c} className="flex items-center justify-between px-2 py-1.5 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800/50 cursor-pointer text-xs">
                        <span className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="regionCity"
                            checked={isChecked}
                            onChange={() => setSelectedCity(c)}
                            className="text-neutral-950 dark:text-white focus:ring-0"
                          />
                          <span className={isChecked ? 'font-semibold text-neutral-950 dark:text-white' : 'text-neutral-600 dark:text-neutral-400'}>
                            {pCode ? `${pCode} ${c}` : c}
                          </span>
                        </span>
                        {count > 0 && (
                          <span className="text-[10px] text-neutral-400 font-medium">({count})</span>
                        )}
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Price Range */}
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

              {/* Reset Filters */}
              <button
                type="button"
                onClick={() => {
                  handleClearPrice();
                  setCondition('all');
                  setSelectedCity('');
                  if (categorySlug) {
                    navigate(`/bolge/${region.slug}`);
                  }
                  setShowFilters(false);
                }}
                className="w-full py-2 px-3 rounded-lg border border-neutral-200 dark:border-neutral-700 text-xs font-medium text-neutral-600 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
              >
                Filtreleri Sıfırla
              </button>
            </div>
          </aside>

          {/* Listings List (Flex-1) */}
          <div className="flex-1 w-full min-w-0">
            {loading ? (
              <div className="py-20 flex flex-col items-center justify-center">
                <LoadingSpinner size="large" />
                <p className="mt-3 text-xs text-neutral-400">{region.name} ilanları listeleniyor...</p>
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
                  {selectedCity ? `${selectedCity} İlinde` : region.name} İlan Bulunamadı
                </h3>
                <p className="text-neutral-500 dark:text-neutral-400 text-xs sm:text-sm max-w-md mx-auto mt-1.5 mb-6 leading-relaxed">
                  {selectedCity 
                    ? `${selectedCity} ilinde bu filtreye uygun ilan bulunamadı. Filtreleri temizleyebilir veya bölgede ilk ilanı siz verebilirsiniz.`
                    : `${region.name} genelinde bu kriterlere uygun ilan bulunamadı. İlk ilanı ücretsiz verebilirsiniz.`}
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <Link
                    to="/add-listing"
                    className="bg-neutral-950 hover:bg-neutral-800 text-white dark:bg-white dark:hover:bg-neutral-100 dark:text-neutral-950 font-semibold px-5 py-2.5 rounded-xl transition-colors text-xs"
                  >
                    + İlk İlanı Sen Ver
                  </Link>
                  {selectedCity && (
                    <button
                      onClick={() => setSelectedCity('')}
                      className="bg-neutral-50 dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 font-medium px-4 py-2.5 rounded-xl text-xs border border-neutral-200/80 dark:border-neutral-700"
                    >
                      Tüm {region.shortName} İlanlarına Bak
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Editorial SEO Information & Guide Section */}
        <div className="mt-12 bg-white dark:bg-neutral-900 rounded-2xl p-6 sm:p-8 border border-neutral-200/80 dark:border-neutral-800">
          <div className="max-w-2xl">
            <span className="text-[11px] font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider block mb-1">
              Bölgesel Rehber
            </span>
            <h2 className="text-lg sm:text-xl font-semibold text-neutral-950 dark:text-white mb-2">
              {region.name} {category || 'İkinci El & Sıfır'} İlan Pazarı
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
              {region.description} {region.name} genelinde aradığınız ürünleri il bazında filtreleyebilir, satıcılarla güvenli mesajlaşma üzerinden doğrudan iletişime geçebilirsiniz.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 mt-6 border-t border-neutral-100 dark:border-neutral-800">
            <div className="space-y-1">
              <h4 className="font-semibold text-neutral-900 dark:text-white text-xs flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-red-600"></span>
                Bölgesel Alışveriş
              </h4>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed font-normal">
                {region.shortName} illerinde size en yakın satıcıları ve alıcıları kolayca bulun.
              </p>
            </div>
            <div className="space-y-1">
              <h4 className="font-semibold text-neutral-900 dark:text-white text-xs flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-red-600"></span>
                Komisyonsuz & Ücretsiz
              </h4>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed font-normal">
                İlan vermek tamamen ücretsizdir, hiçbir gizli ücret veya komisyon ödemezsiniz.
              </p>
            </div>
            <div className="space-y-1">
              <h4 className="font-semibold text-neutral-900 dark:text-white text-xs flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-red-600"></span>
                Geniş Erişim Ağı
              </h4>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed font-normal">
                İlanlarınız hem Google arama sonuçlarında hem bölgesel vitrinde anında öne çıkar.
              </p>
            </div>
          </div>
        </div>

        {/* Region Cities Internal Links */}
        <div className="mt-8 bg-white dark:bg-neutral-900 rounded-2xl p-6 border border-neutral-200/80 dark:border-neutral-800">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-semibold text-neutral-950 dark:text-white uppercase tracking-wider">
              {region.name} Şehir Vitrinleri ({region.cities.length} İl)
            </h3>
            <span className="text-[11px] text-neutral-400">
              Şehir Sayfasına Git
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {region.cities.map((city) => {
              const pCode = PLATE_CODES[city] || '';
              return (
                <Link
                  key={city}
                  to={`/sehir/${cityToSlug(city)}`}
                  className="text-xs px-2.5 py-1 rounded-lg border border-neutral-200/60 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/40 hover:border-neutral-400 transition-colors font-medium text-neutral-700 dark:text-neutral-300 flex items-center gap-1"
                >
                  {pCode && <span className="opacity-50 text-[10px] font-mono">{pCode}</span>}
                  <span>{city} İlanları</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* All Other Regions (Internal Link Juice) */}
        <div className="mt-8 bg-neutral-50 dark:bg-neutral-900/40 rounded-2xl p-6 border border-neutral-200/60 dark:border-neutral-800">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-semibold text-neutral-800 dark:text-neutral-300 uppercase tracking-wider">
              Türkiye'nin Diğer Coğrafi Bölgeleri
            </h3>
            <Link to="/sehirler" className="text-xs font-medium text-red-600 hover:text-red-700">
              Tüm Bölgeler ve İller ›
            </Link>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {turkeyRegions.map((reg) => {
              const isCurrent = reg.slug === region.slug;
              const targetUrl = categorySlug ? `/bolge/${reg.slug}/${categorySlug}` : `/bolge/${reg.slug}`;
              return (
                <Link
                  key={reg.slug}
                  to={targetUrl}
                  className={`text-xs px-2.5 py-1 rounded-lg border transition-colors ${
                    isCurrent
                      ? 'bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 border-neutral-950 font-semibold'
                      : 'bg-white dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 border-neutral-200/60 dark:border-neutral-700 hover:border-neutral-400'
                  }`}
                >
                  {reg.name} {category ? `${category}` : ''}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegionLandingPage;

