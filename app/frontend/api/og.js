const { createClient } = require('@supabase/supabase-js');

module.exports = async (req, res) => {
  const { id, type } = req.query;
  
  // Basic fallback URL
  const fallbackUrl = 'https://exvitrin.com';
  
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

  let title = 'ExVitrin - Ücretsiz İlanlar';
  let description = "Türkiye'nin en büyük ilan pazaryeri.";
  let image = 'https://exvitrin.com/logo_exvitrin_2026_cropped.png';
  let url = `${fallbackUrl}/${type}/${id}`;

  try {
    if (type === 'seller') {
      const { data, error } = await supabase
        .from('profiles')
        .select('full_name, store_logo, avatar_url, bio')
        .eq('id', id)
        .single();
        
      if (!error && data) {
        const name = data.full_name || "Satıcı";
        title = `${name} Profili ve İlanları | ExVitrin`;
        
        const cleanBio = data.bio ? data.bio.replace(/(<([^>]+)>)/gi, "") : "";
        description = cleanBio ? cleanBio.substring(0, 160) : `${name} kullanıcısının ExVitrin'deki güncel ilanlarını inceleyin.`;
        image = data.store_logo || data.avatar_url || image;
      }
    } else {
      // Type is listing
      const { data, error } = await supabase
        .from('listings')
        .select('title, description, images, price')
        .eq('id', id)
        .single();
        
      if (!error && data) {
        let priceText = "";
        if (data.price) {
          priceText = " - " + new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(data.price);
        }
        
        title = `${data.title}${priceText} | ExVitrin`;
        
        const cleanDesc = data.description ? data.description.replace(/(<([^>]+)>)/gi, "") : "";
        description = cleanDesc ? cleanDesc.substring(0, 160) : "ExVitrin'de ilan detayları.";
        image = (data.images && data.images.length > 0) ? data.images[0] : image;
      }
    }
  } catch (err) {
    console.error('Error fetching data for Vercel OG:', err);
  }

  // Construct a minimal HTML page purely for bots (WhatsApp, Facebook, etc.)
  const html = `
    <!DOCTYPE html>
    <html lang="tr">
    <head>
      <meta charset="UTF-8">
      <title>${title.replace(/"/g, '&quot;')}</title>
      
      <meta property="og:title" content="${title.replace(/"/g, '&quot;')}" />
      <meta property="og:description" content="${description.replace(/"/g, '&quot;')}" />
      <meta property="og:image" content="${image}" />
      <meta property="og:url" content="${url}" />
      <meta property="og:type" content="${type === 'seller' ? 'profile' : 'article'}" />
      <meta property="og:site_name" content="ExVitrin" />
      
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="${title.replace(/"/g, '&quot;')}" />
      <meta name="twitter:description" content="${description.replace(/"/g, '&quot;')}" />
      <meta name="twitter:image" content="${image}" />
    </head>
    <body>
      <p>${description}</p>
      <!-- Bot should have already read the meta tags above -->
    </body>
    </html>
  `;

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  // Cache the response at Vercel Edge network for 1 hour
  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');
  res.status(200).send(html);
};
