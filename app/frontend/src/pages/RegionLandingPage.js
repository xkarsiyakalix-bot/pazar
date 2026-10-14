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
  const [priceRange, setPriceRange] = useState('all');
  const [condition, setCondition] = useState('all');
  const [categoryCounts, setCategoryCounts] = useState({});
  const [cityCounts, setCityCounts] = useState({});
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState('horizontal');

  // Breadcrumbs
  const breadcrumbs = [
    { name: 'Ana Sayfa', url: '/' },
    { name: 'Bölgeler', url: '/sehirler' },
    { name: region ? region.name : (regionSlug || 'Bölge'), url: region ? `/bolge/${region.slug}` : `/bolge/${regionSlug}` }
  ];
  if (category && region) {
    breadcrumbs.push({
      name: category,
      url: `/bolge/${region.slug}/${categorySlug}`
    });
  }

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

        if (priceRange === 'under100') {
          query = query.lte('price', 100);
        } else if (priceRange === '100-500') {
          query = query.gte('price', 100).lte('price', 500);
        } else if (priceRange === '500-1000') {
          query = query.gte('price', 500).lte('price', 1000);
        } else if (priceRange === 'over1000') {
          query = query.gte('price', 1000);
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
  }, [region, selectedCity, category, sortBy, priceRange, condition]);

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
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 pb-16">
      <SEO
        title={seoTitle}
        description={seoDesc}
        url={effectivePath}
        canonical={effectivePath}
        breadcrumbs={breadcrumbs}
      />

      {/* Hero Header */}
      <div className="bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white py-8 px-4 sm:px-6 lg:px-8 shadow-md">
        <div className="max-w-7xl mx-auto">
          <div className="mb-4 text-white/80 text-xs sm:text-sm">
            <Breadcrumb items={breadcrumbs} light />
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/15 px-3 py-1 rounded-full text-xs font-semibold mb-2">
                <span>{region.icon} {region.name}</span>
                {category && <span>• {category}</span>}
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">
                {region.name} {category || ''} İlanları
              </h1>
              <p className="mt-2 text-white/90 text-sm sm:text-base max-w-3xl">
                {region.description}
              </p>
            </div>

            <div className="flex items-center gap-3 self-start md:self-auto">
              <Link
                to="/add-listing"
                className="bg-white text-red-600 hover:bg-neutral-100 font-bold px-5 py-2.5 rounded-xl shadow-md transition-all hover:scale-105 text-sm flex items-center gap-1.5"
              >
                <span>+</span>
                <span>{region.shortName}'de Ücretsiz İlan Ver</span>
              </Link>
            </div>
          </div>

          {/* Quick City Filter Pills */}
          <div className="mt-6 pt-4 border-t border-white/15 flex flex-wrap items-center gap-2">
            <span className="text-xs text-white/70 font-semibold mr-1">Bölge İlleri:</span>
            <button
              onClick={() => setSelectedCity('')}
              className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all ${
                !selectedCity
                  ? 'bg-white text-red-700 font-bold shadow-sm'
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              Tüm Bölge ({region.cities.length} İl)
            </button>
            {region.cities.map((c) => {
              const isChecked = selectedCity === c;
              const count = cityCounts[c] || 0;
              return (
                <button
                  key={c}
                  onClick={() => setSelectedCity(isChecked ? '' : c)}
                  className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1 ${
                    isChecked
                      ? 'bg-white text-red-700 font-bold shadow-sm'
                      : 'bg-white/10 hover:bg-white/20 text-white'
                  }`}
                >
                  <span>{c}</span>
                  {count > 0 && <span className="opacity-75 text-[11px]">({count})</span>}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        {/* Mobile Filter Toggle */}
        <div className="lg:hidden mb-4 flex items-center justify-between bg-white dark:bg-neutral-800 p-3 rounded-xl border border-neutral-200 dark:border-neutral-700">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 text-sm font-semibold text-neutral-800 dark:text-neutral-100"
          >
            <span>⚙️</span>
            <span>Filtreler {category ? `(${category})` : ''}</span>
          </button>
          <span className="text-xs text-neutral-500 font-medium">
            {listings.length} İlan
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Filters */}
          <div className={`lg:block ${showFilters ? 'block' : 'hidden'} lg:col-span-1`}>
            <div className="bg-white dark:bg-neutral-800 rounded-2xl p-5 border border-neutral-200/80 dark:border-neutral-700/80 shadow-sm sticky top-20 space-y-6">
              {/* Category Filter */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider">
                    Kategori
                  </label>
                  {category && (
                    <Link
                      to={`/bolge/${region.slug}`}
                      className="text-[11px] text-red-600 hover:text-red-700 font-semibold"
                    >
                      Tümünü Gör
                    </Link>
                  )}
                </div>
                <div className="space-y-1">
                  <Link
                    to={`/bolge/${region.slug}`}
                    className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors ${
                      !categorySlug
                        ? 'bg-red-50 dark:bg-red-950/30 text-red-600 font-bold'
                        : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700/50'
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
                        className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors ${
                          isCatActive
                            ? 'bg-red-50 dark:bg-red-950/30 text-red-600 font-bold'
                            : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700/50'
                        }`}
                      >
                        <span className="flex items-center gap-1.5 truncate">
                          <span>{cat.icon}</span>
                          <span>{cat.name}</span>
                        </span>
                        {count > 0 && (
                          <span className="text-[10px] text-neutral-400 font-semibold">{count}</span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* City Selection */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider">
                    Şehir Filtresi
                  </label>
                  {selectedCity && (
                    <button
                      onClick={() => setSelectedCity('')}
                      className="text-[11px] text-red-600 hover:text-red-700"
                    >
                      Temizle
                    </button>
                  )}
                </div>
                <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
                  <label className="flex items-center gap-2 px-2 py-1 rounded hover:bg-neutral-50 dark:hover:bg-neutral-700/40 cursor-pointer text-xs">
                    <input
                      type="radio"
                      name="regionCity"
                      checked={!selectedCity}
                      onChange={() => setSelectedCity('')}
                      className="text-red-600 focus:ring-red-500"
                    />
                    <span className={!selectedCity ? 'font-bold text-red-600' : 'text-neutral-700 dark:text-neutral-300'}>
                      Tüm {region.shortName} İlleri
                    </span>
                  </label>
                  {region.cities.map((c) => {
                    const isChecked = selectedCity === c;
                    const count = cityCounts[c] || 0;
                    return (
                      <label key={c} className="flex items-center justify-between px-2 py-1 rounded hover:bg-neutral-50 dark:hover:bg-neutral-700/40 cursor-pointer text-xs">
                        <span className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="regionCity"
                            checked={isChecked}
                            onChange={() => setSelectedCity(c)}
                            className="text-red-600 focus:ring-red-500"
                          />
                          <span className={isChecked ? 'font-bold text-red-600' : 'text-neutral-700 dark:text-neutral-300'}>
                            {c}
                          </span>
                        </span>
                        {count > 0 && (
                          <span className="text-[10px] text-neutral-400 font-semibold">{count}</span>
                        )}
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">
                  Fiyat Aralığı
                </label>
                <div className="space-y-1.5 text-xs">
                  {[
                    { id: 'all', label: 'Tümü' },
                    { id: 'under100', label: '0 - 100 TL' },
                    { id: '100-500', label: '100 - 500 TL' },
                    { id: '500-1000', label: '500 - 1.000 TL' },
                    { id: 'over1000', label: '1.000 TL ve üzeri' }
                  ].map((p) => (
                    <label key={p.id} className="flex items-center gap-2 px-2 py-1 rounded hover:bg-neutral-50 dark:hover:bg-neutral-700/40 cursor-pointer">
                      <input
                        type="radio"
                        name="regionPrice"
                        checked={priceRange === p.id}
                        onChange={() => setPriceRange(p.id)}
                        className="text-red-600 focus:ring-red-500"
                      />
                      <span className={priceRange === p.id ? 'font-bold text-red-600' : 'text-neutral-700 dark:text-neutral-300'}>
                        {p.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Listings List */}
          <div className="lg:col-span-3">
            {/* Top Toolbar */}
            <div className="bg-white dark:bg-neutral-800 p-4 rounded-2xl border border-neutral-200/80 dark:border-neutral-700/80 shadow-sm mb-6 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-bold text-neutral-900 dark:text-white">
                  {selectedCity ? `${selectedCity} İlanları` : `${region.name} Genelindeki İlanlar`}
                </h2>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  Toplam {listings.length} aktif ilan listeleniyor
                </p>
              </div>

              <div className="flex items-center gap-3">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-neutral-50 dark:bg-neutral-700 text-xs font-medium border border-neutral-200 dark:border-neutral-600 rounded-xl px-3 py-2 text-neutral-800 dark:text-neutral-200 focus:outline-none focus:ring-2 focus:ring-red-500/20"
                >
                  <option value="newest">En Yeni İlanlar</option>
                  <option value="price_asc">Fiyat: Düşükten Yükseğe</option>
                  <option value="price_desc">Fiyat: Yüksekten Düşüğe</option>
                </select>

                <div className="hidden sm:flex items-center border border-neutral-200 dark:border-neutral-700 rounded-xl overflow-hidden p-0.5 bg-neutral-50 dark:bg-neutral-700">
                  <button
                    onClick={() => setViewMode('horizontal')}
                    className={`p-1.5 rounded-lg text-xs transition-colors ${
                      viewMode === 'horizontal'
                        ? 'bg-white dark:bg-neutral-800 text-red-600 shadow-xs'
                        : 'text-neutral-500 dark:text-neutral-400'
                    }`}
                    title="Liste Görünümü"
                  >
                    ☰
                  </button>
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 rounded-lg text-xs transition-colors ${
                      viewMode === 'grid'
                        ? 'bg-white dark:bg-neutral-800 text-red-600 shadow-xs'
                        : 'text-neutral-500 dark:text-neutral-400'
                    }`}
                    title="Kutu Görünümü"
                  >
                    ⊞
                  </button>
                </div>
              </div>
            </div>

            {/* Results */}
            {loading ? (
              <div className="py-20 flex justify-center">
                <LoadingSpinner />
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
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
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
              <div className="bg-white dark:bg-neutral-800 rounded-2xl p-12 text-center border border-neutral-200 dark:border-neutral-700">
                <div className="text-4xl mb-3">📍</div>
                <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-2">
                  İlan Bulunamadı
                </h3>
                <p className="text-sm text-neutral-500 dark:text-neutral-400 max-w-md mx-auto mb-6">
                  {selectedCity 
                    ? `${selectedCity} ilinde henüz ilan bulunmuyor. Filtreleri temizleyebilir veya ilk ilanı siz verebilirsiniz!`
                    : `${region.name} genelinde bu kriterlere uygun ilan bulunamadı. İlk ilanı ücretsiz verebilirsiniz!`}
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <Link
                    to="/add-listing"
                    className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-2.5 rounded-xl shadow transition-all text-sm"
                  >
                    Hemen Ücretsiz İlan Ver
                  </Link>
                  {selectedCity && (
                    <button
                      onClick={() => setSelectedCity('')}
                      className="bg-neutral-100 dark:bg-neutral-700 hover:bg-neutral-200 text-neutral-700 dark:text-neutral-200 font-semibold px-5 py-2.5 rounded-xl text-sm"
                    >
                      Tüm {region.shortName} İlanlarına Bak
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* SEO Information Section */}
        <div className="mt-12 bg-white dark:bg-neutral-800 rounded-2xl p-6 sm:p-8 border border-neutral-200/80 dark:border-neutral-700/80 shadow-sm">
          <h2 className="text-lg sm:text-xl font-bold text-neutral-900 dark:text-white mb-3 flex items-center gap-2">
            <span>ℹ️</span>
            <span>{region.name} {category || 'İkinci El & Sıfır'} İlan Rehberi</span>
          </h2>
          <p className="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed mb-6">
            {region.description} {region.name} bölgesinde aradığınız ürünleri il bazında filtreleyebilir, satıcılarla elden teslimat veya kargo seçenekleriyle doğrudan iletişime geçebilirsiniz.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-neutral-100 dark:border-neutral-700">
            <div>
              <h4 className="font-semibold text-neutral-900 dark:text-white text-sm mb-1.5 flex items-center gap-1.5">
                <span className="text-red-600">✓</span> Bölgesel Hızlı Alışveriş
              </h4>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                {region.shortName} bölgesinde size en yakın satıcıları ve alıcıları kolayca bulun.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-neutral-900 dark:text-white text-sm mb-1.5 flex items-center gap-1.5">
                <span className="text-red-600">✓</span> Sıfır Komisyon & Ücretsiz İlan
              </h4>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                İlan vermek tamamen ücretsizdir, hiçbir gizli ücret veya komisyon ödemezsiniz.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-neutral-900 dark:text-white text-sm mb-1.5 flex items-center gap-1.5">
                <span className="text-red-600">✓</span> Yüksek Arama Görünürlüğü
              </h4>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                İlanlarınız hem Google arama sonuçlarında hem ExVitrin pazarında anında listelenir.
              </p>
            </div>
          </div>
        </div>

        {/* Region Cities Link Cloud */}
        <div className="mt-8 bg-white dark:bg-neutral-800 rounded-2xl p-6 border border-neutral-200/80 dark:border-neutral-700/80 shadow-sm">
          <h3 className="text-sm font-bold text-neutral-900 dark:text-white mb-2 flex items-center gap-2">
            <span>📍</span>
            <span>{region.name} Şehir İlanları ({region.cities.length} İl)</span>
          </h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-4">
            {region.shortName} illerindeki tüm güncel ilanlara tek tıkla ulaşın:
          </p>
          <div className="flex flex-wrap gap-2">
            {region.cities.map((city) => (
              <Link
                key={city}
                to={`/sehir/${cityToSlug(city)}`}
                className="text-xs px-3.5 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-700/50 hover:border-red-500 hover:text-red-600 transition-colors font-medium text-neutral-800 dark:text-neutral-200"
              >
                📍 {city} İlanları
              </Link>
            ))}
          </div>
        </div>

        {/* All Other Regions (Internal Link Juice) */}
        <div className="mt-8 bg-neutral-100 dark:bg-neutral-800/60 rounded-2xl p-6 border border-neutral-200 dark:border-neutral-700">
          <h3 className="text-sm font-bold text-neutral-800 dark:text-neutral-200 mb-3">
            Türkiye'nin Diğer Bölgelerindeki İlanlar
          </h3>
          <div className="flex flex-wrap gap-2">
            {turkeyRegions.map((reg) => {
              const isCurrent = reg.slug === region.slug;
              const targetUrl = categorySlug ? `/bolge/${reg.slug}/${categorySlug}` : `/bolge/${reg.slug}`;
              return (
                <Link
                  key={reg.slug}
                  to={targetUrl}
                  className={`text-xs px-3.5 py-2 rounded-xl border transition-colors ${
                    isCurrent
                      ? 'bg-red-600 text-white border-red-600 font-semibold'
                      : 'bg-white dark:bg-neutral-700 text-neutral-700 dark:text-neutral-200 border-neutral-200 dark:border-neutral-600 hover:border-red-500'
                  }`}
                >
                  {reg.icon} {reg.name} {category ? `${category}` : 'İlanları'}
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

