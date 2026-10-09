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
  TOP_SEO_CITIES, 
  TOP_SEO_CATEGORIES 
} from '../utils/cityUtils';

import { categories as allCategories } from '../data/categories';
import { getTurkishCities, getCategoryTranslation } from '../translations';

export const CityCategoryLandingPage = ({ toggleFavorite, isFavorite }) => {
  const { citySlug, categorySlug, subCategorySlug } = useParams();
  const navigate = useNavigate();

  // Parse city and optional district from citySlug (e.g., "denizli-pamukkale" or "denizli")
  const { parsedCity, parsedDistrict } = useMemo(() => {
    if (!citySlug) return { parsedCity: null, parsedDistrict: null };
    const directCity = slugToCity(citySlug);
    if (directCity) {
      return { parsedCity: directCity, parsedDistrict: null };
    }

    // Try finding city as prefix of citySlug (e.g., "denizli-pamukkale" -> city="Denizli", district="Pamukkale")
    const cleanSlug = citySlug.toLowerCase().trim();
    for (const c of TURKISH_CITIES) {
      const cSlug = cityToSlug(c);
      if (cleanSlug.startsWith(cSlug + '-')) {
        const distSlug = cleanSlug.slice(cSlug.length + 1);
        const distFormatted = distSlug
          .split('-')
          .map(w => w.charAt(0).toUpperCase() + w.slice(1))
          .join(' ');
        return { parsedCity: c, parsedDistrict: distFormatted };
      }
    }

    return { parsedCity: citySlug, parsedDistrict: null };
  }, [citySlug]);

  const city = parsedCity;
  const category = useMemo(() => slugToCategory(categorySlug), [categorySlug]);
  const subCategory = subCategorySlug ? decodeURIComponent(subCategorySlug).replace(/-/g, ' ') : null;

  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('newest');
  const [priceRange, setPriceRange] = useState('all');
  const [condition, setCondition] = useState('all');
  const [selectedDistrict, setSelectedDistrict] = useState(parsedDistrict || '');
  const [availableDistricts, setAvailableDistricts] = useState([]);
  const [categoryCounts, setCategoryCounts] = useState({});
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState('horizontal'); // 'horizontal' or 'grid'

  // Sync selectedDistrict when URL changes
  useEffect(() => {
    setSelectedDistrict(parsedDistrict || '');
  }, [parsedDistrict]);

  const seoData = useMemo(() => {
    return getCityCategorySEO(city || citySlug, category, subCategory, selectedDistrict || parsedDistrict);
  }, [city, citySlug, category, subCategory, selectedDistrict, parsedDistrict]);

  // Fetch category & district counts for this city
  useEffect(() => {
    const fetchCountsAndDistricts = async () => {
      const activeCity = city || citySlug;
      if (!activeCity) return;
      try {
        const variants = getCityVariants(activeCity);
        let query = supabase.from('listings').select('category, district').eq('status', 'active');
        if (variants.length > 0) {
          const orFilter = variants.map(v => `city.ilike.%${v}%,federal_state.ilike.%${v}%`).join(',');
          query = query.or(orFilter);
        }
        const { data, error } = await query;
        if (error) throw error;

        const catCounts = {};
        const distSet = new Set();
        (data || []).forEach(item => {
          if (item.category) {
            catCounts[item.category] = (catCounts[item.category] || 0) + 1;
          }
          if (item.district && item.district.trim()) {
            distSet.add(item.district.trim());
          }
        });
        setCategoryCounts(catCounts);
        setAvailableDistricts(Array.from(distSet).sort((a, b) => a.localeCompare(b, 'tr-TR')));
      } catch (err) {
        console.error('Error fetching city counts & districts:', err);
      }
    };
    fetchCountsAndDistricts();
  }, [city, citySlug]);

  useEffect(() => {
    let isMounted = true;
    const fetchListings = async () => {
      setLoading(true);
      try {
        let query = supabase
          .from('listings')
          .select('*')
          .eq('status', 'active');

        // Filter by city with all case & Turkish character variations (checking both city and federal_state)
        const activeCity = city || citySlug;
        if (activeCity) {
          const variants = getCityVariants(activeCity);
          if (variants.length > 0) {
            const orFilter = variants.map(v => `city.ilike.%${v}%,federal_state.ilike.%${v}%`).join(',');
            query = query.or(orFilter);
          }
        }

        // Filter by category
        if (category) {
          query = query.eq('category', category);
        }

        // Filter by subcategory
        if (subCategory) {
          query = query.ilike('sub_category', `%${subCategory}%`);
        }

        // Filter by district
        if (selectedDistrict) {
          query = query.ilike('district', `%${selectedDistrict}%`);
        }

        // Filter by price range
        if (priceRange === 'under100') {
          query = query.lte('price', 100);
        } else if (priceRange === '100-500') {
          query = query.gte('price', 100).lte('price', 500);
        } else if (priceRange === '500-1000') {
          query = query.gte('price', 500).lte('price', 1000);
        } else if (priceRange === 'over1000') {
          query = query.gte('price', 1000);
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

        query = query.limit(50);

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
  }, [city, category, subCategory, sortBy, priceRange, condition, selectedDistrict]);

  // Build Breadcrumbs
  const breadcrumbs = [
    { name: 'Ana Sayfa', url: '/' },
    { name: 'Şehirler', url: '/sehirler' },
    { name: city || citySlug, url: `/sehir/${cityToSlug(city || citySlug)}` }
  ];
  if (parsedDistrict) {
    breadcrumbs.push({
      name: parsedDistrict,
      url: `/sehir/${citySlug}`
    });
  }
  if (category) {
    breadcrumbs.push({
      name: category,
      url: `/sehir/${citySlug}/${categorySlug}`
    });
  }
  if (subCategory) {
    breadcrumbs.push({
      name: subCategory,
      url: `/sehir/${citySlug}/${categorySlug}/${subCategorySlug}`
    });
  }

  const currentPath = `/sehir/${citySlug}${categorySlug ? `/${categorySlug}` : ''}${subCategorySlug ? `/${subCategorySlug}` : ''}`;

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 pb-16">
      <SEO
        title={seoData.title}
        description={seoData.description}
        url={currentPath}
        breadcrumbs={breadcrumbs}
      />

      {/* Hero Header */}
      <div className="bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white py-8 px-4 sm:px-6 lg:px-8 shadow-md">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb Navigation */}
          <div className="mb-4 text-white/80 text-xs sm:text-sm">
            <Breadcrumb items={breadcrumbs} light />
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/15 px-3 py-1 rounded-full text-xs font-semibold mb-2">
                <span>📍 {parsedDistrict ? `${city}, ${parsedDistrict}` : (city || citySlug)}</span>
                {category && <span>• {category}</span>}
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">
                {seoData.heading}
              </h1>
              <p className="mt-2 text-white/90 text-sm sm:text-base max-w-3xl">
                {seoData.subheading}
              </p>
            </div>

            <Link
              to="/add-listing"
              className="inline-flex items-center justify-center bg-white text-red-600 hover:bg-neutral-100 font-bold px-5 py-3 rounded-xl shadow-lg transition-all hover:scale-105 self-start md:self-auto"
            >
              + {city ? `${city}'de Ücretsiz İlan Ver` : 'Ücretsiz İlan Ver'}
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        {/* Category Pills for this City */}
        <div className="bg-white dark:bg-neutral-800 p-4 rounded-2xl shadow-sm border border-neutral-200/80 dark:border-neutral-700/80 mb-6">
          <div className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">
            {city} İçi Popüler Kategoriler
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              to={`/sehir/${citySlug}`}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                !categorySlug
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-200 hover:bg-neutral-200'
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
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                    active
                      ? 'bg-red-600 text-white shadow-sm'
                      : 'bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-200 hover:bg-neutral-200'
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.name}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Toolbar: Counter, Mobile Filter Toggle & View Mode */}
        <div className="flex items-center justify-between gap-3 mb-6 pb-3 border-b border-neutral-200 dark:border-neutral-700">
          <div className="flex items-center gap-3">
            {/* Mobile Filter Toggle Button */}
            <button
              onClick={() => setShowFilters(true)}
              className="xl:hidden flex items-center gap-2 px-3.5 py-2 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xl text-sm font-semibold text-neutral-800 dark:text-neutral-200 shadow-sm"
            >
              <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              <span>Filtreler</span>
              {(priceRange !== 'all' || condition !== 'all' || selectedDistrict) && (
                <span className="w-2 h-2 rounded-full bg-red-600"></span>
              )}
            </button>

            <div className="text-sm text-neutral-600 dark:text-neutral-400">
              {loading ? (
                'İlanlar yükleniyor...'
              ) : (
                <span>
                  <strong className="text-neutral-900 dark:text-white font-bold">{listings.length}</strong> ilan bulundu
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <span className="hidden sm:inline text-xs text-neutral-500">Sırala:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-xs font-medium bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg px-2.5 py-1.5 text-neutral-800 dark:text-neutral-200 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="newest">En Yeni İlanlar</option>
                <option value="price_asc">Fiyat: Düşükten Yükseğe</option>
                <option value="price_desc">Fiyat: Yüksekten Düşüğe</option>
              </select>
            </div>

            {/* View Mode Toggle */}
            <div className="hidden sm:flex items-center border border-neutral-200 dark:border-neutral-700 rounded-lg overflow-hidden">
              <button
                type="button"
                onClick={() => setViewMode('horizontal')}
                className={`p-1.5 ${viewMode === 'horizontal' ? 'bg-red-50 dark:bg-red-900/30 text-red-600' : 'text-neutral-400'}`}
                title="Liste Görünümü"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`p-1.5 ${viewMode === 'grid' ? 'bg-red-50 dark:bg-red-900/30 text-red-600' : 'text-neutral-400'}`}
                title="Izgara Görünümü"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              className="fixed inset-0 bg-black/60 backdrop-blur-sm xl:hidden"
              onClick={() => setShowFilters(false)}
            />

            <div
              className={`
                relative w-[85vw] sm:w-[340px] xl:w-full h-full xl:h-auto bg-white dark:bg-neutral-800 xl:rounded-2xl shadow-2xl xl:shadow-sm p-6
                overflow-y-auto sticky top-0 xl:top-6 border border-neutral-200/80 dark:border-neutral-700/80
                ${showFilters ? 'animate-in slide-in-from-left duration-300' : ''}
              `}
            >
              {/* Mobile Header */}
              <div className="flex items-center justify-between xl:hidden mb-6 pb-4 border-b dark:border-neutral-700">
                <h3 className="font-bold text-neutral-900 dark:text-white text-lg">Filtreler</h3>
                <button
                  onClick={() => setShowFilters(false)}
                  className="p-2 text-neutral-400 hover:text-red-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Header on Desktop */}
              <div className="hidden xl:flex items-center justify-between mb-4">
                <h3 className="font-bold text-neutral-900 dark:text-white text-base">Filtreler</h3>
                {(priceRange !== 'all' || condition !== 'all' || selectedDistrict || categorySlug) && (
                  <button
                    onClick={() => {
                      setPriceRange('all');
                      setCondition('all');
                      setSelectedDistrict('');
                      if (categorySlug) {
                        navigate(`/sehir/${citySlug}`);
                      }
                    }}
                    className="text-xs text-red-600 hover:text-red-700 font-semibold"
                  >
                    Temizle
                  </button>
                )}
              </div>

              {/* Categories */}
              <div className="mb-6">
                <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">
                  Kategoriler
                </label>
                <div className="space-y-1">
                  <Link
                    to={`/sehir/${citySlug}`}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center justify-between ${
                      !categorySlug
                        ? 'bg-red-50 dark:bg-red-900/30 text-red-600 font-bold'
                        : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700/60'
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
                                ? 'bg-red-50 dark:bg-red-900/30 text-red-600 font-bold'
                                : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700/60'
                            }`}
                          >
                            <span className="truncate">{getCategoryTranslation(cat.name)}</span>
                            <span className={`text-[11px] ${isSelected ? 'text-red-600 font-bold' : 'text-neutral-400'}`}>
                              {count}
                            </span>
                          </Link>

                          {/* Subcategories if category selected */}
                          {isSelected && cat.subcategories && cat.subcategories.length > 0 && (
                            <div className="ml-3 pl-2 border-l-2 border-red-200 dark:border-neutral-700 my-1 space-y-1">
                              {cat.subcategories.map((sub) => {
                                const sSlug = encodeURIComponent(sub.replace(/\s+/g, '-').toLowerCase());
                                const isSubSelected = subCategorySlug === sSlug;
                                return (
                                  <Link
                                    key={sub}
                                    to={`/sehir/${citySlug}/${cSlug}/${sSlug}`}
                                    className={`block px-2 py-1 rounded text-[11px] transition-colors ${
                                      isSubSelected
                                        ? 'bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 font-bold'
                                        : 'text-neutral-600 dark:text-neutral-400 hover:text-red-600'
                                    }`}
                                  >
                                    {getCategoryTranslation(sub)}
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
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider">
                      İlçe ({availableDistricts.length})
                    </label>
                    {selectedDistrict && (
                      <button
                        onClick={() => {
                          setSelectedDistrict('');
                          const baseCitySlug = cityToSlug(city || citySlug);
                          navigate(categorySlug ? `/sehir/${baseCitySlug}/${categorySlug}` : `/sehir/${baseCitySlug}`);
                        }}
                        className="text-[11px] text-red-600 hover:text-red-700"
                      >
                        Tümü
                      </button>
                    )}
                  </div>
                  <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
                    <label className="flex items-center gap-2 px-2 py-1 rounded hover:bg-neutral-50 dark:hover:bg-neutral-700/40 cursor-pointer text-xs">
                      <input
                        type="radio"
                        name="district"
                        checked={!selectedDistrict}
                        onChange={() => {
                          setSelectedDistrict('');
                          const baseCitySlug = cityToSlug(city || citySlug);
                          navigate(categorySlug ? `/sehir/${baseCitySlug}/${categorySlug}` : `/sehir/${baseCitySlug}`);
                        }}
                        className="text-red-600 focus:ring-red-500"
                      />
                      <span className={!selectedDistrict ? 'font-bold text-red-600' : 'text-neutral-700 dark:text-neutral-300'}>
                        Tüm İlçeler
                      </span>
                    </label>
                    {availableDistricts.map((dist) => {
                      const isDistChecked = (selectedDistrict || '').toLowerCase() === dist.toLowerCase();
                      const distSlug = cityToSlug(dist);
                      const baseCitySlug = cityToSlug(city || citySlug);
                      const targetDistUrl = `/sehir/${baseCitySlug}-${distSlug}${categorySlug ? `/${categorySlug}` : ''}`;

                      return (
                        <label key={dist} className="flex items-center gap-2 px-2 py-1 rounded hover:bg-neutral-50 dark:hover:bg-neutral-700/40 cursor-pointer text-xs">
                          <input
                            type="radio"
                            name="district"
                            checked={isDistChecked}
                            onChange={() => {
                              setSelectedDistrict(dist);
                              navigate(targetDistUrl);
                            }}
                            className="text-red-600 focus:ring-red-500"
                          />
                          <span className={isDistChecked ? 'font-bold text-red-600' : 'text-neutral-700 dark:text-neutral-300'}>
                            {dist}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Price Range Filter */}
              <div className="mb-6">
                <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">
                  Fiyat Aralığı
                </label>
                <div className="space-y-1.5 text-xs">
                  {[
                    { id: 'all', label: 'Tüm Fiyatlar' },
                    { id: 'under100', label: '100 TL ve altı' },
                    { id: '100-500', label: '100 TL - 500 TL' },
                    { id: '500-1000', label: '500 TL - 1.000 TL' },
                    { id: 'over1000', label: '1.000 TL ve üzeri' }
                  ].map((range) => (
                    <label key={range.id} className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="radio"
                        name="priceRange"
                        checked={priceRange === range.id}
                        onChange={() => setPriceRange(range.id)}
                        className="text-red-600 focus:ring-red-500"
                      />
                      <span className={priceRange === range.id ? 'font-bold text-red-600' : 'text-neutral-700 dark:text-neutral-300 group-hover:text-red-600'}>
                        {range.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Condition Filter (Durum) */}
              <div className="mb-6">
                <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">
                  Ürün Durumu
                </label>
                <div className="space-y-1.5 text-xs">
                  {[
                    { val: 'all', label: 'Hepsi' },
                    { val: 'Yeni', label: 'Yeni' },
                    { val: 'Yeni gibi', label: 'Yeni gibi' },
                    { val: 'Çok iyi', label: 'Çok iyi' },
                    { val: 'İyi', label: 'İyi' },
                    { val: 'Kabul edilebilir', label: 'Kabul edilebilir' },
                    { val: 'Kullanılmış', label: 'Kullanılmış' },
                    { val: 'Defolu / Arızalı', label: 'Defolu / Arızalı' }
                  ].map((cond) => (
                    <label key={cond.val} className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="radio"
                        name="condition"
                        checked={condition === cond.val}
                        onChange={() => setCondition(cond.val)}
                        className="text-red-600 focus:ring-red-500"
                      />
                      <span className={condition === cond.val ? 'font-bold text-red-600' : 'text-neutral-700 dark:text-neutral-300 group-hover:text-red-600'}>
                        {cond.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Clear Filters Button */}
              <button
                type="button"
                onClick={() => {
                  setPriceRange('all');
                  setCondition('all');
                  setSelectedDistrict('');
                  if (categorySlug) {
                    navigate(`/sehir/${citySlug}`);
                  }
                  setShowFilters(false);
                }}
                className="w-full py-2.5 px-4 rounded-xl border border-neutral-300 dark:border-neutral-600 text-xs font-semibold text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
              >
                Filtreleri Sıfırla
              </button>
            </div>
          </aside>

          {/* Listings List / Grid (Flex-1) */}
          <div className="flex-1 w-full min-w-0">
            {loading ? (
              <div className="py-16 flex flex-col items-center justify-center">
                <LoadingSpinner size="large" />
                <p className="mt-3 text-sm text-neutral-500">{city} ilanları listeleniyor...</p>
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
              /* Empty State */
              <div className="bg-white dark:bg-neutral-800 rounded-2xl p-8 sm:p-12 text-center border border-neutral-200/80 dark:border-neutral-700/80 shadow-sm">
                <div className="w-16 h-16 bg-red-50 dark:bg-red-900/30 text-red-600 rounded-full flex items-center justify-center mx-auto text-2xl mb-4">
                  📍
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-neutral-900 dark:text-white">
                  {city} {category ? `ve ${category}` : ''} İçin Henüz İlan Bulunmuyor
                </h3>
                <p className="text-neutral-600 dark:text-neutral-400 text-sm max-w-md mx-auto mt-2 mb-6">
                  Bu kriterlerde aradığınız ilan bulunamadı. Filtreleri sıfırlayabilir veya bölgede ilk ilanı siz verebilirsiniz!
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <Link
                    to="/add-listing"
                    className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-2.5 rounded-xl shadow transition-all hover:scale-105 text-sm"
                  >
                    Hemen Ücretsiz İlan Ver
                  </Link>
                  <button
                    onClick={() => {
                      setPriceRange('all');
                      setCondition('all');
                      setSelectedDistrict('');
                      if (categorySlug) {
                        navigate(`/sehir/${citySlug}`);
                      }
                    }}
                    className="bg-neutral-100 dark:bg-neutral-700 hover:bg-neutral-200 text-neutral-700 dark:text-neutral-200 font-semibold px-5 py-2.5 rounded-xl text-sm"
                  >
                    Filtreleri Temizle
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* SEO Information & Guide Section */}
        <div className="mt-12 bg-white dark:bg-neutral-800 rounded-2xl p-6 sm:p-8 border border-neutral-200/80 dark:border-neutral-700/80 shadow-sm">
          <h2 className="text-lg sm:text-xl font-bold text-neutral-900 dark:text-white mb-3 flex items-center gap-2">
            <span>ℹ️</span>
            <span>{city} {category || 'İkinci El & Sıfır'} İlan Rehberi</span>
          </h2>
          <p className="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed mb-6">
            {seoData.introText}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-neutral-100 dark:border-neutral-700">
            <div>
              <h4 className="font-semibold text-neutral-900 dark:text-white text-sm mb-1.5 flex items-center gap-1.5">
                <span className="text-red-600">✓</span> Ücretsiz İlan Verme
              </h4>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                {city} ve çevresinde satmak veya kiralamak istediğiniz tüm ürünler için hiçbir komisyon ödemeden anında ilan açabilirsiniz.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-neutral-900 dark:text-white text-sm mb-1.5 flex items-center gap-1.5">
                <span className="text-red-600">✓</span> Yerel & Güvenli İletişim
              </h4>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                Alıcı ve satıcılarla doğrudan mesajlaşabilir, elden teslimat veya kargo seçenekleriyle güvenle ticaret yapabilirsiniz.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-neutral-900 dark:text-white text-sm mb-1.5 flex items-center gap-1.5">
                <span className="text-red-600">✓</span> Binlerce Aktif Ziyaretçi
              </h4>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                İlanlarınız hem Google arama motorlarında hem de sosyal medya gruplarında yüksek görünürlükle yayınlanır.
              </p>
            </div>
          </div>
        </div>

        {/* Other Major Cities (Internal Link Juice for SEO) */}
        <div className="mt-8 bg-neutral-100 dark:bg-neutral-800/60 rounded-2xl p-6 border border-neutral-200 dark:border-neutral-700">
          <h3 className="text-sm font-bold text-neutral-800 dark:text-neutral-200 mb-3">
            Diğer Şehirlerdeki İlanlar
          </h3>
          <div className="flex flex-wrap gap-2">
            {TOP_SEO_CITIES.map((c) => {
              const slug = cityToSlug(c);
              const isCurrent = slug === citySlug;
              const targetUrl = categorySlug ? `/sehir/${slug}/${categorySlug}` : `/sehir/${slug}`;
              return (
                <Link
                  key={slug}
                  to={targetUrl}
                  className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${
                    isCurrent
                      ? 'bg-red-600 text-white border-red-600 font-semibold'
                      : 'bg-white dark:bg-neutral-700 text-neutral-700 dark:text-neutral-200 border-neutral-200 dark:border-neutral-600 hover:border-red-500'
                  }`}
                >
                  {c} {category ? `${category}` : 'İlanları'}
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
