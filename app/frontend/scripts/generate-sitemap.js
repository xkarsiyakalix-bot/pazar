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

    // 4. Generate XML content
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

    // Listings
    if (listings) {
      listings.forEach(listing => {
        const lastMod = listing.updated_at ? new Date(listing.updated_at).toISOString() : new Date().toISOString();
        urls.push(`
  <url>
    <loc>${SITE_URL}/listing/${listing.id}</loc>
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
