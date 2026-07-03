const { createClient } = require('@supabase/supabase-js');

const SITE_URL = 'https://www.exvitrin.com';
const LOGO_URL = `${SITE_URL}/logo_exvitrin_2026_small.png`;

module.exports = async (req, res) => {
  const { id, type } = req.query;

  if (!id) {
    return res.status(400).send('Missing ID');
  }

  const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
  const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error('Supabase credentials missing in Vercel environment variables.');
    return res.status(500).send('Server configuration error');
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  // Defaults (homepage-style)
  let title = 'ExVitrin - Ücretsiz İlanlar';
  let description = "Türkiye'nin en büyük ilan pazaryeri. Araba, emlak, elektronik ve daha fazlasını bulun.";
  let image = LOGO_URL;
  let imageWidth = '1200';
  let imageHeight = '630';
  let ogType = 'website';
  let url = `${SITE_URL}/${type}/${id}`;

  try {
    if (type === 'seller') {
      const { data, error } = await supabase
        .from('profiles')
        .select('full_name, store_logo, avatar_url, bio, user_number')
        .eq('id', id)
        .single();

      if (!error && data) {
        const name = data.full_name || 'Satıcı';
        title = `${name} | ExVitrin`;
        const cleanBio = data.bio ? data.bio.replace(/<[^>]+>/g, '') : '';
        description = cleanBio
          ? cleanBio.substring(0, 160)
          : `${name} kullanıcısının ExVitrin'deki güncel ilanlarını inceleyin.`;
        image = data.store_logo || data.avatar_url || LOGO_URL;
        imageWidth = '400';
        imageHeight = '400';
        ogType = 'profile';
        url = `${SITE_URL}/seller/${data.user_number || id}`;
      }
    } else {
      // listing
      const { data, error } = await supabase
        .from('listings')
        .select('title, description, images, price, category, sub_category, condition, city')
        .eq('id', id)
        .single();

      if (!error && data) {
        // Build a rich title with price
        let priceText = '';
        if (data.price && data.price > 0) {
          priceText = ' - ' + new Intl.NumberFormat('tr-TR', {
            style: 'currency',
            currency: 'TRY',
            maximumFractionDigits: 0
          }).format(data.price);
        } else if (data.price === 0) {
          priceText = ' - Ücretsiz';
        }

        title = `${data.title}${priceText} | ExVitrin`;

        // Build a rich description
        const cleanDesc = data.description
          ? data.description.replace(/<[^>]+>/g, '').trim()
          : '';

        const parts = [];
        if (data.category) parts.push(data.category);
        if (data.condition) parts.push(data.condition);
        if (data.city) parts.push(data.city);

        const metaPrefix = parts.length > 0 ? parts.join(' • ') + ' | ' : '';
        const descBody = cleanDesc || 'ExVitrin\'de ilanı inceleyin.';
        description = (metaPrefix + descBody).substring(0, 160);

        // Use first listing image; fallback to logo
        image = (data.images && data.images.length > 0) ? data.images[0] : LOGO_URL;
        imageWidth = '1200';
        imageHeight = '630';
        ogType = 'product';
        url = `${SITE_URL}/product/${id}`;
      }
    }
  } catch (err) {
    console.error('Error fetching data for OG tags:', err);
  }

  // Escape HTML entities to prevent XSS / broken HTML
  const esc = (str) => String(str)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  const html = `<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <title>${esc(title)}</title>

  <!-- Primary Meta -->
  <meta name="description" content="${esc(description)}" />

  <!-- Open Graph (Facebook, WhatsApp, LinkedIn, Telegram) -->
  <meta property="og:type" content="${esc(ogType)}" />
  <meta property="og:site_name" content="ExVitrin" />
  <meta property="og:url" content="${esc(url)}" />
  <meta property="og:title" content="${esc(title)}" />
  <meta property="og:description" content="${esc(description)}" />
  <meta property="og:image" content="${esc(image)}" />
  <meta property="og:image:width" content="${imageWidth}" />
  <meta property="og:image:height" content="${imageHeight}" />
  <meta property="og:locale" content="tr_TR" />

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:site" content="@exvitrin" />
  <meta name="twitter:url" content="${esc(url)}" />
  <meta name="twitter:title" content="${esc(title)}" />
  <meta name="twitter:description" content="${esc(description)}" />
  <meta name="twitter:image" content="${esc(image)}" />

  <!-- Redirect real users (non-bots) to the actual React page -->
  <meta http-equiv="refresh" content="0; url=${esc(url)}" />
  <link rel="canonical" href="${esc(url)}" />
</head>
<body>
  <p>${esc(description)}</p>
  <a href="${esc(url)}">İlanı Görüntüle</a>
</body>
</html>`;

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  // Cache for 1 hour at the edge, background revalidation for freshness
  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400');
  res.status(200).send(html);
};
