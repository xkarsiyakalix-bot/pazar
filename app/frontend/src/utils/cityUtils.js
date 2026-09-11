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
 * Returns unique SEO meta and description text tailored to a city and category
 */
export const getCityCategorySEO = (city, category = null, subCategory = null) => {
  if (city && category && subCategory) {
    return {
      title: `${city} ${subCategory} İlanları - Satılık & Kiralık | ExVitrin`,
      description: `${city} ${subCategory} ilanları ExVitrin'de! Sahibinden ve kurumsal satıcılardan ${city} genelinde en uygun ${subCategory.toLowerCase()} fırsatlarını keşfedin.`,
      heading: `${city} ${subCategory} İlanları`,
      subheading: `${city} ve tüm ilçelerindeki güncel ${subCategory.toLowerCase()} ilanlarını inceleyin, satıcılarla ücretsiz iletişime geçin.`,
      introText: `${city} şehrinde ${subCategory.toLowerCase()} arayanlar için en güncel ve doğrulanmış ilanlar ExVitrin'de listelenmektedir. ${city} bölgesindeki fırsatları filtreleyebilir veya hemen ücretsiz ilan vererek ürünlerinizi binlerce alıcıyla buluşturabilirsiniz.`
    };
  }

  if (city && category) {
    return {
      title: `${city} ${category} İlanları - Satılık & Kiralık | ExVitrin`,
      description: `${city} ${category} ilanları ExVitrin'de! ${city} genelinde satılık ve kiralık ${category.toLowerCase()} ürünleri, uygun fiyatlar ve güvenli alışveriş.`,
      heading: `${city} ${category} İlanları`,
      subheading: `${city} bölgesindeki en güncel ${category.toLowerCase()} ilanlarını keşfedin veya ücretsiz ilan verin.`,
      introText: `${city} ilinde ${category.toLowerCase()} kategorisindeki binlerce fırsatı tek tıkla inceleyin. Sahibinden veya kurumsal satıcılardan ${city} içi elden teslim veya kargo seçenekleriyle aradığınız ürünü kolayca bulun.`
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
