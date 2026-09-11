import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { SEO } from '../SEO';
import { Breadcrumb, HorizontalListingCard, ListingCard } from '../components';
import LoadingSpinner from '../components/LoadingSpinner';
import { 
  slugToCity, 
  cityToSlug, 
  slugToCategory, 
  categoryToSlug, 
  getCityCategorySEO, 
  getCityVariants,
  TOP_SEO_CITIES, 
  TOP_SEO_CATEGORIES 
} from '../utils/cityUtils';

export const CityCategoryLandingPage = ({ toggleFavorite, isFavorite }) => {
  const { citySlug, categorySlug, subCategorySlug } = useParams();
  const navigate = useNavigate();

  const city = useMemo(() => slugToCity(citySlug), [citySlug]);
  const category = useMemo(() => slugToCategory(categorySlug), [categorySlug]);
  const subCategory = subCategorySlug ? decodeURIComponent(subCategorySlug).replace(/-/g, ' ') : null;

  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState('horizontal'); // 'horizontal' or 'grid'

  const seoData = useMemo(() => {
    return getCityCategorySEO(city || citySlug, category, subCategory);
  }, [city, citySlug, category, subCategory]);

  useEffect(() => {
    let isMounted = true;
    const fetchListings = async () => {
      setLoading(true);
      try {
        let query = supabase
          .from('listings')
          .select('*')
          .eq('status', 'active');

        // Filter by city with all case & Turkish character variations
        const activeCity = city || citySlug;
        if (activeCity) {
          const variants = getCityVariants(activeCity);
          if (variants.length > 0) {
            const orFilter = variants.map(v => `city.ilike.%${v}%`).join(',');
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

        // Apply sorting
        if (sortBy === 'price_asc') {
          query = query.order('price', { ascending: true, nullsFirst: false });
        } else if (sortBy === 'price_desc') {
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
  }, [city, category, subCategory, sortBy]);

  // Build Breadcrumbs
  const breadcrumbs = [
    { name: 'Ana Sayfa', url: '/' },
    { name: 'Şehirler', url: '/sehirler' },
    { name: city || citySlug, url: `/sehir/${citySlug}` }
  ];
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
                <span>📍 {city || citySlug}</span>
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

        {/* Toolbar: Counter, Sorting & View Toggle */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-neutral-200 dark:border-neutral-700">
          <div className="text-sm text-neutral-600 dark:text-neutral-400">
            {loading ? (
              'İlanlar yükleniyor...'
            ) : (
              <span>
                <strong className="text-neutral-900 dark:text-white font-bold">{listings.length}</strong> ilan bulundu
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-neutral-500">Sırala:</span>
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

        {/* Listings Section */}
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
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
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
          <div className="bg-white dark:bg-neutral-800 rounded-2xl p-8 sm:p-12 text-center border border-neutral-200/80 dark:border-neutral-700/80 shadow-sm my-6">
            <div className="w-16 h-16 bg-red-50 dark:bg-red-900/30 text-red-600 rounded-full flex items-center justify-center mx-auto text-2xl mb-4">
              📍
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-neutral-900 dark:text-white">
              {city} {category ? `ve ${category}` : ''} İçin Henüz İlan Bulunmuyor
            </h3>
            <p className="text-neutral-600 dark:text-neutral-400 text-sm max-w-md mx-auto mt-2 mb-6">
              Bu bölgede ve kategoride ilk ilanı siz verin, arayan binlerce kişiye anında ulaşın!
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link
                to="/add-listing"
                className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-2.5 rounded-xl shadow transition-all hover:scale-105 text-sm"
              >
                Hemen Ücretsiz İlan Ver
              </Link>
              <Link
                to={`/sehir/${citySlug}`}
                className="bg-neutral-100 dark:bg-neutral-700 hover:bg-neutral-200 text-neutral-700 dark:text-neutral-200 font-semibold px-5 py-2.5 rounded-xl text-sm"
              >
                {city}'deki Tüm İlanlara Bak
              </Link>
            </div>
          </div>
        )}

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
