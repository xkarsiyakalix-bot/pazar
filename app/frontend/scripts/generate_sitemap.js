const fs = require('fs');
const path = require('path');

// This script generates a dynamic sitemap based on categoryConfigs.js
// Run with: node scripts/generate_sitemap.js

const categoryConfigs = {
    'vasita': { name: 'Vasıta', subcategories: ['otomobiller', 'oto-parca-lastik', 'tekne-tekne-malzemeleri', 'bisiklet-aksesuarlar', 'motosiklet-scooter', 'motosiklet-parca-aksesuarlar', 'ticari-araclar-romorklar', 'tamir-servis', 'karavan-motokaravan'] },
    'emlak': { name: 'Emlak', subcategories: ['gecici-konaklama-paylasimli-ev', 'konteyner', 'satilik-daireler', 'satilik-yazlik', 'tatil-evi-yurt-disi-emlak', 'garaj-otopark', 'ticari-emlak', 'arsa-bahce', 'satilik-evler', 'kiralik-evler', 'kiralik-daireler', 'yeni-projeler', 'tasimacilik-nakliye'] },
    'ev-bahce': { name: 'Ev & Bahçe', subcategories: ['banyo', 'ofis', 'dekorasyon', 'ev-hizmetleri', 'bahce-malzemeleri-bitkiler', 'ev-tekstili', 'ev-tadilati', 'mutfak-yemek-odasi', 'lamba-aydinlatma', 'yatak-odasi', 'oturma-odasi'] },
    'moda-guzellik': { name: 'Moda & Güzellik', subcategories: ['guzellik-saglik', 'kadin-giyimi', 'kadin-ayakkabilari', 'erkek-giyimi', 'erkek-ayakkabilari', 'canta-aksesuarlar', 'saat-taki'] },
    'elektronik': { name: 'Elektronik', subcategories: ['ses-hifi', 'elektronik-hizmetler', 'fotograf-kamera', 'cep-telefonu-telefon', 'ev-aletleri', 'konsollar', 'dizustu-bilgisayarlar', 'bilgisayarlar', 'bilgisayar-aksesuarlari-yazilim', 'tabletler-e-okuyucular', 'tv-video', 'video-oyunlari'] },
    'evcil-hayvanlar': { name: 'Evcil Hayvanlar', subcategories: ['baliklar', 'kopekler', 'kediler', 'kucuk-hayvanlar', 'ciftlik-hayvanlari', 'atlar', 'hayvan-bakimi-egitimi', 'kayip-hayvanlar', 'kuslar', 'aksesuarlar'] },
    'aile-cocuk-bebek': { name: 'Aile, Çocuk & Bebek', subcategories: ['yasli-bakimi', 'bebek-cocuk-giyimi', 'bebek-cocuk-ayakkabilari', 'bebek-ekipmanlari', 'oto-koltuklari', 'babysitter-cocuk-bakimi', 'bebek-arabalari-pusetler', 'cocuk-odasi-mobilyalari', 'oyuncaklar'] },
    'is-ilanlari': { name: 'İş İlanları', subcategories: ['mesleki-egitim', 'insaat-sanat-uretim', 'buroarbeit-yonetim', 'gastronomi-turizm', 'musteri-hizmetleri-cagri-merkezi', 'ek-isler', 'staj', 'sosyal-sektor-bakim', 'tasimacilik-lojistik', 'satis-pazarlama'] },
    'eglence-hobi-mahalle': { name: 'Eğlence, Hobi & Mahalle', subcategories: ['ezoterizm-spiritualizm', 'yiyecek-icecek', 'bos-zaman-aktiviteleri', 'el-sanatlari-hobi', 'sanat-antikalar', 'sanatcilar-muzisyenler', 'model-yapimi', 'seyahat-etkinlik-hizmetleri', 'koleksiyon', 'spor-kamp', 'bit-pazari', 'kayip-buluntu'] },
    'muzik-film-kitap': { name: 'Müzik, Film & Kitap', subcategories: ['kitap-dergi', 'kirtasiye', 'cizgi-romanlar', 'ders-kitaplari-okul-egitim', 'film-dvd', 'muzik-cdler', 'muzik-enstrumanlari'] },
    'biletler': { name: 'Biletler', subcategories: ['tren-toplu-tasima', 'komedi-kabare', 'hediye-kartlari', 'cocuk', 'konserler', 'spor', 'tiyatro-muzikal'] },
    'hizmetler': { name: 'Hizmetler', subcategories: ['yasli-bakimi', 'vasita', 'babysitter-cocuk-bakimi', 'elektronik', 'ev-hizmetleri', 'sanatcilar-muzisyenler', 'seyahat-etkinlik', 'hayvan-bakimi-egitimi', 'tasimacilik-nakliye'] },
    'ucretsiz-takas': { name: 'Ücretsiz & Takas', subcategories: ['takas', 'kiralama', 'ucretsiz'] },
    'egitim-kurslar': { name: 'Eğitim & Kurslar', subcategories: ['bilgisayar-kurslari', 'ezoterizm-spiritualizm', 'yemek-pastacilik-kurslari', 'sanat-design-kurslari', 'muzik-san-dersleri', 'ozel-ders', 'spor-kurslari', 'dil-kurslari', 'dans-kurslari', 'surekli-egitim'] },
    'komsu-yardimi': { name: 'Komşu Yardımı', subcategories: ['komsu-yardimi'] }
};

const BASE_URL = 'https://www.exvitrin.com';
const STATIC_PAGES = [
    '',
    '/login',
    '/register',
    '/hakkimizda',
    '/iletisim',
    '/yasal-uyarilar',
    '/cerez-politikasi',
    '/categories',
    '/packages'
];

const generateSitemap = () => {
    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

    // Add static pages
    STATIC_PAGES.forEach(page => {
        xml += `
  <url>
    <loc>${BASE_URL}${page}</loc>
    <changefreq>weekly</changefreq>
    <priority>${page === '' ? '1.0' : '0.8'}</priority>
  </url>`;
    });

    // Add categories and subcategories
    Object.keys(categoryConfigs).forEach(catSlug => {
        // Main Category
        xml += `
  <url>
    <loc>${BASE_URL}/${catSlug}</loc>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>`;

        // Subcategories
        categoryConfigs[catSlug].subcategories.forEach(subSlug => {
            xml += `
  <url>
    <loc>${BASE_URL}/${catSlug}/${subSlug}</loc>
    <changefreq>daily</changefreq>
    <priority>0.7</priority>
  </url>`;
        });
    });

    xml += '\n</urlset>';

    const outputPath = path.join(__dirname, '../public/sitemap.xml');
    fs.writeFileSync(outputPath, xml);
    console.log(`Sitemap successfully generated at ${outputPath}`);
};

generateSitemap();
