import React from 'react';
import { Link } from 'react-router-dom';
import { SEO } from '../SEO';
import { Breadcrumb } from '../components';
import { TURKISH_CITIES, cityToSlug, TOP_SEO_CITIES, TOP_SEO_CATEGORIES } from '../utils/cityUtils';
import { turkeyRegions } from '../data/turkey_regions';

export const AllCitiesPage = () => {
  const breadcrumbs = [
    { name: 'Ana Sayfa', url: '/' },
    { name: 'Şehirler ve Bölgeler', url: '/sehirler' }
  ];

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 pb-16">
      <SEO
        title="Türkiye Şehir ve Bölge İlanları - 7 Bölge & 81 İl | ExVitrin"
        description="Türkiye'nin 7 coğrafi bölgesi (Ege, Marmara, Akdeniz, İç Anadolu vb.) ve 81 ilinden satılık ve kiralık emlak, araba, elektronik ilanları ExVitrin'de!"
        url="/sehirler"
        breadcrumbs={breadcrumbs}
      />

      <div className="bg-gradient-to-r from-red-600 to-red-800 text-white py-10 px-4 sm:px-6 lg:px-8 shadow-md">
        <div className="max-w-7xl mx-auto">
          <div className="mb-4 text-white/80 text-xs sm:text-sm">
            <Breadcrumb items={breadcrumbs} light />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Türkiye Şehir & Bölge İlan Rehberi
          </h1>
          <p className="mt-2 text-white/90 text-sm sm:text-base max-w-3xl">
            Aradığınız bölgeyi veya şehri seçerek yerel satılık ve kiralık güncel ilanları görüntüleyin.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {/* 7 Coğrafi Bölge */}
        <div className="bg-white dark:bg-neutral-800 p-6 rounded-2xl shadow-sm border border-neutral-200/80 dark:border-neutral-700/80 mb-8">
          <h2 className="text-base font-bold text-neutral-900 dark:text-white mb-2 flex items-center gap-2">
            <span>🗺️</span>
            <span>Türkiye'nin 7 Coğrafi Bölgesi İlanları</span>
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-4">
            Bölgenizi seçerek o bölgedeki tüm illerin ilanlarını tek sayfada listeleyin:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {turkeyRegions.map((reg) => (
              <Link
                key={reg.slug}
                to={`/bolge/${reg.slug}`}
                className="flex items-center justify-between p-3.5 rounded-xl bg-neutral-50 dark:bg-neutral-700/40 border border-neutral-200 dark:border-neutral-700 hover:border-red-500 hover:bg-red-50/50 dark:hover:bg-red-950/20 transition-all group"
              >
                <div>
                  <div className="font-bold text-neutral-900 dark:text-neutral-100 text-sm group-hover:text-red-600 flex items-center gap-2">
                    <span>{reg.icon}</span>
                    <span>{reg.name}</span>
                  </div>
                  <div className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5">
                    {reg.cities.length} İl ({reg.cities.slice(0, 3).join(', ')}...)
                  </div>
                </div>
                <span className="text-xs text-red-500 font-bold group-hover:translate-x-0.5 transition-transform">&rarr;</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Popular Cities */}
        <div className="bg-white dark:bg-neutral-800 p-6 rounded-2xl shadow-sm border border-neutral-200/80 dark:border-neutral-700/80 mb-8">
          <h2 className="text-base font-bold text-neutral-900 dark:text-white mb-4 flex items-center gap-2">
            <span>⭐</span>
            <span>En Çok İlan Verilen Büyükşehirler</span>
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {TOP_SEO_CITIES.map((city) => (
              <Link
                key={city}
                to={`/sehir/${cityToSlug(city)}`}
                className="flex items-center justify-between p-3 rounded-xl bg-red-50/50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 hover:border-red-500 hover:bg-red-50 transition-all group"
              >
                <span className="font-semibold text-neutral-800 dark:text-neutral-100 text-sm group-hover:text-red-600">
                  {city}
                </span>
                <span className="text-xs text-red-500 font-bold">&rarr;</span>
              </Link>
            ))}
          </div>
        </div>

        {/* All 81 Cities Grid */}
        <div className="bg-white dark:bg-neutral-800 p-6 sm:p-8 rounded-2xl shadow-sm border border-neutral-200/80 dark:border-neutral-700/80">
          <h2 className="text-base font-bold text-neutral-900 dark:text-white mb-6">
            Tüm İller (A'dan Z'ye 81 İl)
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
            {TURKISH_CITIES.slice().sort((a, b) => a.localeCompare(b, 'tr')).map((city) => (
              <Link
                key={city}
                to={`/sehir/${cityToSlug(city)}`}
                className="p-2.5 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:border-red-500 hover:bg-neutral-50 dark:hover:bg-neutral-700/50 text-xs font-medium text-neutral-700 dark:text-neutral-300 transition-colors"
              >
                📍 {city}
              </Link>
            ))}
          </div>
        </div>

        {/* Category Spotlight */}
        <div className="mt-8 bg-white dark:bg-neutral-800 p-6 rounded-2xl shadow-sm border border-neutral-200/80 dark:border-neutral-700/80">
          <h2 className="text-base font-bold text-neutral-900 dark:text-white mb-4">
            Popüler Kategorilere Göz Atın
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {TOP_SEO_CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                to={`/sehir/istanbul/${cat.slug}`}
                className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-700/50 border border-neutral-200 dark:border-neutral-700 hover:border-red-500 transition-all text-center"
              >
                <div className="text-2xl mb-1">{cat.icon}</div>
                <div className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">
                  {cat.name}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllCitiesPage;
