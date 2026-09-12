const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn('Warning: Supabase URL or Key is missing in environment variables. Skipping sitemap generation.');
  process.exit(0);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const SITE_URL = 'https://exvitrin.com'; // Değiştirebilirsiniz

async function generateSitemap() {
  console.log('Generating sitemap...');
  try {
    // 1. Fetch all active listings
    console.log('Fetching listings...');
    let listings = [];
    try {
      const { data, error } = await supabase
        .from('listings')
        .select('id, slug, updated_at')
        .eq('status', 'active');
      if (error) console.warn('⚠️ Could not fetch listings for sitemap:', error.message);
      else listings = data || [];
    } catch (e) {
      console.warn('⚠️ Network error fetching listings:', e.message);
    }

    // 2. Fetch all profiles (sellers)
    console.log('Fetching profiles...');
    let profiles = [];
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, user_number, store_slug, updated_at');
      if (error) console.warn('⚠️ Could not fetch profiles for sitemap:', error.message);
      else profiles = data || [];
    } catch (e) {
      console.warn('⚠️ Network error fetching profiles:', e.message);
    }

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
      { path: '/emlak', priority: '0.9' },
      { path: '/elektronik', priority: '0.9' },
      { path: '/ev-bahce', priority: '0.9' },
      { path: '/moda-guzellik', priority: '0.9' },
      { path: '/evcil-hayvanlar', priority: '0.8' },
      { path: '/aile-cocuk-bebek', priority: '0.8' },
      { path: '/is-ilanlari', priority: '0.8' },
      { path: '/eglence-hobi-mahalle', priority: '0.8' },
      { path: '/muzik-film-kitap', priority: '0.7' },
      { path: '/biletler', priority: '0.7' },
      { path: '/hizmetler', priority: '0.8' },
      { path: '/ucretsiz-takas', priority: '0.7' },
      { path: '/egitim-kurslar', priority: '0.7' },
      { path: '/otomobil-bisiklet-tekne', priority: '0.9' },
      { path: '/komsu-yardimi', priority: '0.6' },
      // Emlak alt kategorileri
      { path: '/emlak/kiralik-daireler', priority: '0.9' },
      { path: '/emlak/satilik-daireler', priority: '0.9' },
      { path: '/emlak/satilik-evler', priority: '0.9' },
      { path: '/emlak/kiralik-evler', priority: '0.9' },
      { path: '/emlak/ticari-emlak', priority: '0.8' },
      { path: '/emlak/arsa-bahce', priority: '0.8' },
      { path: '/emlak/yeni-projeler', priority: '0.8' },
      { path: '/emlak/tatil-evi-yurt-disi-emlak', priority: '0.7' },
      { path: '/emlak/garaj-otopark', priority: '0.7' },
      { path: '/emlak/diger-emlak', priority: '0.6' },
      // Elektronik alt kategorileri
      { path: '/elektronik/cep-telefonu-telefon', priority: '0.9' },
      { path: '/elektronik/bilgisayarlar', priority: '0.8' },
      { path: '/elektronik/dizustu-bilgisayarlar', priority: '0.8' },
      { path: '/elektronik/tabletler-e-okuyucular', priority: '0.8' },
      { path: '/elektronik/tv-video', priority: '0.8' },
      { path: '/elektronik/fotograf-kamera', priority: '0.7' },
      { path: '/elektronik/konsollar', priority: '0.7' },
      { path: '/elektronik/video-oyunlari', priority: '0.7' },
      { path: '/elektronik/ev-aletleri', priority: '0.7' },
      // Ev & Bahçe alt kategorileri
      { path: '/ev-bahce/bahce-malzemeleri-bitkiler', priority: '0.7' },
      { path: '/ev-bahce/ev-hizmetleri', priority: '0.8' },
      { path: '/ev-bahce/oturma-odasi', priority: '0.7' },
      { path: '/ev-bahce/yatak-odasi', priority: '0.7' },
      { path: '/ev-bahce/mutfak-yemek-odasi', priority: '0.7' },
      { path: '/ev-bahce/dekorasyon', priority: '0.7' },
      { path: '/ev-bahce/ev-tekstili', priority: '0.7' },
      { path: '/ev-bahce/ev-tadilati', priority: '0.7' },
      // Hizmetler alt kategorileri
      { path: '/hizmetler/temizlik-hizmetleri', priority: '0.8' },
      { path: '/hizmetler/tadilat-tamir', priority: '0.8' },
      { path: '/hizmetler/tesisat', priority: '0.7' },
      { path: '/hizmetler/elektrik', priority: '0.7' },
      { path: '/hizmetler/tasimacilik-nakliye', priority: '0.8' },
      // Araç alt kategorileri
      { path: '/otomobil-bisiklet-tekne/otomobiller', priority: '0.9' },
      { path: '/otomobil-bisiklet-tekne/motosiklet-scooter', priority: '0.8' },
      { path: '/otomobil-bisiklet-tekne/bisiklet-aksesuarlar', priority: '0.7' },
      { path: '/otomobil-bisiklet-tekne/oto-parca-lastik', priority: '0.7' },
    ];

    const urls = [];
    const seenUrls = new Set();

    const addUrl = (urlPath, changefreq, priority, lastmod = null) => {
      const normalizedPath = (urlPath || '').toLowerCase().replace(/\/+$/, '');
      const fullUrl = `${SITE_URL}${normalizedPath}`;
      if (seenUrls.has(fullUrl)) return;
      seenUrls.add(fullUrl);
      urls.push(`
  <url>
    <loc>${fullUrl}</loc>${lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : ''}
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`);
    };

    // Static Routes
    staticRoutes.forEach(route => {
      addUrl(route, 'daily', route === '' ? '1.0' : '0.8');
    });

    // Category Routes
    categoryRoutes.forEach(route => {
      addUrl(route.path, 'daily', route.priority);
    });

    // City & Category Landing Pages (SEO Priority)
    const topCities = [
      'istanbul', 'ankara', 'izmir', 'bursa', 'antalya', 
      'adana', 'konya', 'gaziantep', 'sanliurfa', 'kocaeli', 
      'mersin', 'diyarbakir', 'hatay', 'manisa', 'kayseri'
    ];

    const topCategories = [
      'emlak', 'otomobil', 'elektronik', 'ev-bahce', 
      'moda-guzellik', 'is-ilanlari', 'aile-cocuk-bebek', 
      'evcil-hayvanlar', 'hizmetler', 'ucretsiz-takas'
    ];

    // Hub page
    addUrl('/sehirler', 'daily', '0.8');

    // City & City+Category pages
    topCities.forEach(city => {
      addUrl(`/sehir/${city}`, 'daily', '0.8');
      topCategories.forEach(cat => {
        addUrl(`/sehir/${city}/${cat}`, 'daily', '0.8');
      });
    });

    // Listings
    if (listings) {
      listings.forEach(listing => {
        const lastMod = listing.updated_at ? new Date(listing.updated_at).toISOString() : new Date().toISOString();
        const listingPath = listing.slug ? `/${listing.slug}` : `/product/${listing.id}`;
        addUrl(listingPath, 'weekly', '0.9', lastMod);
      });
    }

    // Seller Profiles
    if (profiles) {
      profiles.forEach(profile => {
        const lastMod = profile.updated_at ? new Date(profile.updated_at).toISOString() : new Date().toISOString();
        const sellerPath = profile.store_slug
          ? `/${profile.store_slug}`
          : (profile.user_number ? `/seller/${profile.user_number}` : `/seller/${profile.id}`);
        addUrl(sellerPath, 'weekly', '0.7', lastMod);
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
