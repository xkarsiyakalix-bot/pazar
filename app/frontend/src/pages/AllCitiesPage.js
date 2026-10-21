import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { SEO } from '../SEO';
import { Breadcrumb } from '../components';
import { TURKISH_CITIES, cityToSlug, TOP_SEO_CITIES, TOP_SEO_CATEGORIES } from '../utils/cityUtils';
import { turkeyRegions } from '../data/turkey_regions';

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

export const AllCitiesPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegionFilter, setSelectedRegionFilter] = useState('ALL');

  const breadcrumbs = [
    { label: 'Ana Sayfa', path: '/' },
    { label: 'Şehirler ve Bölgeler', path: '/sehirler', isActive: true }
  ];

  // A'dan Z'ye sıralı şehir listesi
  const sortedCities = useMemo(() => {
    return TURKISH_CITIES.slice().sort((a, b) => a.localeCompare(b, 'tr'));
  }, []);

  // Şehir -> Bölge haritası
  const cityRegionMap = useMemo(() => {
    const map = {};
    turkeyRegions.forEach(reg => {
      reg.cities.forEach(city => {
        map[city] = reg.slug;
      });
    });
    return map;
  }, []);

  // Filtrelenmiş şehirler (arama + bölge filtresi)
  const filteredCities = useMemo(() => {
    return sortedCities.filter(city => {
      const matchesSearch = city.toLocaleLowerCase('tr').includes(searchQuery.trim().toLocaleLowerCase('tr'));
      const matchesRegion = selectedRegionFilter === 'ALL' || cityRegionMap[city] === selectedRegionFilter;
      return matchesSearch && matchesRegion;
    });
  }, [sortedCities, searchQuery, selectedRegionFilter, cityRegionMap]);

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 transition-colors">
      <SEO
        title="Türkiye Şehir ve Bölge İlan Rehberi (81 İl & 7 Bölge)"
        description="Türkiye'nin 7 coğrafi bölgesi ve 81 ilinden satılık ve kiralık emlak, vasıta, ikinci el ve iş ilanları ExVitrin'de."
        url="/sehirler"
      />

      {/* Breadcrumb Section */}
      <div className="max-w-[1400px] mx-auto px-4 pt-4 sm:pt-6">
        <Breadcrumb items={breadcrumbs} />
      </div>

      {/* Hero Header - Editorial & Sleek */}
      <header className="max-w-[1400px] mx-auto px-4 pt-4 pb-8 sm:pb-12 border-b border-neutral-100 dark:border-neutral-800/80">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-neutral-100 dark:bg-neutral-900 text-[11px] font-medium text-neutral-600 dark:text-neutral-400 tracking-wide uppercase mb-3 border border-neutral-200/60 dark:border-neutral-800">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
              Türkiye Yerel İlan Rehberi
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-neutral-950 dark:text-white">
              Şehirler ve Coğrafi Bölgeler
            </h1>
            <p className="mt-2 text-sm sm:text-base text-neutral-500 dark:text-neutral-400 leading-relaxed font-normal">
              81 il ve 7 coğrafi bölgeye göre ayrılmış güncel ilan vitrinleri. İlgilendiğiniz şehri veya bölgeyi seçerek yerel ilanları keşfedin.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-6 sm:gap-8 pt-2 md:pt-0 shrink-0">
            <div>
              <p className="text-2xl sm:text-3xl font-semibold tracking-tight text-neutral-950 dark:text-white leading-none">81</p>
              <p className="text-[11px] text-neutral-400 dark:text-neutral-500 uppercase tracking-wider font-medium mt-1">İl Vitrini</p>
            </div>
            <div className="w-px h-8 bg-neutral-200 dark:bg-neutral-800" />
            <div>
              <p className="text-2xl sm:text-3xl font-semibold tracking-tight text-neutral-950 dark:text-white leading-none">7</p>
              <p className="text-[11px] text-neutral-400 dark:text-neutral-500 uppercase tracking-wider font-medium mt-1">Bölge</p>
            </div>
            <div className="w-px h-8 bg-neutral-200 dark:bg-neutral-800" />
            <div>
              <p className="text-2xl sm:text-3xl font-semibold tracking-tight text-neutral-950 dark:text-white leading-none">973</p>
              <p className="text-[11px] text-neutral-400 dark:text-neutral-500 uppercase tracking-wider font-medium mt-1">İlçe</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[1400px] mx-auto px-4 py-8 sm:py-12 space-y-12 sm:space-y-16">
        
        {/* 1. SECTION: En Çok İlan Verilen Büyükşehirler */}
        <section aria-labelledby="popular-cities-heading">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 id="popular-cities-heading" className="text-base sm:text-lg font-semibold tracking-tight text-neutral-950 dark:text-white">
                Öne Çıkan Büyükşehirler
              </h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                En yüksek ilan yoğunluğuna ve ticari hacme sahip metropoller
              </p>
            </div>
            <span className="text-[11px] font-medium text-neutral-400 dark:text-neutral-500 hidden sm:inline">
              15 Popüler İl
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5 sm:gap-3">
            {TOP_SEO_CITIES.map((city) => {
              const plate = PLATE_CODES[city] || '';
              return (
                <Link
                  key={city}
                  to={`/sehir/${cityToSlug(city)}`}
                  className="group relative flex items-center justify-between p-3 sm:p-3.5 rounded-lg border border-neutral-200/80 dark:border-neutral-800/80 bg-white dark:bg-neutral-900/60 hover:border-neutral-900 dark:hover:border-neutral-200 hover:shadow-xs transition-all duration-150"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="w-6 h-6 rounded flex items-center justify-center text-[10px] font-mono font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 group-hover:bg-neutral-900 group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-neutral-900 transition-colors shrink-0">
                      {plate}
                    </span>
                    <span className="text-sm font-medium text-neutral-800 dark:text-neutral-200 truncate group-hover:text-neutral-950 dark:group-hover:text-white">
                      {city}
                    </span>
                  </div>
                  <svg className="w-3.5 h-3.5 text-neutral-300 dark:text-neutral-600 group-hover:text-neutral-900 dark:group-hover:text-white group-hover:translate-x-0.5 transition-all shrink-0 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              );
            })}
          </div>
        </section>

        {/* 2. SECTION: 7 Coğrafi Bölge Vitrini */}
        <section aria-labelledby="regions-heading">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 id="regions-heading" className="text-base sm:text-lg font-semibold tracking-tight text-neutral-950 dark:text-white">
                Coğrafi Bölgelere Göre İlanlar
              </h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                Bölgesel pazar yerlerini inceleyerek çevre illerdeki ilanları toplu listeleyin
              </p>
            </div>
            <span className="text-[11px] font-medium text-neutral-400 dark:text-neutral-500 hidden sm:inline">
              7 Bölge
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {turkeyRegions.map((reg) => (
              <Link
                key={reg.slug}
                to={`/bolge/${reg.slug}`}
                className="group flex flex-col justify-between p-4 rounded-lg border border-neutral-200/80 dark:border-neutral-800/80 bg-white dark:bg-neutral-900/60 hover:border-neutral-900 dark:hover:border-neutral-200 hover:shadow-xs transition-all duration-150"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-lg leading-none shrink-0" aria-hidden="true">{reg.icon}</span>
                      <h3 className="font-medium text-sm text-neutral-900 dark:text-neutral-100 group-hover:text-neutral-950 dark:group-hover:text-white truncate">
                        {reg.name}
                      </h3>
                    </div>
                    <span className="text-[11px] font-mono font-medium text-neutral-400 dark:text-neutral-500 shrink-0">
                      {reg.cities.length} İl
                    </span>
                  </div>

                  <p className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-2 leading-relaxed">
                    {reg.cities.slice(0, 4).join(', ')} ve diğer {reg.cities.length - 4} il
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800/70 flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400 group-hover:text-neutral-950 dark:group-hover:text-white font-medium">
                  <span>Bölge İlanlarına Git</span>
                  <svg className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* 3. SECTION: 81 İl - Detaylı ve Filtrelenebilir A'dan Z'ye Fihrist */}
        <section aria-labelledby="all-cities-heading">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-5 pb-4 border-b border-neutral-200/80 dark:border-neutral-800/80">
            <div>
              <h2 id="all-cities-heading" className="text-base sm:text-lg font-semibold tracking-tight text-neutral-950 dark:text-white">
                Tüm İller Fihristi (81 İl)
              </h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                Aradığınız şehri doğrudan aratın veya bölgeye göre süzün
              </p>
            </div>

            {/* Arama Inputu */}
            <div className="relative w-full md:w-64">
              <input
                type="text"
                placeholder="Şehir ara (örn: İzmir)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-md py-2 pl-8 pr-3 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-900 dark:focus:border-neutral-200 transition-colors"
              />
              <svg className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z" />
              </svg>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 text-xs"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Bölge Filtre Sekmeleri (Pills) */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-3 mb-4 scrollbar-none text-xs">
            <button
              onClick={() => setSelectedRegionFilter('ALL')}
              className={`px-3 py-1.5 rounded-md whitespace-nowrap font-medium transition-colors cursor-pointer ${
                selectedRegionFilter === 'ALL'
                  ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900'
                  : 'bg-neutral-100 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-800'
              }`}
            >
              Tümü (81 İl)
            </button>
            {turkeyRegions.map((reg) => (
              <button
                key={reg.slug}
                onClick={() => setSelectedRegionFilter(reg.slug)}
                className={`px-3 py-1.5 rounded-md whitespace-nowrap font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                  selectedRegionFilter === reg.slug
                    ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900'
                    : 'bg-neutral-100 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-800'
                }`}
              >
                <span>{reg.icon}</span>
                <span>{reg.shortName}</span>
              </button>
            ))}
          </div>

          {/* İller Izgarası */}
          {filteredCities.length === 0 ? (
            <div className="py-12 text-center rounded-lg border border-dashed border-neutral-200 dark:border-neutral-800">
              <p className="text-xs text-neutral-400">"{searchQuery}" aramasına uygun il bulunamadı.</p>
              <button
                onClick={() => { setSearchQuery(''); setSelectedRegionFilter('ALL'); }}
                className="mt-2 text-xs font-medium text-neutral-900 dark:text-white underline cursor-pointer"
              >
                Filtreleri Temizle
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-2.5">
              {filteredCities.map((city) => {
                const plate = PLATE_CODES[city] || '';
                return (
                  <Link
                    key={city}
                    to={`/sehir/${cityToSlug(city)}`}
                    className="group flex items-center gap-2 p-2 sm:p-2.5 rounded-md border border-neutral-200/70 dark:border-neutral-800/80 bg-white dark:bg-neutral-900/40 hover:border-neutral-900 dark:hover:border-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-all"
                  >
                    <span className="text-[10px] font-mono font-medium text-neutral-400 dark:text-neutral-500 w-5 shrink-0">
                      {plate}
                    </span>
                    <span className="text-xs font-medium text-neutral-700 dark:text-neutral-300 group-hover:text-neutral-950 dark:group-hover:text-white truncate">
                      {city}
                    </span>
                  </Link>
                );
              })}
            </div>
          )}
        </section>

        {/* 4. SECTION: Popüler Kategoriler */}
        <section aria-labelledby="categories-heading" className="pt-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 id="categories-heading" className="text-base sm:text-lg font-semibold tracking-tight text-neutral-950 dark:text-white">
                Popüler İlan Kategorileri
              </h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                Konumunuzdan bağımsız olarak öne çıkan ana pazar bölümleri
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5 sm:gap-3">
            {TOP_SEO_CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                to={`/sehir/istanbul/${cat.slug}`}
                className="group flex items-center gap-3 p-3 rounded-lg border border-neutral-200/80 dark:border-neutral-800/80 bg-white dark:bg-neutral-900/60 hover:border-neutral-900 dark:hover:border-neutral-200 transition-all duration-150"
              >
                <span className="text-xl shrink-0 group-hover:scale-105 transition-transform" aria-hidden="true">
                  {cat.icon}
                </span>
                <div className="min-w-0">
                  <span className="text-xs font-medium text-neutral-800 dark:text-neutral-200 group-hover:text-neutral-950 dark:group-hover:text-white truncate block">
                    {cat.name}
                  </span>
                  <span className="text-[10px] text-neutral-400 dark:text-neutral-500">
                    İlanları Gör
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

      </main>
    </div>
  );
};

export default AllCitiesPage;
