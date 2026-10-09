import { getTurkishCities } from '../translations';

export const TURKISH_CITIES = getTurkishCities();

// Top 15 cities with highest search volume & population for SEO priority
export const TOP_SEO_CITIES = [
  'İstanbul',
  'Ankara',
  'İzmir',
  'Bursa',
  'Antalya',
  'Adana',
  'Konya',
  'Gaziantep',
  'Şanlıurfa',
  'Kocaeli',
  'Mersin',
  'Diyarbakır',
  'Hatay',
  'Manisa',
  'Kayseri'
];

// Top categories for landing page generation
export const TOP_SEO_CATEGORIES = [
  { slug: 'emlak', name: 'Emlak', icon: '🏠' },
  { slug: 'otomobil', name: 'Otomobil, Bisiklet & Tekne', icon: '🚗' },
  { slug: 'elektronik', name: 'Elektronik', icon: '📱' },
  { slug: 'ev-bahce', name: 'Ev & Bahçe', icon: '🛋️' },
  { slug: 'moda-guzellik', name: 'Moda & Güzellik', icon: '👗' },
  { slug: 'is-ilanlari', name: 'İş İlanları', icon: '💼' },
  { slug: 'aile-cocuk-bebek', name: 'Aile, Çocuk & Bebek', icon: '👶' },
  { slug: 'evcil-hayvanlar', name: 'Evcil Hayvanlar', icon: '🐾' },
  { slug: 'hizmetler', name: 'Hizmetler', icon: '🔧' },
  { slug: 'ucretsiz-takas', name: 'Ücretsiz & Takas', icon: '🎁' }
];

export const cityToSlug = (cityName) => {
  if (!cityName) return '';
  return String(cityName)
    .replace(/İ/g, 'i')
    .replace(/I/g, 'i')
    .replace(/ı/g, 'i')
    .toLowerCase()
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
};

const slugCityMap = {};
TURKISH_CITIES.forEach((c) => {
  slugCityMap[cityToSlug(c)] = c;
});

export const slugToCity = (citySlug) => {
  if (!citySlug) return null;
  const clean = citySlug.toLowerCase().trim();
  return slugCityMap[clean] || null;
};

/**
 * Returns all possible text/case/ASCII variants for a Turkish city
 * to guarantee robust SQL / ILIKE matching in PostgreSQL
 */
export const getCityVariants = (cityName) => {
  if (!cityName) return [];
  const raw = String(cityName).trim();
  const variants = new Set();
  variants.add(raw);
  variants.add(raw.toLowerCase());
  variants.add(raw.toUpperCase());

  // ASCII / Normalized
  const ascii = raw
    .replace(/İ/g, 'I')
    .replace(/ı/g, 'i')
    .replace(/ğ/g, 'g')
    .replace(/Ğ/g, 'G')
    .replace(/ü/g, 'u')
    .replace(/Ü/g, 'U')
    .replace(/ş/g, 's')
    .replace(/Ş/g, 'S')
    .replace(/ö/g, 'o')
    .replace(/Ö/g, 'O')
    .replace(/ç/g, 'c')
    .replace(/Ç/g, 'C');

  variants.add(ascii);
  variants.add(ascii.toLowerCase());
  variants.add(ascii.toUpperCase());

  try {
    variants.add(raw.toLocaleLowerCase('tr-TR'));
    variants.add(raw.toLocaleUpperCase('tr-TR'));
  } catch (e) {}

  return Array.from(variants).filter(Boolean);
};

export const categoryToSlug = (categoryName) => {
  if (!categoryName) return '';
  const match = TOP_SEO_CATEGORIES.find(
    (c) => c.name.toLowerCase() === categoryName.toLowerCase()
  );
  if (match) return match.slug;
  return cityToSlug(categoryName);
};

export const slugToCategory = (slug) => {
  if (!slug) return null;
  const clean = slug.toLowerCase().trim();
  const directMap = {
    'emlak': 'Emlak',
    'otomobil': 'Otomobil, Bisiklet & Tekne',
    'vasita': 'Otomobil, Bisiklet & Tekne',
    'otomobil-bisiklet-tekne': 'Otomobil, Bisiklet & Tekne',
    'elektronik': 'Elektronik',
    'ev-bahce': 'Ev & Bahçe',
    'moda-guzellik': 'Moda & Güzellik',
    'is-ilanlari': 'İş İlanları',
    'aile-cocuk-bebek': 'Aile, Çocuk & Bebek',
    'evcil-hayvanlar': 'Evcil Hayvanlar',
    'hizmetler': 'Hizmetler',
    'ucretsiz-takas': 'Ücretsiz & Takas',
    'eglence-hobi-mahalle': 'Eğlence, Hobi & Mahalle',
    'muzik-film-kitap': 'Müzik, Film & Kitap',
    'biletler': 'Biletler',
    'egitim-kurslar': 'Eğitim & Kurslar',
    'komsu-yardimi': 'Komşu Yardımı'
  };
  return directMap[clean] || null;
};

/**
 * Returns unique SEO meta and description text tailored to a city, district, and category
 */
export const getCityCategorySEO = (city, category = null, subCategory = null, district = null) => {
  const locationLabel = district ? `${city} ${district}` : city;

  if (locationLabel && category && subCategory) {
    return {
      title: `${locationLabel} ${subCategory} İlanları - Satılık & Kiralık | ExVitrin`,
      description: `${locationLabel} ${subCategory} ilanları ExVitrin'de! Sahibinden ve kurumsal satıcılardan ${locationLabel} genelinde en uygun ${subCategory.toLowerCase()} fırsatlarını keşfedin.`,
      heading: `${locationLabel} ${subCategory} İlanları`,
      subheading: `${locationLabel} güncel ${subCategory.toLowerCase()} ilanlarını inceleyin, satıcılarla ücretsiz iletişime geçin.`,
      introText: `${locationLabel} bölgesinde ${subCategory.toLowerCase()} arayanlar için en güncel ve doğrulanmış ilanlar ExVitrin'de listelenmektedir. ${locationLabel} bölgesindeki fırsatları filtreleyebilir veya hemen ücretsiz ilan vererek ürünlerinizi binlerce alıcıyla buluşturabilirsiniz.`
    };
  }

  if (locationLabel && category) {
    return {
      title: `${locationLabel} ${category} İlanları - Satılık & Kiralık | ExVitrin`,
      description: `${locationLabel} ${category} ilanları ExVitrin'de! ${locationLabel} genelinde satılık ve kiralık ${category.toLowerCase()} ürünleri, uygun fiyatlar ve güvenli alışveriş.`,
      heading: `${locationLabel} ${category} İlanları`,
      subheading: `${locationLabel} bölgesindeki en güncel ${category.toLowerCase()} ilanlarını keşfedin veya ücretsiz ilan verin.`,
      introText: `${locationLabel} bölgesinde ${category.toLowerCase()} kategorisindeki binlerce fırsatı tek tıkla inceleyin. Sahibinden veya kurumsal satıcılardan ${locationLabel} içi elden teslim veya kargo seçenekleriyle aradığınız ürünü kolayca bulun.`
    };
  }

  if (district && city) {
    return {
      title: `${city} ${district} İkinci El ve Sıfır İlanlar | ExVitrin`,
      description: `${city} ${district} satılık ve kiralık ilanlar ExVitrin'de! ${district} bölgesindeki tüm ikinci el eşya, araba, emlak ve ücretsiz ilanlar.`,
      heading: `${city} ${district} İlanları`,
      subheading: `${city} ili ${district} ilçesindeki tüm güncel ilanları keşfedin veya ücretsiz ilan verin.`,
      introText: `${city} ili ${district} ilçesinde kullanmadığınız eşyaları nakite çevirmek ya da uygun fiyatlı ikinci el ürünler bulmak çok kolay. ExVitrin ${district} ilan pazarında komisyonsuz ve ücretsiz ilan verin.`
    };
  }

  if (city) {
    return {
      title: `${city} İkinci El ve Sıfır İlanlar - Alım & Satım | ExVitrin`,
      description: `${city} ikinci el ve sıfır ilanlar ExVitrin'de! ${city} genelinde araba, emlak, telefon, mobilya, giyim ve binlerce ücretsiz ilan fırsatı.`,
      heading: `${city} İlanları`,
      subheading: `${city} ve ilçelerindeki tüm güncel ikinci el, sıfır, emlak ve vasıta ilanları tek adreste.`,
      introText: `${city} şehrinde kullanmadığınız eşyaları nakite çevirmek ya da uygun fiyatlı ikinci el ürünler bulmak çok kolay. ExVitrin ${city} ilan pazarında komisyonsuz ve ücretsiz ilan verin.`
    };
  }

  return {
    title: 'Şehirlere Göre İlanlar | ExVitrin',
    description: "Türkiye'nin 81 ilinden satılık ve kiralık ikinci el, araba, emlak ve iş ilanları ExVitrin'de!",
    heading: 'Şehirlere Göre İlanlar',
    subheading: 'Aradığınız şehri seçerek bölgenizdeki en güncel ilanları keşfedin.',
    introText: "Türkiye'nin tüm şehirlerinden ikinci el eşya, araç, emlak ve daha fazlası ExVitrin'de bir araya geliyor."
  };
};
