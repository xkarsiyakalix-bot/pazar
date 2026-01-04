// Sitemap Generator for Kleinbazaar

export const generateSitemap = (listings = [], categories = []) => {
    const baseUrl = 'https://kleinbazaar.de';
    const currentDate = new Date().toISOString().split('T')[0];

    const staticPages = [
        { url: '/', priority: '1.0', changefreq: 'daily' },
        { url: '/Alle-Kategorien', priority: '0.9', changefreq: 'daily' },
        { url: '/Auto-Rad-Boot', priority: '0.8', changefreq: 'daily' },
        { url: '/Immobilien', priority: '0.8', changefreq: 'daily' },
        { url: '/Elektronik', priority: '0.8', changefreq: 'daily' },
        { url: '/Mode-Beauty', priority: '0.8', changefreq: 'daily' },
        { url: '/Haus-Garten', priority: '0.8', changefreq: 'daily' },
        { url: '/Familie-Kind-Baby', priority: '0.8', changefreq: 'daily' },
        { url: '/Jobs', priority: '0.8', changefreq: 'daily' },
        { url: '/Freizeit-Hobby-Nachbarschaft', priority: '0.8', changefreq: 'daily' },
        { url: '/Musik-Filme-Bucher', priority: '0.8', changefreq: 'daily' },
        { url: '/Dienstleistungen', priority: '0.8', changefreq: 'daily' },
        { url: '/Unterricht-Kurse', priority: '0.8', changefreq: 'daily' },
        { url: '/messages', priority: '0.6', changefreq: 'weekly' },
        { url: '/favorites', priority: '0.6', changefreq: 'weekly' },
        { url: '/notifications', priority: '0.5', changefreq: 'monthly' },
        { url: '/uber-uns', priority: '0.5', changefreq: 'monthly' },
        { url: '/karriere', priority: '0.5', changefreq: 'monthly' },
        { url: '/presse', priority: '0.5', changefreq: 'monthly' },
        { url: '/mobile-apps', priority: '0.5', changefreq: 'monthly' }
    ];

    // Generate product URLs
    const productUrls = listings.slice(0, 500).map(listing => ({
        url: `/product/${listing.id}`,
        priority: '0.7',
        changefreq: 'weekly',
        lastmod: listing.date || currentDate
    }));

    // Combine all URLs
    const allUrls = [...staticPages, ...productUrls];

    // Generate XML
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${allUrls.map(page => `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${page.lastmod || currentDate}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

    return xml;
};

// Generate robots.txt
export const generateRobotsTxt = () => {
    const baseUrl = 'https://kleinbazaar.de';

    return `# Kleinbazaar Robots.txt
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/
Disallow: /checkout
Disallow: /messages
Disallow: /favorites

# Sitemap
Sitemap: ${baseUrl}/sitemap.xml

# Crawl-delay
Crawl-delay: 1

# Google
User-agent: Googlebot
Allow: /

# Bing
User-agent: Bingbot
Allow: /

# Yandex
User-agent: Yandex
Allow: /
`;
};

// Save sitemap to public folder
export const saveSitemap = (listings) => {
    const sitemap = generateSitemap(listings);
    const blob = new Blob([sitemap], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'sitemap.xml';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    console.log('✅ Sitemap generated and downloaded!');
};

// Save robots.txt
export const saveRobotsTxt = () => {
    const robotsTxt = generateRobotsTxt();
    const blob = new Blob([robotsTxt], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'robots.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    console.log('✅ Robots.txt generated and downloaded!');
};

export default generateSitemap;
