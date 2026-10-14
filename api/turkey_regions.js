// Türkiye'nin 7 Coğrafi Bölgesi ve İlleri
const turkeyRegions = [
  {
    name: 'Ege Bölgesi',
    shortName: 'Ege',
    slug: 'ege-bolgesi',
    alternateSlugs: ['egebölgesi', 'egebolgesi', 'ege', 'ege-bölgesi'],
    icon: '🌊',
    description: 'Ege Bölgesi genelindeki en güncel satılık ve kiralık ilanlar ExVitrin\'de! İzmir, Manisa, Aydın, Muğla, Denizli ve tüm Ege illerinden ikinci el eşya, araç, emlak ve iş fırsatları.',
    cities: ['İzmir', 'Manisa', 'Aydın', 'Denizli', 'Muğla', 'Afyonkarahisar', 'Kütahya', 'Uşak']
  },
  {
    name: 'Marmara Bölgesi',
    shortName: 'Marmara',
    slug: 'marmara-bolgesi',
    alternateSlugs: ['marmarabölgesi', 'marmarabolgesi', 'marmara', 'marmara-bölgesi'],
    icon: '🌉',
    description: 'Marmara Bölgesi genelindeki satılık ve kiralık ilanlar ExVitrin\'de! İstanbul, Bursa, Kocaeli, Balıkesir, Tekirdağ ve tüm Marmara illerinden avantajlı fırsatlar.',
    cities: ['İstanbul', 'Bursa', 'Kocaeli', 'Balıkesir', 'Tekirdağ', 'Çanakkale', 'Sakarya', 'Edirne', 'Kırklareli', 'Bilecik', 'Yalova']
  },
  {
    name: 'Akdeniz Bölgesi',
    shortName: 'Akdeniz',
    slug: 'akdeniz-bolgesi',
    alternateSlugs: ['akdenizbölgesi', 'akdenizbolgesi', 'akdeniz', 'akdeniz-bölgesi'],
    icon: '☀️',
    description: 'Akdeniz Bölgesi satılık ve kiralık ilanları ExVitrin\'de! Antalya, Adana, Mersin, Hatay ve tüm Akdeniz illerinden ev, araç, mobilya ve ikinci el ilanlar.',
    cities: ['Antalya', 'Adana', 'Mersin', 'Hatay', 'Kahramanmaraş', 'Osmaniye', 'Isparta', 'Burdur']
  },
  {
    name: 'İç Anadolu Bölgesi',
    shortName: 'İç Anadolu',
    slug: 'ic-anadolu-bolgesi',
    alternateSlugs: ['icanadolubölgesi', 'icanadolubolgesi', 'ic-anadolu', 'iç-anadolu', 'iç-anadolu-bölgesi'],
    icon: '🌾',
    description: 'İç Anadolu Bölgesi ilan pazarı ExVitrin\'de! Ankara, Konya, Kayseri, Eskişehir, Sivas ve tüm İç Anadolu illerinden sahibinden satılık ve kiralık ürünler.',
    cities: ['Ankara', 'Konya', 'Kayseri', 'Eskişehir', 'Sivas', 'Kırıkkale', 'Aksaray', 'Karaman', 'Kırşehir', 'Niğde', 'Nevşehir', 'Yozgat', 'Çankırı']
  },
  {
    name: 'Karadeniz Bölgesi',
    shortName: 'Karadeniz',
    slug: 'karadeniz-bolgesi',
    alternateSlugs: ['karadenizbölgesi', 'karadenizbolgesi', 'karadeniz', 'karadeniz-bölgesi'],
    icon: '🌲',
    description: 'Karadeniz Bölgesi ilanları ExVitrin\'de! Trabzon, Samsun, Ordu, Giresun, Rize ve tüm Karadeniz illerinden satılık ikinci el, emlak ve vasıta ilanları.',
    cities: ['Trabzon', 'Samsun', 'Ordu', 'Giresun', 'Rize', 'Artvin', 'Sinop', 'Kastamonu', 'Zonguldak', 'Bolu', 'Düzce', 'Tokat', 'Çorum', 'Amasya', 'Gümüşhane', 'Bartın', 'Karabük', 'Bayburt']
  },
  {
    name: 'Doğu Anadolu Bölgesi',
    shortName: 'Doğu Anadolu',
    slug: 'dogu-anadolu-bolgesi',
    alternateSlugs: ['doguanadolubölgesi', 'doguanadolubolgesi', 'dogu-anadolu', 'doğu-anadolu', 'doğu-anadolu-bölgesi'],
    icon: '🏔️',
    description: 'Doğu Anadolu Bölgesi satılık ve kiralık ilanlar ExVitrin\'de! Erzurum, Van, Malatya, Elazığ, Ağrı ve tüm Doğu illerinden en güncel ilanlar.',
    cities: ['Erzurum', 'Van', 'Malatya', 'Elazığ', 'Ağrı', 'Kars', 'Muş', 'Bitlis', 'Hakkari', 'Bingöl', 'Erzincan', 'Tunceli', 'Iğdır', 'Ardahan']
  },
  {
    name: 'Güneydoğu Anadolu Bölgesi',
    shortName: 'Güneydoğu Anadolu',
    slug: 'guneydogu-anadolu-bolgesi',
    alternateSlugs: ['guneydoguanadolubölgesi', 'guneydoguanadolubolgesi', 'guneydogu-anadolu', 'güneydoğu-anadolu', 'güneydoğu-anadolu-bölgesi'],
    icon: '🏛️',
    description: 'Güneydoğu Anadolu Bölgesi ilanları ExVitrin\'de! Gaziantep, Şanlıurfa, Diyarbakır, Mardin, Batman ve tüm Güneydoğu illerinden ikinci el ve sıfır ilan fırsatları.',
    cities: ['Gaziantep', 'Şanlıurfa', 'Diyarbakır', 'Mardin', 'Batman', 'Adıyaman', 'Şırnak', 'Siirt', 'Kilis']
  }
];

const normalizeRegionSlug = (slug) => {
  if (!slug) return '';
  const clean = String(slug)
    .replace(/İ/g, 'i').replace(/I/g, 'i').replace(/ı/g, 'i').toLowerCase()
    .replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's')
    .replace(/ö/g, 'o').replace(/ç/g, 'c')
    .replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
  return clean;
};

const findRegionBySlug = (slug) => {
  if (!slug) return null;
  const clean = normalizeRegionSlug(slug);
  const cleanNoDash = clean.replace(/-/g, '');

  for (const reg of turkeyRegions) {
    if (reg.slug === clean) return reg;
    const regClean = normalizeRegionSlug(reg.slug);
    if (regClean === clean || regClean.replace(/-/g, '') === cleanNoDash) return reg;
    for (const alt of reg.alternateSlugs) {
      const altClean = normalizeRegionSlug(alt);
      if (altClean === clean || altClean.replace(/-/g, '') === cleanNoDash) return reg;
    }
  }
  return null;
};


module.exports = { turkeyRegions, normalizeRegionSlug, findRegionBySlug };
