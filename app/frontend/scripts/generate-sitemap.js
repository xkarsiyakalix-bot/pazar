require('dotenv').config({ path: '../.env' });
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Initialize Supabase client
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: Supabase URL or Key is missing in environment variables.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const SITE_URL = 'https://exvitrin.com'; // Değiştirebilirsiniz

async function generateSitemap() {
  console.log('Generating sitemap...');
  try {
    // 1. Fetch all active listings
    console.log('Fetching listings...');
    const { data: listings, error: listingsError } = await supabase
      .from('listings')
      .select('id, updated_at')
      .eq('status', 'active');
      
    if (listingsError) throw listingsError;

    // 2. Fetch all profiles (sellers)
    console.log('Fetching profiles...');
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id, updated_at');
      
    if (profilesError) throw profilesError;

    // 3. Define static routes
    const staticRoutes = [
      '',
      '/search',
      '/kategoriler',
      '/about',
      '/contact'
    ];

    // 4. Category pages (ana kategoriler)
    const categoryRoutes = [
      // Ana kategoriler
      { path: '/Emlak', priority: '0.9' },
      { path: '/Elektronik', priority: '0.9' },
      { path: '/Ev-Bahce', priority: '0.9' },
      { path: '/Moda-Guzellik', priority: '0.9' },
      { path: '/Evcil-Hayvanlar', priority: '0.8' },
      { path: '/Aile-Cocuk-Bebek', priority: '0.8' },
      { path: '/Is-Ilanlari', priority: '0.8' },
      { path: '/Eglence-Hobi-Mahalle', priority: '0.8' },
      { path: '/Muzik-Film-Kitap', priority: '0.7' },
      { path: '/Biletler', priority: '0.7' },
      { path: '/Hizmetler', priority: '0.8' },
      { path: '/Ucretsiz-Takas', priority: '0.7' },
      { path: '/Egitim-Kurslar', priority: '0.7' },
      { path: '/Otomobil-Bisiklet-Tekne', priority: '0.9' },
      { path: '/Komsu-Yardimi', priority: '0.6' },
      // Emlak alt kategorileri
      { path: '/Emlak/Kiralik-Daireler', priority: '0.9' },
      { path: '/Emlak/Satilik-Daireler', priority: '0.9' },
      { path: '/Emlak/Satilik-Evler', priority: '0.9' },
      { path: '/Emlak/Kiralik-Evler', priority: '0.9' },
      { path: '/Emlak/Ticari-Emlak', priority: '0.8' },
      { path: '/emlak/ticari-emlak', priority: '0.8' },
      { path: '/Emlak/Arsa-Bahce', priority: '0.8' },
      { path: '/Emlak/Yeni-Projeler', priority: '0.8' },
      { path: '/Emlak/Tatil-Evi-Yurt-Disi-Emlak', priority: '0.7' },
      { path: '/Emlak/Garaj-Otopark', priority: '0.7' },
      { path: '/Emlak/Diger-Emlak', priority: '0.6' },
      // Elektronik alt kategorileri
      { path: '/elektronik', priority: '0.9' },
      { path: '/Elektronik/Cep-Telefonu-Telefon', priority: '0.9' },
      { path: '/Elektronik/Bilgisayarlar', priority: '0.8' },
      { path: '/Elektronik/Dizustu-Bilgisayarlar', priority: '0.8' },
      { path: '/Elektronik/Tabletler-E-Okuyucular', priority: '0.8' },
      { path: '/Elektronik/TV-Video', priority: '0.8' },
      { path: '/Elektronik/Fotograf-Kamera', priority: '0.7' },
      { path: '/Elektronik/Konsollar', priority: '0.7' },
      { path: '/Elektronik/Video-Oyunlari', priority: '0.7' },
      { path: '/Elektronik/Ev-Aletleri', priority: '0.7' },
      // Ev & Bahçe alt kategorileri
      { path: '/Ev-Bahce/Bahce-Malzemeleri-Bitkiler', priority: '0.7' },
      { path: '/Ev-Bahce/Ev-Hizmetleri', priority: '0.8' },
      { path: '/Ev-Bahce/Oturma-Odasi', priority: '0.7' },
      { path: '/Ev-Bahce/Yatak-Odasi', priority: '0.7' },
      { path: '/Ev-Bahce/Mutfak-Yemek-Odasi', priority: '0.7' },
      { path: '/Ev-Bahce/Dekorasyon', priority: '0.7' },
      { path: '/Ev-Bahce/Ev-Tekstili', priority: '0.7' },
      { path: '/Ev-Bahce/Ev-Tadilati', priority: '0.7' },
      // Hizmetler alt kategorileri
      { path: '/Hizmetler/Temizlik-Hizmetleri', priority: '0.8' },
      { path: '/Hizmetler/Tadilat-Tamir', priority: '0.8' },
      { path: '/Hizmetler/Tesisat', priority: '0.7' },
      { path: '/Hizmetler/Elektrik', priority: '0.7' },
      { path: '/Hizmetler/Tasimacilik-Nakliye', priority: '0.8' },
      // Araç alt kategorileri
      { path: '/Otomobil-Bisiklet-Tekne/Otomobiller', priority: '0.9' },
      { path: '/Otomobil-Bisiklet-Tekne/Motosiklet-Scooter', priority: '0.8' },
      { path: '/Otomobil-Bisiklet-Tekne/Bisiklet-Aksesuarlar', priority: '0.7' },
      { path: '/Otomobil-Bisiklet-Tekne/Oto-Parca-Lastik', priority: '0.7' },
    ];

    const urls = [];

    // Static Routes
    staticRoutes.forEach(route => {
      urls.push(`
  <url>
    <loc>${SITE_URL}${route}</loc>
    <changefreq>daily</changefreq>
    <priority>${route === '' ? '1.0' : '0.8'}</priority>
  </url>`);
    });

    // Category Routes
    categoryRoutes.forEach(route => {
      urls.push(`
  <url>
    <loc>${SITE_URL}${route.path}</loc>
    <changefreq>daily</changefreq>
    <priority>${route.priority}</priority>
  </url>`);
    });

    // Listings
    if (listings) {
      listings.forEach(listing => {
        const lastMod = listing.updated_at ? new Date(listing.updated_at).toISOString() : new Date().toISOString();
        urls.push(`
  <url>
    <loc>${SITE_URL}/product/${listing.id}</loc>
    <lastmod>${lastMod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>`);
      });
    }

    // Seller Profiles
    if (profiles) {
      profiles.forEach(profile => {
        const lastMod = profile.updated_at ? new Date(profile.updated_at).toISOString() : new Date().toISOString();
        urls.push(`
  <url>
    <loc>${SITE_URL}/seller/${profile.id}</loc>
    <lastmod>${lastMod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`);
      });
    }

    const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('')}
</urlset>`;

    // 5. Write to public/sitemap.xml
    const publicPath = path.join(__dirname, '..', 'public', 'sitemap.xml');
    fs.writeFileSync(publicPath, sitemapXml, 'utf8');
    
    console.log(`✅ Sitemap successfully generated with ${urls.length} URLs at ${publicPath}`);

  } catch (error) {
    console.error('❌ Error generating sitemap:', error);
  }
}

generateSitemap();
