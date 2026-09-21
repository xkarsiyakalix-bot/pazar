const { createClient } = require('@supabase/supabase-js');

const SITE_URL = 'https://www.exvitrin.com';

// 85 statik marka slug'ları
const STATIC_BRAND_SLUGS = [
  'bmw','mercedes-benz','audi','volkswagen','ford','opel','renault','fiat',
  'toyota','honda','hyundai','peugeot','seat','skoda','volvo','nissan',
  'porsche','tesla','citroen','dacia','alfa-romeo','kia','mazda','mini',
  'suzuki','yamaha','nike','adidas','puma','zara','hm','mango','lc-waikiki',
  'koton','mavi','defacto','tommy-hilfiger','calvin-klein','lacoste',
  'ralph-lauren','hugo-boss','levis','vans','converse','new-balance',
  'under-armour','skechers','columbia','the-north-face','gucci','prada',
  'chanel','louis-vuitton','apple','samsung','xiaomi','huawei','sony','lg',
  'philips','asus','lenovo','dell','hp','acer','msi','monster','casper',
  'canon','nikon','microsoft','nintendo','jbl','dyson','bosch','siemens',
  'arcelik','beko','vestel','profilo','tefal','karaca','korkmaz','ikea',
  'istikbal','bellona','enza-home'
];

// Statik sayfalar
const STATIC_PAGES = [
  { loc: '/', priority: '1.0', changefreq: 'daily' },
  { loc: '/hakkimizda', priority: '0.8', changefreq: 'monthly' },
  { loc: '/iletisim', priority: '0.8', changefreq: 'monthly' },
  { loc: '/sehirler', priority: '0.8', changefreq: 'weekly' },
  { loc: '/categories', priority: '0.8', changefreq: 'weekly' },
  { loc: '/gizlilik-politikasi', priority: '0.5', changefreq: 'monthly' },
  { loc: '/cerez-politikasi', priority: '0.5', changefreq: 'monthly' },
  { loc: '/yasal-uyarilar', priority: '0.5', changefreq: 'monthly' },
  // Kategoriler
  { loc: '/Otomobil', priority: '0.9', changefreq: 'daily' },
  { loc: '/Emlak', priority: '0.9', changefreq: 'daily' },
  { loc: '/Elektronik', priority: '0.9', changefreq: 'daily' },
  { loc: '/Moda-Guzellik', priority: '0.9', changefreq: 'daily' },
  { loc: '/Ev-Bahce', priority: '0.9', changefreq: 'daily' },
  { loc: '/Spor-Outdoor', priority: '0.9', changefreq: 'daily' },
  { loc: '/Hobi-Koleksiyon', priority: '0.9', changefreq: 'daily' },
  { loc: '/Motosiklet', priority: '0.9', changefreq: 'daily' },
  { loc: '/Is-Dunyasi', priority: '0.8', changefreq: 'daily' },
];

function slugifyBrand(text) {
  if (!text || typeof text !== 'string') return '';
  return text
    .toLowerCase()
    .trim()
    .replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's')
    .replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

module.exports = async (req, res) => {
  const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://wwzeqleaekdugsnknbbl.supabase.co';
  const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind3emVxbGVhZWtkdWdzbmtuYmJsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzgwNzU5MDUsImV4cCI6MjA1MzY1MTkwNX0.P6NMHxFtUIKVRFieFvMZS7jSuPuEFrLNJqr5gpIGvlA';
  const supabase = createClient(supabaseUrl, supabaseKey);

  const now = new Date().toISOString();

  try {
    // Tüm marka kolonlarından benzersiz değerleri çek
    const brandColumns = [
      'marke', 'car_brand', 'damenbekleidung_marke',
      'damenschuhe_marke', 'herrenbekleidung_marke', 'herrenschuhe_marke'
    ];

    const customBrandSlugs = new Set(STATIC_BRAND_SLUGS);

    for (const col of brandColumns) {
      const { data } = await supabase
        .from('listings')
        .select(col)
        .not(col, 'is', null)
        .neq(col, '')
        .neq(col, 'Diğer')
        .neq(col, 'Digeri')
        .neq(col, 'Other');

      if (data) {
        data.forEach(row => {
          const val = row[col];
          if (val && typeof val === 'string' && val.trim().length > 1) {
            const slug = slugifyBrand(val.trim());
            if (slug && slug.length > 1) {
              customBrandSlugs.add(slug);
            }
          }
        });
      }
    }

    // Aktif ilanları da çek (ilan detay sayfaları için)
    const { data: listings } = await supabase
      .from('listings')
      .select('slug, updated_at')
      .eq('status', 'active')
      .not('slug', 'is', null)
      .order('updated_at', { ascending: false })
      .limit(5000);

    // XML oluştur
    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">

`;

    // Statik sayfalar
    for (const page of STATIC_PAGES) {
      xml += `  <url>
    <loc>${SITE_URL}${page.loc}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>
`;
    }

    // Marka sayfaları (statik + dinamik custom)
    for (const slug of customBrandSlugs) {
      xml += `  <url>
    <loc>${SITE_URL}/${slug}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
`;
    }

    // İlan detay sayfaları
    if (listings) {
      for (const listing of listings) {
        if (listing.slug) {
          const lastmod = listing.updated_at ? new Date(listing.updated_at).toISOString() : now;
          xml += `  <url>
    <loc>${SITE_URL}/${listing.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
`;
        }
      }
    }

    xml += `</urlset>`;

    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate'); // 1 saat cache
    res.status(200).send(xml);

  } catch (err) {
    console.error('Sitemap error:', err);
    res.status(500).send('<?xml version="1.0"?><error>Sitemap generation failed</error>');
  }
};
